import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth'

const ADMIN_USER_ID = 'cmmrmc7fc00013i3sw69u7fj4'

export async function GET() {
  const userId = await getUser()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (userId !== ADMIN_USER_ID) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const entries = await prisma.pSACache.findMany({
    orderBy: { updatedAt: 'desc' }
  })

  const parsed = entries.map(e => {
    try {
      const d = JSON.parse(e.data)
      return {
        cert: e.cert,
        player: d.player || '—',
        grade: d.grade || '—',
        sport: d.sport || '—',
        year: d.year || '—',
        brand: d.brand || '—',
        set: d.set || '—',
        totalPop: d.totalPop || 0,
        popHigher: d.popHigher || 0,
        frontImage: d.frontImage || null,
        certPageUrl: d.certPageUrl || null,
        isCancelled: d.isCancelled || false,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      }
    } catch {
      return { cert: e.cert, player: '—', grade: '—', sport: '—', year: '—', brand: '—', set: '—', totalPop: 0, popHigher: 0, frontImage: null, certPageUrl: null, isCancelled: false, createdAt: e.createdAt, updatedAt: e.updatedAt }
    }
  })

  return NextResponse.json({ entries: parsed, total: parsed.length })
}
