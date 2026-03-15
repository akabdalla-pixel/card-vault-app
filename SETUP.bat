@echo off
echo ========================================
echo  CardVault Setup Script
echo ========================================
echo.
echo Step 1: Creating Next.js project...
call npx create-next-app@latest card-vault --no-typescript --eslint --tailwind --no-src-dir --app --no-turbopack --no-import-alias
cd card-vault

echo.
echo Step 2: Installing dependencies...
call npm install prisma@5 @prisma/client@5 bcryptjs jsonwebtoken cookie

echo.
echo Step 3: Initializing Prisma...
call npx prisma init

echo.
echo Step 4: Copy your project files into this folder now!
echo Then run: npx prisma db push
echo Then run: npm run dev
pause
