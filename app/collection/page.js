'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sold History', href: '/sold' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconWishlist() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconClose() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IconEdit() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function IconTrash() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IconUp() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconDown() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }
function IconDownload() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IconUpload() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> }
function IconSearch() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconTag() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> }
function IconCalc() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg> }
function IconExternalLink() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }
function IconGrid() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function IconList() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }

function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Insights': IconInsights, 'Sold History': IconSold }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)
const SPORTS = [
  // Sports Cards
  'Baseball', 'Basketball', 'Football', 'Soccer', 'Hockey', 'Tennis', 'Golf', 'F1',
  // TCG
  'Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece', 'Dragon Ball Super', 'Digimon',
  // Other
  'Other'
]

const TCG_LIST = ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece', 'Dragon Ball Super', 'Digimon']

// TCG-specific rarities
const TCG_RARITIES = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Reverse Holo', 'Ultra Rare', 'Secret Rare', 'Full Art', 'Rainbow Rare', 'Alt Art', 'Gold Rare', 'Promo']
const EDITIONS = ['1st Edition', 'Unlimited', 'Shadowless', 'Limited', 'First Print']
const LANGUAGES = ['English', 'Japanese', 'Korean', 'Chinese', 'German', 'French', 'Italian', 'Spanish', 'Portuguese']
const CONDS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Poor']
const EMPTY = { sport: '', year: '', player: '', name: '', brand: '', num: '', cond: '', grade: '', qty: '1', date: '', buy: '', val: '', notes: '', sold: false, soldPrice: '', soldDate: '', rarity: '', edition: '', language: '' }

// ── Toast ──────────────────────────────────────────────────────────────────────
var _toastFn = null
function showToast(msg, type = 'success', onUndo = null) { if (_toastFn) _toastFn(msg, type, onUndo) }
function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    _toastFn = (msg, type, onUndo) => {
      const id = Date.now()
      setToasts(prev => [...prev.slice(-2), { id, msg, type, onUndo }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
    }
    return () => { _toastFn = null }
  }, [])
  const colors = { success: '#22c55e', error: '#e53935', info: '#888' }
  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  if (!toasts.length) return null
  return (
    <div style={{ position:'fixed', bottom:88, left:'50%', transform:'translateX(-50%)', zIndex:9999, display:'flex', flexDirection:'column', gap:8, alignItems:'center', pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRadius:12, background:'#1e1e1e', border:`1px solid ${colors[t.type]}50`, boxShadow:'0 8px 28px rgba(0,0,0,0.6)', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, color:'#f0f0f0', pointerEvents:'auto', animation:'toastIn 0.2s ease', whiteSpace:'nowrap' }}>
          <span style={{ color:colors[t.type] }}>{icons[t.type]}</span>
          {t.msg}
          {t.onUndo && <button onClick={t.onUndo} style={{ marginLeft:6, padding:'2px 10px', borderRadius:6, background:'rgba(255,255,255,0.08)', border:'none', color:'#e53935', fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:700, cursor:'pointer', pointerEvents:'auto' }}>Undo</button>}
        </div>
      ))}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Sk({ w='100%', h=20, r=8, style={} }) {
  return <div style={{ width:w, height:h, borderRadius:r, background:'linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite', ...style }} />
}
function CollectionSkeleton() {
  return (
    <div style={{ padding:'16px 16px 80px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}><Sk w={150} h={26} r={8} /><Sk w={90} h={36} r={10} /></div>
      <Sk h={42} r={10} style={{ marginBottom:10 }} />
      <Sk h={36} r={10} style={{ marginBottom:16 }} />
      {[1,2,3,4].map(i => (
        <div key={i} style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'14px 16px', marginBottom:10, animation:`fadeUp 0.45s ease ${i*0.12}s both` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}><Sk w={160} h={16} r={6} /><Sk w={50} h={22} r={6} /></div>
          <div style={{ display:'flex', gap:10, marginBottom:10 }}><Sk w={70} h={34} r={8} /><Sk w={70} h={34} r={8} /><Sk w={70} h={34} r={8} /></div>
          <div style={{ display:'flex', gap:6 }}><Sk h={32} r={8} style={{ flex:1 }} /><Sk h={32} r={8} style={{ flex:1 }} /><Sk h={32} r={8} style={{ flex:1 }} /></div>
        </div>
      ))}
    </div>
  )
}

// ── Swipe to Delete (mobile) ─────────────────────────────────────────────────
function SwipeRow({ children, onDelete }) {
  const [swipeX, setSwipeX] = useState(0)
  const startX = useRef(0)
  const dragging = useRef(false)
  const onStart = e => { startX.current = e.touches[0].clientX; dragging.current = true }
  const onMove = e => {
    if (!dragging.current) return
    const dx = Math.min(0, Math.max(-80, e.touches[0].clientX - startX.current))
    setSwipeX(dx)
  }
  const onEnd = () => {
    dragging.current = false
    if (swipeX < -55) setSwipeX(-76)
    else setSwipeX(0)
  }
  return (
    <div style={{ position:'relative', overflow:'hidden', borderRadius:14 }}>
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:76, background:'rgba(229,57,53,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', borderRadius:'0 14px 14px 0' }}
        onClick={() => { setSwipeX(0); onDelete() }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
      </div>
      <div style={{ transform:`translateX(${swipeX}px)`, transition:dragging.current?'none':'transform 0.2s ease', willChange:'transform' }}
        onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}>
        {children}
      </div>
    </div>
  )
}



