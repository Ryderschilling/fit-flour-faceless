import { NextResponse } from 'next/server'

/**
 * GET /api/recent-orders
 *
 * Returns the last 30 real orders from Wix eCommerce — mapped to
 * the minimum fields SocialProofToast needs (no full PII in the browser).
 * Cached for 5 minutes via Next.js ISR.
 */

export const revalidate = 300 // 5 min

export interface RecentOrder {
  firstName: string
  city: string
  state: string
  product: string        // display-friendly short name
  minutesAgo: number    // age of the order when the route was last regenerated
}

function normalizeProduct(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('gluten') || lower.includes('dairy')) return 'Gluten Free Blend'
  return 'Fit Flour Original'
}

export async function GET() {
  const apiKey = process.env.WIX_API_KEY
  const siteId = process.env.WIX_SITE_ID

  if (!apiKey || !siteId) {
    return NextResponse.json({ orders: [] })
  }

  try {
    const res = await fetch('https://www.wixapis.com/ecom/v1/orders/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
        'wix-site-id': siteId,
      },
      body: JSON.stringify({
        search: {
          sort: [{ fieldName: '_createdDate', order: 'DESC' }],
          paging: { limit: 50 },
        },
      }),
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.warn('[recent-orders] Wix API error', res.status)
      return NextResponse.json({ orders: [] })
    }

    const data = await res.json()
    const now = Date.now()

    const orders: RecentOrder[] = (data.orders ?? [])
      .filter((o: any) => {
        const contact = o.billingInfo?.contactDetails
        const address = o.billingInfo?.address
        return contact?.firstName && address?.city?.trim()
      })
      .map((o: any) => {
        const contact = o.billingInfo.contactDetails
        const address = o.billingInfo.address
        const productRaw = o.lineItems?.[0]?.productName?.original ?? 'Fit Flour'
        const createdMs = new Date(o.createdDate).getTime()
        const minutesAgo = Math.max(1, Math.round((now - createdMs) / 60_000))

        return {
          firstName: contact.firstName.trim(),
          city: address.city.trim().replace(/\s+$/, ''), // strip trailing spaces
          state: (address.subdivision ?? '').replace('US-', '').trim(),
          product: normalizeProduct(productRaw),
          minutesAgo,
        } satisfies RecentOrder
      })

    return NextResponse.json({ orders })
  } catch (err) {
    console.warn('[recent-orders] fetch failed', err)
    return NextResponse.json({ orders: [] })
  }
}
