/**
 * POST /api/wix/cart/[cartId]/add
 * Adds a catalog line item (Wix Stores product variant) to a cart.
 *
 * Body: { variantId: string, qty: number }
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE, WIX_STORES_APP_ID } from '@/lib/wix-api'

export async function POST(
  req: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    const { variantId, qty = 1 } = await req.json()

    if (!variantId) {
      return NextResponse.json({ error: 'variantId is required' }, { status: 400 })
    }

    const res = await fetch(`${WIX_BASE}/ecom/v1/carts/${params.cartId}/add-to-cart`, {
      method: 'POST',
      headers: wixHeaders(),
      body: JSON.stringify({
        lineItems: [
          {
            catalogReference: {
              catalogItemId: variantId,
              appId: WIX_STORES_APP_ID,
            },
            quantity: qty,
          },
        ],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[api/wix/cart/add] error', res.status, text)
      return NextResponse.json({ error: 'Failed to add item' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/wix/cart/add] unexpected error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
