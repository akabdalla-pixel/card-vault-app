import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tradeId, action } = await req.json()
  if (!tradeId || !['accept', 'decline', 'cancel'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: {
      proposer: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } },
    },
  })
  if (!trade) return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
  if (trade.status !== 'pending') return NextResponse.json({ error: 'Trade already resolved' }, { status: 400 })

  // Cancel — only proposer
  if (action === 'cancel') {
    if (trade.proposerId !== userId) return NextResponse.json({ error: 'Not your trade' }, { status: 403 })
    await prisma.trade.update({ where: { id: tradeId }, data: { status: 'cancelled' } })
    return NextResponse.json({ ok: true, status: 'cancelled' })
  }

  // Accept/Decline — only receiver
  if (trade.receiverId !== userId) return NextResponse.json({ error: 'Not your trade' }, { status: 403 })

  if (action === 'decline') {
    await prisma.trade.update({ where: { id: tradeId }, data: { status: 'declined' } })
    return NextResponse.json({ ok: true, status: 'declined' })
  }

  // ACCEPT — transfer cards (mark originals as traded, create copies for receiver)

  const pCards = trade.proposerCardIds.length
    ? await prisma.card.findMany({
        where: { id: { in: trade.proposerCardIds }, userId: trade.proposerId, sold: { not: true }, traded: { not: true } },
      })
    : []
  const rCards = trade.receiverCardIds.length
    ? await prisma.card.findMany({
        where: { id: { in: trade.receiverCardIds }, userId: trade.receiverId, sold: { not: true }, traded: { not: true } },
      })
    : []

  if (pCards.length !== trade.proposerCardIds.length || rCards.length !== trade.receiverCardIds.length) {
    await prisma.trade.update({ where: { id: tradeId }, data: { status: 'cancelled' } })
    return NextResponse.json({ error: 'Some cards no longer available — trade cancelled' }, { status: 400 })
  }

  const now = new Date()

  // Proposer's cards → mark original traded, create copy for receiver
  for (const card of pCards) {
    await prisma.card.update({
      where: { id: card.id },
      data: {
        traded: true,
        tradedTo: trade.receiver.username,
        tradedFrom: trade.proposer.username,
        tradedAt: now,
        tradeId: trade.id,
        originalUserId: card.userId,
      },
    })

    const { id, userId, createdAt, updatedAt, sold, soldPrice, soldDate, traded, tradedTo, tradedFrom, tradedAt, tradeId: _tid, originalUserId, ...cardData } = card
    await prisma.card.create({
      data: {
        ...cardData,
        userId: trade.receiverId,
        tradedFrom: trade.proposer.username,
        tradedAt: now,
        tradeId: trade.id,
        originalUserId: card.userId,
      },
    })
  }

  // Receiver's cards → mark original traded, create copy for proposer
  for (const card of rCards) {
    await prisma.card.update({
      where: { id: card.id },
      data: {
        traded: true,
        tradedTo: trade.proposer.username,
        tradedFrom: trade.receiver.username,
        tradedAt: now,
        tradeId: trade.id,
        originalUserId: card.userId,
      },
    })

    const { id, userId, createdAt, updatedAt, sold, soldPrice, soldDate, traded, tradedTo, tradedFrom, tradedAt, tradeId: _tid, originalUserId, ...cardData } = card
    await prisma.card.create({
      data: {
        ...cardData,
        userId: trade.proposerId,
        tradedFrom: trade.receiver.username,
        tradedAt: now,
        tradeId: trade.id,
        originalUserId: card.userId,
      },
    })
  }

  await prisma.trade.update({ where: { id: tradeId }, data: { status: 'accepted' } })
  return NextResponse.json({ ok: true, status: 'accepted' })
}
