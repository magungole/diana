import { getAllUsers, getAllPurchases, getAllSubscriptions, getAllClasses, getPublishedCourses } from '@/lib/airtable'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatPrice } from '@/lib/utils'
import { Users, CreditCard, TrendingUp, BookOpen, Plus, Calendar, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  let users: any[] = []
  let purchases: any[] = []
  let subscriptions: any[] = []
  let courses: any[] = []
  let classes: any[] = []

  try {
    ;[users, purchases, subscriptions, courses, classes] = await Promise.all([
      getAllUsers(),
      getAllPurchases(),
      getAllSubscriptions(),
      getPublishedCourses(),
      getAllClasses(),
    ])
  } catch (error) {
    console.error('Admin dashboard error:', error)
  }

  const totalRevenue = purchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  const activeSubscriptions = subscriptions.filter((s: any) => s.status === 'active').length

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const newThisMonth = users.filter(
    (u: any) => u.createdAt && new Date(u.createdAt) > oneMonthAgo
  ).length

  const recentPurchases = purchases.slice(0, 5)
  const recentUsers = users.slice(0, 5)

  const stats = [
    {
      label: 'Total Members',
      value: users.length,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      trend: `+${newThisMonth} this month`,
    },
    {
      label: 'Active Subscriptions',
      value: activeSubscriptions,
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-600',
      trend: `${subscriptions.length} total`,
    },
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
      trend: `${purchases.length} transactions`,
    },
    {
      label: 'Published Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600',
      trend: `${classes.length} classes`,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand mb-1">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of your coaching platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Add Course', href: '/admin/courses', icon: BookOpen },
          { label: 'Create Class', href: '/admin/classes', icon: Calendar },
          { label: 'Manage Users', href: '/admin/users', icon: Users },
          { label: 'View Payments', href: '/admin/payments', icon: CreditCard },
        ].map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-gold/30 hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
              <action.icon size={16} className="text-brand" />
            </div>
            <span className="font-medium text-sm text-brand">{action.label}</span>
            <ArrowRight
              size={14}
              className="ml-auto text-slate-300 group-hover:text-gold transition-colors"
            />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand">Recent Members</h2>
            <Link href="/admin/users" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No users yet</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-brand text-xs font-semibold">
                    {user.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'admin' ? 'gold' : 'default'}>
                      {user.role}
                    </Badge>
                    {user.createdAt && (
                      <span className="text-xs text-slate-400">
                        {formatDate(user.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent payments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand">Recent Payments</h2>
            <Link href="/admin/payments" className="text-sm text-gold hover:underline">
              View all
            </Link>
          </div>
          {recentPurchases.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No payments yet</p>
          ) : (
            <div className="space-y-3">
              {recentPurchases.map((purchase: any) => (
                <div key={purchase.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CreditCard size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand">
                      {purchase.productType || 'Purchase'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {purchase.createdAt ? formatDate(purchase.createdAt) : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand text-sm">
                      {formatPrice(purchase.amount || 0)}
                    </p>
                    <Badge variant="success">{purchase.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
