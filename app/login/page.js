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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      router.push('/dashboard')
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Card<span style={{ color: 'var(--violet2)' }}>Vault</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--dim)' }}>Track your sports card investments</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-semibold text-center"
              style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--coral)', border: '1px solid rgba(248,113,113,0.2)' }}>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--dim)' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full p-3 rounded-xl text-base outline-none transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--violet)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="you@email.com" />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--dim)' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full p-3 rounded-xl text-base outline-none transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => e.target.style.borderColor = 'var(--violet)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full p-3.5 rounded-xl text-base font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'var(--violet)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--dim)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold" style={{ color: 'var(--violet2)' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
