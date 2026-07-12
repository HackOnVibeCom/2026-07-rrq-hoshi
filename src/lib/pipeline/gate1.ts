/**
 * gate1.ts
 * Gate 1: Relevance & Sentiment Classifier
 * Determines if a post is a genuine complaint about a competitor.
 * Uses free OpenRouter models with fallback chain.
 * Cost: $0 — always free.
 */
import { callWithFallback } from '@/lib/llm-client'

// Gate 1 model chain — Nvidia Nemotron primary (no Llama, no DeepSeek)
const GATE1_PRIMARY = process.env.GATE1_MODEL_PRIMARY ?? 'nvidia/nemotron-3-super-120b-a12b:free'
const GATE1_FALLBACKS = (
  process.env.GATE1_MODEL_FALLBACK ??
  'nvidia/nemotron-3.5-content-safety:free,nvidia/nemotron-3-nano-30b-a3b:free,nvidia/nemotron-nano-12b-v2-vl:free,poolside/laguna-m.1:free,poolside/laguna-xs-2.1:free,cohere/north-mini-code:free,openai/gpt-oss-20b:free,cognitivecomputations/dolphin-mistral-24b-venice-edition:free'
).split(',').map((m) => m.trim()).filter(Boolean)

const GATE1_MODELS = [GATE1_PRIMARY, ...GATE1_FALLBACKS]

export interface Gate1Result {
  passed: boolean
  model_used: string
  latency_ms: number
}

/**
 * Classify a social media post as a relevant competitor complaint or not.
 */
export async function runGate1(
  rawContent: string,
  competitorName: string,
  timeoutMs = 120_000
): Promise<Gate1Result> {
  // Optimized system prompt for Nvidia Nemotron models - strictly demands only "true" or "false" without explanations
  const systemPrompt = `You are a social media complaint classifier. You MUST output ONLY "true" or "false". Do not include any preamble, intro, or explanation. Just return the word.`

  // User prompt
  const userPrompt = `Classify this post. Target competitor: "${competitorName}"
Post: "${rawContent.slice(0, 500)}"
Reply with ONLY "true" or "false".`

  try {
    const result = await callWithFallback({
      systemPrompt,
      userPrompt,
      models: GATE1_MODELS,
      provider: 'openrouter',
      perModelTimeoutMs: 15_000, // 15s per model is optimal for free tier OpenRouter latency
      maxTokens: 100,     // Allow buffer for preambles or router headers, regex will handle
      temperature: 0,     // deterministic — no creativity needed
    })

    // Parse the response — handle various LLM formatting quirks robustly
    const raw = result.content.toLowerCase().trim()
    const passed = /\b(true|yes|1)\b/i.test(raw) && !/\b(false|no|0)\b/i.test(raw)

    return {
      passed,
      model_used: result.model_used,
      latency_ms: result.latency_ms,
    }
  } catch (err) {
    console.warn('[gate1] OpenRouter models failed, trying DeepSeek fallback:', err)
    
    // Fallback to DeepSeek Chat
    try {
      const startDS = Date.now()
      const result = await callWithFallback({
        systemPrompt,
        userPrompt,
        models: ['deepseek-chat'],
        provider: 'deepseek',
        perModelTimeoutMs: 15_000,
        maxTokens: 100,
        temperature: 0,
      })

      const raw = result.content.toLowerCase().trim()
      const passed = /\b(true|yes|1)\b/i.test(raw) && !/\b(false|no|0)\b/i.test(raw)

      return {
        passed,
        model_used: result.model_used,
        latency_ms: Date.now() - startDS,
      }
    } catch (dsErr) {
      console.error('[gate1] Both OpenRouter and DeepSeek failed:', dsErr)
      // On complete failure, default to false (conservative — don't charge user for bad data)
      return {
        passed: false,
        model_used: 'error',
        latency_ms: 0,
      }
    }
  }
}

