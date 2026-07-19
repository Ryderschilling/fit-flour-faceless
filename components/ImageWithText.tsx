import Image from 'next/image'
import Link from 'next/link'
import { AnimateIn } from './AnimateIn'

export function ImageWithText() {
  return (
    <section className="relative bg-white py-20 md:py-28 overflow-hidden" aria-labelledby="iwt-heading">

      {/* Photo — left 45% on desktop */}
      <div className="absolute left-0 top-0 bottom-0 w-[45%] hidden md:block">
        <Image
          src="/images/products/fit-flour-og-main.jpg"
          alt="Fit Flour bag with baked goods"
          fill
          className="object-cover object-center"
          sizes="45vw"
        />
        {/* Fade right edge into white */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, transparent 45%, #FFFFFF 100%)' }}
        />
      </div>

      {/* Mobile: photo sits at top, fades downward */}
      <div className="absolute left-0 right-0 top-0 h-[45%] md:hidden">
        <Image
          src="/images/products/fit-flour-og-main.jpg"
          alt="Fit Flour bag with baked goods"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, #FFFFFF 100%)' }}
        />
      </div>

      {/* Grid */}
      <div className="relative max-w-content mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Left spacer */}
        <div className="h-48 md:h-auto" />

        {/* Copy right */}
        <AnimateIn animation="right" delay={100} className="text-teal flex flex-col gap-6 items-center text-center md:items-start md:text-left">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-teal/60">
            The Mission
          </p>
          <h2
            id="iwt-heading"
            className="font-display text-4xl md:text-5xl uppercase leading-tight tracking-tight text-teal"
          >
            Make Any Recipe a Protein Recipe
          </h2>
          <p className="text-teal/80 text-base leading-relaxed max-w-md">
            You shouldn't have to choose between the food you love and the goals you're chasing. Fit
            Flour is the 1:1 swap that keeps your recipes exactly how you like them — just with 6x
            more protein and a third of the carbs.
          </p>
          <Link
            href="/shop"
            className="self-center md:self-start border border-teal text-teal text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-teal hover:text-white transition-colors"
          >
            Shop the Blends
          </Link>
        </AnimateIn>

      </div>
    </section>
  )
}
