'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      router.push('/dashboard')
    } catch { setError('Something went wrong'); setLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap');
        *{font-family:'Geist',-apple-system,sans-serif!important}
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-8px) } }
        .login-input { width:100%; padding:11px 14px; border-radius:10px; background:#1a1a1a; border:1px solid #2a2a2a; color:#f0f0f0; font-size:15px; outline:none; transition:border-color 0.15s; box-sizing:border-box; font-family:inherit; }
        .login-input:focus { border-color:#9333ea; box-shadow:0 0 0 3px rgba(147,51,234,0.12); }
        .login-input::placeholder { color:#444; }
        button:not(:disabled):active { transform:scale(0.97)!important; }
      `}</style>
      <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        {/* Subtle background accent */}
        <div style={{ position:'fixed', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:380, animation:'fadeUp 0.4s ease' }}>

          {/* Logo */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:28 }}>
            <img src={LOGO} alt="TopLoad" style={{ width:200, height:'auto', filter:'brightness(0) invert(1)', animation:'float 4s ease-in-out infinite', display:'block', margin:'0 auto' }} />
          </div>

          {/* Card */}
          <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:20, padding:32 }}>
            <h2 style={{ fontFamily:"'Geist',sans-serif", fontSize:22, fontWeight:900, color:'#f0f0f0', letterSpacing:'-0.5px', margin:'0 0 6px' }}>Welcome back</h2>
            

            {error && (
              <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:10, background:'rgba(248,113,113,0.08)', color:'#f87171', fontSize:13, border:'1px solid rgba(248,113,113,0.2)', fontFamily:"'Geist',sans-serif" }}>
                {error}
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Geist',sans-serif" }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" className="login-input" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Geist',sans-serif" }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" className="login-input" />
              </div>
              <button type="button" onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:12, background: loading ? '#1a1a1a' : '#9333ea', border:'none', color:'#fff', fontFamily:"'Geist',sans-serif", fontSize:15, fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer', marginTop:4, boxShadow: loading ? 'none' : '0 4px 20px rgba(147,51,234,0.3)', transition:'all 0.15s', letterSpacing:'-0.2px' }}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </div>

            <div style={{ marginTop:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:"'Geist',sans-serif", fontSize:13, color:'#555' }}>
                No account? <Link href="/signup" style={{ color:'#a855f7', fontWeight:700, textDecoration:'none' }}>Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
