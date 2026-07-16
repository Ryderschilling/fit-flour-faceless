/**
 * Wix Reviews API integration.
 *
 * Fetches published store reviews and caches the result for 1 hour via Next.js ISR.
 * Falls back to an empty array if env vars are missing or the API call fails —
 * ReviewQuotes.tsx then renders its static fallback instead.
 *
 * Required env vars (set in Vercel dashboard + .env.local):
 *   WIX_API_KEY   — your site's API key  (Settings → Advanced → API Keys)
 *   WIX_SITE_ID   — your site ID          (visible in the Wix dashboard URL)
 */

export interface WixReview {
  id: string
  authorName: string
  rating: number
  body: string
  title?: string
  createdDate: string
}

export async function getWixReviews(limit = 20): Promise<WixReview[]> {
  const apiKey = process.env.WIX_API_KEY
  const siteId = process.env.WIX_SITE_ID

  if (!apiKey || !siteId) {
    // No credentials — caller uses static fallback
    return []
  }

  try {
    const res = await fetch('https://www.wixapis.com/reviews/v1/reviews/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
        'wix-site-id': siteId,
      },
      body: JSON.stringify({
        query: {
          filter: {
            namespace: 'stores',
            status: 'PUBLISHED',
          },
          sort: [{ fieldName: 'createdDate', order: 'DESC' }],
          paging: { limit },
        },
      }),
      // ISR: Next.js revalidates this fetch result every hour in the background
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn('[wix-reviews] API error', res.status, await res.text())
      return []
    }

    const data = await res.json()
    const reviews: any[] = data.reviews ?? []

    return reviews
      .filter((r) => r.content?.body?.trim()) // skip empty bodies
      .map((r) => ({
        id: r.id,
        authorName: r.author?.authorName?.trim() || 'Verified Buyer',
        rating: r.content?.rating ?? 5,
        body: r.content?.body?.trim() ?? '',
        title: r.content?.title?.trim() || undefined,
        createdDate: r.createdDate ?? '',
      }))
  } catch (err) {
    console.warn('[wix-reviews] fetch failed', err)
    return []
  }
}
