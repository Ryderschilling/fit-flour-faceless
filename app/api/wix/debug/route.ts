/**
 * GET /api/wix/debug
 * Tests Wix API connectivity. Open in browser to diagnose auth/config issues.
 * REMOVE before shipping to production.
 */

import { NextResponse } from 'next/server'
import { WIX_BASE } from '@/lib/wix-api'

export async function GET() {
  const apiKey = process.env.WIX_API_KEY
  const siteId = process.env.WIX_SITE_ID

  if (!apiKey || !siteId) {
    return NextResponse.json({
      ok: false,
      issue: 'Missing env vars',
      hasApiKey: !!apiKey,
      hasSiteId: !!siteId,
    })
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: apiKey,
    'wix-site-id': siteId,
  }

  // Test 1: Create cart
  const cartRes = await fetch(`${WIX_BASE}/ecom/v1/carts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  })
  const cartText = await cartRes.text()

  // Test 2: Query products — get full variant data
  const productsRes = await fetch(`${WIX_BASE}/stores/v1/products/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: { paging: { limit: 2 } } }),
  })
  const productsText = await productsRes.text()
  const productsData = productsRes.ok ? JSON.parse(productsText) : null

  // Extract product + variant + image data for diagnosis
  const productSummary = productsData?.products?.map((p: any) => ({
    productId: p.id,
    name: p.name,
    slug: p.slug,
    mainMediaUrl: p.mainMedia?.image?.url ?? p.mainMedia?.video?.thumbnail?.url ?? null,
    mediaItemsCount: (p.mediaItems ?? []).length,
    firstMediaItemUrl: p.mediaItems?.[0]?.image?.url ?? null,
    variants: (p.variants ?? []).map((v: any) => ({
      variantId: v.id,
      choices: v.choices,
      inStock: v.stock?.inStock,
      price: v.variant?.priceData?.price,
    })),
  }))

  // Test 3: Try creating a checkout — use variant ID if exists, else product ID
  const firstProduct = productsData?.products?.[0]
  const firstVariantId = firstProduct?.variants?.[0]?.id ?? firstProduct?.id
  let checkoutTest = null
  if (firstVariantId) {
    const coRes = await fetch(`${WIX_BASE}/ecom/v1/checkouts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        channelType: 'WEB',
        lineItems: [{
          catalogReference: {
            catalogItemId: firstVariantId,
            appId: '1380b703-ce81-ff05-f115-39571d94dfcd',
          },
          quantity: 1,
        }],
      }),
    })
    const coText = await coRes.text()
    checkoutTest = { status: coRes.status, ok: coRes.ok, variantUsed: firstVariantId, body: coText.slice(0, 800) }
  }

  // Test 4: Blog posts — show raw first post to find image field
  const blogRes = await fetch(`${WIX_BASE}/blog/v3/posts?paging.limit=2`, { headers })
  const blogText = await blogRes.text()
  let blogFirstPost = null
  if (blogRes.ok) {
    try {
      const bd = JSON.parse(blogText)
      blogFirstPost = bd.posts?.[0] ?? null
    } catch {}
  }

  return NextResponse.json({
    env: { hasApiKey: true, hasSiteId: true, keyPrefix: apiKey.slice(0, 20) + '...' },
    cart: { status: cartRes.status, ok: cartRes.ok, body: cartText.slice(0, 200) },
    products: { status: productsRes.status, ok: productsRes.ok, summary: productSummary },
    checkoutTest: checkoutTest ? { status: checkoutTest.status, ok: checkoutTest.ok } : null,
    blog: {
      status: blogRes.status,
      ok: blogRes.ok,
      // Raw first post — shows exact field structure for images
      firstPost: blogFirstPost,
    },
  })
}
