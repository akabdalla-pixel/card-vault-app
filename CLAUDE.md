# TopLoad – Project Rules & Standards

## Navigation / Sidebar (MANDATORY)

Every authenticated app page MUST use the existing sidebar navigation.
The canonical reference implementation is `app/collection/page.js`.

**Rules:**
- Copy the `NAV` array, all Icon functions, and the full sidebar JSX from `app/collection/page.js` into any new page
- The nav links are: Dashboard → `/dashboard`, Collection → `/collection`, Insights → `/insights`, Market → `/market`, PSA Lookup → `/psa`
- The sidebar includes: logo, nav items with active highlight, user avatar + username, settings link, logout button, privacy toggle
- The mobile bottom bar must also be included (it mirrors the sidebar for small screens)
- Do NOT invent a new nav pattern — always match the existing one exactly

## Card Photo Upload (MANDATORY)

All "Add to Collection" flows use `CardModal` from `app/components/CardModal.js`.
- Photo upload is the FIRST thing shown in the modal — a full-width hero drag-and-drop zone
- When no photo: shows 📸 icon, "Add a photo of your card" title, subtitle, gradient "Upload Photo" button
- When photo added: shows full PSA-ratio preview with overlay bar ("Tap to change photo" + Remove button)
- Supports drag & drop (`onDrop`, `onDragOver`, `onDragLeave`) and file input
- Canvas output: 400×587px (PSA slab ratio 3.75"×5.5"), contain with black background, no cropping
  ```js
  const W = 400, H = 587
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, W, H)
  const scale = Math.min(W / img.width, H / img.height) // contain, never cover
  ctx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh)
  ```
- Cloudinary transformation: `{ width: 400, height: 587, crop: 'fit' }` — route: `app/api/cards/image/route.js`
- Grid tiles use `paddingTop: '146.75%'` to match PSA slab proportions
- List thumbnails use `width: 38, height: 56`
- New cards: image uploaded after save (needs card ID from POST response first)

## Image Display

- All card images use `objectFit: 'contain'` — NEVER `cover`
- Lightbox: fixed overlay (`position: fixed, inset: 0, zIndex: 9999`) on collection page and admin panel — click anywhere to close
- Card images stored in Cloudinary at `topload/cards/{cardId}`
- Avatar images stored at `topload/avatars/{userId}`

## Tech Stack

- Next.js App Router (no `pages/` directory)
- Prisma + PostgreSQL (Supabase)
- Cloudinary v2 for image storage — config in `lib/cloudinary.js`
  ```js
  import { v2 as cloudinary } from 'cloudinary'
  cloudinary.config(process.env.CLOUDINARY_URL)
  ```
- `CLOUDINARY_URL` env var format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
- JWT auth via `getUser()` from `@/lib/auth`
- All styling is inline JSX styles — no Tailwind, no CSS modules
- Privacy blur: `body.privacy-mode .blur-val { filter: blur(7px) }`

## PSA Integration

- PSA field mapping: `Subject` → player, `CardName` → set, `Variety` → variety (card name)
- In `app/psa/page.js` `handleAddToCollection`: use `result.variety || result.set || ''` for the card name field
- PSA cert link parsed from `card.notes` with regex `/PSA Cert #(\d+)/`
- Cert link format: `https://www.psacard.com/cert/{n}/psa`
- PSA ↗ badge shown on: collection tile, collection list row, share page
- PSA lookups do NOT consume API credits when clicking the cert link

## Badges / Tiles

Cards display these badges wherever shown (collection grid, list, share page, admin):
- Grade badge: `{gradingCo} {grade}` — purple/accent colour
- AUTO badge: shows `AUTO {autoGrade}` if autoGrade exists — gold colour
- Serial # badge: only shown when `card.num` contains `/` (e.g. `12/50`) — silver
- PSA ↗ badge: shown when `card.notes` matches `/PSA Cert #(\d+)/` — links to psacard.com
- Condition badge: fallback when no grade

