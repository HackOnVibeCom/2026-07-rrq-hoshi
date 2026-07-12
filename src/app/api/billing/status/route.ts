import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getBillingStatus } from '@/lib/server-data'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = await getBillingStatus(user.id)
  if (!status) return NextResponse.json({ error: 'Failed to fetch billing status' }, { status: 500 })

  return NextResponse.json(status)
}
