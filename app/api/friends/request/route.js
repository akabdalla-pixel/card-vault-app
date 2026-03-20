import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { recipientId } = await req.json()
  if (!recipientId) return NextResponse.json({ error: 'recipientId required' }, { status: 400 })
  if (recipientId === userId) return NextResponse.json({ error: "Can't add yourself" }, { status: 400 })

  // Check if friendship exists in either direction
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userId, recipientId: recipientId },
        { requesterId: recipientId, recipientId: userId },
      ],
    },
  })

  if (existing) {
    if (existing.status === 'accepted') return NextResponse.json({ error: 'Already friends' }, { status: 400 })
    if (existing.status === 'pending') return NextResponse.json({ error: 'Request already pending' }, { status: 400 })
    if (existing.status === 'declined') {
      await prisma.friendship.update({
        where: { id: existing.id },
        data: { requesterId: userId, recipientId: recipientId, status: 'pending' },
      })
      return NextResponse.json({ ok: true })
    }
  }

  await prisma.friendship.create({
    data: { requesterId: userId, recipientId: recipientId },
  })
  return NextResponse.json({ ok: true })
}
