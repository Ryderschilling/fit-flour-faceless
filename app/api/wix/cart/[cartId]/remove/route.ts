/**
 * POST /api/wix/cart/[cartId]/remove
 * Removes a line item from a cart entirely.
 *
 * Body: { lineId: string }
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE } from '@/lib/wix-api'

export async function POST(
  req: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    const { lineId } = await req.json()

    if (!lineId) {
      return NextResponse.json({ error: 'lineId is required' }, { status: 400 })
    }

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
      console.error('[api/wix/cart/remove] error', res.status, text)
      return NextResponse.json({ error: 'Failed to remove item' }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch (err) {
    console.error('[api/wix/cart/remove] unexpected error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
