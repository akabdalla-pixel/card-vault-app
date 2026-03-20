import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

// Increase body size limit for this route (card images can be several MB as base64)
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// POST /api/cards/image  { cardId, base64 }  → uploads to Cloudinary, saves URL
// DELETE /api/cards/image  { cardId }         → removes from Cloudinary, clears URL
export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cardId, base64 } = await req.json()
  if (!cardId || !base64) {
    return NextResponse.json({ error: 'cardId and base64 are required' }, { status: 400 })
  }

  // Verify card belongs to this user
  const card = await prisma.card.findFirst({ where: { id: cardId, userId } })
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  try {
    const publicId = `topload/cards/${cardId}`
    const imageUrl = await uploadImage(base64, publicId)

    await prisma.card.update({
      where: { id: cardId },
      data: { imageUrl },
    })

    return NextResponse.json({ ok: true, imageUrl })
  } catch (e) {
    console.error('Image upload error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cardId } = await req.json()
  if (!cardId) return NextResponse.json({ error: 'cardId is required' }, { status: 400 })

  const card = await prisma.card.findFirst({ where: { id: cardId, userId } })
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  try {
    const publicId = `topload/cards/${cardId}`
    await deleteImage(publicId).catch(() => {})

    await prisma.card.update({
      where: { id: cardId },
      data: { imageUrl: null },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Image delete error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
