import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(activities)
}
