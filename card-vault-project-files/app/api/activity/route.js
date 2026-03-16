import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Keep only latest 3 - delete older ones
  const all = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  if (all.length > 3) {
    const toDelete = all.slice(3).map(a => a.id)
    await prisma.activity.deleteMany({ where: { id: { in: toDelete } } })
  }

  return NextResponse.json(all.slice(0, 3))
}
