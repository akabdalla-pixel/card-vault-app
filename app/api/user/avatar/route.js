import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET — return current user's avatar
export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar: true } })
  return NextResponse.json({ avatar: user?.avatar || null })
}

// POST — save base64 avatar (resized client-side to 128x128)
export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { avatar } = await req.json()

  // Basic validation — must be a data URL image
  if (avatar && !avatar.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
  }

  // Rough size check — 128x128 JPEG base64 is ~15-25KB; reject anything over 200KB
  if (avatar && avatar.length > 200000) {
    return NextResponse.json({ error: 'Image too large' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: userId }, data: { avatar: avatar || null } })
  return NextResponse.json({ ok: true })
}
