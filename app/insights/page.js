'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sold History', href: '/sold' },
  { label: 'Market', href: '/market' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconTrendUp() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconTrendDown() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }
function IconStar() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconTrophy() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Market': IconMarket, 'Insights': IconInsights, 'Sold History': IconSold }

// ── Toast ─────────────────────────────────────────────────────────────────────
var _toastFn = null
function showToast(msg, type='success', onUndo=null) { if(_toastFn) _toastFn(msg,type,onUndo) }
function ToastContainer() {
  const [toasts,setToasts] = useState([])
  useEffect(() => {
    _toastFn = (msg,type,onUndo) => {
      const id = Date.now()
      setToasts(prev => [...prev.slice(-2),{id,msg,type,onUndo}])
      setTimeout(() => setToasts(prev => prev.filter(t=>t.id!==id)),3000)
    }
    return () => { _toastFn=null }
  },[])
  const colors={success:'#4ade80',error:'#9333ea',info:'#888'}
  const icons={success:'✓',error:'✕',info:'ℹ'}
  if(!toasts.length) return null
  return (
    <div style={{position:'fixed',bottom:88,left:'50%',transform:'translateX(-50%)',zIndex:9999,display:'flex',flexDirection:'column',gap:8,alignItems:'center',pointerEvents:'none'}}>
      {toasts.map(t=>(
        <div key={t.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 18px',borderRadius:12,background:'#1e1e1e',border:`1px solid ${colors[t.type]}50`,boxShadow:'0 8px 28px rgba(0,0,0,0.6)',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,color:'#f0f0f0',pointerEvents:'auto',animation:'toastIn 0.2s ease',whiteSpace:'nowrap'}}>
          <span style={{color:colors[t.type]}}>{icons[t.type]}</span>
          {t.msg}
          {t.onUndo&&<button onClick={t.onUndo} style={{marginLeft:6,padding:'2px 10px',borderRadius:6,background:'rgba(255,255,255,0.08)',border:'none',color:'#9333ea',fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,cursor:'pointer',pointerEvents:'auto'}}>Undo</button>}
        </div>
      ))}
    </div>
  )
}


// ── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({w='100%',h=20,r=8,style={}}) {
  return <div style={{width:w,height:h,borderRadius:r,background:'linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.4s infinite',flexShrink:0,...style}} />
}



