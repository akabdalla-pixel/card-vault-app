'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, username, password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      router.push('/dashboard')
    } catch { setError('Something went wrong'); setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(229,57,53,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 36, textAlign: 'center', width: '100%' }}>
          <img src="/logo-transparent.png" alt="TopLoad" style={{ width: 280, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(229,57,53,0.3))' }} />
          <p style={{ marginTop: 8, fontSize: 13, color: '#555', fontFamily: "'Outfit',sans-serif", fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sports Card Investment Tracker</p>
        </div>
        <div style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 16, padding: '28px 28px 24px' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f0f0', margin: '0 0 20px', textAlign: 'center' }}>Create Account</h2>
          {error && <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(229,57,53,0.1)', color: '#ff5252', border: '1px solid rgba(229,57,53,0.25)', fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@email.com" onFocus={e => e.target.style.borderColor='#e53935'} onBlur={e => e.target.style.borderColor='#2a2a2a'} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} placeholder="Pick a username" onFocus={e => e.target.style.borderColor='#e53935'} onBlur={e => e.target.style.borderColor='#2a2a2a'} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="At least 6 characters" onFocus={e => e.target.style.borderColor='#e53935'} onBlur={e => e.target.style.borderColor='#2a2a2a'} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg,#e53935,#ff5252)', border: 'none', color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#555', fontFamily: "'Outfit',sans-serif" }}>
          Already have an account? <Link href="/login" style={{ color: '#e53935', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

