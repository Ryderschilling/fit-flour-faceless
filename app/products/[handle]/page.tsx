import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { commerce } from '@/lib/commerce'
import { AddToCartButton } from './AddToCartButton'

interface Props {
  params: { handle: string }
}

export async function generateStaticParams() {
  const products = await commerce.getProducts()
  return products.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await commerce.getProduct(params.handle)
  if (!product) return { title: 'Product Not Found' }

  const image = product.images[0]
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} | Fit Flour`,
      description: product.description,
      images: image ? [{ url: image.url, alt: image.alt }] : [],
    },
  }
}

// Local image map — Wix products don't have images uploaded yet
const LOCAL_IMAGES: Record<string, string> = {
  'power-flour': '/images/products/fit-flour-og-shopify.jpg',
  'gluten-free-limited-supply': '/images/products/fit-flour-gf-shopify.jpg',
}

function resolveProductImage(handle: string, wixUrl?: string): string {
  if (wixUrl && wixUrl.startsWith('http')) return wixUrl
  return LOCAL_IMAGES[handle] ?? LOCAL_IMAGES[Object.keys(LOCAL_IMAGES).find(k => handle.includes(k)) ?? ''] ?? '/images/products/fit-flour-og-shopify.jpg'
}

export default async function ProductPage({ params }: Props) {
  const product = await commerce.getProduct(params.handle)
  if (!product) notFound()

  const variant = product.variants[0]
  const image = product.images[0]
  const price = product.priceRange.min.amount
  const imgSrc = resolveProductImage(params.handle, image?.url)

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: imgSrc,
    brand: { '@type': 'Brand', name: 'Fit Flour' },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'USD',
      availability: variant?.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://fitflour.shop/products/${product.handle}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '368',
    },
  }

  return (
    <div className="bg-paper min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-white w-full overflow-hidden">
            <Image
              src={imgSrc}
              alt={image?.alt ?? product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 md:pt-8">
            {product.tags.includes('best-seller') && (
              <span className="text-xs font-bold uppercase tracking-widest text-teal">
                Best Seller
              </span>
            )}

            <h1 className="font-display text-4xl md:text-5xl uppercase text-ink leading-tight tracking-tight">
              {product.title}
            </h1>

            <p className="text-2xl font-bold text-ink">{formatMoney(price)}</p>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#1B3D35" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted">4.9 (368 reviews)</span>
            </div>

            <p className="text-muted text-base leading-relaxed">{product.description}</p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                '1:1 Swap',
                '6x Protein',
                '⅓ the Carbs',
                // Diet pills only apply to the gluten-free (white bag) product
                ...(params.handle === 'gluten-free-limited-supply'
                  ? ['Gluten Free', 'Dairy Free', 'Nut Free']
                  : []),
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold uppercase tracking-wider border border-line px-3 py-1.5 text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <AddToCartButton
                variantId={variant?.id ?? ''}
                available={variant?.available ?? false}
                meta={{
                  productTitle: product.title,
                  variantTitle: variant?.title ?? 'Default',
                  image: imgSrc,
                  unitPrice: variant?.price.amount ?? price,
                }}
              />

            <p className="text-xs text-muted">
              36 servings per bag · Ships from USA · Free over $50
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
