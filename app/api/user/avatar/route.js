import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

// GET — return current user's avatar URL
export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar: true } })
  return NextResponse.json({ avatar: user?.avatar || null })
}

// POST — upload base64 image to Cloudinary, store resulting URL
export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { avatar } = await req.json()

  // Removing avatar
  if (!avatar) {
    await prisma.user.update({ where: { id: userId }, data: { avatar: null } })
    return NextResponse.json({ ok: true, avatar: null })
  }

  if (!avatar.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
  }

  // Upload to Cloudinary — folder "topload/avatars", keyed by userId so re-uploads overwrite
  let result
  try {
    result = await cloudinary.uploader.upload(avatar, {
      public_id: `topload/avatars/${userId}`,
      overwrite: true,
      transformation: [{ width: 128, height: 128, crop: 'fill', gravity: 'face' }],
      format: 'jpg',
    })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return NextResponse.json({ error: 'Cloudinary upload failed', detail: err?.message || String(err) }, { status: 500 })
  }

  const url = result.secure_url
  await prisma.user.update({ where: { id: userId }, data: { avatar: url } })
  return NextResponse.json({ ok: true, avatar: url })
}
