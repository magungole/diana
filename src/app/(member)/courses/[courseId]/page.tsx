import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getCourseById,
  getModulesByCourse,
  getLessonsByModule,
  getUserProgress,
} from '@/lib/airtable'
import { notFound } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  PlayCircle,
  FileText,
  Download,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react'

interface PageProps {
  params: { courseId: string }
}

export default async function CoursePage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  let course: any = null
  let modules: any[] = []
  let progress: any[] = []

  try {
    ;[course, modules, progress] = await Promise.all([
      getCourseById(params.courseId),
      getModulesByCourse(params.courseId),
      getUserProgress(userId),
    ])
  } catch {
    notFound()
  }

  if (!course) notFound()

  // Fetch lessons for each module
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod: any) => {
      const lessons = await getLessonsByModule(mod.id)
      return { ...mod, lessons }
    })
  )

  const completedLessonIds = new Set(progress.map((p: any) => p.lessonId))
  const allLessons = modulesWithLessons.flatMap((m: any) => m.lessons)
  const completedCount = allLessons.filter((l: any) => completedLessonIds.has(l.id)).length
  const progressPercent =
    allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

  const lessonTypeIcon = (type: string) => {
    if (type === 'video') return PlayCircle
    if (type === 'download') return Download
    return FileText
  }

  const accessLevelColors: Record<string, any> = {
    free: 'success',
    member: 'default',
    premium: 'gold',
  }

  return (
    <div>
      <TopNav />
      <div className="p-8">
        {/* Back link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Course header */}
            <Card className="mb-6">
              <div
                className="h-48 rounded-xl mb-6 bg-gradient-to-br from-brand/20 to-gold/20 flex items-center justify-center"
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
                  <PlayCircle size={48} className="text-brand/30" />
                )}
              </div>

              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-brand">{course.title}</h1>
                <Badge variant={accessLevelColors[course.accessLevel] || 'default'} size="md">
                  {course.accessLevel}
                </Badge>
              </div>

              <p className="text-slate-500 leading-relaxed mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-slate-500 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gold" />
                  {modulesWithLessons.length} modules
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  {allLessons.length} lessons
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {completedCount} completed
                </span>
              </div>

              {/* Progress bar */}
              {allLessons.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Your progress</span>
                    <span className="font-semibold text-brand">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Modules */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand">Course Content</h2>
              {modulesWithLessons.length === 0 ? (
                <Card className="text-center py-10">
                  <p className="text-slate-400">No modules available yet</p>
                </Card>
              ) : (
                modulesWithLessons.map((mod: any) => (
                  <Card key={mod.id} padding="none" className="overflow-hidden">
                    <details className="group">
                      <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand text-sm font-semibold">
                            {mod.order}
                          </div>
                          <div>
                            <p className="font-semibold text-brand">{mod.title}</p>
                            <p className="text-xs text-slate-400">
                              {mod.lessons?.length || 0} lessons
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={18}
                          className="text-slate-400 group-open:rotate-180 transition-transform"
                        />
                      </summary>
                      <div className="border-t border-slate-100">
                        {mod.lessons?.map((lesson: any) => {
                          const Icon = lessonTypeIcon(lesson.lessonType)
                          const isCompleted = completedLessonIds.has(lesson.id)
                          return (
                            <Link
                              key={lesson.id}
                              href={`/courses/${params.courseId}/lessons/${lesson.id}`}
                              className="flex items-center gap-3 px-5 py-3 hover:bg-cream transition-colors border-b border-slate-50 last:border-0"
                            >
                              {isCompleted ? (
                                <CheckCircle2
                                  size={18}
                                  className="text-emerald-500 flex-shrink-0"
                                />
                              ) : (
                                <Icon
                                  size={18}
                                  className="text-slate-300 flex-shrink-0"
                                />
                              )}
                              <span
                                className={`flex-1 text-sm ${
                                  isCompleted ? 'text-emerald-600' : 'text-slate-600'
                                }`}
                              >
                                {lesson.title}
                              </span>
                              {lesson.duration && (
                                <span className="text-xs text-slate-400">
                                  {lesson.duration}
                                </span>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </details>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar — CTA */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <h3 className="font-semibold text-brand mb-4">Start learning</h3>
              {allLessons.length > 0 ? (
                <Link
                  href={`/courses/${params.courseId}/lessons/${allLessons[0].id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors mb-4"
                >
                  <PlayCircle size={18} />
                  {completedCount > 0 ? 'Continue course' : 'Start course'}
                </Link>
              ) : (
                <p className="text-slate-400 text-sm mb-4">No lessons available yet</p>
              )}

              <div className="space-y-3 text-sm text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Modules</span>
                  <span className="font-medium text-brand">{modulesWithLessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lessons</span>
                  <span className="font-medium text-brand">{allLessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Access level</span>
                  <Badge variant={accessLevelColors[course.accessLevel] || 'default'}>
                    {course.accessLevel}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Progress</span>
                  <span className="font-semibold text-brand">{progressPercent}%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
