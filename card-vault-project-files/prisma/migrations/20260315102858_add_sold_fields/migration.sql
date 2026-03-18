-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "sport" TEXT,
    "year" TEXT,
    "player" TEXT NOT NULL,
    "name" TEXT,
    "brand" TEXT,
    "num" TEXT,
    "cond" TEXT,
    "grade" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "date" TEXT,
    "buy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "val" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "soldPrice" DOUBLE PRECISION,
    "soldDate" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" TEXT NOT NULL,
    "pri" TEXT NOT NULL DEFAULT 'medium',
    "sport" TEXT,
    "player" TEXT NOT NULL,
    "name" TEXT,
    "year" TEXT,
    "brand" TEXT,
    "target" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "market" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'watching',
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
