import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Accepted friends
  const accepted = await prisma.friendship.findMany({
    where: {
      status: 'accepted',
      OR: [{ requesterId: userId }, { recipientId: userId }],
    },
    include: {
      requester: { select: { id: true, username: true } },
      recipient: { select: { id: true, username: true } },
    },
  })

  const friends = accepted.map(f => {
    const other = f.requesterId === userId ? f.recipient : f.requester
    return { friendshipId: f.id, userId: other.id, username: other.username }
  })

  // Incoming pending
  const pendingIn = await prisma.friendship.findMany({
    where: { status: 'pending', recipientId: userId },
    include: { requester: { select: { id: true, username: true } } },
  })

  const incoming = pendingIn.map(f => ({
    friendshipId: f.id, userId: f.requester.id, username: f.requester.username,
  }))

  // Outgoing pending
  const pendingOut = await prisma.friendship.findMany({
    where: { status: 'pending', requesterId: userId },
    include: { recipient: { select: { id: true, username: true } } },
  })

  const sent = pendingOut.map(f => ({
    friendshipId: f.id, userId: f.recipient.id, username: f.recipient.username,
  }))

  return NextResponse.json({ friends, incoming, sent })
}
