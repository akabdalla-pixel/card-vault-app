'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const fmt = n => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', minimumFractionDigits:2 }).format(n||0)
const SPORT_EMOJI = { Basketball:'🏀', Football:'🏈', Baseball:'⚾', Soccer:'⚽', Hockey:'🏒', Golf:'⛳', Tennis:'🎾', 'Formula 1':'🏎️', 'F1':'🏎️', 'Pokémon':'🎴', 'Magic: The Gathering':'🃏', Other:'🃏' }

function IconFilter() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> }
function IconSearch() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }

export default function SharedCollectionPage() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [sportTab, setSportTab] = useState('all')
  const [filterGraded, setFilterGraded] = useState('')
  const [filterAuto, setFilterAuto] = useState(false)
  const [sortBy, setSortBy] = useState('date_desc')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/share/${username}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [username])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
      <img src={LOGO} alt="TopLoad" style={{ width:100, opacity:0.4, filter:'brightness(0) invert(1)', animation:'pulse 1.5s ease-in-out infinite' }} />
      <style>{`@keyframes pulse{0%,100%{opacity:0.2}50%{opacity:0.5}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0a0a0a', color:'#555', gap:16 }}>
      <img src={LOGO} alt="TopLoad" style={{ width:80, filter:'brightness(0) invert(1)', opacity:0.3 }} />
      <div style={{ fontSize:15, fontWeight:700 }}>Collection not found</div>
      <Link href="/" style={{ fontSize:13, color:'var(--accent)', textDecoration:'none' }}>← toploadcards.com</Link>
    </div>
  )

  const cards = data.cards
  const uniqueSports = [...new Set(cards.map(c => c.sport).filter(Boolean))]
  const hasFilters = filterGraded || filterAuto || priceMin || priceMax || sportTab !== 'all'

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || (c.player||'').toLowerCase().includes(q) || (c.brand||'').toLowerCase().includes(q) || (c.year||'').includes(q) || (c.name||'').toLowerCase().includes(q)
    const matchSport = sportTab === 'all' || c.sport === sportTab
    const matchGraded = !filterGraded || (filterGraded === 'graded' ? !!c.grade : !c.grade)
    const matchAuto = !filterAuto || !!c.auto
    const val = (parseFloat(c.val)||0) * (parseInt(c.qty)||1)
    const matchMin = !priceMin || val >= parseFloat(priceMin)
    const matchMax = !priceMax || val <= parseFloat(priceMax)
    return matchSearch && matchSport && matchGraded && matchAuto && matchMin && matchMax
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price_desc': return ((parseFloat(b.val)||0)*(parseInt(b.qty)||1)) - ((parseFloat(a.val)||0)*(parseInt(a.qty)||1))
      case 'price_asc': return ((parseFloat(a.val)||0)*(parseInt(a.qty)||1)) - ((parseFloat(b.val)||0)*(parseInt(b.qty)||1))
      case 'name_asc': return (a.player||'').localeCompare(b.player||'')
      case 'date_asc': return new Date(a.createdAt) - new Date(b.createdAt)
      default: return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const filteredValue = filtered.reduce((s,c) => s + (parseFloat(c.val)||0)*(parseInt(c.qty)||1), 0)

  return (
    <>
      <style>{`
        
        *{box-sizing:border-box;margin:0;padding:0;font-family:var(--font-geist-sans),-apple-system,sans-serif}
        body{background:#0a0a0a}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.2}50%{opacity:0.5}}
        .card-item{background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:14px 16px;transition:border-color 0.15s}
        .card-item:hover{border-color:rgba(var(--accent-rgb),0.3)}
        input:focus,select:focus{outline:none;border-color:var(--accent)!important}
      `}</style>

      <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff', paddingBottom:40 }}>

        {/* Nav */}
        <nav style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #111', position:'sticky', top:0, background:'rgba(10,10,10,0.92)', backdropFilter:'blur(12px)', zIndex:50 }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <img src={LOGO} alt="TopLoad" style={{ height:26, filter:'brightness(0) invert(1)' }} />
          </Link>
          <Link href="/signup" style={{ padding:'7px 14px', background:'var(--accent)', borderRadius:8, color:'#fff', fontSize:12, fontWeight:800, textDecoration:'none' }}>
            Track Yours →
          </Link>
        </nav>

        <div style={{ maxWidth:800, margin:'0 auto', padding:'24px 16px' }}>

          {/* Header */}
          <div style={{ marginBottom:20, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
            <div>
              <div style={{ fontSize:9, fontWeight:800, color:'var(--accent-light)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:5 }}>Public Collection</div>
              <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:'-0.8px', color:'#fff', margin:'0 0 3px' }}>@{data.username}</h1>
              <p style={{ fontSize:12, color:'#555' }}>{data.cardCount} cards · TopLoad</p>
            </div>
            <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:12, padding:'12px 18px', textAlign:'right' }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:3 }}>{filtered.length < cards.length ? 'Filtered Value' : 'Collection Value'}</div>
              <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:22, fontWeight:900, color:'#fff' }}>{fmt(filteredValue)}</div>
              {filtered.length < cards.length && <div style={{ fontSize:10, color:'#444', marginTop:2 }}>{filtered.length} of {cards.length} cards</div>}
            </div>
          </div>

          {/* Search + Filter row */}
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <div style={{ flex:1, position:'relative' }}>
              <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#444', pointerEvents:'none' }}><IconSearch /></div>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by player, brand, year..."
                style={{ width:'100%', padding:'10px 14px 10px 36px', borderRadius:10, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:13, transition:'border-color 0.15s' }}
              />
            </div>
            <button onClick={() => setFilterSheetOpen(true)} style={{ width:42, height:42, borderRadius:10, background: hasFilters?'var(--accent)':'#111', border: hasFilters?'none':'1px solid #1e1e1e', color: hasFilters?'#fff':'#555', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <IconFilter />
            </button>
          </div>

          {/* Sport chips */}
          {uniqueSports.length > 1 && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
              <button onClick={() => setSportTab('all')} style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', border: sportTab==='all'?'1px solid rgba(var(--accent-rgb),0.4)':'1px solid #2a2a2a', background: sportTab==='all'?'rgba(var(--accent-rgb),0.12)':'#111', color: sportTab==='all'?'var(--accent-light)':'#555' }}>All</button>
              {uniqueSports.map(s => (
                <button key={s} onClick={() => setSportTab(sportTab===s?'all':s)} style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', border: sportTab===s?'1px solid rgba(var(--accent-rgb),0.4)':'1px solid #2a2a2a', background: sportTab===s?'rgba(var(--accent-rgb),0.12)':'#111', color: sportTab===s?'var(--accent-light)':'#555' }}>
                  {SPORT_EMOJI[s]||'🃏'} {s}
                </button>
              ))}
            </div>
          )}

          {/* Sort bar */}
          <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
            {[['date_desc','Newest'],['price_desc','Value ↓'],['price_asc','Value ↑'],['name_asc','A→Z']].map(([val,label]) => (
              <button key={val} onClick={() => setSortBy(val)} style={{ padding:'5px 12px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer', border:'1px solid #1e1e1e', background: sortBy===val?'rgba(var(--accent-rgb),0.12)':'#111', color: sortBy===val?'var(--accent-light)':'#555' }}>{label}</button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px 24px', color:'#333', fontSize:14 }}>No cards match your filters</div>
            )}
            {filtered.map((c, i) => (
              <div key={c.id} className="card-item" style={{ animation:`fadeUp 0.25s ease ${Math.min(i*0.02,0.3)}s both` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>{SPORT_EMOJI[c.sport]||'🃏'}</span>
                      <div style={{ fontSize:14, fontWeight:800, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.player}</div>
                      {c.auto && <span style={{ fontSize:9, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', border:'1px solid rgba(255,190,46,0.2)', borderRadius:4, padding:'2px 5px', flexShrink:0 }}>AUTO</span>}
                    </div>
                    <div style={{ fontSize:11, color:'#555', display:'flex', flexWrap:'wrap', gap:4 }}>
                      {c.year && <span>{c.year}</span>}
                      {c.brand && <span>· {c.brand}</span>}
                      {c.name && <span>· {c.name}</span>}
                      {c.num && <span>· #{c.num}</span>}
                      {c.sport && <span>· {c.sport}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    {c.grade && (
                      <div style={{ fontSize:11, fontWeight:800, color:'var(--accent-light)', marginBottom:3 }}>
                        {c.gradingCo||'PSA'} {c.grade}
                      </div>
                    )}
                    {!c.grade && c.cond && <div style={{ fontSize:10, color:'#555', marginBottom:3 }}>{c.cond}</div>}
                    <div style={{ fontFamily:'var(--font-geist-mono)', fontSize:14, fontWeight:900, color:'#fff' }}>{fmt(c.val)}</div>
                    {c.qty > 1 && <div style={{ fontSize:10, color:'#444', marginTop:1 }}>×{c.qty}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{ marginTop:40, textAlign:'center', padding:'28px 20px', background:'#111', border:'1px solid #1a1a1a', borderRadius:16 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#555', marginBottom:10 }}>Track your own collection on TopLoad</div>
            <Link href="/signup" style={{ display:'inline-block', padding:'10px 24px', background:'var(--accent)', borderRadius:10, color:'#fff', fontSize:14, fontWeight:800, textDecoration:'none' }}>
              Get Started Free →
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Sheet */}
      {filterSheetOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)' }} onClick={() => setFilterSheetOpen(false)} />
          <div style={{ position:'relative', background:'#111', borderRadius:'20px 20px 0 0', border:'1px solid #1e1e1e', padding:'20px 20px 40px', zIndex:1, maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ width:40, height:4, borderRadius:2, background:'#333', margin:'0 auto 20px' }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <span style={{ fontSize:16, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'-0.3px' }}>Filters</span>
              <button onClick={() => { setFilterGraded(''); setFilterAuto(false); setPriceMin(''); setPriceMax(''); setSortBy('date_desc'); setSportTab('all') }} style={{ fontSize:11, color:'var(--accent)', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>Reset all</button>
            </div>

            {/* Grade */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Grade</div>
              <div style={{ display:'flex', gap:6 }}>
                {[['','All'],['graded','Graded'],['raw','Raw']].map(([val,label]) => (
                  <button key={val} onClick={() => setFilterGraded(val)} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #1e1e1e', background: filterGraded===val?'var(--accent)':'#1a1a1a', color: filterGraded===val?'#fff':'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Sport */}
            {uniqueSports.length > 1 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Sport</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button onClick={() => setSportTab('all')} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #1e1e1e', background: sportTab==='all'?'var(--accent)':'#1a1a1a', color: sportTab==='all'?'#fff':'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>All</button>
                  {uniqueSports.map(s => (
                    <button key={s} onClick={() => setSportTab(s)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #1e1e1e', background: sportTab===s?'var(--accent)':'#1a1a1a', color: sportTab===s?'#fff':'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Autograph</div>
              <button onClick={() => setFilterAuto(v => !v)} style={{ padding:'8px 16px', borderRadius:8, border:`1px solid ${filterAuto?'rgba(255,190,46,0.4)':'#1e1e1e'}`, background: filterAuto?'rgba(255,190,46,0.1)':'#1a1a1a', color: filterAuto?'#ffbe2e':'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>✍️ Autos Only</button>
            </div>

            {/* Sort */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Sort By</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {[['date_desc','Newest'],['date_asc','Oldest'],['price_desc','Value ↓'],['price_asc','Value ↑'],['name_asc','A→Z']].map(([val,label]) => (
                  <button key={val} onClick={() => setSortBy(val)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid #1e1e1e', background: sortBy===val?'var(--accent)':'#1a1a1a', color: sortBy===val?'#fff':'#555', fontSize:12, fontWeight:700, cursor:'pointer' }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Value Range</div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ flex:1, padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:14 }} />
                <span style={{ color:'#444' }}>—</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ flex:1, padding:'10px 12px', borderRadius:8, background:'#1a1a1a', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:14 }} />
              </div>
            </div>

            <button onClick={() => setFilterSheetOpen(false)} style={{ width:'100%', padding:'14px', borderRadius:12, background:'var(--accent)', border:'none', color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>Apply Filters</button>
          </div>
        </div>
      )}
    </>
  )
}
