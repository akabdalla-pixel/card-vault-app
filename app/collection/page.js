'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
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
function IconClose() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function IconEdit() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function IconTrash() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IconUp() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> }
function IconDown() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> }
function IconDownload() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IconUpload() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> }
function IconSearch() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function IconTag() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> }
function IconExternalLink() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> }

const navIcons = { 'Dashboard': IconDashboard, 'Collection': IconCollection, 'Wish List': IconWishlist }
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n || 0)
const SPORTS = ['Baseball', 'Basketball', 'Football', 'Soccer', 'Hockey', 'Tennis', 'Golf', 'Other']
const CONDS = ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Poor']
const EMPTY = { sport: '', year: '', player: '', name: '', brand: '', num: '', cond: '', grade: '', qty: '1', date: '', buy: '', val: '', notes: '', sold: false, soldPrice: '', soldDate: '' }

function getPriceLinks(card) {
  const q = encodeURIComponent([card.year, card.player, card.name, card.brand, card.grade ? 'PSA ' + card.grade : ''].filter(Boolean).join(' ') + ' card')
  const qs = encodeURIComponent([card.player, card.year, card.name].filter(Boolean).join(' '))
  return [
    { label: 'eBay Sold Listings', color: '#e53238', url: 'https://www.ebay.com/sch/i.html?_nkw=' + q + '&LH_Sold=1&LH_Complete=1' },
    { label: 'eBay Active Listings', color: '#0064d2', url: 'https://www.ebay.com/sch/i.html?_nkw=' + q },
    { label: '130Point', color: '#7c5cfc', url: 'https://130point.com/sales/?query=' + qs },
    { label: 'Card Ladder', color: '#22d3a7', url: 'https://www.cardladder.com/search?q=' + qs },
    { label: 'PSA Auction Prices', color: '#ffbe2e', url: 'https://www.psacard.com/auctionprices/search?q=' + qs },
  ]
}

function exportCSV(cards) {
  const headers = ['Player','Sport','Year','Card Name','Brand','Card #','Condition','PSA Grade','Qty','Purchase Date','Buy Price','Current Value','Sold','Sold Price','Sold Date','Notes']
  const rows = cards.map(c => [c.player,c.sport,c.year,c.name,c.brand,c.num,c.cond,c.grade,c.qty,c.date,c.buy,c.val,c.sold?'Yes':'No',c.soldPrice||'',c.soldDate||'',c.notes||''].map(v => '"' + String(v||'').replace(/"/g,'""') + '"').join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'topload-collection-' + new Date().toISOString().slice(0,10) + '.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/"/g,'').trim().toLowerCase())
  return lines.slice(1).map(line => {
    const vals = []; let cur = '', inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ } else if (ch === ',' && !inQ) { vals.push(cur); cur = '' } else cur += ch
    }
    vals.push(cur)
    const row = {}
    headers.forEach((h, i) => { row[h] = (vals[i]||'').replace(/"/g,'').trim() })
    return { player: row['player']||row['player name']||'', sport: row['sport']||'', year: row['year']||'', name: row['card name']||row['name']||'', brand: row['brand']||'', num: row['card #']||row['num']||'', cond: row['condition']||'', grade: row['psa grade']||row['grade']||'', qty: parseInt(row['qty']||'1')||1, date: row['purchase date']||row['date']||'', buy: parseFloat(row['buy price']||row['buy']||'0')||0, val: parseFloat(row['current value']||row['val']||'0')||0, notes: row['notes']||'' }
  }).filter(r => r.player)
}

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
          const active = typeof window !== 'undefined' && window.location.pathname === href
          const Icon = navIcons[label]
          return <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: active ? 'var(--cyan)' : '#6a75a0', background: active ? 'rgba(6,214,214,0.08)' : 'transparent', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: active ? 600 : 500, borderLeft: active ? '2px solid var(--cyan)' : '2px solid transparent', transition: 'all 0.15s' }}><Icon />{label}</Link>
        })}
      </nav>
      <div style={{ padding: '14px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {user && <div style={{ padding: '10px 12px', marginBottom: 4, borderRadius: 10, background: 'rgba(255,255,255,0.03)', fontFamily: "'Outfit',sans-serif" }}><div style={{ fontSize: 12, fontWeight: 700, color: '#c0c8e8' }}>@{user.username}</div><div style={{ fontSize: 11, color: '#3a4465', marginTop: 1 }}>{user.email}</div></div>}
        <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, marginBottom: 2, textDecoration: 'none', color: '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconSettings />Settings</Link>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 10, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500 }}><IconLogout />Sign Out</button>
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: '#0b0e1c', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', zIndex: 100 }}>
      {NAV.map(({ label, href }) => {
        const active = typeof window !== 'undefined' && window.location.pathname === href
        const Icon = navIcons[label]
        return <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: active ? 'var(--cyan)' : '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: 4 }}><Icon />{label}</Link>
      })}
    </nav>
  )
}

