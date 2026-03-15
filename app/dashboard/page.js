'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)
const IconCollection = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
)
const IconWishlist = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const IconDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

function computeStats(cards) {
  const totalCards = cards.reduce((s, c) => s + (parseInt(c.qty) || 1), 0)
  const totalInvested = cards.reduce((s, c) => s + (parseFloat(c.buy) || 0) * (parseInt(c.qty) || 1), 0)
  const currentValue = cards.reduce((s, c) => s + (parseFloat(c.val) || parseFloat(c.buy) || 0) * (parseInt(c.qty) || 1), 0)
  const gainLoss = currentValue - totalInvested
  const portfolioReturn = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0

  let bestCard = null
  let bestPct = -Infinity
  cards.forEach(c => {
    const b = parseFloat(c.buy) || 0
    const v = parseFloat(c.val) || b
    if (b > 0) {
      const pct = ((v - b) / b) * 100
      if (pct > bestPct) { bestPct = pct; bestCard = c }
    }
  })

  const bySport = {}
  cards.forEach(c => {
    const sport = c.sport || 'Other'
    const qty = parseInt(c.qty) || 1
    if (!bySport[sport]) bySport[sport] = { cards: 0, invested: 0, value: 0 }
    bySport[sport].cards += qty
    bySport[sport].invested += (parseFloat(c.buy) || 0) * qty
    bySport[sport].value += (parseFloat(c.val) || parseFloat(c.buy) || 0) * qty
  })

  const topCards = [...cards]
    .sort((a, b) => {
      const va = (parseFloat(a.val) || parseFloat(a.buy) || 0) * (parseInt(a.qty) || 1)
      const vb = (parseFloat(b.val) || parseFloat(b.buy) || 0) * (parseInt(b.qty) || 1)
      return vb - va
    })
    .slice(0, 6)

  return { totalCards, totalInvested, currentValue, gainLoss, portfolioReturn, bestCard, bestPct, bySport, topCards }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: IconDashboard },
  { label: 'Collection', href: '/collection', icon: IconCollection },
  { label: 'Wish List', href: '/wishlist', icon: IconWishlist },
]

function Sidebar({ user, onLogout }) {
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0b0e1c',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 60,
    }}>
      {/* Logo */}
      <div style={{ padding: '26px 22px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#f0f2ff' }}>Top</span>
          <span style={{ color: 'var(--cyan)' }}>Load</span>
        </div>
        <div style={{ fontSize: 10, color: '#3a4465', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>
          Card Investment Tracker
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: 10, color: '#2e3759', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>
          Menu
        </div>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = typeof window !== 'undefined' && window.location.pathname === href
          return (
            <Link key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none',
              color: active ? 'var(--cyan)' : '#6a75a0',
              background: active ? 'rgba(6,214,214,0.08)' : 'transparent',
              fontFamily: "'Outfit', sans-serif", fontSize: 14,
              fontWeight: active ? 600 : 500,
              borderLeft: active ? '2px solid var(--cyan)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              <Icon />{label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {user && (
          <div style={{
            padding: '10px 12px', marginBottom: 4, borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            fontFamily: "'Outfit', sans-serif",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#c0c8e8' }}>@{user.username}</div>
            <div style={{ fontSize: 11, color: '#3a4465', marginTop: 1 }}>{user.email}</div>
          </div>
        )}
        <Link href="/settings" style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: '9px 12px', borderRadius: 10, marginBottom: 2,
          textDecoration: 'none', color: '#4a5578',
          fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
        }}>
          <IconSettings />Settings
        </Link>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: '9px 12px', borderRadius: 10, width: '100%',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#4a5578', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
        }}>
          <IconLogout />Sign Out
        </button>
      </div>
    </aside>
  )
}

