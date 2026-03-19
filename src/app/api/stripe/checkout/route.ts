export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { getUserById, getMembershipPlanById, updateUser } from '@/lib/airtable'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, type } = await req.json()
    const userId = (session.user as any).id
    const user = await getUserById(userId)
    const plan = await getMembershipPlanById(planId)

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Create or retrieve Stripe customer
    let customerId = user?.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name!,
      })
      customerId = customer.id
      await updateUser(userId, { stripeCustomerId: customerId })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: type === 'subscription' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/account?cancelled=true`,
      metadata: { userId, planId },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('POST /api/stripe/checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
