/**
 * server-data.ts
 * Server-side Supabase data access layer.
 * Used ONLY in API routes (never imported in client components).
 */
import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import type {
  Profile,
  ProfileInput,
  Competitor,
  Lead,
  Platform,
  BillingEntry,
  Transaction,
  LeadStatus,
} from '@/lib/types'

export type { Profile, ProfileInput, Competitor, Lead, Platform, BillingEntry, Transaction }

// ────────────────────────────────────────────────────────────
// PROFILE
// ────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[server-data] getProfile error:', error)
    return null
  }
  return data as Profile
}

export async function saveProfile(userId: string, input: ProfileInput): Promise<Profile | null> {
  const supabase = await createClient()

  const requiredFields = [
    'app_name',
    'app_description',
    'app_url',
    'app_category',
    'target_audience',
    'tone_of_voice',
    'differentiators',
  ]
  const inputAsRecord = input as unknown as Record<string, unknown>
  const onboardingCompleted = requiredFields.every((field) => {
    const val = inputAsRecord[field]
    return val !== null && val !== undefined && val !== ''
  })

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...input,
      onboarding_completed: onboardingCompleted,
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('[server-data] saveProfile error:', error)
    return null
  }
  return data as Profile
}

// ────────────────────────────────────────────────────────────
// COMPETITORS
// ────────────────────────────────────────────────────────────

export async function listCompetitors(userId: string, platform?: Platform): Promise<Competitor[]> {
  const supabase = await createClient()
  let query = supabase
    .from('competitor_targets')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })

  if (platform) {
    query = query.eq('platform', platform)
  }

  const { data, error } = await query
  if (error) {
    console.error('[server-data] listCompetitors error:', error)
    return []
  }
  return (data as Competitor[]) ?? []
}

export async function addCompetitor(
  userId: string,
  input: Pick<Competitor, 'competitor_name' | 'platform' | 'search_query'>
): Promise<{ data: Competitor | null; error: string | null }> {
  const supabase = await createClient()

  // Check max 5 active per platform per user
  const { count } = await supabase
    .from('competitor_targets')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .eq('platform', input.platform)
    .eq('is_active', true)

  if ((count ?? 0) >= 5) {
    return { data: null, error: `Maximum 5 active ${input.platform} targets allowed.` }
  }

  const { data, error } = await supabase
    .from('competitor_targets')
    .insert({ ...input, profile_id: userId })
    .select()
    .single()

  if (error) {
    console.error('[server-data] addCompetitor error:', error)
    return { data: null, error: error.message }
  }
  return { data: data as Competitor, error: null }
}

export async function deleteCompetitor(userId: string, competitorId: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('competitor_targets')
    .delete()
    .eq('id', competitorId)
    .eq('profile_id', userId) // ownership check via RLS + explicit filter

  if (error) {
    console.error('[server-data] deleteCompetitor error:', error)
    return false
  }
  return true
}

export async function toggleCompetitor(
  userId: string,
  competitorId: string
): Promise<Competitor | null> {
  const supabase = await createClient()

  // Fetch current state first
  const { data: current } = await supabase
    .from('competitor_targets')
    .select('is_active')
    .eq('id', competitorId)
    .eq('profile_id', userId)
    .single()

  if (!current) return null

  const { data, error } = await supabase
    .from('competitor_targets')
    .update({ is_active: !current.is_active })
    .eq('id', competitorId)
    .eq('profile_id', userId)
    .select()
    .single()

  if (error) {
    console.error('[server-data] toggleCompetitor error:', error)
    return null
  }
  return data as Competitor
}

// ────────────────────────────────────────────────────────────
// LEADS
// ────────────────────────────────────────────────────────────

export async function listLeads(
  userId: string,
  platform?: Platform,
  filter: 'PENDING' | 'ALL' = 'PENDING'
): Promise<Lead[]> {
  const supabase = await createClient()
  let query = supabase
    .from('leads_queue')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (platform) {
    query = query.eq('platform', platform)
  }

  // "PENDING" filter shows leads that are ready to reply on (not yet actioned)
  if (filter === 'PENDING') {
    query = query.in('status', ['PENDING', 'PENDING_PAYMENT'])
  }

  const { data, error } = await query
  if (error) {
    console.error('[server-data] listLeads error:', error)
    return []
  }
  return (data as Lead[]) ?? []
}

export async function updateLeadStatus(
  userId: string,
  leadId: string,
  status: LeadStatus
): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads_queue')
    .update({ status })
    .eq('id', leadId)
    .eq('profile_id', userId)

  if (error) {
    console.error('[server-data] updateLeadStatus error:', error)
    return false
  }
  return true
}

export async function updateLeadDraft(
  userId: string,
  leadId: string,
  draft: string
): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads_queue')
    .update({ gate_2_generated_reply: draft })
    .eq('id', leadId)
    .eq('profile_id', userId)

  if (error) {
    console.error('[server-data] updateLeadDraft error:', error)
    return false
  }
  return true
}

// Check if user has any existing leads (for auto-scrape on first load logic)
export async function hasLeads(userId: string, platform: Platform): Promise<boolean> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('leads_queue')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .eq('platform', platform)

  return (count ?? 0) > 0
}

// ────────────────────────────────────────────────────────────
// BILLING
// ────────────────────────────────────────────────────────────

export interface BillingStatus {
  credit_balance: number
  free_demo_credits_remaining: number
  free_demo_reset_at: string
  leads_this_week: number
  leads_replied_total: number
}

