/**
 * POST /api/wix/cart/[cartId]/checkout
 *
 * 1. Creates a checkout from the cart (Wix eCommerce)
 * 2. Creates a redirect session (Wix Headless Redirects API)
 * 3. Returns { url } — the Wix-hosted checkout page URL
 *
 * After payment, Wix redirects the buyer to `postFlowUrl` (fitflour.shop).
 *
 * ⚠️  SETUP REQUIRED: Add fitflour.shop as an allowed redirect domain in
 *     Wix Dashboard → Settings → Headless Settings → Allowed Redirect Domains
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE } from '@/lib/wix-api'

const POST_FLOW_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fitflour.shop'

export async function POST(
  _req: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    // ── Step 1: Create checkout from cart ──────────────────────────────────
    const checkoutRes = await fetch(
      `${WIX_BASE}/ecom/v1/carts/${params.cartId}/create-checkout`,
      {
        method: 'POST',
        headers: wixHeaders(),
        body: JSON.stringify({ channelType: 'WEB' }),
      }
    )

    if (!checkoutRes.ok) {
      const text = await checkoutRes.text()
      console.error('[api/wix/checkout] create-checkout error', checkoutRes.status, text)
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: checkoutRes.status })
    }

    const checkoutData = await checkoutRes.json()
    const checkoutId: string = checkoutData.checkoutId

    if (!checkoutId) {
      console.error('[api/wix/checkout] no checkoutId in response', checkoutData)
      return NextResponse.json({ error: 'No checkoutId returned' }, { status: 500 })
    }

    // ── Step 2: Get Wix-hosted checkout redirect URL ───────────────────────
    const redirectRes = await fetch(
      `${WIX_BASE}/redirect-session/v1/redirect-session`,
      {
        method: 'POST',
        headers: wixHeaders(),
        body: JSON.stringify({
          ecomCheckout: { checkoutId },
          callbacks: { postFlowUrl: POST_FLOW_URL },
        }),
      }
    )

    if (!redirectRes.ok) {
      const text = await redirectRes.text()
      console.error('[api/wix/checkout] redirect-session error', redirectRes.status, text)
      // Fallback: direct Wix checkout URL (may not always work without redirect session)
      return NextResponse.json({ url: `https://www.wix.com/checkout/${checkoutId}` })
    }

    const redirectData = await redirectRes.json()
    const url: string = redirectData.redirectSession?.fullUrl ?? '#'

    return NextResponse.json({ url })
  } catch (err) {
    console.error('[api/wix/checkout] unexpected error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
