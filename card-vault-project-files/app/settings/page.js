'use client'
import { useState, useEffect, useCallback } from 'react'
import { THEMES, applyTheme, saveThemeToServer } from '@/app/components/ThemeProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const NAV = [
  { label: 'Dashboard',  href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Insights',   href: '/insights' },
  { label: 'Market',     href: '/market' },
  { label: 'PSA Lookup', href: '/psa' },
]

function IconDashboard()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> }
function IconInsights()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconMarket()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconSettings()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconShield()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function IconLogout()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconEye()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
function IconEyeOff()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> }
function IconDownload()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IconTrash()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IconCheck()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IconLink()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Insights': IconInsights, 'Market': IconMarket, 'PSA Lookup': IconShield }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

// ── Toast ─────────────────────────────────────────────────────────────────────
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
  const colors = { success: '#22c55e', error: '#ef4444', info: '#888' }
  if (!toasts.length) return null
  return (
    <div style={{ position:'fixed', bottom:88, left:'50%', transform:'translateX(-50%)', zIndex:9999, display:'flex', flexDirection:'column', gap:8, alignItems:'center', pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRadius:12, background:'#1e1e1e', border:`1px solid ${colors[t.type]}40`, boxShadow:'0 8px 28px rgba(0,0,0,0.6)', fontSize:13, fontWeight:600, color:'#f0f0f0', animation:'toastIn 0.2s ease', whiteSpace:'nowrap' }}>
          <span style={{ color:colors[t.type] }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>{t.msg}
        </div>
      ))}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ user, onLogout, cardCount = 0 }) {
  return (
    <aside style={{ width:200, minHeight:'100vh', background:'#000', borderRight:'1px solid #111', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:60 }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid #111', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src="/logo-transparent.png" alt="TopLoad" style={{ width:140, height:'auto', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV.map(({ label, href }) => {
          const Icon = navIcons[label]
          if (!Icon) return null
          return (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color:'#555', background:'transparent', fontSize:13, fontWeight:500, transition:'all 0.15s', letterSpacing:'0.01em' }}>
              <Icon />
              <span style={{flex:1}}>{label}</span>
              {label === 'Collection' && cardCount > 0 && <span style={{ fontSize:9, fontWeight:800, background:'rgba(var(--accent-rgb),0.2)', color:'var(--accent-light)', borderRadius:5, padding:'1px 6px' }}>{cardCount}</span>}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'12px 8px', borderTop:'1px solid #111' }}>
        <Link href="/settings" style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color:'var(--accent)', background:'rgba(var(--accent-rgb),0.08)', fontSize:13, fontWeight:700 }}><IconSettings /><span>Settings</span></Link>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#555', fontSize:13, fontWeight:500 }}><IconLogout /><span>Sign Out</span></button>
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', marginTop:4, borderRadius:10, background:'#111' }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'var(--accent)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff', flexShrink:0 }}>
              {user.avatar ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : user.username?.[0]?.toUpperCase()||'A'}
            </div>
            <div style={{overflow:'hidden'}}>
              <div style={{ fontSize:11, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>@{user.username}</div>
              <div style={{ fontSize:9, color:'#555', marginTop:1 }}>{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, height:76, background:'#0d0d0d', borderTop:'1px solid #1e1e1e', display:'flex', alignItems:'center', zIndex:100 }} className="mobile-only">
      {[...NAV, { label:'Settings', href:'/settings' }].slice(0,4).map(({ label, href }) => {
        const Icon = navIcons[label] || IconSettings
        const isActive = label === 'Settings'
        return <Link key={label} href={href} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, textDecoration:'none', color:isActive?'var(--accent)':'#555', fontSize:9, fontWeight:isActive?700:500, letterSpacing:'0.04em', textTransform:'uppercase', paddingBottom:4 }}><Icon />{label}</Link>
      })}
    </nav>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:16, overflow:'hidden', ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ icon, title, subtitle }) {
  return (
    <div style={{ padding:'18px 20px 0' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: subtitle ? 4 : 16 }}>
        {icon && <span style={{ fontSize:16 }}>{icon}</span>}
        <div style={{ fontSize:13, fontWeight:800, color:'#e0e0e0', letterSpacing:'-0.2px' }}>{title}</div>
      </div>
      {subtitle && <div style={{ fontSize:12, color:'#444', marginBottom:16, lineHeight:1.6 }}>{subtitle}</div>}
    </div>
  )
}

