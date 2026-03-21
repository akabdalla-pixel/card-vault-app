'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const gradeCol = g => {
  const n = parseFloat(g)
  if (n >= 9) return { c:'#22c55e', bg:'rgba(34,197,94,0.12)', b:'rgba(34,197,94,0.3)' }
  if (n >= 6) return { c:'#ffbe2e', bg:'rgba(255,190,46,0.12)', b:'rgba(255,190,46,0.3)' }
  return { c:'#ef4444', bg:'rgba(239,68,68,0.12)', b:'rgba(239,68,68,0.3)' }
}

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0)
const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const fmtTime = d => {
  const diff = Date.now() - new Date(d)
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

function SportEmoji({ sport }) {
  const map = { Basketball:'🏀', Football:'🏈', Baseball:'⚾', Soccer:'⚽', F1:'🏎️', Hockey:'🏒', Golf:'⛳', Tennis:'🎾', 'Pokémon':'🎴' }
  return map[sport] || '🃏'
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, badge, controls, open, onToggle, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: open ? 12 : 0, flexWrap:'wrap', gap:10 }}>
      <button
        onClick={onToggle}
        style={{ display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer', padding:0 }}
      >
        <span style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'0.05em' }}>
          {title}{count !== undefined ? ` (${count})` : ''}
        </span>
        {badge}
        <span style={{
          fontSize:11, color: open ? 'var(--accent)' : '#444',
          transition:'transform 0.2s',
          display:'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          lineHeight:1,
        }}>▶</span>
      </button>
      {open && controls}
    </div>
  )
}

