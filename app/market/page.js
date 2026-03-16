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
function IconSearch() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconExternal() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }
function IconPlus() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IconX() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Insights': IconInsights, 'Sold History': IconSold, 'Market': IconMarket }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)

function Sidebar({ user, onLogout, active }) {
  return (
    <aside style={{ width:200, minHeight:'100vh', background:'#000', borderRight:'1px solid #111', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:60 }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid #111', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={LOGO} alt="TopLoad" style={{ width:140, height:'auto', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV.map(({ label, href }) => {
          const isActive = active === label
          const Icon = navIcons[label]
          if (!Icon) return null
          return (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color: isActive ? '#fff' : '#555', background: isActive ? '#9333ea' : 'transparent', fontSize:13, fontWeight: isActive ? 700 : 500, transition:'all 0.15s' }}>
              <Icon /><span style={{flex:1}}>{label}</span>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'12px 8px', borderTop:'1px solid #111' }}>
        <Link href="/settings" style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, textDecoration:'none', color:'#555', fontSize:13, fontWeight:500 }}><IconSettings /><span>Settings</span></Link>
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

export default function MarketPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [addModal, setAddModal] = useState(null) // the listing being added
  const [addForm, setAddForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => { if (!r.ok) router.push('/login'); return r.json() })
      .then(d => { setUser(d.user); setLoading(false) })
      .catch(() => router.push('/login'))
  }, [router])

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }

  async function handleSearch() {
    if (!query.trim()) return
    setSearching(true)
    setError('')
    setResults(null)
    try {
      const res = await fetch('/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), source: 'ebay' })
      })
      const data = await res.json()
      if (data.error || !data.results?.length) {
        setError('No listings found. Try a broader search.')
      } else {
        setResults({ ...data, count: data.results.length })
      }
    } catch (e) {
      setError('Search failed. Please try again.')
    }
    setSearching(false)
  }

  function openAddModal(listing) {
    // Parse title to prefill form
    const title = listing.title || ''
    const yearMatch = title.match(/\b(19|20)\d{2}\b/)
    const gradeMatch = title.match(/PSA\s*(\d+)/i) || title.match(/BGS\s*(\d+\.?\d*)/i)
    const gradingCo = title.match(/PSA/i) ? 'PSA' : title.match(/BGS/i) ? 'BGS' : ''

    // Detect sport
    const sportMap = { basketball:['nba','lebron','jordan','kobe','curry','durant','lakers','celtics'], football:['nfl','mahomes','brady','manning'], baseball:['mlb','baseball'], soccer:['soccer','football','messi','ronaldo','premier'], f1:['f1','formula','ferrari','verstappen','hamilton'] }
    let sport = ''
    const tl = title.toLowerCase()
    for (const [s, keywords] of Object.entries(sportMap)) {
      if (keywords.some(k => tl.includes(k))) { sport = s.charAt(0).toUpperCase()+s.slice(1); break }
    }

    setAddForm({
      player: title.split(' ').slice(0,3).join(' '), // best guess at player name
      year: yearMatch?.[0] || '',
      grade: gradeMatch?.[1] || '',
      gradingCo,
      sport,
      buy: listing.price ? listing.price.toFixed(2) : '',
      val: listing.price ? listing.price.toFixed(2) : '',
      cond: gradeMatch ? 'Graded' : 'NM',
      qty: '1',
      notes: `Purchased from eBay: ${listing.title}`,
    })
    setAddModal(listing)
  }

  async function handleAddToCollection() {
    if (!addForm.player) return
    setAdding(true)
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      })
      setAddModal(null)
      setAddSuccess(true)
      setTimeout(() => setAddSuccess(false), 3000)
    } catch(e) {}
    setAdding(false)
  }

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}><img src={LOGO} alt="TopLoad" style={{ width:120, opacity:0.4, filter:'brightness(0) invert(1)' }} /></div>

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
        *{font-family:'Space Grotesk',-apple-system,sans-serif!important}
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:200px;min-height:100vh;width:calc(100% - 200px)}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding:16px 16px 80px!important}}
        .listing-card:hover{border-color:rgba(147,51,234,0.4)!important;transform:translateY(-2px)}
        .listing-card{transition:border-color 0.15s,transform 0.15s}
        input:focus{border-color:#9333ea!important;outline:none}
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} active="Market" /></div>

        <main className="main-wrap" style={{ padding:'28px 28px 40px' }}>

          {/* Mobile topbar */}
          <div className="mob-topbar" style={{ alignItems:'center', justifyContent:'center', marginBottom:20 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:32, filter:'brightness(0) invert(1)' }} />
          </div>

          {/* Header */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>Browse & Buy</div>
            <h1 style={{ fontSize:36, fontWeight:900, color:'#fff', letterSpacing:'-1.5px', textTransform:'uppercase', margin:'0 0 6px' }}>MARKETPLACE</h1>
            <p style={{ fontSize:12, color:'#555', fontWeight:500 }}>Search eBay listings · select a card to add it directly to your collection</p>
          </div>

          {/* Search */}
          <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:14, padding:'18px 20px', marginBottom:24 }}>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1, position:'relative' }}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && handleSearch()}
                  placeholder="e.g. LeBron James Topps Chrome PSA 10"
                  style={{ width:'100%', padding:'11px 14px 11px 40px', borderRadius:10, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:14, boxSizing:'border-box', transition:'border-color 0.15s' }}
                />
                <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#444', pointerEvents:'none' }}><IconSearch /></div>
              </div>
              <button onClick={handleSearch} disabled={searching || !query.trim()} style={{ padding:'11px 24px', borderRadius:10, background: searching?'#1a1a1a':'#9333ea', border:'none', color: searching?'#555':'#fff', fontSize:14, fontWeight:800, cursor: searching?'not-allowed':'pointer', whiteSpace:'nowrap', transition:'all 0.15s' }}>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Success toast */}
          {addSuccess && (
            <div style={{ marginBottom:16, padding:'12px 16px', borderRadius:10, background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', color:'#22c55e', fontSize:13, fontWeight:600 }}>
              ✓ Card added to your collection
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginBottom:16, padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid #2a2a2a', color:'#666', fontSize:13 }}>
              {error}
            </div>
          )}

          {/* Stats row */}
          {results && results.count > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
              {[
                { label:'Listings', value: results.count },
                { label:'Avg Price', value: fmt(results.avg) },
                { label:'Highest', value: fmt(results.high) },
                { label:'Lowest', value: fmt(results.low) },
              ].map((s,i) => (
                <div key={i} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:10, padding:'12px 14px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: i===0?'#9333ea':i===2?'#ef4444':i===3?'#22c55e':'#333' }} />
                  <div style={{ fontSize:9, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:900, color:'#fff' }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Results header */}
          {results && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.12em' }}>
                {results.count} Listings on eBay
                {results.searchedAs && <span style={{ color:'#444', fontWeight:600, textTransform:'none', letterSpacing:0 }}> · simplified to "{results.searchedAs}"</span>}
              </div>
              <a href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#9333ea', textDecoration:'none', fontWeight:700 }}>
                View on eBay <IconExternal />
              </a>
            </div>
          )}

          {/* Listing card grid */}
          {results && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
              {results.results.map((r, i) => (
                <div key={i} className="listing-card" style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, overflow:'hidden', cursor:'pointer' }}
                  onClick={() => openAddModal(r)}>
                  {/* Image */}
                  <div style={{ width:'100%', aspectRatio:'1', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
                    {r.image
                      ? <img src={r.image} alt={r.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ fontSize:40, opacity:0.15 }}>🃏</div>
                    }
                    {/* Add button overlay */}
                    <div style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:7, background:'#9333ea', display:'flex', alignItems:'center', justifyContent:'center', opacity:0.9 }}>
                      <IconPlus />
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding:'10px 12px' }}>
                    <div style={{ fontSize:11, color:'#888', marginBottom:8, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', lineHeight:1.5 }}>{r.title}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:900, color:'#fff' }}>{fmt(r.price)}</div>
                      {r.condition && <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase' }}>{r.condition}</div>}
                    </div>
                    <button style={{ marginTop:8, width:'100%', padding:'7px', borderRadius:8, background:'rgba(147,51,234,0.1)', border:'1px solid rgba(147,51,234,0.2)', color:'#a855f7', fontSize:11, fontWeight:800, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                      + Add to Collection
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!results && !searching && !error && (
            <div style={{ textAlign:'center', padding:'80px 24px' }}>
              <div style={{ fontSize:48, marginBottom:16, opacity:0.1 }}>🔍</div>
              <p style={{ fontSize:15, color:'#333', marginBottom:6 }}>Search for any card on eBay</p>
              <p style={{ fontSize:13, color:'#2a2a2a' }}>Click any listing to add it straight to your collection</p>
            </div>
          )}

        </main>
        <BottomNav active="Market" />
      </div>

      {/* Add to Collection modal */}
      {addModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:20, padding:28, maxWidth:480, width:'100%', maxHeight:'90vh', overflowY:'auto' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>Add to Collection</div>
                <h3 style={{ fontSize:18, fontWeight:900, color:'#fff', margin:0, letterSpacing:'-0.3px' }}>Review & Confirm</h3>
              </div>
              <button onClick={() => setAddModal(null)} style={{ width:32, height:32, borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#555', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><IconX /></button>
            </div>

            {/* Listing preview */}
            <div style={{ display:'flex', gap:12, padding:'12px', background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:10, marginBottom:20 }}>
              {addModal.image && <img src={addModal.image} alt="" style={{ width:60, height:60, borderRadius:8, objectFit:'cover', flexShrink:0 }} />}
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, color:'#888', lineHeight:1.4, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{addModal.title}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:900, color:'#fff' }}>{fmt(addModal.price)}</div>
              </div>
            </div>

            {/* Form */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { label:'Player / Card Name', key:'player', type:'text', placeholder:'e.g. LeBron James' },
                { label:'Year', key:'year', type:'text', placeholder:'e.g. 2003' },
                { label:'Sport', key:'sport', type:'text', placeholder:'e.g. Basketball' },
                { label:'Brand / Set', key:'brand', type:'text', placeholder:'e.g. Topps Chrome' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:'block', fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} value={addForm[f.key]||''} onChange={e => setAddForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, boxSizing:'border-box', transition:'border-color 0.15s' }} />
                </div>
              ))}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <label style={{ display:'block', fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Grading Co</label>
                  <input value={addForm.gradingCo||''} onChange={e => setAddForm(p=>({...p,gradingCo:e.target.value}))} placeholder="PSA / BGS"
                    style={{ width:'100%', padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, boxSizing:'border-box' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Grade</label>
                  <input value={addForm.grade||''} onChange={e => setAddForm(p=>({...p,grade:e.target.value}))} placeholder="e.g. 10"
                    style={{ width:'100%', padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, boxSizing:'border-box' }} />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <label style={{ display:'block', fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Purchase Price</label>
                  <input type="number" value={addForm.buy||''} onChange={e => setAddForm(p=>({...p,buy:e.target.value}))} placeholder="0.00"
                    style={{ width:'100%', padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, boxSizing:'border-box' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Qty</label>
                  <input type="number" value={addForm.qty||'1'} onChange={e => setAddForm(p=>({...p,qty:e.target.value}))} placeholder="1"
                    style={{ width:'100%', padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, boxSizing:'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display:'block', fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Notes</label>
                <input value={addForm.notes||''} onChange={e => setAddForm(p=>({...p,notes:e.target.value}))} placeholder="Optional notes"
                  style={{ width:'100%', padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, boxSizing:'border-box' }} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={() => setAddModal(null)} style={{ flex:1, padding:'12px', borderRadius:10, background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#666', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleAddToCollection} disabled={adding || !addForm.player} style={{ flex:2, padding:'12px', borderRadius:10, background: adding||!addForm.player?'#1a1a1a':'#9333ea', border:'none', color: adding||!addForm.player?'#555':'#fff', fontSize:14, fontWeight:800, cursor: adding||!addForm.player?'not-allowed':'pointer', transition:'all 0.15s' }}>
                {adding ? 'Adding...' : '+ Add to Collection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
