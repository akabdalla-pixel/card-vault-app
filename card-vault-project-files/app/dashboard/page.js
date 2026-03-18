'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'

// ── Toast System ──────────────────────────────────────────────────────────────
var _toastFn = null
function showToast(msg, type = 'success', onUndo = null) {
  if (_toastFn) _toastFn(msg, type, onUndo)
}
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
  const colors = { success: '#22c55e', error: '#ef4444', info: '#888' }
  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 12, background: '#1a1a1a', border: `1px solid ${colors[t.type]}40`, boxShadow: `0 8px 24px rgba(0,0,0,0.5)`, fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 600, color: '#f0f0f0', pointerEvents: 'auto', animation: 'toastIn 0.2s ease', whiteSpace: 'nowrap' }}>
          <span style={{ color: colors[t.type] }}>{icons[t.type]}</span>
          {t.msg}
          {t.onUndo && <button onClick={t.onUndo} style={{ marginLeft: 4, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#9333ea', fontFamily: "'Unbounded',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', pointerEvents: 'auto' }}>Undo</button>}
        </div>
      ))}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Sk({ w = '100%', h = 20, r = 8, mb = 0 }) {
  return <div style={{ width: w, height: h, borderRadius: r, marginBottom: mb, background: 'linear-gradient(90deg,#1a1a1a 25%,#252525 50%,#1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
}

function DashSkeleton() {
  return (
    <div style={{ padding: '28px 28px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><Sk w={200} h={28} r={8} mb={8} /><Sk w={140} h={14} r={6} /></div>
        <div style={{ display: 'flex', gap: 8 }}><Sk w={110} h={38} r={10} /><Sk w={90} h={38} r={10} /></div>
      </div>
      <Sk h={150} r={14} mb={22} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 14 }}>
        <Sk h={85} r={14} /><Sk h={85} r={14} /><Sk h={85} r={14} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <Sk h={85} r={14} /><Sk h={85} r={14} /><Sk h={85} r={14} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Sk h={220} r={14} /><Sk h={220} r={14} />
      </div>
    </div>
  )
}

// ── Animated Number ───────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 800 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const targetRef = useRef(value)

  useEffect(() => {
    targetRef.current = value
    const start = performance.now()
    startRef.current = start
    const from = display
    const to = value
    function tick(now) {
      if (startRef.current !== start) return
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * ease)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  const formatted = typeof value === 'number' && value % 1 !== 0
    ? display.toFixed(2)
    : Math.round(display)
  return <>{prefix}{typeof value === 'number' ? formatted : value}{suffix}</>
}


const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Insights', href: '/insights' },
  { label: 'Market', href: '/market' },
  { label: 'PSA Lookup', href: '/psa' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconShield() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconTrendUp() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconTrendDown() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }
function IconCheck() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Market': IconMarket, 'Insights': IconInsights, 'PSA Lookup': IconShield }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

function Sidebar({ user, onLogout, cardCount = 0, active = "" }) {
  return (
    <aside style={{ width:200, minHeight:'100vh', background:'#000', borderRight:'1px solid #111', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:60 }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid #111', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src="/logo-transparent.png" alt="TopLoad" style={{ width:140, height:'auto', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV.map(({ label, href }) => {
          const isActive = active === label
          const Icon = navIcons[label]
          if (!Icon) return null
          return (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color: isActive ? '#fff' : '#555', background: isActive ? '#9333ea' : 'transparent', fontSize:13, fontWeight: isActive ? 700 : 500, transition:'all 0.15s', letterSpacing:'0.01em' }}>
              <Icon />
              <span style={{flex:1}}>{label}</span>
              {label === 'Collection' && cardCount > 0 && <span style={{ fontSize:9, fontWeight:800, background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(147,51,234,0.2)', color: isActive ? '#fff' : '#a855f7', borderRadius:5, padding:'1px 6px' }}>{cardCount}</span>}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'12px 8px', borderTop:'1px solid #111' }}>
        <Link href="/settings" style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color:'#555', fontSize:13, fontWeight:500 }}><IconSettings /><span>Settings</span></Link>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#555', fontSize:13, fontWeight:500 }}><IconLogout /><span>Sign Out</span></button>
        {user && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', marginTop:4, borderRadius:10, background:'#111' }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#9333ea', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff', flexShrink:0 }}>{user.username?.[0]?.toUpperCase()||'A'}</div>
          <div style={{overflow:'hidden'}}><div style={{ fontSize:11, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>@{user.username}</div><div style={{ fontSize:9, color:'#555', marginTop:1 }}>{user.email}</div></div>
        </div>}
      </div>
    </aside>
  )
}

function BottomNav({ active = "" }) {
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

function PortfolioHero({ currentValue, gainLoss, portfolioReturn }) {
  const gainPos = gainLoss >= 0
  const glColor = gainPos ? '#22c55e' : '#ef4444'
  return (
    <div style={{ background:'#0e0c1a', border:'1px solid rgba(147,51,234,0.28)', boxShadow:'0 4px 24px rgba(147,51,234,0.1), 0 2px 8px rgba(0,0,0,0.4)', borderRadius:16, padding:'28px 32px', marginBottom:22, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#9333ea,#a855f7,transparent)' }} />
      <div style={{ display:'flex', alignItems:'stretch', gap:0 }}>
        {/* Total Portfolio Value */}
        <div style={{ flex:1, paddingRight:32 }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:12 }}>Total Portfolio Value</div>
          <div style={{ fontSize:30, fontWeight:800, color:'#f0f0f0', lineHeight:1, letterSpacing:'-1px' }}>{fmt(currentValue)}</div>
          <div style={{ fontSize:10, color:'#333', marginTop:10 }}>current value of active cards</div>
        </div>
        {/* Divider */}
        <div style={{ width:1, background:'rgba(147,51,234,0.2)', flexShrink:0 }} />
        {/* G/L */}
        <div style={{ flex:1, paddingLeft:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
            <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.14em' }}>Total G/L</div>
            <div style={{ fontSize:8, fontWeight:700, color:glColor, background:`${glColor}18`, border:`1px solid ${glColor}30`, borderRadius:4, padding:'1px 6px', textTransform:'uppercase', letterSpacing:'0.1em' }}>Unrealized</div>
          </div>
          <div style={{ fontSize:30, fontWeight:800, color:glColor, lineHeight:1, letterSpacing:'-1px' }}>{gainPos?'+':''}{fmt(gainLoss)}</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:10 }}>
            <span style={{ color:glColor, display:'flex', alignItems:'center' }}>{gainPos ? <IconTrendUp /> : <IconTrendDown />}</span>
            <span style={{ fontSize:11, fontWeight:700, color:glColor }}>{gainPos?'+':''}{portfolioReturn.toFixed(1)}%</span>
            <span style={{ fontSize:10, color:'#333' }}>on investment</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickValueRow({ card, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(card.val || card.buy || '')
  const [saving, setSaving] = useState(false)
  const buy = parseFloat(card.buy)||0
  const current = parseFloat(card.val)||buy
  const gl = current - buy
  const glPos = gl >= 0
  const glPct = buy > 0 ? (gl/buy)*100 : 0
  async function handleSave() {
    setSaving(true)
    await fetch('/api/cards', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...card, val }) })
    setSaving(false); setEditing(false); onUpdate()
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #1e1e1e', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.player}</div>
        <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{[card.year,card.sport,card.grade?'PSA '+card.grade:card.cond].filter(Boolean).join(' · ')}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: glPos?'#22c55e':'#ef4444', marginRight: 16, minWidth: 60, justifyContent: 'flex-end' }}>
        {glPos?<IconTrendUp />:<IconTrendDown />}{glPos?'+':''}{glPct.toFixed(1)}%
      </div>
      {editing ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} autoFocus style={{ width: 90, padding: '5px 8px', borderRadius: 7, background: '#1a1a1a', border: '1px solid #9333ea', color: '#f0f0f0', fontSize: 13, outline: 'none', fontFamily: "'Unbounded',sans-serif", textAlign: 'right' }} onKeyDown={e => { if(e.key==='Enter') handleSave(); if(e.key==='Escape') setEditing(false) }} />
          <button onClick={handleSave} disabled={saving} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(147,51,234,0.15)', border: 'none', color: '#9333ea', cursor: 'pointer' }}><IconCheck /></button>
        </div>
      ) : (
        <div onClick={() => setEditing(true)} style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 14, fontWeight: 700, color: '#f0f0f0', cursor: 'pointer', padding: '4px 8px', borderRadius: 7, border: '1px solid transparent', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(147,51,234,0.4)'; e.currentTarget.style.background='rgba(147,51,234,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent' }}>
          {fmt(current)}
        </div>
      )}
    </div>
  )
}

function TopMovers({ cards }) {
  const withGL = cards.map(c => { const buy=parseFloat(c.buy)||0,val=parseFloat(c.val)||buy,gl=val-buy,pct=buy>0?(gl/buy)*100:0; return {...c,gl,pct} }).filter(c => c.pct!==0)
  const gainers = [...withGL].sort((a,b)=>b.pct-a.pct).slice(0,3)
  const losers = [...withGL].sort((a,b)=>a.pct-b.pct).slice(0,3)
  if (!withGL.length) return null
  const MoverRow = ({ card, isGainer }) => (
    <Link href={`/collection?search=${encodeURIComponent(card.player)}`} style={{ textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:10, marginBottom:4, border:'1px solid transparent', transition:'all 0.15s', cursor:'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(147,51,234,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#ccc', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{card.player}</div>
        <div style={{ fontSize:10, color:'#444', marginTop:1 }}>{[card.year, card.sport, card.grade ? 'PSA ' + card.grade : null].filter(Boolean).join(' · ')}</div>
      </div>
      <div style={{ textAlign:'right', marginLeft:12, flexShrink:0 }}>
        <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:13, fontWeight:700, color: isGainer ? '#22c55e' : '#ef4444' }}>{isGainer?'+':''}{card.pct.toFixed(1)}%</div>
        <div style={{ fontSize:10, color:'#555', fontFamily:"'Unbounded',sans-serif" }}>{isGainer?'+':''}{fmt(card.gl)}</div>
      </div>
    </Link>
  )
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
      <div style={{ background: '#0e0c1a', border: '1px solid rgba(147,51,234,0.28)', boxShadow: '0 4px 20px rgba(147,51,234,0.08), 0 2px 8px rgba(0,0,0,0.4)', borderRadius: 16, padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 12, fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>🚀 Top Gainers</div>
        {gainers.length ? gainers.map(c=><MoverRow key={c.id} card={c} isGainer={true}/>) : <div style={{ color:'#333',fontSize:12 }}>No gainers yet</div>}
      </div>
      <div style={{ background: '#0e0c1a', border: '1px solid rgba(147,51,234,0.28)', boxShadow: '0 4px 20px rgba(147,51,234,0.08), 0 2px 8px rgba(0,0,0,0.4)', borderRadius: 16, padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 12, fontWeight: 700, color: '#6d4a9e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>📉 Top Losers</div>
        {losers.length ? losers.map(c=><MoverRow key={c.id} card={c} isGainer={false}/>) : <div style={{ color:'#333',fontSize:12 }}>No losers yet</div>}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, positive, style = {} }) {
  const accent = positive === true ? '#22c55e' : positive === false ? '#ef4444' : '#9333ea'
  return (
    <div style={{ background: '#0e0c1a', border: '1px solid rgba(147,51,234,0.28)', boxShadow: '0 4px 20px rgba(147,51,234,0.08), 0 2px 8px rgba(0,0,0,0.4)', borderRadius: 12, padding: '14px 16px', position: 'relative', overflow: 'hidden', ...style }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${accent},transparent)` }} />
      <div style={{ fontSize: 9, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontFamily:"'Unbounded',sans-serif" }}>{label}</div>
      <div style={{ fontFamily: "'Unbounded',sans-serif", fontSize: 18, fontWeight: 800, color: positive===true?'#22c55e':positive===false?'#ef4444':'#f0f0f0', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 10, fontFamily: "'Unbounded',sans-serif", fontWeight: 600, color: positive===true?'#22c55e':positive===false?'#ef4444':'#444' }}>
        {positive===true&&<IconTrendUp />}{positive===false&&<IconTrendDown />}{sub}
      </div>}
    </div>
  )
}


function MobileSparkline({ snapshots, color }) {
  if (!snapshots || snapshots.length === 0) return (
    <div style={{ marginBottom:8, fontSize:11, color:'#333', paddingTop:8 }}>
      📈 Graph builds as you use the app — check back tomorrow
    </div>
  )
  // If only 1 point, duplicate it so chart renders immediately
  if (snapshots.length < 2) {
    const s = snapshots[0]
    snapshots = [{ ...s, createdAt: new Date(new Date(s.createdAt).getTime() - 86400000).toISOString() }, s]
  }
  const vals = snapshots.map(s => s.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const w = 280, h = 48
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 8) - 4
    return `${x},${y}`
  }).join(' ')
  const first = vals[0], last = vals[vals.length - 1]
  const pct = first > 0 ? ((last - first) / first * 100).toFixed(1) : null
  return (
    <div style={{ marginBottom:16 }}>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display:'block', overflow:'visible' }}>
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
        <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]} r="3" fill={color} />
      </svg>
      {pct && (
        <div style={{ fontSize:10, color:'#555', marginTop:2 }}>
          <span style={{ color, fontWeight:700 }}>{parseFloat(pct)>=0?'+':''}{pct}%</span> since first tracked
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [activity, setActivity] = useState([])
  const [snapshots, setSnapshots] = useState([])
  const [spotlightIdx, setSpotlightIdx] = useState(null)
  const router = useRouter()

  const loadData = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me',{cache:'no-store'}),fetch('/api/cards',{cache:'no-store'})])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      let loadedCards = []
      if (cardsRes.ok) { const d=await cardsRes.json(); loadedCards=Array.isArray(d)?d:[]; setCards(loadedCards) }
    // fetch activity + snapshots
    try {
      const [actRes, snapRes] = await Promise.all([
        fetch('/api/activity'),
        fetch('/api/cards?snapshots=1')
      ])
      if (actRes.ok) setActivity(await actRes.json())
      if (snapRes.ok) setSnapshots(await snapRes.json())
    } catch(e) {}
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])


  useEffect(() => {
    loadData()
    const onBeforeInstall = e => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    const onVisible = () => { if(document.visibilityState==='visible') loadData() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { window.removeEventListener('beforeinstallprompt',onBeforeInstall); document.removeEventListener('visibilitychange',onVisible) }
  }, [loadData])

  useEffect(() => {
    const active = cards.filter(c => !c.sold)
    if (active.length > 0) {
      setSpotlightIdx(Math.floor(Math.random() * active.length))
    } else {
      setSpotlightIdx(null)
    }
  }, [cards])

  async function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome==='accepted') { setInstalled(true); setInstallPrompt(null) }
  }
  async function handleLogout() { await fetch('/api/auth/logout',{method:'POST'}); router.push('/login') }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
    <img src="/logo-transparent.png" alt="TopLoad" style={{ width:120, opacity:0.4, filter:'brightness(0) invert(1)', animation:'pulse 1.5s ease-in-out infinite' }} />
    <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.6}}`}</style>
  </div>
  )

  const activeCards = cards.filter(c=>!c.sold)
  const soldCards = cards.filter(c=>c.sold)
  // ── Spotlight ──────────────────────────────────────────────────
  const spotlight = activeCards.length > 0 && spotlightIdx !== null
    ? activeCards[spotlightIdx % activeCards.length]
    : null

  const totalInvested = activeCards.reduce((s,c)=>s+(parseFloat(c.buy)||0)*(parseInt(c.qty)||1),0)
  const soldInvested = soldCards.reduce((s,c)=>s+(parseFloat(c.buy)||0)*(parseInt(c.qty)||1),0)
  const lifetimeInvested = totalInvested + soldInvested
  const currentValue = activeCards.reduce((s,c)=>s+(parseFloat(c.val)||parseFloat(c.buy)||0)*(parseInt(c.qty)||1),0)
  const gainLoss = currentValue-totalInvested
  const portfolioReturn = totalInvested>0?(gainLoss/totalInvested)*100:0
  const realizedPL = soldCards.reduce((s,c)=>s+(parseFloat(c.soldPrice)||0)-(parseFloat(c.buy)||0),0)
  const gainPos = gainLoss>=0, retPos = portfolioReturn>=0
  const bySport = {}
  activeCards.forEach(c => {
    const sport=c.sport||'Other', qty=parseInt(c.qty)||1
    if(!bySport[sport]) bySport[sport]={cards:0,invested:0,value:0}
    bySport[sport].cards+=qty
    bySport[sport].invested+=(parseFloat(c.buy)||0)*qty
    bySport[sport].value+=(parseFloat(c.val)||parseFloat(c.buy)||0)*qty
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600;700;800;900&display=swap');
        *{font-family:'Unbounded',-apple-system,sans-serif!important}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        button:not(:disabled):active{transform:scale(0.94)!important;opacity:0.85!important}
        a.press:active{transform:scale(0.94)!important;opacity:0.85!important}
        .press{transition:transform 0.1s ease,opacity 0.1s ease!important}
        .press:active{transform:scale(0.93)!important;opacity:0.8!important}
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:200px;min-height:100vh;width:calc(100% - 200px)}
        .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .stat-grid2{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}
        .body-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:22px}
        .mob-stat-scroll{display:none}
        .desk-stats{display:block}
        .mob-chart{display:none}
        .desk-chart{display:block}
        @media(max-width:1100px){.stat-grid{grid-template-columns:repeat(2,1fr)}.stat-grid2{grid-template-columns:repeat(2,1fr)}.body-grid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}
          .main-wrap{margin-left:0!important;width:100%!important;padding-bottom:90px!important;padding:16px 16px 90px!important}
          .body-grid{grid-template-columns:1fr!important;gap:14px!important;margin-top:14px!important}
          .mob-stat-scroll{display:flex!important}
          .desk-stats{display:none!important}
          .mob-chart{display:block!important}
          .desk-chart{display:none!important}
          .hide-mobile{display:none!important}
        }
        @media(max-width:480px){.stat-grid{grid-template-columns:1fr}.stat-grid2{grid-template-columns:1fr}}
      `}</style>
      <div style={{ display:'flex',minHeight:'100vh',background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} active="Dashboard" cardCount={activeCards.length} /></div>        <main className="main-wrap" style={{ padding:'28px 28px 40px' }}>
          <div className="mob-topbar" style={{ alignItems:'center',justifyContent:'center',marginBottom:20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:36,width:'auto',objectFit:'contain',filter:'brightness(0) invert(1)' }} />
          </div>

          {/* ── Mobile: Portfolio Hero ── */}
          <div className="mob-chart" style={{ background:'#0e0c1a', border:'1px solid rgba(147,51,234,0.28)', borderRadius:16, padding:'24px 20px', marginBottom:14, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#9333ea,#a855f7,transparent)' }} />
            <div style={{ display:'flex', alignItems:'stretch', gap:0 }}>
              <div style={{ flex:1, paddingRight:20 }}>
                <div style={{ fontSize:8, color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>Total Portfolio Value</div>
                <div style={{ fontSize:22, fontWeight:800, color:'#f0f0f0', lineHeight:1, letterSpacing:'-0.5px' }}>{fmt(currentValue)}</div>
                <div style={{ fontSize:9, color:'#333', marginTop:8 }}>current value of active cards</div>
              </div>
              <div style={{ width:1, background:'rgba(147,51,234,0.2)', flexShrink:0 }} />
              <div style={{ flex:1, paddingLeft:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:10 }}>
                  <div style={{ fontSize:8, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.12em' }}>Total G/L</div>
                  <div style={{ fontSize:7, fontWeight:700, color: gainPos?'#22c55e':'#ef4444', background: gainPos?'rgba(34,197,94,0.12)':'rgba(239,68,68,0.12)', border:`1px solid ${gainPos?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`, borderRadius:3, padding:'1px 5px', textTransform:'uppercase', letterSpacing:'0.08em' }}>Unrealized</div>
                </div>
                <div style={{ fontSize:22, fontWeight:800, color: gainPos?'#22c55e':'#ef4444', lineHeight:1, letterSpacing:'-0.5px' }}>{gainPos?'+':''}{fmt(gainLoss)}</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:8 }}>
                  <span style={{ color: gainPos?'#22c55e':'#ef4444', display:'flex' }}>{gainPos?<IconTrendUp />:<IconTrendDown />}</span>
                  <span style={{ fontSize:10, fontWeight:700, color: gainPos?'#22c55e':'#ef4444' }}>{gainPos?'+':''}{portfolioReturn.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile: Horizontal Stat Scroll ── */}
          <div className="mob-stat-scroll" style={{ gap:10,overflowX:'auto',marginBottom:14,paddingBottom:4,WebkitOverflowScrolling:'touch' }}>
            {[
              { label:'Active Cards', value: activeCards.length },
              { label:'Total Current Investment', value: fmt(totalInvested) },
              { label:'Return', value: `${retPos?'+':''}${portfolioReturn.toFixed(1)}%`, color: retPos?'#22c55e':'#ef4444' },
              { label:'Realized P&L', value: `${realizedPL>=0?'+':''}${fmt(realizedPL)}`, color: realizedPL>=0?'#22c55e':'#ef4444' },
            ].map((s,i) => (
              <div key={i} style={{ flexShrink:0,background:'#111',border:'1px solid #1e1e1e',borderRadius:12,padding:'12px 14px',minWidth:130 }}>
                <div style={{ fontSize:9,color:'#444',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6,fontFamily:"'Unbounded',sans-serif" }}>{s.label}</div>
                <div style={{ fontFamily:"'Unbounded',sans-serif",fontSize:15,fontWeight:700,color:s.color||'#f0f0f0' }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="hide-mobile" style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:24 }}>
            <div>
              <p style={{ fontSize:13,fontWeight:700,color:'#a855f7',margin:'0 0 6px',letterSpacing:'0.02em' }}>Hello, {user?.username ? user.username[0].toUpperCase() + user.username.slice(1) : ''} 👋</p>
              <h1 style={{ fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'-1.5px',margin:0,textTransform:'uppercase',lineHeight:1 }}>DASHBOARD</h1>
              <p style={{ fontSize:12,color:'#555',marginTop:6,fontWeight:500 }}>{activeCards.length===0?'Add your first card to get started':`Tracking ${activeCards.length} active card${activeCards.length!==1?'s':''}`}</p>
            </div>
            <div style={{ display:'flex',gap:8 }}>

              <Link href="/collection" style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:'rgba(147,51,234,0.08)',border:'1px solid rgba(147,51,234,0.25)',borderRadius:10,color:'#9333ea',fontFamily:"'Unbounded',sans-serif",fontSize:13,fontWeight:600,textDecoration:'none' }}>+ Add Card</Link>
            </div>
          </div>
          {activeCards.length>0&&<div className="desk-chart"><PortfolioHero currentValue={currentValue} gainLoss={gainLoss} portfolioReturn={portfolioReturn} /></div>}
          <div className="desk-stats">
          <div className="stat-grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
            <StatCard style={{animation:"fadeUp 0.45s ease 0s both"}} label="Active Cards" value={activeCards.length} />
            <StatCard style={{animation:"fadeUp 0.45s ease 0.06s both"}} label="Total Current Investment" value={fmt(totalInvested)} />
          </div>
          <div className="stat-grid2" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
            <StatCard style={{animation:"fadeUp 0.45s ease 0.04s both"}} label="Portfolio Return" value={`${retPos?'+':''}${portfolioReturn.toFixed(1)}%`} sub={totalInvested>0?(retPos?'Above cost basis':'Below cost basis'):'No data'} positive={totalInvested>0?retPos:undefined} />
            <StatCard style={{animation:"fadeUp 0.45s ease 0.10s both"}} label="Realized P&L" value={`${realizedPL>=0?'+':''}${fmt(realizedPL)}`} sub={`${soldCards.length} card${soldCards.length!==1?'s':''} sold`} positive={soldCards.length>0?realizedPL>=0:undefined} />
          </div>
          </div>{/* end desk-stats */}
          {activeCards.length>1&&<div className="hide-mobile" style={{ marginTop:22 }}><TopMovers cards={activeCards} /></div>}

          {/* ── Spotlight ── */}
          {spotlight && (() => {
            const buy = (parseFloat(spotlight.buy)||0)*(parseInt(spotlight.qty)||1)
            const val = (parseFloat(spotlight.val)||parseFloat(spotlight.buy)||0)*(parseInt(spotlight.qty)||1)
            const gl = val - buy
            const glPos = gl >= 0
            const glPct = buy > 0 ? (gl / buy) * 100 : 0
            return (
              <Link href={`/collection?search=${encodeURIComponent(spotlight.player)}`} style={{ textDecoration:'none', display:'block', marginTop:20 }}>
              <div style={{ animation:'scaleIn 0.3s ease', background:'#0e0c1a', border:'1px solid rgba(147,51,234,0.28)', boxShadow:'0 4px 24px rgba(147,51,234,0.1), 0 2px 8px rgba(0,0,0,0.4)', borderRadius:14, padding:'18px 22px', position:'relative', overflow:'hidden', cursor:'pointer', transition:'border-color 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(147,51,234,0.5)'; e.currentTarget.style.boxShadow='0 6px 32px rgba(147,51,234,0.18), 0 2px 8px rgba(0,0,0,0.4)' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(147,51,234,0.28)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(147,51,234,0.1), 0 2px 8px rgba(0,0,0,0.4)' }}>
                {/* top accent */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#9333ea,#a855f7,transparent)' }} />
                {/* Header row */}
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#9333ea', boxShadow:'0 0 6px rgba(147,51,234,0.5)' }} />
                  <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.12em' }}>Spotlight</div>
                  <div style={{ marginLeft:'auto', fontSize:10, color:'#a855f7', fontFamily:"'Unbounded',sans-serif", fontWeight:700 }}>View →</div>
                </div>
                {/* Name + stats on same row */}
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  {/* Left: name + meta */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:17, fontWeight:900, color:'#f5f5f5', letterSpacing:'-0.3px', marginBottom:4 }}>{spotlight.player}</div>
                    <div style={{ fontSize:10, color:'#555', fontFamily:"'Unbounded',sans-serif" }}>
                      {[spotlight.year, spotlight.sport, spotlight.brand, spotlight.grade ? `Grade ${spotlight.grade}` : spotlight.cond].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  {/* Right: stats */}
                  <div style={{ display:'flex', gap:0, flexShrink:0, background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
                    <div style={{ padding:'10px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize:8, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5, fontFamily:"'Unbounded',sans-serif" }}>Buy</div>
                      <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:15, fontWeight:700, color:'#888' }}>{fmt(buy)}</div>
                    </div>
                    <div style={{ padding:'10px 16px', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize:8, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5, fontFamily:"'Unbounded',sans-serif" }}>Value</div>
                      <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:15, fontWeight:800, color:'#f0f0f0' }}>{fmt(val)}</div>
                    </div>
                    <div style={{ padding:'10px 16px' }}>
                      <div style={{ fontSize:8, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5, fontFamily:"'Unbounded',sans-serif" }}>G/L</div>
                      <div style={{ fontFamily:"'Unbounded',sans-serif", fontSize:15, fontWeight:800, color: glPos?'#22c55e':'#ef4444' }}>{glPos?'+':''}{glPct.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            )
          })()}

          {/* ── Recent Activity ── */}
          {(() => {
            const TYPE_CONFIG = {
              added:        { label:'Added',        color:'#22c55e',  icon:'＋' },
              deleted:      { label:'Deleted',      color:'#ef4444',  icon:'✕' },
              price_update: { label:'Price Update', color:'#a855f7',  icon:'↑' },
              sold:         { label:'Sold',         color:'#ffbe2e',  icon:'$' },
              edited:       { label:'Edited',       color:'#888',     icon:'✎' },
            }
            const feed = activity.length > 0 ? activity : []
            if (feed.length === 0 && cards.length === 0) return null
            return (
              <div style={{ marginTop:20, background:'#111', border:'1px solid #1e1e1e', borderRadius:14, overflow:'hidden' }}>
                <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:'#9333ea' }} />
                    <span style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.12em' }}>Recent Activity</span>
                  </div>
                </div>
                {feed.length === 0 ? (
                  <div style={{ padding:'16px', fontSize:12, color:'#444', textAlign:'center' }}>No activity yet — add a card to get started</div>
                ) : feed.slice(0,8).map((a, i) => {
                  const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.edited
                  const sportEmoji = a.sport==='Basketball'?'🏀':a.sport==='Football'?'🏈':a.sport==='Baseball'?'⚾':a.sport==='Soccer'?'⚽':a.sport==='F1'?'🏎️':a.sport==='Hockey'?'🏒':a.sport==='Pokémon'?'🎴':'🃏'
                  const timeAgo = (() => {
                    const diff = Date.now() - new Date(a.createdAt)
                    const mins = Math.floor(diff/60000)
                    const hrs = Math.floor(diff/3600000)
                    const days = Math.floor(diff/86400000)
                    if (mins < 1) return 'just now'
                    if (mins < 60) return mins + 'm ago'
                    if (hrs < 24) return hrs + 'h ago'
                    return days + 'd ago'
                  })()
                  return (
                    <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom: i < Math.min(feed.length,3)-1 ? '1px solid #141414' : 'none' }}>
                      <div style={{ width:28, height:28, borderRadius:7, background:`${cfg.color}18`, border:`1px solid ${cfg.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:cfg.color, flexShrink:0 }}>{sportEmoji}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ fontSize:9, fontWeight:800, color:cfg.color, textTransform:'uppercase', letterSpacing:'0.08em', flexShrink:0 }}>{cfg.label}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.player}</span>
                        </div>
                        {a.detail && <div style={{ fontSize:10, color:'#555', marginTop:1 }}>{a.detail}</div>}
                      </div>
                      <div style={{ fontSize:10, color:'#444', flexShrink:0 }}>{timeAgo}</div>
                    </div>
                  )
                })}
              </div>
            )
          })()}

        </main>
        <ToastContainer />
        <BottomNav active="Dashboard" />
      </div>
      {showInstallModal&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
          <div style={{ background:'#111',border:'1px solid #2a2a2a',borderRadius:16,padding:28,maxWidth:360,width:'100%',textAlign:'center' }}>
            <img src={LOGO} alt="TopLoad" style={{ width:100,marginBottom:16,filter:'drop-shadow(0 0 8px rgba(147,51,234,0.4))' }} />
            <h3 style={{ fontFamily:"'Unbounded',sans-serif",fontSize:18,fontWeight:700,color:'#f0f0f0',marginBottom:8 }}>Install TopLoad</h3>
            <p style={{ fontSize:13,color:'#666',marginBottom:20,lineHeight:1.6 }}>Add to your home screen for the full app experience.</p>
            <div style={{ textAlign:'left',display:'flex',flexDirection:'column',gap:10,marginBottom:24 }}>
              <div style={{ padding:'12px 14px',borderRadius:10,background:'#1a1a1a',border:'1px solid #2a2a2a' }}>
                <div style={{ fontSize:11,fontWeight:700,color:'#9333ea',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em' }}>📱 iPhone · Safari</div>
                <div style={{ fontSize:12,color:'#777',lineHeight:1.6 }}>Tap <strong style={{ color:'#ccc' }}>Share</strong> → <strong style={{ color:'#ccc' }}>Add to Home Screen</strong></div>
              </div>
              <div style={{ padding:'12px 14px',borderRadius:10,background:'#1a1a1a',border:'1px solid #2a2a2a' }}>
                <div style={{ fontSize:11,fontWeight:700,color:'#888',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em' }}>🤖 Android · Chrome</div>
                <div style={{ fontSize:12,color:'#777',lineHeight:1.6 }}>Tap <strong style={{ color:'#ccc' }}>⋮ menu</strong> → <strong style={{ color:'#ccc' }}>Add to Home Screen</strong></div>
              </div>
            </div>
            <button onClick={()=>setShowInstallModal(false)} style={{ width:'100%',padding:12,borderRadius:10,background:'linear-gradient(135deg,#9333ea,#a855f7)',border:'none',color:'#fff',fontFamily:"'Unbounded',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer' }}>Got it!</button>
          </div>
        </div>
      )}
    </>
  )
}
