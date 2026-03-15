'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Sold History', href: '/sold' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconWishlist() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconTrendUp() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconTrendDown() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }
function IconCheck() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Wish List': IconWishlist, 'Sold History': IconSold }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

function Sidebar({ user, onLogout, active }) {
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#0d0d0d', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 60 }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={LOGO} alt="TopLoad" style={{ width: 130, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} />
      </div>
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: 10, color: '#333', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Menu</div>
        {NAV.map(({ label, href }) => {
          const isActive = active === label
          const Icon = navIcons[label]
          return <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: isActive ? '#e53935' : '#666', background: isActive ? 'rgba(229,57,53,0.08)' : 'transparent', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: isActive ? 600 : 500, borderLeft: isActive ? '2px solid #e53935' : '2px solid transparent', transition: 'all 0.15s' }}><Icon />{label}</Link>
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

function BottomNav({ active }) {
  return (
    <nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: '#0d0d0d', borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', zIndex: 100 }}>
      {NAV.map(({ label, href }) => {
        const isActive = active === label
        const Icon = navIcons[label]
        return <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: isActive ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 9, fontWeight: isActive ? 700 : 500, letterSpacing: '0.04em', textTransform: 'uppercase', paddingBottom: 4 }}><Icon />{label === 'Sold History' ? 'Sold' : label}</Link>
      })}
    </nav>
  )
}

