import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

// Only this user ID can access the admin panel
const ADMIN_USER_ID = 'cmmrmc7fc00013i3sw69u7fj4'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      _count: {
        select: { cards: true, wishes: true }
      }
    }
  })

  return NextResponse.json(users)
}
