import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const userId = await getUser(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const friendRequests = await prisma.friendship.count({
    where: { recipientId: userId, status: 'pending' },
  })

  const tradeOffers = await prisma.trade.count({
    where: { receiverId: userId, status: 'pending' },
  })

  return NextResponse.json({ friendRequests, tradeOffers })
}
