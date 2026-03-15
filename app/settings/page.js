'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Wish List', href: '/wishlist' },
]
function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconWishlist() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Wish List': IconWishlist }

function Sidebar({ user, onLogout }) {
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#0b0e1c', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 60 }}>
      <div style={{ padding: '26px 22px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800 }}><span style={{ color: '#f0f2ff' }}>Top</span><span style={{ color: 'var(--cyan)' }}>Load</span></div>
        <div style={{ fontSize: 10, color: '#3a4465', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>Card Investment Tracker</div>
      </div>
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: 10, color: '#2e3759', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Menu</div>
        {NAV.map(({ label, href }) => {
          const Icon = navIcons[label]
          return <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: '#6a75a0', background: 'transparent', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500, borderLeft: '2px solid transparent', transition: 'all 0.15s' }}><Icon />{label}</Link>
        })}
      </nav>
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {user && <div style={{ padding: '10px 12px', marginBottom: 4, borderRadius: 10, background: 'rgba(255,255,255,0.03)', fontFamily: "'Outfit',sans-serif" }}><div style={{ fontSize: 12, fontWeight: 700, color: '#c0c8e8' }}>@{user.username}</div><div style={{ fontSize: 11, color: '#3a4465', marginTop: 1 }}>{user.email}</div></div>}
        <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: 'var(--cyan)', background: 'rgba(6,214,214,0.08)', borderLeft: '2px solid var(--cyan)', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600 }}><IconSettings />Settings</Link>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconLogout />Sign Out</button>
      </div>
    </aside>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }
      setUser((await res.json()).user)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div style={{ color: '#3a4465', fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>Loading...</div></div>

  return (
    <>
      <style>{`
        .sidebar-el { display:flex; flex-direction:column; }
        .mob-topbar  { display:none; }
        .main-wrap   { margin-left:220px; min-height:100vh; width:calc(100% - 220px); }
        @media(max-width:768px){
          .sidebar-el { display:none !important; }
          .mob-topbar { display:flex; }
          .main-wrap  { margin-left:0 !important; width:100% !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} /></div>

        <main className="main-wrap" style={{ padding: '30px 28px' }}>
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800 }}><span style={{ color: '#f0f2ff' }}>Top</span><span style={{ color: 'var(--cyan)' }}>Load</span></span>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.5px', margin: 0 }}>Settings</h1>
            <p style={{ fontSize: 13, color: '#4a5578', marginTop: 4, fontWeight: 500 }}>Manage your account</p>
          </div>

          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Account Info */}
            <div style={{ background: 'linear-gradient(135deg,#131929,#0f1521)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: '#c0c8e8', marginBottom: 16 }}>Account Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#3a4465', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Username</div>
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', fontFamily: "'Outfit',sans-serif", fontSize: 14, color: '#c0c8e8' }}>@{user?.username}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#3a4465', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Email</div>
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', fontFamily: "'Outfit',sans-serif", fontSize: 14, color: '#c0c8e8' }}>{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <div style={{ background: 'linear-gradient(135deg,#131929,#0f1521)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 22 }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, color: '#c0c8e8', marginBottom: 6 }}>Sign Out</h2>
              <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 16 }}>Sign out of your TopLoad account on this device.</p>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'rgba(255,107,122,0.08)', border: '1px solid rgba(255,107,122,0.2)', color: '#ff6b7a', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                <IconLogout /> Sign Out
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
