export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCourseById, getModulesByCourse, getLessonsByModule } from '@/lib/airtable'

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const course = await getCourseById(params.courseId)
    const modules = await getModulesByCourse(params.courseId)

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod: any) => {
        const lessons = await getLessonsByModule(mod.id)
        return { ...mod, lessons }
      })
    )

    return NextResponse.json({ ...course, modules: modulesWithLessons })
  } catch (error) {
    console.error('GET /api/courses/[courseId] error:', error)
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }
}
