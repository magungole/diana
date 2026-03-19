export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllUsers, getAllPurchases, getAllSubscriptions } from '@/lib/airtable'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [users, purchases, subscriptions] = await Promise.all([
      getAllUsers(),
      getAllPurchases(),
      getAllSubscriptions(),
    ])

    const totalRevenue = purchases.reduce(
      (sum: number, p: any) => sum + (p.amount || 0),
      0
    )
    const activeSubscriptions = subscriptions.filter(
      (s: any) => s.status === 'active'
    ).length

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const newThisMonth = users.filter(
      (u: any) => u.createdAt && new Date(u.createdAt) > oneMonthAgo
    ).length

    return NextResponse.json({
      totalUsers: users.length,
      newThisMonth,
      activeSubscriptions,
      totalSubscriptions: subscriptions.length,
      totalRevenue,
      totalTransactions: purchases.length,
    })
  } catch (error) {
    console.error('GET /api/admin/stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
