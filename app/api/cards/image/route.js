import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

// POST — upload a card image to Cloudinary, store URL on the card
export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cardId, image } = await req.json()
  if (!cardId) return NextResponse.json({ error: 'Missing cardId' }, { status: 400 })

  // Verify this card belongs to the authenticated user
  const card = await prisma.card.findUnique({ where: { id: cardId }, select: { userId: true } })
  if (!card || card.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Removing image
  if (!image) {
    await prisma.card.update({ where: { id: cardId }, data: { imageUrl: null } })
    return NextResponse.json({ ok: true, imageUrl: null })
  }

  if (!image.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
  }

  let result
  try {
    result = await cloudinary.uploader.upload(image, {
      public_id: `topload/cards/${cardId}`,
      overwrite: true,
      // PSA slab ratio (3.75"×5.5"), preserve full image, no cropping
      transformation: [{ width: 400, height: 587, crop: 'fit' }],
      format: 'jpg',
    })
  } catch (err) {
    console.error('Cloudinary card image upload error:', err)
    return NextResponse.json({ error: 'Upload failed', detail: err?.message || String(err) }, { status: 500 })
  }

  const imageUrl = result.secure_url
  await prisma.card.update({ where: { id: cardId }, data: { imageUrl } })
  return NextResponse.json({ ok: true, imageUrl })
}
