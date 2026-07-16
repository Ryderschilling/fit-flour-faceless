'use client'

/**
 * CartProvider — fully browser-local cart.
 *
 * Cart state lives in React state + sessionStorage.
 * NO server calls for add/update/remove — instant, works in any environment.
 * Checkout is the only operation that hits the server (/api/wix/checkout).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CartLineMeta {
  productTitle: string
  variantTitle?: string
  image: string
  unitPrice: number // in dollars
}

export interface CartLine {
  id: string
  variantId: string
  productTitle: string
  variantTitle: string
  image: string
  unitPrice: { amount: number; currency: string }
  quantity: number
}

export interface Cart {
  lines: CartLine[]
  subtotal: { amount: number; currency: string }
  totalQuantity: number
}

interface CartContextValue {
  cart: Cart
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  /** Pass product metadata so the cart drawer can display it correctly */
  addToCart: (variantId: string, qty?: number, meta?: CartLineMeta) => void
  updateLine: (lineId: string, qty: number) => void
  removeLine: (lineId: string) => void
  checkout: () => Promise<void>
  loading: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ff_cart_v2'

const EMPTY_CART: Cart = {
  lines: [],
  subtotal: { amount: 0, currency: 'USD' },
  totalQuantity: 0,
}

function calcCart(lines: CartLine[]): Cart {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice.amount * l.quantity, 0)
  return {
    lines,
    subtotal: { amount: Math.round(subtotal * 100) / 100, currency: 'USD' },
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
  }
}

function lineId() {
  return `line-${Math.random().toString(36).slice(2, 10)}`
}

function saveCart(cart: Cart) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart)) } catch {}
}

function loadCart(): Cart {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Cart
  } catch {}
  return EMPTY_CART
}

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART)
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Restore from sessionStorage on mount
  useEffect(() => { setCart(loadCart()) }, [])

  // Persist whenever cart changes
  useEffect(() => { saveCart(cart) }, [cart])

  // ── Cart mutations (pure local) ─────────────────────────────────────────

  const addToCart = useCallback((variantId: string, qty = 1, meta?: CartLineMeta) => {
    setCart((prev) => {
      const existing = prev.lines.find((l) => l.variantId === variantId)
      let lines: CartLine[]

      if (existing) {
        lines = prev.lines.map((l) =>
          l.variantId === variantId ? { ...l, quantity: l.quantity + qty } : l
        )
      } else {
        lines = [
          ...prev.lines,
          {
            id: lineId(),
            variantId,
            productTitle: meta?.productTitle ?? 'Fit Flour',
            variantTitle: meta?.variantTitle ?? 'Default',
            image: meta?.image ?? '/images/product-placeholder.png',
            unitPrice: { amount: meta?.unitPrice ?? 29.99, currency: 'USD' },
            quantity: qty,
          },
        ]
      }

      return calcCart(lines)
    })
    setCartOpen(true)
  }, [])

  const updateLine = useCallback((lineId: string, qty: number) => {
    setCart((prev) => {
      const lines =
        qty <= 0
          ? prev.lines.filter((l) => l.id !== lineId)
          : prev.lines.map((l) => (l.id === lineId ? { ...l, quantity: qty } : l))
      return calcCart(lines)
    })
  }, [])

  const removeLine = useCallback((lineId: string) => {
    setCart((prev) => calcCart(prev.lines.filter((l) => l.id !== lineId)))
  }, [])

  // ── Checkout (only operation that hits the server) ───────────────────────

  const checkout = useCallback(async () => {
    if (cart.lines.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/wix/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: cart.lines.map((l) => ({
            variantId: l.variantId,
            quantity: l.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.url && data.url !== '#') {
        window.location.href = data.url
      } else {
        console.error('[checkout] no URL returned', data)
      }
    } catch (err) {
      console.error('[checkout] failed', err)
    } finally {
      setLoading(false)
    }
  }, [cart.lines])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
        toggleCart: () => setCartOpen((v) => !v),
        addToCart,
        updateLine,
        removeLine,
        checkout,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