const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)
const RED = '#9333ea'
const CHART_COLORS = ['#9333ea','#ff7043','#ffb300','#66bb6a','#42a5f5','#ab47bc','#26c6da','#a855f7','#ffa726','#9ccc65']

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
  const SHORT = { 'Dashboard':'Home', 'Collection':'Cards', 'Insights':'Stats', 'Sold History':'Sold', 'Market':'Market' }
  return (
    <nav className="mobile-only" style={{ position:'fixed', bottom:0, left:0, right:0, height:64, background:'#000', borderTop:'1px solid #111', display:'flex', alignItems:'center', zIndex:100 }}>
      {NAV.map(({ label, href }) => {
        const isActive = active === label
        const Icon = navIcons[label]
        if (!Icon) return null
        return (
          <Link key={label} href={href} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, textDecoration:'none', paddingBottom:4 }}>
            <div style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background: isActive ? '#9333ea' : 'transparent', color: isActive ? '#fff' : '#444', transition:'all 0.15s' }}><Icon /></div>
            <span style={{ fontSize:9, fontWeight:800, color: isActive ? '#9333ea' : '#444', letterSpacing:'0.08em', textTransform:'uppercase' }}>{SHORT[label]||label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

// ── Donut Chart ────────────────────────────────────────────────
function DonutChart({ data, title, size = 180 }) {
  if (!data.length) return null
  const total = data.reduce((s, d) => s + d.value, 0)
  if (!total) return null
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.24
  let angle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle)
    angle += sweep
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle)
    const xi1 = cx + inner * Math.cos(angle - sweep), yi1 = cy + inner * Math.sin(angle - sweep)
    const xi2 = cx + inner * Math.cos(angle), yi2 = cy + inner * Math.sin(angle)
    const large = sweep > Math.PI ? 1 : 0
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`, color: CHART_COLORS[i % CHART_COLORS.length], label: d.label, value: d.value, pct: Math.round((d.value / total) * 100) }
  })
  const [hovered, setHovered] = useState(null)
  return (
    <div style={{ background: '#13131f', border: '1px solid rgba(147,51,234,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={size} height={size}>
            {slices.map((s, i) => (
              <path key={i} d={s.path} fill={s.color} opacity={hovered === null || hovered === i ? 1 : 0.3} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
            ))}
            <circle cx={cx} cy={cy} r={inner} fill="#111" />
            {hovered !== null ? (
              <>
                <text x={cx} y={cy - 8} textAnchor="middle" fill="#f0f0f0" fontSize="16" fontWeight="700" fontFamily="JetBrains Mono">{slices[hovered].pct}%</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fill="#666" fontSize="10" fontFamily="Outfit">{slices[hovered].label}</text>
              </>
            ) : (
              <>
                <text x={cx} y={cy - 6} textAnchor="middle" fill="#f0f0f0" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">{total}</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fill="#555" fontSize="10" fontFamily="Outfit">total</text>
              </>
            )}
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {slices.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: hovered === null || hovered === i ? 1 : 0.4, transition: 'opacity 0.2s', cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: '#ccc' }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Bar Chart ────────────────────────────────────────────────
function BarChart({ data, title, valuePrefix = '', valueSuffix = '', color = RED }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const [hovered, setHovered] = useState(null)
  return (
    <div style={{ background: '#13131f', border: '1px solid rgba(147,51,234,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 18 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: 80, fontFamily: "'Outfit',sans-serif", fontSize: 11, color: '#666', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label}</div>
            <div style={{ flex: 1, height: 28, background: '#1a1a1a', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '100%', width: `${(d.value / max) * 100}%`, background: hovered === i ? `${color}dd` : `${color}99`, borderRadius: 6, transition: 'all 0.3s ease', minWidth: d.value > 0 ? 4 : 0 }} />
            </div>
            <div style={{ width: 60, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: hovered === i ? '#f0f0f0' : '#888', textAlign: 'right', flexShrink: 0 }}>{valuePrefix}{d.value}{valueSuffix}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, positive, accent, style = {} }) {
  return (
    <div style={{ background: '#111', border: `1px solid ${accent ? 'rgba(147,51,234,0.25)' : '#1e1e1e'}`, borderRadius: 16, padding: '16px 18px', position: 'relative', overflow: 'hidden', ...style }}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#9333ea,#a855f7)' }} />}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Outfit',sans-serif" }}>{label}</div>
        {icon && <div style={{ fontSize: 16 }}>{icon}</div>}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, color: '#f0f0f0', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ marginTop: 8, fontSize: 11, color: positive === true ? '#4ade80' : positive === false ? '#9333ea' : '#555', fontFamily: "'Outfit',sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
        {positive === true && <IconTrendUp />}{positive === false && <IconTrendDown />}{sub}
      </div>}
    </div>
  )
}

// ── Top Cards Visual Rank ──────────────────────────────────────
function TopCardsRank({ cards }) {
  if (!cards.length) return null
  const top = [...cards].filter(c => !c.sold).sort((a, b) => (parseFloat(b.val) || 0) - (parseFloat(a.val) || 0)).slice(0, 5)
  const max = parseFloat(top[0]?.val) || 1
  return (
    <div style={{ background: '#13131f', border: '1px solid rgba(147,51,234,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}><IconTrophy /><span>Top 5 Most Valuable</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top.map((card, i) => { // stagger
          const val = parseFloat(card.val) || parseFloat(card.buy) || 0
          const buy = parseFloat(card.buy) || 0
          const gl = val - buy
          const glPos = gl >= 0
          return (
            <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: i === 0 ? 'rgba(147,51,234,0.2)' : '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: i === 0 ? '#9333ea' : '#555', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.player}</div>
                <div style={{ position: 'relative', height: 4, background: '#1a1a1a', borderRadius: 4, marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: i === 0 ? 'linear-gradient(90deg,#9333ea,#a855f7)' : '#333', borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#f0f0f0' }}>{fmt(val)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: glPos ? '#4ade80' : '#9333ea', marginTop: 2 }}>{glPos ? '+' : ''}{fmt(gl)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Monthly Activity Chart ──────────────────────────────────────
function MonthlyActivity({ cards }) {
  const months = {}
  cards.forEach(c => {
    if (!c.createdAt) return
    const d = new Date(c.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[key] = (months[key] || 0) + 1
  })
  const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-8)
  if (!sorted.length) return null
  const data = sorted.map(([key, value]) => {
    const [y, m] = key.split('-')
    const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    return { label, value }
  })
  return <BarChart data={data} title="📅 Cards Added by Month" valueSuffix=" cards" />
}

// ── Personal Records ──────────────────────────────────────────
function PersonalRecords({ cards, soldCards }) {
  const active = cards.filter(c => !c.sold)
  if (!active.length && !soldCards.length) return null

  const byVal = [...active].sort((a, b) => (parseFloat(b.val) || 0) - (parseFloat(a.val) || 0))
  const byBuy = [...active].sort((a, b) => (parseFloat(b.buy) || 0) - (parseFloat(a.buy) || 0))
  const cheapest = [...active].sort((a, b) => (parseFloat(a.buy) || 0) - (parseFloat(b.buy) || 0))[0]
  const oldest = [...active].filter(c => c.year).sort((a, b) => parseInt(a.year) - parseInt(b.year))[0]
  const newest = [...active].filter(c => c.createdAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
  const topGrade = [...active].filter(c => c.grade).sort((a, b) => parseInt(b.grade) - parseInt(a.grade))[0]

  const bestFlip = soldCards.length ? [...soldCards].sort((a, b) => {
    const glA = (parseFloat(a.soldPrice) || 0) - (parseFloat(a.buy) || 0)
    const glB = (parseFloat(b.soldPrice) || 0) - (parseFloat(b.buy) || 0)
    return glB - glA
  })[0] : null

  const records = [
    { icon: '👑', label: 'Most Valuable', value: byVal[0]?.player || '—', sub: byVal[0] ? fmt(parseFloat(byVal[0].val) || 0) : '', subColor: '#4ade80', card: byVal[0] },
    { icon: '💸', label: 'Most Expensive Buy', value: byBuy[0]?.player || '—', sub: byBuy[0] ? fmt(parseFloat(byBuy[0].buy) || 0) : '', subColor: '#888', card: byBuy[0] },
    { icon: '🪙', label: 'Cheapest Card', value: cheapest?.player || '—', sub: cheapest ? fmt(parseFloat(cheapest.buy) || 0) : '', subColor: '#888', card: cheapest },
    { icon: '🏛️', label: 'Oldest Card', value: oldest?.player || '—', sub: oldest?.year || '', subColor: '#888', card: oldest },
    { icon: '🆕', label: 'Latest Addition', value: newest?.player || '—', sub: newest ? new Date(newest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '', subColor: '#888', card: newest },
    { icon: '🏅', label: 'Highest Grade', value: topGrade?.player || '—', sub: topGrade ? `Grade ${topGrade.grade}` : 'No graded cards', subColor: '#9333ea', card: topGrade },
    ...(bestFlip ? [{ icon: '🔥', label: 'Best Flip Ever', value: bestFlip.player, sub: `+${fmt((parseFloat(bestFlip.soldPrice) || 0) - (parseFloat(bestFlip.buy) || 0))}`, subColor: '#4ade80', card: bestFlip }] : []),
  ]

  return (
    <div style={{ background: '#13131f', border: '1px solid rgba(147,51,234,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><IconStar /><span>Personal Records</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {records.map((r, i) => {
          const href = r.card?.player ? `/collection?search=${encodeURIComponent(r.card.player)}` : null
          const inner = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#1a1a1a', borderRadius: 10, animation:`fadeUp 0.45s ease ${i*0.08}s both`, cursor: href ? 'pointer' : 'default', transition:'background 0.15s' }}
              onMouseEnter={e => { if(href) e.currentTarget.style.background='#222' }}
              onMouseLeave={e => { if(href) e.currentTarget.style.background='#1a1a1a' }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.value}</div>
                {r.sub && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: r.subColor || '#888', marginTop: 1 }}>{r.sub}</div>}
              </div>
              {href && <span style={{ fontSize:10, color:'#9333ea', fontFamily:"'Outfit',sans-serif", fontWeight:700, flexShrink:0 }}></span>}
            </div>
          )
          return href
            ? <Link key={i} href={href} style={{ textDecoration:'none' }}>{inner}</Link>
            : <div key={i}>{inner}</div>
        })}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function InsightsPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me', { cache: 'no-store' }),
      fetch('/api/cards', { cache: 'no-store' })
    ]).then(async ([meRes, cardsRes]) => {
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setCards(await cardsRes.json())
      setLoading(false)
    })
  }, [router])

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }

  async function reload() {
    const [meRes, cardsRes] = await Promise.all([
      fetch('/api/auth/me', { cache: 'no-store' }),
      fetch('/api/cards', { cache: 'no-store' })
    ])
    if (meRes.ok) setUser((await meRes.json()).user)
    if (cardsRes.ok) setCards(await cardsRes.json())
  }

  if (loading) return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0a0a0a'}}>
      <div className="sidebar-el" style={{width:220,minHeight:'100vh',background:'#0d0d0d',borderRight:'1px solid #1e1e1e',flexShrink:0}} />
      <div style={{flex:1,padding:28}}><Sk h={28} r={8} style={{marginBottom:24,maxWidth:180}} /><Sk h={240} r={16} style={{marginBottom:14}} /><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:14}}><Sk h={85} r={14}/><Sk h={85} r={14}/><Sk h={85} r={14}/><Sk h={85} r={14}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}><Sk h={200} r={14}/><Sk h={200} r={14}/></div></div>
    </div>
  )

  const activeCards = cards.filter(c => !c.sold)
  const soldCards = cards.filter(c => c.sold)

  // ── Computed Stats ──────────────────────────────────────────
  const totalInvested = activeCards.reduce((s, c) => s + (parseFloat(c.buy) || 0) * (parseInt(c.qty) || 1), 0)
  const currentValue = activeCards.reduce((s, c) => s + (parseFloat(c.val) || parseFloat(c.buy) || 0) * (parseInt(c.qty) || 1), 0)
  const realizedPL = soldCards.reduce((s, c) => s + (parseFloat(c.soldPrice) || 0) - (parseFloat(c.buy) || 0), 0)
  const unrealizedPL = currentValue - totalInvested
  const totalROI = totalInvested > 0 ? (unrealizedPL / totalInvested) * 100 : 0
  const gradedCards = activeCards.filter(c => c.grade)
  const rawCards = activeCards.filter(c => !c.grade)

  // Sport breakdown
  const sportData = Object.entries(activeCards.reduce((acc, c) => {
    const s = c.sport || 'Other'
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))

  // Grader breakdown
  const graderData = [
    { label: 'Graded', value: activeCards.filter(c => c.grade && !c.cond?.includes('BGS')).length },
    { label: 'BGS', value: activeCards.filter(c => c.cond?.includes('BGS')).length },
    { label: 'Raw', value: rawCards.length },
  ].filter(d => d.value > 0)

  // Price bucket breakdown
  const buckets = [
    { label: 'Under $50', value: activeCards.filter(c => (parseFloat(c.buy) || 0) < 50).length },
    { label: '$50–$200', value: activeCards.filter(c => { const b = parseFloat(c.buy) || 0; return b >= 50 && b < 200 }).length },
    { label: '$200–$500', value: activeCards.filter(c => { const b = parseFloat(c.buy) || 0; return b >= 200 && b < 500 }).length },
    { label: '$500–$1k', value: activeCards.filter(c => { const b = parseFloat(c.buy) || 0; return b >= 500 && b < 1000 }).length },
    { label: 'Over $1k', value: activeCards.filter(c => (parseFloat(c.buy) || 0) >= 1000).length },
  ].filter(d => d.value > 0)

  // Brand breakdown
  const brandData = Object.entries(activeCards.reduce((acc, c) => {
    if (c.brand) acc[c.brand] = (acc[c.brand] || 0) + 1
    return acc
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }))

  // Year breakdown
  const yearData = Object.entries(activeCards.reduce((acc, c) => {
    if (c.year) acc[c.year] = (acc[c.year] || 0) + 1
    return acc
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }))

  const isEmpty = activeCards.length === 0

  return (
    <>
      <style>{`
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
        *{font-family:'Space Grotesk',-apple-system,sans-serif!important}
        [style*="JetBrains"],[style*="monospace"]{font-family:'JetBrains Mono',monospace!important}
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:200px;min-height:100vh;width:calc(100% - 200px)}
        .insights-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .insights-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .insights-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .hide-mobile{display:block}.show-mobile{display:none!important}.mob-stat-scroll-wrap{display:none!important}
        @media(max-width:1100px){.insights-grid-4{grid-template-columns:repeat(2,1fr)}.insights-grid-3{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){
          .sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}
          .main-wrap{margin-left:0!important;width:100%!important;padding:12px 12px 80px!important}
          .insights-grid{grid-template-columns:1fr!important;gap:12px!important}
          .insights-grid-3{grid-template-columns:1fr 1fr!important;gap:10px!important}
          .insights-grid-4{grid-template-columns:1fr 1fr!important;gap:10px!important}
          .hide-mobile{display:none!important}
          .show-mobile{display:block!important}
          .mob-stat-scroll-wrap{display:block!important}
        }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} active="Insights" cardCount={activeCards.length} /></div>          <main className="main-wrap" style={{ padding: '28px 28px 40px' }}>

          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <img src={LOGO} alt="TopLoad" style={{ height: 32, filter: 'drop-shadow(0 0 8px rgba(147,51,234,0.4))' }} />
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: '#f0f0f0' }}>Insights</div>
            <div style={{ width: 32 }} />
          </div>

          {/* Desktop header */}
          <div className="hide-mobile" style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 40, fontWeight: 900, letterSpacing: '-2px', margin: 0, background: 'linear-gradient(135deg,#f5f5f5 40%,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insights</h1>
            <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontWeight: 500 }}>A deep look at your collection — updates automatically with every new card</p>
          </div>

          {isEmpty ? (
            <div style={{ textAlign: 'center', padding: '100px 24px' }}>
              <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.15 }}>📊</div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: '#333' }}>Add cards to your collection to see insights</p>
            </div>
          ) : (
            <>
              {/* ── Mobile Hero ── */}
              <div className="mob-stat-scroll-wrap">
                <div style={{ background: 'linear-gradient(135deg,#1a0505,#0d0d0d)', border: '1px solid rgba(147,51,234,0.15)', borderRadius: 16, padding: '18px 16px', marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#555', fontFamily: "'Outfit',sans-serif", fontWeight: 600, marginBottom: 4 }}>Portfolio Value</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-1px', lineHeight: 1 }}>{fmt(currentValue)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: unrealizedPL >= 0 ? '#4ade80' : '#9333ea' }}>
                      {unrealizedPL >= 0 ? '▲' : '▼'} {unrealizedPL >= 0 ? '+' : ''}{fmt(unrealizedPL)}
                    </div>
                    <div style={{ fontSize: 12, color: '#555' }}>({totalROI >= 0 ? '+' : ''}{totalROI.toFixed(1)}%)</div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div><div style={{ fontSize: 9, color: '#444', fontFamily: "'Outfit',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Invested</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#888' }}>{fmt(totalInvested)}</div></div>
                    <div><div style={{ fontSize: 9, color: '#444', fontFamily: "'Outfit',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Cards</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#888' }}>{activeCards.length}</div></div>
                    <div><div style={{ fontSize: 9, color: '#444', fontFamily: "'Outfit',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Graded</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#888' }}>{gradedCards.length}</div></div>
                    <div><div style={{ fontSize: 9, color: '#444', fontFamily: "'Outfit',sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>P&L</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: realizedPL >= 0 ? '#4ade80' : '#9333ea' }}>{realizedPL >= 0 ? '+' : ''}{fmt(realizedPL)}</div></div>
                  </div>
                </div>
              </div>

              {/* ── Personal Records — TOP ── */}
              <div style={{ marginBottom: 14 }}>
                <PersonalRecords cards={cards} soldCards={soldCards} />
              </div>

              {/* ── Desktop: Top Stats Row ── */}
              <div className="hide-mobile">
                <div className="insights-grid-4" style={{ marginBottom: 14 }}>
                  <StatCard style={{animation:"fadeUp 0.45s ease 0s both"}} label="Total Cards" value={activeCards.length} sub={`${soldCards.length} sold`} icon="🃏" accent />
                  <StatCard style={{animation:"fadeUp 0.45s ease 0.1s both"}} label="Total Invested" value={fmt(totalInvested)} icon="💵" />
                  <StatCard style={{animation:"fadeUp 0.45s ease 0.2s both"}} label="Current Value" value={fmt(currentValue)} sub={`${totalROI >= 0 ? '+' : ''}${totalROI.toFixed(1)}% ROI`} positive={totalROI >= 0} icon="📈" />
                  <StatCard style={{animation:"fadeUp 0.45s ease 0.3s both"}} label="Realized P&L" value={`${realizedPL >= 0 ? '+' : ''}${fmt(realizedPL)}`} sub={`${soldCards.length} cards flipped`} positive={soldCards.length > 0 ? realizedPL >= 0 : undefined} icon="💰" />
                </div>
                <div className="insights-grid-3" style={{ marginBottom: 14 }}>
                  <StatCard style={{animation:"fadeUp 0.45s ease 0.1s both"}} label="Unrealized G/L" value={`${unrealizedPL >= 0 ? '+' : ''}${fmt(unrealizedPL)}`} positive={unrealizedPL >= 0} icon="📊" />
                  <StatCard style={{animation:"fadeUp 0.45s ease 0.2s both"}} label="Graded Cards" value={gradedCards.length} sub={`${Math.round((gradedCards.length / activeCards.length) * 100)}% of collection`} icon="🏅" />
                  <StatCard style={{animation:"fadeUp 0.45s ease 0.3s both"}} label="Raw Cards" value={rawCards.length} sub={`${Math.round((rawCards.length / activeCards.length) * 100)}% of collection`} icon="📦" />
                </div>
              </div>

              {/* ── Top Cards ── */}
              <div style={{ marginBottom: 14 }}>
                <TopCardsRank cards={cards} />
              </div>

              {/* ── Charts — hide on mobile to reduce scrolling ── */}
              <div className="hide-mobile">
                <div className="insights-grid" style={{ marginBottom: 14 }}>
                  {sportData.length > 1 && <DonutChart data={sportData} title="🏀 Sport Breakdown" />}
                  {graderData.length > 1 && <DonutChart data={graderData} title="🏅 Raw vs Graded" />}
                </div>
                <div className="insights-grid" style={{ marginBottom: 14 }}>
                  {buckets.length > 0 && <BarChart data={buckets} title="💰 Value Distribution" valueSuffix=" cards" />}
                  {brandData.length > 0 && <BarChart data={brandData} title="🏷️ Top Brands" valueSuffix=" cards" color="#ff7043" />}
                </div>
                <div className="insights-grid" style={{ marginBottom: 14 }}>
                  {yearData.length > 0 && <BarChart data={yearData} title="📅 Cards by Year" valueSuffix=" cards" color="#ab47bc" />}
                  <MonthlyActivity cards={cards} />
                </div>
              </div>

              {/* ── Mobile: show sport + graded charts only ── */}
              <div className="show-mobile">
                <div style={{ marginBottom: 14 }}>
                  {sportData.length > 1 && <DonutChart data={sportData} title="🏀 Sport Breakdown" />}
                </div>
                <div style={{ marginBottom: 14 }}>
                  {graderData.length > 1 && <DonutChart data={graderData} title="🏅 Raw vs Graded" />}
                </div>
              </div>
            </>
          )}
        </main>
        <ToastContainer />
        <BottomNav active="Insights" />
      </div>
    </>
  )
}
