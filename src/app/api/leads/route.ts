import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { listLeads } from '@/lib/server-data'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import type { Platform } from '@/lib/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') as Platform | null
  const filter = (searchParams.get('filter') ?? 'PENDING') as 'PENDING' | 'ALL'

  const leads = await listLeads(user.id, platform ?? undefined, filter)
  return NextResponse.json(leads)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') as Platform | null
  if (!platform) return NextResponse.json({ error: 'Missing platform' }, { status: 400 })

  const admin = createServiceRoleClient()
  const { error } = await admin
    .from('leads_queue')
    .delete()
    .eq('profile_id', user.id)
    .eq('platform', platform)

  if (error) {
    console.error('[server-data] clear leads error:', error)
    return NextResponse.json({ error: 'Failed to clear leads' }, { status: 500 })
  }

  return NextResponse.json({ cleared: true })
}
