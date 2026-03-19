import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert')?.trim()
  const side = searchParams.get('side') === 'back' ? 'back' : 'front'

  if (!cert) return new NextResponse('Missing cert', { status: 400 })

  const url = `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/${side}.jpg`

  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://www.psacard.com/',
        'User-Agent': 'Mozilla/5.0 (compatible)',
      },
    })

    if (!res.ok) return new NextResponse('Image not found', { status: 404 })

    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}
