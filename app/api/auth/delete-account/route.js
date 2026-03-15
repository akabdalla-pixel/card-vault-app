import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { verifyToken } = await import('@/lib/auth')
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

    // Delete all cards first, then the user
    await prisma.card.deleteMany({ where: { userId: payload.userId } })
    await prisma.user.delete({ where: { id: payload.userId } })

    // Clear cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('token', '', { maxAge: 0, path: '/' })
    return response
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
