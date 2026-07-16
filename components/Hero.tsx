import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <section
      className="relative min-h-[88vh] bg-paper overflow-hidden flex flex-col items-center justify-center pt-6 pb-16 px-6"
      aria-label="Fit Flour hero"
    >
      {/* Radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 8%, #FBF4E6 0%, #F5F1EC 42%, #EFE9DF 100%)',
        }}
        aria-hidden="true"
      />

      {/* Wordmark + bag */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: 'clamp(280px, 42vw, 580px)' }}
      >
        {/* FIT FLOUR — animated entrance */}
        <h1
          className="hero-title-anim absolute inset-0 flex items-center justify-center font-display uppercase text-ink leading-none text-center pointer-events-none select-none"
          style={{
            fontSize: 'clamp(72px, 17vw, 240px)',
            letterSpacing: '-0.02em',
            zIndex: 0,
            transform: 'translateY(-30%)',
          }}
        >
          FIT FLOUR
        </h1>

        {/* Bag — position wrapper keeps translateY(15%), inner div animates + floats */}
        <div
          className="relative"
          style={{ zIndex: 10, width: 'clamp(140px, 20vw, 300px)', transform: 'translateY(15%)' }}
        >
          <div className="hero-bag-anim">
            <Image
              src="/images/products/fit-flour-bag-hero.png"
              alt="Fit Flour product bag"
              width={400}
              height={533}
              className="object-contain w-full h-auto drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* CTA — fades in after title + bag */}
      <div className="hero-cta-anim relative z-10 mt-4 text-center max-w-lg">
        <p className="text-base text-ink/70 leading-relaxed mb-6">
          The 1:1 flour swap that fits your goals — 6x the protein, a third of the carbs, no
          adjustments, no failed bakes.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-teal text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-teal2 transition-colors duration-200"
          >
            Shop Now
          </Link>
          <Link
            href="/our-story"
            className="border border-ink text-ink text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-ink hover:text-paper transition-colors duration-200"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  )
}
