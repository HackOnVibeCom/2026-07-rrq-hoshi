/**
 * llm-client.ts
 * Provider-agnostic LLM wrapper with fallback chain.
 * Supports OpenRouter (Gate 1 free models) and DeepSeek (Gate 2 primary).
 */

export interface LLMResponse {
  content: string
  model_used: string
  latency_ms: number
}

export interface LLMCallOptions {
  systemPrompt: string
  userPrompt: string
  models: string[]                   // ordered fallback list
  provider: 'openrouter' | 'deepseek'
  perModelTimeoutMs?: number         // default: 30s
  maxTokens?: number                 // default: 150
  temperature?: number               // default: 0.3
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'

/**
 * Call an LLM with a fallback chain.
 * Tries each model in order until one succeeds or all fail.
 */
export async function callWithFallback(opts: LLMCallOptions): Promise<LLMResponse> {
  const {
    systemPrompt,
    userPrompt,
    models,
    provider,
    perModelTimeoutMs = 30_000,
    maxTokens = 150,
    temperature = 0.3,
  } = opts

  const apiKey =
    provider === 'deepseek'
      ? process.env.DEEPSEEK_API_KEY
      : process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error(`Missing API key for provider: ${provider}`)
  }

  let lastError: Error | null = null

  for (const model of models) {
    const startTime = Date.now()
    const isDeepSeek = provider === 'deepseek'
    const baseUrl = isDeepSeek ? DEEPSEEK_BASE_URL : OPENROUTER_BASE_URL
    const url = `${baseUrl}/chat/completions`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }

    // OpenRouter requires these headers for rate limit tracking
    if (!isDeepSeek) {
      headers['HTTP-Referer'] = process.env.NEXT_PUBLIC_APP_URL ?? 'https://undercut.app'
      headers['X-Title'] = 'Undercut - Competitor FUD Interceptor'
    }

    const body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      // For Gate 1: deterministic output preferred
      ...(maxTokens <= 10 ? { temperature: 0 } : {}),
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), perModelTimeoutMs)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'unknown')
        console.warn(`[llm] Model ${model} returned ${response.status}: ${errorText.slice(0, 200)}`)
        lastError = new Error(`HTTP ${response.status}: ${errorText.slice(0, 100)}`)
        // Rate limited → try next model
        if (response.status === 429 || response.status === 503) continue
        // Other server errors → try next model
        continue
      }

      const data = await response.json()
      const content = data?.choices?.[0]?.message?.content?.trim()

      if (!content) {
        console.warn(`[llm] Model ${model} returned empty content`)
        lastError = new Error('Empty content from model')
        continue
      }

      const latency_ms = Date.now() - startTime
      console.log(`[llm] Model ${model} succeeded in ${latency_ms}ms`)

      return {
        content,
        model_used: model,
        latency_ms,
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      if (errMsg.includes('abort') || errMsg.includes('timeout')) {
        console.warn(`[llm] Model ${model} timed out after ${perModelTimeoutMs}ms`)
      } else {
        console.warn(`[llm] Model ${model} threw: ${errMsg}`)
      }
      lastError = err instanceof Error ? err : new Error(errMsg)
      // Continue to next model
    }
  }

  throw new Error(
    `All LLM models failed. Last error: ${lastError?.message ?? 'unknown'}`
  )
}