## Profile Picture / Avatar

- Users can upload and crop a profile picture from `app/settings/page.js`
- Crop modal: 280px circle, draggable image, zoom slider (Facebook-style)
- `handleCropSave` exports a square canvas of exactly what's visible in the circle
- Avatar uploaded to Cloudinary at `topload/avatars/{userId}` via `app/api/user/avatar/route.js`
- Avatar stored as URL in `User.avatar` field (Prisma schema)
- Returned by `app/api/auth/me/route.js` on every page load — persists across logout/login
- Displayed: sidebar (28px circle), share page header (56px circle), admin user rows (30px circle)

## Share Page (`app/share/[username]/page.js`)

- Public page — no auth required
- Shows user avatar + @username header
- Displays all non-sold cards with full badge row: grade, AUTO+autoGrade, serial#, PSA ↗, condition
- `app/api/share/[username]/route.js` must select: `autoGrade`, `notes`, `avatar`
- Card images shown in PSA slab ratio tiles with `objectFit: 'contain'`

## Admin Panel (`app/admin/page.js`)

- Located at `/admin` — admin users only
- User table: shows 30px avatar circle next to each user row
- Card Database section: grid + table views, search by player/set/brand, filter by sport + owner
- Grid: `paddingTop: '146.75%'` (PSA slab ratio), badges overlaid top-right, owner avatar + username bottom-right
- Table: `width: 34, height: 50` thumbnails, all card fields, owner avatar
- Both views: `objectFit: 'contain'`, click image → lightbox
- API: `app/api/admin/users/route.js` returns full card fields including `imageUrl`, `autoGrade`, `notes`, `avatar`

## Prisma Schema Notes

- `User.avatar String?` — added for profile pictures
- `Card.imageUrl String?` — already existed
- After any schema change: run `npx prisma db push` on Supabase

## Key API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/cards` | POST/PUT | Create or update a card |
| `/api/cards/image` | POST | Upload card photo to Cloudinary |
| `/api/user/avatar` | GET/POST | Get or upload user avatar |
| `/api/auth/me` | GET | Returns current user incl. avatar |
| `/api/share/[username]` | GET | Public collection data |
| `/api/admin/users` | GET | All users + all cards (admin only) |
| `/api/psa` | GET | PSA cert lookup |

## Features Built (Session Log)

### Card Photos
- Upload via `CardModal` hero zone (drag & drop + file picker)
- Stored in Cloudinary, URL saved to `Card.imageUrl`
- Canvas: 400×587 PSA slab ratio, contain (no crop), black letterbox
- Shown in: collection grid, collection list, admin grid, admin table, lightbox

### Lightbox
- Click any card image to expand full screen
- `lightboxImg` state: `{ url, player }`
- Fixed overlay, `zIndex: 9999`, click anywhere to close
- Present on: `app/collection/page.js`, `app/admin/page.js`

### Profile Pictures
- Upload + Facebook-style drag-to-reposition crop modal in Settings
- Stored in Cloudinary, URL in `User.avatar`
- Shown in sidebar, share page header, admin user rows

### PSA Cert Badge
- Parsed from `card.notes` field: `/PSA Cert #(\d+)/`
- Shown as clickable "PSA ↗" badge on collection tiles, list rows, share page

### AUTO Grade
- `Card.autoGrade` field stores the auto grade value (e.g. "10")
- Displayed as "AUTO 10" badge (gold) — not just "AUTO"
- `autoGrade` must be selected in all API routes that return card data

### Share Page Fixes
- Avatar circle shown next to @username
- Full badge row: grade, AUTO+autoGrade, serial#, PSA↗, condition
- All fields (`autoGrade`, `notes`, `avatar`) returned by share API

### Admin Card Database
- Flattens all users' cards into one searchable database
- Grid + table toggle, search, sport filter, owner filter
- Each card shows: photo, player, sport, year, grade, buy price, value, G/L, owner avatar
