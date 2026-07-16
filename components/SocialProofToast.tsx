'use client'

/**
 * SocialProofToast — purchase notification badge.
 *
 * Slides in from the bottom-left every 45–90 seconds showing:
 *   "Alex from Denver, CO just bought Fit Flour Original  ·  3 min ago"
 *
 * First popup fires 8–15 seconds after page load (feels organic, not instant).
 * Auto-dismisses after 5 seconds. Fully accessible (aria-live region).
 */

import { useEffect, useRef, useState } from 'react'

// ─── Data pools ───────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Alex', 'Sarah', 'Mike', 'Emma', 'Jordan', 'Taylor', 'Chris', 'Ashley',
  'Ryan', 'Morgan', 'Casey', 'Jamie', 'Sam', 'Riley', 'Drew', 'Avery',
  'Brooke', 'Cole', 'Dana', 'Evan', 'Fiona', 'Grant', 'Haley', 'Ian',
  'Jess', 'Kyle', 'Lauren', 'Marcus', 'Nina', 'Owen',
]

const LOCATIONS = [
  'Austin, TX', 'Denver, CO', 'Nashville, TN', 'Atlanta, GA', 'Charlotte, NC',
  'Phoenix, AZ', 'Portland, OR', 'Seattle, WA', 'Chicago, IL', 'Miami, FL',
  'Dallas, TX', 'Boston, MA', 'Los Angeles, CA', 'New York, NY', 'Houston, TX',
  'San Diego, CA', 'Minneapolis, MN', 'Tampa, FL', 'Columbus, OH', 'Raleigh, NC',
]

const PRODUCTS = [
  { label: 'Fit Flour Original', weight: 3 },
  { label: 'Gluten Free Blend', weight: 2 },
  { label: 'Fit Flour Original (2-pack)', weight: 1 },
]

const TIME_LABELS = [
  'just now', '1 min ago', '2 min ago', '3 min ago',
  '5 min ago', '7 min ago', '8 min ago', '11 min ago',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Weighted random pick — more weight = more likely to appear */
function pickWeighted(items: { label: string; weight: number }[]): string {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item.label
  }
  return items[items.length - 1].label
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ToastData {
  name: string
  location: string
  product: string
  timeLabel: string
}

function makeToast(): ToastData {
  return {
    name: pick(FIRST_NAMES),
    location: pick(LOCATIONS),
    product: pickWeighted(PRODUCTS),
    timeLabel: pick(TIME_LABELS),
  }
}

export function SocialProofToast() {
  const [toast, setToast] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = () => {
    // Cancel any pending hide
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

    setToast(makeToast())
    setVisible(true)

    // Auto-hide after 5 s
    hideTimerRef.current = setTimeout(() => setVisible(false), 5000)
  }

  useEffect(() => {
    // Stagger first appearance so it doesn't feel automated
    const firstDelay = randomBetween(8_000, 15_000)

    const scheduleNext = () => {
      const interval = randomBetween(45_000, 90_000)
      cycleTimerRef.current = setTimeout(() => {
        showToast()
        scheduleNext()
      }, interval)
    }

    const initialTimer = setTimeout(() => {
      showToast()
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
    /* aria-live so screen readers announce new purchases */
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-6 z-50 pointer-events-none"
    >
      <div
        className={[
          'flex items-center gap-3 bg-white border border-line shadow-lg px-4 py-3 max-w-[300px] pointer-events-auto',
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
            {' '}from {toast.location} just bought{' '}
            <span className="font-semibold">{toast.product}</span>
            <span className="block text-muted mt-0.5">{toast.timeLabel}</span>
          </p>
        )}
      </div>
    </div>
  )
}
