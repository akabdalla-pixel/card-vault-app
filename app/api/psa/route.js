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

    // Try PSA image endpoint if not in cert data
    if (!frontImage) {
      try {
        const imgRes = await fetch(`https://api.psacard.com/publicapi/cert/GetImageByCertNumber/${cert}`, {
          headers: {
            'Authorization': `bearer ${PSA_TOKEN}`,
            'Content-Type': 'application/json',
          }
        })
        if (imgRes.ok) {
          const imgData = await imgRes.json()
          console.log('PSA imgData full:', JSON.stringify(imgData))
          frontImage = imgData.FrontImageURL || imgData.frontImageURL || imgData.front_image_url || imgData.front || imgData.ImageFront || null
          backImage = imgData.BackImageURL || imgData.backImageURL || imgData.back_image_url || imgData.back || imgData.ImageBack || null
        } else {
          console.log('PSA image endpoint status:', imgRes.status, await imgRes.text())
        }
      } catch (e) {
        console.log('PSA image endpoint error:', e.message)
      }
    }

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
