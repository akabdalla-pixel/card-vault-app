import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const payload = verifyToken(token)
    return payload?.userId || null
  } catch { return null }
}

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ theme: 'Purple' })
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { theme: true } })
    return NextResponse.json({ theme: user?.theme || 'Purple' })
  } catch {
    return NextResponse.json({ theme: 'Purple' })
  }
}

export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { theme } = await req.json()
    await prisma.user.update({ where: { id: userId }, data: { theme } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
