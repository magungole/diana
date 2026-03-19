import { getAllPurchases, getAllSubscriptions, getAllUsers } from '@/lib/airtable'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatPrice } from '@/lib/utils'
import { CreditCard, TrendingUp, Users, ArrowUpRight } from 'lucide-react'

export default async function AdminPaymentsPage() {
  let purchases: any[] = []
  let subscriptions: any[] = []
  let users: any[] = []

  try {
    ;[purchases, subscriptions, users] = await Promise.all([
      getAllPurchases(),
      getAllSubscriptions(),
      getAllUsers(),
    ])
  } catch (error) {
    console.error('Payments fetch error:', error)
  }

  const totalRevenue = purchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  const activeSubscriptions = subscriptions.filter((s: any) => s.status === 'active').length
  const monthlyRevenue = subscriptions
    .filter((s: any) => s.status === 'active')
    .length * 4900 // estimate £49/month

  // Build user email map
  const userMap = new Map(users.map((u: any) => [u.id, u]))

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: CreditCard,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Est. MRR',
      value: formatPrice(monthlyRevenue),
      icon: ArrowUpRight,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Total Transactions',
      value: purchases.length,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand mb-1">Payments</h1>
        <p className="text-slate-500">Revenue overview and transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-brand mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Subscriptions table */}
      <Card padding="none" className="mb-6">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-brand">Active Subscriptions</h2>
        </div>
        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No subscriptions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    User ID
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Stripe ID
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Period End
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub: any) => (
                  <tr
                    key={sub.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 font-mono text-xs">
                        {sub.userId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          sub.status === 'active'
                            ? 'success'
                            : sub.status === 'cancelled'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-mono">
                        {sub.stripeSubscriptionId || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Purchases table */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold text-brand">All Purchases</h2>
        </div>
        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No purchases yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    User ID
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Product Type
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase: any) => (
                  <tr
                    key={purchase.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-mono">
                        {purchase.userId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-brand font-medium">
                        {purchase.productType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-brand text-sm">
                        {formatPrice(purchase.amount || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          purchase.status === 'succeeded'
                            ? 'success'
                            : purchase.status === 'failed'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {purchase.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {purchase.createdAt ? formatDate(purchase.createdAt) : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
