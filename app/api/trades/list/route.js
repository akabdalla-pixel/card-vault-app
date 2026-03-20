import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const trades = await prisma.trade.findMany({
    where: {
      OR: [{ proposerId: userId }, { receiverId: userId }],
    },
    include: {
      proposer: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  // For each trade, fetch the actual card objects
  const result = await Promise.all(trades.map(async (trade) => {
    const proposerCards = trade.proposerCardIds.length
      ? await prisma.card.findMany({
          where: { id: { in: trade.proposerCardIds } },
          select: { id: true, player: true, val: true, imageUrl: true, year: true, brand: true, gradingCo: true, grade: true },
        })
      : []

    const receiverCards = trade.receiverCardIds.length
      ? await prisma.card.findMany({
          where: { id: { in: trade.receiverCardIds } },
          select: { id: true, player: true, val: true, imageUrl: true, year: true, brand: true, gradingCo: true, grade: true },
        })
      : []

    return {
      _id: trade.id,
      proposer: { _id: trade.proposer.id, username: trade.proposer.username },
      receiver: { _id: trade.receiver.id, username: trade.receiver.username },
      proposerCards: proposerCards.map(c => ({ ...c, _id: c.id })),
      receiverCards: receiverCards.map(c => ({ ...c, _id: c.id })),
      proposerCash: trade.proposerCash,
      receiverCash: trade.receiverCash,
      status: trade.status,
      message: trade.message,
      createdAt: trade.createdAt,
    }
  }))

  return NextResponse.json(result)
}