// ── Pull to Refresh ───────────────────────────────────────────────────────────
function usePullToRefresh(onRefresh) {
  const [pullY, setPullY] = useState(0)
  const startY = useRef(0)
  const active = useRef(false)
  useEffect(() => {
    const onStart = e => { if (window.scrollY === 0) { startY.current = e.touches[0].clientY; active.current = true } }
    const onMove = e => {
      if (!active.current) return
      const dy = Math.max(0, Math.min(72, e.touches[0].clientY - startY.current))
      setPullY(dy)
    }
    const onEnd = () => {
      if (!active.current) return
      active.current = false
      if (pullY >= 60) { onRefresh(); showToast('Refreshed', 'info') }
      setPullY(0)
    }
    window.addEventListener('touchstart', onStart, {passive:true})
    window.addEventListener('touchmove', onMove, {passive:true})
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [onRefresh, pullY])
  return pullY
}
function PullIndicator({pullY}) {
  if (!pullY) return null
  const ready = pullY >= 60
  return <div style={{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',zIndex:999,padding:'8px 16px',borderRadius:'0 0 12px 12px',background:'#1a1a1a',border:'1px solid #2a2a2a',borderTop:'none',fontFamily:"'Outfit',sans-serif",fontSize:12,color:ready?'#22c55e':'#555',fontWeight:600,display:'flex',alignItems:'center',gap:6}}><span style={{display:'inline-block',animation:ready?'spin 0.5s linear infinite':'none'}}>↓</span>{ready?'Release to refresh':'Pull to refresh'}</div>
}

function getPriceLinks(card) {
  const q = encodeURIComponent([card.year, card.player, card.name, card.brand, card.grade ? 'Grade ' + card.grade : ''].filter(Boolean).join(' ') + ' card')
  const qs = encodeURIComponent([card.player, card.year, card.name].filter(Boolean).join(' '))
  return [
    { label: 'eBay Sold Listings', color: '#e53238', url: 'https://www.ebay.com/sch/i.html?_nkw=' + q + '&LH_Sold=1&LH_Complete=1' },
    { label: 'eBay Active Listings', color: '#0064d2', url: 'https://www.ebay.com/sch/i.html?_nkw=' + q },
    { label: '130Point', color: '#7c5cfc', url: 'https://130point.com/sales/?query=' + qs },
    { label: 'Card Ladder', color: '#e53935', url: 'https://www.cardladder.com/search?q=' + qs },
    { label: 'PSA Auction Prices', color: '#ffbe2e', url: 'https://www.psacard.com/auctionprices/search?q=' + qs },
  ]
}

function exportCSV(cards) {
  const headers = ['Player','Sport','Year','Card Name','Brand','Card #','Condition','Grade','Qty','Purchase Date','Buy Price','Current Value','Sold','Sold Price','Sold Date','Notes']
  const rows = cards.map(c => [c.player,c.sport,c.year,c.name,c.brand,c.num,c.cond,c.grade,c.qty,c.date,c.buy,c.val,c.sold?'Yes':'No',c.soldPrice||'',c.soldDate||'',c.notes||''].map(v => '"' + String(v||'').replace(/"/g,'""') + '"').join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'topload-collection-' + new Date().toISOString().slice(0,10) + '.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/"/g,'').trim().toLowerCase())
  return lines.slice(1).map(line => {
    const vals = []; let cur = '', inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ } else if (ch === ',' && !inQ) { vals.push(cur); cur = '' } else cur += ch
    }
    vals.push(cur)
    const row = {}
    headers.forEach((h, i) => { row[h] = (vals[i]||'').replace(/"/g,'').trim() })
    return { player: row['player']||row['player name']||'', sport: row['sport']||'', year: row['year']||'', name: row['card name']||row['name']||'', brand: row['brand']||'', num: row['card #']||row['num']||'', cond: row['condition']||'', grade: row['grade']||row['psa grade']||'', qty: parseInt(row['qty']||'1')||1, date: row['purchase date']||row['date']||'', buy: parseFloat(row['buy price']||row['buy']||'0')||0, val: parseFloat(row['current value']||row['val']||'0')||0, notes: row['notes']||'' }
  }).filter(r => r.player)
}

function Sidebar({ user, onLogout, cardCount = 0, active = "" }) {
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#0d0d0d', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 60 }}>
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e' }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800 }}><img src="/logo-transparent.png" alt="TopLoad" style={{ width: 120, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} /></div>
        
      </div>
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: 10, color: '#333', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Menu</div>
        {NAV.map(({ label, href }) => {
          const isActive = active === label
          const Icon = navIcons[label]
          return <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: active ? '#e53935' : '#6a75a0', background: active ? 'rgba(229,57,53,0.08)' : 'transparent', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 500, borderLeft: isActive ? '2px solid #e53935' : '2px solid transparent', transition: 'all 0.15s' }}><Icon /><span style={{ flex:1 }}>{label}</span>{label === 'Collection' && cardCount > 0 && <span style={{ fontSize:10, fontWeight:700, background:'rgba(229,57,53,0.15)', color:'#e53935', borderRadius:6, padding:'1px 6px', fontFamily:"'JetBrains Mono',monospace" }}>{cardCount}</span>}</Link>
        })}
      </nav>
      <div style={{ padding: '14px 10px', borderTop: '1px solid #1e1e1e' }}>
        {user && <div style={{ padding: '10px 12px', marginBottom: 4, borderRadius: 10, background: 'rgba(255,255,255,0.03)', fontFamily: "'Outfit',sans-serif" }}><div style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}>@{user.username}</div><div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{user.email}</div></div>}
        <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: '#555', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconSettings />Settings</Link>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#555', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconLogout />Sign Out</button>
      </div>
    </aside>
  )
}

function BottomNav({ active = "" }) {
  return (
    <nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', zIndex: 100 }}>
      {NAV.map(({ label, href }) => {
        const isActive = active === label
        const Icon = navIcons[label]
        return <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: active ? '#e53935' : '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: 4 }}><Icon />{label}</Link>
      })}
    </nav>
  )
}

function CardModal({ card, onClose, onSave }) {
  const [form, setForm] = useState(card || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.player) { setError('Player name is required'); return }
    setSaving(true); setError('')
    try {
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch('/api/cards', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to save'); setSaving(false); return }
      onSave()
    } catch { setError('Something went wrong'); setSaving(false) }
  }

  const field = (label, key, type = 'text', opts = null) => (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
      {opts ? (
        <select value={form[key]||''} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: form[key] ? 'var(--text)' : '#4a5578', fontSize: 14, outline: 'none' }}>
          <option value="">Select...</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]||''} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none' }} />
      )}
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>{form.id ? 'Edit Card' : 'Add Card'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        {error && <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,122,0.1)', color: '#ff5252', fontSize: 13, border: '1px solid rgba(255,107,122,0.2)' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>{field(TCG_LIST.includes(form.sport) ? 'Card Name *' : 'Player / Card Name *', 'player')}</div>
          {field('Sport / Game', 'sport', 'text', SPORTS)}
          {field('Year', 'year')}
          {field(TCG_LIST.includes(form.sport) ? 'Set / Expansion' : 'Card Name / Set', 'name')}
          {field(TCG_LIST.includes(form.sport) ? 'Series / Publisher' : 'Brand', 'brand')}
          {field('Card Number', 'num')}
          {TCG_LIST.includes(form.sport) ? field('Rarity', 'rarity', 'text', TCG_RARITIES) : field('Condition', 'cond', 'text', CONDS)}
          {TCG_LIST.includes(form.sport) ? field('Edition', 'edition', 'text', EDITIONS) : field('Grade', 'grade')}
          {TCG_LIST.includes(form.sport) && field('Language', 'language', 'text', LANGUAGES)}
          {!TCG_LIST.includes(form.sport) && field('Grade', 'grade')}
          {field('Quantity', 'qty', 'number')}
          {field('Purchase Date', 'date', 'date')}
          {field('Buy Price ($)', 'buy', 'number')}
          {field('Current Value ($)', 'val', 'number')}
          <div style={{ gridColumn: '1/-1', borderTop: '1px solid #1e1e1e', paddingTop: 14, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.sold} onChange={e => set('sold', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--cyan)' }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: '#ccc' }}>Mark as Sold</span>
            </label>
          </div>
          {form.sold && <>
            {field('Sold Price ($)', 'soldPrice', 'number')}
            {field('Sold Date', 'soldDate', 'date')}
          </>}
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Notes</label>
            <textarea value={form.notes||''} onChange={e => set('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: "'Outfit',sans-serif" }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,#e53935,#ff5252)', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save Card'}</button>
        </div>
      </div>
    </div>
  )
}

function PriceLookupModal({ card, onClose }) {
  const links = getPriceLinks(card)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>Check Prices</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 18, fontFamily: "'Outfit',sans-serif" }}>{card.player}{card.year ? ' · ' + card.year : ''}{card.grade ? ' · Grade ' + card.grade : ''}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {links.map(({ label, color, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: color + '18', border: '1px solid ' + color + '40', textDecoration: 'none' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: '#f0f2ff' }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color, fontWeight: 600 }}>Search <IconExternalLink /></div>
            </a>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#333', marginTop: 14, textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>Opens each platform in a new tab with your card pre-searched</p>
      </div>
    </div>
  )
}

function SoldModal({ card, onClose, onSave }) {
  const [soldPrice, setSoldPrice] = useState(card.soldPrice || '')
  const [soldDate, setSoldDate] = useState(card.soldDate || new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const buy = parseFloat(card.buy) || 0
  const sold = parseFloat(soldPrice) || 0
  const profit = sold - buy
  const profitPct = buy > 0 ? (profit / buy) * 100 : 0

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/cards', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...card, sold: true, soldPrice, soldDate }) })
      onSave()
    } catch { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, width: '100%', maxWidth: 380, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>Mark as Sold</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 18, fontFamily: "'Outfit',sans-serif" }}>{card.player}{card.year ? ' · ' + card.year : ''}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Sold Price ($)</label>
            <input type="number" value={soldPrice} onChange={e => setSoldPrice(e.target.value)} placeholder="Enter sale price" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Sold Date</label>
            <input type="date" value={soldDate} onChange={e => setSoldDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none' }} />
          </div>
          {soldPrice && (
            <div style={{ padding: '12px 16px', borderRadius: 10, background: profit >= 0 ? 'rgba(34,211,167,0.08)' : 'rgba(255,107,122,0.08)', border: '1px solid ' + (profit >= 0 ? 'rgba(229,57,53,0.2)' : 'rgba(255,107,122,0.2)') }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Realized P&L</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, color: profit >= 0 ? '#e53935' : '#616161' }}>{profit >= 0 ? '+' : ''}{fmt(profit)} <span style={{ fontSize: 13 }}>({profitPct >= 0 ? '+' : ''}{profitPct.toFixed(1)}%)</span></div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Bought for {fmt(buy)}</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !soldPrice} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,#e53935,#ff5252)', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (saving || !soldPrice) ? 0.5 : 1 }}>{saving ? 'Saving...' : 'Mark Sold'}</button>
        </div>
      </div>
    </div>
  )
}

function ImportModal({ onClose, onImport }) {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = parseCSV(ev.target.result)
        if (!parsed.length) { setError('No valid cards found. Make sure CSV has a Player column.'); return }
        setCards(parsed); setError('')
      } catch { setError('Failed to parse CSV file') }
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    setImporting(true)
    let success = 0
    for (const card of cards) {
      try { await fetch('/api/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card) }); success++ } catch {}
    }
    onImport(success)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, width: '100%', maxWidth: 460, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>Import CSV</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 16, lineHeight: 1.6, fontFamily: "'Outfit',sans-serif" }}>Upload a CSV with your cards. Required column: <strong style={{ color: '#ccc' }}>Player</strong>. Optional: Sport, Year, Card Name, Brand, Grade, Qty, Buy Price, Current Value.</p>
        {error && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,122,0.1)', color: '#ff5252', fontSize: 13 }}>{error}</div>}
        <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: '28px 20px', textAlign: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: '#666' }}>{cards.length ? cards.length + ' cards ready to import' : 'Click to select a CSV file'}</div>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} />
        </div>
        {cards.length > 0 && (
          <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 16, borderRadius: 10, background: '#0a0a0a', border: '1px solid #2a2a2a' }}>
            {cards.slice(0, 5).map((c, i) => <div key={i} style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#ccc' }}>{c.player}{c.year ? ' · ' + c.year : ''}{c.sport ? ' · ' + c.sport : ''}</div>)}
            {cards.length > 5 && <div style={{ padding: '8px 14px', fontSize: 12, color: '#555', fontFamily: "'Outfit',sans-serif" }}>...and {cards.length - 5} more</div>}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleImport} disabled={!cards.length || importing} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,#e53935,#ff5252)', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (!cards.length || importing) ? 0.5 : 1 }}>{importing ? 'Importing...' : 'Import ' + cards.length + ' Cards'}</button>
        </div>
      </div>
    </div>
  )
}

