'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
// Cart types now come from cart-context directly

export function CartDrawer() {
  const { cart, cartOpen, closeCart, updateLine, removeLine, checkout, loading, checkoutError } = useCart()

  const formatMoney = (amount: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div className="flex items-center gap-3">
            <Link href="/" onClick={closeCart} aria-label="Fit Flour home">
              <Image
                src="/images/FF-logo-transparent.png"
                alt="Fit Flour"
                width={28}
                height={28}
                className="h-7 w-auto opacity-20"
              />
            </Link>
            <h2 className="font-display text-xl uppercase tracking-tight text-ink">
              Your Bag ({cart?.totalQuantity ?? 0})
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-muted text-sm">Your bag is empty.</p>
              <button
                onClick={closeCart}
                className="text-xs uppercase tracking-widest text-teal border-b border-teal pb-0.5 hover:text-teal2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-paper rounded flex-shrink-0 overflow-hidden">
                    <Image
                      src={line.image}
                      alt={line.productTitle}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink leading-tight">{line.productTitle}</p>
                    {line.variantTitle !== 'Default' && (
                      <p className="text-xs text-muted mt-0.5">{line.variantTitle}</p>
                    )}
                    <p className="text-sm font-medium text-teal mt-1">
                      {formatMoney(line.unitPrice.amount)}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-line rounded-sm">
                        <button
                          onClick={() => updateLine(line.id, line.quantity - 1)}
                          disabled={loading}
                          aria-label="Decrease quantity"
                          className="px-2 py-1 text-ink hover:bg-paper transition-colors disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-medium">{line.quantity}</span>
                        <button
                          onClick={() => updateLine(line.id, line.quantity + 1)}
                          disabled={loading}
                          aria-label="Increase quantity"
                          className="px-2 py-1 text-ink hover:bg-paper transition-colors disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeLine(line.id)}
                        disabled={loading}
                        className="text-xs text-muted hover:text-ink transition-colors underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.lines.length > 0 && (
          <div className="px-6 py-5 border-t border-line">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-ink">Subtotal</span>
              <span className="text-sm font-semibold text-ink">
                {formatMoney(cart.subtotal.amount)}
              </span>
            </div>
            <p className="text-xs text-muted mb-4">Shipping and taxes calculated at checkout.</p>
            {checkoutError && (
              <p className="text-xs text-red-600 mb-3 leading-snug">{checkoutError}</p>
            )}
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-teal text-paper text-sm font-bold uppercase tracking-widest py-4 hover:bg-teal2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Checkout'}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