function CardBody({ children }) {
  return <div style={{ padding:'0 20px 20px' }}>{children}</div>
}

function Divider() {
  return <div style={{ height:1, background:'#1a1a1a', margin:'0 20px' }} />
}

function Row({ label, value }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom:'1px solid #1a1a1a' }}>
      <div style={{ fontSize:12, color:'#555' }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:700, color:'#ccc', fontFamily:'var(--font-geist-mono)' }}>{value}</div>
    </div>
  )
}

function Label({ children }) {
  return <div style={{ fontSize:10, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{children}</div>
}

function Input({ value, onChange, placeholder, type='text', disabled, right }) {
  return (
    <div style={{ position:'relative' }}>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{ width:'100%', padding: right ? '10px 44px 10px 14px' : '10px 14px', borderRadius:10, background:'#1a1a1a', border:'1px solid #252525', color:'#f0f0f0', fontSize:14, outline:'none', boxSizing:'border-box', opacity: disabled ? 0.5 : 1 }} />
      {right && <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>{right}</div>}
    </div>
  )
}

function PrimaryBtn({ onClick, disabled, loading, children, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'12px', borderRadius:10, background: disabled ? '#1a1a1a' : 'linear-gradient(135deg, var(--accent), var(--accent-light))', border: disabled ? '1px solid #252525' : 'none', color: disabled ? '#333' : '#fff', fontSize:14, fontWeight:800, cursor: disabled ? 'not-allowed' : 'pointer', letterSpacing:'-0.2px', transition:'opacity 0.15s', opacity: loading ? 0.7 : 1, ...style }}>
      {loading ? 'Saving…' : children}
    </button>
  )
}

