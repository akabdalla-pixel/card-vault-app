'use client'
import { useState, useRef } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────────
export const EMPTY_CARD = {
  sport: '', year: '', player: '', name: '', brand: '', num: '',
  cond: '', grade: '', qty: '1', date: '', buy: '', val: '',
  notes: '', sold: false, soldPrice: '', soldDate: '',
  rarity: '', edition: '', language: '',
  auto: false, gradingCo: '', autoGrade: '',
}

export const TOP_SPORTS = [
  { label: 'Football',   emoji: '🏈' },
  { label: 'Basketball', emoji: '🏀' },
  { label: 'Baseball',   emoji: '⚾' },
  { label: 'Soccer',     emoji: '⚽' },
]

export const MORE_SPORTS = [
  'Hockey', 'F1', 'Golf', 'Tennis', 'UFC / MMA', 'Wrestling',
  'Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana',
  'One Piece', 'Dragon Ball Super', 'Digimon', 'Other',
]

export const TCG_LIST = ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece', 'Dragon Ball Super', 'Digimon']
export const TCG_RARITIES = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Reverse Holo', 'Ultra Rare', 'Secret Rare', 'Full Art', 'Rainbow Rare', 'Alt Art', 'Gold Rare', 'Promo']
export const EDITIONS = ['1st Edition', 'Unlimited', 'Shadowless', 'Limited', 'First Print']
export const CONDS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Poor']
export const AUTO_GRADES = ['10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5', '6', '5', '4', '3', '2', '1']
export const GRADING_COS = ['PSA', 'BGS', 'SGC', 'CGC', 'HGA', 'CSG', 'GAI', 'Other']
export const GRADES = ['10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5', '6', '5', '4', '3', '2', '1']

// ── Helpers ────────────────────────────────────────────────────────────────────
const gradeColor = g =>
  !g ? '#555' : parseFloat(g) >= 9 ? '#22c55e' : parseFloat(g) >= 7 ? '#ffbe2e' : '#ef4444'

