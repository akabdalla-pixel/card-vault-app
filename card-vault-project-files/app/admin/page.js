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
  const [dbView, setDbView] = useState('grid') // 'grid' | 'table'
  const [lightboxImg, setLightboxImg] = useState(null)
  const [dbOwner, setDbOwner] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => {
        if (r.status === 403 || r.status === 401) { router.push('/dashboard'); return null }
        return r.json()
      })
      .then(d => { if (d) { setData(d); setLoading(false) } })
      .catch(() => router.push('/dashboard'))
  }, [router])

  useEffect(() => {
    setPsaLoading(true)
    fetch('/api/admin/psa-cache')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setPsaCache(d) })
      .finally(() => setPsaLoading(false))
  }, [])

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
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:28 }}>
            {[
              { label:'Total Users',     value: stats.totalUsers,                           accent:'var(--accent)' },
              { label:'Total Cards',     value: stats.totalCards,                           accent:'var(--accent)' },
              { label:'Active Cards',    value: stats.totalActiveCards,                     accent:'#333' },
              { label:'Sold Cards',      value: stats.totalSoldCards,                       accent:'#ffbe2e' },
              { label:'Portfolio Value', value: fmt(stats.totalPortfolioValue),             accent:'#22c55e' },
              { label:'Total Invested',  value: fmt(stats.totalInvested),                   accent:'#333' },
              { label:'Cards This Week', value: stats.cardsThisWeek,                        accent:'var(--accent-light)' },
              { label:'Most Active',     value: '@'+stats.mostActiveUser,                   accent:'var(--accent)', small:true },
              { label:'PSA Lookups',     value: psaCache?.total ?? '—',                     accent:'var(--accent)' },
            ].map((s,i) => (
              <div key={i} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:'14px 16px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.accent }} />
                <div style={{ fontSize:9, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>{s.label}</div>
                <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:s.small?14:20, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Users section */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <h2 style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>Users ({users.length})</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:200 }} />
          </div>

          <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, overflow:'hidden' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr 60px 60px 80px 100px 100px 32px', gap:0, padding:'10px 16px', background:'#000', borderBottom:'1px solid #111' }}>
              {['User','Email','Cards','Sold','Wishes','Value','Joined',''].map((h,i) => (
                <div key={i} style={{ fontSize:9, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', textAlign: i>1?'right':'left' }}>{h}</div>
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
                  <div style={{ textAlign:'right', alignSelf:'center', fontSize:12, color: expanded===user.id?'var(--accent)':'#333', transition:'transform 0.15s', transform: expanded===user.id?'rotate(90deg)':'rotate(0deg)' }}>▶</div>
                </div>

                {expanded === user.id && (
                  <div style={{ background:'#080808', borderTop:'1px solid #111', borderBottom:'1px solid #111' }}>
                    <div style={{ display:'flex', gap:20, padding:'10px 16px 10px 32px', borderBottom:'1px solid #111' }}>
                      {[
                        { label:'Portfolio', value: fmt(user.portfolioValue), color:'#22c55e' },
                        { label:'Invested', value: fmt(user.invested), color:'#fff' },
                        { label:'G/L', value: (user.portfolioValue-user.invested>=0?'+':'')+fmt(user.portfolioValue-user.invested), color: user.portfolioValue>=user.invested?'#22c55e':'#ef4444' },
                        { label:'Active', value: user.cardCount - user.soldCount, color:'#fff' },
                        { label:'Sold', value: user.soldCount, color:'#ffbe2e' },
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
                        {user.cards.map((card, ci) => {
                          const buy = parseFloat(card.buy)||0
                          const val = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||buy)
                          const gl = val - buy
                          const glPos = gl >= 0
                          const glPct = buy > 0 ? (gl/buy)*100 : 0
                          return (
                            <div key={card.id} className="card-row" style={{ display:'grid', gridTemplateColumns:'1.5fr 80px 60px 80px 80px 80px 70px', padding:'9px 16px 9px 32px', borderTop:'1px solid #0d0d0d', transition:'background 0.1s' }}>
                              <div>
                                <div style={{ fontSize:12, fontWeight:700, color: card.sold?'#555':'#ccc', textTransform:'uppercase', letterSpacing:'-0.2px' }}>{card.player}</div>
                                <div style={{ display:'flex', gap:4, marginTop:2 }}>
                                  {card.sold && <span style={{ fontSize:8, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', padding:'1px 5px', borderRadius:3 }}>SOLD</span>}
                                  {card.auto && <span style={{ fontSize:8, fontWeight:800, color:'var(--accent-light)', background:'rgba(var(--accent-rgb),0.1)', padding:'1px 5px', borderRadius:3 }}>AUTO</span>}
                                  {card.brand && <span style={{ fontSize:9, color:'#333' }}>{card.brand}</span>}
                                </div>
                              </div>
                              <div style={{ fontSize:11, color:'#555', alignSelf:'center' }}>{card.sport ? <SportEmoji sport={card.sport} /> : '—'} {card.sport||'—'}</div>
                              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, color:'#555', textAlign:'right', alignSelf:'center' }}>{card.year||'—'}</div>
                              <div style={{ textAlign:'right', alignSelf:'center' }}>
                                {card.grade
                                  ? <span style={{ fontSize:10, fontWeight:800, color:'var(--accent-light)', background:'rgba(var(--accent-rgb),0.1)', padding:'2px 6px', borderRadius:4 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span>
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
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PSA Cache Section */}
          <div style={{ marginTop:40 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <h2 style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>PSA Lookup Cache ({psaCache?.total ?? 0})</h2>
                <div style={{ padding:'2px 8px', background:'rgba(var(--accent-rgb),0.1)', border:'1px solid rgba(var(--accent-rgb),0.25)', borderRadius:4, fontSize:9, fontWeight:800, color:'var(--accent-light)', letterSpacing:'0.1em' }}>24H CACHE</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input value={psaSearch} onChange={e => setPsaSearch(e.target.value)} placeholder="Search certs..." style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:200 }} />
                <button onClick={() => { setPsaLoading(true); fetch('/api/admin/psa-cache').then(r=>r.json()).then(d=>setPsaCache(d)).finally(()=>setPsaLoading(false)) }}
                  style={{ padding:'7px 14px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                  {psaLoading ? '...' : '↻ Refresh'}
                </button>
              </div>
            </div>

            <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:14, overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'60px 1.5fr 60px 80px 60px 80px 80px 80px 100px', gap:0, padding:'10px 16px', background:'#000', borderBottom:'1px solid #111' }}>
                {['Img','Player','Cert','Grade','Sport','Year','Brand','Pop','Updated'].map((h,i) => (
                  <div key={i} style={{ fontSize:9, fontWeight:700, color:'#333', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:i>1?'right':'left' }}>{h}</div>
                ))}
              </div>

              {psaLoading && !psaCache && (
                <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>Loading...</div>
              )}

              {psaCache?.entries?.length === 0 && (
                <div style={{ padding:'32px', textAlign:'center', fontSize:13, color:'#444' }}>No PSA lookups yet</div>
              )}

              {(psaCache?.entries || [])
                .filter(e => !psaSearch || e.player.toLowerCase().includes(psaSearch.toLowerCase()) || e.cert.includes(psaSearch) || e.sport.toLowerCase().includes(psaSearch.toLowerCase()))
                .map((entry, i) => {
                  const ageHours = (Date.now() - new Date(entry.updatedAt).getTime()) / (1000 * 60 * 60)
                  const isFresh = ageHours < 24
                  return (
                    <div key={entry.cert} className="card-row" style={{ display:'grid', gridTemplateColumns:'60px 1.5fr 60px 80px 60px 80px 80px 80px 100px', gap:0, padding:'10px 16px', borderTop: i>0?'1px solid #111':'none', alignItems:'center', transition:'background 0.1s' }}>
                      <div>
                        {entry.frontImage
                          ? <img src={entry.frontImage} alt="" style={{ width:36, height:50, objectFit:'cover', borderRadius:4, border:'1px solid #222' }} onError={e => e.target.style.display='none'} />
                          : <div style={{ width:36, height:50, background:'#111', borderRadius:4, border:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#333' }}>—</div>
                        }
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:800, color: entry.isCancelled?'#ef4444':'#e0e0e0', letterSpacing:'-0.2px' }}>{entry.player}</div>
                        <div style={{ fontSize:10, color:'#444', marginTop:1 }}>{entry.set !== '—' ? entry.set : ''}</div>
                        {entry.isCancelled && <span style={{ fontSize:8, fontWeight:800, color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'1px 5px', borderRadius:3 }}>CANCELLED</span>}
                      </div>
                      <div style={{ textAlign:'right' }}>
                        {entry.certPageUrl
                          ? <a href={entry.certPageUrl} target="_blank" rel="noreferrer" style={{ fontFamily:'var(--font-geist-mono)', fontSize:10, color:'var(--accent-light)', textDecoration:'none' }}>{entry.cert}</a>
                          : <span style={{ fontFamily:'var(--font-geist-mono)', fontSize:10, color:'#555' }}>{entry.cert}</span>
                        }
                      </div>
                      <div style={{ textAlign:'right' }}>
                        {entry.grade !== '—'
                          ? <span style={{ fontSize:10, fontWeight:800, color:'var(--accent-light)', background:'rgba(var(--accent-rgb),0.1)', padding:'2px 6px', borderRadius:4 }}>PSA {entry.grade}</span>
                          : <span style={{ fontSize:10, color:'#333' }}>—</span>
                        }
                      </div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, color:'#555', textAlign:'right' }}>{entry.sport}</div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, color:'#555', textAlign:'right' }}>{entry.year}</div>
                      <div style={{ fontSize:11, color:'#555', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.brand}</div>
                      <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:11, color:'#fff', textAlign:'right', fontWeight:700 }}>{entry.totalPop}</div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:10, color:'#444' }}>{fmtTime(entry.updatedAt)}</div>
                        <div style={{ marginTop:2 }}>
                          <span style={{ fontSize:8, fontWeight:800, padding:'1px 5px', borderRadius:3, background: isFresh?'rgba(34,197,94,0.1)':'rgba(255,190,46,0.1)', color: isFresh?'#22c55e':'#ffbe2e' }}>
                            {isFresh ? 'FRESH' : 'STALE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          {/* ── Card Database ── */}
          {(() => {
            // Flatten all cards across all users, attach owner username
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
            })

            return (
              <div style={{ marginTop:40 }}>
                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <h2 style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>Card Database ({allCards.length})</h2>
                    <div style={{ padding:'2px 8px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:4, fontSize:9, fontWeight:800, color:'#22c55e', letterSpacing:'0.1em' }}>{withPhotos} WITH PHOTOS</div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {/* Search */}
                    <input value={dbSearch} onChange={e => setDbSearch(e.target.value)} placeholder="Search cards..." style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:12, outline:'none', width:180 }} />
                    {/* Sport filter */}
                    <select value={dbSport} onChange={e => setDbSport(e.target.value)} style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color: dbSport?'#f0f0f0':'#555', fontSize:12, outline:'none' }}>
                      <option value="">All Sports</option>
                      {sports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {/* Owner filter */}
                    <select value={dbOwner} onChange={e => setDbOwner(e.target.value)} style={{ padding:'7px 12px', borderRadius:8, background:'#111', border:'1px solid #1e1e1e', color: dbOwner?'#f0f0f0':'#555', fontSize:12, outline:'none' }}>
                      <option value="">All Users</option>
                      {owners.map(o => <option key={o} value={o}>@{o}</option>)}
                    </select>
                    {/* View toggle */}
                    <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid #1e1e1e' }}>
                      {['grid','table'].map(v => (
                        <button key={v} onClick={() => setDbView(v)} style={{ padding:'7px 14px', background: dbView===v ? 'rgba(var(--accent-rgb),0.15)' : '#111', border:'none', color: dbView===v ? 'var(--accent)' : '#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                          {v === 'grid' ? '⊞ Grid' : '☰ Table'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

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
                          {/* Card image */}
                          <div style={{ position:'relative', width:'100%', paddingTop:'146.75%', background:'#0a0a0a', overflow:'hidden' }}>
                            {card.imageUrl
                              ? <img src={card.imageUrl} alt={card.player}
                                  onClick={() => setLightboxImg({ url: card.imageUrl, player: card.player })}
                                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain', cursor:'zoom-in' }} />
                              : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, opacity:0.15 }}>🃏</div>
                            }
                            {/* Badges overlay */}
                            <div style={{ position:'absolute', top:6, right:6, display:'flex', flexDirection:'column', gap:3, alignItems:'flex-end' }}>
                              {card.grade && (() => { const gc = gradeCol(card.grade); return <span style={{ background:'rgba(0,0,0,0.8)', border:`1px solid ${gc.b}`, color:gc.c, fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span> })()}
                              {card.auto && (() => { const agc = card.autoGrade ? gradeCol(card.autoGrade) : { c:'#ffbe2e', bg:'rgba(255,190,46,0.12)', b:'rgba(255,190,46,0.3)' }; return <span style={{ background:'rgba(0,0,0,0.8)', border:`1px solid ${agc.b}`, color:agc.c, fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>AUTO{card.autoGrade ? ` ${card.autoGrade}` : ''}</span> })()}
                              {card.num && String(card.num).includes('/') && <span style={{ background:'rgba(0,0,0,0.8)', border:'1px solid rgba(148,163,184,0.4)', color:'#94a3b8', fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>#{card.num}</span>}
                            </div>
                            {card.sold && <div style={{ position:'absolute', top:6, left:6, background:'rgba(255,190,46,0.9)', color:'#000', fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4 }}>SOLD</div>}
                          </div>
                          {/* Info */}
                          <div style={{ padding:'10px 12px' }}>
                            <div style={{ fontSize:12, fontWeight:800, color:'#fff', textTransform:'uppercase', letterSpacing:'-0.2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{card.player}</div>
                            <div style={{ fontSize:10, color:'#555', marginBottom:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{[card.year, card.sport, card.brand].filter(Boolean).join(' · ')}</div>
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
                          {/* Thumbnail */}
                          <div onClick={() => card.imageUrl && setLightboxImg({ url: card.imageUrl, player: card.player })}
                            style={{ width:34, height:50, borderRadius:5, overflow:'hidden', background:'#111', flexShrink:0, cursor: card.imageUrl ? 'zoom-in' : 'default' }}>
                            {card.imageUrl
                              ? <img src={card.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, opacity:0.2 }}>🃏</div>
                            }
                          </div>
                          {/* Player + badges */}
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color: card.sold?'#555':'#ccc', textTransform:'uppercase' }}>{card.player}</div>
                            <div style={{ display:'flex', gap:4, marginTop:2, flexWrap:'wrap' }}>
                              {card.grade && (() => { const gc = gradeCol(card.grade); return <span style={{ fontSize:8, fontWeight:800, color:gc.c, background:gc.bg, padding:'1px 5px', borderRadius:3 }}>{card.gradingCo?card.gradingCo+' ':''}{card.grade}</span> })()}
                              {card.auto && (() => { const agc = card.autoGrade ? gradeCol(card.autoGrade) : { c:'#ffbe2e', bg:'rgba(255,190,46,0.12)', b:'rgba(255,190,46,0.3)' }; return <span style={{ fontSize:8, fontWeight:800, color:agc.c, background:agc.bg, padding:'1px 5px', borderRadius:3 }}>AUTO{card.autoGrade?` ${card.autoGrade}`:''}</span> })()}
                              {card.num && String(card.num).includes('/') && <span style={{ fontSize:8, fontWeight:800, color:'#94a3b8', background:'rgba(148,163,184,0.1)', padding:'1px 5px', borderRadius:3 }}>#{card.num}</span>}
                              {card.sold && <span style={{ fontSize:8, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', padding:'1px 5px', borderRadius:3 }}>SOLD</span>}
                              {card.brand && <span style={{ fontSize:9, color:'#333' }}>{card.brand}</span>}
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
              </div>
            )
          })()}

        </div>
      </div>
    </>
  )
}
