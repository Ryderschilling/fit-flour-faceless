'use client'

import { useCart } from '@/lib/cart-context'
import type { CartLineMeta } from '@/lib/cart-context'

interface Props {
  variantId: string
  available: boolean
  meta: CartLineMeta
}

export function AddToCartButton({ variantId, available, meta }: Props) {
  const { addToCart, loading } = useCart()

  return (
    <button
      onClick={() => addToCart(variantId, 1, meta)}
      disabled={loading || !available}
      className="w-full bg-teal text-paper text-sm font-bold uppercase tracking-widest py-4 hover:bg-teal2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {available ? (loading ? 'Adding…' : 'Add to Cart') : 'Sold Out'}
    </button>
  )
}
