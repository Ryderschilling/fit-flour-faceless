import Image from 'next/image'
import Link from 'next/link'
import { AnimateIn } from './AnimateIn'

export function ImageWithText() {
  return (
    <section className="bg-teal py-20 md:py-28 px-6" aria-labelledby="iwt-heading">
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Image left — slides in from left */}
        <AnimateIn animation="left" className="relative aspect-[4/5] w-full max-w-md mx-auto md:mx-0 bg-paper/10 overflow-hidden">
          <Image
            src="/images/lifestyle/img-8306-edited.jpg"
            alt="Fit Flour bag with baked goods"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </AnimateIn>

        {/* Copy right — slides in from right */}
        <AnimateIn animation="right" delay={100} className="text-paper flex flex-col gap-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-paper/60">
            The Mission
          </p>
          <h2
            id="iwt-heading"
            className="font-display text-4xl md:text-5xl uppercase leading-tight tracking-tight"
          >
            Make Any Recipe a Protein Recipe
          </h2>
          <p className="text-paper/80 text-base leading-relaxed max-w-md">
            You shouldn't have to choose between the food you love and the goals you're chasing. Fit
            Flour is the 1:1 swap that keeps your recipes exactly how you like them — just with 6x
            more protein and a third of the carbs.
          </p>
          <Link
            href="/shop"
            className="self-start border border-paper text-paper text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-paper hover:text-teal transition-colors"
          >
            Shop the Blends
          </Link>
        </AnimateIn>

      </div>
    </section>
  )
}
