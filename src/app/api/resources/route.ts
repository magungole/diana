export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getResources, createResource } from '@/lib/airtable'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined

    const resources = await getResources(category)
    return NextResponse.json(resources)
  } catch (error) {
    console.error('GET /api/resources error:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const resource = await createResource(body)
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('POST /api/resources error:', error)
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
