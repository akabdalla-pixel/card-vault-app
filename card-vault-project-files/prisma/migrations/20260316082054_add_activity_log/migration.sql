-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "auto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoGrade" TEXT,
ADD COLUMN     "edition" TEXT,
ADD COLUMN     "gradingCo" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "rarity" TEXT;

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "sport" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
