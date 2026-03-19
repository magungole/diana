import { getCommunityPosts } from '@/lib/airtable'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Pin, Trash2 } from 'lucide-react'

export default async function AdminCommunityPage() {
  let posts: any[] = []
  try {
    posts = await getCommunityPosts()
  } catch (error) {
    console.error('Community fetch error:', error)
  }

  const categoryColors: Record<string, any> = {
    pricing: 'gold',
    marketing: 'success',
    sales: 'default',
    mindset: 'warning',
    workflow: 'outline',
    general: 'default',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand mb-1">Community</h1>
        <p className="text-slate-500">{posts.length} total posts</p>
      </div>

      {posts.length === 0 ? (
        <Card className="text-center py-20">
          <MessageSquare size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400">No community posts yet</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Author
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Content
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Likes
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => (
                  <tr
                    key={post.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={post.userPhoto} name={post.userName} size="sm" />
                        <p className="text-sm font-medium text-brand">{post.userName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        {post.isPinned && (
                          <Pin size={12} className="text-gold mt-1 flex-shrink-0" />
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.category && (
                        <Badge variant={categoryColors[post.category] || 'default'}>
                          {post.category}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{post.likesCount || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">
                        {post.createdAt ? formatDate(post.createdAt) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-xs text-brand hover:text-gold transition-colors font-medium">
                          <Pin size={12} />
                          Pin
                        </button>
                        <span className="text-slate-200">|</span>
                        <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
