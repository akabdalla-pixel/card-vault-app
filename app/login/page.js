'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(6,214,214,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 380, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img
            src="/logo-full.png"
            alt="TopLoad"
            style={{ width: 180, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(6,214,214,0.2))' }}
          />
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--dim)', fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>
            Sports Card Investment Tracker
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 28px 24px' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '0 0 20px', textAlign: 'center' }}>Sign In</h2>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,122,0.1)', color: 'var(--coral)', border: '1px solid rgba(255,107,122,0.2)', fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s' }} placeholder="you@email.com"
                onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'Outfit',sans-serif" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s' }} placeholder="Your password"
                onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, var(--cyan), var(--cyan2))', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--dim)', fontFamily: "'Outfit',sans-serif" }}>
          No account?{' '}
          <Link href="/signup" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
