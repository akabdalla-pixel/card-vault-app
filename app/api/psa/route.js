import { NextResponse } from 'next/server'

const PSA_TOKEN = process.env.PSA_TOKEN

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert')?.trim()

  if (!cert) return NextResponse.json({ error: 'No cert number provided' }, { status: 400 })
  if (!PSA_TOKEN) return NextResponse.json({ error: 'PSA token not configured' }, { status: 500 })

  try {
    const res = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${cert}`, {
      headers: {
        'Authorization': `bearer ${PSA_TOKEN}`,
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `PSA API error: ${res.status}`, detail: text }, { status: res.status })
    }

    const data = await res.json()

    if (!data.PSACert) {
      return NextResponse.json({ error: 'Cert not found', debug: data }, { status: 404 })
    }

    const cert_data = data.PSACert

    const certPageUrl = `https://www.psacard.com/cert/${cert}/psa`

    // Check for image URLs directly in cert data first
    let frontImage = cert_data.FrontImageURL || cert_data.frontImageURL || cert_data.ImageFront || cert_data.CardImageFront || null
    let backImage = cert_data.BackImageURL || cert_data.backImageURL || cert_data.ImageBack || cert_data.CardImageBack || null

    // Try to get image from PSA cert page HTML (og:image meta tag)
    if (!frontImage) {
      try {
        const pageRes = await fetch(`https://www.psacard.com/cert/${cert}/psa`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html',
          }
        })
        if (pageRes.ok) {
          const html = await pageRes.text()
          const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
          if (ogMatch?.[1]) {
            frontImage = ogMatch[1]
            console.log('Got image from og:image:', frontImage)
          }
        }
      } catch (e) {
        console.log('PSA page fetch error:', e.message)
      }
    }

    // Final fallback to cloudfront pattern
    if (!frontImage) frontImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/front.jpg`
    if (!backImage) backImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/back.jpg`

    console.log('frontImage resolved:', frontImage)

    return NextResponse.json({
      valid: true,
      cert: cert_data.CertNumber,
      grade: cert_data.CardGrade ? cert_data.CardGrade.replace(/[^0-9.]/g, '').trim() : null,
      autoGrade: cert_data.AutoGrade || null,
      gradeDescription: cert_data.GradeDescription || null,
      player: cert_data.Subject || null,
      year: cert_data.Year || null,
      brand: cert_data.Brand || null,
      cardNumber: cert_data.CardNumber || null,
      variety: cert_data.Variety || null,
      sport: cert_data.SportName || null,
      set: cert_data.CardName || null,
      labelType: cert_data.LabelType || null,
      isCancelled: cert_data.IsCancelled || false,
      reverse: cert_data.ReverseBarCode || null,
      frontImage: frontImage,
      backImage: backImage,
      certPageUrl: certPageUrl,
      totalPop: cert_data.TotalPopulation || 0,
      totalPopWithQualifier: cert_data.TotalPopulationWithQualifier || 0,
      popHigher: cert_data.PopulationHigher || 0,
      raw: cert_data,
    })

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
