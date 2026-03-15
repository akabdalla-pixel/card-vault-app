'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => {
        if (r.status === 403) throw new Error('forbidden')
        if (r.status === 401) throw new Error('unauthorized')
        return r.json()
      })
      .then(d => { setUsers(d); setLoading(false) })
      .catch(e => {
        if (e.message === 'forbidden' || e.message === 'unauthorized') {
          router.push('/dashboard')
        } else {
          setError('Failed to load users')
          setLoading(false)
        }
      })
  }, [router])

  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: '#3a4465', fontFamily: "'Outfit',sans-serif" }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <img src="/logo-full.png" alt="TopLoad" style={{ height: 36, objectFit: 'contain' }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: '#4a5578', background: 'rgba(255,107,122,0.1)', border: '1px solid rgba(255,107,122,0.2)', color: '#ff6b7a', padding: '2px 10px', borderRadius: 6 }}>ADMIN</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f2ff', margin: 0 }}>Users</h1>
            <p style={{ fontSize: 13, color: '#4a5578', marginTop: 4 }}>{users.length} total user{users.length !== 1 ? 's' : ''} signed up</p>
          </div>
          <Link href="/dashboard" style={{ padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>← Dashboard</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            ['Total Users', users.length],
            ['Total Cards', users.reduce((s, u) => s + u._count.cards, 0)],
            ['Total Wishes', users.reduce((s, u) => s + u._count.wishes, 0)],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'linear-gradient(135deg,#131929,#0f1521)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: '#3a4465', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 700, color: '#f0f2ff' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* User table */}
        <div style={{ background: 'linear-gradient(135deg,#131929,#0f1521)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Username', 'Email', 'Cards', 'Wishes', 'Joined'].map((h, i) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: i === 0 ? 'left' : 'right', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: '#2e3759', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '13px 16px', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: '#c0c8e8' }}>@{user.username}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#6a75a0' }}>{user.email}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#f0f2ff' }}>{user._count.cards}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#f0f2ff' }}>{user._count.wishes}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#4a5578' }}>{fmt(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

