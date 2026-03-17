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

// GET — fetch last 30 snapshots for chart
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

// POST — save a new snapshot every time called (no dedup)
export async function POST(req) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { value } = await req.json()
  if (typeof value !== 'number' || value <= 0) return NextResponse.json({ error: 'Invalid value' }, { status: 400 })

  await prisma.portfolioSnapshot.create({ data: { userId, value } })

  return NextResponse.json({ ok: true })
}
