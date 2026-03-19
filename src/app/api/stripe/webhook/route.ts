export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createPurchase, createSubscription, updateSubscription, getUserSubscription } from '@/lib/airtable'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const { userId, planId } = session.metadata || {}

        if (userId && planId) {
          // Create purchase record
          await createPurchase({
            userId,
            productId: planId,
            productType: session.mode === 'subscription' ? 'subscription' : 'one_time',
            amount: session.amount_total || 0,
            status: 'succeeded',
            stripePaymentIntentId:
              session.payment_intent || session.subscription || '',
          })

          // Create or update subscription if it's a subscription mode
          if (session.mode === 'subscription' && session.subscription) {
            const existing = await getUserSubscription(userId)
            if (existing) {
              await updateSubscription(existing.id, {
                status: 'active',
                stripeSubscriptionId: session.subscription,
                planId,
              })
            } else {
              await createSubscription({
                userId,
                planId,
                status: 'active',
                stripeSubscriptionId: session.subscription,
                currentPeriodEnd: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toISOString(),
              })
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        // Find subscription by stripeSubscriptionId and update
        // This is simplified — in production you'd look up by subscription ID
        console.log('Subscription updated:', subscription.id, subscription.status)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        console.log('Subscription cancelled:', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        console.log('Payment failed for subscription:', invoice.subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
