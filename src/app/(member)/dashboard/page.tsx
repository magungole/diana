import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublishedCourses, getPublishedClasses, getCommunityPosts, getUserProgress } from '@/lib/airtable'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime, formatDate } from '@/lib/utils'
import { BookOpen, Calendar, Users, MessageCircle, ArrowRight, PlayCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const userId = (user as any)?.id

  // Get hour for greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Fetch data
  let courses: any[] = []
  let classes: any[] = []
  let posts: any[] = []
  let progress: any[] = []

  try {
    ;[courses, classes, posts, progress] = await Promise.all([
      getPublishedCourses(),
      getPublishedClasses(),
      getCommunityPosts(),
      getUserProgress(userId),
    ])
  } catch (error) {
    console.error('Dashboard fetch error:', error)
  }

  const now = new Date()
  const upcomingClasses = classes
    .filter((c) => new Date(c.dateTime) > now)
    .slice(0, 3)

  const recentPosts = posts.slice(0, 3)
  const completedLessonIds = progress.map((p: any) => p.lessonId)

  return (
    <div>
      <TopNav />
      <div className="p-8 max-w-7xl">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Welcome back to your coaching portal</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Courses available',
              value: courses.length,
              icon: BookOpen,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              label: 'Classes this week',
              value: upcomingClasses.length,
              icon: Calendar,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              label: 'Community posts',
              value: posts.length,
              icon: Users,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              label: 'Lessons completed',
              value: completedLessonIds.length,
              icon: MessageCircle,
              color: 'text-purple-600 bg-purple-50',
            },
          ].map((stat, i) => (
            <Card key={i} padding="md">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-brand">Continue Learning</h2>
                <Link
                  href="/courses"
                  className="text-sm text-gold hover:underline flex items-center gap-1"
                >
                  All courses <ArrowRight size={14} />
                </Link>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={40} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400">No courses available yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course: any) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex-shrink-0 bg-gradient-to-br from-brand/20 to-gold/20 flex items-center justify-center"
                        style={
                          course.thumbnail
                            ? {
                                backgroundImage: `url(${course.thumbnail})`,
                                backgroundSize: 'cover',
                              }
                            : {}
                        }
                      >
                        {!course.thumbnail && <PlayCircle size={24} className="text-brand/40" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-brand truncate">{course.title}</p>
                        <p className="text-sm text-slate-500 truncate">{course.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge
                            variant={
                              course.accessLevel === 'free'
                                ? 'success'
                                : course.accessLevel === 'premium'
                                ? 'gold'
                                : 'default'
                            }
                          >
                            {course.accessLevel}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight
                        size={18}
                        className="text-slate-300 group-hover:text-gold transition-colors flex-shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Community Activity */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-brand">Community Activity</h2>
                <Link
                  href="/community"
                  className="text-sm text-gold hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={32} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No posts yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      href="/community"
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand text-xs font-semibold flex items-center justify-center flex-shrink-0">
                        {post.userName
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand">{post.userName}</p>
                        <p className="text-sm text-slate-500 truncate">{post.content}</p>
                      </div>
                      <Badge variant="default" className="flex-shrink-0">
                        {post.category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-brand">Upcoming Classes</h2>
                <Link
                  href="/classes"
                  className="text-sm text-gold hover:underline flex items-center gap-1"
                >
                  All <ArrowRight size={14} />
                </Link>
              </div>

              {upcomingClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={32} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No upcoming classes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingClasses.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="p-4 bg-cream rounded-xl border border-slate-100"
                    >
                      <p className="font-medium text-brand text-sm mb-1">{cls.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={12} />
                        <span>{formatDateTime(cls.dateTime)}</span>
                      </div>
                      {cls.category && (
                        <Badge variant="gold" className="mt-2">
                          {cls.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick actions */}
            <Card>
              <h2 className="text-lg font-semibold text-brand mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'Browse courses', href: '/courses', icon: BookOpen },
                  { label: 'Join community', href: '/community', icon: Users },
                  { label: 'View resources', href: '/resources', icon: ArrowRight },
                  { label: 'Update profile', href: '/account', icon: ArrowRight },
                ].map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream transition-colors text-sm text-slate-600 hover:text-brand"
                  >
                    <action.icon size={16} className="text-gold" />
                    {action.label}
                    <ArrowRight size={14} className="ml-auto text-slate-300" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
