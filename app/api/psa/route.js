import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const PSA_TOKEN = process.env.PSA_TOKEN
const CACHE_TTL_HOURS = 24

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert')?.trim()

  if (!cert) return NextResponse.json({ error: 'No cert number provided' }, { status: 400 })
  if (!PSA_TOKEN) return NextResponse.json({ error: 'PSA token not configured' }, { status: 500 })

  // Check database cache first
  try {
    const cached = await prisma.pSACache.findUnique({ where: { cert } })
    if (cached) {
      const ageHours = (Date.now() - new Date(cached.updatedAt).getTime()) / (1000 * 60 * 60)
      if (ageHours < CACHE_TTL_HOURS) {
        return NextResponse.json(JSON.parse(cached.data))
      }
    }
  } catch (e) {}

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

    // Log raw cert data to identify correct field names
    console.log('PSA raw cert_data keys:', Object.keys(cert_data))
    console.log('PSA CardGrade:', cert_data.CardGrade)
    console.log('PSA GradeDescription:', cert_data.GradeDescription)

    // Extract auto grade - try multiple possible field names
    const autoGradeRaw =
      cert_data.AutoGrade ||
      cert_data.AutoGradeCode ||
      cert_data.AutographGrade ||
      cert_data.AuthGrade ||
      null

    // Also try parsing from CardGrade (e.g. "10/A10")
    let autoGradeFromCardGrade = null
    if (cert_data.CardGrade) {
      const autoMatch = cert_data.CardGrade.match(/A(\d+(?:\.\d+)?)/i)
      if (autoMatch) autoGradeFromCardGrade = autoMatch[1]
    }

    // Also try parsing from GradeDescription (e.g. "GEM MT 10 A10")
    let autoGradeFromDesc = null
    if (cert_data.GradeDescription) {
      const autoMatch = cert_data.GradeDescription.match(/A(\d+(?:\.\d+)?)/i)
      if (autoMatch) autoGradeFromDesc = autoMatch[1]
    }

    const resolvedAutoGrade = autoGradeRaw || autoGradeFromCardGrade || autoGradeFromDesc

    const result = {
      valid: true,
      cert: cert_data.CertNumber,
      grade: cert_data.CardGrade ? cert_data.CardGrade.replace(/[^0-9.]/g, '').trim() : null,
      autoGrade: resolvedAutoGrade,
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
      certPageUrl: certPageUrl,
      totalPop: cert_data.TotalPopulation || 0,
      totalPopWithQualifier: cert_data.TotalPopulationWithQualifier || 0,
      popHigher: cert_data.PopulationHigher || 0,
      raw: cert_data,
    }

    try {
      await prisma.pSACache.upsert({
        where: { cert },
        update: { data: JSON.stringify(result) },
        create: { cert, data: JSON.stringify(result) },
      })
    } catch (e) {}

    return NextResponse.json(result)

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
