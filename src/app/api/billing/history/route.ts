import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { listLedger, listTransactions } from '@/lib/server-data'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [ledger, transactions] = await Promise.all([
    listLedger(user.id),
    listTransactions(user.id),
  ])

  return NextResponse.json({ ledger, transactions })
}
