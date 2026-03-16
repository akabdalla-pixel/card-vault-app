import { NextResponse } from 'next/server'

const EBAY_APP_ID = process.env.EBAY_APP_ID
const EBAY_CERT_ID = process.env.EBAY_CERT_ID

async function getEbayToken() {
  const credentials = Buffer.from(`${EBAY_APP_ID}:${EBAY_CERT_ID}`).toString('base64')
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope'
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description || 'Token failed: ' + JSON.stringify(data))
  return data.access_token
}

export async function POST(req) {
  const { query, source } = await req.json()
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

  if (source === '130point') {
    try {
      const params = new URLSearchParams({ query, type: '2', subcat: '-1', tab_id: '1', sort: 'EndTimeSoonest' })
      const res = await fetch('https://back.130point.com/sales/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://130point.com/', 'Origin': 'https://130point.com' },
        body: params.toString()
      })
      const html = await res.text()
      const results = []
      const priceRegex = /\$([0-9,]+\.?[0-9]*)/g
      const titleRegex = /class="[^"]*title[^"]*"[^>]*>([^<]+)</gi
      const dateRegex = /(\w+ \d+,\s*\d{4})/g
      const linkRegex = /href="(https:\/\/www\.ebay\.com\/itm\/[^"]+)"/g
      const prices = [], titles = [], dates = [], links = []
      let m
      while ((m = priceRegex.exec(html)) !== null) { const p = parseFloat(m[1].replace(',','')); if (p>0.5&&p<1000000) prices.push(p) }
      while ((m = titleRegex.exec(html)) !== null) { const t = m[1].trim(); if (t.length>5) titles.push(t) }
      while ((m = dateRegex.exec(html)) !== null) dates.push(m[1])
      while ((m = linkRegex.exec(html)) !== null) links.push(m[1])
      const count = Math.min(prices.length, 20)
      for (let i=0;i<count;i++) results.push({ price:prices[i], title:titles[i]||query, date:dates[i]||null, link:links[i]||`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1` })
      if (!results.length) return NextResponse.json({ results:[], avg:0, high:0, low:0, source:'130point' })
      const avg = results.reduce((s,r)=>s+r.price,0)/results.length
      return NextResponse.json({ results, avg, high:Math.max(...results.map(r=>r.price)), low:Math.min(...results.map(r=>r.price)), source:'130point' })
    } catch (e) { return NextResponse.json({ error: e.message }, { status:500 }) }
  }

  if (source === 'ebay') {
    try {
      const token = await getEbayToken()

      // Use Browse API to search items
      const searchRes = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?` + new URLSearchParams({
          q: query,
          limit: '20',
          sort: 'newlyListed',
          filter: 'buyingOptions:{FIXED_PRICE}',
          category_ids: '261328',
        }),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
            'Content-Type': 'application/json',
          }
        }
      )
      const searchData = await searchRes.json()

      if (searchData.error || !searchData.itemSummaries?.length) {
        // Try without category
        const searchRes2 = await fetch(
          `https://api.ebay.com/buy/browse/v1/item_summary/search?` + new URLSearchParams({
            q: query,
            limit: '20',
            sort: 'newlyListed',
          }),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
              'Content-Type': 'application/json',
            }
          }
        )
        const searchData2 = await searchRes2.json()
        return NextResponse.json({ 
          results: [], avg: 0, high: 0, low: 0, source: 'ebay',
          debug: { 
            tokenOk: !!token,
            itemCount: searchData2.itemSummaries?.length || 0,
            total: searchData2.total,
            error: searchData2.errors || searchData.errors,
            firstItem: searchData2.itemSummaries?.[0],
          }
        })
      }

      const results = searchData.itemSummaries.map(item => ({
        price: parseFloat(item.price?.value || 0),
        title: item.title || query,
        date: item.itemEndDate?.split('T')[0] || null,
        link: item.itemWebUrl || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`,
        image: item.image?.imageUrl || null,
        condition: item.condition || null,
      })).filter(r => r.price > 0)

      if (!results.length) return NextResponse.json({ results:[], avg:0, high:0, low:0, source:'ebay' })
      const avg = results.reduce((s,r)=>s+r.price,0)/results.length
      return NextResponse.json({ results, avg, high:Math.max(...results.map(r=>r.price)), low:Math.min(...results.map(r=>r.price)), source:'ebay' })

    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  if (source === 'both') {
    const base = 'https://www.toploadcards.com'
    const [r1, r2] = await Promise.allSettled([
      fetch(`${base}/api/market`, { method:'POST', body:JSON.stringify({query,source:'130point'}), headers:{'Content-Type':'application/json'} }).then(r=>r.json()),
      fetch(`${base}/api/market`, { method:'POST', body:JSON.stringify({query,source:'ebay'}), headers:{'Content-Type':'application/json'} }).then(r=>r.json()),
    ])
    const d1 = r1.status==='fulfilled' ? r1.value : { results:[] }
    const d2 = r2.status==='fulfilled' ? r2.value : { results:[] }
    const results = [...(d1.results||[]), ...(d2.results||[])]
    if (!results.length) return NextResponse.json({ results:[], avg:0, high:0, low:0, source:'both' })
    const avg = results.reduce((s,r)=>s+r.price,0)/results.length
    return NextResponse.json({ results, avg, high:Math.max(...results.map(r=>r.price)), low:Math.min(...results.map(r=>r.price)), source:'both' })
  }

  return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
}
