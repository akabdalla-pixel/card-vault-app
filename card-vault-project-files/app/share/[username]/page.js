'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'
const fmt = n => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', minimumFractionDigits:2 }).format(n||0)

const SPORT_EMOJI = { Basketball:'🏀', Football:'🏈', Baseball:'⚾', Soccer:'⚽', Hockey:'🏒', Golf:'⛳', Tennis:'🎾', 'Formula 1':'🏎️', 'F1':'🏎️', 'Pokémon':'🎴', 'Magic: The Gathering':'🃏' }

export default function SharedCollectionPage() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sport, setSport] = useState('')

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
      <Link href="/" style={{ fontSize:13, color:'#9333ea', textDecoration:'none' }}>← toploadcards.com</Link>
    </div>
  )

  const sports = [...new Set(data.cards.map(c => c.sport).filter(Boolean))]
  const filtered = data.cards.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || (c.player||'').toLowerCase().includes(q) || (c.brand||'').toLowerCase().includes(q) || (c.year||'').includes(q)
    const matchSport = !sport || c.sport === sport
    return matchSearch && matchSport
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; font-family:'Space Grotesk',-apple-system,sans-serif }
        body { background:#0a0a0a }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card-item { background:#111; border:1px solid #1a1a1a; border-radius:12px; padding:14px 16px; transition:border-color 0.15s; animation:fadeUp 0.3s ease both }
        .card-item:hover { border-color:rgba(147,51,234,0.3) }
        .sport-chip { padding:5px 12px; borderRadius:20px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid #2a2a2a; transition:all 0.15s }
        input:focus { outline:none; border-color:#9333ea!important }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff' }}>

        {/* Nav */}
        <nav style={{ padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #111', position:'sticky', top:0, background:'rgba(10,10,10,0.9)', backdropFilter:'blur(12px)', zIndex:50 }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <img src={LOGO} alt="TopLoad" style={{ height:28, filter:'brightness(0) invert(1)' }} />
          </Link>
          <Link href="/signup" style={{ padding:'7px 16px', background:'#9333ea', borderRadius:8, color:'#fff', fontSize:12, fontWeight:800, textDecoration:'none' }}>
            Track Your Collection →
          </Link>
        </nav>

        <div style={{ maxWidth:800, margin:'0 auto', padding:'32px 16px 60px' }}>

          {/* Header */}
          <div style={{ marginBottom:28, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>Collection</div>
              <h1 style={{ fontSize:32, fontWeight:900, letterSpacing:'-1px', color:'#fff', margin:'0 0 4px' }}>@{data.username}</h1>
              <p style={{ fontSize:13, color:'#555' }}>{data.cardCount} cards · powered by TopLoad</p>
            </div>
            <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:12, padding:'14px 20px', textAlign:'right' }}>
              <div style={{ fontSize:9, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Collection Value</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:24, fontWeight:900, color:'#fff' }}>{fmt(data.totalValue)}</div>
            </div>
          </div>

          {/* Search + filters */}
          <div style={{ marginBottom:20, display:'flex', flexDirection:'column', gap:10 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search cards..."
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, background:'#111', border:'1px solid #1e1e1e', color:'#f0f0f0', fontSize:14 }}
            />
            {sports.length > 1 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <button onClick={() => setSport('')} style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', border:'1px solid #2a2a2a', background: !sport?'rgba(147,51,234,0.15)':'#111', color: !sport?'#a855f7':'#555' }}>All</button>
                {sports.map(s => (
                  <button key={s} onClick={() => setSport(sport===s?'':s)} style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer', border: sport===s?'1px solid rgba(147,51,234,0.4)':'1px solid #2a2a2a', background: sport===s?'rgba(147,51,234,0.12)':'#111', color: sport===s?'#a855f7':'#555' }}>
                    {SPORT_EMOJI[s]||'🃏'} {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px 24px', color:'#333', fontSize:14 }}>No cards found</div>
            )}
            {filtered.map((c, i) => (
              <div key={c.id} className="card-item" style={{ animationDelay:`${i*0.03}s` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:16 }}>{SPORT_EMOJI[c.sport]||'🃏'}</span>
                      <div style={{ fontSize:15, fontWeight:800, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.player}</div>
                      {c.auto && <span style={{ fontSize:9, fontWeight:800, color:'#ffbe2e', background:'rgba(255,190,46,0.1)', border:'1px solid rgba(255,190,46,0.2)', borderRadius:4, padding:'2px 5px' }}>AUTO</span>}
                    </div>
                    <div style={{ fontSize:11, color:'#555', display:'flex', flexWrap:'wrap', gap:6 }}>
                      {c.year && <span>{c.year}</span>}
                      {c.brand && <span>· {c.brand}</span>}
                      {c.name && <span>· {c.name}</span>}
                      {c.num && <span>· #{c.num}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    {c.grade && (
                      <div style={{ fontSize:11, fontWeight:800, color:'#a855f7', marginBottom:4 }}>
                        {c.gradingCo||'PSA'} {c.grade}
                      </div>
                    )}
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:900, color:'#fff' }}>{fmt(c.val)}</div>
                    {c.qty > 1 && <div style={{ fontSize:10, color:'#444', marginTop:2 }}>×{c.qty}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{ marginTop:48, textAlign:'center', padding:'32px 24px', background:'#111', border:'1px solid #1a1a1a', borderRadius:16 }}>
            <img src={LOGO} alt="TopLoad" style={{ height:32, filter:'brightness(0) invert(1)', marginBottom:16, opacity:0.6 }} />
            <div style={{ fontSize:15, fontWeight:700, color:'#888', marginBottom:8 }}>Track your own card collection</div>
            <Link href="/signup" style={{ display:'inline-block', padding:'10px 24px', background:'#9333ea', borderRadius:10, color:'#fff', fontSize:14, fontWeight:800, textDecoration:'none' }}>
              Get Started Free →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
