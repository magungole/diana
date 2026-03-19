'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Download,
  BookOpen,
  PlayCircle,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getLoomEmbedUrl } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  lessonType: 'video' | 'text' | 'download'
  duration?: string
  resourceUrl?: string
  resourceName?: string
  moduleId: string
  courseId: string
  order: number
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [marking, setMarking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, lessonRes] = await Promise.all([
          fetch(`/api/courses/${params.courseId}`),
          fetch(`/api/courses/${params.courseId}`),
        ])

        const courseData = await courseRes.json()
        if (courseData.modules) {
          setModules(courseData.modules)
        }

        // Find lesson from modules
        const allLessons: Lesson[] = courseData.modules?.flatMap(
          (m: Module) => m.lessons
        ) || []
        const found = allLessons.find((l) => l.id === params.lessonId)
        if (found) setLesson(found)

        // Fetch user progress
        const progressRes = await fetch('/api/user/progress')
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          setCompletedIds(new Set(progressData.map((p: any) => p.lessonId)))
        }
      } catch (error) {
        console.error('Lesson fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.courseId, params.lessonId])

  const allLessons = modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === params.lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  async function markComplete() {
    if (completedIds.has(params.lessonId)) return
    setMarking(true)
    try {
      const res = await fetch(`/api/lessons/${params.lessonId}/complete`, {
        method: 'POST',
      })
      if (res.ok) {
        setCompletedIds((prev) => new Set([...prev, params.lessonId]))
        if (nextLesson) {
          router.push(`/courses/${params.courseId}/lessons/${nextLesson.id}`)
        }
      }
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-gold border-t-transparent" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Lesson not found</p>
          <Link href={`/courses/${params.courseId}`} className="text-gold hover:underline">
            Back to course
          </Link>
        </div>
      </div>
    )
  }

  const isCompleted = completedIds.has(lesson.id)

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Course outline sidebar */}
      <div className="hidden xl:flex w-72 bg-white border-r border-slate-100 flex-col fixed left-60 top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <Link
            href={`/courses/${params.courseId}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors"
          >
            <ArrowLeft size={14} />
            Back to course
          </Link>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {modules.map((mod) => (
            <div key={mod.id}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                {mod.title}
              </p>
              <div className="space-y-1">
                {mod.lessons.map((l) => {
                  const isActive = l.id === params.lessonId
                  const isDone = completedIds.has(l.id)
                  return (
                    <Link
                      key={l.id}
                      href={`/courses/${params.courseId}/lessons/${l.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-gold/10 text-gold font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle
                          size={14}
                          className={`flex-shrink-0 ${isActive ? 'text-gold' : 'text-slate-300'}`}
                        />
                      )}
                      <span className="truncate">{l.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main lesson content */}
      <div className="flex-1 xl:ml-72">
        {/* Breadcrumb nav */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/courses" className="hover:text-brand transition-colors">
              Courses
            </Link>
            <span>/</span>
            <Link
              href={`/courses/${params.courseId}`}
              className="hover:text-brand transition-colors"
            >
              Course
            </Link>
            <span>/</span>
            <span className="text-brand font-medium truncate max-w-xs">{lesson.title}</span>
          </div>
          <div className="flex items-center gap-3">
            {prevLesson && (
              <Link
                href={`/courses/${params.courseId}/lessons/${prevLesson.id}`}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand transition-colors"
              >
                <ArrowLeft size={16} />
                Previous
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/courses/${params.courseId}/lessons/${nextLesson.id}`}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand transition-colors"
              >
                Next
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        <div className="p-8 max-w-4xl">
          {/* Lesson header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant={lesson.lessonType === 'video' ? 'default' : lesson.lessonType === 'download' ? 'gold' : 'outline'}>
                {lesson.lessonType}
              </Badge>
              {lesson.duration && (
                <span className="text-sm text-slate-400">{lesson.duration}</span>
              )}
              {isCompleted && (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <CheckCircle2 size={14} />
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-brand">{lesson.title}</h1>
          </div>

          {/* Video embed */}
          {lesson.videoUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-8 shadow-lg">
              <iframe
                src={getLoomEmbedUrl(lesson.videoUrl)}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title={lesson.title}
              />
            </div>
          )}

          {/* Content */}
          {lesson.content && (
            <div className="bg-white rounded-2xl p-8 mb-6 border border-slate-100">
              <div
                className="prose-diana max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }}
              />
            </div>
          )}

          {/* Resource download */}
          {lesson.resourceUrl && (
            <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Download size={20} className="text-gold" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand">
                  {lesson.resourceName || 'Download Resource'}
                </p>
                <p className="text-sm text-slate-400">Lesson worksheet / resource</p>
              </div>
              <a
                href={lesson.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                <Download size={14} />
                Download
              </a>
            </div>
          )}

          {/* Navigation and mark complete */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-slate-100">
            <div>
              {prevLesson && (
                <Link
                  href={`/courses/${params.courseId}/lessons/${prevLesson.id}`}
                  className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors text-sm"
                >
                  <ArrowLeft size={16} />
                  {prevLesson.title}
                </Link>
              )}
            </div>

            <Button
              onClick={markComplete}
              loading={marking}
              variant={isCompleted ? 'ghost' : 'secondary'}
              className="flex items-center gap-2"
              disabled={isCompleted}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={16} />
                  Completed
                </>
              ) : nextLesson ? (
                'Mark complete & continue'
              ) : (
                'Mark as complete'
              )}
            </Button>

            <div>
              {nextLesson && (
                <Link
                  href={`/courses/${params.courseId}/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 text-slate-500 hover:text-brand transition-colors text-sm"
                >
                  {nextLesson.title}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