// ─── Bottom Nav (mobile) ──────────────────────────────────────────────────────
function BottomNav() {
  return (
    <nav className="mobile-only" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
      background: '#0b0e1c', borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', zIndex: 100,
    }}>
      {NAV.map(({ label, href, icon: Icon }) => {
        const active = typeof window !== 'undefined' && window.location.pathname === href
        return (
          <Link key={label} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
            textDecoration: 'none',
            color: active ? 'var(--cyan)' : '#4a5578',
            fontFamily: "'Outfit', sans-serif", fontSize: 10,
            fontWeight: active ? 700 : 500,
            letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: 4,
          }}>
            <Icon />{label}
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, positive, glowColor }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #131929 0%, #0f1521 100%)',
      border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14,
      padding: '18px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -10, right: -10, width: 80, height: 80,
        background: glowColor || 'rgba(6,214,214,0.06)',
        borderRadius: '50%', filter: 'blur(28px)', pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: '#3a4465', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 24,
        fontWeight: 700, color: '#f0f2ff', letterSpacing: '-0.5px', lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, marginTop: 8,
          fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600,
          color: positive === true ? '#22d3a7' : positive === false ? '#ff6b7a' : '#4a5578',
        }}>
          {positive === true && <IconUp />}
          {positive === false && <IconDown />}
          {sub}
        </div>
      )}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/cards'),
      ])
      if (!meRes.ok) { router.push('/login'); return }
      const meData = await meRes.json()
      setUser(meData.user)
      if (cardsRes.ok) {
        const cardsData = await cardsRes.json()
        setCards(Array.isArray(cardsData) ? cardsData : [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", color: '#3a4465', fontSize: 14 }}>Loading...</div>
      </div>
    )
  }

  const s = computeStats(cards)
  const gainPos = s.gainLoss >= 0
  const retPos = s.portfolioReturn >= 0

  return (
    <>
      <style>{`
        .sidebar-wrap { display: flex; }
        .sidebar-el   { display: flex; flex-direction: column; }
        .mobile-only  { display: none !important; }
        .mob-topbar   { display: none; }
        .main-wrap    { margin-left: 220px; min-height: 100vh; width: calc(100% - 220px); }

        .stat-row1    { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .stat-row2    { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 14px; }
        .body-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 22px; }
        .top-card-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

        .panel        { background: linear-gradient(135deg, #131929, #0f1521); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; }
        .panel-head   { padding: 16px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
        .panel-head h2{ font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; color: #c0c8e8; letter-spacing: 0.02em; margin: 0; }
        .tbl          { width: 100%; border-collapse: collapse; }
        .tbl th       { padding: 9px 16px; font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 700; color: #2e3759; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
        .tbl td       { padding: 11px 16px; border-top: 1px solid rgba(255,255,255,0.04); }
        .tbl tr:hover td { background: rgba(255,255,255,0.02); }
        .ccard        { background: #0c0f1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 13px; cursor: pointer; transition: all 0.18s; }
        .ccard:hover  { border-color: rgba(6,214,214,0.3); transform: translateY(-2px); }
        .add-btn      { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: rgba(6,214,214,0.08); border: 1px solid rgba(6,214,214,0.25); border-radius: 10px; color: var(--cyan); font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
        .add-btn:hover{ background: rgba(6,214,214,0.15); }

        @media (max-width: 1100px) {
          .stat-row1  { grid-template-columns: repeat(2, 1fr); }
          .stat-row2  { grid-template-columns: repeat(2, 1fr); }
          .body-grid  { grid-template-columns: 1fr; }
          .top-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .sidebar-el { display: none !important; }
          .mobile-only{ display: flex !important; }
          .mob-topbar { display: flex; }
          .main-wrap  { margin-left: 0 !important; width: 100% !important; padding-bottom: 80px !important; }
        }
        @media (max-width: 520px) {
          .stat-row1  { grid-template-columns: 1fr; }
          .stat-row2  { grid-template-columns: 1fr; }
          .top-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Sidebar */}
        <div className="sidebar-el">
          <Sidebar user={user} onLogout={handleLogout} />
        </div>

        {/* Main */}
        <main className="main-wrap" style={{ padding: '30px 28px 30px' }}>

          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800 }}>
              <span style={{ color: '#f0f2ff' }}>Top</span>
              <span style={{ color: 'var(--cyan)' }}>Load</span>
            </span>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: '#6a75a0', fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <IconLogout />Sign Out
            </button>
          </div>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
            <div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.5px', margin: 0 }}>
                Portfolio Overview
              </h1>
              <p style={{ fontSize: 13, color: '#4a5578', marginTop: 4, fontWeight: 500 }}>
                {cards.length === 0
                  ? "You haven't added any cards yet — start building your collection"
                  : `Tracking ${s.totalCards} card${s.totalCards !== 1 ? 's' : ''} across your portfolio`}
              </p>
            </div>
            <Link href="/collection" className="add-btn">
              <IconPlus /> Add Card
            </Link>
          </div>

          {/* Stats Row 1 */}
          <div className="stat-row1">
            <StatCard label="Total Cards" value={s.totalCards} />
            <StatCard label="Total Invested" value={fmt(s.totalInvested)} />
            <StatCard label="Current Value" value={fmt(s.currentValue)} />
          </div>

          {/* Stats Row 2 */}
          <div className="stat-row2">
            <StatCard
              label="Gain / Loss"
              value={`${gainPos ? '+' : ''}${fmt(s.gainLoss)}`}
              sub={s.totalInvested > 0 ? `${gainPos ? '+' : ''}${s.portfolioReturn.toFixed(1)}% overall` : 'No investment data'}
              positive={s.totalInvested > 0 ? gainPos : undefined}
              glowColor={gainPos ? 'rgba(34,211,167,0.07)' : 'rgba(255,107,122,0.07)'}
            />
            <StatCard
              label="Portfolio Return"
              value={`${retPos ? '+' : ''}${s.portfolioReturn.toFixed(1)}%`}
              sub={s.totalInvested > 0 ? (retPos ? 'Performing above cost' : 'Below cost basis') : 'No investment data'}
              positive={s.totalInvested > 0 ? retPos : undefined}
              glowColor={retPos ? 'rgba(34,211,167,0.07)' : 'rgba(255,107,122,0.07)'}
            />
            <StatCard
              label="Best Performer"
              value={s.bestCard ? `+${s.bestPct.toFixed(1)}%` : '—'}
              sub={s.bestCard ? (s.bestCard.player || s.bestCard.name || 'Card') : 'Add cards to see'}
              positive={s.bestCard ? true : undefined}
              glowColor="rgba(255,190,46,0.06)"
            />
          </div>

          {/* Body Grid */}
          <div className="body-grid">

            {/* By Sport */}
            <div className="panel">
              <div className="panel-head"><h2>By Sport</h2></div>
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Sport</th>
                      <th style={{ textAlign: 'right' }}>Cards</th>
                      <th style={{ textAlign: 'right' }}>Invested</th>
                      <th style={{ textAlign: 'right' }}>Value</th>
                      <th style={{ textAlign: 'right' }}>G/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(s.bySport).length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#2e3759', fontFamily: "'Outfit', sans-serif", fontSize: 13, padding: '28px 16px' }}>No cards yet</td></tr>
                    ) : (
                      Object.entries(s.bySport)
                        .sort((a, b) => b[1].value - a[1].value)
                        .map(([sport, d]) => {
                          const gl = d.value - d.invested
                          const glPos = gl >= 0
                          return (
                            <tr key={sport}>
                              <td style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: '#c0c8e8' }}>{sport}</td>
                              <td style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#6a75a0' }}>{d.cards}</td>
                              <td style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#6a75a0' }}>{fmt(d.invested)}</td>
                              <td style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#c0c8e8' }}>{fmt(d.value)}</td>
                              <td style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: glPos ? '#22d3a7' : '#ff6b7a' }}>
                                {glPos ? '+' : ''}{fmt(gl)}
                              </td>
                            </tr>
                          )
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Cards */}
            <div className="panel">
              <div className="panel-head">
                <h2>Top Cards</h2>
                {s.topCards.length > 0 && (
                  <Link href="/collection" style={{ fontSize: 12, color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}>
                    View all →
                  </Link>
                )}
              </div>
              {s.topCards.length === 0 ? (
                <div style={{ padding: '36px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 30, marginBottom: 10, opacity: 0.25 }}>🃏</div>
                  <p style={{ color: '#2e3759', fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>Add cards to see top performers</p>
                </div>
              ) : (
                <div style={{ padding: 14 }}>
                  <div className="top-card-grid">
                    {s.topCards.map((card, i) => {
                      const bought = parseFloat(card.buy) || 0
                      const current = parseFloat(card.val) || bought
                      const gl = current - bought
                      const glPos = gl >= 0
                      return (
                        <div key={card.id || i} className="ccard" onClick={() => router.push('/collection')}>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: '#c0c8e8', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {card.player || card.name || 'Card'}
                          </div>
                          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#3a4465', marginBottom: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {[card.year, card.sport, card.grade ? `PSA ${card.grade}` : card.cond || 'Raw'].filter(Boolean).join(' · ')}
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: '#f0f2ff' }}>
                            {fmt(current)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4, fontSize: 11, fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: glPos ? '#22d3a7' : '#ff6b7a' }}>
                            {glPos ? <IconUp /> : <IconDown />}
                            {glPos ? '+' : ''}{fmt(gl)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </>
  )
}
