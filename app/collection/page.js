'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Shared Nav (matches dashboard) ──────────────────────────────────────────
const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Wish List', href: '/wishlist' },
]

function IconDashboard() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
}
function IconCollection() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
}
function IconWishlist() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function IconSettings() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
function IconLogout() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
function IconClose() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function IconEdit() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function IconTrash() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
function IconUp() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}
function IconDown() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
}

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Wish List': IconWishlist }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

const SPORTS = ['Baseball', 'Basketball', 'Football', 'Soccer', 'Hockey', 'Tennis', 'Golf', 'Other']
const CONDS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Poor']
const EMPTY = { sport: '', year: '', player: '', name: '', brand: '', num: '', cond: '', grade: '', qty: '1', date: '', buy: '', val: '', notes: '' }

function Sidebar({ user, onLogout }) {
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#0b0e1c', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 60 }}>
      <div style={{ padding: '26px 22px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#f0f2ff' }}>Top</span><span style={{ color: 'var(--cyan)' }}>Load</span>
        </div>
        <div style={{ fontSize: 10, color: '#3a4465', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>Card Investment Tracker</div>
      </div>
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: 10, color: '#2e3759', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Menu</div>
        {NAV.map(({ label, href }) => {
          const active = typeof window !== 'undefined' && window.location.pathname === href
          const Icon = navIcons[label]
          return (
            <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: active ? 'var(--cyan)' : '#6a75a0', background: active ? 'rgba(6,214,214,0.08)' : 'transparent', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: active ? 600 : 500, borderLeft: active ? '2px solid var(--cyan)' : '2px solid transparent', transition: 'all 0.15s' }}>
              <Icon />{label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {user && <div style={{ padding: '10px 12px', marginBottom: 4, borderRadius: 10, background: 'rgba(255,255,255,0.03)', fontFamily: "'Outfit',sans-serif" }}><div style={{ fontSize: 12, fontWeight: 700, color: '#c0c8e8' }}>@{user.username}</div><div style={{ fontSize: 11, color: '#3a4465', marginTop: 1 }}>{user.email}</div></div>}
        <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconSettings />Settings</Link>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconLogout />Sign Out</button>
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: '#0b0e1c', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', zIndex: 100 }}>
      {NAV.map(({ label, href }) => {
        const active = typeof window !== 'undefined' && window.location.pathname === href
        const Icon = navIcons[label]
        return (
          <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: active ? 'var(--cyan)' : '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: 4 }}>
            <Icon />{label}
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Card Form Modal ──────────────────────────────────────────────────────────
function CardModal({ card, onClose, onSave }) {
  const [form, setForm] = useState(card || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.player) { setError('Player name is required'); return }
    setSaving(true)
    setError('')
    try {
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch('/api/cards', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to save'); setSaving(false); return }
      onSave()
    } catch { setError('Something went wrong'); setSaving(false) }
  }

  const field = (label, key, type = 'text', opts = null) => (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4a5578', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: form[key] ? 'var(--text)' : '#4a5578', fontSize: 14, outline: 'none' }}>
          <option value="">Select...</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
      )}
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>{form.id ? 'Edit Card' : 'Add Card'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5578', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        {error && <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,122,0.1)', color: 'var(--coral)', fontSize: 13, border: '1px solid rgba(255,107,122,0.2)' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>{field('Player Name *', 'player')}</div>
          {field('Sport', 'sport', 'text', SPORTS)}
          {field('Year', 'year')}
          {field('Card Name / Set', 'name')}
          {field('Brand', 'brand')}
          {field('Card Number', 'num')}
          {field('Condition', 'cond', 'text', CONDS)}
          {field('PSA Grade', 'grade')}
          {field('Quantity', 'qty', 'number')}
          {field('Purchase Date', 'date', 'date')}
          {field('Buy Price ($)', 'buy', 'number')}
          {field('Current Value ($)', 'val', 'number')}
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4a5578', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: "'Outfit',sans-serif" }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'linear-gradient(135deg,var(--cyan),var(--cyan2))', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save Card'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | card object
  const [search, setSearch] = useState('')
  const [filterSport, setFilterSport] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/cards')])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setCards(await cardsRes.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  async function handleDelete(id) {
    await fetch('/api/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setDeleteId(null)
    load()
  }

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || (c.player || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q) || (c.brand || '').toLowerCase().includes(q)
    const matchSport = !filterSport || c.sport === filterSport
    return matchSearch && matchSport
  })

  const totalInvested = filtered.reduce((s, c) => s + (parseFloat(c.buy) || 0) * (parseInt(c.qty) || 1), 0)
  const totalValue = filtered.reduce((s, c) => s + (parseFloat(c.val) || parseFloat(c.buy) || 0) * (parseInt(c.qty) || 1), 0)

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div style={{ color: '#3a4465', fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>Loading...</div></div>

  return (
    <>
      <style>{`
        .sidebar-el { display:flex; flex-direction:column; }
        .mobile-only { display:none !important; }
        .mob-topbar  { display:none; }
        .main-wrap   { margin-left:220px; min-height:100vh; width:calc(100% - 220px); }
        .card-row:hover { background:rgba(255,255,255,0.02) !important; }
        @media(max-width:768px){
          .sidebar-el { display:none !important; }
          .mobile-only{ display:flex !important; }
          .mob-topbar { display:flex; }
          .main-wrap  { margin-left:0 !important; width:100% !important; padding-bottom:80px !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} /></div>

        <main className="main-wrap" style={{ padding: '30px 28px' }}>
          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800 }}><span style={{ color: '#f0f2ff' }}>Top</span><span style={{ color: 'var(--cyan)' }}>Load</span></span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><IconLogout />Sign Out</button>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.5px', margin: 0 }}>Collection</h1>
              <p style={{ fontSize: 13, color: '#4a5578', marginTop: 4, fontWeight: 500 }}>{cards.length} card{cards.length !== 1 ? 's' : ''} · {fmt(totalValue)} total value</p>
            </div>
            <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'rgba(6,214,214,0.08)', border: '1px solid rgba(6,214,214,0.25)', borderRadius: 10, color: 'var(--cyan)', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add Card</button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player, set, brand..." style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <select value={filterSport} onChange={e => setFilterSport(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', color: filterSport ? 'var(--text)' : '#4a5578', fontSize: 14, outline: 'none' }}>
              <option value="">All Sports</option>
              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Summary bar */}
          {filtered.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Cards', value: filtered.length },
                { label: 'Invested', value: fmt(totalInvested) },
                { label: 'Value', value: fmt(totalValue) },
                { label: 'G/L', value: `${totalValue - totalInvested >= 0 ? '+' : ''}${fmt(totalValue - totalInvested)}`, color: totalValue >= totalInvested ? '#22d3a7' : '#ff6b7a' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: '#3a4465', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: color || '#f0f2ff' }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>🃏</div>
              <p style={{ color: '#3a4465', fontFamily: "'Outfit',sans-serif", fontSize: 14, marginBottom: 16 }}>{search || filterSport ? 'No cards match your search' : "You haven't added any cards yet"}</p>
              {!search && !filterSport && <button onClick={() => setModal('add')} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(6,214,214,0.08)', border: '1px solid rgba(6,214,214,0.25)', color: 'var(--cyan)', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Add Your First Card</button>}
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg,#131929,#0f1521)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Player', 'Sport', 'Year', 'Grade', 'Qty', 'Buy Price', 'Current Value', 'G/L', ''].map((h, i) => (
                        <th key={i} style={{ padding: '11px 14px', textAlign: i === 0 ? 'left' : 'right', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: '#2e3759', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(card => {
                      const qty = parseInt(card.qty) || 1
                      const buy = (parseFloat(card.buy) || 0) * qty
                      const val = (parseFloat(card.val) || parseFloat(card.buy) || 0) * qty
                      const gl = val - buy
                      const glPos = gl >= 0
                      return (
                        <tr key={card.id} className="card-row" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#c0c8e8' }}>{card.player}</div>
                            {card.name && <div style={{ fontSize: 11, color: '#3a4465', marginTop: 1 }}>{card.name}</div>}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#6a75a0' }}>{card.sport || '—'}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#6a75a0' }}>{card.year || '—'}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            {card.grade ? <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(6,214,214,0.1)', color: 'var(--cyan)', fontSize: 11, fontWeight: 700 }}>PSA {card.grade}</span> : <span style={{ color: '#3a4465', fontSize: 12 }}>{card.cond || '—'}</span>}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#6a75a0' }}>{qty}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#6a75a0' }}>{fmt(buy)}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: '#f0f2ff' }}>{fmt(val)}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: glPos ? '#22d3a7' : '#ff6b7a' }}>
                              {glPos ? <IconUp /> : <IconDown />}{glPos ? '+' : ''}{fmt(gl)}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button onClick={() => setModal(card)} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#6a75a0', cursor: 'pointer' }}><IconEdit /></button>
                              <button onClick={() => setDeleteId(card.id)} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,107,122,0.08)', border: 'none', color: '#ff6b7a', cursor: 'pointer' }}><IconTrash /></button>
                            </div>
                          </td>
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
      </div>

      {/* Add/Edit Modal */}
      {modal && <CardModal card={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load() }} />}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', marginBottom: 8 }}>Delete this card?</h3>
            <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'rgba(255,107,122,0.15)', border: '1px solid rgba(255,107,122,0.3)', color: '#ff6b7a', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
