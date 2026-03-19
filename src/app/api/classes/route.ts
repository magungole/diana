export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublishedClasses, getAllClasses, createClass } from '@/lib/airtable'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    let classes

    if ((session?.user as any)?.role === 'admin') {
      classes = await getAllClasses()
    } else {
      classes = await getPublishedClasses()
    }

    return NextResponse.json(classes)
  } catch (error) {
    console.error('GET /api/classes error:', error)
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const cls = await createClass(body)
    return NextResponse.json(cls, { status: 201 })
  } catch (error) {
    console.error('POST /api/classes error:', error)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}
