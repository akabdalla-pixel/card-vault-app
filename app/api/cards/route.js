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
      sold: false,
      rarity: data.rarity || null,
      edition: data.edition || null,
      language: data.language || null,
      auto: data.auto || false,
      gradingCo: data.gradingCo || null,
      autoGrade: data.autoGrade || null,
      userId
    }
  })

  // Log activity
  try {
    await prisma.activity.create({
      data: {
        userId,
        type: 'added',
        player: data.player,
        sport: data.sport || null,
        detail: data.buy ? `Paid $${parseFloat(data.buy).toFixed(2)}` : null
      }
    })
  } catch(e) {}

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
      sold: data.sold || false,
      soldPrice: data.soldPrice ? parseFloat(data.soldPrice) : null,
      soldDate: data.soldDate || null,
      rarity: data.rarity || null,
      edition: data.edition || null,
      language: data.language || null,
      auto: data.auto || false,
      gradingCo: data.gradingCo || null,
      autoGrade: data.autoGrade || null,
    }
  })

  // Log activity - detect what changed
  try {
    const oldVal = existing.val
    const newVal = parseFloat(data.val) || 0
    const wasSold = existing.sold
    const nowSold = data.sold || false

    if (!wasSold && nowSold) {
      await prisma.activity.create({
        data: {
          userId,
          type: 'sold',
          player: data.player,
          sport: data.sport || null,
          detail: data.soldPrice ? `Sold for $${parseFloat(data.soldPrice).toFixed(2)}` : null
        }
      })
    } else if (Math.abs(oldVal - newVal) > 0.01) {
      await prisma.activity.create({
        data: {
          userId,
          type: 'price_update',
          player: data.player,
          sport: data.sport || null,
          detail: `$${oldVal.toFixed(2)} → $${newVal.toFixed(2)}`
        }
      })
    } else {
      await prisma.activity.create({
        data: {
          userId,
          type: 'edited',
          player: data.player,
          sport: data.sport || null,
          detail: null
        }
      })
    }
  } catch(e) {}

  return NextResponse.json(card)
}

export async function DELETE(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const existing = await prisma.card.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Log before deleting
  try {
    await prisma.activity.create({
      data: {
        userId,
        type: 'deleted',
        player: existing.player,
        sport: existing.sport || null,
        detail: existing.val ? `Was valued at $${existing.val.toFixed(2)}` : null
      }
    })
  } catch(e) {}

  await prisma.card.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
