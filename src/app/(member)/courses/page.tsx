import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublishedCourses, getUserProgress, getLessonsByCourse } from '@/lib/airtable'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PlayCircle, BookOpen, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  let courses: any[] = []
  let progress: any[] = []

  try {
    ;[courses, progress] = await Promise.all([
      getPublishedCourses(),
      getUserProgress(userId),
    ])
  } catch (error) {
    console.error('Courses fetch error:', error)
  }

  const completedLessonIds = new Set(progress.map((p: any) => p.lessonId))

  const accessLevelColors: Record<string, any> = {
    free: 'success',
    member: 'default',
    premium: 'gold',
  }

  const gradients = [
    'from-slate-800 to-slate-600',
    'from-amber-700 to-amber-500',
    'from-blue-800 to-blue-600',
    'from-emerald-700 to-emerald-500',
    'from-purple-700 to-purple-500',
    'from-rose-700 to-rose-500',
  ]

  return (
    <div>
      <TopNav title="Courses" />
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand mb-2">Your Courses</h1>
          <p className="text-slate-500">
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-20">
            <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No courses yet</h3>
            <p className="text-slate-400 text-sm">
              Check back soon — new courses are added regularly.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any, index: number) => {
              const gradient = gradients[index % gradients.length]

              return (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card
                    padding="none"
                    hover
                    className="overflow-hidden group h-full flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div
                      className={`h-44 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
                      style={
                        course.thumbnail
                          ? {
                              backgroundImage: `url(${course.thumbnail})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : {}
                      }
                    >
                      {!course.thumbnail && (
                        <PlayCircle
                          size={40}
                          className="text-white/40 group-hover:text-white/70 transition-colors"
                        />
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant={accessLevelColors[course.accessLevel] || 'default'}>
                          {course.accessLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold text-brand text-lg mb-2 group-hover:text-gold transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {course.moduleCount || 0} modules
                          </span>
                          {course.lessonCount && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {course.lessonCount} lessons
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-slate-300 group-hover:text-gold transition-colors"
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
