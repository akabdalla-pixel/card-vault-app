'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Insights', href: '/insights' },
  { label: 'Market', href: '/market' },
  { label: 'PSA Lookup', href: '/psa' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconShield() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function IconCheck() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IconX() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Insights': IconInsights, 'Market': IconMarket, 'PSA Lookup': IconShield }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

const EMPTY = { sport: '', year: '', player: '', name: '', brand: '', num: '', cond: '', grade: '', qty: '1', date: '', buy: '', val: '', notes: '', sold: false, soldPrice: '', soldDate: '', rarity: '', edition: '', language: '', auto: false, gradingCo: '', autoGrade: '' }

// ── Toast ──────────────────────────────────────────────────────────────────────
var _toastFn = null

const TOP_SPORTS = [
  { label: 'Football', emoji: '🏈' },
  { label: 'Basketball', emoji: '🏀' },
  { label: 'Baseball', emoji: '⚾' },
  { label: 'Soccer', emoji: '⚽' },
]

const MORE_SPORTS = [
  'Hockey', 'F1', 'Golf', 'Tennis',
  'Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana',
  'One Piece', 'Dragon Ball Super', 'Digimon', 'Other'
]

const TCG_LIST = ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece', 'Dragon Ball Super', 'Digimon']

// TCG-specific rarities

const TCG_RARITIES = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Reverse Holo', 'Ultra Rare', 'Secret Rare', 'Full Art', 'Rainbow Rare', 'Alt Art', 'Gold Rare', 'Promo']

const EDITIONS = ['1st Edition', 'Unlimited', 'Shadowless', 'Limited', 'First Print']

const CONDS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Poor']
const AUTO_GRADES = ['AUTO10','AUTO9.5','AUTO9','AUTO8.5','AUTO8','AUTO7.5','AUTO7','AUTO6.5','AUTO6','AUTO5','AUTO4','AUTO3','AUTO2','AUTO1']

function CardModal({ card, onClose, onSave }) {
  const isEdit = !!card?.id
  const [form, setForm] = useState(card || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showDetails, setShowDetails] = useState(isEdit)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isTCG = TCG_LIST.includes(form.sport)
  const isTopSport = TOP_SPORTS.some(s => s.label === form.sport)
  const isMoreSport = MORE_SPORTS.includes(form.sport)

  async function handleSave() {
    if (!form.player) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch('/api/cards', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to save'); setSaving(false); return }
      onSave()
    } catch { setError('Something went wrong'); setSaving(false) }
  }

  const inp = (key, placeholder, type = 'text', autoFocus = false) => (
    <input type={type} placeholder={placeholder} value={form[key]||''} onChange={e => set(key, e.target.value)} autoFocus={autoFocus}
      style={{ width:'100%', padding:'8px 12px', borderRadius:9, background:'#202020', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif", boxSizing:'border-box' }} />
  )
  const lbl = t => <div style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4, fontFamily:"'Unbounded',sans-serif" }}>{t}</div>

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e => { if(e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'#111', borderRadius:'20px 20px 0 0', width:'100%', maxWidth:560, maxHeight:'92vh', overflowY:'auto', padding:'16px 16px 36px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <h2 style={{ fontFamily:"'Unbounded',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f0', margin:0 }}>
            {isEdit ? 'Edit Card' : 'Quick Add'}
          </h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', padding:4, fontSize:22, lineHeight:1 }}>×</button>
        </div>

        {error && <div style={{ marginBottom:14, padding:'10px 14px', borderRadius:10, background:'rgba(147,51,234,0.08)', color:'#9333ea', fontSize:13, border:'1px solid rgba(147,51,234,0.2)', fontFamily:"'Unbounded',sans-serif" }}>{error}</div>}

        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>

          {/* ── 1. Name ── */}
          <div>
            {lbl(isTCG ? 'Card Name *' : 'Player Name *')}
            {inp('player', isTCG ? 'e.g. Charizard' : 'e.g. LeBron James', 'text', true)}
          </div>

          {/* ── 2. Sport — top 4 big buttons + more dropdown ── */}
          <div>
            {lbl('Sport / Game')}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:8 }}>
              {TOP_SPORTS.map(s => (
                <button key={s.label} onClick={() => set('sport', form.sport === s.label ? '' : s.label)}
                  style={{ padding:'8px 4px', borderRadius:9, border: form.sport === s.label ? '2px solid rgba(147,51,234,0.6)' : '1px solid #2a2a2a', background: form.sport === s.label ? 'rgba(147,51,234,0.12)' : '#1a1a1a', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                  <span style={{ fontSize:20 }}>{s.emoji}</span>
                  <span style={{ fontFamily:"'Unbounded',sans-serif", fontSize:10, fontWeight:700, color: form.sport === s.label ? '#9333ea' : '#555' }}>{s.label}</span>
                </button>
              ))}
            </div>
            <select value={isMoreSport ? form.sport : ''} onChange={e => set('sport', e.target.value)}
              style={{ width:'100%', padding:'8px 12px', borderRadius:9, background: isMoreSport ? 'rgba(147,51,234,0.08)' : '#1a1a1a', border: isMoreSport ? '1px solid rgba(147,51,234,0.3)' : '1px solid #2a2a2a', color: isMoreSport ? '#9333ea' : '#555', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif" }}>
              <option value="">More sports / TCG...</option>
              {MORE_SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* ── 3. Grade + Grade Company (two dropdowns side by side) ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              {lbl('Grade')}
              <select value={form.grade||''} onChange={e => set('grade', e.target.value)}
                style={{ width:'100%', padding:'8px 12px', borderRadius:9, background:'#202020', border:'1px solid #2a2a2a', color: form.grade ? '#f0f0f0' : '#555', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif" }}>
                <option value="">Raw / No grade</option>
                {['10','9.5','9','8.5','8','7.5','7','6.5','6','5','4','3','2','1'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              {lbl('Grading Co.')}
              <select value={form.gradingCo||''} onChange={e => set('gradingCo', e.target.value)}
                style={{ width:'100%', padding:'8px 12px', borderRadius:9, background:'#202020', border:'1px solid #2a2a2a', color: form.gradingCo ? '#f0f0f0' : '#555', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif" }}>
                <option value="">No grading co.</option>
                {['PSA','BGS','SGC','CGC','HGA','CSG','GAI','Other'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* ── 4. Auto checkbox ── */}
          <label style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:9, background:'#1a1a1a', border: form.auto ? '1px solid rgba(255,190,46,0.3)' : '1px solid #2a2a2a', cursor:'pointer' }}>
            <input type="checkbox" checked={!!form.auto} onChange={e => set('auto', e.target.checked)} style={{ accentColor:'#ffbe2e', width:18, height:18, cursor:'pointer' }} />
            <div>
              <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:13, fontWeight:700, color: form.auto ? '#ffbe2e' : '#ccc' }}>Autograph ✍️</div>
              <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:10, color:'#555' }}>This card has an auto</div>
            </div>
          </label>

          {/* ── 4b. Auto Grade ── */}
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4, fontFamily:"'Unbounded',sans-serif" }}>Auto Grade</div>
            <select value={form.autoGrade||''} onChange={e => set('autoGrade', e.target.value)}
              style={{ width:'100%', padding:'8px 12px', borderRadius:9, background:'#202020', border: form.autoGrade ? '1px solid rgba(255,190,46,0.3)' : '1px solid #2a2a2a', color: form.autoGrade ? '#ffbe2e' : '#555', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif" }}>
              <option value="">No auto grade</option>
              {AUTO_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* ── 5. Buy Price + Value ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>{lbl('Buy Price ($)')}{inp('buy', '0.00', 'number')}</div>
            <div>{lbl('Current Value ($)')}{inp('val', '0.00', 'number')}</div>
          </div>

          {/* ── 6. More Details toggle ── */}
          {!isEdit && (
            <button onClick={() => setShowDetails(v => !v)}
              style={{ width:'100%', padding:'10px', borderRadius:10, background:'transparent', border:'1px solid #2a2a2a', color:'#555', fontFamily:"'Unbounded',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              {showDetails ? '↑ Hide details' : '↓ More details (year, set, brand, numbering...)'}
            </button>
          )}

          {/* ── 7. Extra Details (collapsed by default on add) ── */}
          {showDetails && <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>{lbl('Year')}{inp('year', 'e.g. 2023')}</div>
              <div>{lbl('Numbering (e.g. 10/50)')}{inp('num', 'e.g. 10/50')}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>{lbl(isTCG ? 'Set / Expansion' : 'Set')}{inp('name', isTCG ? 'e.g. Base Set' : 'e.g. Topps Chrome')}</div>
              <div>{lbl(isTCG ? 'Publisher' : 'Brand')}{inp('brand', isTCG ? 'e.g. Wizards' : 'e.g. Topps')}</div>
            </div>
            {isTCG && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>{lbl('Rarity')}<select value={form.rarity||''} onChange={e => set('rarity', e.target.value)} style={{ width:'100%', padding:'11px 14px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color: form.rarity?'#f0f0f0':'#555', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif" }}><option value="">Select...</option>{TCG_RARITIES.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                <div>{lbl('Edition')}<select value={form.edition||''} onChange={e => set('edition', e.target.value)} style={{ width:'100%', padding:'11px 14px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color: form.edition?'#f0f0f0':'#555', fontSize:14, outline:'none', fontFamily:"'Unbounded',sans-serif" }}><option value="">Select...</option>{EDITIONS.map(e=><option key={e} value={e}>{e}</option>)}</select></div>
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>{lbl('Quantity')}{inp('qty', '1', 'number')}</div>
              <div>{lbl('Purchase Date')}{inp('date', '', 'date')}</div>
            </div>
            <div>{lbl('Notes')}<textarea value={form.notes||''} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any extra details..." style={{ width:'100%', padding:'11px 14px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:14, outline:'none', resize:'none', fontFamily:"'Unbounded',sans-serif", boxSizing:'border-box' }} /></div>
          </>}

          {/* Sold toggle (edit only) */}
          {isEdit && <>
            <label style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', cursor:'pointer' }}>
              <input type="checkbox" checked={!!form.sold} onChange={e => set('sold', e.target.checked)} style={{ accentColor:'#9333ea', width:18, height:18 }} />
              <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:14, fontWeight:600, color:'#ccc' }}>Mark as Sold 💰</div>
            </label>
            {form.sold && <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>{lbl('Sold Price ($)')}{inp('soldPrice', '0.00', 'number')}</div>
              <div>{lbl('Sold Date')}{inp('soldDate', '', 'date')}</div>
            </div>}
          </>}

        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving || !form.player}
          style={{ width:'100%', padding:'12px', borderRadius:11, marginTop:14, background: (!form.player||saving) ? '#1a1a1a' : 'linear-gradient(135deg,#9333ea,#a855f7)', border: (!form.player||saving) ? '1px solid #2a2a2a' : 'none', color: (!form.player||saving) ? '#444' : '#fff', fontFamily:"'Unbounded',sans-serif", fontSize:15, fontWeight:800, cursor: (!form.player||saving) ? 'not-allowed' : 'pointer', letterSpacing:'-0.3px' }}>
          {saving ? 'Saving...' : (isEdit ? 'Save Changes' : '+ Add Card')}
        </button>

      </div>
    </div>
  )
}


function Sidebar({ user, onLogout, active = '' }) {
  return (
    <aside style={{ width:200, minHeight:'100vh', background:'#000', borderRight:'1px solid #111', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:60 }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid #111', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={LOGO} alt="TopLoad" style={{ width:140, height:'auto', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV.map(({ label, href }) => {
          const isActive = active === label
          const Icon = navIcons[label]
          if (!Icon) return null
          return (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color: isActive ? '#fff' : '#555', background: isActive ? '#9333ea' : 'transparent', fontSize:13, fontWeight: isActive ? 700 : 500, transition:'all 0.15s' }}>
              <Icon /><span style={{flex:1}}>{label}</span>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'12px 8px', borderTop:'1px solid #111' }}>
        <Link href="/settings" style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, textDecoration:'none', color:'#555', fontSize:13, fontWeight:500 }}><IconSettings /><span>Settings</span></Link>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#555', fontSize:13, fontWeight:500 }}><IconLogout /><span>Sign Out</span></button>
        {user && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', marginTop:4, borderRadius:10, background:'#111' }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#9333ea', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff', flexShrink:0 }}>{user.username?.[0]?.toUpperCase()||'A'}</div>
          <div style={{overflow:'hidden'}}><div style={{ fontSize:11, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>@{user.username}</div><div style={{ fontSize:9, color:'#555', marginTop:1 }}>{user.email}</div></div>
        </div>}
      </div>
    </aside>
  )
}

function BottomNav({ active = '' }) {
  const SHORT = { 'Dashboard':'Home', 'Collection':'Cards', 'Insights':'Stats', 'Market':'Market', 'PSA Lookup':'PSA' }
  return (
    <nav className="mobile-only" style={{ position:'fixed', bottom:0, left:0, right:0, height:76, background:'#000', borderTop:'1px solid #111', display:'flex', alignItems:'center', zIndex:100 }}>
      {NAV.map(({ label, href }) => {
        const isActive = active === label
        const Icon = navIcons[label]
        if (!Icon) return null
        return (
          <Link key={label} href={href} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, textDecoration:'none', paddingBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background: isActive ? '#9333ea' : 'transparent', color: isActive ? '#fff' : '#444', transition:'all 0.15s' }}><Icon /></div>
            <span style={{ fontSize:10, fontWeight:800, color: isActive ? '#9333ea' : '#444', letterSpacing:'0.06em', textTransform:'uppercase' }}>{SHORT[label]||label}</span>
          </Link>
        )
      })}
    </nav>
  )
}


function QRScannerModal({ onScan, onClose }) {
  const videoRef = React.useRef(null)
  const canvasRef = React.useRef(null)
  const [status, setStatus] = React.useState('starting')
  const [error, setError] = React.useState('')
  const streamRef = React.useRef(null)
  const rafRef = React.useRef(null)
  const workerRef = React.useRef(null)

  React.useEffect(() => {
    let stopped = false

    // Dynamically load jsQR — works on iOS Safari + Android Chrome
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js'
    script.onload = () => startCamera()
    script.onerror = () => setError('Failed to load QR library. Check your connection.')
    document.head.appendChild(script)

    function startCamera() {
      if (stopped) return
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then(stream => {
          if (stopped) { stream.getTracks().forEach(t => t.stop()); return }
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play()
              setStatus('scanning')
              rafRef.current = requestAnimationFrame(tick)
            }
          }
        })
        .catch(e => {
          if (e.name === 'NotAllowedError') setError('Camera access denied. Go to Settings → Safari → Camera and allow access, then try again.')
          else setError('Could not access camera: ' + e.message)
          setStatus('error')
        })
    }

    function tick() {
      if (stopped) return
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      if (window.jsQR) {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' })
        if (code?.data) {
          const text = code.data
          // PSA QR codes: URL like psacard.com/cert/12345678 or just the number
          const m = text.match(/(\d{6,12})/)
          if (m) { stop(); onScan(m[1]); return }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    function stop() {
      stopped = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }

    return () => { stop(); document.head.removeChild(script) }
  }, [])

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:380, background:'#111', border:'1px solid #1e1e1e', borderRadius:20, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.12em' }}>PSA QR Scanner</div>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginTop:2 }}>Scan the slab label</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#555', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Video preview */}
        <div style={{ position:'relative', background:'#000', aspectRatio:'1', overflow:'hidden' }}>
          <video ref={videoRef} style={{ width:'100%', height:'100%', objectFit:'cover' }} playsInline muted />
          <canvas ref={canvasRef} style={{ display:'none' }} />

          {/* Corner viewfinder */}
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
            <div style={{ width:200, height:200, position:'relative' }}>
              {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],i) => (
                <div key={i} style={{ position:'absolute', [v]:0, [h]:0, width:28, height:28,
                  borderTop: v==='top' ? '3px solid #9333ea' : 'none',
                  borderBottom: v==='bottom' ? '3px solid #9333ea' : 'none',
                  borderLeft: h==='left' ? '3px solid #9333ea' : 'none',
                  borderRight: h==='right' ? '3px solid #9333ea' : 'none',
                  borderRadius: v==='top'&&h==='left'?'4px 0 0 0':v==='top'&&h==='right'?'0 4px 0 0':v==='bottom'&&h==='left'?'0 0 0 4px':'0 0 4px 0'
                }} />
              ))}
            </div>
          </div>

          {status === 'starting' && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
              <div style={{ fontSize:28 }}>📷</div>
              <div style={{ fontSize:12, color:'#555' }}>Starting camera...</div>
            </div>
          )}
        </div>

        <div style={{ padding:'14px 20px' }}>
          {error
            ? <div style={{ fontSize:12, color:'#ef4444', lineHeight:1.6, marginBottom:12 }}>{error}</div>
            : <p style={{ fontSize:12, color:'#555', marginBottom:12, lineHeight:1.5 }}>
                {status === 'scanning' ? 'Point at the QR code on the PSA label and hold steady.' : 'Loading...'}
              </p>
          }
          <button onClick={onClose} style={{ width:'100%', padding:'11px', borderRadius:10, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#666', fontSize:14, fontWeight:700, cursor:'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default function PSALookupPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cert, setCert] = useState('')
  const [result, setResult] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [addSuccess, setAddSuccess] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState(null)
  const [imgFront, setImgFront] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [history, setHistory] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => { if (!r.ok) router.push('/login'); return r.json() })
      .then(d => { setUser(d.user); setLoading(false) })
      .catch(() => router.push('/login'))
  }, [router])

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }

  async function handleLookup() {
    const c = cert.trim().replace(/\D/g, '')
    if (!c) return
    setSearching(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/api/psa?cert=${c}`)
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Cert not found')
      } else {
        setResult(data)
        setImgFront(true)
        setHistory(prev => [{ cert: c, player: data.player, grade: data.grade }, ...prev.filter(h => h.cert !== c)].slice(0, 5))
      }
    } catch(e) {
      setError('Lookup failed. Please try again.')
    }
    setSearching(false)
  }

  function handleAddToCollection() {
    if (!result) return
    setAddForm({
      player: result.player || '',
      year: result.year || '',
      sport: result.sport || '',
      brand: result.brand || '',
      name: result.set || '',
      grade: result.grade || '',
      gradingCo: 'PSA',
      autoGrade: result.autoGrade || '',
      auto: !!result.autoGrade,
      cond: 'Graded',
      qty: 1,
      buy: 0,
      val: 0,
      num: result.cardNumber || '',
      notes: `PSA Cert #${result.cert}${result.variety ? ' · ' + result.variety : ''}`,
    })
    setShowAddModal(true)
  }

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}><img src={LOGO} alt="TopLoad" style={{ width:120, opacity:0.4, filter:'brightness(0) invert(1)' }} /></div>

  const gradeColor = result ? (parseInt(result.grade) >= 9 ? '#22c55e' : parseInt(result.grade) >= 7 ? '#ffbe2e' : '#ef4444') : '#9333ea'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&display=swap');
        *{font-family:'Unbounded',-apple-system,sans-serif!important}
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:200px;min-height:100vh;width:calc(100% - 200px)}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding:16px 16px 90px!important}}
        input:focus,select:focus,textarea:focus{border-color:#9333ea!important;outline:none}
        .hist-item:hover{background:#1a1a1a!important}
        html,body{overflow-x:hidden!important;max-width:100vw!important}
        @media(max-width:768px){.main-wrap{overflow-x:hidden!important;max-width:100%!important;padding:12px 12px 90px!important;box-sizing:border-box!important}*{max-width:100%!important;box-sizing:border-box!important}.psa-grid{grid-template-columns:1fr!important}.psa-result-inner{flex-direction:column!important}.psa-search-row{flex-wrap:wrap!important}}
        @media(max-width:768px){.psa-grid{grid-template-columns:1fr!important}.psa-result-inner{flex-direction:column!important}.psa-img-wrap{width:100%!important;display:flex;flex-direction:column;align-items:center}.psa-details-grid{grid-template-columns:1fr 1fr!important}.psa-pop-grid{grid-template-columns:repeat(3,1fr)!important}.main-wrap{padding:12px 12px 90px!important}}
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} active="PSA Lookup" /></div>

        <main className="main-wrap" style={{ padding:'28px 28px 40px' }}>

          <div className="mob-topbar" style={{ alignItems:'center', justifyContent:'center', marginBottom:20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:32, filter:'brightness(0) invert(1)' }} />
          </div>

          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>Grade Verification</div>
            <h1 style={{ fontSize:36, fontWeight:900, color:'#fff', letterSpacing:'-1.5px', textTransform:'uppercase', margin:'0 0 6px' }}>PSA LOOKUP</h1>
            <p style={{ fontSize:12, color:'#555', fontWeight:500 }}>Enter a PSA cert number to verify the grade, view card details and images</p>
          </div>

          <div className="psa-grid" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>
            <div>
              <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'18px 20px', marginBottom:20 }}>
                <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>Cert Number</div>
                <div className="psa-search-row" style={{ display:'flex', gap:10 }}>
                  <input value={cert} onChange={e => setCert(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLookup()} placeholder="e.g. 12345678"
                    style={{ flex:1, minWidth:0, padding:'11px 14px', borderRadius:10, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:16, fontFamily:"'Unbounded',sans-serif", letterSpacing:'0.05em', transition:'border-color 0.15s', boxSizing:'border-box' }} />
                  <button onClick={handleLookup} disabled={searching || !cert.trim()} style={{ padding:'11px 20px', borderRadius:10, background: searching||!cert.trim() ? '#1a1a1a' : '#9333ea', border:'none', color: searching||!cert.trim() ? '#555' : '#fff', fontSize:14, fontWeight:800, cursor: searching||!cert.trim() ? 'not-allowed' : 'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                    {searching ? 'Looking up...' : 'Verify'}
                  </button>
                  <button onClick={() => setScanning(true)} style={{ padding:'11px 12px', borderRadius:10, background:'#111', border:'1px solid #1e1e1e', color:'#a855f7', cursor:'pointer', fontSize:13, fontWeight:700, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:4 }}>
                    📷 Scan
                  </button>
                </div>
              </div>

              {error && <div style={{ marginBottom:16, padding:'14px 16px', borderRadius:10, background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}><IconX /> {error}</div>}
              {addSuccess && <div style={{ marginBottom:16, padding:'14px 16px', borderRadius:10, background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.2)', color:'#22c55e', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}><IconCheck /> Card added to your collection</div>}

              {result && (
                <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:16, overflow:'hidden' }}>
                  <div style={{ padding:'12px 20px', background: result.isCancelled ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.06)', borderBottom:'1px solid #1a1a1a', display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background: result.isCancelled ? '#ef4444' : '#22c55e', boxShadow: `0 0 8px ${result.isCancelled ? '#ef4444' : '#22c55e'}` }} />
                    <span style={{ fontSize:11, fontWeight:800, color: result.isCancelled ? '#ef4444' : '#22c55e', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                      {result.isCancelled ? 'CANCELLED — DO NOT BUY' : 'VERIFIED AUTHENTIC'}
                    </span>
                  </div>
                  <div className="psa-result-inner" style={{ display:'flex', gap:20, padding:'20px', flexWrap:'wrap' }}>
                    <div style={{ flexShrink:0, width:180 }} className="psa-img-wrap">
                      {result.certPageUrl && (
                        <a href={result.certPageUrl} target="_blank" rel="noopener noreferrer" style={{ display:'block', width:'100%', padding:'11px', borderRadius:10, background:'rgba(147,51,234,0.08)', border:'1px solid rgba(147,51,234,0.2)', color:'#a855f7', fontSize:13, fontWeight:800, textAlign:'center', textDecoration:'none' }}>
                          View on PSA ↗
                        </a>
                      )}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                        <div style={{ width:56, height:56, borderRadius:10, background:`${gradeColor}18`, border:`2px solid ${gradeColor}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:26, fontWeight:900, color:gradeColor, lineHeight:1 }}>{result.grade}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', lineHeight:1.1 }}>{result.player || '—'}</div>
                          {result.gradeDescription && <div style={{ fontSize:12, color:'#555', marginTop:3 }}>{result.gradeDescription}</div>}
                        </div>
                      </div>
                      <div className="psa-details-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                        {[
                          { label:'Cert #', value: result.cert },
                          { label:'Year', value: result.year || '—' },
                          { label:'Sport', value: result.sport || '—' },
                          { label:'Brand', value: result.brand || '—' },
                          { label:'Card #', value: result.cardNumber || '—' },
                          { label:'Set', value: result.set || '—' },
                          ...(result.autoGrade ? [{ label:'Auto Grade', value: result.autoGrade }] : []),
                          ...(result.variety ? [{ label:'Variety', value: result.variety }] : []),
                          ...(result.labelType ? [{ label:'Label', value: result.labelType }] : []),
                        ].map((f,i) => (
                          <div key={i} style={{ background:'#181818', border:'1px solid #1e1e1e', borderRadius:8, padding:'10px 12px' }}>
                            <div style={{ fontSize:9, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{f.label}</div>
                            <div style={{ fontSize:12, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      {/* Pop Report */}
                      {(result.totalPop > 0 || result.popHigher >= 0) && (
                        <div style={{ marginBottom:14, background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:10, padding:'12px 14px' }}>
                          <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>PSA Pop Report</div>
                          <div className="psa-pop-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                            {[
                              { label:'This Grade', value: (result.totalPop - result.popHigher - result.totalPopWithQualifier) || result.totalPop, color:'#a855f7' },
                              { label:'Graded Higher', value: result.popHigher, color:'#22c55e' },
                              { label:'Total Pop', value: result.totalPop, color:'#888' },
                            ].map((p,i) => (
                              <div key={i} style={{ textAlign:'center' }}>
                                <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:16, fontWeight:900, color:p.color }}>{p.value.toLocaleString()}</div>
                                <div style={{ fontSize:9, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:3 }}>{p.label}</div>
                              </div>
                            ))}
                          </div>
                          {result.popHigher === 0 && <div style={{ marginTop:10, fontSize:11, color:'#22c55e', fontWeight:700, textAlign:'center' }}>🏆 Top grade — nothing graded higher</div>}
                        </div>
                      )}

                      {!result.isCancelled && (
                        <button onClick={handleAddToCollection} style={{ width:'100%', padding:'12px', borderRadius:10, background:'#9333ea', border:'none', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                          + Add to Collection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {history.length > 0 && (
                <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'16px' }}>
                  <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Recent Lookups</div>
                  {history.map((h, i) => (
                    <div key={i} className="hist-item" onClick={() => setCert(h.cert)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', background:'transparent', transition:'background 0.1s', marginBottom: i<history.length-1?4:0 }}>
                      <div style={{ width:32, height:32, borderRadius:7, background:'rgba(147,51,234,0.1)', border:'1px solid rgba(147,51,234,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Unbounded',sans-serif", fontSize:13, fontWeight:900, color:'#a855f7', flexShrink:0 }}>{h.grade}</div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.player}</div>
                        <div style={{ fontSize:10, color:'#444', fontFamily:"'Unbounded',sans-serif" }}>#{h.cert}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'16px' }}>
                <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>How to find the cert #</div>
                {[
                  { icon:'🏷️', text:'Find it on the label inside the PSA slab' },
                  { icon:'📱', text:'Scan the QR code on the slab' },
                  { icon:'🔢', text:'Numbers only, usually 7-9 digits' },
                  { icon:'⚠️', text:'A cancelled cert means fraud or returned card' },
                ].map((t,i) => (
                  <div key={i} style={{ display:'flex', gap:10, marginBottom: i<3?10:0 }}>
                    <span style={{ fontSize:14, flexShrink:0 }}>{t.icon}</span>
                    <span style={{ fontSize:12, color:'#555', lineHeight:1.5 }}>{t.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'16px' }}>
                <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Grade Guide</div>
                {[
                  { grade:'PSA 10', label:'Gem Mint', color:'#22c55e' },
                  { grade:'PSA 9', label:'Mint', color:'#22c55e' },
                  { grade:'PSA 8', label:'NM-MT', color:'#ffbe2e' },
                  { grade:'PSA 7', label:'Near Mint', color:'#ffbe2e' },
                  { grade:'PSA 6', label:'EX-MT', color:'#f97316' },
                  { grade:'PSA 5', label:'Excellent', color:'#ef4444' },
                ].map((g,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 0', borderBottom: i<5?'1px solid #141414':'none' }}>
                    <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:12, fontWeight:800, color:g.color }}>{g.grade}</div>
                    <div style={{ fontSize:11, color:'#555' }}>{g.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <BottomNav active="PSA Lookup" />
      </div>


      {/* QR Scanner Modal */}
      {scanning && <QRScannerModal onScan={(certNum) => { setCert(certNum); setScanning(false); setTimeout(handleLookup, 150) }} onClose={() => setScanning(false)} />}

      {showAddModal && addForm && <CardModal card={addForm} onClose={() => setShowAddModal(false)} onSave={() => { setShowAddModal(false); setAddSuccess(true); setTimeout(() => setAddSuccess(false), 3000) }} />}
    </>
  )
}