export default function AdminPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [psaCache, setPsaCache] = useState(null)
  const [psaSearch, setPsaSearch] = useState('')
  const [psaLoading, setPsaLoading] = useState(false)
  // Card Database
  const [dbSearch, setDbSearch] = useState('')
  const [dbSport, setDbSport] = useState('')
  const [dbView, setDbView] = useState('grid')
  const [dbSort, setDbSort] = useState('newest')
  const [lightboxImg, setLightboxImg] = useState(null)
  const [dbOwner, setDbOwner] = useState('')
  // Trade Log
  const [tradeData, setTradeData] = useState(null)
  const [tradeLoading, setTradeLoading] = useState(false)
  const [tradeSearch, setTradeSearch] = useState('')
  const [tradeStatus, setTradeStatus] = useState('')
  const [expandedTrade, setExpandedTrade] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  // Section collapse state
  const [sections, setSections] = useState({ users: true, psa: true, cards: true, trades: true })
  const toggleSection = k => setSections(s => ({ ...s, [k]: !s[k] }))

  const router = useRouter()

  const loadUsers = () => {
    fetch('/api/admin/users')
      .then(r => {
        if (r.status === 403 || r.status === 401) { router.push('/dashboard'); return null }
        return r.json()
      })
      .then(d => { if (d) { setData(d); setLoading(false) } })
      .catch(() => router.push('/dashboard'))
  }

  useEffect(() => { loadUsers() }, [router])

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`DELETE @${username} and ALL their cards, trades, and data?\n\nThis cannot be undone.`)) return
    if (!confirm(`Are you absolutely sure? Type of action: PERMANENT DELETE of @${username}`)) return
    setDeletingUser(userId)
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      })
      const d = await res.json()
      if (d.ok) {
        setExpanded(null)
        loadUsers()
        loadTrades()
      } else {
        alert('Delete failed: ' + (d.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Delete failed: ' + e.message)
    }
    setDeletingUser(null)
  }

  useEffect(() => {
    setPsaLoading(true)
    fetch('/api/admin/psa-cache')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPsaCache(d) })
      .finally(() => setPsaLoading(false))
  }, [])

  const loadTrades = () => {
    setTradeLoading(true)
    fetch('/api/admin/trades')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setTradeData(d) })
      .finally(() => setTradeLoading(false))
  }

  useEffect(() => { loadTrades() }, [])

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:13, color:'#555' }}>Loading...</div>
    </div>
  )

  const { users, stats } = data
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)}
          style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, cursor:'zoom-out' }}>
          <img src={lightboxImg.url} alt={lightboxImg.player}
            style={{ maxWidth:'90vw', maxHeight:'82vh', objectFit:'contain', borderRadius:12, boxShadow:'0 32px 80px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()} />
          <div style={{ marginTop:14, fontSize:13, fontWeight:700, color:'#ccc' }}>{lightboxImg.player}</div>
          <div style={{ marginTop:4, fontSize:11, color:'#555' }}>Click anywhere to close</div>
        </div>
      )}

      <style>{`
        *{ font-family:var(--font-geist-sans),-apple-system,sans-serif!important }
        *[style*="monospace"]{ font-family:var(--font-geist-mono),monospace!important }
        ::-webkit-scrollbar{ width:4px } ::-webkit-scrollbar-thumb{ background:#333; border-radius:4px }
        .user-row:hover{ background:rgba(255,255,255,0.02) }
        .card-row:hover{ background:rgba(255,255,255,0.015) }
        .psa-row:hover{ background:rgba(255,255,255,0.015) }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#0a0a0a', padding:'32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <img src="/logo-transparent.png" alt="TopLoad" style={{ height:36, filter:'brightness(0) invert(1)' }} />
              <div style={{ padding:'3px 10px', background:'rgba(var(--accent-rgb),0.1)', border:'1px solid rgba(var(--accent-rgb),0.25)', borderRadius:6, fontSize:10, fontWeight:900, color:'var(--accent-light)', letterSpacing:'0.12em' }}>ADMIN</div>
            </div>
            <Link href="/dashboard" style={{ padding:'8px 16px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#555', fontSize:12, fontWeight:700, textDecoration:'none' }}>← Dashboard</Link>
          </div>

          {/* Page title */}
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:34, fontWeight:900, color:'#fff', letterSpacing:'-1px', textTransform:'uppercase', margin:0 }}>OVERVIEW</h1>
            <p style={{ fontSize:12, color:'#555', marginTop:4 }}>Platform stats · {fmtDate(new Date())}</p>
          </div>

          {/* Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:32 }}>
            {[
              { label:'Total Users',     value: stats.totalUsers,                 accent:'var(--accent)' },
              { label:'Total Cards',     value: stats.totalCards,                 accent:'var(--accent)' },
              { label:'Active Cards',    value: stats.totalActiveCards,           accent:'#333' },
              { label:'Sold Cards',      value: stats.totalSoldCards,             accent:'#ffbe2e' },
              { label:'Portfolio Value', value: fmt(stats.totalPortfolioValue),   accent:'#22c55e' },
              { label:'Total Invested',  value: fmt(stats.totalInvested),         accent:'#333' },
              { label:'Cards This Week', value: stats.cardsThisWeek,              accent:'var(--accent-light)' },
              { label:'Most Active',     value: '@'+stats.mostActiveUser,         accent:'var(--accent)', small:true },
              { label:'PSA Lookups',     value: psaCache?.total ?? '—',           accent:'var(--accent)' },
              { label:'Total Trades',    value: tradeData?.stats?.total ?? '—',   accent:'var(--accent-light)' },
            ].map((s,i) => (
              <div key={i} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:'14px 16px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.accent }} />
                <div style={{ fontSize:9, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>{s.label}</div>
                <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:s.small?14:20, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── Users section ───────────────────────────────────────────────── */}
          <div style={{ marginBottom:36 }}>
            <SectionHeader
              title="Users"
              count={users.length}
              open={sections.users}
              onToggle={() => toggleSection('users')}
              controls={
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                  style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:200 }} />
              }
            />

            {sections.users && (
              <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr 60px 60px 80px 100px 100px 32px', gap:0, padding:'10px 16px', background:'#000', borderBottom:'1px solid #111' }}>
                  {['User','Email','Cards','Sold','Wishes','Value','Joined',''].map((h,i) => (
                    <div key={i} style={{ fontSize:9, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:i>1?'right':'left' }}>{h}</div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>No users found</div>
                )}

                {filteredUsers.map((user, ui) => (
                  <div key={user.id}>
                    <div className="user-row" style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr 60px 60px 80px 100px 100px 32px', gap:0, padding:'13px 16px', borderTop: ui>0?'1px solid #111':'none', cursor:'pointer', transition:'background 0.1s' }}
                      onClick={() => setExpanded(expanded===user.id ? null : user.id)}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:'#1e1e1e', border:'1px solid #2a2a2a', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#666' }}>
                          {user.avatar ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : user.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:800, color:'#f0f0f0' }}>@{user.username}</div>
                          <div style={{ fontSize:10, color:'#444', marginTop:1 }}>{fmtTime(user.createdAt)}</div>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:'#666', textAlign:'left', alignSelf:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, fontWeight:700, color:'#fff', textAlign:'right', alignSelf:'center' }}>{user.cardCount}</div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, color:'#555', textAlign:'right', alignSelf:'center' }}>{user.soldCount}</div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, color:'#555', textAlign:'right', alignSelf:'center' }}>{user.wishCount}</div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, fontWeight:700, color:'#22c55e', textAlign:'right', alignSelf:'center' }}>{fmt(user.portfolioValue)}</div>
                      <div style={{ fontSize:11, color:'#444', textAlign:'right', alignSelf:'center' }}>{fmtDate(user.createdAt)}</div>
                      <div style={{ textAlign:'right', alignSelf:'center', fontSize:12, color: expanded===user.id?'var(--accent)':'#333', transition:'transform 0.2s', transform: expanded===user.id?'rotate(90deg)':'rotate(0deg)', display:'inline-block' }}>▶</div>
                    </div>

                    {expanded === user.id && (
                      <div style={{ background:'#080808', borderTop:'1px solid #111', borderBottom:'1px solid #111' }}>
                        <div style={{ display:'flex', gap:20, padding:'10px 16px 10px 32px', borderBottom:'1px solid #111' }}>
                          {[
                            { label:'Portfolio', value: fmt(user.portfolioValue), color:'#22c55e' },
                            { label:'Invested',  value: fmt(user.invested),       color:'#fff' },
                            { label:'G/L',       value: (user.portfolioValue-user.invested>=0?'+':'')+fmt(user.portfolioValue-user.invested), color: user.portfolioValue>=user.invested?'#22c55e':'#ef4444' },
                            { label:'Active',    value: user.cardCount - user.soldCount, color:'#fff' },
                            { label:'Sold',      value: user.soldCount,           color:'#ffbe2e' },
                          ].map((s,i) => (
                            <div key={i}>
                              <div style={{ fontSize:8, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{s.label}</div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, fontWeight:800, color:s.color }}>{s.value}</div>
                            </div>
                          ))}
                        </div>

                        {user.cards.length > 0 ? (
                          <>
                            <div style={{ display:'grid', gridTemplateColumns:'1.5fr 80px 60px 80px 80px 80px 70px', padding:'8px 16px 8px 32px', background:'#050505' }}>
                              {['Player','Sport','Year','Grade','Paid','Value','G/L'].map((h,i) => (
                                <div key={i} style={{ fontSize:8, fontWeight:700, color:'#2a2a2a', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:i>1?'right':'left' }}>{h}</div>
                              ))}
                            </div>
                            {[...user.cards].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((card, ci) => {
                              const buy = parseFloat(card.buy)||0
                              const val = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||buy)
                              const gl = val - buy
                              const glPos = gl >= 0
                              const glPct = buy > 0 ? (gl/buy)*100 : 0
                              return (
                                <div key={card.id} className="card-row" style={{ display:'grid', gridTemplateColumns:'1.5fr 80px 60px 80px 80px 80px 70px', padding:'9px 16px 9px 32px', borderTop:'1px solid #0d0d0d', transition:'background 0.1s' }}>
                                  <div>
                                    <div style={{ fontSize:12, fontWeight:700, color: card.sold?'#555':'#ccc', textTransform:'uppercase', letterSpacing:'-0.2px' }}>{card.player}</div>
                                    <div style={{ display:'flex', gap:4, marginTop:2, alignItems:'center' }}>
                                      {card.sold && <span style={{ fontSize:8, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', padding:'1px 5px', borderRadius:3 }}>SOLD</span>}
                                      {card.auto && <span style={{ fontSize:8, fontWeight:800, color:'var(--accent-light)', background:'rgba(var(--accent-rgb),0.1)', padding:'1px 5px', borderRadius:3 }}>AUTO</span>}
                                      {card.brand && <span style={{ fontSize:9, color:'#333' }}>{card.brand}</span>}
                                      <span style={{ fontSize:9, color:'#2a2a2a' }}>{fmtTime(card.createdAt)}</span>
                                    </div>
                                  </div>
                                  <div style={{ fontSize:11, color:'#555', alignSelf:'center' }}>{card.sport ? <SportEmoji sport={card.sport} /> : '—'} {card.sport||'—'}</div>
                                  <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, color:'#555', textAlign:'right', alignSelf:'center' }}>{card.year||'—'}</div>
                                  <div style={{ textAlign:'right', alignSelf:'center' }}>
                                    {card.grade
                                      ? (() => { const gc = gradeCol(card.grade); return <span style={{ fontSize:10, fontWeight:800, color:gc.c, background:gc.bg, padding:'2px 6px', borderRadius:4 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span> })()
                                      : <span style={{ fontSize:10, color:'#333' }}>Raw</span>
                                    }
                                  </div>
                                  <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:12, color:'#555', textAlign:'right', alignSelf:'center' }}>{fmt(buy)}</div>
                                  <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:12, fontWeight:700, color:'#f0f0f0', textAlign:'right', alignSelf:'center' }}>{fmt(val)}</div>
                                  <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, fontWeight:800, color:glPos?'#22c55e':'#ef4444', textAlign:'right', alignSelf:'center' }}>{glPos?'+':''}{glPct.toFixed(0)}%</div>
                                </div>
                              )
                            })}
                          </>
                        ) : (
                          <div style={{ padding:'20px 32px', fontSize:12, color:'#333' }}>No cards yet</div>
                        )}

                        {/* Delete user button */}
                        <div style={{ padding:'12px 16px 12px 32px', borderTop:'1px solid #111', display:'flex', justifyContent:'flex-end' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id, user.username) }}
                            disabled={deletingUser === user.id}
                            style={{
                              padding:'7px 16px', borderRadius:8,
                              background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
                              color:'#ef4444', fontSize:11, fontWeight:700, cursor:'pointer',
                              fontFamily:'var(--font-geist-sans)',
                              opacity: deletingUser === user.id ? 0.5 : 1,
                            }}
                          >
                            {deletingUser === user.id ? 'Deleting...' : `Delete @${user.username} & All Data`}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── PSA Cache Section ────────────────────────────────────────────── */}
          <div style={{ marginBottom:36 }}>
            <SectionHeader
              title="PSA Lookup Cache"
              count={psaCache?.total ?? 0}
              open={sections.psa}
              onToggle={() => toggleSection('psa')}
              badge={
                <div style={{ padding:'2px 8px', background:'rgba(var(--accent-rgb),0.1)', border:'1px solid rgba(var(--accent-rgb),0.25)', borderRadius:4, fontSize:9, fontWeight:800, color:'var(--accent-light)', letterSpacing:'0.1em' }}>24H CACHE</div>
              }
              controls={
                <div style={{ display:'flex', gap:8 }}>
                  <input value={psaSearch} onChange={e => setPsaSearch(e.target.value)} placeholder="Search certs..."
                    style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:200 }} />
                  <button onClick={() => { setPsaLoading(true); fetch('/api/admin/psa-cache').then(r=>r.json()).then(d=>setPsaCache(d)).finally(()=>setPsaLoading(false)) }}
                    style={{ padding:'7px 14px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    {psaLoading ? '...' : '↻ Refresh'}
                  </button>
                </div>
              }
            />

            {sections.psa && (
              <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, overflow:'hidden' }}>
                {psaLoading && !psaCache && (
                  <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>Loading...</div>
                )}
                {psaCache?.entries?.length === 0 && (
                  <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>No PSA lookups yet</div>
                )}

                {(psaCache?.entries || [])
                  .filter(e => !psaSearch || e.player.toLowerCase().includes(psaSearch.toLowerCase()) || e.cert.includes(psaSearch) || (e.sport||'').toLowerCase().includes(psaSearch.toLowerCase()))
                  .map((entry, i) => {
                    const ageHours = (Date.now() - new Date(entry.updatedAt).getTime()) / (1000 * 60 * 60)
                    const isFresh = ageHours < 24
                    const gc = entry.grade && entry.grade !== '—' ? gradeCol(entry.grade) : null

                    return (
                      <div key={entry.cert} className="psa-row"
                        style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderTop: i>0?'1px solid #111':'none', transition:'background 0.1s' }}>

                        {/* Image */}
                        <div style={{ flexShrink:0 }}>
                          {entry.frontImage
                            ? <img src={entry.frontImage} alt="" style={{ width:38, height:54, objectFit:'contain', borderRadius:5, border:'1px solid #222', background:'#111', display:'block' }} onError={e => { e.target.style.display='none' }} />
                            : <div style={{ width:38, height:54, background:'#111', borderRadius:5, border:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, opacity:0.2 }}>🃏</div>
                          }
                        </div>

                        {/* Main info */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
                            <span style={{ fontSize:13, fontWeight:800, color: entry.isCancelled ? '#ef4444' : '#e0e0e0', letterSpacing:'-0.2px' }}>{entry.player}</span>
                            {entry.isCancelled && <span style={{ fontSize:8, fontWeight:800, color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'1px 6px', borderRadius:3 }}>CANCELLED</span>}
                            {gc && (
                              <span style={{ fontSize:10, fontWeight:900, color:gc.c, background:gc.bg, border:`1px solid ${gc.b}`, padding:'2px 7px', borderRadius:5 }}>
                                PSA {entry.grade}
                              </span>
                            )}
                            {entry.auto && (
                              <span style={{ fontSize:10, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', border:'1px solid rgba(255,190,46,0.3)', padding:'2px 7px', borderRadius:5 }}>
                                AUTO{entry.autoGrade ? ` ${entry.autoGrade}` : ''}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize:11, color:'#555', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {[entry.set !== '—' ? entry.set : null, entry.year !== '—' ? entry.year : null, entry.brand !== '—' ? entry.brand : null].filter(Boolean).join(' · ')}
                          </div>
                          <div style={{ display:'flex', gap:10, marginTop:4, alignItems:'center', flexWrap:'wrap' }}>
                            {entry.certPageUrl
                              ? <a href={entry.certPageUrl} target="_blank" rel="noreferrer"
                                  style={{ fontFamily:'var(--font-geist-mono)', fontSize:10, color:'var(--accent-light)', textDecoration:'none' }}>
                                  #{entry.cert} ↗
                                </a>
                              : <span style={{ fontFamily:'var(--font-geist-mono)', fontSize:10, color:'#444' }}>#{entry.cert}</span>
                            }
                            {entry.sport && entry.sport !== '—' && (
                              <span style={{ fontSize:10, color:'#444' }}>{entry.sport}</span>
                            )}
                          </div>
                        </div>

                        {/* Pop + freshness */}
                        <div style={{ flexShrink:0, textAlign:'right', minWidth:70 }}>
                          {entry.totalPop !== undefined && entry.totalPop !== '—' && (
                            <div style={{ marginBottom:4 }}>
                              <div style={{ fontSize:9, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Pop</div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, fontWeight:900, color:'#fff' }}>{entry.totalPop}</div>
                            </div>
                          )}
                          <span style={{ fontSize:8, fontWeight:800, padding:'2px 6px', borderRadius:4,
                            background: isFresh ? 'rgba(34,197,94,0.1)' : 'rgba(255,190,46,0.1)',
                            color: isFresh ? '#22c55e' : '#ffbe2e',
                            border: `1px solid ${isFresh ? 'rgba(34,197,94,0.3)' : 'rgba(255,190,46,0.3)'}`,
                          }}>
                            {isFresh ? '✓ FRESH' : '⚠ STALE'}
                          </span>
                        </div>

                        {/* Time */}
                        <div style={{ flexShrink:0, textAlign:'right', minWidth:60 }}>
                          <div style={{ fontSize:11, color:'#444' }}>{fmtTime(entry.updatedAt)}</div>
                        </div>

                      </div>
                    )
                  })
                }
              </div>
            )}
          </div>

          {/* ── Trade Log ─────────────────────────────────────────────────── */}
          <div style={{ marginBottom:36 }}>
            <SectionHeader
              title="Trade Log"
              count={tradeData?.stats?.total ?? 0}
              open={sections.trades}
              onToggle={() => toggleSection('trades')}
              badge={
                tradeData?.stats?.pending > 0
                  ? <div style={{ padding:'2px 8px', background:'rgba(255,190,46,0.1)', border:'1px solid rgba(255,190,46,0.25)', borderRadius:4, fontSize:9, fontWeight:800, color:'#ffbe2e', letterSpacing:'0.1em' }}>{tradeData.stats.pending} PENDING</div>
                  : null
              }
              controls={
                <div style={{ display:'flex', gap:8 }}>
                  <input value={tradeSearch} onChange={e => setTradeSearch(e.target.value)} placeholder="Search by user..."
                    style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:160 }} />
                  <select value={tradeStatus} onChange={e => setTradeStatus(e.target.value)}
                    style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color: tradeStatus?'#f0f0f0':'#555', fontSize:12, outline:'none' }}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={loadTrades}
                    style={{ padding:'7px 14px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                    {tradeLoading ? '...' : '↻ Refresh'}
                  </button>
                </div>
              }
            />

            {sections.trades && (
              <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, overflow:'hidden' }}>
                {tradeLoading && !tradeData && (
                  <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>Loading trades...</div>
                )}

                {tradeData && tradeData.trades.length === 0 && (
                  <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>No trades yet</div>
                )}

                {/* Trade stats mini bar */}
                {tradeData?.stats && tradeData.stats.total > 0 && (
                  <div style={{ display:'flex', gap:16, padding:'12px 16px', borderBottom:'1px solid #111', background:'#080808' }}>
                    {[
                      { label:'Total', value:tradeData.stats.total, color:'#fff' },
                      { label:'Pending', value:tradeData.stats.pending, color:'#ffbe2e' },
                      { label:'Accepted', value:tradeData.stats.accepted, color:'#22c55e' },
                      { label:'Declined', value:tradeData.stats.declined, color:'#ef4444' },
                      { label:'Cancelled', value:tradeData.stats.cancelled, color:'#666' },
                    ].map((s,i) => (
                      <div key={i}>
                        <div style={{ fontSize:8, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{s.label}</div>
                        <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:14, fontWeight:900, color:s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {(tradeData?.trades || [])
                  .filter(t => {
                    const q = tradeSearch.toLowerCase()
                    const matchQ = !q || t.proposer?.username?.toLowerCase().includes(q) || t.receiver?.username?.toLowerCase().includes(q)
                    const matchStatus = !tradeStatus || t.status === tradeStatus
                    return matchQ && matchStatus
                  })
                  .map((trade, i) => {
                    const statusColors = {
                      pending: { c:'#ffbe2e', bg:'rgba(255,190,46,0.1)', b:'rgba(255,190,46,0.3)' },
                      accepted: { c:'#22c55e', bg:'rgba(34,197,94,0.1)', b:'rgba(34,197,94,0.3)' },
                      declined: { c:'#ef4444', bg:'rgba(239,68,68,0.1)', b:'rgba(239,68,68,0.3)' },
                      cancelled: { c:'#666', bg:'rgba(102,102,102,0.1)', b:'rgba(102,102,102,0.3)' },
                    }
                    const sc = statusColors[trade.status] || statusColors.pending
                    const isExpanded = expandedTrade === trade.id
                    const totalPCards = trade.proposerCards.length
                    const totalRCards = trade.receiverCards.length

                    return (
                      <div key={trade.id} style={{ borderTop: i > 0 ? '1px solid #111' : 'none' }}>
                        {/* Trade row */}
                        <div
                          className="card-row"
                          onClick={() => setExpandedTrade(isExpanded ? null : trade.id)}
                          style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', cursor:'pointer', transition:'background 0.1s' }}
                        >
                          {/* Proposer avatar */}
                          <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
                            <div style={{ width:28, height:28, borderRadius:'50%', background:'#1e1e1e', border:'1px solid #2a2a2a', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#666' }}>
                              {trade.proposer?.avatar ? <img src={trade.proposer.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : trade.proposer?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:700, color:'#e0e0e0' }}>@{trade.proposer?.username || 'unknown'}</div>
                              <div style={{ fontSize:10, color:'#444' }}>{totalPCards} card{totalPCards !== 1 ? 's' : ''}{trade.proposerCash > 0 ? ` + ${fmt(trade.proposerCash)}` : ''}</div>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div style={{ fontSize:16, color:'#333', flexShrink:0 }}>⇄</div>

                          {/* Receiver avatar */}
                          <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
                            <div style={{ width:28, height:28, borderRadius:'50%', background:'#1e1e1e', border:'1px solid #2a2a2a', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#666' }}>
                              {trade.receiver?.avatar ? <img src={trade.receiver.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : trade.receiver?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:700, color:'#e0e0e0' }}>@{trade.receiver?.username || 'unknown'}</div>
                              <div style={{ fontSize:10, color:'#444' }}>{totalRCards} card{totalRCards !== 1 ? 's' : ''}{trade.receiverCash > 0 ? ` + ${fmt(trade.receiverCash)}` : ''}</div>
                            </div>
                          </div>

                          {/* Status badge */}
                          <span style={{ padding:'3px 10px', borderRadius:5, background:sc.bg, border:`1px solid ${sc.b}`, color:sc.c, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0 }}>
                            {trade.status}
                          </span>

                          {/* Date */}
                          <div style={{ fontSize:11, color:'#444', flexShrink:0, minWidth:60, textAlign:'right' }}>{fmtTime(trade.createdAt)}</div>

                          {/* Expand arrow */}
                          <div style={{ fontSize:12, color: isExpanded ? 'var(--accent)' : '#333', transition:'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink:0 }}>▶</div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div style={{ background:'#080808', borderTop:'1px solid #111', padding:'16px 16px 16px 20px' }}>
                            {/* Trade ID + dates */}
                            <div style={{ display:'flex', gap:20, marginBottom:14, flexWrap:'wrap' }}>
                              <div>
                                <div style={{ fontSize:8, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Trade ID</div>
                                <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:10, color:'#555' }}>{trade.id}</div>
                              </div>
                              <div>
                                <div style={{ fontSize:8, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Created</div>
                                <div style={{ fontSize:11, color:'#555' }}>{fmtDate(trade.createdAt)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize:8, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Updated</div>
                                <div style={{ fontSize:11, color:'#555' }}>{fmtDate(trade.updatedAt)}</div>
                              </div>
                              <div>
                                <div style={{ fontSize:8, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>Status</div>
                                <span style={{ fontSize:10, fontWeight:800, color:sc.c }}>{trade.status.toUpperCase()}</span>
                              </div>
                            </div>

                            {/* Message */}
                            {trade.message && (
                              <div style={{ padding:'10px 14px', background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:8, marginBottom:14 }}>
                                <div style={{ fontSize:8, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Message</div>
                                <div style={{ fontSize:12, color:'#888', lineHeight:1.4, fontStyle:'italic' }}>"{trade.message}"</div>
                              </div>
                            )}

                            {/* Two column cards */}
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                              {/* Proposer's cards */}
                              <div>
                                <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
                                  @{trade.proposer?.username || 'unknown'} offered {trade.proposerCash > 0 ? `+ ${fmt(trade.proposerCash)} cash` : ''}
                                </div>
                                {trade.proposerCards.length === 0 ? (
                                  <div style={{ fontSize:11, color:'#333', padding:'8px 0' }}>No cards offered</div>
                                ) : (
                                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                    {trade.proposerCards.map(card => (
                                      <div key={card.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:8, opacity: card.missing ? 0.4 : 1 }}>
                                        <div style={{ width:30, height:44, borderRadius:4, overflow:'hidden', background:'#111', flexShrink:0 }}>
                                          {card.imageUrl
                                            ? <img src={card.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onClick={() => setLightboxImg({ url: card.imageUrl, player: card.player })} />
                                            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, opacity:0.2 }}>🃏</div>
                                          }
                                        </div>
                                        <div style={{ flex:1, minWidth:0 }}>
                                          <div style={{ fontSize:11, fontWeight:700, color:'#ccc', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{card.player}</div>
                                          <div style={{ display:'flex', gap:4, marginTop:2, flexWrap:'wrap', alignItems:'center' }}>
                                            {card.sport && <span style={{ fontSize:9, color:'#444' }}>{card.sport}</span>}
                                            {card.year && <span style={{ fontSize:9, color:'#333' }}>{card.year}</span>}
                                            {card.grade && (() => { const gc = gradeCol(card.grade); return <span style={{ fontSize:8, fontWeight:800, color:gc.c, background:gc.bg, padding:'1px 5px', borderRadius:3 }}>{card.gradingCo ? card.gradingCo+' ' : ''}{card.grade}</span> })()}
                                            {card.auto && <span style={{ fontSize:8, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', padding:'1px 5px', borderRadius:3 }}>AUTO{card.autoGrade ? ` ${card.autoGrade}` : ''}</span>}
                                          </div>
                                        </div>
                                        <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, fontWeight:700, color:'#666', flexShrink:0 }}>{card.val ? fmt(parseFloat(card.val)||0) : '—'}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Receiver's cards */}
                              <div>
                                <div style={{ fontSize:9, fontWeight:800, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
                                  @{trade.receiver?.username || 'unknown'} offered {trade.receiverCash > 0 ? `+ ${fmt(trade.receiverCash)} cash` : ''}
                                </div>
                                {trade.receiverCards.length === 0 ? (
                                  <div style={{ fontSize:11, color:'#333', padding:'8px 0' }}>No cards offered</div>
                                ) : (
                                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                    {trade.receiverCards.map(card => (
                                      <div key={card.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:8, opacity: card.missing ? 0.4 : 1 }}>
                                        <div style={{ width:30, height:44, borderRadius:4, overflow:'hidden', background:'#111', flexShrink:0 }}>
                                          {card.imageUrl
                                            ? <img src={card.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} onClick={() => setLightboxImg({ url: card.imageUrl, player: card.player })} />
                                            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, opacity:0.2 }}>🃏</div>
                                          }
                                        </div>
                                        <div style={{ flex:1, minWidth:0 }}>
                                          <div style={{ fontSize:11, fontWeight:700, color:'#ccc', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{card.player}</div>
                                          <div style={{ display:'flex', gap:4, marginTop:2, flexWrap:'wrap', alignItems:'center' }}>
                                            {card.sport && <span style={{ fontSize:9, color:'#444' }}>{card.sport}</span>}
                                            {card.year && <span style={{ fontSize:9, color:'#333' }}>{card.year}</span>}
                                            {card.grade && (() => { const gc = gradeCol(card.grade); return <span style={{ fontSize:8, fontWeight:800, color:gc.c, background:gc.bg, padding:'1px 5px', borderRadius:3 }}>{card.gradingCo ? card.gradingCo+' ' : ''}{card.grade}</span> })()}
                                            {card.auto && <span style={{ fontSize:8, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', padding:'1px 5px', borderRadius:3 }}>AUTO{card.autoGrade ? ` ${card.autoGrade}` : ''}</span>}
                                          </div>
                                        </div>
                                        <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, fontWeight:700, color:'#666', flexShrink:0 }}>{card.val ? fmt(parseFloat(card.val)||0) : '—'}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                }
              </div>
            )}
          </div>

          {/* ── Card Database ────────────────────────────────────────────────── */}
          {(() => {
            const allCards = (data?.users || []).flatMap(u =>
              u.cards.map(c => ({ ...c, ownerUsername: u.username, ownerAvatar: u.avatar }))
            )
            const sports = [...new Set(allCards.map(c => c.sport).filter(Boolean))].sort()
            const owners = [...new Set(allCards.map(c => c.ownerUsername))].sort()
            const withPhotos = allCards.filter(c => c.imageUrl).length

            const filtered = allCards.filter(c => {
              const q = dbSearch.toLowerCase()
              const matchQ = !q || c.player?.toLowerCase().includes(q) || c.brand?.toLowerCase().includes(q) || c.name?.toLowerCase().includes(q) || c.ownerUsername?.toLowerCase().includes(q)
              const matchSport = !dbSport || c.sport === dbSport
              const matchOwner = !dbOwner || c.ownerUsername === dbOwner
              return matchQ && matchSport && matchOwner
            }).sort((a, b) => {
              if (dbSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
              if (dbSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
              if (dbSort === 'value')  return (parseFloat(b.val)||0) - (parseFloat(a.val)||0)
              if (dbSort === 'player') return a.player.localeCompare(b.player)
              return 0
            })

            return (
              <div style={{ marginBottom:36 }}>
                <SectionHeader
                  title="Card Database"
                  count={allCards.length}
                  open={sections.cards}
                  onToggle={() => toggleSection('cards')}
                  badge={
                    <div style={{ padding:'2px 8px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:4, fontSize:9, fontWeight:800, color:'#22c55e', letterSpacing:'0.1em' }}>{withPhotos} WITH PHOTOS</div>
                  }
                  controls={
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <input value={dbSearch} onChange={e => setDbSearch(e.target.value)} placeholder="Search cards..."
                        style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:160 }} />
                      <select value={dbSport} onChange={e => setDbSport(e.target.value)}
                        style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color: dbSport?'#f0f0f0':'#555', fontSize:12, outline:'none' }}>
                        <option value="">All Sports</option>
                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={dbOwner} onChange={e => setDbOwner(e.target.value)}
                        style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color: dbOwner?'#f0f0f0':'#555', fontSize:12, outline:'none' }}>
                        <option value="">All Users</option>
                        {owners.map(o => <option key={o} value={o}>@{o}</option>)}
                      </select>
                      {/* Sort */}
                      <select value={dbSort} onChange={e => setDbSort(e.target.value)}
                        style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none' }}>
                        <option value="newest">📅 Newest</option>
                        <option value="oldest">📅 Oldest</option>
                        <option value="value">💰 Value ↓</option>
                        <option value="player">🔤 Player A–Z</option>
                      </select>
                      {/* View toggle */}
                      <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid #1e1e1e' }}>
                        {['grid','table'].map(v => (
                          <button key={v} onClick={() => setDbView(v)}
                            style={{ padding:'7px 14px', background: dbView===v ? 'rgba(var(--accent-rgb),0.15)' : '#111', border:'none', color: dbView===v ? 'var(--accent)' : '#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                            {v === 'grid' ? '⊞ Grid' : '☰ Table'}
                          </button>
                        ))}
                      </div>
                    </div>
                  }
                />

                {sections.cards && (
                  <>
                    {filtered.length === 0 && (
                      <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, padding:'40px', textAlign:'center', fontSize:13, color:'#444' }}>No cards match</div>
                    )}

                    {/* Grid View */}
                    {dbView === 'grid' && filtered.length > 0 && (
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
                        {filtered.map(card => {
                          const buy = parseFloat(card.buy)||0
                          const val = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||buy)
                          const gl = val - buy
                          const glPos = gl >= 0
                          return (
                            <div key={card.id} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, overflow:'hidden', transition:'border-color 0.12s' }}
                              onMouseEnter={e => e.currentTarget.style.borderColor='#333'}
                              onMouseLeave={e => e.currentTarget.style.borderColor='#1a1a1a'}>
                              <div style={{ position:'relative', width:'100%', paddingTop:'146.75%', background:'#0a0a0a', overflow:'hidden' }}>
                                {card.imageUrl
                                  ? <img src={card.imageUrl} alt={card.player}
                                      onClick={() => setLightboxImg({ url: card.imageUrl, player: card.player })}
                                      style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain', cursor:'zoom-in' }} />
                                  : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, opacity:0.15 }}>🃏</div>
                                }
                                <div style={{ position:'absolute', top:6, right:6, display:'flex', flexDirection:'column', gap:3, alignItems:'flex-end' }}>
                                  {card.grade && (() => { const gc = gradeCol(card.grade); return <span style={{ background:'rgba(0,0,0,0.8)', border:`1px solid ${gc.b}`, color:gc.c, fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span> })()}
                                  {card.auto && (() => { const agc = card.autoGrade ? gradeCol(card.autoGrade) : { c:'#ffbe2e', bg:'rgba(255,190,46,0.12)', b:'rgba(255,190,46,0.3)' }; return <span style={{ background:'rgba(0,0,0,0.8)', border:`1px solid ${agc.b}`, color:agc.c, fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>AUTO{card.autoGrade ? ` ${card.autoGrade}` : ''}</span> })()}
                                  {card.num && String(card.num).includes('/') && <span style={{ background:'rgba(0,0,0,0.8)', border:'1px solid rgba(148,163,184,0.4)', color:'#94a3b8', fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>#{card.num}</span>}
                                </div>
                                {card.sold && <div style={{ position:'absolute', top:6, left:6, background:'rgba(255,190,46,0.9)', color:'#000', fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>SOLD</div>}
                              </div>
                              <div style={{ padding:'10px 12px' }}>
                                <div style={{ fontSize:12, fontWeight:800, color:'#fff', textTransform:'uppercase', letterSpacing:'-0.2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{card.player}</div>
                                <div style={{ fontSize:10, color:'#444', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{[card.year, card.sport, card.brand].filter(Boolean).join(' · ')}</div>
                                <div style={{ fontSize:9, color:'#2a2a2a', marginBottom:6 }}>{fmtTime(card.createdAt)}</div>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                  <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:13, fontWeight:900, color: glPos ? '#22c55e' : '#ef4444' }}>{fmt(val)}</div>
                                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                                    {card.ownerAvatar
                                      ? <img src={card.ownerAvatar} alt="" style={{ width:16, height:16, borderRadius:'50%', objectFit:'cover' }} />
                                      : <div style={{ width:16, height:16, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:900, color:'#fff' }}>{card.ownerUsername?.[0]?.toUpperCase()}</div>
                                    }
                                    <span style={{ fontSize:10, color:'#444' }}>@{card.ownerUsername}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Table View */}
                    {dbView === 'table' && filtered.length > 0 && (
                      <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, overflow:'hidden' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'48px 2fr 80px 60px 80px 80px 80px 70px 120px', padding:'10px 16px', background:'#000', borderBottom:'1px solid #111' }}>
                          {['Img','Player','Sport','Year','Grade','Paid','Value','G/L','Owner'].map((h,i) => (
                            <div key={i} style={{ fontSize:9, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:i>1?'right':'left' }}>{h}</div>
                          ))}
                        </div>
                        {filtered.map((card, ci) => {
                          const buy = parseFloat(card.buy)||0
                          const val = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||buy)
                          const gl = val - buy
                          const glPos = gl >= 0
                          const glPct = buy > 0 ? (gl/buy)*100 : 0
                          return (
                            <div key={card.id} className="card-row" style={{ display:'grid', gridTemplateColumns:'48px 2fr 80px 60px 80px 80px 80px 70px 120px', padding:'10px 16px', borderTop: ci>0?'1px solid #111':'none', transition:'background 0.1s', alignItems:'center' }}>
                              <div onClick={() => card.imageUrl && setLightboxImg({ url: card.imageUrl, player: card.player })}
                                style={{ width:34, height:50, borderRadius:5, overflow:'hidden', background:'#111', flexShrink:0, cursor: card.imageUrl ? 'zoom-in' : 'default' }}>
                                {card.imageUrl
                                  ? <img src={card.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, opacity:0.2 }}>🃏</div>
                                }
                              </div>
                              <div>
                                <div style={{ fontSize:12, fontWeight:700, color: card.sold?'#555':'#ccc', textTransform:'uppercase' }}>{card.player}</div>
                                <div style={{ display:'flex', gap:4, marginTop:2, flexWrap:'wrap', alignItems:'center' }}>
                                  {card.grade && (() => { const gc = gradeCol(card.grade); return <span style={{ fontSize:8, fontWeight:800, color:gc.c, background:gc.bg, padding:'1px 5px', borderRadius:3 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span> })()}
                                  {card.auto && (() => { const agc = card.autoGrade ? gradeCol(card.autoGrade) : { c:'#ffbe2e', bg:'rgba(255,190,46,0.12)', b:'rgba(255,190,46,0.3)' }; return <span style={{ fontSize:8, fontWeight:800, color:agc.c, background:agc.bg, padding:'1px 5px', borderRadius:3 }}>AUTO{card.autoGrade?` ${card.autoGrade}`:''}</span> })()}
                                  {card.num && String(card.num).includes('/') && <span style={{ fontSize:8, fontWeight:800, color:'#94a3b8', background:'rgba(148,163,184,0.1)', padding:'1px 5px', borderRadius:3 }}>#{card.num}</span>}
                                  {card.sold && <span style={{ fontSize:8, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', padding:'1px 5px', borderRadius:3 }}>SOLD</span>}
                                  {card.brand && <span style={{ fontSize:9, color:'#333' }}>{card.brand}</span>}
                                  <span style={{ fontSize:9, color:'#2a2a2a' }}>{fmtTime(card.createdAt)}</span>
                                </div>
                              </div>
                              <div style={{ fontSize:11, color:'#555', textAlign:'right' }}>{card.sport||'—'}</div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, color:'#555', textAlign:'right' }}>{card.year||'—'}</div>
                              <div style={{ textAlign:'right' }}>
                                {card.grade ? (() => { const gc = gradeCol(card.grade); return <span style={{ fontSize:10, fontWeight:800, color:gc.c, background:gc.bg, padding:'2px 6px', borderRadius:4 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span> })() : <span style={{ fontSize:10, color:'#333' }}>Raw</span>}
                              </div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:12, color:'#555', textAlign:'right' }}>{fmt(buy)}</div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:12, fontWeight:700, color:'#f0f0f0', textAlign:'right' }}>{fmt(val)}</div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, fontWeight:800, color:glPos?'#22c55e':'#ef4444', textAlign:'right' }}>{glPos?'+':''}{glPct.toFixed(0)}%</div>
                              <div style={{ display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end' }}>
                                {card.ownerAvatar
                                  ? <img src={card.ownerAvatar} alt="" style={{ width:18, height:18, borderRadius:'50%', objectFit:'cover' }} />
                                  : <div style={{ width:18, height:18, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{card.ownerUsername?.[0]?.toUpperCase()}</div>
                                }
                                <span style={{ fontSize:11, color:'#555' }}>@{card.ownerUsername}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })()}

        </div>
      </div>
    </>
  )
}
