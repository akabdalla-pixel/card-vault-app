import { NextResponse } from 'next/server'

// Proxy for 130point — avoids CORS issues from the browser
export async function POST(req) {
  const { query, source } = await req.json()
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

  if (source === '130point') {
    try {
      const params = new URLSearchParams({
        query: query,
        type: '2',
        subcat: '-1',
        tab_id: '1',
        sort: 'EndTimeSoonest'
      })
      const res = await fetch('https://back.130point.com/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://130point.com/',
          'Origin': 'https://130point.com'
        },
        body: params.toString()
      })
      const html = await res.text()

      // Parse prices and titles from the HTML response
      const results = []
      // Match sold item rows - 130point returns table rows with price data
      const priceRegex = /\$([0-9,]+\.?[0-9]*)/g
      const titleRegex = /class="[^"]*title[^"]*"[^>]*>([^<]+)</gi
      const dateRegex = /(\w+ \d+,\s*\d{4})/g
      const linkRegex = /href="(https:\/\/www\.ebay\.com\/itm\/[^"]+)"/g

      const prices = []
      const titles = []
      const dates = []
      const links = []

      let m
      while ((m = priceRegex.exec(html)) !== null) {
        const price = parseFloat(m[1].replace(',', ''))
        if (price > 0.5 && price < 1000000) prices.push(price)
      }
      while ((m = titleRegex.exec(html)) !== null) {
        const t = m[1].trim()
        if (t.length > 5) titles.push(t)
      }
      while ((m = dateRegex.exec(html)) !== null) dates.push(m[1])
      while ((m = linkRegex.exec(html)) !== null) links.push(m[1])

      // Build results array
      const count = Math.min(prices.length, 20)
      for (let i = 0; i < count; i++) {
        results.push({
          price: prices[i],
          title: titles[i] || query,
          date: dates[i] || null,
          link: links[i] || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`
        })
      }

      if (results.length === 0) {
        return NextResponse.json({ results: [], avg: 0, high: 0, low: 0, source: '130point', rawHtml: html.substring(0, 200) })
      }

      const avg = results.reduce((s, r) => s + r.price, 0) / results.length
      const high = Math.max(...results.map(r => r.price))
      const low = Math.min(...results.map(r => r.price))

      return NextResponse.json({ results, avg, high, low, source: '130point' })
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  if (source === 'ebay') {
    try {
      const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1&LH_Complete=1&_sop=13`
      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      })
      const html = await res.text()

      const results = []

      // Parse eBay sold listings
      // Match listing blocks
      const itemRegex = /<li[^>]*s-item[^>]*>([\s\S]*?)<\/li>/g
      let item
      while ((item = itemRegex.exec(html)) !== null && results.length < 20) {
        const block = item[1]

        // Get price
        const priceMatch = block.match(/s-item__price[^>]*>[\s\S]*?\$([0-9,]+\.?[0-9]*)/)
        if (!priceMatch) continue
        const price = parseFloat(priceMatch[1].replace(',', ''))
        if (!price || price < 0.5) continue

        // Get title
        const titleMatch = block.match(/s-item__title[^>]*>([\s\S]*?)<\//)
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace('Shop on eBay', '').trim() : query

        // Get date
        const dateMatch = block.match(/SOLD\s+(\w+\s+\d+)/) || block.match(/(\w+ \d+, \d{4})/)
        const date = dateMatch ? dateMatch[1] : null

        // Get link
        const linkMatch = block.match(/href="(https:\/\/www\.ebay\.com\/itm\/[^"?]+)/)
        const link = linkMatch ? linkMatch[1] : `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`

        if (title && !title.includes('Shop on eBay')) {
          results.push({ price, title, date, link })
        }
      }

      if (results.length === 0) {
        return NextResponse.json({ results: [], avg: 0, high: 0, low: 0, source: 'ebay' })
      }

      const avg = results.reduce((s, r) => s + r.price, 0) / results.length
      const high = Math.max(...results.map(r => r.price))
      const low = Math.min(...results.map(r => r.price))

      return NextResponse.json({ results, avg, high, low, source: 'ebay' })
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
}
