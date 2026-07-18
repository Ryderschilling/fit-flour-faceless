'use client'

/**
 * SocialProofToast — purchase notification badge.
 *
 * On mount, fetches real recent orders from /api/recent-orders and
 * cycles through them. Falls back to a static pool if the API is
 * unavailable or returns nothing.
 *
 * Shows the first toast 8–15 s after page load, then every 45–90 s.
 * Auto-dismisses after 5 s.
 *
 * Hidden on mobile (md:block) — too intrusive on small screens.
 */

import { useEffect, useRef, useState } from 'react'
import type { RecentOrder } from '@/app/api/recent-orders/route'

// ─── Static fallback pool (used if API returns nothing) ───────────────────────

const STATIC_POOL: RecentOrder[] = [
  { firstName: 'Sarah',   city: 'Austin',      state: 'TX', product: 'Fit Flour Original', minutesAgo: 4  },
  { firstName: 'Mike',    city: 'Denver',       state: 'CO', product: 'Fit Flour Original', minutesAgo: 9  },
  { firstName: 'Jordan',  city: 'Nashville',    state: 'TN', product: 'Gluten Free Blend',  minutesAgo: 12 },
  { firstName: 'Ashley',  city: 'Atlanta',      state: 'GA', product: 'Fit Flour Original', minutesAgo: 21 },
  { firstName: 'Taylor',  city: 'Phoenix',      state: 'AZ', product: 'Fit Flour Original', minutesAgo: 33 },
  { firstName: 'Morgan',  city: 'Seattle',      state: 'WA', product: 'Gluten Free Blend',  minutesAgo: 47 },
  { firstName: 'Casey',   city: 'Chicago',      state: 'IL', product: 'Fit Flour Original', minutesAgo: 3  },
  { firstName: 'Riley',   city: 'Charlotte',    state: 'NC', product: 'Fit Flour Original', minutesAgo: 18 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function minutesToLabel(minutes: number): string {
  if (minutes < 2)  return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const h = Math.round(minutes / 60)
  return h === 1 ? '1 hour ago' : `${h} hours ago`
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ToastData {
  name: string
  city: string
  state: string
  product: string
  timeLabel: string
}

export function SocialProofToast() {
  const [toast, setToast] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)
  const poolRef  = useRef<RecentOrder[]>([])
  const indexRef = useRef(0)
  const hideTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch real order pool on mount
  useEffect(() => {
    fetch('/api/recent-orders')
      .then((r) => r.ok ? r.json() : { orders: [] })
      .then(({ orders }: { orders: RecentOrder[] }) => {
        poolRef.current = shuffle(orders.length > 0 ? orders : STATIC_POOL)
      })
      .catch(() => {
        poolRef.current = shuffle(STATIC_POOL)
      })
  }, [])

  const showNext = () => {
    const pool = poolRef.current.length > 0 ? poolRef.current : shuffle(STATIC_POOL)
    const order = pool[indexRef.current % pool.length]
    indexRef.current++

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

    setToast({
      name: order.firstName,
      city: order.city,
      state: order.state,
      product: order.product,
      timeLabel: minutesToLabel(order.minutesAgo),
    })
    setVisible(true)

    hideTimerRef.current = setTimeout(() => setVisible(false), 5_000)
  }

  useEffect(() => {
    const firstDelay = randomBetween(8_000, 15_000)

    const scheduleNext = () => {
      const interval = randomBetween(45_000, 90_000)
      cycleTimerRef.current = setTimeout(() => {
        showNext()
        scheduleNext()
      }, interval)
    }

    const initialTimer = setTimeout(() => {
      showNext()
      scheduleNext()
    }, firstDelay)

    return () => {
      clearTimeout(initialTimer)
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block"
    >
      <div
        className={[
          'flex items-center gap-3 bg-white border border-line shadow-lg px-4 py-3 max-w-[calc(100vw-3rem)] sm:max-w-[300px] pointer-events-auto',
          'transition-all duration-500 ease-out',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        ].join(' ')}
      >
        {/* Pulse dot */}
        <span className="relative flex-shrink-0 w-2.5 h-2.5" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-teal opacity-75 animate-ping" />
          <span className="relative block w-2.5 h-2.5 rounded-full bg-teal" />
        </span>

        {toast && (
          <p className="text-xs text-ink leading-snug">
            <span className="font-semibold">{toast.name}</span>
            {' '}from {toast.city}, {toast.state} just bought{' '}
            <span className="font-semibold">{toast.product}</span>
            <span className="block text-muted mt-0.5">{toast.timeLabel}</span>
          </p>
        )}
      </div>
    </div>
  )
}
