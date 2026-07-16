/**
 * POST /api/wix/checkout
 *
 * Accepts the current cart line items, creates a Wix checkout directly
 * (bypassing the Wix cart API which requires plan-specific access), then
 * returns a redirect URL to Wix's hosted checkout page.
 *
 * Body: { lines: Array<{ variantId: string; quantity: number }> }
 * Response: { url: string }
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE, WIX_STORES_APP_ID } from '@/lib/wix-api'

const POST_FLOW_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fitflour.shop'

export async function POST(req: Request) {
  try {
    const { lines } = await req.json() as {
      lines: { variantId: string; quantity: number }[]
    }

    if (!lines?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const headers = wixHeaders()

    // ── Step 1: Create Wix checkout directly with line items ───────────────
    const checkoutRes = await fetch(`${WIX_BASE}/ecom/v1/checkouts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channelType: 'WEB',
        lineItems: lines.map(({ variantId, quantity }) => ({
          catalogReference: {
            catalogItemId: variantId,
            appId: WIX_STORES_APP_ID,
          },
          quantity,
        })),
      }),
    })

    const checkoutText = await checkoutRes.text()

    if (!checkoutRes.ok) {
      console.error('[api/wix/checkout] create checkout error', checkoutRes.status, checkoutText)
      return NextResponse.json(
        { error: 'Failed to create checkout', wixStatus: checkoutRes.status, wixError: checkoutText },
        { status: checkoutRes.status }
      )
    }

    const checkoutData = JSON.parse(checkoutText)
    const checkoutId: string = checkoutData.checkout?.id ?? checkoutData.checkoutId

    if (!checkoutId) {
      console.error('[api/wix/checkout] no checkoutId in response', checkoutData)
      return NextResponse.json({ error: 'No checkout ID returned' }, { status: 500 })
    }

    // ── Step 2: Get hosted checkout redirect URL ───────────────────────────
    const redirectRes = await fetch(`${WIX_BASE}/redirect-session/v1/redirect-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ecomCheckout: { checkoutId },
        callbacks: { postFlowUrl: POST_FLOW_URL },
      }),
    })

    const redirectText = await redirectRes.text()

    if (!redirectRes.ok) {
      console.error('[api/wix/checkout] redirect session error', redirectRes.status, redirectText)
      // Fallback URL — direct Wix checkout page
      return NextResponse.json({
        url: `https://www.fitflour.shop/checkout/${checkoutId}`,
      })
    }

    const redirectData = JSON.parse(redirectText)
    const url: string = redirectData.redirectSession?.fullUrl ?? '#'

    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('[api/wix/checkout] unexpected error', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}
