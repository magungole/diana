export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublishedCourses, getAllCourses, createCourse } from '@/lib/airtable'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    let courses

    if ((session?.user as any)?.role === 'admin') {
      courses = await getAllCourses()
    } else {
      courses = await getPublishedCourses()
    }

    return NextResponse.json(courses)
  } catch (error) {
    console.error('GET /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const course = await createCourse(body)
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('POST /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
