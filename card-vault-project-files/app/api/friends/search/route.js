import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const users = await prisma.user.findMany({
    where: {
      id: { not: userId },
      username: { contains: q, mode: 'insensitive' },
    },
    select: { id: true, username: true },
    take: 20,
  })

  // Map id → _id for mobile app compatibility
  return NextResponse.json(users.map(u => ({ _id: u.id, username: u.username })))
}
