import type { Metadata } from 'next'
import { commerce } from '@/lib/commerce'
import { ProductCard } from '@/components/ProductCard'

export const metadata: Metadata = {
  title: 'Shop All Blends',
  description:
    'Shop Fit Flour — the 1:1 high-protein, low-carb flour substitute. Original Blend and Gluten-Free & Dairy-Free Blend, both at 36 servings.',
  openGraph: {
    title: 'Shop All Blends | Fit Flour',
    description: 'The 1:1 flour swap with 6x the protein and ⅓ the carbs. Shop now.',
  },
}

export default async function ShopPage() {
  const products = await commerce.getProducts()

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        <header className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-3">
            All Products
          </p>
          <h1 className="font-display text-5xl md:text-6xl uppercase text-ink tracking-tight">
            Shop the Blends
          </h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
