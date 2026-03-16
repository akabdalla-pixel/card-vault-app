'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LOGO = '/logo-transparent.png'

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (!form.username.trim()) { setError('Username is required'); return }
    if (!form.email.trim()) { setError('Email is required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.username, email: form.email, password: form.password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || `Error ${res.status}: Registration failed`); setLoading(false); return }
      router.push('/dashboard')
    } catch(e) { setError('Network error — please try again. ' + e.message); setLoading(false) }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-8px) } }
        .su-input { width:100%; padding:11px 14px; border-radius:10px; background:#1a1a1a; border:1px solid #2a2a2a; color:#f0f0f0; font-size:15px; outline:none; transition:border-color 0.15s; box-sizing:border-box; font-family:inherit; }
        .su-input:focus { border-color:#9333ea; box-shadow:0 0 0 3px rgba(147,51,234,0.12); }
        .su-input::placeholder { color:#444; }
        button:not(:disabled):active { transform:scale(0.97)!important; }
      `}</style>
      <div style={{ minHeight:'100vh', background:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ position:'fixed', top:'20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }} />

        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:380, animation:'fadeUp 0.4s ease' }}>

          <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:20, padding:32 }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
              <img src={LOGO} alt="TopLoad" style={{ width:180, height:'auto', filter:'brightness(0) invert(1)', animation:'float 4s ease-in-out infinite' }} />
            </div>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:22, fontWeight:900, color:'#f0f0f0', letterSpacing:'-0.5px', margin:'0 0 20px', textAlign:'center' }}>Create account</h2>

            {error && (
              <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:10, background:'rgba(248,113,113,0.08)', color:'#f87171', fontSize:13, border:'1px solid rgba(248,113,113,0.2)', fontFamily:"'Outfit',sans-serif" }}>
                {error}
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>Username</label>
                <input type="text" value={form.username} onChange={e => set('username', e.target.value)} required placeholder="yourname" className="su-input" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="you@email.com" className="su-input" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>Password</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required placeholder="8+ chars" className="su-input" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, fontFamily:"'Outfit',sans-serif" }}>Confirm</label>
                  <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required placeholder="Repeat" className="su-input" />
                </div>
              </div>
              <button type="button" onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:12, background: loading ? '#1a1a1a' : '#9333ea', border:'none', color:'#fff', fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:800, cursor: loading ? 'not-allowed' : 'pointer', marginTop:4, boxShadow: loading ? 'none' : '0 4px 20px rgba(147,51,234,0.3)', transition:'all 0.15s' }}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </div>

            <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'#555', marginTop:20, textAlign:'center' }}>
              Already have an account? <Link href="/login" style={{ color:'#a855f7', fontWeight:700, textDecoration:'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
