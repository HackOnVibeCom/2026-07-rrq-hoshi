import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { listCompetitors, addCompetitor } from '@/lib/server-data'
import type { Platform } from '@/lib/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') as Platform | null

  const competitors = await listCompetitors(user.id, platform ?? undefined)
  return NextResponse.json(competitors)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { competitor_name: string; platform: Platform; search_query: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { competitor_name, platform, search_query } = body
  if (!competitor_name || !platform || !search_query) {
    return NextResponse.json({ error: 'Missing required fields: competitor_name, platform, search_query' }, { status: 400 })
  }
  if (!['X', 'INSTAGRAM'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform. Must be "X" or "INSTAGRAM"' }, { status: 400 })
  }

  // Strip leading @ from Instagram username
  const normalizedQuery = platform === 'INSTAGRAM'
    ? search_query.replace(/^@/, '').trim()
    : search_query.trim()

  const { data, error } = await addCompetitor(user.id, {
    competitor_name: competitor_name.trim(),
    platform,
    search_query: normalizedQuery,
  })

  if (error) return NextResponse.json({ error }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
