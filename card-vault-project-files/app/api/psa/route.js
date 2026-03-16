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

    if (!data.IsValidRequest) {
      return NextResponse.json({ error: data.ServerMessage || 'Invalid cert number', debug: { IsValidRequest: data.IsValidRequest, ServerMessage: data.ServerMessage, keys: Object.keys(data) } }, { status: 404 })
    }

    const cert_data = data.PSACert

    return NextResponse.json({
      valid: true,
      cert: cert_data.CertNumber,
      grade: cert_data.CardGrade,
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
      frontImage: cert_data.IsFrontImageAvailable ? `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/front.jpg` : null,
      backImage: cert_data.IsBackImageAvailable ? `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/back.jpg` : null,
      raw: cert_data,
    })

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
