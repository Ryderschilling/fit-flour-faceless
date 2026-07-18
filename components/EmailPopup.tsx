'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type PopupState = 'hidden' | 'visible' | 'success'

const COOKIE_KEY = 'ff_popup_dismissed'
const DELAY_MS = 20000 // 20 seconds

function getCookie(name: string): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${name}=`))
}

function setCookie(name: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=1; expires=${expires}; path=/; SameSite=Lax`
}

export function EmailPopup() {
  const [state, setState] = useState<PopupState>('hidden')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (getCookie(COOKIE_KEY)) return
    const timer = setTimeout(() => setState('visible'), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setState('hidden')
    setCookie(COOKIE_KEY, 30)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setCode(data.code ?? 'WELCOME10')
    } catch {
      setCode('WELCOME10')
    } finally {
      setLoading(false)
      setState('success')
      setCookie(COOKIE_KEY, 365)
    }
  }

  const copyCode = () => {
    if (!code) return
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (state === 'hidden') return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[820px] flex overflow-hidden shadow-2xl">
        {/* Left — waffle image */}
        <div className="hidden md:block relative w-[45%] flex-shrink-0 min-h-[520px]">
          <Image
            src="/images/lifestyle/img-9178.jpg"
            alt="Fit Flour waffle dipped in syrup"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 0px, 370px"
            priority
          />
        </div>

        {/* Right — content panel */}
        <div className="w-full md:w-[55%] bg-[#F5F1EC] flex flex-col items-center justify-center px-10 py-14 relative">
          {/* X close */}
          <button
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-4 right-4 p-1 text-[#6B6B6B] hover:text-[#141414] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {state === 'visible' ? (
            <>
              {/* Brand */}
              <p className="font-display text-xs tracking-[0.35em] text-[#6B6B6B] uppercase mb-5">
                Fit Flour
              </p>

              {/* Headline */}
              <h2 className="font-display text-[2.6rem] leading-[1.05] text-[#141414] text-center mb-3 uppercase">
                Save 10%<br />On Your First<br />Order
              </h2>

              {/* Sub */}
              <p className="text-[#6B6B6B] text-sm text-center leading-relaxed mb-8 max-w-[260px]">
                Join thousands baking smarter. Get your exclusive code instantly.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3.5 bg-white border border-[#E4DED4] text-[#141414] placeholder:text-[#9B9490] text-sm focus:outline-none focus:border-[#1B3D35] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1B3D35] text-white font-display text-sm tracking-[0.2em] uppercase py-4 hover:bg-[#2D5A4A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'One sec…' : 'Get My 10% Off'}
                </button>
              </form>

              {/* No thanks */}
              <button
                onClick={dismiss}
                className="mt-5 text-xs text-[#9B9490] underline underline-offset-2 hover:text-[#141414] transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </>
          ) : (
            /* ── Success state ── */
            <>
              {/* Check icon */}
              <div className="w-11 h-11 rounded-full bg-[#1B3D35] flex items-center justify-center mb-6">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M4.5 11l5 5L17.5 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p className="font-display text-xs tracking-[0.35em] text-[#6B6B6B] uppercase mb-3">
                You're In
              </p>

              <h2 className="font-display text-[2.4rem] leading-[1.05] text-[#141414] text-center mb-3 uppercase">
                Here's Your<br />Code
              </h2>

              <p className="text-[#6B6B6B] text-sm text-center mb-7 max-w-[240px]">
                Apply at checkout for 10% off your first order — no minimum.
              </p>

              {/* Code box */}
              <button
                onClick={copyCode}
                className="w-full border-2 border-dashed border-[#1B3D35] px-6 py-5 text-center group hover:bg-[#1B3D35]/5 transition-colors"
                aria-label="Copy discount code"
              >
                <p className="font-display text-[2rem] tracking-[0.3em] text-[#1B3D35] uppercase">
                  {code}
                </p>
                <p className="text-xs text-[#9B9490] mt-1.5 group-hover:text-[#1B3D35] transition-colors">
                  {copied ? '✓ Copied!' : 'tap to copy'}
                </p>
              </button>

              {/* Shop now */}
              <button
                onClick={dismiss}
                className="mt-5 w-full bg-[#1B3D35] text-white font-display text-sm tracking-[0.2em] uppercase py-4 hover:bg-[#2D5A4A] transition-colors"
              >
                Shop Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