export async function getBillingStatus(userId: string): Promise<BillingStatus | null> {
  const supabase = await createClient()

  const [profileResult, statsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('credit_balance, free_demo_credits_remaining, free_demo_reset_at')
      .eq('id', userId)
      .single(),
    supabase
      .from('leads_queue')
      .select('status, created_at')
      .eq('profile_id', userId),
  ])

  if (profileResult.error || !profileResult.data) return null

  const leads = statsResult.data ?? []
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const leadsThisWeek = leads.filter((l) => +new Date(l.created_at) >= weekAgo).length
  const leadsRepliedTotal = leads.filter((l) => l.status === 'REPLIED').length

  return {
    credit_balance: parseFloat(profileResult.data.credit_balance as unknown as string) || 0,
    free_demo_credits_remaining: profileResult.data.free_demo_credits_remaining ?? 3,
    free_demo_reset_at: profileResult.data.free_demo_reset_at ?? new Date().toISOString(),
    leads_this_week: leadsThisWeek,
    leads_replied_total: leadsRepliedTotal,
  }
}

export async function listLedger(userId: string): Promise<BillingEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('billing_ledger')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[server-data] listLedger error:', error)
    return []
  }
  return (data as BillingEntry[]) ?? []
}

export async function listTransactions(userId: string): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[server-data] listTransactions error:', error)
    return []
  }
  return (data as Transaction[]) ?? []
}

// ────────────────────────────────────────────────────────────
// SCRAPE TRACKING
// ────────────────────────────────────────────────────────────
// Track last scrape time per user per platform (stored in a simple approach
// using the latest lead created_at as a proxy for last scrape)
export async function getLastScrapeTime(
  userId: string,
  platform: Platform
): Promise<Date | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('leads_queue')
    .select('created_at')
    .eq('profile_id', userId)
    .eq('platform', platform)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return null
  return new Date(data.created_at)
}

// ────────────────────────────────────────────────────────────
// LEAD INSERT (used by scraper pipeline)
// Uses service role to bypass RLS (scraper runs server-side, auth may not be available)
// ────────────────────────────────────────────────────────────
export interface NormalizedPost {
  external_post_id: string
  author_username: string
  author_avatar_url?: string | null
  raw_content: string
  post_url: string
  gate_1_passed?: boolean
  gate_1_model_used?: string
  status?: LeadStatus
}

export async function insertLeads(
  userId: string,
  competitorTargetId: string,
  platform: Platform,
  posts: NormalizedPost[]
): Promise<{ inserted: number; duplicates: number }> {
  const admin = createServiceRoleClient()

  // Fetch existing external_post_ids to deduplicate (scoped by profile_id)
  const ids = posts.map((p) => p.external_post_id)
  const { data: existing } = await admin
    .from('leads_queue')
    .select('external_post_id')
    .eq('profile_id', userId)
    .in('external_post_id', ids)

  const existingIds = new Set((existing ?? []).map((e) => e.external_post_id))
  const newPosts = posts.filter((p) => !existingIds.has(p.external_post_id))

  if (newPosts.length === 0) {
    return { inserted: 0, duplicates: posts.length }
  }

  const rows = newPosts.map((p) => ({
    profile_id: userId,
    competitor_target_id: competitorTargetId,
    platform,
    external_post_id: p.external_post_id,
    author_username: p.author_username,
    author_avatar_url: p.author_avatar_url ?? null,
    raw_content: p.raw_content,
    post_url: p.post_url,
    status: p.status ?? 'PENDING',
    gate_1_passed: p.gate_1_passed ?? false,
    gate_1_model_used: p.gate_1_model_used,
  }))

  const { error } = await admin.from('leads_queue').insert(rows)

  if (error) {
    console.error('[server-data] insertLeads error:', error)
    return { inserted: 0, duplicates: existingIds.size }
  }

  return { inserted: newPosts.length, duplicates: existingIds.size }
}

export interface PipelineLead extends Lead {
  competitor_name: string | null
}

export async function getLeadForPipeline(
  userId: string,
  leadId: string
): Promise<PipelineLead | null> {
  const admin = createServiceRoleClient()
  const { data, error } = await admin
    .from('leads_queue')
    .select('*, competitor_targets(competitor_name)')
    .eq('id', leadId)
    .eq('profile_id', userId)
    .single()

  if (error || !data) {
    if (error) console.error('[server-data] getLeadForPipeline error:', error)
    return null
  }

  const lead = data as Lead & {
    competitor_targets?: { competitor_name?: string | null } | null
  }

  return {
    ...lead,
    competitor_name: lead.competitor_targets?.competitor_name ?? null,
  }
}
// Get inserted leads by external_post_ids (for pipeline processing)
export async function getLeadsByExternalIds(
  userId: string,
  externalIds: string[]
): Promise<Lead[]> {
  const admin = createServiceRoleClient()
  const { data } = await admin
    .from('leads_queue')
    .select('*')
    .eq('profile_id', userId)
    .in('external_post_id', externalIds)

  return (data as Lead[]) ?? []
}

// Update lead after pipeline processing (uses service role for background processing)
export async function updateLeadAfterPipeline(
  leadId: string,
  updates: {
    gate_1_passed: boolean
    gate_1_model_used?: string
    gate_2_generated_reply?: string | null
    gate_2_model_used?: string | null
    status: LeadStatus
    processing_time_ms?: number
  }
): Promise<boolean> {
  const admin = createServiceRoleClient()
  const { error } = await admin.from('leads_queue').update(updates).eq('id', leadId)

  if (error) {
    console.error('[server-data] updateLeadAfterPipeline error:', error)
    return false
  }
  return true
}