// ── Universal Card Modal ───────────────────────────────────────────────────────
export default function CardModal({ card, onClose, onSave }) {
  const isEdit = !!card?.id

  // Auto-expand details if data is pre-filled (e.g. from PSA / Market)
  const hasPrefilledDetails = !!(card?.year || card?.brand || card?.name || card?.num || card?.notes)

  const [form, setForm] = useState({ ...EMPTY_CARD, ...(card || {}) })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showDetails, setShowDetails] = useState(isEdit || hasPrefilledDetails)

  // Card image
  const [imagePreview, setImagePreview] = useState(card?.imageUrl || null)
  const [imageUploading, setImageUploading] = useState(false)
  const [pendingImageBase64, setPendingImageBase64] = useState(null) // upload after save if new card
  const imageInputRef = useRef(null)

  function handleImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        // PSA slab canvas: 400×587 (3.75" × 5.5" ratio), contain with black background
        const W = 400, H = 587
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, W, H)
        // Contain: scale so full image fits inside canvas, centered
        const scale = Math.min(W / img.width, H / img.height)
        const sw = Math.round(img.width * scale)
        const sh = Math.round(img.height * scale)
        ctx.drawImage(img, Math.round((W - sw) / 2), Math.round((H - sh) / 2), sw, sh)
        const b64 = canvas.toDataURL('image/jpeg', 0.88)
        setImagePreview(b64)
        setPendingImageBase64(b64)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function uploadCardImage(cardId, b64) {
    setImageUploading(true)
    try {
      const res = await fetch('/api/cards/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, image: b64 }),
      })
      return res.ok ? (await res.json()).imageUrl : null
    } catch { return null }
    finally { setImageUploading(false) }
  }

  async function handleRemoveImage() {
    setImagePreview(null)
    setPendingImageBase64(null)
    if (form.id) {
      await fetch('/api/cards/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: form.id, image: null }),
      })
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isTCG = TCG_LIST.includes(form.sport)
  const isMoreSport = MORE_SPORTS.includes(form.sport) && !TOP_SPORTS.find(s => s.label === form.sport)
  const gc = gradeColor(form.grade)

  async function handleSave() {
    if (!form.player) { setError('Player / card name is required'); return }
    setSaving(true); setError('')
    try {
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch('/api/cards', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Failed to save')
        setSaving(false)
        return
      }
      // Upload pending image (new card needs ID from response first)
      if (pendingImageBase64) {
        const saved = await res.json().catch(() => null)
        const cardId = saved?.id || form.id
        if (cardId) await uploadCardImage(cardId, pendingImageBase64)
      }
      onSave()
    } catch {
      setError('Something went wrong')
      setSaving(false)
    }
  }

  // ── Style helpers ────────────────────────────────────────────────────────────
  const INP = {
    width: '100%', padding: '9px 12px', borderRadius: 9,
    background: '#191919', border: '1px solid #252525',
    color: '#f0f0f0', fontSize: 14, outline: 'none',
    fontFamily: 'var(--font-geist-sans)', boxSizing: 'border-box',
  }

  const inp = (key, placeholder, type = 'text', extra = {}) => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[key] || ''}
      onChange={e => set(key, e.target.value)}
      style={INP}
      {...extra}
    />
  )

  const sel = (key, children, activeColor = 'var(--accent-light)', activeBg = 'rgba(var(--accent-rgb),0.08)') => {
    const active = !!form[key]
    return (
      <select
        value={form[key] || ''}
        onChange={e => set(key, e.target.value)}
        style={{
          ...INP,
          background: active ? activeBg : '#191919',
          border: `1px solid ${active ? activeColor + '55' : '#252525'}`,
          color: active ? activeColor : '#555',
        }}
      >
        {children}
      </select>
    )
  }

  const lbl = t => (
    <div style={{
      fontSize: 10, fontWeight: 700, color: '#444',
      textTransform: 'uppercase', letterSpacing: '0.1em',
      marginBottom: 5, fontFamily: 'var(--font-geist-sans)',
    }}>{t}</div>
  )

  const divider = t => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginTop: 6, marginBottom: 2,
    }}>
      <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
      <span style={{
        fontSize: 9, fontWeight: 800, color: '#333',
        textTransform: 'uppercase', letterSpacing: '0.14em',
        fontFamily: 'var(--font-geist-sans)', whiteSpace: 'nowrap',
      }}>{t}</span>
      <div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
    </div>
  )

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#111', borderRadius: 18,
        width: '100%', maxWidth: 560, maxHeight: '92vh',
        overflowY: 'auto', paddingBottom: 32,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 14px' }}>
          <h2 style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 18, fontWeight: 800, color: '#f0f0f0', margin: 0 }}>
            {isEdit ? 'Edit Card' : 'Add to Collection'}
          </h2>
          <button onClick={onClose} style={{ background: '#1a1a1a', border: '1px solid #252525', color: '#555', cursor: 'pointer', padding: '4px 10px', fontSize: 18, lineHeight: 1, borderRadius: 8 }}>×</button>
        </div>

        {error && (
          <div style={{ margin: '0 18px 12px', padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 13, border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-geist-sans)' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 18px' }}>

          {/* ── PLAYER / CARD NAME ─────────────────────────────────── */}
          <div>
            {lbl(isTCG ? 'Card Name *' : 'Player / Subject *')}
            {inp('player', isTCG ? 'e.g. Charizard' : 'e.g. LeBron James', 'text', { autoFocus: true })}
          </div>

          {/* ── SPORT ─────────────────────────────────────────────── */}
          <div>
            {lbl('Sport / Game')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 6 }}>
              {TOP_SPORTS.map(s => (
                <button
                  key={s.label}
                  onClick={() => set('sport', form.sport === s.label ? '' : s.label)}
                  style={{
                    padding: '7px 4px', borderRadius: 9, cursor: 'pointer',
                    border: form.sport === s.label ? '2px solid rgba(var(--accent-rgb),0.6)' : '1px solid #252525',
                    background: form.sport === s.label ? 'rgba(var(--accent-rgb),0.12)' : '#191919',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  }}
                >
                  <span style={{ fontSize: 19 }}>{s.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 10, fontWeight: 700, color: form.sport === s.label ? 'var(--accent)' : '#555' }}>{s.label}</span>
                </button>
              ))}
            </div>
            <select
              value={isMoreSport ? form.sport : ''}
              onChange={e => set('sport', e.target.value)}
              style={{
                ...INP,
                background: isMoreSport ? 'rgba(var(--accent-rgb),0.08)' : '#191919',
                border: `1px solid ${isMoreSport ? 'rgba(var(--accent-rgb),0.35)' : '#252525'}`,
                color: isMoreSport ? 'var(--accent)' : '#555',
              }}
            >
              <option value="">More sports / TCG / Other...</option>
              {MORE_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* ── GRADING ───────────────────────────────────────────── */}
          {divider('Grading')}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              {lbl('Grading Company')}
              {sel('gradingCo',
                <>
                  <option value="">Ungraded / Raw</option>
                  {GRADING_COS.map(g => <option key={g} value={g}>{g}</option>)}
                </>
              )}
            </div>
            <div>
              {lbl('Grade')}
              <select
                value={form.grade || ''}
                onChange={e => set('grade', e.target.value)}
                style={{
                  ...INP,
                  color: form.grade ? gc : '#555',
                  borderColor: form.grade ? gc + '55' : '#252525',
                  background: form.grade ? gc + '12' : '#191919',
                  fontWeight: form.grade ? 800 : 400,
                }}
              >
                <option value="">No grade</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Raw condition — only when not graded */}
          {!form.gradingCo && !form.grade && (
            <div>
              {lbl('Raw Condition')}
              {sel('cond',
                <>
                  <option value="">Select condition...</option>
                  {CONDS.map(c => <option key={c} value={c}>{c}</option>)}
                </>
              )}
            </div>
          )}

          {/* ── AUTOGRAPH ─────────────────────────────────────────── */}
          {divider('Autograph')}

          <label style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 10,
            background: form.auto ? 'rgba(255,190,46,0.05)' : '#191919',
            border: `1px solid ${form.auto ? 'rgba(255,190,46,0.25)' : '#252525'}`,
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={!!form.auto}
              onChange={e => set('auto', e.target.checked)}
              style={{ accentColor: '#ffbe2e', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, fontWeight: 700, color: form.auto ? '#ffbe2e' : '#555' }}>
                Autographed Card ✍️
              </div>
              <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 10, color: '#3a3a3a', marginTop: 1 }}>
                This card has a signed autograph
              </div>
            </div>
          </label>

          {form.auto && (
            <div>
              {lbl('Auto Grade')}
              <input
                list="auto-grade-opts"
                placeholder="e.g. 10"
                value={form.autoGrade || ''}
                onChange={e => set('autoGrade', e.target.value)}
                style={{
                  ...INP,
                  color: form.autoGrade ? '#ffbe2e' : '#f0f0f0',
                  borderColor: form.autoGrade ? 'rgba(255,190,46,0.4)' : '#252525',
                  background: form.autoGrade ? 'rgba(255,190,46,0.06)' : '#191919',
                  fontWeight: form.autoGrade ? 700 : 400,
                }}
              />
              <datalist id="auto-grade-opts">
                {['10','9.5','9','8.5','8','7.5','7','6.5','6','5','4','3','2','1'].map(g => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
          )}

          {/* ── VALUE ─────────────────────────────────────────────── */}
          {divider('Value')}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>{lbl('Buy Price ($)')}{inp('buy', '0.00', 'number')}</div>
            <div>{lbl('Current Value ($)')}{inp('val', '0.00', 'number')}</div>
          </div>

          {/* ── CARD DETAILS (collapsible, auto-expands when pre-filled) ── */}
          {!isEdit && (
            <button
              onClick={() => setShowDetails(v => !v)}
              style={{
                width: '100%', padding: '9px', borderRadius: 10, background: 'transparent',
                border: '1px solid #1e1e1e', color: '#3a3a3a',
                fontFamily: 'var(--font-geist-sans)', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {showDetails ? '↑ Hide card details' : '↓ Card details — year, set, brand, serial #...'}
            </button>
          )}

          {showDetails && (
            <>
              {divider('Card Details')}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>{lbl('Year')}{inp('year', 'e.g. 2024')}</div>
                <div>{lbl(isTCG ? 'Set / Expansion' : 'Set / Series')}{inp('name', isTCG ? 'e.g. Base Set' : 'e.g. Topps Chrome')}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>{lbl(isTCG ? 'Publisher' : 'Brand')}{inp('brand', isTCG ? 'e.g. Wizards' : 'e.g. Topps')}</div>
                <div>{lbl('Card # / Serial #')}{inp('num', 'e.g. 45 or 12/50')}</div>
              </div>

              {isTCG && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    {lbl('Rarity')}
                    {sel('rarity',
                      <>
                        <option value="">Select rarity...</option>
                        {TCG_RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                      </>
                    )}
                  </div>
                  <div>
                    {lbl('Edition')}
                    {sel('edition',
                      <>
                        <option value="">Select edition...</option>
                        {EDITIONS.map(e => <option key={e} value={e}>{e}</option>)}
                      </>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>{lbl('Quantity')}{inp('qty', '1', 'number')}</div>
                <div>{lbl('Date Acquired')}{inp('date', '', 'date')}</div>
              </div>

              <div>
                {lbl('Notes')}
                <textarea
                  value={form.notes || ''}
                  onChange={e => set('notes', e.target.value)}
                  rows={2}
                  placeholder="Any additional notes..."
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 9,
                    background: '#191919', border: '1px solid #252525',
                    color: '#f0f0f0', fontSize: 14, outline: 'none',
                    resize: 'none', fontFamily: 'var(--font-geist-sans)', boxSizing: 'border-box',
                  }}
                />
              </div>
            </>
          )}

          {/* ── SOLD (edit only) ──────────────────────────────────── */}
          {isEdit && (
            <>
              {divider('Sale Info')}
              <label style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 10,
                background: form.sold ? 'rgba(34,197,94,0.05)' : '#191919',
                border: `1px solid ${form.sold ? 'rgba(34,197,94,0.25)' : '#252525'}`,
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={!!form.sold}
                  onChange={e => set('sold', e.target.checked)}
                  style={{ accentColor: '#22c55e', width: 16, height: 16, flexShrink: 0 }}
                />
                <div style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 13, fontWeight: 700, color: form.sold ? '#22c55e' : '#555' }}>
                  Mark as Sold 💰
                </div>
              </label>
              {form.sold && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>{lbl('Sold Price ($)')}{inp('soldPrice', '0.00', 'number')}</div>
                  <div>{lbl('Sold Date')}{inp('soldDate', '', 'date')}</div>
                </div>
              )}
            </>
          )}

        </div>

        {/* ── Card Photo ───────────────────────────────────────── */}
        <div style={{ padding: '10px 18px 0' }}>
          {divider('Card Photo')}
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginTop:10 }}>
            {/* Preview */}
            <div style={{ width:72, height:100, borderRadius:8, background:'#181818', border:'1px solid #252525', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {imagePreview
                ? <img src={imagePreview} alt="card" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                : <span style={{ fontSize:22, opacity:0.25 }}>🃏</span>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:'#444', marginBottom:10, lineHeight:1.5 }}>
                Upload a photo of your card. It'll show in list and grid views.
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <label style={{ padding:'7px 14px', borderRadius:9, background:'rgba(var(--accent-rgb),0.1)', border:'1px solid rgba(var(--accent-rgb),0.25)', color:'var(--accent)', fontSize:12, fontWeight:800, cursor: imageUploading ? 'not-allowed' : 'pointer', opacity: imageUploading ? 0.5 : 1 }}>
                  {imageUploading ? 'Uploading…' : imagePreview ? '📷 Change' : '📷 Add Photo'}
                  <input ref={imageInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageSelect} disabled={imageUploading} />
                </label>
                {imagePreview && (
                  <button type="button" onClick={handleRemoveImage} style={{ padding:'7px 14px', borderRadius:9, background:'transparent', border:'1px solid #2a2a2a', color:'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ padding: '16px 18px 0' }}>
          <button
            onClick={handleSave}
            disabled={saving || !form.player}
            style={{
              width: '100%', padding: '13px', borderRadius: 12,
              background: (!form.player || saving) ? '#191919' : 'linear-gradient(135deg,var(--accent),var(--accent-light))',
              border: (!form.player || saving) ? '1px solid #252525' : 'none',
              color: (!form.player || saving) ? '#333' : '#fff',
              fontFamily: 'var(--font-geist-sans)', fontSize: 15, fontWeight: 800,
              cursor: (!form.player || saving) ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.3px',
            }}
          >
            {saving ? 'Saving...' : (isEdit ? 'Save Changes' : '+ Add to Collection')}
          </button>
        </div>

      </div>
    </div>
  )
}
