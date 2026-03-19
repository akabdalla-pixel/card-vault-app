import { NextResponse } from 'next/server'

const PSA_TOKEN = process.env.PSA_TOKEN

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert')?.trim()
  const side = searchParams.get('side') === 'back' ? 'back' : 'front'

  if (!cert) return new NextResponse('Missing cert', { status: 400 })
  if (!PSA_TOKEN) return new NextResponse('No token', { status: 500 })

  try {
    // Call PSA API to get cert data including image URLs
    const apiRes = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${cert}`, {
      headers: {
        'Authorization': `bearer ${PSA_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!apiRes.ok) return new NextResponse('PSA API error', { status: 404 })

    const data = await apiRes.json()
    const c = data.PSACert

    if (!c) return new NextResponse('Cert not found', { status: 404 })

    // Try every possible image field PSA might return
    let imageUrl = null
    if (side === 'front') {
      imageUrl =
        c.FrontImageURL ||
        c.FrontImageThumbnailURL ||
        c.ImageFront ||
        c.frontImageUrl ||
        c.front_image ||
        (c.CertNumber ? `https://d1htnxwo4o0jhw.cloudfront.net/cert/${c.CertNumber}/front.jpg` : null)
    } else {
      imageUrl =
        c.BackImageURL ||
        c.BackImageThumbnailURL ||
        c.ImageBack ||
        c.backImageUrl ||
        c.back_image ||
        (c.CertNumber ? `https://d1htnxwo4o0jhw.cloudfront.net/cert/${c.CertNumber}/back.jpg` : null)
    }

    if (!imageUrl) return new NextResponse('No image URL', { status: 404 })

    // Proxy the image through our server
    const imgRes = await fetch(imageUrl, {
      headers: {
        'Referer': 'https://www.psacard.com/',
        'User-Agent': 'Mozilla/5.0 (compatible)',
      },
    })

    if (!imgRes.ok) return new NextResponse('Image not found', { status: 404 })

    const buffer = await imgRes.arrayBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': imgRes.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (e) {
    return new NextResponse('Failed: ' + e.message, { status: 500 })
  }
}
