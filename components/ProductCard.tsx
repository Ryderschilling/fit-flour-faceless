'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/commerce'

const LOCAL_IMAGES: Record<string, string> = {
  'power-flour': '/images/products/fit-flour-og-shopify.jpg',
  'gluten-free-limited-supply': '/images/products/fit-flour-gf-shopify.jpg',
}

function getProductImage(product: Product): string {
  const url = product.images[0]?.url
  if (url && url.startsWith('http')) return url
  if (LOCAL_IMAGES[product.handle]) return LOCAL_IMAGES[product.handle]
  const match = Object.entries(LOCAL_IMAGES).find(([k]) => product.handle.includes(k))
  if (match) return match[1]
  return '/images/products/fit-flour-og-shopify.jpg'
}

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { addToCart, loading } = useCart()
  const variant = product.variants[0]
  const imgSrc = getProductImage(product)
  const imgAlt = product.images[0]?.alt ?? product.title
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.unobserve(el) } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  return (
    <article ref={ref} className="reveal bg-white group flex flex-col" data-anim="up">
      {/* Image */}
      <Link href={`/products/${product.handle}`} className="relative block aspect-[3/4] overflow-hidden bg-paper">
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {product.tags.includes('best-seller') && (
          <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-teal text-paper text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 md:px-2 md:py-1">
            Best Seller
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 md:p-5 flex flex-col gap-2 md:gap-3 flex-1">
        <div className="flex items-start justify-between gap-1">
          <Link href={`/products/${product.handle}`}>
            <h3 className="text-xs md:text-sm font-semibold text-ink leading-snug hover:text-teal transition-colors">
              {product.title}
            </h3>
          </Link>
          <span className="text-xs md:text-sm font-bold text-teal flex-shrink-0">
            {formatMoney(product.priceRange.min.amount)}
          </span>
        </div>

        <button
          onClick={() =>
            variant &&
            addToCart(variant.id, 1, {
              productTitle: product.title,
              variantTitle: variant.title,
              image: imgSrc,
              unitPrice: variant.price.amount,
            })
          }
          disabled={loading || !variant?.available}
          className="mt-auto w-full bg-ink text-paper text-[10px] md:text-xs font-bold uppercase tracking-widest py-2.5 md:py-3 hover:bg-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {variant?.available ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </article>
  )
}
