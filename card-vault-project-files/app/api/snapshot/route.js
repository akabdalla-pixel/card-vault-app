import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getUser()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 30,
    })
    return NextResponse.json(snapshots)
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const userId = await getUser()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { value } = await req.json()
    if (typeof value !== 'number' || value <= 0) return NextResponse.json({ error: 'Invalid value' }, { status: 400 })
    await prisma.portfolioSnapshot.create({ data: { userId, value } })
    return NextResponse.json({ ok: true })
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
