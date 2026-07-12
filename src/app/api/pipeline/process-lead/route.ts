import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { processLeadPipeline } from '@/lib/pipeline/helpers'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { lead_id: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { lead_id } = body
  if (!lead_id) return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 })

  try {
    const result = await processLeadPipeline(user.id, lead_id)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[process-lead] Pipeline execution failed:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

