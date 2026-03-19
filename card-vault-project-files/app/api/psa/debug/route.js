import { NextResponse } from 'next/server'

const PSA_TOKEN = process.env.PSA_TOKEN

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert') || '83834492'

  const res = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${cert}`, {
    headers: { 'Authorization': `bearer ${PSA_TOKEN}` },
  })

  const data = await res.json()
  return NextResponse.json(data)
}
