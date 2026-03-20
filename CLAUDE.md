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
- Share page grid: NO badge overlays on top of images — badges shown in the info section below only

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
- Shows user avatar + @username header + collection value
- Grid view default (same PSA slab tiles as collection page) + list view toggle
- Lightbox on image click — same behaviour as collection page
- Displays all non-sold cards with full badge row below image: grade, AUTO+autoGrade, serial#, PSA ↗, condition
- NO badge overlays on top of card images in grid view
- `app/api/share/[username]/route.js` selects: `autoGrade`, `notes`, `avatar`, `imageUrl`
- Card images shown in PSA slab ratio tiles (`paddingTop: '146.75%'`) with `objectFit: 'contain'`
- Search, sport filter chips, sort bar, and filter sheet all present

## Admin Panel (`app/admin/page.js`)

- Located at `/admin` — admin users only
- User table: shows 30px avatar circle next to each user row
- Card Database section: grid + table views, search by player/set/brand, filter by sport + owner
- Grid: `paddingTop: '146.75%'` (PSA slab ratio), badges overlaid top-right, owner avatar + username bottom-right
- Table: `width: 34, height: 50` thumbnails, all card fields, owner avatar
- Both views: `objectFit: 'contain'`, click image → lightbox
- API: `app/api/admin/users/route.js` returns full card fields including `imageUrl`, `autoGrade`, `notes`, `avatar`

## Dashboard Spotlight

- Spotlight card randomly selected from active (non-sold) cards on each load
- Shows card photo on the left (72px wide, PSA slab ratio, `objectFit: 'contain'`)
- Shows player name, metadata, and Buy / Value / G/L stats to the right
- Falls back gracefully to text-only layout when no image is present
- Clicking spotlight navigates to collection filtered by that player

## Market Page

- eBay search — results are cleared immediately when the search field is emptied
- `onChange` on the search input calls `setResults(null)` and `setError('')` when value is blank

## Prisma Schema Notes

- `User.avatar String?` — added for profile pictures
- `Card.imageUrl String?` — already existed
- After any schema change: run `npx prisma db push` on Supabase

## Key API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/cards` | GET | Returns all cards for current user (all fields incl. imageUrl) |
| `/api/cards` | POST/PUT | Create or update a card |
| `/api/cards/image` | POST | Upload card photo to Cloudinary |
| `/api/user/avatar` | GET/POST | Get or upload user avatar |
| `/api/auth/me` | GET | Returns current user incl. avatar |
| `/api/share/[username]` | GET | Public collection data incl. imageUrl |
| `/api/admin/users` | GET | All users + all cards (admin only) |
| `/api/psa` | GET | PSA cert lookup |
| `/api/activity` | GET | Activity feed |
| `/api/dashboard` | GET | Dashboard stats |

---

## Full Build History

Everything that has been built or changed on this project, in order.

### 1. Core App Foundation
- Next.js App Router with Prisma + PostgreSQL (Supabase)
- JWT authentication (`lib/auth.js`) — `getUser()` used on all protected routes
- Inline JSX styling throughout — no Tailwind, no CSS modules
- Privacy mode: toggle that blurs all `.blur-val` elements via `body.privacy-mode` class

### 2. Collection Page (`app/collection/page.js`)
- Grid view and list view toggle
- Search bar, sport filter chips, sort options
- Add card via `CardModal`, edit card, delete card (with undo toast)
- Sold toggle — marks card as sold with sold price + date
- Stats bar: total cards, total value, total cost, G/L
- Privacy toggle in sidebar to blur financial values
- Bulk select + bulk delete
- Export to CSV

### 3. CardModal (`app/components/CardModal.js`)
- Universal modal used for Add to Collection and Edit Card across all pages (PSA, Market, manual)
- Fields: player, sport (top 4 buttons + dropdown for more), grading company, grade, raw condition, autograph toggle, auto grade, buy price, current value, year, set, brand, serial #, quantity, date acquired, notes, sold info
- TCG mode: different labels and extra fields (rarity, edition, language) when sport is a TCG
- Collapsible "card details" section (auto-expands when pre-filled e.g. from PSA)
- Card photo hero zone at the very top of the modal (see Card Photo Upload section above)

