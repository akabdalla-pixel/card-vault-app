import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const results = []

  // 1. Create Trade table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Trade" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
        "proposerId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        "proposerCardIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "receiverCardIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "proposerCash" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "receiverCash" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "message" TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Trade_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Trade_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT,
        CONSTRAINT "Trade_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT
      )
    `)
    results.push('Trade table: created')
  } catch (e) {
    results.push('Trade table: ' + e.message)
  }

  // 2. Create Friendship table (if not already there)
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Friendship" (
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
    results.push('Friendship table: created or already exists')
  } catch (e) {
    results.push('Friendship table: ' + e.message)
  }

  // 3. Friendship unique index
  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Friendship_requesterId_recipientId_key" ON "Friendship"("requesterId", "recipientId")
    `)
    results.push('Friendship unique index: created')
  } catch (e) {
    results.push('Friendship index: ' + e.message)
  }

  // 4. Add Card columns
  const cols = [
    ['"traded"', 'BOOLEAN NOT NULL DEFAULT false'],
    ['"tradedTo"', 'TEXT'],
    ['"tradedFrom"', 'TEXT'],
    ['"tradedAt"', 'TIMESTAMP(3)'],
    ['"tradeId"', 'TEXT'],
    ['"originalUserId"', 'TEXT'],
  ]
  for (const [name, type] of cols) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Card" ADD COLUMN ${name} ${type}`)
      results.push(`Card.${name}: added`)
    } catch (e) {
      results.push(`Card.${name}: ${e.message.includes('already exists') ? 'already exists' : e.message}`)
    }
  }

  return NextResponse.json({ ok: true, results })
}
