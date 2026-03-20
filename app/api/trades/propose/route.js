import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { receiverId, proposerCards, receiverCards, proposerCash, receiverCash, message } = await req.json()
  if (!receiverId) return NextResponse.json({ error: 'receiverId required' }, { status: 400 })

  // Verify friendship
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { requesterId: userId, recipientId: receiverId },
        { requesterId: receiverId, recipientId: userId },
      ],
    },
  })
  if (!friendship) return NextResponse.json({ error: 'Not friends' }, { status: 400 })

  // Verify proposer owns their cards
  if (proposerCards?.length) {
    const myCards = await prisma.card.findMany({
      where: {
        id: { in: proposerCards },
        userId: userId,
        sold: { not: true },
        traded: { not: true },
      },
    })
    if (myCards.length !== proposerCards.length) {
      return NextResponse.json({ error: 'Some of your cards are unavailable' }, { status: 400 })
    }
  }

  // Verify receiver owns their cards
  if (receiverCards?.length) {
    const theirCards = await prisma.card.findMany({
      where: {
        id: { in: receiverCards },
        userId: receiverId,
        sold: { not: true },
        traded: { not: true },
      },
    })
    if (theirCards.length !== receiverCards.length) {
      return NextResponse.json({ error: 'Some of their cards are unavailable' }, { status: 400 })
    }
  }

  const trade = await prisma.trade.create({
    data: {
      proposerId: userId,
      receiverId: receiverId,
      proposerCardIds: proposerCards || [],
      receiverCardIds: receiverCards || [],
      proposerCash: proposerCash || 0,
      receiverCash: receiverCash || 0,
      message: message || '',
    },
  })

  return NextResponse.json({ ok: true, tradeId: trade.id })
}
