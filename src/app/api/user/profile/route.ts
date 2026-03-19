export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserById, updateUser } from '@/lib/airtable'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive fields
    const { passwordHash, ...safeUser } = user
    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('GET /api/user/profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()

    // Only allow updating safe fields
    const allowedFields: Record<string, any> = {}
    const allowed = ['name', 'bio', 'niche', 'businessStage', 'profilePhoto']
    for (const key of allowed) {
      if (body[key] !== undefined) {
        allowedFields[key] = body[key]
      }
    }

    const user = await updateUser(userId, allowedFields)
    return NextResponse.json(user)
  } catch (error) {
    console.error('PATCH /api/user/profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
