/**
 * normalizer.ts
 * Converts raw RapidAPI responses (X and Instagram) to a standard NormalizedPost schema.
 */
import type { NormalizedPost } from '@/lib/server-data'

// ────────────────────────────────────────────────────────────
// X (Twitter) — twitter-api45 /search.php response shape
// ────────────────────────────────────────────────────────────

// twitter-api45 actual response shape (verified against real API)
interface RawTweet {
  tweet_id?: string
  id?: string
  id_str?: string
  text?: string
  full_text?: string
  // twitter-api45 uses screen_name at root level (not inside user/user_info)
  screen_name?: string
  // twitter-api45 uses 'user_info' (not 'user') for the author object
  user_info?: {
    screen_name?: string
    name?: string
    avatar?: string
    profile_image_url?: string
    profile_image_url_https?: string
  }
  // Some endpoints use 'user' instead of 'user_info'
  user?: {
    screen_name?: string
    name?: string
    avatar?: string
    profile_image_url?: string
    profile_image_url_https?: string
  }
  conversation_id?: string
}

export function normalizeTweets(
  rawTimeline: RawTweet[],
  baseUrl = 'https://x.com'
): NormalizedPost[] {
  const results: NormalizedPost[] = []

  for (const tweet of rawTimeline) {
    const tweetId = tweet.tweet_id ?? tweet.id ?? tweet.id_str
    const text = tweet.full_text ?? tweet.text

    if (!tweetId || !text) continue

    const username =
      tweet.screen_name ??
      tweet.user_info?.screen_name ??
      tweet.user?.screen_name ??
      'unknown_user'

    // Skip retweets (they start with RT @) — they're reposts, not original complaints
    if (text.trim().startsWith('RT @')) continue

    // Extract real profile picture — check avatar, user_info and user objects
    const userObj = tweet.user_info ?? tweet.user
    const rawAvatar =
      userObj?.avatar ??
      userObj?.profile_image_url_https ??
      userObj?.profile_image_url ??
      null

    // twitter-api45 returns _normal (48px) — upgrade to _400x400 for better quality
    const avatarUrl = rawAvatar
      ? rawAvatar.replace(/_normal\./, '_400x400.')
      : null

    results.push({
      external_post_id: `x_${tweetId}`,
      author_username: username,
      author_avatar_url: avatarUrl,
      raw_content: text.trim(),
      post_url: `${baseUrl}/${username}/status/${tweetId}`,
    })
  }

  return results
}

// ────────────────────────────────────────────────────────────
// Instagram — instagram-scraper-stable-api get_user_posts.php
// ────────────────────────────────────────────────────────────

interface RawIGComment {
  id?: string
  text?: string
  node?: {
    id?: string
    text?: string
    owner?: {
      username?: string
      profile_pic_url?: string
    }
  }
  owner?: {
    username?: string
    profile_pic_url?: string
  }
  user?: {
    username?: string
    profile_pic_url?: string
  }
}

interface RawIGPost {
  id?: string
  shortcode?: string
  caption?: string | { text?: string }
  owner?: {
    username?: string
    profile_pic_url?: string
    profile_picture?: string
  }
  username?: string
  user?: {
    profile_pic_url?: string
    profile_picture?: string
  }
  comments?: RawIGComment[]
  comments_data?: RawIGComment[]
  edge_media_to_parent_comment?: {
    edges?: Array<{
      node?: RawIGComment
    }>
  }
  taken_at?: number
  taken_at_timestamp?: number
}

export function normalizeIGPosts(
  rawPosts: RawIGPost[],
  competitorUsername: string
): NormalizedPost[] {
  const results: NormalizedPost[] = []

  for (const post of rawPosts) {
    const postId = post.id ?? post.shortcode
    if (!postId) continue

    const shortcode = post.shortcode ?? postId

    // 1. Process Main Post Caption
    let caption: string
    if (typeof post.caption === 'string') {
      caption = post.caption
    } else if (post.caption && typeof post.caption === 'object') {
      caption = post.caption.text ?? ''
    } else {
      caption = ''
    }

    if (caption.trim()) {
      const username = post.owner?.username ?? post.username ?? competitorUsername
      const avatarUrl =
        post.owner?.profile_pic_url ??
        post.owner?.profile_picture ??
        post.user?.profile_pic_url ??
        post.user?.profile_picture ??
        null

      results.push({
        external_post_id: `ig_${postId}`,
        author_username: username,
        author_avatar_url: avatarUrl,
        raw_content: caption.trim().slice(0, 2000), // cap at 2000 chars
        post_url: `https://www.instagram.com/p/${shortcode}/`,
      })
    }

    // 2. Process Comments Under the Post (FUD complaints are often in comments)
    const processComment = (comment: RawIGComment) => {
      const commentId = comment.node?.id ?? comment.id
      const text = comment.node?.text ?? comment.text
      if (!commentId || !text || !text.trim()) return

      const userObj =
        comment.node?.owner ??
        comment.owner ??
        comment.user ??
        {}
      const username = userObj.username || 'instagram_user'
      const avatarUrl = userObj.profile_pic_url || null

      results.push({
        external_post_id: `ig_comment_${commentId}`,
        author_username: username,
        author_avatar_url: avatarUrl,
        raw_content: text.trim().slice(0, 2000),
        post_url: `https://www.instagram.com/p/${shortcode}/`,
      })
    }

    const commentsList = post.comments || post.comments_data || []
    for (const c of commentsList) {
      processComment(c)
    }

    const edgesList = post.edge_media_to_parent_comment?.edges || []
    for (const edge of edgesList) {
      if (edge?.node) {
        processComment(edge.node)
      }
    }
  }

  return results
}


