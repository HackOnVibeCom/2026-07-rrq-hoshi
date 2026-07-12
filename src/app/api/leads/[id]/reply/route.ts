import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { updateLeadStatus } from '@/lib/server-data'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const success = await updateLeadStatus(user.id, id, 'REPLIED')
  if (!success) return NextResponse.json({ error: 'Failed to mark lead as replied' }, { status: 500 })

  return NextResponse.json({ status: 'REPLIED' })
}
