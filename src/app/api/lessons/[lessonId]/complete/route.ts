export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { markLessonComplete } from '@/lib/airtable'

export async function POST(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const progress = await markLessonComplete(userId, params.lessonId)
    return NextResponse.json(progress)
  } catch (error) {
    console.error('POST /api/lessons/[lessonId]/complete error:', error)
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 })
  }
}
