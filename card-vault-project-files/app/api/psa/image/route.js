import { NextResponse } from 'next/server'

const PSA_TOKEN = process.env.PSA_TOKEN

async function tryFetch(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://www.psacard.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    })
    if (res.ok) return res
  } catch {}
  return null
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cert = searchParams.get('cert')?.trim()
  const side = searchParams.get('side') === 'back' ? 'back' : 'front'
  const letter = side === 'front' ? 'F' : 'B'

  if (!cert) return new NextResponse('Missing cert', { status: 400 })

  // Try all known PSA CloudFront URL patterns
  const urlsToTry = [
    // Pattern 1: cert/front.jpg
    `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/${side}.jpg`,
    // Pattern 2: cert/CERTF.jpg
    `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/${cert}${letter}.jpg`,
    // Pattern 3: cert/CERT_F.jpg
    `https://d1htnxwo4o0jhw.cloudfront.net/cert/${cert}/${cert}_${letter}.jpg`,
    // Pattern 4: no subfolder
    `https://d1htnxwo4o0jhw.cloudfront.net/${cert}${letter}.jpg`,
    // Pattern 5: PSA API image endpoint
    `https://api.psacard.com/publicapi/cert/GetImageByCertNumber/${cert}?side=${side}`,
  ]

  // Also try PSA API to get the image URL from cert data
  if (PSA_TOKEN) {
    try {
      const apiRes = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${cert}`, {
        headers: { 'Authorization': `bearer ${PSA_TOKEN}` },
      })
      if (apiRes.ok) {
        const data = await apiRes.json()
        const c = data.PSACert
        if (c) {
          // Log ALL fields so we can find the right image field name
          console.log('ALL PSA cert fields:', JSON.stringify(Object.keys(c)))
          console.log('ALL PSA cert values:', JSON.stringify(c))

          // Try every plausible image field name
          const imgUrl = side === 'front'
            ? (c.FrontImageURL || c.FrontImageThumbnailURL || c.ImageFront || c.frontImage || c.Front || c.FrontImage || c.image_front || c.ImageFrontURL)
            : (c.BackImageURL || c.BackImageThumbnailURL || c.ImageBack || c.backImage || c.Back || c.BackImage || c.image_back || c.ImageBackURL)

          if (imgUrl) {
            console.log('Found image URL in API response:', imgUrl)
            urlsToTry.unshift(imgUrl) // try this first
          }
        }
      }
    } catch (e) {
      console.log('PSA API call failed:', e.message)
    }
  }

  // Try each URL in order
  for (const url of urlsToTry) {
    console.log('Trying image URL:', url)
    const res = await tryFetch(url)
    if (res) {
      console.log('Success with URL:', url)
      const buffer = await res.arrayBuffer()
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': res.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }
  }

  console.log('All image URLs failed for cert:', cert)
  return new NextResponse('Image not found', { status: 404 })
}
