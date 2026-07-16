/**
 * POST /api/wix/cart
 * Creates a new Wix eCommerce cart and returns it.
 * Returns wixError + wixStatus in the response body so the client can surface the real issue.
 */

import { NextResponse } from 'next/server'
import { wixHeaders, WIX_BASE } from '@/lib/wix-api'

export async function POST() {
  try {
    const headers = wixHeaders()
    const res = await fetch(`${WIX_BASE}/ecom/v1/carts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })

    const text = await res.text()

    if (!res.ok) {
      console.error('[api/wix/cart] create error', res.status, text)
      return NextResponse.json(
        { error: 'Failed to create cart', wixStatus: res.status, wixError: text },
        { status: res.status }
      )
    }

    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[api/wix/cart] unexpected error', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}
