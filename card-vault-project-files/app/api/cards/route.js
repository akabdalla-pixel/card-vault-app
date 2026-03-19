import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

async function saveSnapshot(userId) {
  try {
    const cards = await prisma.card.findMany({
      where: { userId, sold: false },
      select: { val: true, buy: true, qty: true }
    })
    const value = cards.reduce((sum, c) => sum + ((c.val || c.buy || 0) * (c.qty || 1)), 0)
    if (value <= 0) return
    await prisma.portfolioSnapshot.create({ data: { userId, value } })
  } catch(e) {}
}

export async function GET(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  if (searchParams.get('snapshots') === '1') {
    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 60,
    })
    return NextResponse.json(snapshots)
  }
  const cards = await prisma.card.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(cards)
}

export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const card = await prisma.card.create({
    data: {
      sport: data.sport||null,
      year: data.year ? String(data.year) : null,
      player: data.player,
      name: data.name||null,
      brand: data.brand||null,
      num: data.num||null,
      cond: data.cond||null,
      grade: data.grade||null,
      qty: parseInt(data.qty)||1,
      date: data.date||null,
      buy: parseFloat(data.buy)||0,
      val: parseFloat(data.val)||0,
      notes: data.notes||null,
      sold: false,
      rarity: data.rarity||null,
      edition: data.edition||null,
      language: data.language||null,
      auto: data.auto||false,
      gradingCo: data.gradingCo||null,
      autoGrade: data.autoGrade||null,
      purchaseDate: data.purchaseDate||null,
      imageUrl: data.imageUrl||null,
      userId
    }
  })
  try {
    await prisma.activity.create({
      data: {
        userId,
        type: 'added',
        player: data.player,
        sport: data.sport||null,
        detail: data.buy ? `Paid $${parseFloat(data.buy).toFixed(2)}` : null
      }
    })
  } catch(e) {}
  await saveSnapshot(userId)
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
      sport: data.sport||null,
      year: data.year ? String(data.year) : null,
      player: data.player,
      name: data.name||null,
      brand: data.brand||null,
      num: data.num||null,
      cond: data.cond||null,
      grade: data.grade||null,
      qty: parseInt(data.qty)||1,
      date: data.date||null,
      buy: parseFloat(data.buy)||0,
      val: parseFloat(data.val)||0,
      notes: data.notes||null,
      sold: data.sold||false,
      soldPrice: data.soldPrice ? parseFloat(data.soldPrice) : null,
      soldDate: data.soldDate||null,
      rarity: data.rarity||null,
      edition: data.edition||null,
      language: data.language||null,
      auto: data.auto||false,
      gradingCo: data.gradingCo||null,
      autoGrade: data.autoGrade||null,
      purchaseDate: data.purchaseDate||null,
      imageUrl: data.imageUrl||null,
    }
  })
  try {
    const oldVal = existing.val
    const newVal = parseFloat(data.val)||0
    if (!existing.sold && data.sold) {
      await prisma.activity.create({
        data: {
          userId,
          type: 'sold',
          player: data.player,
          sport: data.sport||null,
          detail: data.soldPrice ? `Sold for $${parseFloat(data.soldPrice).toFixed(2)}` : null
        }
      })
    } else if (Math.abs(oldVal - newVal) > 0.01) {
      await prisma.activity.create({
        data: {
          userId,
          type: 'price_update',
          player: data.player,
          sport: data.sport||null,
          detail: `$${oldVal.toFixed(2)} → $${newVal.toFixed(2)}`
        }
      })
    } else {
      await prisma.activity.create({
        data: {
          userId,
          type: 'edited',
          player: data.player,
          sport: data.sport||null,
          detail: null
        }
      })
    }
  } catch(e) {}
  await saveSnapshot(userId)
  return NextResponse.json(card)
}

export async function DELETE(req) {
  try {
    const userId = await getUser()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const existing = await prisma.card.findFirst({ where: { id, userId } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    try {
      await prisma.activity.create({
        data: {
          userId,
          type: 'deleted',
          player: existing.player,
          sport: existing.sport||null,
          detail: existing.val ? `Was valued at $${existing.val.toFixed(2)}` : null
        }
      })
    } catch(e) {}
    if (existing.imageUrl) {
      try {
        const cloudinary = (await import('@/lib/cloudinary')).default
        await cloudinary.uploader.destroy(`topload/cards/${id}`)
      } catch(e) {}
    }
    await prisma.card.delete({ where: { id } })
    await saveSnapshot(userId)
    return NextResponse.json({ ok: true })
  } catch(e) {
    console.error('DELETE /api/cards error:', e)
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
