/**
 * Fera Reviews integration (replaces Wix native reviews — store uses Fera app).
 *
 * Fetches published product reviews from the Fera public API and maps them
 * to the WixReview shape consumed by ReviewQuotes.tsx.
 *
 * Cached for 1 hour via Next.js ISR — new reviews appear within the hour
 * without a redeploy.
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
      per_page: String(Math.min(limit * 2, 50)), // fetch extra to account for empty-body filtering
      'rating[gte]': '4',
    })

    const res = await fetch(`https://api.fera.ai/v3/public/reviews?${params}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    })

    if (!res.ok) {
      console.warn('[fera-reviews] API error', res.status, await res.text())
      return []
    }

    const data = await res.json()
    const reviews: any[] = data.data ?? []

    return reviews
      .filter((r) => r.body?.trim()) // skip reviews with no text
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        authorName: r.customer?.display_name?.trim() || 'Verified Buyer',
        rating: Math.round(r.rating ?? 5),
        body: r.body.trim(),
        title: r.heading?.trim() || undefined,
        location: r.customer?.display_location?.trim() || undefined,
        createdDate: r.created_at ?? '',
      }))
  } catch (err) {
    console.warn('[fera-reviews] fetch failed', err)
    return []
  }
}
