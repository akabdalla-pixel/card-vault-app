'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const SPORTS = ['Basketball','Baseball','Football','Soccer','Hockey','Tennis','Golf','Boxing','MMA','Racing','Other']

function fmt(v) { v = Number(v) || 0; return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fgl(v) { v = Number(v) || 0; return (v >= 0 ? '+$' : '-$') + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fpct(v) { v = Number(v) || 0; return (v >= 0 ? '+' : '') + v.toFixed(1) + '%' }
function cc(v) { return v > 0 ? 'text-emerald-400' : v < 0 ? 'text-red-400' : '' }
function ebayUrl(player, name, year, grade) {
  const parts = [player, name, year, grade].filter(p => p && p.trim())
  return 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(parts.join(' ')) + '&LH_Sold=1&LH_Complete=1&_sop=13'
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('dash')
  const [cards, setCards] = useState([])
  const [wishes, setWishes] = useState([])
  const [search, setSearch] = useState('')
  const [wishSearch, setWishSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) router.push('/login')
      else { setUser(d.user); setLoading(false) }
    })
  }, [router])

  const loadData = useCallback(() => {
    fetch('/api/cards').then(r => r.json()).then(setCards)
    fetch('/api/wishes').then(r => r.json()).then(setWishes)
  }, [])

  useEffect(() => { if (user) loadData() }, [user, loadData])

  async function saveCard() {
    if (!form.player?.trim()) return alert('Player name required')
    const method = editing ? 'PUT' : 'POST'
    const body = editing ? { ...form, id: editing } : form
    await fetch('/api/cards', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setModal(null); setEditing(null); setForm({}); loadData()
  }
  async function deleteCard() {
    if (!confirm('Delete this card?')) return
    await fetch('/api/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing }) })
    setModal(null); setEditing(null); setForm({}); loadData()
  }
  async function saveWish() {
    if (!form.player?.trim()) return alert('Player name required')
    const method = editing ? 'PUT' : 'POST'
    const body = editing ? { ...form, id: editing } : form
    await fetch('/api/wishes', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setModal(null); setEditing(null); setForm({}); loadData()
  }
  async function deleteWish() {
    if (!confirm('Delete this item?')) return
    await fetch('/api/wishes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing }) })
    setModal(null); setEditing(null); setForm({}); loadData()
  }
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}><div className="text-lg font-semibold" style={{ color: 'var(--dim)' }}>Loading...</div></div>

  const tc = cards.reduce((s, c) => s + (c.qty || 1), 0)
  const ti = cards.reduce((s, c) => s + (c.buy || 0) * (c.qty || 1), 0)
  const tv = cards.reduce((s, c) => s + (c.val || 0) * (c.qty || 1), 0)
  const tgl = tv - ti
  const tret = ti > 0 ? (tgl / ti * 100) : 0
  let best = null
  cards.forEach(c => { if (c.buy > 0) { const r = ((c.val - c.buy) / c.buy) * 100; if (!best || r > best.r) best = { n: c.player + ' - ' + (c.name || c.brand || ''), r } } })
  const byS = {}
  SPORTS.forEach(s => { byS[s] = { c: 0, i: 0, v: 0 } })
  cards.forEach(c => { const sp = c.sport || 'Other', q = c.qty || 1; if (!byS[sp]) byS[sp] = { c: 0, i: 0, v: 0 }; byS[sp].c += q; byS[sp].i += (c.buy || 0) * q; byS[sp].v += (c.val || 0) * q })
  const sportRows = SPORTS.filter(s => byS[s].c > 0)
  const totS = { c: 0, i: 0, v: 0 }; sportRows.forEach(s => { totS.c += byS[s].c; totS.i += byS[s].i; totS.v += byS[s].v })
  const ranked = cards.filter(c => c.buy > 0).map(c => ({ ...c, ret: ((c.val - c.buy) / c.buy) * 100 })).sort((a, b) => b.ret - a.ret).slice(0, 10)
  let filteredCards = cards
  if (search) { const q = search.toLowerCase(); filteredCards = filteredCards.filter(c => (c.player || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q) || (c.brand || '').toLowerCase().includes(q) || (c.sport || '').toLowerCase().includes(q)) }
  let filteredWishes = wishes
  if (wishSearch) { const q = wishSearch.toLowerCase(); filteredWishes = filteredWishes.filter(w => (w.player || '').toLowerCase().includes(q) || (w.name || '').toLowerCase().includes(q) || (w.sport || '').toLowerCase().includes(q)) }
  filteredWishes.sort((a, b) => { const o = { high: 0, medium: 1, low: 2 }; return (o[a.pri] ?? 1) - (o[b.pri] ?? 1) })
  const openAdd = () => { setEditing(null); setForm(tab === 'wish' ? { pri: 'medium', status: 'watching' } : { qty: 1 }); setModal(tab === 'wish' ? 'wish' : 'card') }
  const openEditCard = (c) => { setEditing(c.id); setForm({ ...c }); setModal('card') }
  const openEditWish = (w) => { setEditing(w.id); setForm({ ...w }); setModal('wish') }
  const inp = "w-full p-3 rounded-xl text-[15px] outline-none"
  const inpStyle = { background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)' }

  return (
    <div className="flex flex-col max-w-[500px] mx-auto" style={{ height: '100dvh', background: 'var(--bg)' }}>
      <header className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="text-[22px] font-extrabold tracking-tight">Top<span style={{ color: 'var(--cyan)' }}>Load</span></div>
        <button onClick={() => setModal('settings')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--dim)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-28">
        {tab === 'dash' && <>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[['Total Cards', tc, ''], ['Total Invested', fmt(ti), ''], ['Current Value', fmt(tv), ''], ['Gain / Loss', fgl(tgl), tgl], ['Portfolio Return', fpct(tret), tret], ['Best Return', best ? best.n : '-', 1]].map(([label, val, v], i) => (
              <div key={i} className="rounded-2xl p-3.5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--faint)' }}>{label}</div>
                <div className={'font-mono text-xl font-bold ' + (i === 5 ? 'text-emerald-400 !text-[13px]' : cc(v))}>{val}</div>
                {i === 5 && best && <div className="text-xs mt-1" style={{ color: 'var(--dim)' }}>{fpct(best.r)}</div>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2.5 my-5"><span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--faint)' }}>By Sport</span><div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div></div>
          <div className="rounded-2xl overflow-hidden mb-2" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <table className="w-full border-collapse">
              <thead><tr>{['Sport','Cards','Invested','Value','G/L'].map(h => <th key={h} className="text-[10px] font-bold uppercase tracking-wide text-left p-2.5" style={{ color: 'var(--faint)', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead>
              <tbody>
                {sportRows.length ? sportRows.map(s => { const d = byS[s], gl = d.v - d.i; return (
                  <tr key={s}><td className="p-2.5 text-[13px]">{s}</td><td className="p-2.5 font-mono text-[11px]">{d.c}</td><td className="p-2.5 font-mono text-[11px]">{fmt(d.i)}</td><td className="p-2.5 font-mono text-[11px]">{fmt(d.v)}</td><td className={'p-2.5 font-mono text-[11px] ' + (gl >= 0 ? 'text-emerald-400' : 'text-red-400')}>{fgl(gl)}</td></tr>
                )}) : <tr><td colSpan="5" className="p-5 text-center text-sm" style={{ color: 'var(--faint)' }}>No cards yet</td></tr>}
                {sportRows.length > 0 && <tr><td className="p-2.5 font-bold" style={{ color: 'var(--cyan)' }}>TOTAL</td><td className="p-2.5 font-mono text-[11px] font-bold" style={{ color: 'var(--cyan)' }}>{totS.c}</td><td className="p-2.5 font-mono text-[11px] font-bold" style={{ color: 'var(--cyan)' }}>{fmt(totS.i)}</td><td className="p-2.5 font-mono text-[11px] font-bold" style={{ color: 'var(--cyan)' }}>{fmt(totS.v)}</td><td className={'p-2.5 font-mono text-[11px] font-bold ' + (totS.v - totS.i >= 0 ? 'text-emerald-400' : 'text-red-400')}>{fgl(totS.v - totS.i)}</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2.5 my-5"><span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--faint)' }}>Top Cards</span><div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div></div>
          {ranked.length ? ranked.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl p-3 mb-2" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className={'font-mono font-bold text-sm w-5 text-center ' + (i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : '')} style={i > 2 ? { color: 'var(--faint)' } : {}}>{i + 1}</div>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{c.name || c.brand || '-'}</div><div className="text-xs" style={{ color: 'var(--dim)' }}>{c.player} - {c.sport}</div></div>
              <div className={'font-mono text-sm font-bold ' + cc(c.ret)}>{fpct(c.ret)}</div>
            </div>
          )) : <div className="text-center py-12" style={{ color: 'var(--faint)' }}><p className="text-sm">Add cards to see top performers</p></div>}
        </>}

        {tab === 'cards' && <>
          <div className="sticky top-0 z-10 pb-3" style={{ background: 'var(--bg)' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..." className={inp} style={inpStyle} />
          </div>
          {filteredCards.length ? filteredCards.map(c => {
            const pp = c.buy || 0, mv = c.val || 0, q = c.qty || 1, gl = (mv - pp) * q, ret = pp > 0 ? ((mv - pp) / pp * 100) : 0
            const gs = c.cond && c.grade ? c.cond + ' ' + c.grade : (c.cond || 'Raw')
            return (
              <div key={c.id} className="rounded-2xl p-3.5 mb-2.5 cursor-pointer active:opacity-80" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} onClick={() => openEditCard(c)}>
                <div className="flex justify-between items-start gap-2 mb-1"><div className="text-[15px] font-semibold truncate flex-1">{c.player || '-'}</div><div className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md shrink-0" style={{ background: 'rgba(6,214,214,0.12)', color: 'var(--cyan)' }}>{c.sport || '-'}</div></div>
                <div className="flex justify-between text-[13px]" style={{ color: 'var(--dim)' }}><span>{c.name || c.brand || '-'}</span><span>{gs}{q > 1 ? ' x' + q : ''}</span></div>
                <div className="flex justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <div><div className="text-[9px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--faint)' }}>Paid</div><div className="font-mono text-[13px] font-semibold">{fmt(pp * q)}</div></div>
                  <div><div className="text-[9px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--faint)' }}>Value</div><div className="font-mono text-[13px] font-semibold">{fmt(mv * q)}</div></div>
                  <div className="text-right"><div className="text-[9px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--faint)' }}>Return</div><div className={'font-mono text-[13px] font-bold ' + cc(gl)}>{fpct(ret)}</div></div>
                </div>
                <a href={ebayUrl(c.player, c.name || c.brand, c.year, c.cond && c.grade ? c.cond + ' ' + c.grade : '')} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg mt-2" style={{ background: 'rgba(56,189,248,0.1)', color: 'var(--sky)' }}>eBay Comps</a>
              </div>
            )
          }) : <div className="text-center py-12" style={{ color: 'var(--faint)' }}><p className="text-sm">No cards yet. Tap + to add your first!</p></div>}
        </>}

        {tab === 'wish' && <>
          <div className="sticky top-0 z-10 pb-3" style={{ background: 'var(--bg)' }}>
            <input value={wishSearch} onChange={e => setWishSearch(e.target.value)} placeholder="Search wish list..." className={inp} style={inpStyle} />
          </div>
          {filteredWishes.length ? filteredWishes.map(w => {
            const bc = w.pri === 'high' ? 'bg-red-400' : w.pri === 'low' ? 'bg-emerald-400' : 'bg-amber-400'
            const stClass = w.status === 'watching' ? 'bg-sky-400/15 text-sky-400' : w.status === 'buying' ? 'bg-emerald-400/15 text-emerald-400' : w.status === 'bought' ? 'bg-cyan-400/15 text-cyan-400' : 'bg-gray-400/15 text-gray-400'
            return (
              <div key={w.id} className="rounded-2xl p-3.5 mb-2.5 cursor-pointer active:opacity-80 relative pl-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }} onClick={() => openEditWish(w)}>
                <div className={'absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ' + bc}></div>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0"><div className="text-[15px] font-semibold truncate">{w.player || '-'}</div><div className="text-[13px] mt-0.5" style={{ color: 'var(--dim)' }}>{w.name || ''}{w.sport ? ' - ' + w.sport : ''}{w.year ? ' - ' + w.year : ''}</div></div>
                  <div className={'text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ' + stClass}>{w.status || 'watching'}</div>
                </div>
                <div className="flex gap-4 mt-1.5 text-[13px]">
                  {w.target > 0 && <div><span style={{ color: 'var(--faint)' }}>Target:</span> <span className="font-mono font-semibold">{fmt(w.target)}</span></div>}
                  {w.market > 0 && <div><span style={{ color: 'var(--faint)' }}>Market:</span> <span className="font-mono font-semibold">{fmt(w.market)}</span></div>}
                </div>
                {w.notes && <div className="text-xs mt-1.5" style={{ color: 'var(--faint)' }}>{w.notes}</div>}
              </div>
            )
          }) : <div className="text-center py-12" style={{ color: 'var(--faint)' }}><p className="text-sm">Wish list empty. Tap + to track cards!</p></div>}
        </>}
      </div>

      {tab !== 'dash' && (
        <button onClick={openAdd} className="fixed bottom-20 right-5 w-14 h-14 rounded-full text-black text-3xl font-light flex items-center justify-center z-40 active:scale-90 transition-transform" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--cyan2))', boxShadow: '0 6px 24px rgba(6,214,214,0.35)' }}>+</button>
      )}

      <nav className="flex shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {[['dash', 'Dashboard', 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z'],
          ['cards', 'Collection', 'M2 4h20v16H2zM2 10h20M10 10v10'],
          ['wish', 'Wish List', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z']
        ].map(([id, label, d]) => (
          <button key={id} onClick={() => setTab(id)} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: tab === id ? 'var(--cyan)' : 'var(--faint)', background: tab === id ? 'rgba(6,214,214,0.06)' : 'transparent' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d={d}/></svg>
            {label}
          </button>
        ))}
      </nav>

      {modal === 'card' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }} onClick={e => { if (e.target === e.currentTarget) { setModal(null); setEditing(null) } }}>
          <div className="w-full max-w-[500px] rounded-t-3xl max-h-[88vh] overflow-y-auto p-5 pb-8" style={{ background: 'var(--card)' }}>
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border)' }}></div>
            <div className="text-lg font-bold text-center mb-5">{editing ? 'Edit Card' : 'Add Card'}</div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Sport</label><select value={form.sport || ''} onChange={e => setForm({ ...form, sport: e.target.value })} className={inp} style={inpStyle}><option value="">Select</option>{SPORTS.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Year</label><input type="number" value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} className={inp} style={inpStyle} placeholder="2024" /></div>
            </div>
            <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Player</label><input value={form.player || ''} onChange={e => setForm({ ...form, player: e.target.value })} className={inp} style={inpStyle} placeholder="Player name" /></div>
            <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Card Name</label><input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} style={inpStyle} placeholder="e.g. Prizm Silver" /></div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Set / Brand</label><input value={form.brand || ''} onChange={e => setForm({ ...form, brand: e.target.value })} className={inp} style={inpStyle} placeholder="Panini Prizm" /></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Card #</label><input value={form.num || ''} onChange={e => setForm({ ...form, num: e.target.value })} className={inp} style={inpStyle} placeholder="280" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Condition</label><select value={form.cond || ''} onChange={e => setForm({ ...form, cond: e.target.value })} className={inp} style={inpStyle}><option value="">Select</option>{['Raw','PSA','BGS','SGC','CGC'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Grade</label><input value={form.grade || ''} onChange={e => setForm({ ...form, grade: e.target.value })} className={inp} style={inpStyle} placeholder="10" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Quantity</label><input type="number" value={form.qty || 1} onChange={e => setForm({ ...form, qty: e.target.value })} className={inp} style={inpStyle} min="1" /></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Date Purchased</label><input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className={inp} style={inpStyle} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Purchase Price ($)</label><input type="number" step="0.01" value={form.buy || ''} onChange={e => setForm({ ...form, buy: e.target.value })} className={inp} style={inpStyle} placeholder="0.00" /></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Market Value ($)</label><input type="number" step="0.01" value={form.val || ''} onChange={e => setForm({ ...form, val: e.target.value })} className={inp} style={inpStyle} placeholder="0.00" /></div>
            </div>
            <div className="mb-3"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Notes</label><input value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={inp} style={inpStyle} placeholder="Optional" /></div>
            <button onClick={saveCard} className="w-full p-3.5 rounded-2xl text-[15px] font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--cyan2))' }}>Save Card</button>
            <a href={ebayUrl(form.player, form.name || form.brand, form.year, form.cond && form.grade ? form.cond + ' ' + form.grade : '')} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 w-full p-3.5 rounded-2xl text-[15px] font-bold mt-2" style={{ color: 'var(--sky)', border: '1px solid rgba(56,189,248,0.3)' }}>Check eBay Comps</a>
            {editing && <button onClick={deleteCard} className="w-full p-3.5 rounded-2xl text-[15px] font-bold mt-2" style={{ color: 'var(--coral)', border: '1px solid rgba(255,107,122,0.3)' }}>Delete Card</button>}
            <button onClick={() => { setModal(null); setEditing(null) }} className="w-full p-3.5 rounded-2xl text-[15px] font-bold mt-2" style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>Cancel</button>
          </div>
        </div>
      )}

      {modal === 'wish' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }} onClick={e => { if (e.target === e.currentTarget) { setModal(null); setEditing(null) } }}>
          <div className="w-full max-w-[500px] rounded-t-3xl max-h-[88vh] overflow-y-auto p-5 pb-8" style={{ background: 'var(--card)' }}>
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border)' }}></div>
            <div className="text-lg font-bold text-center mb-5">{editing ? 'Edit Wish' : 'Add to Wish List'}</div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Priority</label><select value={form.pri || 'medium'} onChange={e => setForm({ ...form, pri: e.target.value })} className={inp} style={inpStyle}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Sport</label><select value={form.sport || ''} onChange={e => setForm({ ...form, sport: e.target.value })} className={inp} style={inpStyle}><option value="">Select</option>{SPORTS.map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Player</label><input value={form.player || ''} onChange={e => setForm({ ...form, player: e.target.value })} className={inp} style={inpStyle} placeholder="Player name" /></div>
            <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Card Name</label><input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} style={inpStyle} placeholder="Card description" /></div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Year</label><input type="number" value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} className={inp} style={inpStyle} placeholder="2024" /></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Set / Brand</label><input value={form.brand || ''} onChange={e => setForm({ ...form, brand: e.target.value })} className={inp} style={inpStyle} placeholder="Topps Chrome" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Target Buy ($)</label><input type="number" step="0.01" value={form.target || ''} onChange={e => setForm({ ...form, target: e.target.value })} className={inp} style={inpStyle} placeholder="0.00" /></div>
              <div className="mb-2"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Market Price ($)</label><input type="number" step="0.01" value={form.market || ''} onChange={e => setForm({ ...form, market: e.target.value })} className={inp} style={inpStyle} placeholder="0.00" /></div>
            </div>
            <div className="mb-3"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Status</label><select value={form.status || 'watching'} onChange={e => setForm({ ...form, status: e.target.value })} className={inp} style={inpStyle}><option value="watching">Watching</option><option value="buying">Buying Soon</option><option value="bought">Bought</option><option value="passed">Passed</option></select></div>
            <div className="mb-3"><label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>Notes</label><input value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={inp} style={inpStyle} placeholder="Optional" /></div>
            <button onClick={saveWish} className="w-full p-3.5 rounded-2xl text-[15px] font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--cyan2))' }}>Save</button>
            {editing && <button onClick={deleteWish} className="w-full p-3.5 rounded-2xl text-[15px] font-bold mt-2" style={{ color: 'var(--coral)', border: '1px solid rgba(255,107,122,0.3)' }}>Delete</button>}
            <button onClick={() => { setModal(null); setEditing(null) }} className="w-full p-3.5 rounded-2xl text-[15px] font-bold mt-2" style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>Cancel</button>
          </div>
        </div>
      )}

      {modal === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }} onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="w-full max-w-[500px] rounded-t-3xl p-5 pb-8" style={{ background: 'var(--card)' }}>
            <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border)' }}></div>
            <div className="text-lg font-bold text-center mb-5">Settings</div>
            <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div><div className="font-semibold">Logged in as</div><div className="text-xs mt-0.5" style={{ color: 'var(--faint)' }}>{user?.username} - {user?.email}</div></div>
            </div>
            <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div><div className="font-semibold" style={{ color: 'var(--coral)' }}>Log Out</div></div>
              <button onClick={logout} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'var(--card2)', border: '1px solid rgba(255,107,122,0.3)', color: 'var(--coral)' }}>Log Out</button>
            </div>
            <button onClick={() => setModal(null)} className="w-full p-3.5 rounded-2xl text-[15px] font-bold mt-4" style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
