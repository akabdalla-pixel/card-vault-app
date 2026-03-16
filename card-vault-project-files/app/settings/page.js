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
  { label: 'Market', href: '/market' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconEye() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
function IconEyeOff() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> }
function IconDownload() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IconTrash() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IconAlert() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function IconCheck() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Insights': IconInsights, 'Sold History': IconSold }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

var _toastFn = null
function showToast(msg, type = 'success') { if (_toastFn) _toastFn(msg, type) }
function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    _toastFn = (msg, type) => {
      const id = Date.now()
      setToasts(prev => [...prev.slice(-2), { id, msg, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
    }
    return () => { _toastFn = null }
  }, [])
  const colors = { success: '#4ade80', error: '#9333ea', info: '#888' }
  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  if (!toasts.length) return null
  return (
    <div style={{ position:'fixed', bottom:88, left:'50%', transform:'translateX(-50%)', zIndex:9999, display:'flex', flexDirection:'column', gap:8, alignItems:'center', pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRadius:12, background:'#1e1e1e', border:`1px solid ${colors[t.type]}50`, boxShadow:'0 8px 28px rgba(0,0,0,0.6)', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, color:'#f0f0f0', animation:'toastIn 0.2s ease', whiteSpace:'nowrap' }}>
          <span style={{ color:colors[t.type] }}>{icons[t.type]}</span>{t.msg}
        </div>
      ))}
    </div>
  )
}

function Sidebar({ user, onLogout, cardCount = 0 }) {
  return (
    <aside style={{ width:220, minHeight:'100vh', background:'#111111', borderRight:'1px solid #2a2a2a', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:60 }}>
      <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={LOGO} alt="TopLoad" style={{ width:130, height:'auto', objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(147,51,234,0.4))' }} />
      </div>
      <nav style={{ flex:1, padding:'14px 10px' }}>
        <div style={{ fontSize:10, color:'#333', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0 12px', marginBottom:8 }}>Menu</div>
        {NAV.map(({ label, href }) => {
          const Icon = navIcons[label]
          return <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color:'#666', background:'transparent', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:500, borderLeft:'2px solid transparent', transition:'all 0.15s' }}><Icon /><span style={{flex:1}}>{label}</span>{label==='Collection'&&cardCount>0&&<span style={{fontSize:10,fontWeight:700,background:'rgba(147,51,234,0.15)',color:'#9333ea',borderRadius:6,padding:'1px 6px',fontFamily:"'JetBrains Mono',monospace"}}>{cardCount}</span>}</Link>
        })}
      </nav>
      <div style={{ padding:'14px 10px', borderTop:'1px solid #1e1e1e' }}>
                {user && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', marginBottom:4, borderRadius:10, background:'#181818', fontFamily:"'Outfit',sans-serif" }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#9333ea', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff', flexShrink:0 }}>{user.username?.[0]?.toUpperCase()||'A'}</div>
          <div><div style={{ fontSize:11, fontWeight:700, color:'#ccc' }}>@{user.username}</div><div style={{ fontSize:9, color:'#555', marginTop:1 }}>{user.email}</div></div>
        </div>}
        <Link href="/settings" style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color:'#9333ea', background:'rgba(147,51,234,0.08)', borderLeft:'2px solid #9333ea', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:600 }}><IconSettings />Settings</Link>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 12px', borderRadius:10, width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#555', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:500 }}><IconLogout />Sign Out</button>
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, height:64, background:'#0d0d0d', borderTop:'1px solid #1e1e1e', display:'flex', alignItems:'center', zIndex:100 }} className="mobile-only">
      {[...NAV, { label:'Settings', href:'/settings' }].slice(0,4).map(({ label, href }) => {
        const Icon = navIcons[label] || IconSettings
        const isActive = label === 'Settings'
        return <Link key={label} href={href} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, textDecoration:'none', color:isActive?'#9333ea':'#555', fontFamily:"'Outfit',sans-serif", fontSize:9, fontWeight:isActive?700:500, letterSpacing:'0.04em', textTransform:'uppercase', paddingBottom:4 }}><Icon />{label==='Sold History'?'Sold':label}</Link>
      })}
    </nav>
  )
}

