import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { friendshipId } = await req.json()
  if (!friendshipId) return NextResponse.json({ error: 'Missing friendshipId' }, { status: 400 })

  const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } })
  if (!friendship) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (friendship.requesterId !== userId && friendship.recipientId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.friendship.delete({ where: { id: friendshipId } })
  return NextResponse.json({ ok: true })
}