function CardModal({ card, onClose, onSave }) {
  const [form, setForm] = useState(card || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.player) { setError('Player name is required'); return }
    setSaving(true); setError('')
    try {
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch('/api/cards', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed to save'); setSaving(false); return }
      onSave()
    } catch { setError('Something went wrong'); setSaving(false) }
  }

  const field = (label, key, type = 'text', opts = null) => (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4a5578', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
      {opts ? (
        <select value={form[key]||''} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: form[key] ? 'var(--text)' : '#4a5578', fontSize: 14, outline: 'none' }}>
          <option value="">Select...</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]||''} onChange={e => set(key, e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
      )}
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>{form.id ? 'Edit Card' : 'Add Card'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5578', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        {error && <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,122,0.1)', color: 'var(--coral)', fontSize: 13, border: '1px solid rgba(255,107,122,0.2)' }}>{error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>{field('Player Name *', 'player')}</div>
          {field('Sport', 'sport', 'text', SPORTS)}
          {field('Year', 'year')}
          {field('Card Name / Set', 'name')}
          {field('Brand', 'brand')}
          {field('Card Number', 'num')}
          {field('Condition', 'cond', 'text', CONDS)}
          {field('PSA Grade', 'grade')}
          {field('Quantity', 'qty', 'number')}
          {field('Purchase Date', 'date', 'date')}
          {field('Buy Price ($)', 'buy', 'number')}
          {field('Current Value ($)', 'val', 'number')}
          <div style={{ gridColumn: '1/-1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.sold} onChange={e => set('sold', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--cyan)' }} />
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: '#c0c8e8' }}>Mark as Sold</span>
            </label>
          </div>
          {form.sold && <>
            {field('Sold Price ($)', 'soldPrice', 'number')}
            {field('Sold Date', 'soldDate', 'date')}
          </>}
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4a5578', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Notes</label>
            <textarea value={form.notes||''} onChange={e => set('notes', e.target.value)} rows={3} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: "'Outfit',sans-serif" }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,var(--cyan),var(--cyan2))', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save Card'}</button>
        </div>
      </div>
    </div>
  )
}

function PriceLookupModal({ card, onClose }) {
  const links = getPriceLinks(card)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>Check Prices</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5578', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 18, fontFamily: "'Outfit',sans-serif" }}>{card.player}{card.year ? ' · ' + card.year : ''}{card.grade ? ' · PSA ' + card.grade : ''}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {links.map(({ label, color, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: color + '18', border: '1px solid ' + color + '40', textDecoration: 'none' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: '#f0f2ff' }}>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color, fontWeight: 600 }}>Search <IconExternalLink /></div>
            </a>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#2e3759', marginTop: 14, textAlign: 'center', fontFamily: "'Outfit',sans-serif" }}>Opens each platform in a new tab with your card pre-searched</p>
      </div>
    </div>
  )
}

