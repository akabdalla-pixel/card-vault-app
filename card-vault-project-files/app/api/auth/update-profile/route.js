import { PrismaClient } from '@prisma/client'
import { getUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const userId = await getUser()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { name } = await req.json()
    const trimmed = name?.trim()
    if (!trimmed) return Response.json({ error: 'Name is required' }, { status: 400 })

    // Sanitize: lowercase, replace spaces with hyphens, strip special chars
    const sanitized = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
    if (!sanitized) return Response.json({ error: 'Name contains invalid characters' }, { status: 400 })

    // Check uniqueness (ignore own record)
    const existing = await prisma.user.findUnique({ where: { username: sanitized } })
    if (existing && existing.id !== userId) {
      return Response.json({ error: 'That name is already taken' }, { status: 400 })
    }

    await prisma.user.update({ where: { id: userId }, data: { username: sanitized } })

    return Response.json({ success: true, username: sanitized })
  } catch (e) {
    console.error('update-profile error:', e)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
