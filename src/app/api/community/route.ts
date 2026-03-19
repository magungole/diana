export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCommunityPosts, createCommunityPost } from '@/lib/airtable'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined

    const posts = await getCommunityPosts(category)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/community error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { content, category, userId, userName, userPhoto } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const post = await createCommunityPost({
      content,
      category: category || 'general',
      userId: userId || (session.user as any).id,
      userName: userName || session.user?.name || 'Anonymous',
      userPhoto: userPhoto || session.user?.image || '',
      isPinned: false,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('POST /api/community error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
