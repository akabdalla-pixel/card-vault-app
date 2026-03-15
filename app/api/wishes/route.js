import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const wishes = await prisma.wish.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(wishes)
}

export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const wish = await prisma.wish.create({
    data: {
      pri: data.pri || 'medium',
      sport: data.sport || null,
      player: data.player,
      name: data.name || null,
      year: data.year || null,
      brand: data.brand || null,
      target: parseFloat(data.target) || 0,
      market: parseFloat(data.market) || 0,
      status: data.status || 'watching',
      notes: data.notes || null,
      userId
    }
  })
  return NextResponse.json(wish)
}

export async function PUT(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const existing = await prisma.wish.findFirst({ where: { id: data.id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const wish = await prisma.wish.update({
    where: { id: data.id },
    data: {
      pri: data.pri || 'medium',
      sport: data.sport || null,
      player: data.player,
      name: data.name || null,
      year: data.year || null,
      brand: data.brand || null,
      target: parseFloat(data.target) || 0,
      market: parseFloat(data.market) || 0,
      status: data.status || 'watching',
      notes: data.notes || null,
    }
  })
  return NextResponse.json(wish)
}

export async function DELETE(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const existing = await prisma.wish.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.wish.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
