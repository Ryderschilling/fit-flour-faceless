import { AnimateIn } from './AnimateIn'

export function SocialProofBar() {
  return (
    <AnimateIn animation="fade" as="div" className="bg-white border-y border-line py-5 px-4">
      <div className="max-w-content mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
        <div className="flex items-center gap-1" aria-label="4.9 out of 5 stars">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} full={i <= 4} half={i === 5} />
          ))}
        </div>
        <span className="text-sm font-semibold text-ink">4.9 / 5</span>
        <span className="hidden sm:block text-line">|</span>
        <span className="text-sm text-muted">
          <strong className="text-ink">368 reviews</strong> · Loved by home bakers everywhere
        </span>
      </div>
    </AnimateIn>
  )
}

function StarIcon({ full, half }: { full: boolean; half?: boolean }) {
  if (full) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B3D35" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  if (half) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#1B3D35" />
            <stop offset="50%" stopColor="#E4DED4" />
          </linearGradient>
        </defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#E4DED4" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
