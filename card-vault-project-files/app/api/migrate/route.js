import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const results = []

  // 1. Drop the broken Friendship table (created by Railway GUI with wrong column names)
  try {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Friendship" CASCADE`)
    results.push('Friendship table: dropped old version')
  } catch (e) {
    results.push('Friendship drop: ' + e.message)
  }

  // 2. Recreate Friendship table with correct camelCase column names
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Friendship" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "requesterId" TEXT NOT NULL,
        "recipientId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT,
        CONSTRAINT "Friendship_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT
      )
    `)
    results.push('Friendship table: recreated correctly')
  } catch (e) {
    results.push('Friendship create: ' + e.message)
  }

  // 3. Friendship unique index
  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX "Friendship_requesterId_recipientId_key" ON "Friendship"("requesterId", "recipientId")
    `)
    results.push('Friendship unique index: created')
  } catch (e) {
    results.push('Friendship index: ' + e.message)
  }

  return NextResponse.json({ ok: true, results })
}
