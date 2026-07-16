import { commerce } from '@/lib/commerce'
import { ProductCard } from './ProductCard'

export async function FeaturedProducts() {
  const products = await commerce.getProducts()

  return (
    <section className="bg-paper py-20 md:py-28 px-6" aria-labelledby="best-sellers-heading">
      <div className="max-w-content mx-auto">
        <h2
          id="best-sellers-heading"
          className="font-display text-4xl md:text-5xl uppercase text-ink text-center mb-12 tracking-tight"
        >
          Best Sellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
