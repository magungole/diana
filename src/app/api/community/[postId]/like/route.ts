export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateCommunityPost, getCommunityPostById } from '@/lib/airtable'

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current likes count
    const post = await getCommunityPostById(params.postId)
    const currentLikes = (post?.likesCount as number) || 0

    const updated = await updateCommunityPost(params.postId, {
      likesCount: currentLikes + 1,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('POST /api/community/[postId]/like error:', error)
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}
