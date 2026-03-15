import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cards = await prisma.card.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(cards)
}

export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const card = await prisma.card.create({
    data: {
      sport: data.sport || null,
      year: data.year || null,
      player: data.player,
      name: data.name || null,
      brand: data.brand || null,
      num: data.num || null,
      cond: data.cond || null,
      grade: data.grade || null,
      qty: parseInt(data.qty) || 1,
      date: data.date || null,
      buy: parseFloat(data.buy) || 0,
      val: parseFloat(data.val) || 0,
      notes: data.notes || null,
      userId
    }
  })
  return NextResponse.json(card)
}

export async function PUT(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const existing = await prisma.card.findFirst({ where: { id: data.id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const card = await prisma.card.update({
    where: { id: data.id },
    data: {
      sport: data.sport || null,
      year: data.year || null,
      player: data.player,
      name: data.name || null,
      brand: data.brand || null,
      num: data.num || null,
      cond: data.cond || null,
      grade: data.grade || null,
      qty: parseInt(data.qty) || 1,
      date: data.date || null,
      buy: parseFloat(data.buy) || 0,
      val: parseFloat(data.val) || 0,
      notes: data.notes || null,
    }
  })
  return NextResponse.json(card)
}

export async function DELETE(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const existing = await prisma.card.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.card.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
