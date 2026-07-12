import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getProfile, saveProfile } from '@/lib/server-data'
import type { ProfileInput } from '@/lib/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await getProfile(user.id)
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: ProfileInput
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate required fields
  const required = ['app_name', 'app_description', 'app_url', 'app_category', 'target_audience', 'tone_of_voice']
  for (const field of required) {
    if (!body[field as keyof ProfileInput]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  const profile = await saveProfile(user.id, body)
  if (!profile) return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })

  return NextResponse.json(profile)
}
