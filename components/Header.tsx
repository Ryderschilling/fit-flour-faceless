'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const { cart, toggleCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [cartPulse, setCartPulse] = useState(false)
  const pathname = usePathname()
  const qty = cart?.totalQuantity ?? 0
  const prevQty = useRef(qty)

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(docH > 0 ? Math.min((y / docH) * 100, 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Cart pulse on add ─────────────────────────────────────────────────────
  useEffect(() => {
    if (qty > prevQty.current) {
      setCartPulse(true)
      const t = setTimeout(() => setCartPulse(false), 650)
      return () => clearTimeout(t)
    }
    prevQty.current = qty
  }, [qty])

  // ── Body scroll lock when mobile menu open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      {/* ── Scroll progress bar — pinned to viewport top ──────────────── */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-teal pointer-events-none"
        style={{
          width: `${scrollPct}%`,
          transition: 'width 80ms linear',
          boxShadow: scrollPct > 0 ? '0 0 6px 0 rgba(27,61,53,0.4)' : 'none',
        }}
      />

      {/* ── Outer header: sticky, transparent, collapses to floating pill ── */}
      <header
        className={[
          'sticky top-0 z-50',
          'transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled ? 'pt-3 pb-2' : 'pt-0 pb-0',
        ].join(' ')}
      >
        {/* ── Pill / bar wrapper ─────────────────────────────────────── */}
        <div
          className={[
            'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            scrolled
              ? [
                  'mx-5 rounded-[18px]',
                  'bg-paper/88 backdrop-blur-xl',
                  'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.07)]',
                  'border border-white/30',
                ].join(' ')
              : 'bg-transparent',
          ].join(' ')}
        >
          {/* ── Desktop ─────────────────────────────────────────────── */}
          <div className="hidden md:grid grid-cols-3 items-center px-6 h-[64px] max-w-content mx-auto">

            {/* Left: logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group" aria-label="Fit Flour home">
                <Image
                  src="/images/FF-logo-transparent.png"
                  alt="Fit Flour"
                  width={42}
                  height={42}
                  className="h-[42px] w-auto transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                  priority
                />
              </Link>
            </div>

            {/* Center: nav links */}
            <nav aria-label="Main navigation">
              <ul className="flex items-center justify-center gap-6">
                {NAV_LINKS.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href))
                  return (
                    <li key={link.href} className="relative group">
                      <Link
                        href={link.href}
                        className={[
                          'relative text-[12px] font-bold uppercase tracking-[0.12em] whitespace-nowrap',
                          'transition-colors duration-200 pb-0.5 block',
                          active ? 'text-teal' : 'text-ink hover:text-teal',
                        ].join(' ')}
                      >
                        {link.label}

                        {/* Animated underline */}
                        <span
                          className={[
                            'absolute -bottom-0.5 left-0 h-[1.5px] bg-teal',
                            'transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                            active ? 'w-full' : 'w-0 group-hover:w-full',
                          ].join(' ')}
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Right: cart */}
            <div className="flex items-center justify-end">
              <button
                aria-label={`Cart — ${qty} item${qty !== 1 ? 's' : ''}`}
                onClick={toggleCart}
                className={[
                  'relative flex items-center justify-center w-10 h-10 rounded-full',
                  'transition-all duration-200 hover:bg-ink/6',
                  cartPulse ? 'scale-[1.28]' : 'scale-100',
                ].join(' ')}
                style={{ transition: cartPulse ? 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)' : 'transform 0.3s ease, background 0.2s ease' }}
              >
                <CartIcon />
                {qty > 0 && (
                  <span
                    className={[
                      'absolute top-0.5 right-0.5 bg-teal text-paper text-[9px] font-black',
                      'rounded-full min-w-[16px] h-4 flex items-center justify-center px-[3px]',
                      'leading-none tabular-nums',
                      'transition-transform duration-300',
                      cartPulse ? 'scale-125' : 'scale-100',
                    ].join(' ')}
                  >
                    {qty > 9 ? '9+' : qty}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Mobile bar ────────────────────────────────────────────── */}
          <div className="flex md:hidden items-center justify-between px-4 h-[58px]">
            {/* Hamburger */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center w-10 h-10 -ml-2"
            >
              <AnimatedHamburger open={mobileOpen} />
            </button>

            {/* Logo — center */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Fit Flour home">
              <Image
                src="/images/FF-logo-transparent.png"
                alt="Fit Flour"
                width={36}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>

            {/* Cart */}
            <button
              aria-label={`Cart — ${qty} items`}
              onClick={toggleCart}
              className={[
                'relative flex items-center justify-center w-10 h-10 -mr-2',
                'transition-transform duration-150',
                cartPulse ? 'scale-[1.3]' : 'scale-100',
              ].join(' ')}
            >
              <CartIcon />
              {qty > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-teal text-paper text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-[3px] leading-none">
                  {qty > 9 ? '9+' : qty}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile menu overlay ──────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!mobileOpen}
        className={[
          'fixed inset-0 z-[55] md:hidden flex flex-col bg-ink',
          'transition-all duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        {/* Top bar inside overlay — mirrors mobile header */}
        <div className="flex items-center justify-between px-4 h-[58px] flex-shrink-0 relative">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-10 h-10 -ml-2 text-paper"
          >
            <AnimatedHamburger open={true} inverted />
          </button>
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="absolute left-1/2 -translate-x-1/2"
            aria-label="Home"
          >
            <Image
              src="/images/FF-logo-transparent.png"
              alt="Fit Flour"
              width={36}
              height={36}
              className="h-9 w-auto brightness-0 invert opacity-90"
            />
          </Link>
          <div className="w-10" />
        </div>

        {/* Divider */}
        <div className="h-px bg-paper/10 mx-6 flex-shrink-0" />

        {/* Nav links */}
        <nav className="flex-1 flex flex-col justify-center px-8" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  'font-display text-[52px] uppercase tracking-tight leading-none py-3',
                  'transition-all duration-300',
                  active ? 'text-paper' : 'text-paper/35 hover:text-paper/80',
                ].join(' ')}
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(16px)',
                  transition: `
                    color 0.2s ease,
                    opacity 0.5s ease ${80 + i * 55}ms,
                    transform 0.6s cubic-bezier(0.16,1,0.3,1) ${80 + i * 55}ms
                  `,
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom strip */}
        <div
          className="px-8 pb-10 pt-5 border-t border-paper/10 flex-shrink-0"
          style={{
            opacity: mobileOpen ? 1 : 0,
            transition: `opacity 0.4s ease ${80 + NAV_LINKS.length * 55 + 60}ms`,
          }}
        >
          <p className="text-paper/25 text-[11px] uppercase tracking-[0.15em] font-semibold">
            6x the protein · ⅓ the carbs · 1:1 swap
          </p>
        </div>
      </div>
    </>
  )
}

// ── Animated hamburger → X ────────────────────────────────────────────────────

function AnimatedHamburger({ open, inverted }: { open: boolean; inverted?: boolean }) {
  const color = inverted ? 'currentColor' : 'currentColor'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"
        style={{
          transformOrigin: '12px 6px',
          transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
          transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        }}
      />
      <line x1="3" y1="12" x2="21" y2="12"
        style={{
          transition: 'opacity 0.2s ease',
          opacity: open ? 0 : 1,
        }}
      />
      <line x1="3" y1="18" x2="21" y2="18"
        style={{
          transformOrigin: '12px 18px',
          transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
          transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        }}
      />
    </svg>
  )
}

// ── Cart icon ─────────────────────────────────────────────────────────────────

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
