import { NextResponse } from 'next/server'

export async function POST(req) {
  const { query, source } = await req.json()
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

  if (source === '130point') {
    try {
      const params = new URLSearchParams({
        query: encodeURIComponent(query),
        type: '2',
        subcat: '-1',
        tab_id: '1',
        sort: 'EndTimeSoonest'
      })
      const res = await fetch('https://back.130point.com/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://130point.com/sales/',
          'Origin': 'https://130point.com'
        },
        body: params.toString()
      })
      const html = await res.text()

      const results = []

      // 130point wraps each sale in a <tr> with class sold_data or sold_data-simple
      // Prices appear as data-price="123.45" or >$123.45<
      
      // Method 1: data-price attributes
      const dataPriceRegex = /data-price="([0-9.]+)"/g
      // Method 2: price spans
      const spanPriceRegex = /class="[^"]*price[^"]*"[^>]*>\$?([0-9,]+\.?[0-9]*)/gi
      // Method 3: plain dollar amounts in table cells
      const tdPriceRegex = /<td[^>]*>\s*\$([0-9,]+\.?[0-9]*)\s*<\/td>/g
      // Method 4: any dollar amount
      const anyPriceRegex = /\$\s*([0-9,]+\.[0-9]{2})/g

      const titleRegex = /class="[^"]*item[_-]title[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi
      const linkRegex = /href="(https?:\/\/(?:www\.)?ebay\.com\/itm\/[^"?&]+)(?:[^"]*)?"/gi
      const dateRegex = /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s*\d{4}\b)/g

      const prices = new Set()
      const priceArr = []
      const titles = []
      const links = []
      const dates = []

      // Try each price extraction method
      let m
      const methods = [dataPriceRegex, spanPriceRegex, tdPriceRegex, anyPriceRegex]
      for (const regex of methods) {
        while ((m = regex.exec(html)) !== null) {
          const price = parseFloat(m[1].replace(/,/g, ''))
          if (price > 1 && price < 500000 && !prices.has(price)) {
            prices.add(price)
            priceArr.push(price)
          }
        }
        if (priceArr.length > 0) break
      }

      while ((m = titleRegex.exec(html)) !== null) {
        const t = m[1].replace(/<[^>]+>/g, '').trim()
        if (t.length > 5 && t.length < 200) titles.push(t)
      }
      while ((m = linkRegex.exec(html)) !== null) links.push(m[1])
      while ((m = dateRegex.exec(html)) !== null) dates.push(m[1])

      const count = Math.min(priceArr.length, 20)
      for (let i = 0; i < count; i++) {
        results.push({
          price: priceArr[i],
          title: titles[i] || query,
          date: dates[i] || null,
          link: links[i] || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`
        })
      }

      if (results.length === 0) {
        // Fallback to eBay if 130point returns nothing
        return NextResponse.json({ results: [], avg: 0, high: 0, low: 0, source: '130point', fallback: true })
      }

      const avg = results.reduce((s, r) => s + r.price, 0) / results.length
      return NextResponse.json({
        results,
        avg,
        high: Math.max(...results.map(r => r.price)),
        low: Math.min(...results.map(r => r.price)),
        source: '130point'
      })
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  if (source === 'ebay') {
    try {
      const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1&LH_Complete=1&_sop=13&_ipg=60`
      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        }
      })
      const html = await res.text()
      const results = []

      // eBay sold listings use s-item__price and s-item__title
      // Split by list item
      const itemBlocks = html.split('s-item__wrapper')

      for (const block of itemBlocks) {
        if (results.length >= 20) break
        if (!block.includes('s-item__price')) continue

        // Price - handle ranges by taking first number
        const priceMatch = block.match(/s-item__price[^>]*>[\s\S]*?\$([0-9,]+\.?[0-9]*)/) ||
                           block.match(/\$([0-9,]+\.[0-9]{2})/)
        if (!priceMatch) continue
        const price = parseFloat(priceMatch[1].replace(/,/g, ''))
        if (!price || price < 0.5 || price > 500000) continue

        // Title
        const titleMatch = block.match(/s-item__title[^>]*><span[^>]*>([\s\S]*?)<\/span>/) ||
                           block.match(/s-item__title[^>]*>([\s\S]*?)<\//)
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace('Shop on eBay', '').trim() : query
        if (!title || title === 'Shop on eBay') continue

        // Date sold
        const dateMatch = block.match(/SOLD\s+(\w+\s+\d+)/) ||
                          block.match(/s-item__ended-date[^>]*>([\s\S]*?)<\//) ||
                          block.match(/(\w+ \d+, \d{4})/)
        const date = dateMatch ? dateMatch[1].trim() : null

        // Link
        const linkMatch = block.match(/href="(https?:\/\/(?:www\.)?ebay\.com\/itm\/[0-9]+)/)
        const link = linkMatch ? linkMatch[1] : `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1`

        results.push({ price, title, date, link })
      }

      if (results.length === 0) {
        return NextResponse.json({ results: [], avg: 0, high: 0, low: 0, source: 'ebay' })
      }

      const avg = results.reduce((s, r) => s + r.price, 0) / results.length
      return NextResponse.json({
        results,
        avg,
        high: Math.max(...results.map(r => r.price)),
        low: Math.min(...results.map(r => r.price)),
        source: 'ebay'
      })
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
}
