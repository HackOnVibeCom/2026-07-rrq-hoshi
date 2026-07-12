import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { deleteCompetitor, toggleCompetitor } from '@/lib/server-data'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const success = await deleteCompetitor(user.id, id)
  if (!success) return NextResponse.json({ error: 'Failed to delete competitor' }, { status: 500 })

  return NextResponse.json({ deleted: true })
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updated = await toggleCompetitor(user.id, id)
  if (!updated) return NextResponse.json({ error: 'Failed to toggle competitor' }, { status: 500 })

  return NextResponse.json(updated)
}
