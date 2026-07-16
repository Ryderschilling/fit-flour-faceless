/**
 * Commerce interface — products only.
 * Cart is managed client-side in cart-context.tsx.
 * Checkout is handled server-side in /api/wix/checkout.
 */

import type { Product } from './types'
export type { Money, Product, ProductVariant } from './types'

export interface Commerce {
  getProducts(): Promise<Product[]>
  getProduct(handle: string): Promise<Product | null>
}

import { wixCommerce } from './wix'
export const commerce: Commerce = wixCommerce
