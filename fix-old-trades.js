const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixOldTrades() {
  const accepted = await prisma.trade.findMany({
    where: { status: 'accepted' },
    select: { proposerCardIds: true, receiverCardIds: true }
  });

  const allCardIds = accepted.flatMap(t => [...t.proposerCardIds, ...t.receiverCardIds]);

  if (allCardIds.length === 0) {
    console.log('No accepted trades found.');
    return;
  }

  const result = await prisma.card.updateMany({
    where: { id: { in: allCardIds } },
    data: { traded: true }
  });

  console.log(`Marked ${result.count} cards as traded.`);
}

fixOldTrades().then(() => prisma.$disconnect());
