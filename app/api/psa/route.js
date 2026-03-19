import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
    const frontImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/front.jpg`
    const backImage = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/back.jpg`

    // Detect auto cards — PSA encodes autos as "AUTOGEM MT 10" in CardGrade.
    // AutoGrade is a separate field PSA rarely populates (only when the auto
    // itself gets its own grade). We also detect from brand/variety/set keywords
    // for cards like "SP SIGNATURE SCRIPTED IN TIME" where CardGrade is plain "MINT 9".
    const cardGradeRaw = cert_data.CardGrade || ''
    const autoKeyword = /\b(auto|autograph|signature|signed)\b/i
    const isAuto =
      /^AUTO/i.test(cardGradeRaw) ||
      !!cert_data.AutoGrade ||
      autoKeyword.test(cert_data.Brand || '') ||
      autoKeyword.test(cert_data.Variety || '') ||
      autoKeyword.test(cert_data.CardName || '') ||
      autoKeyword.test(cert_data.GradeDescription || '')
    // Extract numeric grade — works for both "AUTOGEM MT 10" and plain "GEM MT 10"
    const gradeNumeric = cardGradeRaw.replace(/[^0-9.]/g, '').trim() || null
    // Separate auto grade (PSA-assigned auto-only grade) — numeric only
    const autoGradeNumeric = cert_data.AutoGrade
      ? cert_data.AutoGrade.replace(/[^0-9.]/g, '').trim() || null
      : null
    // Grade description — strip leading AUTO prefix so it reads "GEM MT 10" not "AUTOGEM MT 10"
    const gradeDesc = (cert_data.GradeDescription || '').replace(/^AUTO\s*/i, '').trim() || null

    const payload = {
      valid: true,
      cert: cert_data.CertNumber,
      grade: gradeNumeric,
      isAuto,
      autoGrade: autoGradeNumeric,
      gradeDescription: gradeDesc,
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
    }

    // Save / update PSA cache in DB for admin visibility
    try {
      await prisma.pSACache.upsert({
        where: { cert: String(cert_data.CertNumber) },
        update: { data: JSON.stringify(payload) },
        create: { cert: String(cert_data.CertNumber), data: JSON.stringify(payload) },
      })
    } catch (_) { /* non-critical — don't fail the lookup if cache write fails */ }

    return NextResponse.json(payload)

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
