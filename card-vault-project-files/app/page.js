'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Space Grotesk', -apple-system, sans-serif; }
        body { background: #0a0a0a; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-8px) } }
        .fade1 { animation: fadeUp 0.6s ease 0.1s both }
        .fade2 { animation: fadeUp 0.6s ease 0.2s both }
        .fade3 { animation: fadeUp 0.6s ease 0.3s both }
        .fade4 { animation: fadeUp 0.6s ease 0.4s both }
        .fade5 { animation: fadeUp 0.6s ease 0.5s both }
        .btn-primary { display:inline-flex; align-items:center; justify-content:center; padding:14px 32px; background:#9333ea; border:none; border-radius:10px; color:#fff; font-size:15px; font-weight:900; text-decoration:none; cursor:pointer; transition:all 0.15s; letter-spacing:0.02em; }
        .btn-primary:hover { background:#a855f7; transform:translateY(-1px) }
        .btn-secondary { display:inline-flex; align-items:center; justify-content:center; padding:14px 32px; background:transparent; border:1px solid #2a2a2a; border-radius:10px; color:#888; font-size:15px; font-weight:700; text-decoration:none; cursor:pointer; transition:all 0.15s; }
        .btn-secondary:hover { border-color:#9333ea; color:#a855f7; transform:translateY(-1px) }
        .feature-card { background:#111; border:1px solid #1a1a1a; border-radius:16px; padding:28px 24px; transition:border-color 0.2s; }
        .feature-card:hover { border-color:rgba(147,51,234,0.3) }
        .stat-num { font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:900; color:#fff; letter-spacing:-1px; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff' }}>

        {/* Nav */}
        <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(10,10,10,0.85)', backdropFilter:'blur(12px)', borderBottom:'1px solid #111' }}>
          <img src="/logo-transparent.png" alt="TopLoad" style={{ height:32, filter:'brightness(0) invert(1)' }} />
          <div style={{ display:'flex', gap:10 }}>
            <Link href="/login" className="btn-secondary" style={{ padding:'8px 20px', fontSize:13 }}>Sign In</Link>
            <Link href="/signup" className="btn-primary" style={{ padding:'8px 20px', fontSize:13 }}>Sign Up Free</Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 24px 80px', position:'relative', overflow:'hidden' }}>
          {/* Purple glow bg */}
          <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, background:'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

          <div className="fade1" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', background:'rgba(147,51,234,0.1)', border:'1px solid rgba(147,51,234,0.25)', borderRadius:100, fontSize:12, fontWeight:700, color:'#a855f7', letterSpacing:'0.08em', marginBottom:28, textTransform:'uppercase' }}>
            🃏 Sports Card Investment Tracker
          </div>

          <h1 className="fade2" style={{ fontSize:'clamp(42px,8vw,80px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-2.5px', marginBottom:20, maxWidth:800 }}>
            Know what your<br />
            <span style={{ color:'#9333ea' }}>cards are worth.</span>
          </h1>

          <p className="fade3" style={{ fontSize:'clamp(16px,2.5vw,20px)', color:'#555', maxWidth:520, lineHeight:1.6, marginBottom:40 }}>
            Track values, monitor gains and losses, and get insights on your entire sports card portfolio — all in one place.
          </p>

          <div className="fade4" style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:60 }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize:16, padding:'16px 40px' }}>Get Started Free</Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize:16, padding:'16px 40px' }}>Sign In</Link>
          </div>

          {/* Mock stats */}
          <div className="fade5" style={{ display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center' }}>
            {[
              { label:'Portfolio Value', value:'$4,280', color:'#fff' },
              { label:'Total Gain', value:'+$920', color:'#22c55e' },
              { label:'Cards Tracked', value:'47', color:'#fff' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="stat-num" style={{ color:s.color }}>{s.value}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ padding:'0 24px 100px', maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:12 }}>Everything you need</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-1px' }}>Built for collectors<br /><span style={{ color:'#9333ea' }}>who think like investors.</span></h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {[
              {
                icon:'📈',
                title:'Real-Time Portfolio',
                desc:'See your total portfolio value, unrealized gains, and realized P&L updated every time you log in.'
              },
              {
                icon:'🃏',
                title:'Card Collection',
                desc:'Log every card with grade, purchase price, current value, sport, and more. Filter and sort instantly.'
              },
              {
                icon:'📊',
                title:'Insights & Stats',
                desc:'Personal records, sport breakdown, top gainers and losers — understand your collection at a glance.'
              },
              {
                icon:'🏷️',
                title:'Track Sales',
                desc:'Mark cards as sold, log the sale price, and track your realized profit over time.'
              },
              {
                icon:'🔍',
                title:'Price Lookup',
                desc:'Search recent eBay sold listings directly from your collection to price any card in seconds.'
              },
              {
                icon:'📱',
                title:'Mobile First',
                desc:'Install as a home screen app on iPhone or Android. Tracks your portfolio wherever you go.'
              },
            ].map((f,i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize:28, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:8, letterSpacing:'-0.3px' }}>{f.title}</div>
                <div style={{ fontSize:13, color:'#555', lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'60px 24px 100px', textAlign:'center', borderTop:'1px solid #111', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:300, background:'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
          <img src="/logo-transparent.png" alt="TopLoad" style={{ height:40, filter:'brightness(0) invert(1)', marginBottom:24, animation:'float 4s ease-in-out infinite' }} />
          <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-1px', marginBottom:12 }}>Ready to start tracking?</h2>
          <p style={{ fontSize:15, color:'#555', marginBottom:32 }}>Free to use. No credit card required.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize:15, padding:'14px 36px' }}>Create Free Account</Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize:15, padding:'14px 36px' }}>Sign In</Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'20px 32px', borderTop:'1px solid #111', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'#333' }}>© {new Date().getFullYear()} TopLoad Cards. All rights reserved.</div>
          <div style={{ display:'flex', gap:20 }}>
            <Link href="/login" style={{ fontSize:12, color:'#333', textDecoration:'none' }}>Sign In</Link>
            <Link href="/signup" style={{ fontSize:12, color:'#333', textDecoration:'none' }}>Sign Up</Link>
          </div>
        </div>

      </div>
    </>
  )
}
