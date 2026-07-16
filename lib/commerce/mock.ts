/**
 * Mock commerce — products only, used in tests / local dev fallback.
 * Cart is now managed client-side in cart-context.tsx.
 */

import type { Commerce } from './index'
import type { Product } from './types'

const OG_IMG = '/images/products/fit-flour-og-shopify.jpg'
const GF_IMG = '/images/products/fit-flour-gf-shopify.jpg'

const USD = (amount: number) => ({ amount, currency: 'USD' })

const PRODUCTS: Product[] = [
  {
    id: 'df19c1f7-07d8-a265-42f8-e8dfa824cc6e',
    handle: 'power-flour',
    title: 'Fit Flour (36 Servings)',
    description:
      'The 1:1 flour substitute with 6x the protein and ⅓ the carbs. Drop it into any recipe cup-for-cup — breads, pancakes, cookies, muffins — with zero adjustments. Gluten-free, dairy-free, nut-free.',
    images: [{ url: OG_IMG, alt: 'Fit Flour — Original Blend bag' }],
    variants: [{ id: 'df19c1f7-07d8-a265-42f8-e8dfa824cc6e', title: 'Default', price: USD(29.99), available: true }],
    priceRange: { min: USD(29.99), max: USD(29.99) },
    tags: ['best-seller'],
  },
  {
    id: 'f664d852-095d-28e0-3622-4921f4260cde',
    handle: 'gluten-free-limited-supply',
    title: 'Gluten Free & Dairy Free Blend (36 Servings)',
    description:
      'Everything you love about Fit Flour — now explicitly certified Gluten-Free and Dairy-Free. Same 1:1 swap, same protein punch, zero allergens.',
    images: [{ url: GF_IMG, alt: 'Fit Flour — Gluten Free & Dairy Free Blend bag' }],
    variants: [{ id: 'f664d852-095d-28e0-3622-4921f4260cde', title: 'Default', price: USD(29.99), available: true }],
    priceRange: { min: USD(29.99), max: USD(29.99) },
    tags: ['best-seller', 'gluten-free'],
  },
]

export const mockCommerce: Commerce = {
  async getProducts() { return PRODUCTS },
  async getProduct(handle) { return PRODUCTS.find((p) => p.handle === handle) ?? null },
}