function SoldModal({ card, onClose, onSave }) {
  const [soldPrice, setSoldPrice] = useState(card.soldPrice || '')
  const [soldDate, setSoldDate] = useState(card.soldDate || new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const buy = parseFloat(card.buy) || 0
  const sold = parseFloat(soldPrice) || 0
  const profit = sold - buy
  const profitPct = buy > 0 ? (profit / buy) * 100 : 0

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/cards', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...card, sold: true, soldPrice, soldDate }) })
      onSave()
    } catch { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 380, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>Mark as Sold</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5578', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 18, fontFamily: "'Outfit',sans-serif" }}>{card.player}{card.year ? ' · ' + card.year : ''}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4a5578', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Sold Price ($)</label>
            <input type="number" value={soldPrice} onChange={e => setSoldPrice(e.target.value)} placeholder="Enter sale price" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4a5578', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Sold Date</label>
            <input type="date" value={soldDate} onChange={e => setSoldDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
          </div>
          {soldPrice && (
            <div style={{ padding: '12px 16px', borderRadius: 10, background: profit >= 0 ? 'rgba(34,211,167,0.08)' : 'rgba(255,107,122,0.08)', border: '1px solid ' + (profit >= 0 ? 'rgba(34,211,167,0.2)' : 'rgba(255,107,122,0.2)') }}>
              <div style={{ fontSize: 11, color: '#4a5578', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Realized P&L</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, color: profit >= 0 ? '#22d3a7' : '#ff6b7a' }}>{profit >= 0 ? '+' : ''}{fmt(profit)} <span style={{ fontSize: 13 }}>({profitPct >= 0 ? '+' : ''}{profitPct.toFixed(1)}%)</span></div>
              <div style={{ fontSize: 12, color: '#4a5578', marginTop: 4 }}>Bought for {fmt(buy)}</div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !soldPrice} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,var(--cyan),var(--cyan2))', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (saving || !soldPrice) ? 0.5 : 1 }}>{saving ? 'Saving...' : 'Mark Sold'}</button>
        </div>
      </div>
    </div>
  )
}

function ImportModal({ onClose, onImport }) {
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = parseCSV(ev.target.result)
        if (!parsed.length) { setError('No valid cards found. Make sure CSV has a Player column.'); return }
        setCards(parsed); setError('')
      } catch { setError('Failed to parse CSV file') }
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    setImporting(true)
    let success = 0
    for (const card of cards) {
      try { await fetch('/api/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card) }); success++ } catch {}
    }
    onImport(success)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 460, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', margin: 0 }}>Import CSV</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4a5578', cursor: 'pointer', padding: 4 }}><IconClose /></button>
        </div>
        <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 16, lineHeight: 1.6, fontFamily: "'Outfit',sans-serif" }}>Upload a CSV with your cards. Required column: <strong style={{ color: '#c0c8e8' }}>Player</strong>. Optional: Sport, Year, Card Name, Brand, PSA Grade, Qty, Buy Price, Current Value.</p>
        {error && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,107,122,0.1)', color: 'var(--coral)', fontSize: 13 }}>{error}</div>}
        <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 12, padding: '28px 20px', textAlign: 'center', marginBottom: 16, cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: '#6a75a0' }}>{cards.length ? cards.length + ' cards ready to import' : 'Click to select a CSV file'}</div>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} />
        </div>
        {cards.length > 0 && (
          <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 16, borderRadius: 10, background: '#0c0f1a', border: '1px solid var(--border)' }}>
            {cards.slice(0, 5).map((c, i) => <div key={i} style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#c0c8e8' }}>{c.player}{c.year ? ' · ' + c.year : ''}{c.sport ? ' · ' + c.sport : ''}</div>)}
            {cards.length > 5 && <div style={{ padding: '8px 14px', fontSize: 12, color: '#4a5578', fontFamily: "'Outfit',sans-serif" }}>...and {cards.length - 5} more</div>}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleImport} disabled={!cards.length || importing} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'linear-gradient(135deg,var(--cyan),var(--cyan2))', border: 'none', color: '#000', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: (!cards.length || importing) ? 0.5 : 1 }}>{importing ? 'Importing...' : 'Import ' + cards.length + ' Cards'}</button>
        </div>
      </div>
    </div>
  )
}

