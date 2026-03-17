import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function getUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  try {
    const decoded = verify(token, JWT_SECRET)
    return decoded.userId
  } catch { return null }
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const snapshots = await prisma.portfolioSnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: 30,
  })
  return NextResponse.json(snapshots)
}

export async function POST(req) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { value } = await req.json()
  if (typeof value !== 'number') return NextResponse.json({ error: 'Invalid value' }, { status: 400 })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const existing = await prisma.portfolioSnapshot.findFirst({
    where: { userId, createdAt: { gte: today, lt: tomorrow } }
  })
  if (existing) {
    await prisma.portfolioSnapshot.update({ where: { id: existing.id }, data: { value } })
  } else {
    await prisma.portfolioSnapshot.create({ data: { userId, value } })
  }
  return NextResponse.json({ ok: true })
}
