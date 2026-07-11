import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse body
    const body = await request.json()
    const amountUsd = parseFloat(body.amount_usd)

    if (isNaN(amountUsd) || amountUsd < 2.0) {
      return NextResponse.json({ error: 'Minimum top-up amount is $2.00' }, { status: 400 })
    }

    // 3. Configuration & Constants for Bonus calculation
    const tier1Threshold = parseFloat(process.env.TOPUP_BONUS_TIER_1_THRESHOLD || '50')
    const tier1Percent = parseFloat(process.env.TOPUP_BONUS_TIER_1_PERCENT || '3') / 100
    const tier2Threshold = parseFloat(process.env.TOPUP_BONUS_TIER_2_THRESHOLD || '100')
    const tier2Percent = parseFloat(process.env.TOPUP_BONUS_TIER_2_PERCENT || '5') / 100

    // 4. Calculate credit granted (with bonus)
    let creditGrantedUsd = amountUsd
    if (amountUsd >= tier2Threshold) {
      creditGrantedUsd = amountUsd * (1 + tier2Percent)
    } else if (amountUsd >= tier1Threshold) {
      creditGrantedUsd = amountUsd * (1 + tier1Percent)
    }

    const gatewayOrderId = `undercut-topup-${user.id.substring(0, 8)}-${Date.now()}`

    // 5. Save pending transaction in Supabase
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        profile_id: user.id,
        gateway: 'stripe',
        gateway_order_id: gatewayOrderId,
        top_up_amount_usd: amountUsd,
        credit_granted_usd: creditGrantedUsd,
        amount_idr: 0, // 0 since we're charging directly in USD
        status: 'PENDING',
      })

    if (dbError) {
      console.error('Database transaction insert error:', dbError)
      return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 })
    }

    // 6. Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Undercut Prepaid Credits ($${amountUsd.toFixed(2)})`,
              description: `Top-up wallet balance to receive AI social reply drafts. Credits granted: $${creditGrantedUsd.toFixed(2)}`,
            },
            unit_amount: Math.round(amountUsd * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/dashboard/x?payment=success&order_id=${gatewayOrderId}`,
      cancel_url: `${appUrl}/dashboard/x?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        amountUsd: amountUsd.toString(),
        creditGrantedUsd: creditGrantedUsd.toString(),
        gatewayOrderId: gatewayOrderId,
      },
    })

    // Return the session details to client
    return NextResponse.json({
      id: session.id,
      url: session.url,
      order_id: gatewayOrderId,
    })
  } catch (error: any) {
    console.error('Stripe payment token request failed:', error)
    return NextResponse.json({ error: error?.message || 'Payment initiation failed' }, { status: 500 })
  }
}
