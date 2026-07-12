import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import Stripe from 'stripe'

export async function POST(request: Request) {
  let body: string
  try {
    body = await request.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 })
  }

  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is missing')
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Stripe webhook signature verification failed: ${errMsg}`)
    return NextResponse.json({ error: `Webhook Error: ${errMsg}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const eventId = `stripe-session-${session.id}`

    // Parse metadata
    const metadata = session.metadata || {}
    const userId = metadata.userId
    const gatewayOrderId = metadata.gatewayOrderId
    const creditGrantedUsd = parseFloat(metadata.creditGrantedUsd || '0')

    if (!userId || !gatewayOrderId || isNaN(creditGrantedUsd)) {
      console.warn('Stripe checkout session completed but missing required metadata:', metadata)
      return NextResponse.json({ status: 'ignored', message: 'Missing metadata' })
    }

    const supabaseAdmin = createServiceRoleClient()

    // 1. Idempotency Check: Verify if event was already processed
    const { data: existingEvent } = await supabaseAdmin
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle()

    if (existingEvent) {
      return NextResponse.json({ status: 'ignored', message: 'Event already processed' })
    }

    // 2. Fetch the pending transaction from database
    const { data: transaction, error: trxError } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('gateway_order_id', gatewayOrderId)
      .maybeSingle()

    if (trxError || !transaction) {
      console.error(`Transaction with order ID ${gatewayOrderId} not found in database.`, trxError)
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // 3. Lock the event first (Idempotency Guard lock)
    const { error: eventInsertError } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        gateway: 'stripe',
        event_id: eventId,
        raw_payload: event,
        processed_at: new Date().toISOString(),
      })

    if (eventInsertError) {
      console.warn('Concurrently processing event or event insertion failed:', eventInsertError)
      return NextResponse.json({ status: 'ignored', message: 'Event already processing or processed' })
    }

    // 4. Update transaction status, user balance, and ledger
    if (transaction.status !== 'SETTLED') {
      // Update transaction status
      const { error: updateTrxError } = await supabaseAdmin
        .from('payment_transactions')
        .update({
          status: 'SETTLED',
          paid_at: new Date().toISOString(),
        })
        .eq('id', transaction.id)

      if (updateTrxError) {
        throw new Error(`Failed to update transaction status: ${updateTrxError.message}`)
      }

      // Fetch user profile to read current balance
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('credit_balance')
        .eq('id', transaction.profile_id)
        .single()

      if (profileError || !profile) {
        throw new Error(`Failed to fetch user profile ${transaction.profile_id}: ${profileError?.message}`)
      }

      const currentBalance = Number(profile.credit_balance) || 0
      const newBalance = currentBalance + creditGrantedUsd

      // Update credit balance in public.profiles
      const { error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update({
          credit_balance: newBalance,
        })
        .eq('id', transaction.profile_id)

      if (updateProfileError) {
        throw new Error(`Failed to credit user balance: ${updateProfileError.message}`)
      }

      // Record in public.billing_ledger
      const { error: ledgerError } = await supabaseAdmin
        .from('billing_ledger')
        .insert({
          profile_id: transaction.profile_id,
          amount_usd: creditGrantedUsd,
          transaction_type: 'TOPUP',
        })

      if (ledgerError) {
        console.error('Failed to log billing ledger record:', ledgerError)
      }

      console.log(`Successfully settled Stripe transaction ${gatewayOrderId}. Credited $${creditGrantedUsd} to profile ${transaction.profile_id}.`)
    }
  }

  return NextResponse.json({ received: true })
}
