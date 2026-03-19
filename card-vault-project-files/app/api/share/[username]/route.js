import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, context) {
  try {
    const { username } = await context.params
    if (!username) return NextResponse.json({ error: 'No username' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { username: decodeURIComponent(username) },
      select: {
        username: true,
        avatar: true,
        cards: {
          where: { sold: false },
          select: {
            id: true, player: true, year: true, sport: true,
            brand: true, name: true, num: true, grade: true,
            gradingCo: true, auto: true, autoGrade: true, val: true, qty: true,
            cond: true, notes: true, createdAt: true, imageUrl: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const totalValue = user.cards.reduce((s, c) => s + (parseFloat(c.val) || 0) * (parseInt(c.qty) || 1), 0)
    return NextResponse.json({ username: user.username, avatar: user.avatar || null, cards: user.cards, totalValue, cardCount: user.cards.length })
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
