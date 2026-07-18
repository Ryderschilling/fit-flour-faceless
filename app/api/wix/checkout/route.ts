/**
 * POST /api/wix/checkout
 *
 * Correct flow (requires WIX_CLIENT_ID from a Wix Headless OAuth app):
 *   1. Get anonymous visitor token
 *   2. Create checkout WITH visitor token (NOT admin key)
 *   3. Create redirect session WITH same visitor token
 *   → redirect user to redirectSession.fullUrl
 *
 * Fallback (no WIX_CLIENT_ID):
 *   Creates checkout with admin key, returns direct site URL.
 *
 * Body: { lines: Array<{ variantId: string; quantity: number }> }
 * Response: { url: string }
 */

import { NextResponse } from 'next/server'
import { WIX_BASE, WIX_STORES_APP_ID, wixHeaders } from '@/lib/wix-api'

const WIX_SITE_URL = process.env.WIX_SITE_URL ?? 'https://fitflour.shop'
const POST_FLOW_URL = process.env.NEXT_PUBLIC_SITE_URL ?? WIX_SITE_URL

export async function POST(req: Request) {
  try {
    const { lines } = await req.json() as {
      lines: { variantId: string; quantity: number }[]
    }

    if (!lines?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const lineItems = lines.map(({ variantId, quantity }) => ({
      catalogReference: {
        catalogItemId: variantId,
        appId: WIX_STORES_APP_ID,
      },
      quantity,
    }))

    const clientId = process.env.WIX_CLIENT_ID

    // ── Preferred flow: visitor token → checkout → redirect session ───────────
    if (clientId) {
      // Step 1: Get anonymous visitor token
      const tokenRes = await fetch('https://www.wixapis.com/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grant_type: 'anonymous', client_id: clientId }),
      })

      if (!tokenRes.ok) {
        const err = await tokenRes.text()
        console.error('[checkout] visitor token failed', tokenRes.status, err)
      } else {
        const tokenData = await tokenRes.json()
        const visitorToken: string | undefined = tokenData.access_token

        if (visitorToken) {
          const visitorHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${visitorToken}`,
          }

          // Step 2: Create checkout WITH visitor token (not admin key)
          const checkoutRes = await fetch(`${WIX_BASE}/ecom/v1/checkouts`, {
            method: 'POST',
            headers: visitorHeaders,
            body: JSON.stringify({ channelType: 'WEB', lineItems }),
          })

          if (!checkoutRes.ok) {
            const err = await checkoutRes.text()
            console.error('[checkout] create checkout failed', checkoutRes.status, err)
          } else {
            const checkoutData = await checkoutRes.json()
            const checkoutId: string | undefined = checkoutData.checkout?.id ?? checkoutData.checkoutId

            if (!checkoutId) {
              console.error('[checkout] no checkoutId in response', checkoutData)
            } else {
              // Step 3: Redirect session WITH same visitor token
              const redirectRes = await fetch(`${WIX_BASE}/redirect-session/v1/redirect-session`, {
                method: 'POST',
                headers: visitorHeaders,
                body: JSON.stringify({
                  ecomCheckout: { checkoutId },
                  callbacks: { postFlowUrl: POST_FLOW_URL },
                }),
              })

              if (!redirectRes.ok) {
                const err = await redirectRes.text()
                console.error('[checkout] redirect session failed', redirectRes.status, err)
              } else {
                const redirectData = await redirectRes.json()
                const url: string | undefined = redirectData.redirectSession?.fullUrl

                if (url) {
                  console.log('[checkout] success →', url)
                  return NextResponse.json({ url })
                }

                console.error('[checkout] no fullUrl in redirect response', redirectData)
              }
            }
          }
        }
      }
    } else {
      console.warn('[checkout] WIX_CLIENT_ID not set — using fallback')
    }

    // ── Fallback: admin key checkout + direct URL ─────────────────────────────
    const checkoutRes = await fetch(`${WIX_BASE}/ecom/v1/checkouts`, {
      method: 'POST',
      headers: wixHeaders(),
      body: JSON.stringify({ channelType: 'WEB', lineItems }),
    })

    const checkoutText = await checkoutRes.text()

    if (!checkoutRes.ok) {
      console.error('[checkout] fallback checkout failed', checkoutRes.status, checkoutText)
      return NextResponse.json(
        { error: 'Failed to create checkout', wixStatus: checkoutRes.status, detail: checkoutText },
        { status: checkoutRes.status }
      )
    }

    const checkoutData = JSON.parse(checkoutText)
    const checkoutId: string | undefined = checkoutData.checkout?.id ?? checkoutData.checkoutId

    if (!checkoutId) {
      return NextResponse.json({ error: 'No checkout ID returned' }, { status: 500 })
    }

    const fallbackUrl = `${WIX_SITE_URL}/checkout?checkoutId=${checkoutId}`
    console.log('[checkout] fallback URL', fallbackUrl)
    return NextResponse.json({ url: fallbackUrl })

  } catch (err: any) {
    console.error('[checkout] unexpected error', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}
