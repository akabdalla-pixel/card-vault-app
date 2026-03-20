import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const friendId = searchParams.get('friendId')
  if (!friendId) return NextResponse.json({ error: 'friendId required' }, { status: 400 })

  // Verify friendship
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { requesterId: userId, recipientId: friendId },
        { requesterId: friendId, recipientId: userId },
      ],
    },
  })
  if (!friendship) return NextResponse.json({ error: 'Not friends' }, { status: 403 })

  const cards = await prisma.card.findMany({
    where: {
      userId: friendId,
      sold: { not: true },
      traded: { not: true },
    },
    select: {
      id: true, player: true, val: true, imageUrl: true,
      year: true, brand: true, gradingCo: true, grade: true, sport: true,
    },
    orderBy: { val: 'desc' },
  })

  // Map id → _id for mobile app
  return NextResponse.json(cards.map(c => ({ ...c, _id: c.id })))
}
