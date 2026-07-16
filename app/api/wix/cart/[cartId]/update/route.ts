/**
 * POST /api/wix/cart/[cartId]/update
 * Updates a line item's quantity. If qty ≤ 0, removes the item instead.
 *
 * Body: { lineId: string, qty: number }
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE } from '@/lib/wix-api'

export async function POST(
  req: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    const { lineId, qty } = await req.json()

    if (!lineId) {
      return NextResponse.json({ error: 'lineId is required' }, { status: 400 })
    }

    // qty ≤ 0 means "remove" — Wix update-line-items-quantity doesn't accept 0
    if (qty <= 0) {
      const res = await fetch(
        `${WIX_BASE}/ecom/v1/carts/${params.cartId}/remove-line-items`,
        {
          method: 'POST',
          headers: wixHeaders(),
          body: JSON.stringify({ lineItemIds: [lineId] }),
        }
      )
      if (!res.ok) {
        const text = await res.text()
        console.error('[api/wix/cart/update→remove] error', res.status, text)
        return NextResponse.json({ error: 'Failed to remove item' }, { status: res.status })
      }
      return NextResponse.json(await res.json())
    }

    // Normal quantity update
    const res = await fetch(
      `${WIX_BASE}/ecom/v1/carts/${params.cartId}/update-line-items-quantity`,
      {
        method: 'POST',
        headers: wixHeaders(),
        body: JSON.stringify({ lineItems: [{ id: lineId, quantity: qty }] }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('[api/wix/cart/update] error', res.status, text)
      return NextResponse.json({ error: 'Failed to update quantity' }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch (err) {
    console.error('[api/wix/cart/update] unexpected error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