function BreakEvenModal({ card, onClose }) {
  const buy = (parseFloat(card.buy) || 0) * (parseInt(card.qty) || 1)
  const [ebayFee, setEbayFee] = useState('13.25')
  const [shipping, setShipping] = useState('5.00')
  const [targetSell, setTargetSell] = useState('')

  const ebayFeeAmt = buy > 0 ? (parseFloat(ebayFee) / 100) * (parseFloat(targetSell) || 0) : 0
  const shippingAmt = parseFloat(shipping) || 0

  // Break even = what you need to sell for to get back what you paid
  const breakEven = buy + (buy * (parseFloat(ebayFee) / 100)) + shippingAmt
  // More precise: solve for sell price where sell - (sell * fee%) - shipping = buy
  const breakEvenExact = (buy + shippingAmt) / (1 - (parseFloat(ebayFee) / 100))

  // Target profit calc
  const targetSellAmt = parseFloat(targetSell) || 0
  const targetEbayFee = targetSellAmt * (parseFloat(ebayFee) / 100)
  const netProfit = targetSellAmt - buy - targetEbayFee - shippingAmt
  const netProfitPct = buy > 0 ? (netProfit / buy) * 100 : 0
  const isProfit = netProfit >= 0

  const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: "'JetBrains Mono',monospace", boxSizing: 'border-box', transition: 'border-color 0.15s' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, maxWidth: 420, width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f0f0', margin: 0 }}>Break Even Calculator</h3>
            <p style={{ fontSize: 12, color: '#555', marginTop: 3, fontFamily: "'Outfit',sans-serif" }}>{card.player} {card.year && `· ${card.year}`} {card.grade && `· Grade ${card.grade}`}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>

        {/* Buy price display */}
        <div style={{ padding: '12px 14px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>Your Cost Basis</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: '#f0f0f0' }}>{fmt(buy)}</div>
          {parseInt(card.qty) > 1 && <div style={{ fontSize: 11, color: '#444', marginTop: 2, fontFamily: "'Outfit',sans-serif" }}>{card.qty} × {fmt(parseFloat(card.buy))}</div>}
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>eBay Fee %</label>
            <input type="number" value={ebayFee} onChange={e => setEbayFee(e.target.value)} style={inputStyle} step="0.01"
              onFocus={e => e.target.style.borderColor = '#e53935'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Shipping ($)</label>
            <input type="number" value={shipping} onChange={e => setShipping(e.target.value)} style={inputStyle} step="0.01"
              onFocus={e => e.target.style.borderColor = '#e53935'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>
        </div>

        {/* Break even result */}
        <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(229,57,53,0.06)', border: '1px solid rgba(229,57,53,0.2)', marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: '#e53935', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Break Even Price</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 700, color: '#e53935' }}>{fmt(breakEvenExact)}</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 6, fontFamily: "'Outfit',sans-serif", display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span>Cost: {fmt(buy)} + eBay fee: {fmt(breakEvenExact * (parseFloat(ebayFee) / 100))} + Shipping: {fmt(shippingAmt)}</span>
          </div>
        </div>

        {/* Target sell price */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>My Target Sell Price ($)</label>
          <input type="number" value={targetSell} onChange={e => setTargetSell(e.target.value)} placeholder="Enter your target price..." style={{ ...inputStyle, fontSize: 16 }} step="0.01"
            onFocus={e => e.target.style.borderColor = '#e53935'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
        </div>

        {/* Target result */}
        {targetSellAmt > 0 && (
          <div style={{ padding: '14px 16px', borderRadius: 10, background: isProfit ? 'rgba(229,57,53,0.06)' : 'rgba(97,97,97,0.08)', border: `1px solid ${isProfit ? 'rgba(229,57,53,0.2)' : 'rgba(97,97,97,0.2)'}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>eBay Fee</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: '#666' }}>-{fmt(targetEbayFee)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>Shipping</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: '#666' }}>-{fmt(shippingAmt)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>Net Profit</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: isProfit ? '#22c55e' : '#e53935' }}>
                  {isProfit ? '+' : ''}{fmt(netProfit)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#666' }}>
                {isProfit ? '✅ You make money at this price' : '❌ You lose money at this price'}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: isProfit ? '#22c55e' : '#e53935' }}>
                {isProfit ? '+' : ''}{netProfitPct.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollectionPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [priceLookupCard, setPriceLookupCard] = useState(null)
  const [soldCard, setSoldCard] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')
  const [filterSport, setFilterSport] = useState('')
  const [sportTab, setSportTab] = useState('all') // 'all' | 'sports' | 'tcg' | specific sport
  const [filterStatus, setFilterStatus] = useState('active')
  const [filterGraded, setFilterGraded] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [deleteId, setDeleteId] = useState(null)
  const [importSuccess, setImportSuccess] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [breakEvenCard, setBreakEvenCard] = useState(null)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/cards', { cache: 'no-store' })])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setCards(await cardsRes.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])

  const pullY = usePullToRefresh(load)

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }
  async function handleDelete(id) {
    const card = cards.find(c => c.id === id)
    await fetch('/api/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setDeleteId(null)
    load()
    showToast(`${card?.player || 'Card'} deleted`, 'error')
  }

  function toggleSelect(id) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  async function handleBulkDelete() {
    const count = selected.size
    setBulkDeleting(true)
    for (const id of selected) {
      await fetch('/api/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    }
    setSelected(new Set()); setBulkDeleting(false); load()
    showToast(`${count} card${count !== 1 ? 's' : ''} deleted`, 'error')
  }

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || (c.player||'').toLowerCase().includes(q) || (c.name||'').toLowerCase().includes(q) || (c.brand||'').toLowerCase().includes(q)
    const isTCG = TCG_LIST.includes(c.sport)
    const matchSportTab = sportTab === 'all' || (sportTab === 'tcg' ? isTCG : sportTab === 'sports' ? !isTCG && c.sport !== '' : c.sport === sportTab)
    const matchSport = !filterSport || c.sport === filterSport
    const matchStatus = filterStatus === 'all' || (filterStatus === 'sold' ? c.sold : !c.sold)
    const matchGraded = !filterGraded || (filterGraded === 'graded' ? !!c.grade : !c.grade)
    const cardVal = parseFloat(c.val) || parseFloat(c.buy) || 0
    const matchMin = !priceMin || cardVal >= parseFloat(priceMin)
    const matchMax = !priceMax || cardVal <= parseFloat(priceMax)
    return matchSearch && matchSport && matchSportTab && matchStatus && matchGraded && matchMin && matchMax
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return ((parseFloat(a.val)||parseFloat(a.buy)||0)*(parseInt(a.qty)||1)) - ((parseFloat(b.val)||parseFloat(b.buy)||0)*(parseInt(b.qty)||1))
      case 'price_desc': return ((parseFloat(b.val)||parseFloat(b.buy)||0)*(parseInt(b.qty)||1)) - ((parseFloat(a.val)||parseFloat(a.buy)||0)*(parseInt(a.qty)||1))
      case 'buy_asc': return ((parseFloat(a.buy)||0)*(parseInt(a.qty)||1)) - ((parseFloat(b.buy)||0)*(parseInt(b.qty)||1))
      case 'buy_desc': return ((parseFloat(b.buy)||0)*(parseInt(b.qty)||1)) - ((parseFloat(a.buy)||0)*(parseInt(a.qty)||1))
      case 'name_asc': return (a.player||'').localeCompare(b.player||'')
      case 'name_desc': return (b.player||'').localeCompare(a.player||'')
      case 'date_asc': return new Date(a.createdAt) - new Date(b.createdAt)
      case 'date_desc': default: return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const activeCards = cards.filter(c => !c.sold)
  const soldCards = cards.filter(c => c.sold)

  // Filter by sport tab for stats
  const statActive = sportTab === 'all' ? activeCards : activeCards.filter(c => {
    const isTCG = TCG_LIST.includes(c.sport)
    if (sportTab === 'tcg') return isTCG
    if (sportTab === 'sports') return !isTCG && !!c.sport
    return c.sport === sportTab
  })
  const statSold = sportTab === 'all' ? soldCards : soldCards.filter(c => {
    const isTCG = TCG_LIST.includes(c.sport)
    if (sportTab === 'tcg') return isTCG
    if (sportTab === 'sports') return !isTCG && !!c.sport
    return c.sport === sportTab
  })

  const totalInvested = statActive.reduce((s, c) => s + (parseFloat(c.buy)||0) * (parseInt(c.qty)||1), 0)
  const totalValue = statActive.reduce((s, c) => s + (parseFloat(c.val)||parseFloat(c.buy)||0) * (parseInt(c.qty)||1), 0)
  const totalSoldRevenue = statSold.reduce((s, c) => s + (parseFloat(c.soldPrice)||0), 0)
  const totalSoldCost = statSold.reduce((s, c) => s + (parseFloat(c.buy)||0), 0)
  const realizedPL = totalSoldRevenue - totalSoldCost

  if (loading) return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
      <div className="sidebar-el" style={{ width:220, minHeight:'100vh', background:'#0d0d0d', borderRight:'1px solid #1e1e1e', flexShrink:0 }} />
      <div style={{ flex:1 }}><CollectionSkeleton /></div>
    </div>
  )

  return (
    <>
      <style>{`
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:220px;min-height:100vh;width:calc(100% - 220px)}.card-row:hover{background:rgba(255,255,255,0.02)!important}
        .mobile-cards{display:none!important}
        .desktop-table{display:block!important}
        .card-grid{display:none!important}
        .mob-stats{display:none!important}
        .desk-stats{display:grid!important}
        .mob-filters{display:none!important}
        .desk-filters{display:flex!important}
        .hide-mob{display:block!important}
        .press-btn{transition:transform 0.1s ease,opacity 0.1s ease;cursor:pointer}
        .press-btn:active{transform:scale(0.93)!important;opacity:0.85}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        @media(max-width:768px){
          .sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}
          .main-wrap{margin-left:0!important;width:100%!important;padding-bottom:80px!important;padding:12px 12px 80px!important}
          .mobile-cards{display:flex!important}.desktop-table{display:none!important}.card-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}.desktop-grid{display:none!important}
          .card-grid{display:none!important}
          .mob-stats{display:flex!important}.desk-stats{display:none!important}
          .mob-filters{display:flex!important}.desk-filters{display:none!important}
          .hide-mob{display:none!important}
        }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <PullIndicator pullY={pullY} />
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} cardCount={activeCards.length} active="Collection" /></div>        <main className="main-wrap" style={{ padding: '30px 28px' }}>
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <img src="/logo-transparent.png" alt="TopLoad" style={{ height: 30, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} />
            <button onClick={() => setModal('add')} className="press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.25)', borderRadius: 10, color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }} className='press'>+ Add Card</button>
          </div>
          {/* ── Desktop header ── */}
          <div className="hide-mob" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
            <div>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.5px', margin: 0 }}>Collection</h1>
              <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontWeight: 500 }}>{cards.length} cards · {activeCards.length} active · {soldCards.length} sold</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: 10, color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><IconUpload />Import CSV</button>
              <button onClick={() => exportCSV(cards)} disabled={!cards.length} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', borderRadius: 10, color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: cards.length ? 1 : 0.4 }}><IconDownload />Export CSV</button>
              <button onClick={() => setModal('add')} className="press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)', borderRadius: 10, color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }} className='press'>+ Add Card</button>
            </div>
          </div>

          {importSuccess !== null && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#e53935', fontWeight: 600 }}>✓ Successfully imported {importSuccess} cards</span>
              <button onClick={() => setImportSuccess(null)} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
          )}

          {/* ── Mobile: compact stats strip ── */}
          {cards.length > 0 && (
            <div className="mob-stats" style={{ gap: 8, overflowX: 'auto', marginBottom: 12, paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
              {[
                { label: 'Cards', value: statActive.length },
                { label: 'Invested', value: fmt(totalInvested) },
                { label: 'Value', value: fmt(totalValue) },
                { label: 'G/L', value: (totalValue-totalInvested>=0?'+':'')+fmt(totalValue-totalInvested), color: totalValue>=totalInvested?'#22c55e':'#e53935' },
                { label: 'P&L', value: (realizedPL>=0?'+':'')+fmt(realizedPL), color: realizedPL>=0?'#22c55e':'#e53935' },
              ].map((s,i) => (
                <div key={i} style={{ flexShrink:0, background:'#111', border:'1px solid #1e1e1e', borderRadius:10, padding:'10px 12px', minWidth:90, textAlign:'center' }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:s.color||'#f0f0f0' }}>{s.value}</div>
                  <div style={{ fontSize:9, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:3, fontFamily:"'Outfit',sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Desktop: stat grid ── */}
          {cards.length > 0 && (
            <div className="desk-stats" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 18 }}>
              {[['Active Cards', statActive.length, '#f0f0f0'], ['Invested', fmt(totalInvested), '#f0f0f0'], ['Portfolio Value', fmt(totalValue), '#f0f0f0'], ['Unrealized G/L', (totalValue-totalInvested>=0?'+':'')+fmt(totalValue-totalInvested), totalValue>=totalInvested?'#22c55e':'#e53935'], ['Realized P&L', (realizedPL>=0?'+':'')+fmt(realizedPL), realizedPL>=0?'#22c55e':'#e53935']].map(([label, value, color]) => (
                <div key={label} style={{ padding: '10px 14px', borderRadius: 10, background: '#111', border: '1px solid #2a2a2a' }}>
                  <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Desktop filters ── */}
          {/* ── Sport / TCG Tab Bar ── */}
          {cards.length > 0 && (() => {
            const hasTCG = cards.some(c => TCG_LIST.includes(c.sport))
            const hasSports = cards.some(c => c.sport && !TCG_LIST.includes(c.sport))
            if (!hasTCG && !hasSports) return null
            // Build unique sport options
            const uniqueSports = [...new Set(cards.map(c => c.sport).filter(Boolean))]
            const tabs = [
              { val: 'all', label: 'All', emoji: '🃏' },
              ...(hasSports ? [{ val: 'sports', label: 'Sports Cards', emoji: '🏆' }] : []),
              ...(hasTCG ? [{ val: 'tcg', label: 'TCG', emoji: '✨' }] : []),
              ...uniqueSports.map(s => ({ val: s, label: s, emoji: TCG_LIST.includes(s) ? '🎴' : '🏅' }))
            ]
            return (
              <div style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', paddingBottom:2, WebkitOverflowScrolling:'touch' }}>
                {tabs.map(t => (
                  <button key={t.val} onClick={() => setSportTab(t.val)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:20, border: sportTab === t.val ? '1px solid rgba(229,57,53,0.4)' : '1px solid #2a2a2a', background: sportTab === t.val ? 'rgba(229,57,53,0.1)' : '#111', color: sportTab === t.val ? '#e53935' : '#555', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight: sportTab === t.val ? 700 : 500, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.15s' }}>
                    <span>{t.emoji}</span>{t.label}
                    {sportTab === t.val && t.val !== 'all' && (
                      <span style={{ fontSize:10, background:'rgba(229,57,53,0.2)', borderRadius:10, padding:'1px 6px', fontFamily:"'JetBrains Mono',monospace" }}>
                        {statActive.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )
          })()}

          <div className="desk-filters" style={{ gap: 10, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player, set, brand..." style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <select value={filterSport} onChange={e => setFilterSport(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, background: '#111', border: '1px solid #2a2a2a', color: filterSport ? '#f0f0f0' : '#555', fontSize: 14, outline: 'none' }}>
              <option value="">All Sports</option>
              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              {[['active','Active'],['sold','Sold'],['all','All']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterStatus(val)} style={{ padding: '9px 14px', background: filterStatus===val ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: filterStatus===val ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: filterStatus===val ? 700 : 500, cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
          </div>
          <div className="desk-filters" style={{ gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            {/* Graded filter */}
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              {[['','All Cards'],['graded','Graded'],['raw','Raw']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterGraded(val)} style={{ padding: '8px 12px', background: filterGraded===val ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: filterGraded===val ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: filterGraded===val ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
              ))}
            </div>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 14px', borderRadius: 10, background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 13, outline: 'none', fontFamily: "'Outfit',sans-serif", cursor: 'pointer' }}>
              <option value="date_desc">Date Added (Newest)</option>
              <option value="date_asc">Date Added (Oldest)</option>
              <option value="price_desc">Value (High to Low)</option>
              <option value="price_asc">Value (Low to High)</option>
              <option value="buy_desc">Buy Price (High to Low)</option>
              <option value="buy_asc">Buy Price (Low to High)</option>
              <option value="name_asc">Player (A → Z)</option>
              <option value="name_desc">Player (Z → A)</option>
            </select>
            {/* Price Range */}
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'#111', border:'1px solid #2a2a2a', borderRadius:10, padding:'0 10px' }}>
              <span style={{ fontSize:11, color:'#444', fontWeight:700, fontFamily:"'Outfit',sans-serif", whiteSpace:'nowrap' }}>$</span>
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                style={{ width:60, padding:'8px 0', background:'transparent', border:'none', color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:"'JetBrains Mono',monospace" }}
              />
              <span style={{ fontSize:11, color:'#333' }}>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                style={{ width:60, padding:'8px 0', background:'transparent', border:'none', color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:"'JetBrains Mono',monospace" }}
              />
            </div>
            {/* Active filter count */}
            {(filterGraded || filterSport || sortBy !== 'date_desc' || priceMin || priceMax) && (
              <button onClick={() => { setFilterGraded(''); setFilterSport(''); setSortBy('date_desc'); setPriceMin(''); setPriceMax(''); setSportTab('all') }} style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.2)', color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ✕ Clear Filters
              </button>
            )}
            {/* View toggle */}
            <div style={{ marginLeft: 'auto', display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
              <button onClick={() => setViewMode('table')} title="Table view" style={{ padding: '8px 12px', background: viewMode === 'table' ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: viewMode === 'table' ? '#e53935' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><IconList /></button>
              <button onClick={() => setViewMode('grid')} title="Grid view" style={{ padding: '8px 12px', background: viewMode === 'grid' ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: viewMode === 'grid' ? '#e53935' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><IconGrid /></button>
            </div>
          </div>
          <div className="mob-filters" style={{ gap: 8, marginBottom: 10, flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 2 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex: 1, minWidth: 120, maxWidth: 160, padding: '8px 12px', borderRadius: 10, background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 13, outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a', flexShrink: 0 }}>
              {[['active','Active'],['sold','Sold'],['all','All']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterStatus(val)} style={{ padding: '8px 10px', background: filterStatus===val ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: filterStatus===val ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: filterStatus===val ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a', flexShrink: 0 }}>
              {[['','All'],['graded','Graded'],['raw','Raw']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterGraded(val)} style={{ padding: '8px 10px', background: filterGraded===val ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: filterGraded===val ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: filterGraded===val ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
              ))}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ flexShrink: 0, padding: '8px 10px', borderRadius: 10, background: '#111', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 12, outline: 'none', fontFamily: "'Outfit',sans-serif" }}>
              <option value="date_desc">Newest</option>
              <option value="date_asc">Oldest</option>
              <option value="price_desc">Value ↓</option>
              <option value="price_asc">Value ↑</option>
              <option value="name_asc">A→Z</option>
              <option value="name_desc">Z→A</option>
            </select>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a', flexShrink: 0 }}>
              <button onClick={() => setViewMode('table')} style={{ padding: '8px 10px', background: viewMode==='table' ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: viewMode==='table' ? '#e53935' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><IconList /></button>
              <button onClick={() => setViewMode('grid')} style={{ padding: '8px 10px', background: viewMode==='grid' ? 'rgba(229,57,53,0.15)' : '#111', border: 'none', color: viewMode==='grid' ? '#e53935' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><IconGrid /></button>
            </div>
            {/* Price range on mobile */}
            <div style={{ display:'flex', alignItems:'center', gap:4, background:'#111', border:'1px solid #2a2a2a', borderRadius:10, padding:'0 8px', flexShrink:0 }}>
              <span style={{ fontSize:10, color:'#444', fontWeight:700 }}>$</span>
              <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ width:48, padding:'8px 0', background:'transparent', border:'none', color:'#f0f0f0', fontSize:12, outline:'none', fontFamily:"'JetBrains Mono',monospace" }} />
              <span style={{ fontSize:10, color:'#333' }}>—</span>
              <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ width:48, padding:'8px 0', background:'transparent', border:'none', color:'#f0f0f0', fontSize:12, outline:'none', fontFamily:"'JetBrains Mono',monospace" }} />
            </div>
          </div>

          {/* Bulk delete bar */}
          {selected.size > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', marginBottom: 12, borderRadius: 10, background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.2)' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: '#e53935' }}>{selected.size} card{selected.size !== 1 ? 's' : ''} selected</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSelected(new Set())} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Deselect All</button>
                <button onClick={handleBulkDelete} disabled={bulkDeleting} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(229,57,53,0.15)', border: '1px solid rgba(229,57,53,0.3)', color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: bulkDeleting ? 0.6 : 1 }}>
                  {bulkDeleting ? 'Deleting...' : `🗑️ Delete ${selected.size} Selected`}
                </button>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            cards.length === 0 ? (
              // ── First-time empty state ──────────────────────────────────────
              <div style={{ textAlign:'center', padding:'48px 24px', animation:'scaleIn 0.3s ease' }}>
                <div style={{ fontSize:56, marginBottom:16, opacity:0.7 }}>🃏</div>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, color:'#f0f0f0', margin:'0 0 8px' }}>Start Your Collection</h2>
                <p style={{ color:'#555', fontFamily:"'Outfit',sans-serif", fontSize:13, marginBottom:28, maxWidth:300, margin:'0 auto 28px' }}>Track every card you own — values, grades, profits, and more.</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:300, margin:'0 auto 28px' }}>
                  {[
                    { icon:'➕', label:'Add your first card', sub:'Enter player, year, brand, and what you paid' },
                    { icon:'💰', label:'Track its value', sub:'Update current value anytime to see your P&L' },
                    { icon:'📊', label:'Watch your portfolio grow', sub:'Stats and insights update automatically' },
                  ].map((s,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'#111', border:'1px solid #1e1e1e', borderRadius:12, textAlign:'left', animation:`fadeUp 0.45s ease ${i*0.12}s both` }}>
                      <div style={{ fontSize:20, flexShrink:0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, color:'#ccc' }}>{s.label}</div>
                        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:'#555', marginTop:2 }}>{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="press" onClick={() => setModal('add')} className="press" style={{ padding:'12px 28px', borderRadius:12, background:'rgba(229,57,53,0.1)', border:'1px solid rgba(229,57,53,0.3)', color:'#e53935', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:700, cursor:'pointer' }}>
                  + Add Your First Card
                </button>
              </div>
            ) : (
              // ── No filter results ──────────────────────────────────────────
              <div style={{ textAlign:'center', padding:'60px 24px', animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:36, marginBottom:12, opacity:0.2 }}>🔍</div>
                <p style={{ color:'#444', fontFamily:"'Outfit',sans-serif", fontSize:14, marginBottom:16 }}>No cards match your filters</p>
                <button className="press" onClick={() => { setSearch(''); setFilterSport(''); setFilterGraded(''); setSortBy('date_desc'); setPriceMin(''); setPriceMax(''); setSportTab('all') }} style={{ padding:'8px 18px', borderRadius:10, background:'rgba(229,57,53,0.08)', border:'1px solid rgba(229,57,53,0.2)', color:'#e53935', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer' }}>Clear Filters</button>
              </div>
            )
          ) : (
            <>
              {/* ── Grid View ── */}
              {viewMode === 'grid' && (
                <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {filtered.map((card, idx) => {
                    const qty = parseInt(card.qty)||1
                    const buy = (parseFloat(card.buy)||0)*qty
                    const val = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||parseFloat(card.buy)||0)*qty
                    const gl = val - buy
                    const glPos = gl >= 0
                    const glPct = buy > 0 ? (gl/buy)*100 : 0
                    const isSelected = selected.has(card.id)
                    return (
                      <div key={card.id} style={{ background: isSelected ? 'rgba(229,57,53,0.06)' : 'linear-gradient(135deg,#111,#0d0d0d)', border: isSelected ? '1px solid rgba(229,57,53,0.3)' : '1px solid #1e1e1e', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', transition: 'border-color 0.15s, background 0.15s', opacity: card.sold ? 0.75 : 1, animation:`fadeUp 0.45s ease ${idx*0.1}s both` }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#2a2a2a' }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#1e1e1e' }}>
                        {/* Checkbox */}
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(card.id)} style={{ position: 'absolute', top: 12, right: 12, accentColor: '#e53935', width: 15, height: 15, cursor: 'pointer' }} />
                        {/* Status badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {card.grade
                            ? <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(229,57,53,0.1)', color: '#e53935', fontSize: 11, fontWeight: 700 }}>{card.grade ? card.grade : ''}</span>
                            : <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#555', fontSize: 11, fontWeight: 600 }}>{card.cond || 'Raw'}</span>
                          }
                          {card.sold && <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(255,190,46,0.1)', color: '#ffbe2e', fontSize: 11, fontWeight: 700 }}>SOLD</span>}
                        </div>
                        {/* Player name */}
                        <div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 800, color: '#f0f0f0', lineHeight: 1.2 }}>{card.player}</div>
                          <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{[card.year, card.sport, card.brand].filter(Boolean).join(' · ')}</div>
                        </div>
                        {/* Values */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 8, borderTop: '1px solid #1e1e1e' }}>
                          <div>
                            <div style={{ fontSize: 9, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, fontFamily: "'Outfit',sans-serif" }}>Value</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: '#f0f0f0' }}>{fmt(val)}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 9, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, fontFamily: "'Outfit',sans-serif" }}>G/L</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: glPos ? '#22c55e' : '#e53935' }}>{glPos?'+':''}{glPct.toFixed(1)}%</div>
                          </div>
                        </div>
                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setPriceLookupCard(card)} title="Check prices" style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(124,92,252,0.08)', border: 'none', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconSearch /></button>
                          {!card.sold && <button onClick={() => setSoldCard(card)} title="Mark sold" style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(255,190,46,0.08)', border: 'none', color: '#ffbe2e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTag /></button>}
                          <button onClick={() => setBreakEvenCard(card)} title="Break even" style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(229,57,53,0.08)', border: 'none', color: '#e53935', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCalc /></button>
                          <button onClick={() => setModal(card)} title="Edit" style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit /></button>
                          <button onClick={() => setDeleteId(card.id)} title="Delete" style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(229,57,53,0.08)', border: 'none', color: '#e53935', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ── Desktop Table ── */}
              {viewMode === 'table' && <div className="desktop-table" style={{ background: 'linear-gradient(135deg,#111,#0d0d0d)', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '11px 14px', width: 36 }}>
                          <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={() => { if (selected.size === filtered.length) setSelected(new Set()); else setSelected(new Set(filtered.map(c => c.id))) }} style={{ accentColor: '#e53935', width: 15, height: 15, cursor: 'pointer' }} />
                        </th>
                        {['Player','Sport','Year','Grade','Qty','Buy Price','Value','G/L','Status',''].map((h,i) => <th key={i} style={{ padding: '11px 14px', textAlign: i===0?'left':'right', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(card => {
                        const qty = parseInt(card.qty)||1
                        const buy = (parseFloat(card.buy)||0)*qty
                        const displayVal = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||parseFloat(card.buy)||0)*qty
                        const gl = displayVal - buy
                        const glPos = gl >= 0
                        return (
                          <tr key={card.id} className="card-row" style={{ borderTop: '1px solid #1e1e1e', transition: 'background 0.15s', opacity: card.sold ? 0.75 : 1, background: selected.has(card.id) ? 'rgba(229,57,53,0.05)' : 'transparent' }}>
                            <td style={{ padding: '12px 14px', width: 36 }}>
                              <input type="checkbox" checked={selected.has(card.id)} onChange={() => toggleSelect(card.id)} style={{ accentColor: '#e53935', width: 15, height: 15, cursor: 'pointer' }} />
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc' }}>{card.player}</div>
                              {card.name && <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{card.name}</div>}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#666' }}>{card.sport||'—'}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#666' }}>{card.year||'—'}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>{card.grade ? <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(229,57,53,0.1)', color: '#e53935', fontSize: 11, fontWeight: 700 }}>{card.grade ? card.grade : ''}</span> : <span style={{ color: '#444', fontSize: 12 }}>{card.cond||'—'}</span>}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#666' }}>{qty}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#666' }}>{fmt(buy)}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: '#f0f2ff' }}>{fmt(displayVal)}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: glPos ? '#22c55e' : '#e53935' }}>{glPos ? <IconUp /> : <IconDown />}{glPos?'+':''}{fmt(gl)}</div>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>{card.sold ? <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(255,190,46,0.1)', color: '#ffbe2e', fontSize: 11, fontWeight: 700 }}>SOLD</span> : <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(229,57,53,0.1)', color: '#e53935', fontSize: 11, fontWeight: 700 }}>ACTIVE</span>}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                                <button onClick={() => setPriceLookupCard(card)} title="Check prices" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(124,92,252,0.08)', border: 'none', color: '#a78bfa', cursor: 'pointer' }}><IconSearch /></button>
                                {!card.sold && <button onClick={() => setSoldCard(card)} title="Mark as sold" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,190,46,0.08)', border: 'none', color: '#ffbe2e', cursor: 'pointer' }}><IconTag /></button>}
                                <button onClick={() => setBreakEvenCard(card)} title="Break even calculator" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(229,57,53,0.08)', border: 'none', color: '#e53935', cursor: 'pointer' }}><IconCalc /></button>
                                <button onClick={() => setModal(card)} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#666', cursor: 'pointer' }}><IconEdit /></button>
                                <button onClick={() => setDeleteId(card.id)} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,107,122,0.08)', border: 'none', color: '#616161', cursor: 'pointer' }}><IconTrash /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>}

              {/* ── Mobile Cards ── */}
              <div className="mobile-cards" style={viewMode === 'grid' ? { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 } : { display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map((card, idx) => {
                  const qty = parseInt(card.qty)||1
                  const buy = (parseFloat(card.buy)||0)*qty
                  const displayVal = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||parseFloat(card.buy)||0)*qty
                  const gl = displayVal - buy
                  const glPos = gl >= 0
                  const glPct = buy > 0 ? (gl / buy) * 100 : 0
                  const cardContent = viewMode === 'grid' ? (
                    // ── Grid tile (compact) ──────────────────────────────────
                    <div style={{ background: selected.has(card.id) ? 'rgba(229,57,53,0.06)' : 'linear-gradient(135deg,#111,#0d0d0d)', border: selected.has(card.id) ? '1px solid rgba(229,57,53,0.3)' : '1px solid #1e1e1e', borderRadius: 12, padding: '12px', opacity: card.sold ? 0.8 : 1, animation:`fadeUp 0.45s ease ${idx*0.1}s both`, position:'relative' }}>
                      <input type="checkbox" checked={selected.has(card.id)} onChange={() => toggleSelect(card.id)} style={{ position:'absolute', top:8, right:8, accentColor:'#e53935', width:14, height:14, cursor:'pointer' }} />
                      <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:700, color:'#f0f0f0', marginBottom:4, paddingRight:18, lineHeight:1.3 }}>{card.player}</div>
                      <div style={{ fontSize:10, color:'#555', marginBottom:8 }}>{[card.year, card.sport].filter(Boolean).join(' · ')}</div>
                      {card.grade && <div style={{ display:'inline-block', padding:'1px 6px', borderRadius:6, background:'rgba(229,57,53,0.1)', color:'#e53935', fontSize:10, fontWeight:700, marginBottom:6 }}>Grade {card.grade}</div>}
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:'#f0f0f0', marginBottom:2 }}>{fmt(displayVal)}</div>
                      <div style={{ fontSize:11, fontWeight:700, color: glPos ? '#22c55e' : '#e53935' }}>{glPos?'+':''}{fmt(gl)} <span style={{fontWeight:500,color:'#444'}}>({glPos?'+':''}{glPct.toFixed(1)}%)</span></div>
                      <div style={{ display:'flex', gap:4, marginTop:8 }}>
                        <button onClick={() => setModal(card)} style={{ flex:1, padding:'6px 0', borderRadius:7, background:'rgba(255,255,255,0.05)', border:'1px solid #2a2a2a', color:'#666', fontSize:11, cursor:'pointer' }}>Edit</button>
                        {!card.sold && <button onClick={() => setSoldCard(card)} style={{ flex:1, padding:'6px 0', borderRadius:7, background:'rgba(255,190,46,0.08)', border:'1px solid rgba(255,190,46,0.2)', color:'#ffbe2e', fontSize:11, cursor:'pointer' }}>Sell</button>}
                      </div>
                    </div>
                  ) : (
                    // ── List card (full) ─────────────────────────────────────
                    <div style={{ background: selected.has(card.id) ? 'rgba(229,57,53,0.06)' : 'linear-gradient(135deg,#111,#0d0d0d)', border: selected.has(card.id) ? '1px solid rgba(229,57,53,0.3)' : '1px solid #1e1e1e', borderRadius: 14, padding: '14px 16px', opacity: card.sold ? 0.8 : 1, animation:`fadeUp 0.45s ease ${idx*0.1}s both` }}>
                      {/* Top row: checkbox + name + status badge */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
                          <input type="checkbox" checked={selected.has(card.id)} onChange={() => toggleSelect(card.id)} style={{ accentColor: '#e53935', width: 16, height: 16, cursor: 'pointer', marginTop: 3, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, color: '#f0f0f0' }}>{card.player}</div>
                            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
                              {[card.year, card.sport, card.brand, card.grade ? `Grade ${card.grade}` : card.cond].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginLeft: 10, flexShrink: 0 }}>
                          {card.sold
                            ? <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(255,190,46,0.1)', color: '#ffbe2e', fontSize: 11, fontWeight: 700 }}>SOLD</span>
                            : <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(229,57,53,0.1)', color: '#e53935', fontSize: 11, fontWeight: 700 }}>ACTIVE</span>
                          }
                        </div>
                      </div>

                      {/* Value row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Buy Price</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: '#666' }}>{fmt(buy)}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{card.sold ? 'Sold For' : 'Value'}</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#f0f2ff' }}>{fmt(displayVal)}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>G/L</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: glPos ? '#22c55e' : '#e53935' }}>
                            {glPos ? <IconUp /> : <IconDown />}{glPos?'+':''}{glPct.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setPriceLookupCard(card)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)', color: '#a78bfa', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <IconSearch />Prices
                        </button>
                        {!card.sold && (
                          <button onClick={() => setSoldCard(card)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(255,190,46,0.08)', border: '1px solid rgba(255,190,46,0.2)', color: '#ffbe2e', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            <IconTag />Sell
                          </button>
                        )}
                        <button onClick={() => setBreakEvenCard(card)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.2)', color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <IconCalc />Calc
                        </button>
                        <button onClick={() => setModal(card)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <IconEdit />Edit
                        </button>
                        <button onClick={() => setDeleteId(card.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 0', borderRadius: 9, background: 'rgba(255,107,122,0.08)', border: '1px solid rgba(255,107,122,0.2)', color: '#616161', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <IconTrash />Delete
                        </button>
                      </div>
                    </div>
                  ) // end list card
                  return <SwipeRow key={card.id} onDelete={() => setDeleteId(card.id)}>{cardContent}</SwipeRow>
                })}
              </div>
            </>
          )}
        </main>
        <BottomNav active="Collection" />
      </div>
      {breakEvenCard && <BreakEvenModal card={breakEvenCard} onClose={() => setBreakEvenCard(null)} />}
      {modal && <CardModal card={modal==='add'?null:modal} onClose={() => setModal(null)} onSave={() => { const isNew = modal==='add'; setModal(null); load(); showToast(isNew ? '🃏 Card added!' : '✓ Card updated', 'success') }} />}
      {priceLookupCard && <PriceLookupModal card={priceLookupCard} onClose={() => setPriceLookupCard(null)} />}
      {soldCard && <SoldModal card={soldCard} onClose={() => setSoldCard(null)} onSave={() => { setSoldCard(null); load(); showToast('💰 Marked as sold!', 'success') }} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={(n) => { setShowImport(false); setImportSuccess(n); load(); showToast(`✓ ${n} cards imported!`, 'success') }} />}
      <ToastContainer />
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', marginBottom: 8 }}>Delete this card?</h3>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: 11, borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'rgba(255,107,122,0.15)', border: '1px solid rgba(255,107,122,0.3)', color: '#616161', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
