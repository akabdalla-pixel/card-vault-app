# CardVault - Setup Instructions

## Quick Setup

1. Open PowerShell, navigate to Desktop:
   ```
   cd ~/Desktop
   ```

2. Create the Next.js project:
   ```
   npx create-next-app@latest card-vault
   ```
   Answer: No TypeScript, Yes ESLint, Yes Tailwind, No src dir, Yes App Router, No Turbopack, No import alias

3. Enter the project and install dependencies:
   ```
   cd card-vault
   npm install prisma@5 @prisma/client@5 bcryptjs jsonwebtoken cookie
   npx prisma init
   ```

4. Copy ALL files from this zip into the card-vault folder (overwrite existing files):
   - prisma/schema.prisma
   - lib/prisma.js
   - lib/auth.js
   - middleware.js
   - .env
   - app/globals.css
   - app/layout.js
   - app/page.js
   - app/login/page.js
   - app/signup/page.js
   - app/dashboard/page.js
   - app/api/auth/signup/route.js
   - app/api/auth/login/route.js
   - app/api/auth/logout/route.js
   - app/api/auth/me/route.js
   - app/api/cards/route.js
   - app/api/wishes/route.js

5. Push database schema:
   ```
   npx prisma db push
   ```

6. Run the app:
   ```
   npm run dev
   ```

7. Open http://localhost:3000
