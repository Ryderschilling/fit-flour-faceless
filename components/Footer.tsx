import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-teal text-paper">

      {/* ── Top CTA strip ─────────────────────────────────────────────────── */}
      <div className="border-b border-paper/10">
        <div className="max-w-content mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/50 mb-2">
              Ready to upgrade your baking?
            </p>
            <h2 className="font-display text-4xl md:text-5xl uppercase text-paper tracking-tight leading-tight">
              The 1:1 Swap That<br className="hidden md:block" /> Changes Everything.
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex-shrink-0 bg-paper text-teal text-xs font-black uppercase tracking-widest px-10 py-4 hover:bg-paper/90 transition-colors"
          >
            Shop Now — $29.99
          </Link>
        </div>
      </div>

      {/* ── Main footer body ──────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Col 1: Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <Link href="/" aria-label="Fit Flour home">
              <Image
                src="/images/FF-logo-transparent.png"
                alt="Fit Flour"
                width={52}
                height={52}
                className="h-13 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-paper/60 text-sm leading-relaxed max-w-[200px] text-center md:text-left">
              High-protein flour for people who refuse to give up the food they love.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/fitflour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fit Flour on Instagram"
                className="text-paper/50 hover:text-paper transition-colors"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation — centered */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/40 mb-3">
              Navigate
            </p>
            {[
              { href: '/', label: 'Home' },
              { href: '/shop', label: 'Shop' },
              { href: '/our-story', label: 'Our Story' },
              { href: '/recipes', label: 'Recipes' },
              { href: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-paper/70 hover:text-paper transition-colors py-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Product + social */}
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/40 mb-3">
              Products
            </p>
            <Link href="/products/power-flour" className="text-sm text-paper/70 hover:text-paper transition-colors py-0.5">
              Fit Flour Original
            </Link>
            <Link href="/products/gluten-free-limited-supply" className="text-sm text-paper/70 hover:text-paper transition-colors py-0.5">
              Gluten Free Blend
            </Link>

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-paper/40 mb-3">
                Follow Along
              </p>
              <a
                href="https://www.instagram.com/fitflour"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-paper/70 hover:text-paper transition-colors"
              >
                <InstagramIcon />
                @fitflour
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-paper/10">
        <div className="max-w-content mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} Fit Flour. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-paper/30 uppercase tracking-widest">
              6x Protein · ⅓ Carbs · 1:1 Swap
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
