/**
 * Fera Reviews integration (replaces Wix native reviews — store uses Fera app).
 *
 * Fetches published product reviews from the Fera public API and maps them
 * to the WixReview shape consumed by ReviewQuotes.tsx.
 *
 * Required env var:
 *   FERA_PUBLIC_KEY  — from app.fera.ai → Configuration → API Keys → Public Key
 */

export interface WixReview {
  id: string
  authorName: string
  rating: number
  body: string
  title?: string
  location?: string
  createdDate: string
}

export async function getWixReviews(limit = 20): Promise<WixReview[]> {
  const publicKey = process.env.FERA_PUBLIC_KEY

  if (!publicKey) {
    console.warn('[fera-reviews] FERA_PUBLIC_KEY not set — using static fallback')
    return []
  }

  try {
    const params = new URLSearchParams({
      public_key: publicKey,
      status: 'published',
      per_page: String(Math.min(limit * 2, 50)),
      'rating[gte]': '4',
    })

    const url = `https://api.fera.ai/v3/public/reviews?${params}`
    console.log('[fera-reviews] fetching', url.replace(publicKey, 'REDACTED'))

    // cache: 'no-store' forces a fresh fetch every build — avoids stale build-cache
    const res = await fetch(url, { cache: 'no-store' })

    if (!res.ok) {
      const body = await res.text()
      console.warn('[fera-reviews] API error', res.status, body)
      return []
    }

    const data = await res.json()

    // Log structure so we can debug response shape in build logs
    console.log('[fera-reviews] response keys:', Object.keys(data))
    console.log('[fera-reviews] review count:', Array.isArray(data) ? data.length : (data.data?.length ?? data.reviews?.length ?? 'unknown'))

    // Handle multiple possible response shapes from Fera API
    const rawReviews: any[] =
      Array.isArray(data)
        ? data
        : data.data ?? data.reviews ?? data.results ?? []

    console.log('[fera-reviews] parsed', rawReviews.length, 'reviews')

    return rawReviews
      .filter((r) => r.body?.trim())
      .slice(0, limit)
      .map((r) => ({
        id: r.id ?? String(Math.random()),
        authorName: r.customer?.display_name?.trim() || r.reviewer?.name?.trim() || 'Verified Buyer',
        rating: Math.round(r.rating ?? 5),
        body: r.body.trim(),
        title: r.heading?.trim() || r.title?.trim() || undefined,
        location: r.customer?.display_location?.trim() || r.reviewer?.location?.trim() || undefined,
        createdDate: r.created_at ?? r.submitted_at ?? '',
      }))
  } catch (err) {
    console.warn('[fera-reviews] fetch failed', err)
    return []
  }
}