export default function CollectionPage() {
  const [cards, setCards] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [priceLookupCard, setPriceLookupCard] = useState(null)
  const [soldCard, setSoldCard] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')
  const [filterSport, setFilterSport] = useState('')
  const [filterStatus, setFilterStatus] = useState('active')
  const [deleteId, setDeleteId] = useState(null)
  const [importSuccess, setImportSuccess] = useState(null)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/cards', { cache: 'no-store' })])
      if (!meRes.ok) { router.push('/login'); return }
      setUser((await meRes.json()).user)
      if (cardsRes.ok) setCards(await cardsRes.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleLogout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login') }
  async function handleDelete(id) { await fetch('/api/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); setDeleteId(null); load() }

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || (c.player||'').toLowerCase().includes(q) || (c.name||'').toLowerCase().includes(q) || (c.brand||'').toLowerCase().includes(q)
    const matchSport = !filterSport || c.sport === filterSport
    const matchStatus = filterStatus === 'all' || (filterStatus === 'sold' ? c.sold : !c.sold)
    return matchSearch && matchSport && matchStatus
  })

  const activeCards = cards.filter(c => !c.sold)
  const soldCards = cards.filter(c => c.sold)
  const totalInvested = activeCards.reduce((s, c) => s + (parseFloat(c.buy)||0) * (parseInt(c.qty)||1), 0)
  const totalValue = activeCards.reduce((s, c) => s + (parseFloat(c.val)||parseFloat(c.buy)||0) * (parseInt(c.qty)||1), 0)
  const totalSoldRevenue = soldCards.reduce((s, c) => s + (parseFloat(c.soldPrice)||0), 0)
  const totalSoldCost = soldCards.reduce((s, c) => s + (parseFloat(c.buy)||0), 0)
  const realizedPL = totalSoldRevenue - totalSoldCost

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div style={{ color: '#3a4465', fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>Loading...</div></div>

  return (
    <>
      <style>{`
        .sidebar-el{display:flex;flex-direction:column}.mobile-only{display:none!important}.mob-topbar{display:none}.main-wrap{margin-left:220px;min-height:100vh;width:calc(100% - 220px)}.card-row:hover{background:rgba(255,255,255,0.02)!important}
        @media(max-width:768px){.sidebar-el{display:none!important}.mobile-only{display:flex!important}.mob-topbar{display:flex}.main-wrap{margin-left:0!important;width:100%!important;padding-bottom:80px!important}}
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="sidebar-el"><Sidebar user={user} onLogout={handleLogout} /></div>
        <main className="main-wrap" style={{ padding: '30px 28px' }}>
          <div className="mob-topbar" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800 }}><span style={{ color: '#f0f2ff' }}>Top</span><span style={{ color: 'var(--cyan)' }}>Load</span></span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: 'none', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><IconLogout />Sign Out</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
            <div>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.5px', margin: 0 }}>Collection</h1>
              <p style={{ fontSize: 13, color: '#4a5578', marginTop: 4, fontWeight: 500 }}>{cards.length} cards · {activeCards.length} active · {soldCards.length} sold</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setShowImport(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><IconUpload />Import CSV</button>
              <button onClick={() => exportCSV(cards)} disabled={!cards.length} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: cards.length ? 1 : 0.4 }}><IconDownload />Export CSV</button>
              <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'rgba(6,214,214,0.08)', border: '1px solid rgba(6,214,214,0.25)', borderRadius: 10, color: 'var(--cyan)', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add Card</button>
            </div>
          </div>
          {importSuccess !== null && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(34,211,167,0.1)', border: '1px solid rgba(34,211,167,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: '#22d3a7', fontWeight: 600 }}>✓ Successfully imported {importSuccess} cards</span>
              <button onClick={() => setImportSuccess(null)} style={{ background: 'none', border: 'none', color: '#22d3a7', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
          )}
          {cards.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 18 }}>
              {[['Active Cards', activeCards.length, '#f0f2ff'], ['Invested', fmt(totalInvested), '#f0f2ff'], ['Portfolio Value', fmt(totalValue), '#f0f2ff'], ['Unrealized G/L', (totalValue-totalInvested>=0?'+':'')+fmt(totalValue-totalInvested), totalValue>=totalInvested?'#22d3a7':'#ff6b7a'], ['Realized P&L', (realizedPL>=0?'+':'')+fmt(realizedPL), realizedPL>=0?'#22d3a7':'#ff6b7a']].map(([label, value, color]) => (
                <div key={label} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: '#3a4465', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search player, set, brand..." style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: "'Outfit',sans-serif" }} />
            <select value={filterSport} onChange={e => setFilterSport(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', color: filterSport ? 'var(--text)' : '#4a5578', fontSize: 14, outline: 'none' }}>
              <option value="">All Sports</option>
              {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[['active','Active'],['sold','Sold'],['all','All']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterStatus(val)} style={{ padding: '9px 14px', background: filterStatus===val ? 'rgba(6,214,214,0.15)' : 'var(--card)', border: 'none', color: filterStatus===val ? 'var(--cyan)' : '#4a5578', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: filterStatus===val ? 700 : 500, cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>🃏</div>
              <p style={{ color: '#3a4465', fontFamily: "'Outfit',sans-serif", fontSize: 14, marginBottom: 16 }}>{search || filterSport ? 'No cards match your search' : "You haven't added any cards yet"}</p>
              {!search && !filterSport && <button onClick={() => setModal('add')} style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(6,214,214,0.08)', border: '1px solid rgba(6,214,214,0.25)', color: 'var(--cyan)', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Add Your First Card</button>}
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg,#131929,#0f1521)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Player','Sport','Year','Grade','Qty','Buy Price','Value','G/L','Status',''].map((h,i) => <th key={i} style={{ padding: '11px 14px', textAlign: i===0?'left':'right', fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: '#2e3759', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.map(card => {
                      const qty = parseInt(card.qty)||1
                      const buy = (parseFloat(card.buy)||0)*qty
                      const displayVal = card.sold ? (parseFloat(card.soldPrice)||0) : (parseFloat(card.val)||parseFloat(card.buy)||0)*qty
                      const gl = displayVal - buy
                      const glPos = gl >= 0
                      return (
                        <tr key={card.id} className="card-row" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', opacity: card.sold ? 0.75 : 1 }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: '#c0c8e8' }}>{card.player}</div>
                            {card.name && <div style={{ fontSize: 11, color: '#3a4465', marginTop: 1 }}>{card.name}</div>}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'Outfit',sans-serif", fontSize: 12, color: '#6a75a0' }}>{card.sport||'—'}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#6a75a0' }}>{card.year||'—'}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>{card.grade ? <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(6,214,214,0.1)', color: 'var(--cyan)', fontSize: 11, fontWeight: 700 }}>PSA {card.grade}</span> : <span style={{ color: '#3a4465', fontSize: 12 }}>{card.cond||'—'}</span>}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#6a75a0' }}>{qty}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#6a75a0' }}>{fmt(buy)}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: '#f0f2ff' }}>{fmt(displayVal)}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: glPos ? '#22d3a7' : '#ff6b7a' }}>{glPos ? <IconUp /> : <IconDown />}{glPos?'+':''}{fmt(gl)}</div>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>{card.sold ? <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(255,190,46,0.1)', color: '#ffbe2e', fontSize: 11, fontWeight: 700 }}>SOLD</span> : <span style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(34,211,167,0.1)', color: '#22d3a7', fontSize: 11, fontWeight: 700 }}>ACTIVE</span>}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                              <button onClick={() => setPriceLookupCard(card)} title="Check prices" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(124,92,252,0.08)', border: 'none', color: '#a78bfa', cursor: 'pointer' }}><IconSearch /></button>
                              {!card.sold && <button onClick={() => setSoldCard(card)} title="Mark as sold" style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,190,46,0.08)', border: 'none', color: '#ffbe2e', cursor: 'pointer' }}><IconTag /></button>}
                              <button onClick={() => setModal(card)} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#6a75a0', cursor: 'pointer' }}><IconEdit /></button>
                              <button onClick={() => setDeleteId(card.id)} style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(255,107,122,0.08)', border: 'none', color: '#ff6b7a', cursor: 'pointer' }}><IconTrash /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
        <BottomNav />
      </div>
      {modal && <CardModal card={modal==='add'?null:modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load() }} />}
      {priceLookupCard && <PriceLookupModal card={priceLookupCard} onClose={() => setPriceLookupCard(null)} />}
      {soldCard && <SoldModal card={soldCard} onClose={() => setSoldCard(null)} onSave={() => { setSoldCard(null); load() }} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={(n) => { setShowImport(false); setImportSuccess(n); load() }} />}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f2ff', marginBottom: 8 }}>Delete this card?</h3>
            <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'var(--card2)', border: '1px solid var(--border)', color: '#6a75a0', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: 11, borderRadius: 10, background: 'rgba(255,107,122,0.15)', border: '1px solid rgba(255,107,122,0.3)', color: '#ff6b7a', fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
