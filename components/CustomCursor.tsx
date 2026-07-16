'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Dot snaps instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const onMouseEnterInteractive = () => {
      ring.classList.add('cursor-ring--hover')
      dot.classList.add('cursor-dot--hover')
    }
    const onMouseLeaveInteractive = () => {
      ring.classList.remove('cursor-ring--hover')
      dot.classList.remove('cursor-dot--hover')
    }

    // Smooth ring follow via rAF
    const animate = () => {
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    // Make cursor visible
    dot.style.opacity = '0'
    ring.style.opacity = '0'

    const onFirstMove = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      window.removeEventListener('mousemove', onFirstMove)
    }

    // Delegate hover to all interactive elements
    const interactiveSelector = 'a, button, [role="button"], input, label, select, textarea, [data-cursor-hover]'
    const addHoverListeners = () => {
      document.querySelectorAll<HTMLElement>(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterInteractive)
        el.addEventListener('mouseleave', onMouseLeaveInteractive)
      })
    }
    addHoverListeners()

    // Re-attach on DOM changes (for dynamically rendered elements)
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousemove', onFirstMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />
      {/* Ring — lags behind with lerp */}
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
      />
    </>
  )
}
