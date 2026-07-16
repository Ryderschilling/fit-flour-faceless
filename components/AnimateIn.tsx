'use client'

/**
 * AnimateIn — scroll-triggered reveal wrapper.
 *
 * Adds the `reveal` CSS class and an `is-visible` class when the element
 * scrolls into the viewport. All visual logic lives in globals.css.
 *
 * Usage:
 *   <AnimateIn animation="up" delay={100}>content</AnimateIn>
 *   <AnimateIn animation="left" as="section">content</AnimateIn>
 */

import { useEffect, useRef } from 'react'

type Anim = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

interface Props {
  children: React.ReactNode
  className?: string
  animation?: Anim
  delay?: number         // ms before transition starts
  threshold?: number     // 0–1, how much of element must be visible
  as?: string
  once?: boolean         // default true — animate only on first entry
}

export function AnimateIn({
  children,
  className = '',
  animation = 'up',
  delay = 0,
  threshold = 0.12,
  as: Tag = 'div',
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('is-visible')
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const El = Tag as any
  return (
    <El
      ref={ref}
      className={`reveal ${className}`}
      data-anim={animation}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </El>
  )
}
