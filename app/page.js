'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Geist', -apple-system, sans-serif; }
        body { background: #0a0a0a; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-8px) } }
        @keyframes ticker { 0% { transform:translateX(0) } 100% { transform:translateX(-50%) } }
        .fade1 { animation: fadeUp 0.6s ease 0.1s both }
        .fade2 { animation: fadeUp 0.6s ease 0.2s both }
        .fade3 { animation: fadeUp 0.6s ease 0.3s both }
        .fade4 { animation: fadeUp 0.6s ease 0.4s both }
        .btn-primary { display:inline-flex; align-items:center; justify-content:center; padding:14px 32px; background:#9333ea; border:none; border-radius:10px; color:#fff; font-size:15px; font-weight:900; text-decoration:none; cursor:pointer; transition:all 0.15s; }
        .btn-primary:hover { background:#a855f7; transform:translateY(-1px) }
        .btn-secondary { display:inline-flex; align-items:center; justify-content:center; padding:14px 32px; background:transparent; border:1px solid #2a2a2a; border-radius:10px; color:#888; font-size:15px; font-weight:700; text-decoration:none; cursor:pointer; transition:all 0.15s; }
        .btn-secondary:hover { border-color:#9333ea; color:#a855f7; transform:translateY(-1px) }
        .ticker-wrap { overflow:hidden; border-top:1px solid #111; border-bottom:1px solid #111; padding:12px 0; background:#000; }
        .ticker-inner { display:flex; gap:0; white-space:nowrap; animation:ticker 20s linear infinite; width:max-content; }
        .ticker-item { display:inline-flex; align-items:center; gap:8px; padding:0 32px; font-size:13px; font-weight:700; color:#444; }
        .ticker-item span { font-size:18px; }
        .step-card { background:#111; border:1px solid #1a1a1a; border-radius:16px; padding:20px 18px; flex:1; min-width:220px; position:relative; }
        .mock-screen { background:#111; border:1px solid #1e1e1e; border-radius:14px; overflow:hidden; max-width:720px; margin:0 auto; box-shadow:0 40px 80px rgba(0,0,0,0.6); }
        .mock-topbar { background:#000; border-bottom:1px solid #111; padding:10px 16px; display:flex; align-items:center; gap:8px; }
        .mock-dot { width:8px; height:8px; border-radius:50%; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff' }}>

        {/* Nav */}
        <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(10,10,10,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid #111' }}>
          <img src="/logo-transparent.png" alt="TopLoad" style={{ height:32, filter:'brightness(0) invert(1)' }} />
          <div style={{ display:'flex', gap:10 }}>
            <Link href="/login" className="btn-secondary" style={{ padding:'8px 20px', fontSize:13 }}>Sign In</Link>
            <Link href="/signup" className="btn-primary" style={{ padding:'8px 20px', fontSize:13 }}>Sign Up Free</Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 24px 40px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, background:'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
          <img className="fade1" src="/logo-transparent.png" alt="TopLoad" style={{ height:140, filter:'brightness(0) invert(1)', marginBottom:24, animation:'float 4s ease-in-out infinite' }} />
          <h1 className="fade2" style={{ fontSize:'clamp(36px,6vw,64px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-2.5px', marginBottom:20, maxWidth:800 }}>
            Every card.<br /><span style={{ color:'#9333ea' }}>Every dollar.</span><br />One place.
          </h1>
          <p className="fade3" style={{ fontSize:'clamp(16px,2.5vw,20px)', color:'#555', maxWidth:520, lineHeight:1.6, marginBottom:40 }}>
            Your entire collection, organized and valued in one place.
          </p>
          <div className="fade4" style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:20 }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize:16, padding:'16px 40px' }}>Get Started Free</Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize:16, padding:'16px 40px' }}>Sign In</Link>
          </div>
          <p style={{ fontSize:12, color:'#333', fontWeight:600 }}>No credit card required · Free forever</p>
        </div>

        {/* Sports ticker */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...Array(2)].map((_, ri) =>
              ['🏀 Basketball','⚾ Baseball','🏈 Football','⚽ Soccer','🏎️ Formula 1','🎴 Pokémon','🏒 Hockey','⛳ Golf','🎾 Tennis','✨ TCG'].map((s,i) => (
                <div key={`${ri}-${i}`} className="ticker-item"><span>{s.split(' ')[0]}</span>{s.split(' ').slice(1).join(' ')}</div>
              ))
            )}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div style={{ padding:'48px 24px', maxWidth:800, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:10 }}>What it looks like</div>
            <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, letterSpacing:'-1px' }}>Built for the serious collector</h2>
          </div>
          <div className="mock-screen">
            <div className="mock-topbar">
              <div className="mock-dot" style={{ background:'#ef4444' }} />
              <div className="mock-dot" style={{ background:'#ffbe2e' }} />
              <div className="mock-dot" style={{ background:'#22c55e' }} />
              <div style={{ flex:1, textAlign:'center', fontSize:11, color:'#333', fontWeight:600 }}>toploadcards.com/dashboard</div>
            </div>
            <div style={{ padding:'20px', background:'#0a0a0a' }}>
              {/* Mock stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
                {[
                  { label:'Portfolio Value', value:'$4,280', color:'#fff', accent:'#9333ea' },
                  { label:'Total Gain', value:'+$920', color:'#22c55e', accent:'#22c55e' },
                  { label:'Active Cards', value:'47', color:'#fff', accent:'#333' },
                ].map((s,i) => (
                  <div key={i} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:10, padding:'12px 14px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.accent }} />
                    <div style={{ fontSize:8, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontFamily:"'Geist',sans-serif", fontSize:18, fontWeight:900, color:s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Mock card list */}
              <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:10, overflow:'hidden' }}>
                {[
                  { player:'LeBron James RC', sport:'2003 · Basketball', grade:'PSA 9', val:'$1,200', gl:'+$800', pos:true },
                  { player:'Patrick Mahomes', sport:'2017 · Football', grade:'PSA 10', val:'$950', gl:'+$550', pos:true },
                  { player:'Jalen Brunson', sport:'2018 · Basketball', grade:'PSA 10', val:'$280', gl:'-$20', pos:false },
                ].map((c,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom: i<2?'1px solid #141414':'none' }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:800, color:'#fff', textTransform:'uppercase', letterSpacing:'-0.2px' }}>{c.player}</div>
                      <div style={{ fontSize:10, color:'#444', marginTop:2 }}>{c.sport} · <span style={{ color:'#a855f7' }}>{c.grade}</span></div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'Geist',sans-serif", fontSize:13, fontWeight:800, color:'#fff' }}>{c.val}</div>
                      <div style={{ fontFamily:"'Geist',sans-serif", fontSize:11, fontWeight:700, color:c.pos?'#22c55e':'#ef4444' }}>{c.gl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ padding:'0 24px 48px', maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#a855f7', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:10 }}>Simple by design</div>
            <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, letterSpacing:'-1px' }}>How it works</h2>
          </div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[
              { step:'01', title:'Add your cards', desc:'Log every card you own — player, year, grade, brand, purchase price. Import via CSV or add one by one.' },
              { step:'02', title:'Track your values', desc:'Update current values anytime. See your portfolio gain or loss at a glance, broken down by card.' },
              { step:'03', title:'See your gains', desc:'View insights, personal records, top movers, and realized profit on every card you\'ve sold.' },
            ].map((s,i) => (
              <div key={i} className="step-card">
                <div style={{ fontFamily:"'Geist',sans-serif", fontSize:11, fontWeight:900, color:'rgba(147,51,234,0.4)', marginBottom:14, letterSpacing:'0.1em' }}>{s.step}</div>
                <div style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:8, letterSpacing:'-0.3px' }}>{s.title}</div>
                <div style={{ fontSize:12, color:'#555', lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ padding:'0 24px 40px', display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          {[
            { icon:'🔒', label:'PSA Verified', desc:'Look up any PSA cert number directly in the app' },
            { icon:'💳', label:'No Credit Card', desc:'Free to use, no payment ever required' },
            { icon:'📱', label:'Mobile App', desc:'Install on iPhone or Android as a home screen app' },
          ].map((b,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', background:'#111', border:'1px solid #1a1a1a', borderRadius:12, minWidth:220 }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{b.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:2 }}>{b.label}</div>
                <div style={{ fontSize:11, color:'#555' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding:'40px 24px 56px', textAlign:'center', borderTop:'1px solid #111', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:300, background:'radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
          <img src="/logo-transparent.png" alt="TopLoad" style={{ height:40, filter:'brightness(0) invert(1)', marginBottom:16, animation:'float 4s ease-in-out infinite' }} />
          <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, letterSpacing:'-1px', marginBottom:8 }}>Ready to start tracking?</h2>
          <p style={{ fontSize:15, color:'#555', marginBottom:4 }}>Free to use. No credit card required.</p>
          <p style={{ fontSize:13, color:'#333', marginBottom:24 }}>Join collectors already tracking their cards on TopLoad</p>
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
