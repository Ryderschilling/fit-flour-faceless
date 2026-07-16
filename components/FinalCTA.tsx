import Link from 'next/link'
import { AnimateIn } from './AnimateIn'

export function FinalCTA() {
  return (
    <section className="bg-teal py-20 md:py-28 px-6" aria-labelledby="final-cta-heading">
      <AnimateIn animation="scale" className="max-w-content mx-auto text-center">
        <h2
          id="final-cta-heading"
          className="font-display text-4xl md:text-6xl uppercase text-paper tracking-tight mb-6"
        >
          Ready to Bake Smarter?
        </h2>
        <p className="text-paper/70 text-base mb-10 max-w-md mx-auto">
          Join thousands of home bakers who upgraded their flour without changing their recipes.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-paper text-ink text-sm font-bold uppercase tracking-widest px-10 py-4 hover:bg-white transition-colors"
        >
          Shop Now
        </Link>
      </AnimateIn>
    </section>
  )
}
