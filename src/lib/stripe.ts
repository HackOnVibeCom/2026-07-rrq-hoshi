import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'dummy_stripe_key_for_build'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27' as any, // Cast as any to bypass version typing conflicts if the installed SDK is older/newer
  typescript: true,
})
