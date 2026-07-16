/**
 * GET /api/wix/cart/[cartId]
 * Retrieves an existing cart by ID. Returns 404 if not found.
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE } from '@/lib/wix-api'

export async function GET(
  _req: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    const res = await fetch(`${WIX_BASE}/ecom/v1/carts/${params.cartId}`, {
      method: 'GET',
      headers: wixHeaders(),
      cache: 'no-store',
    })

    if (res.status === 404 || res.status === 400) {
      return NextResponse.json({ cart: null }, { status: 404 })
    }

    if (!res.ok) {
      const text = await res.text()
      console.error('[api/wix/cart/get] error', res.status, text)
      return NextResponse.json({ cart: null }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[api/wix/cart/get] unexpected error', err)
    return NextResponse.json({ cart: null }, { status: 500 })
  }
}
