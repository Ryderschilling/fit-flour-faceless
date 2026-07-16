/**
 * Shared server-side Wix API helpers.
 *
 * Imported by:
 *   lib/commerce/wix.ts        — product fetching (server components)
 *   app/api/wix/cart/**        — cart proxy routes (server-side API handlers)
 *
 * ⚠️  Do NOT call wixFetch / wixHeaders from client components.
 *     WIX_API_KEY is never sent to the browser.
 */

import type { Cart, CartLine, Money, Product, ProductVariant } from './commerce/types'

export const WIX_BASE = 'https://www.wixapis.com'

/** Wix Stores appId — required in catalogReference for cart operations */
export const WIX_STORES_APP_ID = '1380b703-ce81-ff05-f115-39571d94dfcd'

// ── Auth ────────────────────────────────────────────────────────────────────

export function wixHeaders(): Record<string, string> {
  const apiKey = process.env.WIX_API_KEY
  const siteId = process.env.WIX_SITE_ID
  if (!apiKey || !siteId) {
    throw new Error('WIX_API_KEY and WIX_SITE_ID env vars are required')
  }
  return {
    'Content-Type': 'application/json',
    Authorization: apiKey,
    'wix-site-id': siteId,
  }
}

export async function wixFetch(
  path: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {}
): Promise<Response> {
  const { next, ...rest } = options as any
  return fetch(`${WIX_BASE}${path}`, {
    ...rest,
    headers: { ...wixHeaders(), ...(rest.headers ?? {}) },
    ...(next ? { next } : {}),
  })
}

// ── Image URL ───────────────────────────────────────────────────────────────

export function resolveWixImage(url?: string): string {
  if (!url) return '/images/product-placeholder.png'
  if (url.startsWith('http')) return url
  // Wix sometimes returns just the media path
  return `https://static.wixstatic.com/media/${url}`
}

// ── Cart mapping ─────────────────────────────────────────────────────────────

export function mapWixCart(c: any): Cart {
  const usd = (a: string | number): Money => ({
    amount: typeof a === 'number' ? a : parseFloat(a ?? '0'),
    currency: 'USD',
  })

  const lines: CartLine[] = (c.lineItems ?? []).map((li: any) => ({
    id: li.id,
    variantId: li.catalogReference?.catalogItemId ?? '',
    productTitle: li.productName?.original ?? '',
    variantTitle: 'Default',
    image: resolveWixImage(li.image?.url),
    unitPrice: usd(li.price?.amount ?? '0'),
    quantity: li.quantity ?? 1,
  }))

  return {
    id: c.id,
    lines,
    subtotal: usd(c.subtotal?.amount ?? '0'),
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    checkoutUrl: '#', // generated on demand via /checkout route
  }
}

// ── Product mapping ──────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export function mapWixProduct(p: any): Product {
  const usd = (a: number): Money => ({ amount: a, currency: 'USD' })

  // ── Images
  // Wix products may not have images uploaded — fall back to local assets by slug.
  const LOCAL_IMAGES: Record<string, string> = {
    'power-flour': '/images/products/fit-flour-og-shopify.jpg',
    'fit-flour': '/images/products/fit-flour-og-shopify.jpg',
    'gluten-free-limited-supply': '/images/products/fit-flour-gf-shopify.jpg',
    'gluten-free': '/images/products/fit-flour-gf-shopify.jpg',
  }

  const imgs: { url: string; alt: string }[] = []
  if (p.mainMedia?.image?.url) {
    imgs.push({
      url: resolveWixImage(p.mainMedia.image.url),
      alt: p.mainMedia.image.altText || p.name,
    })
  }
  for (const m of p.mediaItems ?? []) {
    if (m.image?.url && imgs.length < 6) {
      imgs.push({ url: resolveWixImage(m.image.url), alt: m.image.altText || p.name })
    }
  }
  // No Wix images — use local fallback keyed by slug
  if (imgs.length === 0) {
    const slug: string = p.slug ?? ''
    const localImg =
      LOCAL_IMAGES[slug] ??
      Object.entries(LOCAL_IMAGES).find(([k]) => slug.includes(k))?.[1] ??
      '/images/products/fit-flour-og-shopify.jpg'
    imgs.push({ url: localImg, alt: p.name })
  }

  // ── Base price (fallback for variants)
  const basePrice: number = p.priceData?.discountedPrice ?? p.priceData?.price ?? 0

  // ── Variants
  const variants: ProductVariant[] = (p.variants ?? []).map((v: any) => ({
    id: v.id,
    title: Object.values(v.choices ?? {}).join(' / ') || 'Default',
    price: usd(v.variant?.priceData?.discountedPrice ?? v.variant?.priceData?.price ?? basePrice),
    available: v.stock?.inStock ?? true,
  }))

  // Guarantee at least one variant for products that have no options configured
  if (variants.length === 0) {
    variants.push({
      id: p.id,
      title: 'Default',
      price: usd(basePrice),
      available: p.stock?.inStock ?? true,
    })
  }

  // ── Tags (from ribbon)
  const tags: string[] = []
  if (p.ribbon) tags.push(p.ribbon.toLowerCase().replace(/\s+/g, '-'))

  // ── Price range
  const amounts = variants.map((v) => v.price.amount)
  const priceRange = {
    min: usd(Math.min(...amounts)),
    max: usd(Math.max(...amounts)),
  }

  return {
    id: p.id,
    handle: p.slug || p.id,
    title: p.name,
    description: stripHtml(p.description ?? ''),
    images: imgs,
    variants,
    priceRange,
    tags,
  }
}

// NextFetchRequestConfig type shim (Next.js extended fetch)
interface NextFetchRequestConfig {
  revalidate?: number | false
  tags?: string[]
}
