/**
 * Wix Headless — products only.
 * Cart is managed locally in cart-context.tsx.
 * Checkout is handled via /api/wix/checkout.
 */

import type { Commerce } from './index'
import { wixFetch, mapWixProduct } from '@/lib/wix-api'

async function getProducts() {
  const res = await wixFetch('/stores/v1/products/query', {
    method: 'POST',
    body: JSON.stringify({ query: { paging: { limit: 50 } } }),
    next: { revalidate: 3600 },
  } as any)

  if (!res.ok) {
    console.error('[wix] getProducts error', res.status)
    return []
  }
  const data = await res.json()
  return (data.products ?? []).map(mapWixProduct)
}

async function getProduct(handle: string) {
  const res = await wixFetch('/stores/v1/products/query', {
    method: 'POST',
    body: JSON.stringify({
      query: {
        filter: JSON.stringify({ slug: { $eq: handle } }),
        paging: { limit: 1 },
      },
    }),
    next: { revalidate: 3600 },
  } as any)

  if (!res.ok) return null
  const data = await res.json()
  return data.products?.[0] ? mapWixProduct(data.products[0]) : null
}

export const wixCommerce: Commerce = {
  getProducts,
  getProduct,
}
