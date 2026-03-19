import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

const ADMIN_USER_ID = 'cmmrmc7fc00013i3sw69u7fj4'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, username: true, email: true, avatar: true, createdAt: true,
      cards: {
        orderBy: { createdAt: 'desc' },
        select: { id:true, player:true, sport:true, year:true, brand:true, grade:true, gradingCo:true, buy:true, val:true, sold:true, soldPrice:true, auto:true, createdAt:true }
      },
      _count: { select: { cards: true, wishes: true } }
    }
  })

  const allCards = users.flatMap(u => u.cards)
  const activeCards = allCards.filter(c => !c.sold)
  const soldCards = allCards.filter(c => c.sold)
  const totalPortfolioValue = activeCards.reduce((s,c) => s+(parseFloat(c.val)||parseFloat(c.buy)||0), 0)
  const totalInvested = activeCards.reduce((s,c) => s+(parseFloat(c.buy)||0), 0)
  const oneWeekAgo = new Date(Date.now() - 7*24*60*60*1000)
  const cardsThisWeek = allCards.filter(c => new Date(c.createdAt) > oneWeekAgo).length
  const mostActiveUser = [...users].sort((a,b) => b._count.cards - a._count.cards)[0]

  const usersOut = users.map(u => {
    const active = u.cards.filter(c => !c.sold)
    const portfolioValue = active.reduce((s,c) => s+(parseFloat(c.val)||parseFloat(c.buy)||0), 0)
    const invested = active.reduce((s,c) => s+(parseFloat(c.buy)||0), 0)
    return { id:u.id, username:u.username, email:u.email, avatar:u.avatar||null, createdAt:u.createdAt, cardCount:u._count.cards, wishCount:u._count.wishes, portfolioValue, invested, soldCount:u.cards.filter(c=>c.sold).length, cards:u.cards }
  })

  return NextResponse.json({
    users: usersOut,
    stats: { totalUsers:users.length, totalCards:allCards.length, totalActiveCards:activeCards.length, totalSoldCards:soldCards.length, totalPortfolioValue, totalInvested, cardsThisWeek, mostActiveUser:mostActiveUser?.username||'—', newestUser:users[0]?.username||'—', newestUserDate:users[0]?.createdAt||null }
  })
}
