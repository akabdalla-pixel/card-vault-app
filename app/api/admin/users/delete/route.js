import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

const ADMIN_USER_ID = 'cmmrmc7fc00013i3sw69u7fj4'

export async function POST(req) {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { targetUserId } = await req.json()
  if (!targetUserId) return NextResponse.json({ error: 'targetUserId required' }, { status: 400 })

  // Prevent admin from deleting themselves
  if (targetUserId === ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 400 })
  }

  // Verify user exists
  const target = await prisma.user.findUnique({ where: { id: targetUserId } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  try {
    // Delete all related records in order (no cascade in schema, so manual)
    // 1. Delete card images from Cloudinary
    const cards = await prisma.card.findMany({
      where: { userId: targetUserId },
      select: { id: true, imageUrl: true },
    })

    // Try to clean up Cloudinary images (non-blocking)
    try {
      const cloudinary = (await import('@/lib/cloudinary')).default
      for (const card of cards) {
        if (card.imageUrl) {
          await cloudinary.uploader.destroy(`topload/cards/${card.id}`).catch(() => {})
        }
      }
      // Delete avatar too
      if (target.avatar) {
        await cloudinary.uploader.destroy(`topload/avatars/${targetUserId}`).catch(() => {})
      }
    } catch (e) {
      // Cloudinary cleanup is best-effort
    }

    // 2. Delete all related data
    await prisma.activity.deleteMany({ where: { userId: targetUserId } })
    await prisma.portfolioSnapshot.deleteMany({ where: { userId: targetUserId } })
    await prisma.wish.deleteMany({ where: { userId: targetUserId } })
    await prisma.card.deleteMany({ where: { userId: targetUserId } })

    // 3. Delete friendships (both directions)
    await prisma.friendship.deleteMany({
      where: { OR: [{ requesterId: targetUserId }, { recipientId: targetUserId }] },
    })

    // 4. Delete trades (both directions)
    await prisma.trade.deleteMany({
      where: { OR: [{ proposerId: targetUserId }, { receiverId: targetUserId }] },
    })

    // 5. Delete the user
    await prisma.user.delete({ where: { id: targetUserId } })

    return NextResponse.json({
      ok: true,
      deleted: {
        username: target.username,
        cards: cards.length,
      },
    })
  } catch (e) {
    console.error('Delete user error:', e)
    return NextResponse.json({ error: e.message || 'Failed to delete user' }, { status: 500 })
  }
}
