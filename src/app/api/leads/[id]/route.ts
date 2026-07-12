import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { updateLeadStatus } from '@/lib/server-data'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const admin = createServiceRoleClient()
  const { data: lead, error } = await admin
    .from('leads_queue')
    .select('*')
    .eq('id', id)
    .eq('profile_id', user.id)
    .single()

  if (error || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  return NextResponse.json(lead)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  // Setting status to REJECTED dismisses it from the pending dashboard queue
  const success = await updateLeadStatus(user.id, id, 'REJECTED')
  if (!success) return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })

  return NextResponse.json({ deleted: true })
}