### 4. Dashboard (`app/dashboard/page.js`)
- Portfolio value chart (line graph of snapshots over time)
- Stats cards: total value, total cards, total cost, G/L %
- Spotlight card: randomly selected card shown with photo + buy/value/G/L stats
- Recent activity feed
- Quick-add value update directly from dashboard card tiles
- Snapshot saved to `PortfolioSnapshot` table on every card save

### 5. PSA Lookup (`app/psa/page.js`)
- Looks up a PSA cert number via `/api/psa`
- Field mapping: `Subject` → player, `CardName` → set, `Variety` → card name (variety takes priority over set for the name field)
- Saves cert number in `card.notes` as "PSA Cert #XXXXXXXX"
- PSA ↗ badge generated from that notes field — no API call on badge click
- Clicking "Add to Collection" opens `CardModal` pre-filled with PSA data

### 6. Market Page (`app/market/page.js`)
- eBay sold listings search via `/api/market`
- Shows avg, high, low prices + individual listings with images
- "Add to Collection" from any listing opens `CardModal` pre-filled
- Results clear immediately when search field is emptied

### 7. Card Photos
- Upload flow: file picker or drag & drop → canvas resize (400×587, contain, black bg) → base64 → POST `/api/cards/image` → Cloudinary → URL saved to `Card.imageUrl`
- New cards: image upload happens after card save (needs the new card's ID from the POST response)
- Edit cards: existing `imageUrl` pre-loaded in modal; user can change or remove
- Remove image: sends `{ cardId, image: null }` to `/api/cards/image` which sets `imageUrl: null` in DB
- `lib/cloudinary.js`: `cloudinary.config(process.env.CLOUDINARY_URL)` — env var format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`

### 8. Image Display — Collection Page
- Grid view: PSA slab ratio tiles (`paddingTop: '146.75%'`), `objectFit: 'contain'`, black background
- List view: 38×56px thumbnails, `objectFit: 'contain'`
- Lightbox: click any image → full-screen overlay (`position: fixed, inset: 0, zIndex: 9999`), click anywhere to close
- Cards without photos show sport emoji placeholder

### 9. Lightbox
- State: `const [lightboxImg, setLightboxImg] = useState(null)` — stores `{ url, player }`
- Rendered at the top of the return JSX, above all other content
- Present on: `app/collection/page.js`, `app/admin/page.js`, `app/share/[username]/page.js`

### 10. Profile Pictures / Avatars
- Settings page (`app/settings/page.js`): upload section with Facebook-style crop modal
- Crop modal: 280px circle preview, drag image to reposition, zoom slider
- `handleCropSave`: draws a square canvas of exactly what's visible in the 280px circle
- API route `app/api/user/avatar/route.js`: GET returns avatar URL, POST uploads to Cloudinary at `topload/avatars/{userId}`
- `User.avatar String?` added to Prisma schema — run `npx prisma db push` after schema changes
- `app/api/auth/me/route.js` returns `avatar` field so it's available on every page load
- Avatar shown: sidebar (28px), share page header (56px), admin user rows (30px)

### 11. PSA Cert Badge
- Regex: `/PSA Cert #(\d+)/` on `card.notes`
- Badge: "PSA ↗" in blue — links to `https://www.psacard.com/cert/{n}/psa`
- Shown on: collection grid tile, collection list row, share page grid + list
- No API call on click — direct link to PSA website

### 12. AUTO Grade Badge
- `Card.autoGrade` field (string) stores the auto grade value
- Badge shows "AUTO 10" (gold) — NOT just "AUTO" — `autoGrade` appended if present
- `autoGrade: true` must be included in every Prisma select that returns card data

### 13. Serial Number Badge
- Shown only when `card.num` contains `/` (e.g. "09/10", "12/50")
- Displayed as `#{card.num}` in silver on collection tiles, list rows, share page

### 14. Share Page — Full Rebuild
- Grid view (default): PSA slab ratio tiles, card photos, badges below image (NOT overlaid on photo)
- List view: thumbnails 38×56px + full badge row + value
- View toggle: grid/list switcher in toolbar
- Lightbox: click any photo → full-screen overlay
- Header: avatar circle (56px) + @username + card count + collection value
- Search, sport filter chips, sort bar (newest/value/A-Z), filter sheet (grade/sport/auto/price range)
- Footer CTA: "Track your own collection on TopLoad" → /signup
- API (`app/api/share/[username]/route.js`) selects `imageUrl`, `autoGrade`, `notes`, `avatar`

### 15. Admin Panel — Card Database
- New "Card Database" section below user management
- Flattens all users' cards into one searchable database
- Grid view: PSA slab tiles, badges top-right, owner avatar + @username bottom-right
- Table view: 34×50px thumbnail, all columns (player, sport, year, grade, buy, value, G/L, owner)
- Search by player/set/brand, filter by sport, filter by owner
- Both views: `objectFit: 'contain'`, click image → lightbox
- Admin user rows show 30px avatar circle

### 16. Dashboard Spotlight — Photo
- Spotlight section updated to show card photo (72px wide, PSA slab portrait ratio)
- Photo sits to the left; player name, metadata, and stats sit to the right
- Gracefully collapses to text-only if card has no photo

### 17. Market — Clear on Empty Search
- Typing then clearing the search field now instantly removes all results and errors
- No stale results left on screen

### 18. Share Page — No Badge Overlays on Photos
- Removed the semi-transparent badge overlays that appeared on top of card photos in grid view
- Badges still appear below the photo in the card info section
- List view badges unchanged

### 19. CLAUDE.md
- This file — created to document all conventions, rules, and build history
- Automatically read by Claude at the start of every session
- Should be updated whenever new features are added or conventions change

### 20. CardModal — Live PSA Badge Preview
- When the notes field contains text matching `/PSA Cert #(\d+)/`, a live PSA ↗ badge preview appears below the notes textarea
- Badge is a real clickable link to psacard.com/cert/{n}/psa so user can verify the cert immediately
- Helper text reads "Badge will appear on this card's tile" — makes it clear the badge will show on the collection tile after save
- Placeholder text in the notes field now hints: `Tip: type "PSA Cert #XXXXXXXX" to auto-add the PSA badge`

### 21. Friends & Trading System
- `lib/auth.js` updated: `getUser(req)` now checks Bearer token first (mobile app), falls back to cookies (web)
- Prisma schema: added `Friendship` model (id, requesterId, recipientId, status, unique constraint)
- Prisma schema: added `Trade` model (id, proposerId, receiverId, proposerCardIds[], receiverCardIds[], cash amounts, status, message)
- Prisma schema: added 6 trade fields to Card (traded, tradedTo, tradedFrom, tradedAt, tradeId, originalUserId)
- User model: added relation fields for friendships and trades
- Nav updated on ALL pages: Friends link added between Collection and Insights
- 6 friends API routes: search, request, respond, list, remove, cards
- 4 trades API routes: propose, respond, list, pending
- Friends page (`app/friends/page.js`): 3 tabs (Friends, Trades, Requests)
  - Friends tab: user search with add friend, friends list with Trade/Remove buttons
  - Trades tab: trade history with accept/decline/cancel actions, card thumbnails, cash display
  - Requests tab: incoming (accept/decline) and sent requests with badge counts
  - Trade proposal modal: two-column card picker, cash inputs, message field
- `tradedTo` and `tradedFrom` are STRING fields (usernames, not IDs) for direct display
- Mobile app auth uses Bearer token in Authorization header; web app uses cookies
- Trade accept swaps card ownership (userId) and marks cards as traded
