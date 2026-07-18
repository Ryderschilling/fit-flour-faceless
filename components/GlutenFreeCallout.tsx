import Image from 'next/image'
import Link from 'next/link'
import { AnimateIn } from './AnimateIn'

export function GlutenFreeCallout() {
  return (
    <section className="bg-white py-14 md:py-28 px-6" aria-labelledby="gf-heading">
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-16 items-center">

        {/* Copy */}
        <AnimateIn animation="left" className="flex flex-col gap-6 mb-8 md:mb-0">
          <span className="inline-block bg-teal/10 text-teal text-xs font-bold uppercase tracking-widest px-3 py-1.5 self-start">
            New Blend
          </span>
          <h2
            id="gf-heading"
            className="font-display text-4xl md:text-5xl uppercase text-ink leading-tight tracking-tight"
          >
            Now Gluten-Free &amp; Dairy-Free
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-md">
            Every benefit of Fit Flour — 1:1 swap, 6x the protein, ⅓ the carbs — now certified
            gluten-free and dairy-free. Built for celiac, dairy-sensitive, and clean-eating
            households.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted uppercase tracking-widest">
            <span className="border border-line px-3 py-1.5">Gluten Free</span>
            <span className="border border-line px-3 py-1.5">Dairy Free</span>
            <span className="border border-line px-3 py-1.5">Nut Free</span>
          </div>
          <Link
            href="/products/gluten-free-limited-supply"
            className="self-start bg-teal text-paper text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-teal2 transition-colors"
          >
            Shop Gluten-Free Blend
          </Link>
        </AnimateIn>

        {/* Mobile: full-bleed image with top fade */}
        <div
          className="md:hidden -mx-6 relative overflow-hidden"
          style={{ aspectRatio: '4/5' }}
        >
          <Image
            src="/images/products/fit-flour-gf-main.jpg"
            alt="Fit Flour Gluten Free & Dairy Free Blend bag"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, transparent 100%)' }}
          />
        </div>

        {/* Desktop: original framed layout unchanged */}
        <AnimateIn
          animation="scale"
          delay={150}
          className="hidden md:block relative aspect-square w-full max-w-md mx-auto md:mx-0 bg-paper overflow-hidden"
        >
          <Image
            src="/images/products/fit-flour-gf-main.jpg"
            alt="Fit Flour Gluten Free & Dairy Free Blend bag"
            fill
            className="object-contain p-8"
            sizes="50vw"
          />
        </AnimateIn>

      </div>
    </section>
  )
}