function SparklineChart({ cards }) {
  if (!cards.length) return null
  const sorted = [...cards].filter(c => !c.sold).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  const points = []
  let cumValue = 0, cumCost = 0
  sorted.forEach(c => {
    cumCost += (parseFloat(c.buy)||0)*(parseInt(c.qty)||1)
    cumValue += (parseFloat(c.val)||parseFloat(c.buy)||0)*(parseInt(c.qty)||1)
    points.push({ value: cumValue, cost: cumCost })
  })
  if (points.length < 2) points.unshift({ value: 0, cost: 0 })
  const totalVal = sorted.reduce((s,c) => s+(parseFloat(c.val)||parseFloat(c.buy)||0)*(parseInt(c.qty)||1),0)
  const totalCost = sorted.reduce((s,c) => s+(parseFloat(c.buy)||0)*(parseInt(c.qty)||1),0)
  points.push({ value: totalVal, cost: totalCost })
  const W=600, H=100
  const maxV = Math.max(...points.map(p=>p.value))*1.1||100
  const toX = i => (i/(points.length-1))*W
  const toY = v => H-((v)/(maxV))*H
  const valuePath = points.map((p,i) => `${i===0?'M':'L'} ${toX(i)} ${toY(p.value)}`).join(' ')
  const costPath = points.map((p,i) => `${i===0?'M':'L'} ${toX(i)} ${toY(p.cost)}`).join(' ')
  const areaPath = `${valuePath} L ${W} ${H} L 0 ${H} Z`
  const isUp = totalVal >= totalCost
  const lineColor = isUp ? '#e53935' : '#616161'
  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '18px 20px', marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#999' }}>Portfolio Value</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 700, color: '#f0f0f0', marginTop: 2 }}>{fmt(totalVal)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: isUp ? '#e53935' : '#616161' }}>
            {isUp ? <IconTrendUp /> : <IconTrendDown />}{isUp?'+':''}{fmt(totalVal-totalCost)}
          </div>
          <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>vs cost basis</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 70, overflow: 'visible' }}>
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lineColor} stopOpacity="0.2"/><stop offset="100%" stopColor={lineColor} stopOpacity="0.02"/></linearGradient></defs>
        <path d={areaPath} fill="url(#ag)" />
        <path d={costPath} stroke="#333" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <path d={valuePath} stroke={lineColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={toX(points.length-1)} cy={toY(points[points.length-1].value)} r="4" fill={lineColor} />
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><div style={{ width: 20, height: 2, background: lineColor, borderRadius: 1 }} />Portfolio Value</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><div style={{ width: 20, height: 2, background: '#333', borderRadius: 1 }} />Cost Basis</div>
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
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.player}</div>
        <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{[card.year,card.sport,card.grade?'PSA '+card.grade:card.cond].filter(Boolean).join(' · ')}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: glPos?'#e53935':'#616161', marginRight: 16, minWidth: 60, justifyContent: 'flex-end' }}>
        {glPos?<IconTrendUp />:<IconTrendDown />}{glPos?'+':''}{glPct.toFixed(1)}%
      </div>
      {editing ? (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} autoFocus style={{ width: 90, padding: '5px 8px', borderRadius: 7, background: '#1a1a1a', border: '1px solid #e53935', color: '#f0f0f0', fontSize: 13, outline: 'none', fontFamily: "'JetBrains Mono',monospace", textAlign: 'right' }} onKeyDown={e => { if(e.key==='Enter') handleSave(); if(e.key==='Escape') setEditing(false) }} />
          <button onClick={handleSave} disabled={saving} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(229,57,53,0.15)', border: 'none', color: '#e53935', cursor: 'pointer' }}><IconCheck /></button>
        </div>
      ) : (
        <div onClick={() => setEditing(true)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#f0f0f0', cursor: 'pointer', padding: '4px 8px', borderRadius: 7, border: '1px solid transparent', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(229,57,53,0.4)'; e.currentTarget.style.background='rgba(229,57,53,0.06)' }}
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1e1e1e' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.player}</div>
        <div style={{ fontSize: 10, color: '#444' }}>{card.year} {card.sport}</div>
      </div>
      <div style={{ textAlign: 'right', marginLeft: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: isGainer?'#e53935':'#616161' }}>{isGainer?'+':''}{card.pct.toFixed(1)}%</div>
        <div style={{ fontSize: 10, color: '#444', fontFamily: "'JetBrains Mono',monospace" }}>{isGainer?'+':''}{fmt(card.gl)}</div>
      </div>
    </div>
  )
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: '#e53935', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>🚀 Top Gainers</div>
        {gainers.length ? gainers.map(c=><MoverRow key={c.id} card={c} isGainer={true}/>) : <div style={{ color:'#333',fontSize:12 }}>No gainers yet</div>}
      </div>
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: '#616161', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>📉 Top Losers</div>
        {losers.length ? losers.map(c=><MoverRow key={c.id} card={c} isGainer={false}/>) : <div style={{ color:'#333',fontSize:12 }}>No losers yet</div>}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, positive }) {
  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: positive===true?'#e53935':positive===false?'#616161':'#444' }}>
        {positive===true&&<IconTrendUp />}{positive===false&&<IconTrendDown />}{sub}
      </div>}
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
  const router = useRouter()

  const loadData = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me',{cache:'no-store'}),fetch('/api/cards',{cache:'no-store'})])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) { const d=await cardsRes.json(); setCards(Array.isArray(d)?d:[]) }
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

  async function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome==='accepted') { setInstalled(true); setInstallPrompt(null) }
  }
  async function handleLogout() { await fetch('/api/auth/logout',{method:'POST'}); router.push('/login') }

  if (loading) return <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a' }}><img src={LOGO} alt="TopLoad" style={{ width:120,opacity:0.4 }} /></div>

  const activeCards = cards.filter(c=>!c.sold)
  const soldCards = cards.filter(c=>c.sold)
  const totalInvested = activeCards.reduce((s,c)=>s+(parseFloat(c.buy)||0)*(parseInt(c.qty)||1),0)
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
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:220px;min-height:100vh;width:calc(100% - 220px)}
        .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .stat-grid2{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}
        .body-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:22px}
        @media(max-width:1100px){.stat-grid{grid-template-columns:repeat(2,1fr)}.stat-grid2{grid-template-columns:repeat(2,1fr)}.body-grid{grid-template-columns:1fr}}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding-bottom:80px!important}.stat-grid{grid-template-columns:1fr 1fr}.stat-grid2{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.stat-grid{grid-template-columns:1fr}.stat-grid2{grid-template-columns:1fr}}
      `}</style>
      <div style={{ display:'flex',minHeight:'100vh',background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} active="Dashboard" /></div>
        <main className="main-wrap" style={{ padding:'28px 28px 40px' }}>
          <div className="mob-topbar" style={{ alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:36,width:'auto',objectFit:'contain',filter:'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} />
            <button onClick={handleLogout} style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:10,background:'rgba(255,255,255,0.05)',border:'none',color:'#555',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer' }}><IconLogout />Sign Out</button>
          </div>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:24 }}>
            <div>
              <h1 style={{ fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:'#f0f0f0',letterSpacing:'-0.5px',margin:0 }}>Portfolio Overview</h1>
              <p style={{ fontSize:13,color:'#555',marginTop:4,fontWeight:500 }}>{activeCards.length===0?"Add your first card to get started":`Tracking ${activeCards.length} active card${activeCards.length!==1?'s':''}`}</p>
            </div>
            <div style={{ display:'flex',gap:8 }}>
              {!installed && <button onClick={installPrompt?handleInstall:()=>setShowInstallModal(true)} style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:'rgba(229,57,53,0.08)',border:'1px solid rgba(229,57,53,0.2)',borderRadius:10,color:'#e53935',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer' }}>📲 Install App</button>}
              <Link href="/collection" style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:'rgba(229,57,53,0.08)',border:'1px solid rgba(229,57,53,0.25)',borderRadius:10,color:'#e53935',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,textDecoration:'none' }}>+ Add Card</Link>
            </div>
          </div>
          {cards.length>0&&<SparklineChart cards={cards} />}
          <div className="stat-grid">
            <StatCard label="Active Cards" value={activeCards.length} />
            <StatCard label="Total Invested" value={fmt(totalInvested)} />
            <StatCard label="Current Value" value={fmt(currentValue)} />
          </div>
          <div className="stat-grid2">
            <StatCard label="Unrealized G/L" value={`${gainPos?'+':''}${fmt(gainLoss)}`} sub={`${retPos?'+':''}${portfolioReturn.toFixed(1)}% return`} positive={totalInvested>0?gainPos:undefined} />
            <StatCard label="Portfolio Return" value={`${retPos?'+':''}${portfolioReturn.toFixed(1)}%`} sub={totalInvested>0?(retPos?'Above cost basis':'Below cost basis'):'No data'} positive={totalInvested>0?retPos:undefined} />
            <StatCard label="Realized P&L" value={`${realizedPL>=0?'+':''}${fmt(realizedPL)}`} sub={`${soldCards.length} card${soldCards.length!==1?'s':''} sold`} positive={soldCards.length>0?realizedPL>=0:undefined} />
          </div>
          {activeCards.length>1&&<div style={{ marginTop:22 }}><TopMovers cards={activeCards} /></div>}
          <div className="body-grid">
            {activeCards.length>0&&(
              <div style={{ background:'#111',border:'1px solid #1e1e1e',borderRadius:14,overflow:'hidden' }}>
                <div style={{ padding:'16px 18px 12px',borderBottom:'1px solid #1e1e1e',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <h2 style={{ fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,color:'#ccc',margin:0 }}>Quick Value Update</h2>
                  <span style={{ fontSize:11,color:'#444',fontFamily:"'Outfit',sans-serif" }}>Click value to edit</span>
                </div>
                <div>
                  {activeCards.slice(0,3).map(card=><QuickValueRow key={card.id} card={card} onUpdate={loadData} />)}
                  {activeCards.length>3&&<div style={{ padding:'10px 16px',borderTop:'1px solid #1e1e1e' }}><Link href="/collection" style={{ fontSize:12,color:'#e53935',textDecoration:'none',fontFamily:"'Outfit',sans-serif",fontWeight:600 }}>View all {activeCards.length} cards →</Link></div>}
                </div>
              </div>
            )}
            <div style={{ background:'#111',border:'1px solid #1e1e1e',borderRadius:14,overflow:'hidden' }}>
              <div style={{ padding:'16px 18px 12px',borderBottom:'1px solid #1e1e1e' }}>
                <h2 style={{ fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,color:'#ccc',margin:0 }}>By Sport</h2>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%',borderCollapse:'collapse' }}>
                  <thead><tr>{['Sport','Cards','Invested','Value','G/L'].map((h,i)=><th key={h} style={{ padding:'9px 16px',textAlign:i===0?'left':'right',fontFamily:"'Outfit',sans-serif",fontSize:10,fontWeight:700,color:'#333',letterSpacing:'0.1em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {Object.keys(bySport).length===0?<tr><td colSpan={5} style={{ textAlign:'center',color:'#333',fontFamily:"'Outfit',sans-serif",fontSize:13,padding:'28px 16px' }}>No cards yet</td></tr>
                    :Object.entries(bySport).sort((a,b)=>b[1].value-a[1].value).map(([sport,d])=>{
                      const gl=d.value-d.invested
                      return <tr key={sport} style={{ borderTop:'1px solid #1e1e1e' }}>
                        <td style={{ padding:'11px 16px',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,color:'#ccc' }}>{sport}</td>
                        <td style={{ padding:'11px 16px',textAlign:'right',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#666' }}>{d.cards}</td>
                        <td style={{ padding:'11px 16px',textAlign:'right',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#666' }}>{fmt(d.invested)}</td>
                        <td style={{ padding:'11px 16px',textAlign:'right',fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:'#f0f0f0' }}>{fmt(d.value)}</td>
                        <td style={{ padding:'11px 16px',textAlign:'right',fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:gl>=0?'#e53935':'#616161' }}>{gl>=0?'+':''}{fmt(gl)}</td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <BottomNav active="Dashboard" />
      </div>
      {showInstallModal&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
          <div style={{ background:'#111',border:'1px solid #2a2a2a',borderRadius:16,padding:28,maxWidth:360,width:'100%',textAlign:'center' }}>
            <img src={LOGO} alt="TopLoad" style={{ width:100,marginBottom:16,filter:'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} />
            <h3 style={{ fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:'#f0f0f0',marginBottom:8 }}>Install TopLoad</h3>
            <p style={{ fontSize:13,color:'#666',marginBottom:20,lineHeight:1.6 }}>Add to your home screen for the full app experience.</p>
            <div style={{ textAlign:'left',display:'flex',flexDirection:'column',gap:10,marginBottom:24 }}>
              <div style={{ padding:'12px 14px',borderRadius:10,background:'#1a1a1a',border:'1px solid #2a2a2a' }}>
                <div style={{ fontSize:11,fontWeight:700,color:'#e53935',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em' }}>📱 iPhone · Safari</div>
                <div style={{ fontSize:12,color:'#777',lineHeight:1.6 }}>Tap <strong style={{ color:'#ccc' }}>Share</strong> → <strong style={{ color:'#ccc' }}>Add to Home Screen</strong></div>
              </div>
              <div style={{ padding:'12px 14px',borderRadius:10,background:'#1a1a1a',border:'1px solid #2a2a2a' }}>
                <div style={{ fontSize:11,fontWeight:700,color:'#888',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em' }}>🤖 Android · Chrome</div>
                <div style={{ fontSize:12,color:'#777',lineHeight:1.6 }}>Tap <strong style={{ color:'#ccc' }}>⋮ menu</strong> → <strong style={{ color:'#ccc' }}>Add to Home Screen</strong></div>
              </div>
            </div>
            <button onClick={()=>setShowInstallModal(false)} style={{ width:'100%',padding:12,borderRadius:10,background:'linear-gradient(135deg,#e53935,#ff5252)',border:'none',color:'#fff',fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer' }}>Got it!</button>
          </div>
        </div>
      )}
    </>
  )
}

