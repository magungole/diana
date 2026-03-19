export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllUsers, updateUser } from '@/lib/airtable'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await getAllUsers()
    // Remove sensitive fields
    const safeUsers = users.map(({ passwordHash, ...user }: any) => user)
    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error('GET /api/admin/users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, ...fields } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Only allow certain fields to be updated by admin
    const allowedFields: Record<string, any> = {}
    const allowed = ['role', 'niche', 'businessStage']
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        allowedFields[key] = fields[key]
      }
    }

    const user = await updateUser(userId, allowedFields)
    return NextResponse.json(user)
  } catch (error) {
    console.error('PATCH /api/admin/users error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
