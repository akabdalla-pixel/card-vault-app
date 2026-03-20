'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Collection', href: '/collection' },
  { label: 'Friends', href: '/friends' },
  { label: 'Insights', href: '/insights' },
  { label: 'Market', href: '/market' },
  { label: 'PSA Lookup', href: '/psa' },
]

function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconCollection() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> }
function IconFriends() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IconInsights() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function IconMarket() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function IconShield() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IconLogout() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
function IconClose() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IconSearch() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconX() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IconCheck() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IconLoader() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 1s linear infinite'}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Friends': IconFriends, 'Insights': IconInsights, 'Market': IconMarket, 'PSA Lookup': IconShield }
const fmt = n => '$' + Math.round(n).toLocaleString('en-US')

function Sidebar({ user, onLogout, active = "" }) {
  return (
    <aside style={{ width:200, minHeight:'100vh', background:'#000', borderRight:'1px solid #111', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, zIndex:60 }}>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid #111', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src="/logo-transparent.png" alt="TopLoad" style={{ width:140, height:'auto', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV.map(({ label, href }) => {
          const isActive = active === label
          const Icon = navIcons[label]
          if (!Icon) return null
          return (
            <Link key={label} href={href} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color: isActive ? '#fff' : '#555', background: isActive ? 'var(--accent)' : 'transparent', fontSize:13, fontWeight: isActive ? 700 : 500, transition:'all 0.15s', letterSpacing:'0.01em' }}>
              <Icon />
              <span style={{flex:1}}>{label}</span>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'12px 8px', borderTop:'1px solid #111' }}>
        <Link href="/settings" style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', color:'#555', fontSize:13, fontWeight:500 }}><IconSettings /><span>Settings</span></Link>
        <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#555', fontSize:13, fontWeight:500 }}><IconLogout /><span>Sign Out</span></button>
        {user && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', marginTop:4, borderRadius:10, background:'#111' }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'var(--accent)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff', flexShrink:0 }}>{user.avatar ? <img src={user.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : user.username?.[0]?.toUpperCase()||'A'}</div>
          <div style={{overflow:'hidden'}}><div style={{ fontSize:11, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>@{user.username}</div><div style={{ fontSize:9, color:'#555', marginTop:1 }}>{user.email}</div></div>
        </div>}
      </div>
    </aside>
  )
}

