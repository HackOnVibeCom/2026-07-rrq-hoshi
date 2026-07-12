/**
 * gate2.ts
 * Gate 2: Contextual Promotional Reply Generator
 * Generates a personalized, empathetic reply promoting the user's app.
 * Primary: DeepSeek V4 Flash (deepseek-chat). Fallback: OpenRouter free models.
 * Cost: $0.10 per successful reply (charged via consume_cycle_credit).
 */
import { callWithFallback } from '@/lib/llm-client'
import type { Profile } from '@/lib/types'

// Gate 2 model configuration
const GATE2_PRIMARY = process.env.GATE2_MODEL ?? 'deepseek-chat'
const GATE2_FALLBACKS = (
  process.env.GATE2_MODEL_FALLBACK ??
  'nvidia/nemotron-3-super-120b-a12b:free,qwen/qwen3-next-80b-a3b-instruct:free,openai/gpt-oss-120b:free,qwen/qwen3-coder:free,poolside/laguna-xs-2.1:free,cohere/north-mini-code:free,nvidia/nemotron-3-nano-30b-a3b:free,openai/gpt-oss-20b:free'
).split(',').map((m) => m.trim()).filter(Boolean)

// Primary DeepSeek uses deepseek provider, fallbacks use openrouter
const GATE2_PRIMARY_PROVIDER = 'deepseek'
const GATE2_FALLBACK_MODELS = GATE2_FALLBACKS

const CHAR_LIMITS: Record<string, number> = {
  X: 262,        // 280 max, leave buffer for prepended handles on replies
  INSTAGRAM: 490, // 500 max, leave 10 char buffer
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  professional: 'professional and authoritative, using clear business language',
  friendly: 'warm and approachable, like a helpful friend who knows a great solution',
  casual: 'relaxed and conversational, natural and relatable',
  playful: 'fun and light-hearted, with personality and maybe a touch of humor',
}

export interface Gate2Result {
  reply: string
  model_used: string
  latency_ms: number
}

/**
 * Generate a contextual promotional reply for a lead that passed Gate 1.
 *
 * The system prompt is designed to:
 * 1. Front-load all app context (reduces per-call overhead)
 * 2. Set strict output constraints (char limit, no hashtag spam)
 * 3. Produce output-token-optimized replies (30-80 tokens)
 * 4. Sound human, not bot-like
 */
export async function runGate2(
  rawContent: string,
  authorUsername: string,
  platform: string,
  profile: Pick<
    Profile,
    | 'app_name'
    | 'app_description'
    | 'app_url'
    | 'app_category'
    | 'target_audience'
    | 'tone_of_voice'
    | 'differentiators'
    | 'company_name'
    | 'x_plan'
  >,
  timeoutMs = 30_000
): Promise<Gate2Result> {
  const isPaidX = platform === 'X' && profile.x_plan === 'paid'
  const charLimit = isPaidX ? 24900 : (CHAR_LIMITS[platform] ?? 270)
  const toneDesc = TONE_DESCRIPTIONS[profile.tone_of_voice] ?? TONE_DESCRIPTIONS.friendly

  const diff = profile.differentiators
  const differentiatorList = [
    diff.differentiator_1,
    diff.differentiator_2,
    diff.differentiator_3,
  ]
    .filter(Boolean)
    .map((d, i) => `${i + 1}. ${d}`)
    .join('\n')

  // System prompt — all context front-loaded, strict constraints
  const systemPrompt = `You are a social media reply copywriter for ${profile.app_name}${profile.company_name ? ` by ${profile.company_name}` : ''}.

Your task: Write ONE short, empathetic reply to a complaint post that naturally promotes ${profile.app_name} as a better alternative.

APP CONTEXT:
- Name: ${profile.app_name}
- What it does: ${profile.app_description}
- URL / Download: ${profile.app_url}
- Category: ${profile.app_category}
- Target users: ${profile.target_audience}
- Key advantages over competitors:
${differentiatorList}

TONE: ${toneDesc}

HARD RULES (violating any = bad output):
1. MAXIMUM ${charLimit} characters total — count carefully
2. Start with empathy or acknowledgment of the complaint — NEVER start with the app name
3. Mention ${profile.app_name} naturally as a solution, not as an ad
4. End with ONE soft CTA (try free / link in bio / DM me / check us out)
5. Maximum 1 hashtag, or zero — no hashtag spam
6. Do NOT sound like a bot, spam, or press release
7. Do NOT repeat the complaint word-for-word
8. If the original post is in Indonesian/Bahasa, reply in Indonesian. Otherwise reply in English.

Output the reply text ONLY. No quotes, no prefix like "Reply:", no explanation.`

  const userPrompt = `Write a ${profile.tone_of_voice} reply for ${platform} (max ${charLimit} chars) to this complaint:

Original post by @${authorUsername}: "${rawContent.slice(0, 400)}"`

  // Try primary DeepSeek model first
  try {
    const result = await callWithFallback({
      systemPrompt,
      userPrompt,
      models: [GATE2_PRIMARY],
      provider: GATE2_PRIMARY_PROVIDER,
      perModelTimeoutMs: timeoutMs,
      maxTokens: 200,    // ~150-200 chars = ~50-70 tokens
      temperature: 0.7,  // some creativity for natural-sounding replies
    })

    // Trim to char limit if model exceeded it
    const reply = result.content.trim().slice(0, charLimit)

    return {
      reply,
      model_used: result.model_used,
      latency_ms: result.latency_ms,
    }
  } catch (primaryErr) {
    console.warn('[gate2] DeepSeek primary failed, trying OpenRouter fallbacks:', primaryErr)
  }

  // Fallback to OpenRouter free models
  try {
    const result = await callWithFallback({
      systemPrompt,
      userPrompt,
      models: GATE2_FALLBACK_MODELS,
      provider: 'openrouter',
      perModelTimeoutMs: Math.min(25_000, timeoutMs),
      maxTokens: 200,
      temperature: 0.7,
    })

    const reply = result.content.trim().slice(0, charLimit)

    return {
      reply,
      model_used: result.model_used,
      latency_ms: result.latency_ms,
    }
  } catch (fallbackErr) {
    console.error('[gate2] All Gate 2 models failed:', fallbackErr)
    throw new Error('Gate 2 generation failed: all models exhausted')
  }
}