function GhostBtn({ onClick, disabled, children, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'10px 16px', borderRadius:10, background:'transparent', border:'1px solid #252525', color:'#555', fontSize:13, fontWeight:700, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, ...style }}>
      {children}
    </button>
  )
}

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'profile',    label:'Profile',    emoji:'👤' },
  { id:'appearance', label:'Appearance', emoji:'🎨' },
  { id:'security',   label:'Security',   emoji:'🔒' },
  { id:'data',       label:'Data',       emoji:'💾' },
]

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [user,    setUser]    = useState(null)
  const [cards,   setCards]   = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('profile')
  const router = useRouter()

  // ── Share ──────────────────────────────────────────────────────────────────
  const [shareCopied, setShareCopied] = useState(false)
  function handleShare() {
    const url = `https://www.toploadcards.com/share/${user?.username}`
    navigator.clipboard.writeText(url).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2500) })
      .catch(() => prompt('Copy this link:', url))
  }

  // ── Username change ────────────────────────────────────────────────────────
  const [nameVal,     setNameVal]     = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError,   setNameError]   = useState('')
  const [nameSuccess, setNameSuccess] = useState(false)

  async function handleChangeName() {
    setNameError(''); setNameSuccess(false)
    const trimmed = nameVal.trim(); if (!trimmed) { setNameError('Name cannot be empty'); return }
    setNameLoading(true)
    try {
      const res  = await fetch('/api/auth/update-profile', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name: trimmed }) })
      const data = await res.json()
      if (!res.ok) { setNameError(data.error || 'Failed to update name'); return }
      setUser(u => ({ ...u, username: data.username })); setNameVal(''); setNameSuccess(true)
      showToast('Username updated!'); setTimeout(() => setNameSuccess(false), 2500)
    } catch { setNameError('Something went wrong') }
    finally { setNameLoading(false) }
  }

  // ── Password change ────────────────────────────────────────────────────────
  const [pwForm,    setPwForm]    = useState({ current:'', next:'', confirm:'' })
  const [showPw,    setShowPw]    = useState({ current:false, next:false, confirm:false })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError,   setPwError]   = useState('')

  async function handleChangePassword() {
    setPwError('')
    if (pwForm.next !== pwForm.confirm) { setPwError("New passwords don't match"); return }
    if (pwForm.next.length < 8)        { setPwError('Password must be at least 8 characters'); return }
    setPwLoading(true)
    try {
      const res  = await fetch('/api/auth/change-password', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }) })
      const data = await res.json()
      if (!res.ok) { setPwError(data.error || 'Failed to change password'); return }
      setPwForm({ current:'', next:'', confirm:'' }); showToast('Password updated!')
    } catch { setPwError('Something went wrong') }
    finally { setPwLoading(false) }
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  const [activeTheme, setActiveTheme] = useState('Purple')
  useEffect(() => { try { setActiveTheme(localStorage.getItem('topload-theme') || 'Purple') } catch {} }, [])
  function handleTheme(theme) {
    setActiveTheme(theme.name); applyTheme(theme)
    try { localStorage.setItem('topload-theme', theme.name) } catch {}
    saveThemeToServer(theme.name)
    showToast(`Theme changed to ${theme.name}`)
  }

  // ── Export / Danger ────────────────────────────────────────────────────────
  const [deleteCardsConfirm,  setDeleteCardsConfirm]  = useState('')
  const [deleteAccountConfirm,setDeleteAccountConfirm]= useState('')
  const [deleteCardsLoading,  setDeleteCardsLoading]  = useState(false)
  const [deleteAccountLoading,setDeleteAccountLoading]= useState(false)
  const [showDeleteCards,     setShowDeleteCards]      = useState(false)
  const [showDeleteAccount,   setShowDeleteAccount]    = useState(false)

  function exportCSV() {
    const headers = ['Player','Sport','Year','Card Name','Brand','Card #','Grade','Qty','Buy Price','Current Value','Sold','Sold Price','Sold Date','Notes']
    const rows = cards.map(c => [c.player,c.sport,c.year,c.name,c.brand,c.num,c.grade,c.qty,c.buy,c.val,c.sold?'Yes':'No',c.soldPrice||'',c.soldDate||'',c.notes||''])
    const csv  = [headers,...rows].map(r => r.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = `topload-${new Date().toISOString().slice(0,10)}.csv`; a.click()
    showToast(`Exported ${cards.length} cards`)
  }
  function exportJSON() {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(cards,null,2)],{type:'application/json'})); a.download = `topload-${new Date().toISOString().slice(0,10)}.json`; a.click()
    showToast(`Exported ${cards.length} cards as JSON`)
  }

  async function handleDeleteAllCards() {
    if (deleteCardsConfirm !== 'DELETE') return
    setDeleteCardsLoading(true)
    try {
      for (const card of cards) await fetch('/api/cards', { method:'DELETE', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ id: card.id }) })
      setCards([]); setShowDeleteCards(false); setDeleteCardsConfirm('')
      showToast('All cards deleted', 'error')
    } catch { showToast('Something went wrong', 'error') }
    finally { setDeleteCardsLoading(false) }
  }

  async function handleDeleteAccount() {
    if (deleteAccountConfirm !== user?.username) return
    setDeleteAccountLoading(true)
    try {
      const res = await fetch('/api/auth/delete-account', { method:'DELETE' })
      if (res.ok) router.push('/login')
      else showToast('Failed to delete account', 'error')
    } catch { showToast('Something went wrong', 'error') }
    finally { setDeleteAccountLoading(false) }
  }

  // ── Load ───────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/cards',{cache:'no-store'})])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setCards(await cardsRes.json())
    } catch {}
    finally { setLoading(false) }
  }, [router])
  useEffect(() => { load() }, [load])

  async function handleLogout() { await fetch('/api/auth/logout',{method:'POST'}); router.push('/login') }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const activeCards   = cards.filter(c => !c.sold)
  const soldCards     = cards.filter(c => c.sold)
  const totalInvested = activeCards.reduce((s,c) => s+(parseFloat(c.buy)||0)*(parseInt(c.qty)||1), 0)
  const totalValue    = activeCards.reduce((s,c) => s+(parseFloat(c.val)||parseFloat(c.buy)||0)*(parseInt(c.qty)||1), 0)
  const realizedPL    = soldCards.reduce((s,c) => s+(parseFloat(c.soldPrice)||0)-(parseFloat(c.buy)||0), 0)

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
      <img src="/logo-transparent.png" alt="" style={{ width:120, opacity:0.4, filter:'brightness(0) invert(1)', animation:'pulse 1.5s ease-in-out infinite' }} />
      <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.6}}`}</style>
    </div>
  )

  const pwReady = pwForm.current && pwForm.next && pwForm.confirm

  // ── Password input helper ──────────────────────────────────────────────────
  function PwInput({ field, placeholder }) {
    return (
      <Input
        type={showPw[field] ? 'text' : 'password'}
        value={pwForm[field]}
        onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder}
        right={
          <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
            style={{ background:'none', border:'none', color:'#555', cursor:'pointer', padding:0, display:'flex' }}>
            {showPw[field] ? <IconEyeOff /> : <IconEye />}
          </button>
        }
      />
    )
  }

  return (
    <>
      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { font-family:var(--font-geist-sans),-apple-system,sans-serif!important }
        .sidebar-el{display:flex;flex-direction:column} .mobile-only{display:none!important}
        .mob-topbar{display:none} .main-wrap{margin-left:200px;min-height:100vh;width:calc(100% - 200px)}
        input::placeholder { color:#333 }
        button:not(:disabled):active { transform:scale(0.96)!important; transition:transform 0.08s ease!important }
        @media(max-width:768px){
          .sidebar-el{display:none!important} .mobile-only{display:flex!important}
          .mob-topbar{display:flex} .main-wrap{margin-left:0!important;width:100%!important;padding-bottom:90px!important}
        }
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} cardCount={activeCards.length} /></div>

        <main className="main-wrap" style={{ padding:'32px 28px 48px' }}>
          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:32, filter:'brightness(0) invert(1)' }} />
            <div style={{ fontSize:16, fontWeight:800, color:'#f0f0f0' }}>Settings</div>
            <div style={{ width:32 }} />
          </div>

          {/* Page header */}
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', letterSpacing:'-0.8px', margin:0 }}>Settings</h1>
            <p style={{ fontSize:13, color:'#555', marginTop:4 }}>Manage your profile, appearance, and data</p>
          </div>

          {/* ── Tab bar ── */}
          <div style={{ display:'flex', gap:4, marginBottom:28, background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:12, padding:4, width:'fit-content' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight: tab===t.id ? 800 : 500, background: tab===t.id ? '#1e1e1e' : 'transparent', color: tab===t.id ? '#f0f0f0' : '#555', transition:'all 0.15s', whiteSpace:'nowrap' }}>
                <span style={{ fontSize:14 }}>{t.emoji}</span>{t.label}
              </button>
            ))}
          </div>

          <div style={{ maxWidth:560, display:'flex', flexDirection:'column', gap:16 }}>

            {/* ══════════════════════════════════════════════════════ PROFILE */}
            {tab === 'profile' && (
              <>
                {/* Profile hero */}
                <Card>
                  <div style={{ padding:'24px 20px', display:'flex', alignItems:'center', gap:20 }}>
                    {/* Avatar */}
                    <div style={{ flexShrink:0 }}>
                      <div style={{ width:80, height:80, borderRadius:'50%', background:'#1a1a1a', border:'2px solid #2a2a2a', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {user?.avatar
                          ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          : <span style={{ fontSize:32, fontWeight:900, color:'var(--accent)' }}>{user?.username?.[0]?.toUpperCase()||'?'}</span>
                        }
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>@{user?.username}</div>
                      <div style={{ fontSize:12, color:'#555', marginTop:2 }}>{user?.email}</div>
                    </div>
                  </div>
                </Card>

                {/* Collection stats */}
                {cards.length > 0 && (
                  <Card>
                    <CardHeader icon="📊" title="Collection Snapshot" />
                    <CardBody>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                        {[
                          { label:'Active Cards',    value: activeCards.length,                                                           mono:true },
                          { label:'Total Invested',  value: fmt(totalInvested),                                                           mono:true },
                          { label:'Current Value',   value: fmt(totalValue),                                                              mono:true },
                          { label:'Unrealized G/L',  value: `${totalValue-totalInvested>=0?'+':''}${fmt(totalValue-totalInvested)}`,      color: totalValue>=totalInvested?'#22c55e':'#ef4444' },
                          { label:'Cards Sold',      value: soldCards.length,                                                             mono:true },
                          { label:'Realized P&L',    value: `${realizedPL>=0?'+':''}${fmt(realizedPL)}`,                                 color: realizedPL>=0?'#22c55e':'#ef4444' },
                        ].map((s,i) => (
                          <div key={i} style={{ background:'#1a1a1a', borderRadius:10, padding:'12px 14px' }}>
                            <div style={{ fontSize:9, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5 }}>{s.label}</div>
                            <div style={{ fontFamily: s.mono ? 'var(--font-geist-mono)' : 'inherit', fontSize:13, fontWeight:700, color: s.color||'#f0f0f0' }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Share link */}
                <Card>
                  <CardHeader icon="🔗" title="Share Collection" subtitle="Your public collection link. Visitors see card values — not what you paid." />
                  <CardBody>
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#1a1a1a', border:'1px solid #252525', borderRadius:10, marginBottom:12 }}>
                      <IconLink />
                      <span style={{ flex:1, fontSize:12, color:'#666', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'var(--font-geist-mono)' }}>
                        toploadcards.com/share/{user?.username}
                      </span>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={handleShare}
                        style={{ flex:1, padding:'10px', borderRadius:10, background: shareCopied ? 'rgba(34,197,94,0.1)' : 'rgba(var(--accent-rgb),0.1)', border: shareCopied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(var(--accent-rgb),0.25)', color: shareCopied ? '#22c55e' : 'var(--accent)', fontSize:13, fontWeight:800, cursor:'pointer' }}>
                        {shareCopied ? '✓ Copied!' : '📋 Copy Link'}
                      </button>
                      <a href={`/share/${user?.username}`} target="_blank" rel="noopener noreferrer"
                        style={{ flex:1, padding:'10px', borderRadius:10, background:'#1a1a1a', border:'1px solid #252525', color:'#666', fontSize:13, fontWeight:700, cursor:'pointer', textDecoration:'none', textAlign:'center' }}>
                        👁 Preview
                      </a>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {/* ═════════════════════════════════════════════════ APPEARANCE */}
            {tab === 'appearance' && (
              <Card>
                <CardHeader icon="🎨" title="Accent Color" subtitle="Pick the highlight color used across the entire app." />
                <CardBody>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(64px, 1fr))', gap:12 }}>
                    {THEMES.map(theme => {
                      const isActive = activeTheme === theme.name
                      return (
                        <button key={theme.name} onClick={() => handleTheme(theme)}
                          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent', border: isActive ? '1px solid #2a2a2a' : '1px solid transparent', borderRadius:12, padding:'12px 8px', cursor:'pointer', transition:'all 0.15s' }}>
                          <div style={{ width:40, height:40, borderRadius:12, background: theme.accent, border: isActive ? '3px solid #fff' : '3px solid transparent', boxShadow: isActive ? `0 0 0 2px ${theme.accent}` : 'none', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                            {isActive && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <span style={{ fontSize:10, fontWeight: isActive ? 800 : 600, color: isActive ? '#fff' : '#555', textTransform:'uppercase', letterSpacing:'0.06em' }}>{theme.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* ══════════════════════════════════════════════════════ SECURITY */}
            {tab === 'security' && (
              <>
                {/* Username */}
                <Card>
                  <CardHeader icon="✏️" title="Change Username" />
                  <CardBody>
                    <div style={{ display:'flex', gap:10, padding:'8px 12px', background:'#1a1a1a', borderRadius:10, marginBottom:14, alignItems:'center' }}>
                      <span style={{ fontSize:11, color:'#444' }}>Current</span>
                      <span style={{ fontSize:13, fontWeight:700, color:'var(--accent-light)', fontFamily:'var(--font-geist-mono)' }}>@{user?.username}</span>
                    </div>
                    {nameError && <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontSize:13, marginBottom:12 }}>{nameError}</div>}
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      <div>
                        <Label>New Username</Label>
                        <Input value={nameVal} onChange={e => setNameVal(e.target.value)} placeholder="Enter new username" />
                      </div>
                      <PrimaryBtn onClick={handleChangeName} disabled={!nameVal.trim()} loading={nameLoading}>
                        {nameSuccess ? <><IconCheck /> Saved!</> : <><IconCheck /> Save Username</>}
                      </PrimaryBtn>
                    </div>
                  </CardBody>
                </Card>

                {/* Password */}
                <Card>
                  <CardHeader icon="🔑" title="Change Password" />
                  <CardBody>
                    {pwError && <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontSize:13, marginBottom:12 }}>{pwError}</div>}
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      <div>
                        <Label>Current Password</Label>
                        <PwInput field="current" placeholder="Enter current password" />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <PwInput field="next" placeholder="At least 8 characters" />
                      </div>
                      <div>
                        <Label>Confirm New Password</Label>
                        <PwInput field="confirm" placeholder="Repeat new password" />
                      </div>
                      {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                        <div style={{ fontSize:12, color:'#ef4444', display:'flex', alignItems:'center', gap:6 }}>✕ Passwords don't match</div>
                      )}
                      {pwForm.next && pwForm.next === pwForm.confirm && pwForm.next.length >= 8 && (
                        <div style={{ fontSize:12, color:'#22c55e', display:'flex', alignItems:'center', gap:6 }}>✓ Passwords match</div>
                      )}
                      <PrimaryBtn onClick={handleChangePassword} disabled={!pwReady} loading={pwLoading}>
                        <IconCheck /> Update Password
                      </PrimaryBtn>
                    </div>
                  </CardBody>
                </Card>

                {/* Sign out */}
                <Card>
                  <CardBody>
                    <div style={{ paddingTop:4 }}>
                      <GhostBtn onClick={handleLogout} style={{ width:'100%', justifyContent:'center' }}>
                        <IconLogout /> Sign Out of TopLoad
                      </GhostBtn>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {/* ═════════════════════════════════════════════════════════ DATA */}
            {tab === 'data' && (
              <>
                {/* Export */}
                <Card>
                  <CardHeader icon="💾" title="Export & Backup" subtitle={`Download a copy of your ${cards.length} card${cards.length !== 1 ? 's' : ''}.`} />
                  <CardBody>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'#1a1a1a', borderRadius:12 }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#ddd' }}>Export as CSV</div>
                          <div style={{ fontSize:11, color:'#444', marginTop:2 }}>Works with Excel, Google Sheets</div>
                        </div>
                        <button onClick={exportCSV} disabled={!cards.length}
                          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(var(--accent-rgb),0.1)', border:'1px solid rgba(var(--accent-rgb),0.25)', color:'var(--accent)', fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0, opacity: cards.length?1:0.4 }}>
                          <IconDownload /> CSV
                        </button>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'#1a1a1a', borderRadius:12 }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#ddd' }}>Export as JSON</div>
                          <div style={{ fontSize:11, color:'#444', marginTop:2 }}>Full backup with all metadata</div>
                        </div>
                        <button onClick={exportJSON} disabled={!cards.length}
                          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid #252525', color:'#777', fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0, opacity: cards.length?1:0.4 }}>
                          <IconDownload /> JSON
                        </button>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Danger zone */}
                <Card style={{ border:'1px solid rgba(239,68,68,0.2)', background:'linear-gradient(135deg,#130808,#0d0d0d)' }}>
                  <div style={{ height:2, background:'linear-gradient(90deg,#ef4444,#f87171)' }} />
                  <CardHeader icon="⚠️" title="Danger Zone" subtitle="These actions are permanent and cannot be undone." />
                  <CardBody>
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

                      {/* Delete all cards */}
                      <div style={{ border:'1px solid rgba(239,68,68,0.15)', borderRadius:12, overflow:'hidden' }}>
                        <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#ccc' }}>Delete All Cards</div>
                            <div style={{ fontSize:11, color:'#555', marginTop:2 }}>Removes all {cards.length} cards permanently</div>
                          </div>
                          <button onClick={() => setShowDeleteCards(!showDeleteCards)} disabled={!cards.length}
                            style={{ padding:'7px 14px', borderRadius:9, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, opacity: cards.length?1:0.4, whiteSpace:'nowrap' }}>
                            {showDeleteCards ? 'Cancel' : 'Delete All'}
                          </button>
                        </div>
                        {showDeleteCards && (
                          <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(239,68,68,0.1)', background:'rgba(239,68,68,0.03)' }}>
                            <div style={{ fontSize:12, color:'#ef4444', marginBottom:10 }}>Type <strong>DELETE</strong> to confirm</div>
                            <div style={{ display:'flex', gap:8 }}>
                              <input value={deleteCardsConfirm} onChange={e => setDeleteCardsConfirm(e.target.value)} placeholder="Type DELETE"
                                style={{ flex:1, padding:'9px 14px', borderRadius:10, background:'#111', border:'1px solid rgba(239,68,68,0.3)', color:'#f0f0f0', fontSize:13, outline:'none' }} />
                              <button onClick={handleDeleteAllCards} disabled={deleteCardsConfirm!=='DELETE'||deleteCardsLoading}
                                style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', borderRadius:10, background: deleteCardsConfirm==='DELETE'?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.04)', border:'1px solid rgba(239,68,68,0.3)', color: deleteCardsConfirm==='DELETE'?'#ef4444':'#444', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                                <IconTrash />{deleteCardsLoading?'…':'Confirm'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete account */}
                      <div style={{ border:'1px solid rgba(239,68,68,0.2)', borderRadius:12, overflow:'hidden' }}>
                        <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#ef4444' }}>Delete Account</div>
                            <div style={{ fontSize:11, color:'#555', marginTop:2 }}>Permanently deletes your account and all data</div>
                          </div>
                          <button onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                            style={{ padding:'7px 14px', borderRadius:9, background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.35)', color:'#ef4444', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}>
                            {showDeleteAccount ? 'Cancel' : 'Delete Account'}
                          </button>
                        </div>
                        {showDeleteAccount && (
                          <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(239,68,68,0.1)', background:'rgba(239,68,68,0.03)' }}>
                            <div style={{ fontSize:12, color:'#ef4444', marginBottom:10 }}>Type your username <strong>@{user?.username}</strong> to confirm</div>
                            <div style={{ display:'flex', gap:8 }}>
                              <input value={deleteAccountConfirm} onChange={e => setDeleteAccountConfirm(e.target.value)} placeholder={user?.username}
                                style={{ flex:1, padding:'9px 14px', borderRadius:10, background:'#111', border:'1px solid rgba(239,68,68,0.3)', color:'#f0f0f0', fontSize:13, outline:'none' }} />
                              <button onClick={handleDeleteAccount} disabled={deleteAccountConfirm!==user?.username||deleteAccountLoading}
                                style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', borderRadius:10, background: deleteAccountConfirm===user?.username?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.04)', border:'1px solid rgba(239,68,68,0.4)', color: deleteAccountConfirm===user?.username?'#ef4444':'#444', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
                                <IconTrash />{deleteAccountLoading?'…':'Confirm'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </CardBody>
                </Card>
              </>
            )}

          </div>
        </main>

        <BottomNav />
        <ToastContainer />
      </div>
    </>
  )
}
