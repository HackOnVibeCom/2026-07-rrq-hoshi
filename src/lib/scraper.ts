/**
 * scraper.ts
 * RapidAPI scraper for X (Twitter) and Instagram.
 * No mock fallback — real data only.
 */
import type { NormalizedPost } from '@/lib/server-data'
import { normalizeTweets, normalizeIGPosts } from '@/lib/normalizer'

function expandSearchQuery(query: string): string {
  const trimmed = query.trim()
  // Check if it's a simple username/handle (e.g. @Notion or Notion)
  if (/^@?[a-zA-Z0-9_]{1,15}$/.test(trimmed)) {
    const username = trimmed.replace(/^@/, '')
    return `@${username} OR to:${username} OR from:${username}`
  }
  return trimmed
}

// ────────────────────────────────────────────────────────────
// X (Twitter) — twitter-api45
// ────────────────────────────────────────────────────────────

/**
 * Fetch up to 20 tweets matching a free-text search query.
 * @param query  Free-text query, e.g. "@CompetitorApp crash OR #CompetitorFail"
 * @param competitorName  Human-readable competitor name (for logging)
 */
export async function scrapeX(
  query: string,
  competitorName: string
): Promise<NormalizedPost[]> {
  const expandedQuery = expandSearchQuery(query)

  const rapidApiKey = process.env.RAPIDAPI_KEY
  const rapidApiHost = process.env.RAPIDAPI_HOST_TWITTER ?? 'twitter-api45.p.rapidapi.com'

  if (!rapidApiKey) {
    throw new Error('[scraper] RAPIDAPI_KEY is not configured. Cannot scrape X.')
  }

  console.log(`[scraper] Scraping X for "${competitorName}" with query: ${expandedQuery}`)

  const encodedQuery = encodeURIComponent(expandedQuery)
  const url = `https://${rapidApiHost}/search.php?query=${encodedQuery}&search_type=Latest`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': rapidApiHost,
    },
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown')
    throw new Error(`[scraper] X API error: ${response.status} — ${errorText}`)
  }

  const data = await response.json()

  // twitter-api45 response: { timeline: [...] }
  const timeline = Array.isArray(data?.timeline)
    ? data.timeline
    : Array.isArray(data)
    ? data
    : []

  // Limit to 20 (optimal for rate limit budget)
  const limited = timeline.slice(0, 20)
  const normalized = normalizeTweets(limited)
  console.log(`[scraper] X: scraped ${normalized.length} posts for "${competitorName}"`)
  return normalized
}

// ────────────────────────────────────────────────────────────
// Instagram — instagram-scraper-stable-api
// ────────────────────────────────────────────────────────────

/**
 * Fetch up to 12 recent posts from a competitor's Instagram profile.
 * @param username  Competitor's Instagram username (without @)
 */
export async function scrapeInstagram(username: string): Promise<NormalizedPost[]> {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const rapidApiHost =
    process.env.RAPIDAPI_HOST_INSTAGRAM ??
    'instagram-scraper-stable-api.p.rapidapi.com'

  if (!rapidApiKey) {
    throw new Error('[scraper] RAPIDAPI_KEY is not configured. Cannot scrape Instagram.')
  }

  console.log(`[scraper] Scraping Instagram for @${username}`)

  const url = `https://${rapidApiHost}/get_ig_user_posts.php`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': rapidApiHost,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username_or_url=${encodeURIComponent(username)}`,
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'unknown')
    throw new Error(`[scraper] IG API error: ${response.status} — ${errorText}`)
  }

  const data = await response.json()

  // instagram-scraper-stable-api response shape varies — handle common shapes
  let posts: unknown[] = []
  if (Array.isArray(data)) {
    posts = data
  } else if (Array.isArray(data?.data)) {
    posts = data.data
  } else if (Array.isArray(data?.items)) {
    posts = data.items
  } else if (Array.isArray(data?.posts)) {
    posts = data.posts
  }

  if (posts.length === 0) {
    throw new Error(`[scraper] IG: no posts found for @${username}`)
  }

  // Limit to 12
  const limited = posts.slice(0, 12) as Parameters<typeof normalizeIGPosts>[0]
  const normalized = normalizeIGPosts(limited, username)
  console.log(`[scraper] IG: scraped ${normalized.length} posts for @${username}`)
  return normalized
}
