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
- Photo upload is the first thing shown in the modal — the hero drag-and-drop zone
- Canvas output: 400×587px (PSA slab ratio 3.75"×5.5"), contain with black background, no cropping
- Cloudinary transformation: `{ width: 400, height: 587, crop: 'fit' }`
- Grid tiles use `paddingTop: '146.75%'` to match PSA slab proportions
- List thumbnails use `width: 38, height: 56`

## Image Display

- All card images use `objectFit: 'contain'` — never `cover`
- Lightbox is available on collection page and admin panel (click to expand full screen)
- Card images are stored in Cloudinary at `topload/cards/{cardId}`
- Avatar images are stored at `topload/avatars/{userId}`

## Tech Stack

- Next.js App Router (no pages/ directory)
- Prisma + PostgreSQL (Supabase)
- Cloudinary v2 for image storage (`lib/cloudinary.js`)
- JWT auth via `getUser()` from `@/lib/auth`
- All styling is inline JSX styles — no Tailwind, no CSS modules
- Privacy blur: `body.privacy-mode .blur-val { filter: blur(7px) }`

## PSA Integration

- PSA field mapping: `Subject` → player, `CardName` → set, `Variety` → variety (card name)
- PSA cert link parsed from `card.notes` with regex `/PSA Cert #(\d+)/`
- Cert link format: `https://www.psacard.com/cert/{n}/psa`
- PSA lookups do NOT consume API credits when clicking the cert link

## Admin Panel

- Located at `/admin` — only accessible to admin users
- Shows all users with avatars, all cards with full info and photos
- Card database section: grid + table views, search, sport/owner filters
- Grid uses `paddingTop: '146.75%'` (PSA slab ratio)
- Table thumbnails: `width: 34, height: 50`
