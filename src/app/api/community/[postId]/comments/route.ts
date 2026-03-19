export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCommentsByPost, createComment } from '@/lib/airtable'

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const comments = await getCommentsByPost(params.postId)
    return NextResponse.json(comments)
  } catch (error) {
    console.error('GET /api/community/[postId]/comments error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, userId, userName } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const comment = await createComment({
      postId: params.postId,
      content,
      userId: userId || (session.user as any).id,
      userName: userName || session.user?.name || 'Anonymous',
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('POST /api/community/[postId]/comments error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
