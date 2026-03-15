'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sold History', href: '/sold' },
]
function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconUp() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconDown() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Insights': IconInsights, 'Sold History': IconSold }

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
  const colors={success:'#22c55e',error:'#e53935',info:'#888'}
  const icons={success:'✓',error:'✕',info:'ℹ'}
  if(!toasts.length) return null
  return (
    <div style={{position:'fixed',bottom:88,left:'50%',transform:'translateX(-50%)',zIndex:9999,display:'flex',flexDirection:'column',gap:8,alignItems:'center',pointerEvents:'none'}}>
      {toasts.map(t=>(
        <div key={t.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 18px',borderRadius:12,background:'#1e1e1e',border:`1px solid ${colors[t.type]}50`,boxShadow:'0 8px 28px rgba(0,0,0,0.6)',fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,color:'#f0f0f0',pointerEvents:'auto',animation:'toastIn 0.2s ease',whiteSpace:'nowrap'}}>
          <span style={{color:colors[t.type]}}>{icons[t.type]}</span>
          {t.msg}
          {t.onUndo&&<button onClick={t.onUndo} style={{marginLeft:6,padding:'2px 10px',borderRadius:6,background:'rgba(255,255,255,0.08)',border:'none',color:'#e53935',fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,cursor:'pointer',pointerEvents:'auto'}}>Undo</button>}
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

function Sidebar({ user, onLogout, cardCount = 0 }) {
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#0d0d0d', borderRight: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 60 }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={LOGO} alt="TopLoad" style={{ width: 140, height: 'auto', objectFit: 'contain' }} />
      </div>
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: 10, color: '#333', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Menu</div>
        {NAV.map(({ label, href }) => {
          const active = typeof window !== 'undefined' && window.location.pathname === href
          const Icon = navIcons[label]
          return <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: active ? '#e53935' : '#666', background: active ? 'rgba(229,57,53,0.08)' : 'transparent', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: active ? 600 : 500, borderLeft: active ? '2px solid #e53935' : '2px solid transparent', transition: 'all 0.15s' }}><Icon /><span style={{flex:1}}>{label}</span>{label === 'Collection' && cardCount > 0 && <span style={{fontSize:10,fontWeight:700,background:'rgba(229,57,53,0.15)',color:'#e53935',borderRadius:6,padding:'1px 6px',fontFamily:"'JetBrains Mono',monospace"}}>{cardCount}</span>}</Link>
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

function BottomNav() {
  return (
    <nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: '#0d0d0d', borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', zIndex: 100 }}>
      {NAV.map(({ label, href }) => {
        const active = typeof window !== 'undefined' && window.location.pathname === href
        const Icon = navIcons[label]
        return <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: active ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: '0.04em', textTransform: 'uppercase', paddingBottom: 4 }}><Icon />{label === 'Sold History' ? 'Sold' : label}</Link>
      })}
    </nav>
  )
}

export default function SoldHistoryPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/cards', { cache: 'no-store' })])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) { const d = await cardsRes.json(); setCards((Array.isArray(d) ? d : []).filter(c => c.sold)) }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])
  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }

  const totalRevenue = cards.reduce((s, c) => s + (parseFloat(c.soldPrice) || 0), 0)
  const totalCost = cards.reduce((s, c) => s + (parseFloat(c.buy) || 0), 0)
  const totalPL = totalRevenue - totalCost
  const avgReturn = totalCost > 0 ? (totalPL / totalCost) * 100 : 0
  const winners = cards.filter(c => (parseFloat(c.soldPrice) || 0) > (parseFloat(c.buy) || 0)).length
  const winRate = cards.length > 0 ? (winners / cards.length) * 100 : 0
  if (loading) return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
      <div className="sidebar-el" style={{ width:220, minHeight:'100vh', background:'#0d0d0d', borderRight:'1px solid #1e1e1e', flexShrink:0 }} />
      <div style={{ flex:1, padding:28 }}>
        <Sk h={28} r={8} style={{ marginBottom:8, maxWidth:200 }} />
        <Sk h={14} r={6} style={{ marginBottom:24, maxWidth:140 }} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
          <Sk h={85} r={14} /><Sk h={85} r={14} /><Sk h={85} r={14} />
        </div>
        <Sk h={350} r={14} />
      </div>
    </div>
  )

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
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:220px;min-height:100vh;width:calc(100% - 220px)}.sold-row:hover{background:rgba(255,255,255,0.02)!important}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding-bottom:80px!important}}
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} cardCount={cards.filter(c=>!c.sold).length} /></div>
        <main className="main-wrap" style={{ padding: '28px 28px' }}>
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#1e1e1e', border: 'none', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><IconLogout />Sign Out</button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px', margin: 0 }}>Sold History</h1>
            <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontWeight: 500 }}>{cards.length} card{cards.length !== 1 ? 's' : ''} sold · complete transaction history</p>
          </div>

          {/* Stats */}
          {cards.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 22 }}>
              {[
                ['Cards Sold', cards.length, '#f0f0f0'],
                ['Total Revenue', fmt(totalRevenue), '#f0f0f0'],
                ['Total Cost', fmt(totalCost), '#f0f0f0'],
                ['Realized P&L', (totalPL>=0?'+':'')+fmt(totalPL), totalPL>=0?'#22c55e':'#e53935'],
                ['Avg Return', (avgReturn>=0?'+':'')+avgReturn.toFixed(1)+'%', avgReturn>=0?'#22c55e':'#e53935'],
                ['Win Rate', winRate.toFixed(0)+'%', winRate>=50?'#e53935':'#616161'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ padding: '12px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#111,#0d0d0d)', border: '1px solid #1e1e1e' }}>
                  <div style={{ fontSize: 10, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {cards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>💰</div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: '#444', marginBottom: 8 }}>No sales yet</h3>
              <p style={{ color: '#333', fontSize: 13, marginBottom: 20, fontFamily: "'Outfit',sans-serif" }}>Mark cards as sold from your Collection to track your realized gains here.</p>
              <Link href="/collection" style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)', color: glPos ? '#22c55e' : '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Go to Collection</Link>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg,#111,#0d0d0d)', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Card','Sport','Grade','Buy Price','Sold Price','Profit/Loss','Return','Sold Date'].map((h,i) => <th key={h} style={{ padding: '11px 16px', textAlign: i===0?'left':'right', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[...cards].sort((a,b) => new Date(b.soldDate||b.updatedAt) - new Date(a.soldDate||a.updatedAt)).map((card, idx) => {
                      const buy = parseFloat(card.buy) || 0
                      const sold = parseFloat(card.soldPrice) || 0
                      const pl = sold - buy
                      const plPos = pl >= 0
                      const pct = buy > 0 ? (pl / buy) * 100 : 0
                      return (
                        <tr key={card.id} className="sold-row" style={{ borderTop: '1px solid #1e1e1e', transition: 'background 0.15s', animation:`fadeUp 0.45s ease ${idx*0.1}s both` }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc' }}>{card.player}</div>
                            {card.name && <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{card.name}</div>}
                            {card.year && <div style={{ fontSize: 11, color: '#444' }}>{card.year}</div>}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#666' }}>{card.sport||'—'}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>{card.grade ? <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(229,57,53,0.1)', color: glPos ? '#22c55e' : '#e53935', fontSize: 11, fontWeight: 700 }}{card.grade}</span> : <span style={{ color: '#444', fontSize: 12 }}>{card.cond||'Raw'}</span>}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#666' }}>{fmt(buy)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>{fmt(sold)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: plPos?'#22c55e':'#e53935' }}>{plPos?<IconUp />:<IconDown />}{plPos?'+':''}{fmt(pl)}</div>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: plPos?'#22c55e':'#e53935' }}>{plPos?'+':''}{pct.toFixed(1)}%</td>
                          <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#555' }}>{card.soldDate ? new Date(card.soldDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
        <BottomNav />
        <ToastContainer />
      </div>
    </>
  )
}
