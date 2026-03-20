import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { friendshipId, action } = await req.json()
  if (!friendshipId || !['accept', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } })
  if (!friendship || friendship.recipientId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (friendship.status !== 'pending') {
    return NextResponse.json({ error: 'Already responded' }, { status: 400 })
  }

  const newStatus = action === 'accept' ? 'accepted' : 'declined'
  await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: newStatus },
  })

  return NextResponse.json({ ok: true, status: newStatus })
}