// ── Section Card ──────────────────────────────────────────────
function Section({ title, subtitle, icon, children, danger = false }) {
  return (
    <div style={{ background: danger ? 'linear-gradient(135deg,#1a0808,#0d0d0d)' : 'linear-gradient(135deg,#111,#0d0d0d)', border: `1px solid ${danger ? 'rgba(147,51,234,0.25)' : '#1e1e1e'}`, borderRadius:14, padding:22, position:'relative', overflow:'hidden' }}>
      {danger && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#9333ea,#a855f7)' }} />}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        {icon && <span style={{ fontSize:18 }}>{icon}</span>}
        <div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, color: danger ? '#a855f7' : '#ccc', margin:0 }}>{title}</h2>
          {subtitle && <p style={{ fontSize:12, color:'#444', margin:'3px 0 0', fontFamily:"'Outfit',sans-serif" }}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Change password
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')

  // Danger zone
  const [deleteCardsConfirm, setDeleteCardsConfirm] = useState('')
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState('')
  const [deleteCardsLoading, setDeleteCardsLoading] = useState(false)
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)
  const [showDeleteCards, setShowDeleteCards] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/cards', { cache: 'no-store' })
      ])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setCards(await cardsRes.json())
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError('')
    if (pwForm.next !== pwForm.confirm) { setPwError('New passwords do not match'); return }
    if (pwForm.next.length < 8) { setPwError('Password must be at least 8 characters'); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next })
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.error || 'Failed to change password'); return }
      setPwForm({ current: '', next: '', confirm: '' })
      showToast('Password updated!', 'success')
    } catch { setPwError('Something went wrong') }
    finally { setPwLoading(false) }
  }

  function exportCSV() {
    const headers = ['Player','Sport','Year','Card Name','Brand','Card #','Condition','Grade','Qty','Buy Price','Current Value','Sold','Sold Price','Sold Date','Notes']
    const rows = cards.map(c => [c.player,c.sport,c.year,c.name,c.brand,c.num,c.cond,c.grade,c.qty,c.buy,c.val,c.sold?'Yes':'No',c.soldPrice||'',c.soldDate||'',c.notes||''])
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `topload-backup-${new Date().toISOString().slice(0,10)}.csv`; a.click()
    URL.revokeObjectURL(url)
    showToast(`Exported ${cards.length} cards`, 'success')
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `topload-backup-${new Date().toISOString().slice(0,10)}.json`; a.click()
    URL.revokeObjectURL(url)
    showToast(`Exported ${cards.length} cards as JSON`, 'success')
  }

  async function handleDeleteAllCards() {
    if (deleteCardsConfirm !== 'DELETE') return
    setDeleteCardsLoading(true)
    try {
      for (const card of cards) {
        await fetch('/api/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: card.id }) })
      }
      setCards([])
      setShowDeleteCards(false)
      setDeleteCardsConfirm('')
      showToast('All cards deleted', 'error')
    } catch { showToast('Something went wrong', 'error') }
    finally { setDeleteCardsLoading(false) }
  }

  async function handleDeleteAccount() {
    if (deleteAccountConfirm !== user?.username) return
    setDeleteAccountLoading(true)
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })
      if (res.ok) { router.push('/login') }
      else { showToast('Failed to delete account', 'error') }
    } catch { showToast('Something went wrong', 'error') }
    finally { setDeleteAccountLoading(false) }
  }

  // Stats
  const activeCards = cards.filter(c => !c.sold)
  const soldCards = cards.filter(c => c.sold)
  const totalInvested = activeCards.reduce((s,c) => s+(parseFloat(c.buy)||0)*(parseInt(c.qty)||1), 0)
  const totalValue = activeCards.reduce((s,c) => s+(parseFloat(c.val)||parseFloat(c.buy)||0)*(parseInt(c.qty)||1), 0)
  const realizedPL = soldCards.reduce((s,c) => s+(parseFloat(c.soldPrice)||0)-(parseFloat(c.buy)||0), 0)

  if (loading) return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
      <div className="sidebar-el" style={{ width:220, minHeight:'100vh', background:'#111111', borderRight:'1px solid #2a2a2a', flexShrink:0 }} />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={LOGO} alt="TopLoad" style={{ width:100, opacity:0.3, filter:'drop-shadow(0 0 8px rgba(147,51,234,0.4))' }} />
      </div>
    </div>
  )

  const pwInput = (key, placeholder) => (
    <div style={{ position:'relative' }}>
      <input
        type={showPw[key] ? 'text' : 'password'}
        placeholder={placeholder}
        value={pwForm[key]}
        onChange={e => setPwForm(p => ({...p, [key]: e.target.value}))}
        style={{ width:'100%', padding:'10px 40px 10px 14px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:"'Outfit',sans-serif", boxSizing:'border-box' }}
      />
      <button type="button" onClick={() => setShowPw(p => ({...p, [key]: !p[key]}))} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#555', cursor:'pointer', padding:0, display:'flex' }}>
        {showPw[key] ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:220px;min-height:100vh;width:calc(100% - 220px)}
        button:not(:disabled):active{transform:scale(0.94)!important;opacity:0.85!important;transition:transform 0.1s ease,opacity 0.1s ease!important}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding-bottom:80px!important}}
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} cardCount={activeCards.length} /></div>

        <main className="main-wrap" style={{ padding:'30px 28px' }}>
          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:32, filter:'drop-shadow(0 0 8px rgba(147,51,234,0.4))' }} />
            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:800, color:'#f0f0f0' }}>Settings</div>
            <div style={{ width:32 }} />
          </div>

          {/* Header */}
          <div style={{ marginBottom:28 }} className="hide-mobile">
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:24, fontWeight:800, color:'#f0f0f0', letterSpacing:'-0.5px', margin:0 }}>Settings</h1>
            <p style={{ fontSize:13, color:'#555', marginTop:4 }}>Manage your account and data</p>
          </div>

          <div style={{ maxWidth:560, display:'flex', flexDirection:'column', gap:18 }}>

            {/* ── Account Info ── */}
            <Section title="Account" subtitle="Your account details" icon="👤">
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[['Username', `@${user?.username}`], ['Email', user?.email]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4, fontFamily:"'Outfit',sans-serif" }}>{label}</div>
                    <div style={{ padding:'10px 14px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', fontFamily:"'Outfit',sans-serif", fontSize:14, color:'#888' }}>{val}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Collection Snapshot ── */}
            {cards.length > 0 && (
              <Section title="Collection Snapshot" icon="📊">
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {[
                    { label:'Active Cards', value: activeCards.length },
                    { label:'Total Invested', value: fmt(totalInvested) },
                    { label:'Current Value', value: fmt(totalValue) },
                    { label:'Unrealized G/L', value: `${totalValue-totalInvested>=0?'+':''}${fmt(totalValue-totalInvested)}`, color: totalValue>=totalInvested?'#4ade80':'#f87171' },
                    { label:'Cards Sold', value: soldCards.length },
                    { label:'Realized P&L', value: `${realizedPL>=0?'+':''}${fmt(realizedPL)}`, color: realizedPL>=0?'#4ade80':'#f87171' },
                  ].map((s,i) => (
                    <div key={i} style={{ background:'#1a1a1a', borderRadius:10, padding:'12px 14px', animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
                      <div style={{ fontSize:9, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4, fontFamily:"'Outfit',sans-serif" }}>{s.label}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:s.color||'#f0f0f0' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Change Password ── */}
            <Section title="Change Password" subtitle="Update your login password" icon="🔒">
              <form onSubmit={handleChangePassword} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {pwError && <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(147,51,234,0.08)', border:'1px solid rgba(147,51,234,0.2)', color:'#9333ea', fontSize:13, fontFamily:"'Outfit',sans-serif" }}>{pwError}</div>}
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>Current Password</div>
                  {pwInput('current', 'Enter current password')}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>New Password</div>
                  {pwInput('next', 'At least 8 characters')}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>Confirm New Password</div>
                  {pwInput('confirm', 'Repeat new password')}
                </div>
                <button type="submit" disabled={pwLoading || !pwForm.current || !pwForm.next || !pwForm.confirm} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 20px', borderRadius:10, background:'rgba(147,51,234,0.1)', border:'1px solid rgba(147,51,234,0.3)', color:'#9333ea', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer', opacity: (!pwForm.current||!pwForm.next||!pwForm.confirm) ? 0.4 : 1 }}>
                  {pwLoading ? 'Updating...' : <><IconCheck />Update Password</>}
                </button>
              </form>
            </Section>

            {/* ── Export & Backup ── */}
            <Section title="Export & Backup" subtitle="Download a copy of your collection data" icon="💾">
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ padding:'14px 16px', background:'#1a1a1a', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, color:'#ccc' }}>Export as CSV</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:'#555', marginTop:2 }}>Compatible with Excel, Google Sheets, and import back into TopLoad</div>
                  </div>
                  <button onClick={exportCSV} disabled={!cards.length} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(147,51,234,0.08)', border:'1px solid rgba(147,51,234,0.2)', color:'#9333ea', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0, opacity:cards.length?1:0.4 }}>
                    <IconDownload />CSV
                  </button>
                </div>
                <div style={{ padding:'14px 16px', background:'#1a1a1a', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, color:'#ccc' }}>Export as JSON</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:'#555', marginTop:2 }}>Full data backup including all fields and metadata</div>
                  </div>
                  <button onClick={exportJSON} disabled={!cards.length} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid #2a2a2a', color:'#888', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0, opacity:cards.length?1:0.4 }}>
                    <IconDownload />JSON
                  </button>
                </div>
                <div style={{ fontSize:11, color:'#444', fontFamily:"'Outfit',sans-serif", textAlign:'center' }}>
                  {cards.length} card{cards.length!==1?'s':''} in your collection
                </div>
              </div>
            </Section>

            {/* ── Danger Zone ── */}
            <Section title="Danger Zone" subtitle="These actions are permanent and cannot be undone" icon="⚠️" danger>

              {/* Delete All Cards */}
              <div style={{ borderRadius:12, border:'1px solid rgba(147,51,234,0.2)', overflow:'hidden', marginBottom:12 }}>
                <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, color:'#ccc' }}>Delete All Cards</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:'#555', marginTop:2 }}>Permanently removes all {cards.length} cards from your collection</div>
                  </div>
                  <button onClick={() => setShowDeleteCards(!showDeleteCards)} disabled={!cards.length} style={{ padding:'8px 14px', borderRadius:10, background:'rgba(147,51,234,0.08)', border:'1px solid rgba(147,51,234,0.25)', color:'#9333ea', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0, opacity:cards.length?1:0.4 }}>
                    {showDeleteCards ? 'Cancel' : 'Delete All'}
                  </button>
                </div>
                {showDeleteCards && (
                  <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(147,51,234,0.15)', background:'rgba(147,51,234,0.04)' }}>
                    <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'#9333ea', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                      <IconAlert />Type <strong>DELETE</strong> to confirm
                    </p>
                    <div style={{ display:'flex', gap:10 }}>
                      <input
                        value={deleteCardsConfirm}
                        onChange={e => setDeleteCardsConfirm(e.target.value)}
                        placeholder="Type DELETE"
                        style={{ flex:1, padding:'9px 14px', borderRadius:10, background:'#111', border:'1px solid rgba(147,51,234,0.3)', color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:"'Outfit',sans-serif" }}
                      />
                      <button onClick={handleDeleteAllCards} disabled={deleteCardsConfirm!=='DELETE'||deleteCardsLoading} style={{ padding:'9px 16px', borderRadius:10, background: deleteCardsConfirm==='DELETE' ? 'rgba(147,51,234,0.15)' : 'rgba(255,255,255,0.04)', border:'1px solid rgba(147,51,234,0.3)', color: deleteCardsConfirm==='DELETE' ? '#9333ea' : '#444', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                        {deleteCardsLoading ? 'Deleting...' : <><IconTrash />Confirm</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delete Account */}
              <div style={{ borderRadius:12, border:'1px solid rgba(147,51,234,0.2)', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, color:'#9333ea' }}>Delete Account</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:'#555', marginTop:2 }}>Permanently deletes your account and all data. Cannot be undone.</div>
                  </div>
                  <button onClick={() => setShowDeleteAccount(!showDeleteAccount)} style={{ padding:'8px 14px', borderRadius:10, background:'rgba(147,51,234,0.15)', border:'1px solid rgba(147,51,234,0.4)', color:'#9333ea', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                    {showDeleteAccount ? 'Cancel' : 'Delete Account'}
                  </button>
                </div>
                {showDeleteAccount && (
                  <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(147,51,234,0.15)', background:'rgba(147,51,234,0.04)' }}>
                    <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'#9333ea', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                      <IconAlert />Type your username <strong>@{user?.username}</strong> to confirm
                    </p>
                    <div style={{ display:'flex', gap:10 }}>
                      <input
                        value={deleteAccountConfirm}
                        onChange={e => setDeleteAccountConfirm(e.target.value)}
                        placeholder={user?.username}
                        style={{ flex:1, padding:'9px 14px', borderRadius:10, background:'#111', border:'1px solid rgba(147,51,234,0.3)', color:'#f0f0f0', fontSize:14, outline:'none', fontFamily:"'Outfit',sans-serif" }}
                      />
                      <button onClick={handleDeleteAccount} disabled={deleteAccountConfirm!==user?.username||deleteAccountLoading} style={{ padding:'9px 16px', borderRadius:10, background: deleteAccountConfirm===user?.username ? 'rgba(147,51,234,0.2)' : 'rgba(255,255,255,0.04)', border:'1px solid rgba(147,51,234,0.4)', color: deleteAccountConfirm===user?.username ? '#9333ea' : '#444', fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                        {deleteAccountLoading ? 'Deleting...' : <><IconTrash />Confirm</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </Section>

            {/* Sign Out */}
            <div style={{ paddingBottom:8 }}>
              <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid #2a2a2a', color:'#555', fontFamily:"'Outfit',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer' }}>
                <IconLogout />Sign Out
              </button>
            </div>

          </div>
        </main>
        <BottomNav />
        <ToastContainer />
      </div>
    </>
  )
}
