import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

const ADMIN_USER_ID = 'cmmrmc7fc00013i3sw69u7fj4'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const trades = await prisma.trade.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      proposer: { select: { id: true, username: true, avatar: true } },
      receiver: { select: { id: true, username: true, avatar: true } },
    },
    take: 100,
  })

  // Fetch all card IDs referenced in trades
  const allCardIds = trades.flatMap(t => [...t.proposerCardIds, ...t.receiverCardIds])
  const cards = allCardIds.length > 0
    ? await prisma.card.findMany({
        where: { id: { in: allCardIds } },
        select: { id: true, player: true, sport: true, year: true, brand: true, grade: true, gradingCo: true, autoGrade: true, auto: true, buy: true, val: true, imageUrl: true, num: true },
      })
    : []

  const cardMap = Object.fromEntries(cards.map(c => [c.id, c]))

  const result = trades.map(trade => ({
    id: trade.id,
    proposer: { id: trade.proposer.id, username: trade.proposer.username, avatar: trade.proposer.avatar },
    receiver: { id: trade.receiver.id, username: trade.receiver.username, avatar: trade.receiver.avatar },
    proposerCards: trade.proposerCardIds.map(id => cardMap[id] || { id, player: '(deleted)', missing: true }),
    receiverCards: trade.receiverCardIds.map(id => cardMap[id] || { id, player: '(deleted)', missing: true }),
    proposerCash: trade.proposerCash,
    receiverCash: trade.receiverCash,
    status: trade.status,
    message: trade.message,
    createdAt: trade.createdAt,
    updatedAt: trade.updatedAt,
  }))

  return NextResponse.json({
    trades: result,
    stats: {
      total: trades.length,
      pending: trades.filter(t => t.status === 'pending').length,
      accepted: trades.filter(t => t.status === 'accepted').length,
      declined: trades.filter(t => t.status === 'declined').length,
      cancelled: trades.filter(t => t.status === 'cancelled').length,
    },
  })
}