function BottomNav({ active = "" }) {
  const SHORT = { 'Dashboard':'Home', 'Collection':'Cards', 'Friends':'Friends', 'Insights':'Stats', 'Market':'Market', 'PSA Lookup':'PSA' }
  return (
    <nav className="mobile-only" style={{ position:'fixed', bottom:0, left:0, right:0, height:76, background:'#000', borderTop:'1px solid #111', display:'flex', alignItems:'center', zIndex:100 }}>
      {NAV.map(({ label, href }) => {
        const isActive = active === label
        const Icon = navIcons[label]
        if (!Icon) return null
        return (
          <Link key={label} href={href} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, textDecoration:'none', paddingBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background: isActive ? 'var(--accent)' : 'transparent', color: isActive ? '#fff' : '#444', transition:'all 0.15s' }}><Icon /></div>
            <span style={{ fontSize:10, fontWeight:800, color: isActive ? 'var(--accent)' : '#444', letterSpacing:'0.06em', textTransform:'uppercase' }}>{SHORT[label]||label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function TradeProposalModal({ friend, user, onClose, onSend }) {
  const [myCards, setMyCards] = useState([])
  const [theirCards, setTheirCards] = useState([])
  const [mySelected, setMySelected] = useState(new Set())
  const [theirSelected, setTheirSelected] = useState(new Set())
  const [myCash, setMyCash] = useState('')
  const [theirCash, setTheirCash] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/cards').then(r => r.json()),
      fetch(`/api/friends/cards?friendId=${friend.userId || friend.id}`).then(r => r.json())
    ]).then(([mine, theirs]) => {
      setMyCards(mine || [])
      setTheirCards(theirs || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [friend.id])

  const handleSend = async () => {
    setSending(true)
    try {
      await fetch('/api/trades/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: friend.userId || friend.id,
          proposerCards: Array.from(mySelected),
          receiverCards: Array.from(theirSelected),
          proposerCash: parseFloat(myCash) || 0,
          receiverCash: parseFloat(theirCash) || 0,
          message
        })
      })
      onSend()
    } catch {
      setSending(false)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#181818', border:'1px solid #2a2a2a', borderRadius:16, width:'100%', maxWidth:700, maxHeight:'90vh', overflowY:'auto', padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-geist-sans)', fontSize:17, fontWeight:700, color:'#f0f0f0', margin:0 }}>Propose Trade with @{friend.username}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', padding:4 }}><IconClose /></button>
        </div>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 20px', gap:8 }}>
            <IconLoader />
            <span style={{ color:'#666', fontSize:13 }}>Loading cards...</span>
          </div>
        ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
              {/* Your Cards */}
              <div>
                <h3 style={{ fontSize:13, fontWeight:700, color:'#f0f0f0', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.05em' }}>Your Cards</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, maxHeight:300, overflowY:'auto', paddingRight:8 }}>
                  {myCards.length === 0 ? (
                    <div style={{ gridColumn:'1/-1', padding:'20px', textAlign:'center', color:'#555', fontSize:12 }}>No cards to offer</div>
                  ) : myCards.map(card => (
                    <div
                      key={card.id}
                      onClick={() => setMySelected(prev => {
                        const next = new Set(prev)
                        if (next.has(card.id)) next.delete(card.id)
                        else next.add(card.id)
                        return next
                      })}
                      style={{ padding:12, borderRadius:10, background: mySelected.has(card.id) ? 'rgba(var(--accent-rgb),0.15)' : '#111', border: mySelected.has(card.id) ? '1.5px solid var(--accent)' : '1px solid #1a1a1a', cursor:'pointer', transition:'all 0.15s' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{card.player}</div>
                      <div style={{ fontSize:9, color:'#555', marginTop:2 }}>{card.year} · {card.sport}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Their Cards */}
              <div>
                <h3 style={{ fontSize:13, fontWeight:700, color:'#f0f0f0', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.05em' }}>Their Cards</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, maxHeight:300, overflowY:'auto', paddingRight:8 }}>
                  {theirCards.length === 0 ? (
                    <div style={{ gridColumn:'1/-1', padding:'20px', textAlign:'center', color:'#555', fontSize:12 }}>No cards available</div>
                  ) : theirCards.map(card => (
                    <div
                      key={card.id}
                      onClick={() => setTheirSelected(prev => {
                        const next = new Set(prev)
                        if (next.has(card.id)) next.delete(card.id)
                        else next.add(card.id)
                        return next
                      })}
                      style={{ padding:12, borderRadius:10, background: theirSelected.has(card.id) ? 'rgba(var(--accent-rgb),0.15)' : '#111', border: theirSelected.has(card.id) ? '1.5px solid var(--accent)' : '1px solid #1a1a1a', cursor:'pointer', transition:'all 0.15s' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{card.player}</div>
                      <div style={{ fontSize:9, color:'#555', marginTop:2 }}>{card.year} · {card.sport}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cash and message */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>You Add (Cash)</label>
                <input type="number" value={myCash} onChange={e => setMyCash(e.target.value)} placeholder="0" style={{ width:'100%', padding:'10px 12px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:14, outline:'none' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>They Add (Cash)</label>
                <input type="number" value={theirCash} onChange={e => setTheirCash(e.target.value)} placeholder="0" style={{ width:'100%', padding:'10px 12px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:14, outline:'none' }} />
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Message (Optional)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Add a note about this trade..." style={{ width:'100%', padding:'10px 12px', borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color:'#f0f0f0', fontSize:13, outline:'none', fontFamily:'var(--font-geist-sans)', minHeight:60, resize:'none' }} />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={onClose} style={{ flex:1, padding:11, borderRadius:10, background:'#202020', border:'1px solid #2a2a2a', color:'#666', fontFamily:'var(--font-geist-sans)', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleSend} disabled={sending || (mySelected.size === 0 && theirSelected.size === 0 && !myCash && !theirCash)} style={{ flex:1, padding:11, borderRadius:10, background:'linear-gradient(135deg,var(--accent),var(--accent-light))', border:'none', color:'#000', fontFamily:'var(--font-geist-sans)', fontSize:14, fontWeight:700, cursor:'pointer', opacity: sending ? 0.5 : 1 }}>{sending ? 'Sending...' : 'Send Trade Proposal'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function FriendsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('friends')
  const [loading, setLoading] = useState(true)
  const [friends, setFriends] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [incomingRequests, setIncomingRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [trades, setTrades] = useState([])
  const [tradeProposal, setTradeProposal] = useState(null)
  const searchTimeout = useRef(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d?.id) { router.push('/login'); return }
      setUser(d)
      loadFriends()
      loadFriends()
      loadTrades()
    }).catch(() => router.push('/login'))
  }, [])

  const loadFriends = async () => {
    const res = await fetch('/api/friends/list').then(r => r.json())
    setFriends(res.friends || [])
    setIncomingRequests(res.incoming || [])
    setSentRequests(res.sent || [])
  }

  const loadTrades = async () => {
    const res = await fetch('/api/trades/list').then(r => r.json())
    setTrades(res || [])
    setLoading(false)
  }

  const handleSearch = async (q) => {
    setSearchQuery(q)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    if (!q) { setSearchResults([]); return }
    setSearching(true)
    searchTimeout.current = setTimeout(async () => {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(q)}`).then(r => r.json())
      setSearchResults(res || [])
      setSearching(false)
    }, 300)
  }

  const handleAddFriend = async (userId) => {
    await fetch('/api/friends/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipientId: userId }) })
    loadFriends()
  }

  const handleRespondRequest = async (friendshipId, action) => {
    await fetch('/api/friends/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ friendshipId, action }) })
    loadFriends()
    loadFriends()
  }

  const handleRemoveFriend = async (friendId) => {
    if (!confirm('Remove this friend?')) return
    await fetch('/api/friends/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ friendshipId: friendId }) })
    loadFriends()
  }

  const handleTradeAction = async (tradeId, action) => {
    await fetch('/api/trades/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tradeId, action }) })
    loadTrades()
  }

  if (!user) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap');
        *{font-family:var(--font-geist-sans),-apple-system,sans-serif!important}
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}
        .main-wrap{margin-left:200px;min-height:100vh;width:calc(100% - 200px)}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media(max-width:768px){
          .sidebar-el{display:none!important}.mobile-only{display:flex!important}
          .main-wrap{margin-left:0!important;width:100%!important;padding-bottom:90px!important}
        }
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh', background:'#0a0a0a' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={() => { fetch('/api/auth/logout'); router.push('/login') }} active="Friends" /></div>
        <main className="main-wrap" style={{ padding:'28px 32px', background:'#0a0a0a' }}>

          {/* Tabs */}
          <div style={{ display:'flex', gap:10, marginBottom:28, borderBottom:'1px solid #111', paddingBottom:16 }}>
            {[
              { id:'friends', label:'Friends', count:friends.length },
              { id:'trades', label:'Trades', count:trades.length },
              { id:'requests', label:'Requests', count:incomingRequests.length }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding:'8px 16px',
                  borderRadius:8,
                  border:'1px solid ' + (tab === t.id ? 'var(--accent)' : '#1a1a1a'),
                  background: tab === t.id ? 'var(--accent)' : 'transparent',
                  color: tab === t.id ? '#000' : '#888',
                  fontSize:13,
                  fontWeight: tab === t.id ? 700 : 600,
                  cursor:'pointer',
                  transition:'all 0.15s',
                  position:'relative'
                }}>
                {t.label}
                {t.count > 0 && <span style={{ marginLeft:6, padding:'2px 6px', borderRadius:4, background: tab === t.id ? 'rgba(0,0,0,0.3)' : '#2a2a2a', fontSize:11, fontWeight:700 }}>{t.count}</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 20px', gap:8 }}>
              <IconLoader />
              <span style={{ color:'#666', fontSize:13 }}>Loading...</span>
            </div>
          ) : (
            <>
              {/* FRIENDS TAB */}
              {tab === 'friends' && (
                <div>
                  <div style={{ marginBottom:24 }}>
                    <div style={{ position:'relative' }}>
                      <input
                        type="text"
                        placeholder="Search users by username..."
                        value={searchQuery}
                        onChange={e => handleSearch(e.target.value)}
                        style={{ width:'100%', padding:'12px 16px 12px 38px', borderRadius:12, background:'#111', border:'1px solid #222', color:'#f0f0f0', fontSize:14, outline:'none' }}
                      />
                      <IconSearch style={{ position:'absolute', left:12, top:13, color:'#555' }} />
                    </div>

                    {searchQuery && (
                      <div style={{ marginTop:12, maxHeight:300, overflowY:'auto' }}>
                        {searching ? (
                          <div style={{ padding:'16px', textAlign:'center', color:'#666', fontSize:13 }}>Searching...</div>
                        ) : searchResults.length === 0 ? (
                          <div style={{ padding:'16px', textAlign:'center', color:'#555', fontSize:13 }}>No users found</div>
                        ) : (
                          searchResults.map(u => (
                            <div key={u.id} style={{ padding:'12px 14px', borderRadius:10, background:'#111', border:'1px solid #1a1a1a', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                              <div>
                                <div style={{ fontSize:13, fontWeight:600, color:'#f0f0f0' }}>@{u.username}</div>
                                <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{u.email}</div>
                              </div>
                              <button onClick={() => { handleAddFriend(u._id || u.id); setSearchQuery('') }} style={{ padding:'6px 14px', borderRadius:8, background:'var(--accent)', border:'none', color:'#000', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Add</button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize:13, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Friends ({friends.length})</h3>
                  {friends.length === 0 ? (
                    <div style={{ padding:'40px 20px', textAlign:'center', color:'#555' }}>
                      <div style={{ fontSize:36, marginBottom:12, opacity:0.3 }}>👥</div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#666', marginBottom:8 }}>No friends yet</div>
                      <div style={{ fontSize:12, color:'#444' }}>Search for users above to add friends</div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {friends.map(f => (
                        <div key={f.id} style={{ padding:'14px 16px', borderRadius:12, background:'#111', border:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                            <div style={{ width:32, height:32, borderRadius:8, background:'var(--accent)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff', flexShrink:0 }}>{f.avatar ? <img src={f.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : f.username?.[0]?.toUpperCase()||'U'}</div>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:13, fontWeight:600, color:'#f0f0f0' }}>@{f.username}</div>
                              <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{f.cardCount} cards</div>
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:8 }}>
                            <button onClick={() => setTradeProposal(f)} style={{ padding:'6px 12px', borderRadius:8, background:'var(--accent)', border:'none', color:'#000', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Trade</button>
                            <button onClick={() => handleRemoveFriend(f.friendshipId)} style={{ padding:'6px 12px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:600, cursor:'pointer' }}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TRADES TAB */}
              {tab === 'trades' && (
                <div>
                  {trades.length === 0 ? (
                    <div style={{ padding:'40px 20px', textAlign:'center', color:'#555' }}>
                      <div style={{ fontSize:36, marginBottom:12, opacity:0.3 }}>🤝</div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#666', marginBottom:8 }}>No trades yet</div>
                      <div style={{ fontSize:12, color:'#444' }}>Go to Friends tab and click Trade to propose a trade</div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {trades.map(trade => {
                        const isPending = trade.status === 'pending'
                        const isProposer = (trade.proposer?._id || trade.proposerId) === user.id
                        const isReceiver = (trade.receiver?._id || trade.receiverId) === user.id
                        const otherUser = isProposer ? trade.receiver : trade.proposer
                        return (
                          <div key={trade.id} style={{ padding:'16px', borderRadius:12, background:'#111', border:'1px solid #1a1a1a', opacity: !isPending ? 0.6 : 1 }}>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                              <div>
                                <div style={{ fontSize:13, fontWeight:700, color:'#f0f0f0' }}>
                                  {isProposer ? `You proposed to @${otherUser.username}` : `@${otherUser.username} proposed to you`}
                                </div>
                                <div style={{ fontSize:11, color:'#555', marginTop:4 }}>
                                  {trade.proposerCardIds?.length || 0} cards offered {trade.proposerCash > 0 ? `+ ${fmt(trade.proposerCash)}` : ''} for {trade.receiverCardIds?.length || 0} cards {trade.receiverCash > 0 ? `+ ${fmt(trade.receiverCash)}` : ''}
                                </div>
                              </div>
                              <span style={{ padding:'4px 12px', borderRadius:6, background: trade.status === 'accepted' ? 'rgba(34,197,94,0.1)' : trade.status === 'declined' ? 'rgba(239,68,68,0.1)' : 'rgba(255,190,46,0.1)', color: trade.status === 'accepted' ? '#22c55e' : trade.status === 'declined' ? '#ef4444' : '#ffbe2e', fontSize:11, fontWeight:700, textTransform:'uppercase' }}>{trade.status}</span>
                            </div>
                            {isPending && (
                              <div style={{ display:'flex', gap:8 }}>
                                {isReceiver && (
                                  <>
                                    <button onClick={() => handleTradeAction(trade._id || trade.id, 'accept')} style={{ flex:1, padding:'8px 12px', borderRadius:8, background:'#22c55e', border:'none', color:'#000', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Accept</button>
                                    <button onClick={() => handleTradeAction(trade._id || trade.id, 'decline')} style={{ flex:1, padding:'8px 12px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Decline</button>
                                  </>
                                )}
                                {isProposer && (
                                  <button onClick={() => handleTradeAction(trade._id || trade.id, 'cancel')} style={{ flex:1, padding:'8px 12px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer' }}>Cancel</button>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* REQUESTS TAB */}
              {tab === 'requests' && (
                <div>
                  {incomingRequests.length === 0 && sentRequests.length === 0 ? (
                    <div style={{ padding:'40px 20px', textAlign:'center', color:'#555' }}>
                      <div style={{ fontSize:36, marginBottom:12, opacity:0.3 }}>📬</div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#666', marginBottom:8 }}>No requests</div>
                      <div style={{ fontSize:12, color:'#444' }}>Friend requests will appear here</div>
                    </div>
                  ) : (
                    <>
                      {incomingRequests.length > 0 && (
                        <>
                          <h3 style={{ fontSize:13, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Incoming ({incomingRequests.length})</h3>
                          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                            {incomingRequests.map(req => (
                              <div key={req.id} style={{ padding:'14px 16px', borderRadius:12, background:'#111', border:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                                <div>
                                  <div style={{ fontSize:13, fontWeight:600, color:'#f0f0f0' }}>@{req.fromUser.username}</div>
                                  <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{req.fromUser.email}</div>
                                </div>
                                <div style={{ display:'flex', gap:8 }}>
                                  <button onClick={() => handleRespondRequest(req.id, 'accept')} style={{ padding:'6px 12px', borderRadius:8, background:'#22c55e', border:'none', color:'#000', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><IconCheck style={{width:12, height:12}} /> Accept</button>
                                  <button onClick={() => handleRespondRequest(req.id, 'decline')} style={{ padding:'6px 12px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', fontFamily:'var(--font-geist-sans)', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><IconX style={{width:12, height:12}} /> Decline</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {sentRequests.length > 0 && (
                        <>
                          <h3 style={{ fontSize:13, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Sent ({sentRequests.length})</h3>
                          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                            {sentRequests.map(req => (
                              <div key={req.id} style={{ padding:'14px 16px', borderRadius:12, background:'#111', border:'1px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'space-between', opacity:0.7 }}>
                                <div>
                                  <div style={{ fontSize:13, fontWeight:600, color:'#f0f0f0' }}>@{req.toUser.username}</div>
                                  <div style={{ fontSize:11, color:'#555', marginTop:2 }}>Pending...</div>
                                </div>
                                <span style={{ fontSize:11, color:'#888', fontWeight:600 }}>Awaiting response</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

        </main>
        <BottomNav active="Friends" />
      </div>

      {/* Trade Proposal Modal */}
      {tradeProposal && (
        <TradeProposalModal
          friend={tradeProposal}
          user={user}
          onClose={() => setTradeProposal(null)}
          onSend={() => { setTradeProposal(null); loadTrades() }}
        />
      )}
    </>
  )
}

export default function FriendsPageWrapper() {
  return <FriendsPage />
}
