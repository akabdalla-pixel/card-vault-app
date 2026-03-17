import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getUser()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    return NextResponse.json({ count: snapshots.length, snapshots })
  } catch(e) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
  }
}
