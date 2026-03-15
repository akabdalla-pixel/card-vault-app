'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Market', href: '/market' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sold History', href: '/sold' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconSold() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconSearch() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconExternal() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }
function IconTrendUp() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconTrendDown() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Market': IconMarket, 'Insights': IconInsights, 'Sold History': IconSold }
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
        {user && <div style={{ padding: '10px 12px', marginBottom: 4, borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}><div style={{ fontSize: 12, fontWeight: 700, color: '#ccc', fontFamily: "'Outfit',sans-serif" }}>@{user.username}</div><div style={{ fontSize: 11, color: '#444', marginTop: 1, fontFamily: "'Outfit',sans-serif" }}>{user.email}</div></div>}
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
        return <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: isActive ? '#e53935' : '#555', fontFamily: "'Outfit',sans-serif", fontSize: 9, fontWeight: isActive ? 700 : 500, letterSpacing: '0.04em', textTransform: 'uppercase', paddingBottom: 4 }}><Icon />{label}</Link>
      })}
    </nav>
  )
}

export default function MarketPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [source, setSource] = useState('130point')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [myCards, setMyCards] = useState([])
  const [applyCard, setApplyCard] = useState(null)
  const [applySuccess, setApplySuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me', { cache: 'no-store' }),
      fetch('/api/cards', { cache: 'no-store' })
    ]).then(async ([meRes, cardsRes]) => {
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setMyCards(await cardsRes.json())
      setLoading(false)
    })
  }, [router])

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setError('')
    setResults(null)
    setApplySuccess(false)

    try {
      // Search both sources simultaneously
      const sources = source === 'both' ? ['130point', 'ebay'] : [source]
      const fetches = sources.map(s =>
        fetch('/api/market', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim(), source: s })
        }).then(r => r.json())
      )
      const responses = await Promise.all(fetches)

      // Merge results if both sources
      if (responses.length === 2) {
        const allResults = [...(responses[0].results || []), ...(responses[1].results || [])]
        if (allResults.length === 0) { setError('No results found. Try a different search.'); setSearching(false); return }
        const avg = allResults.reduce((s, r) => s + r.price, 0) / allResults.length
        setResults({ results: allResults, avg, high: Math.max(...allResults.map(r => r.price)), low: Math.min(...allResults.map(r => r.price)), source: 'both', count: allResults.length })
      } else {
        const data = responses[0]
        if (data.error || !data.results?.length) { setError('No results found. Try refining your search.'); setSearching(false); return }
        setResults({ ...data, count: data.results.length })
      }
    } catch (e) {
      setError('Search failed. Please try again.')
    }
    setSearching(false)
  }

  async function handleApplyToCard(cardId, price) {
    const card = myCards.find(c => c.id === cardId)
    if (!card) return
    await fetch('/api/cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...card, val: price })
    })
    setApplyCard(null)
    setApplySuccess(true)
    setTimeout(() => setApplySuccess(false), 3000)
  }

  const activeCards = myCards.filter(c => !c.sold)

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}><img src={LOGO} alt="TopLoad" style={{ width: 120, opacity: 0.4, filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} /></div>

  return (
    <>
      <style>{`
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:220px;min-height:100vh;width:calc(100% - 220px)}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding-bottom:80px!important}}
        .result-row:hover{background:rgba(255,255,255,0.03)!important}
        .src-btn{padding:9px 18px;border-radius:10px;border:1px solid #2a2a2a;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .src-btn.active{background:rgba(229,57,53,0.12);border-color:rgba(229,57,53,0.35);color:#e53935}
        .src-btn:not(.active){background:#111;color:#555}
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} active="Market" /></div>
        <main className="main-wrap" style={{ padding: '28px 28px 40px' }}>

          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height: 36, filter: 'drop-shadow(0 0 8px rgba(229,57,53,0.4))' }} />
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#555', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><IconLogout />Sign Out</button>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px', margin: 0 }}>Market Research</h1>
            <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontWeight: 500 }}>Search eBay sold listings — no changes to your collection unless you choose to apply</p>
          </div>

          {/* Search box */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '20px 22px', marginBottom: 24 }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. 2003 LeBron James Topps Chrome PSA 9"
                    style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => e.target.style.borderColor = '#e53935'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                  />
                  <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none' }}><IconSearch /></div>
                </div>
                <button type="submit" disabled={searching || !query.trim()} style={{ padding: '11px 22px', borderRadius: 10, background: searching ? '#1a1a1a' : 'linear-gradient(135deg,#e53935,#ff5252)', border: 'none', color: searching ? '#555' : '#fff', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: searching ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Source selector */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#444', fontFamily: "'Outfit',sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Source</span>
                {[['130point', '130Point'], ['ebay', 'eBay Direct'], ['both', 'Both']].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setSource(val)} className={`src-btn${source === val ? ' active' : ''}`}>{label}</button>
                ))}
              </div>
            </form>

            {/* Quick search from collection */}
            {activeCards.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: 11, color: '#444', fontFamily: "'Outfit',sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Quick Search from My Collection</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {activeCards.slice(0, 6).map(card => (
                    <button key={card.id} onClick={() => { const q = [card.year, card.player, card.brand, card.grade ? `PSA ${card.grade}` : card.cond].filter(Boolean).join(' '); setQuery(q) }} style={{ padding: '5px 10px', borderRadius: 8, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', fontFamily: "'Outfit',sans-serif", fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,57,53,0.4)'; e.currentTarget.style.color = '#e53935' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}>
                      {card.player} {card.year && `'${card.year.slice(-2)}`} {card.grade && `PSA ${card.grade}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Success toast */}
          {applySuccess && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.25)', color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600 }}>
              ✓ Card value updated in your collection
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Results */}
          {results && (
            <>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  ['Results', results.count],
                  ['Average Sale', fmt(results.avg)],
                  ['Highest Sale', fmt(results.high)],
                  ['Lowest Sale', fmt(results.low)],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: '#333', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>{label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Compare to my collection */}
              {activeCards.length > 0 && results.avg > 0 && (() => {
                const matched = activeCards.filter(c => {
                  const q = query.toLowerCase()
                  return (c.player||'').toLowerCase().split(' ').some(w => q.includes(w) && w.length > 3)
                })
                if (!matched.length) return null
                return (
                  <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 12 }}>📊 Compare to My Collection</div>
                    {matched.map(card => {
                      const myVal = parseFloat(card.val) || parseFloat(card.buy) || 0
                      const diff = results.avg - myVal
                      const diffPct = myVal > 0 ? (diff / myVal) * 100 : 0
                      const isUp = diff >= 0
                      return (
                        <div key={card.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e1e1e', flexWrap: 'wrap', gap: 10 }}>
                          <div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc' }}>{card.player}</div>
                            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{[card.year, card.brand, card.grade ? `PSA ${card.grade}` : card.cond].filter(Boolean).join(' · ')}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>My Value</div>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#888' }}>{fmt(myVal)}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Market Avg</div>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>{fmt(results.avg)}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: isUp ? '#e53935' : '#616161' }}>
                              {isUp ? <IconTrendUp /> : <IconTrendDown />}{isUp ? '+' : ''}{diffPct.toFixed(1)}%
                            </div>
                            <button onClick={() => setApplyCard(card)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.2)', color: '#e53935', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              Apply Avg
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {/* Results table */}
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#ccc', margin: 0 }}>
                    Sold Listings · <span style={{ color: '#555' }}>{results.source === 'both' ? '130Point + eBay' : results.source === '130point' ? '130Point' : 'eBay Direct'}</span>
                  </h2>
                  <a href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#e53935', textDecoration: 'none', fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
                    View on eBay <IconExternal />
                  </a>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Title', 'Sale Price', 'Date', ''].map((h, i) => (
                          <th key={i} style={{ padding: '10px 16px', textAlign: i === 1 ? 'right' : i === 0 ? 'left' : 'center', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.results.map((r, i) => (
                        <tr key={i} className="result-row" style={{ borderTop: '1px solid #1a1a1a' }}>
                          <td style={{ padding: '11px 16px', fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#888', maxWidth: 400 }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 380 }}>{r.title}</div>
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#f0f0f0', whiteSpace: 'nowrap' }}>
                            {fmt(r.price)}
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#444', whiteSpace: 'nowrap' }}>
                            {r.date || '—'}
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                            <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid #2a2a2a', color: '#666', fontSize: 12, textDecoration: 'none', fontFamily: "'Outfit',sans-serif", fontWeight: 600, whiteSpace: 'nowrap' }}>
                              View <IconExternal />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Empty state */}
          {!results && !searching && !error && (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.15 }}>📈</div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: '#333', marginBottom: 8 }}>Search any card to see recent eBay sold prices</p>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#2a2a2a' }}>Your collection is never changed unless you choose to apply a price</p>
            </div>
          )}

        </main>
        <BottomNav active="Market" />
      </div>

      {/* Apply to card modal */}
      {applyCard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%' }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f0f0', marginBottom: 8 }}>Apply Market Price?</h3>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>This will update the value of <strong style={{ color: '#ccc' }}>{applyCard.player}</strong> in your collection.</p>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '12px 14px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
              <div><div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current Value</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: '#888' }}>{fmt(parseFloat(applyCard.val) || parseFloat(applyCard.buy) || 0)}</div></div>
              <div style={{ color: '#333', alignSelf: 'center', fontSize: 20 }}>→</div>
              <div><div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Market Average</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: '#e53935' }}>{fmt(results?.avg)}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setApplyCard(null)} style={{ flex: 1, padding: 11, borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#666', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleApplyToCard(applyCard.id, results?.avg)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,#e53935,#ff5252)', border: 'none', color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Apply Price</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
