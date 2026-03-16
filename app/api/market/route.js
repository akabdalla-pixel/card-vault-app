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
  if (!res.ok) throw new Error(data.error_description || 'Token failed')
  return data.access_token
}

export async function POST(req) {
  const { query, source } = await req.json()
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

  if (source === '130point' || source === 'ebay' || source === 'both') {
    try {
      const token = await getEbayToken()

      // Try multiple Browse API search strategies
      const searches = [
        // Strategy 1: search with sports cards category
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&category_ids=261328&limit=20`,
        // Strategy 2: no category, all items
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=20`,
        // Strategy 3: with buying options filter
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=20&filter=buyingOptions%3A%7BFIXED_PRICE%7D`,
      ]

      let items = []
      let debugInfo = []

      for (const url of searches) {
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
            'Content-Type': 'application/json',
          }
        })
        const data = await res.json()
        debugInfo.push({ url: url.slice(50), status: res.status, total: data.total, count: data.itemSummaries?.length || 0, error: data.errors?.[0]?.message })
        if (data.itemSummaries?.length > 0) {
          items = data.itemSummaries
          break
        }
      }

      if (!items.length) {
        return NextResponse.json({ results:[], avg:0, high:0, low:0, source, debug: debugInfo })
      }

      const results = items.map(item => ({
        price: parseFloat(item.price?.value || 0),
        title: item.title || query,
        date: item.itemEndDate?.split('T')[0] || null,
        link: item.itemWebUrl || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`,
        image: item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl || null,
        condition: item.condition || null,
      })).filter(r => r.price > 0)

      if (!results.length) return NextResponse.json({ results:[], avg:0, high:0, low:0, source })
      const avg = results.reduce((s,r)=>s+r.price,0)/results.length
      return NextResponse.json({ results, avg, high:Math.max(...results.map(r=>r.price)), low:Math.min(...results.map(r=>r.price)), source })

    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
}
