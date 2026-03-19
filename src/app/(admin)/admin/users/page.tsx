import { getAllUsers } from '@/lib/airtable'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'
import { Users, Search } from 'lucide-react'

export default async function AdminUsersPage() {
  let users: any[] = []
  try {
    users = await getAllUsers()
  } catch (error) {
    console.error('Users fetch error:', error)
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand mb-1">Users</h1>
          <p className="text-slate-500">{users.length} total members</p>
        </div>
      </div>

      <Card padding="none">
        {/* Table header with search */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-semibold text-brand">All Members</h2>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No users yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Member
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Niche
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Stage
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Joined
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.profilePhoto} name={user.name} size="sm" />
                        <div>
                          <p className="font-medium text-brand text-sm">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'admin' ? 'gold' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{user.niche || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{user.businessStage || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {user.createdAt ? formatDate(user.createdAt) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-brand hover:text-gold transition-colors font-medium">
                          Edit
                        </button>
                        <span className="text-slate-200">|</span>
                        <button className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                          Remove
                        </button>
                      </div>
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
