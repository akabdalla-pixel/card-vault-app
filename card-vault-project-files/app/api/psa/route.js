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

    // Try to get image by scraping the PSA cert page
    let frontImage = null
    let backImage = null
    try {
      const pageRes = await fetch(`https://www.psacard.com/cert/${cert}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      })
      const html = await pageRes.text()

      // PSA uses cloudfront URLs in their cert pages
      const imgMatches = html.match(/https:\/\/[^"'\s]+(?:front|back|obverse|reverse)[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi) || []
      const cfMatches = html.match(/https:\/\/d1htnxwo4o0jhw\.cloudfront\.net\/[^"'\s]+/gi) || []
      const allImgs = [...new Set([...imgMatches, ...cfMatches])]

      frontImage = allImgs.find(u => /front|obverse/i.test(u)) || allImgs[0] || null
      backImage = allImgs.find(u => /back|reverse/i.test(u)) || allImgs[1] || null

      // Also try the standard cloudfront pattern with cert number
      if (!frontImage) {
        frontImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/front.jpg`
        backImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/back.jpg`
      }
    } catch(e) {
      // fallback to standard URLs
      frontImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/front.jpg`
      backImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/back.jpg`
    }

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
      isFrontAvailable: !!frontImage,
      isBackAvailable: !!backImage,
      raw: cert_data,
    })

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
