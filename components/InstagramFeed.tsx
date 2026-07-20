'use client'

/**
 * InstagramFeed — "As Seen on Reels" wall.
 * Plays the real Fit Flour reels (self-hosted in /public/videos/reels).
 * Desktop: hover to play, click opens Instagram. Mobile: tap to play/pause.
 */

import { AnimateIn } from './AnimateIn'

const INSTAGRAM_HANDLE = 'fit.flour'
const INSTAGRAM_URL = 'https://www.instagram.com/fit.flour/'

const REELS = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: n,
  src: `/videos/reels/reel-${n}.mp4`,
  poster: `/videos/reels/reel-${n}.jpg`,
}))

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function ReelBadge() {
  return (
    <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5 pointer-events-none">
      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 1L4.5 9.5l7.5 4 7.5-4L12 5z" />
      </svg>
      <span className="text-white text-[9px] font-bold tracking-wide">REEL</span>
    </div>
  )
}

function PlayOverlay() {
  return (
    <div
      data-overlay
      className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 pointer-events-none"
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
        <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </div>
  )
}

// Toggle the sibling play overlay when the video plays/pauses.
function hideOverlay(video: HTMLVideoElement) {
  const o = video.parentElement?.querySelector('[data-overlay]') as HTMLElement | null
  if (o) o.style.opacity = '0'
}
function showOverlay(video: HTMLVideoElement) {
  const o = video.parentElement?.querySelector('[data-overlay]') as HTMLElement | null
  if (o) o.style.opacity = '1'
}

export function InstagramFeed() {
  return (
    <section className="bg-paper py-12 md:py-28 px-6 overflow-hidden" aria-labelledby="ig-heading">
      <div className="max-w-content mx-auto">

        {/* Header */}
        <AnimateIn animation="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-teal/60 mb-2">
              @{INSTAGRAM_HANDLE}
            </p>
            <h2
              id="ig-heading"
              className="font-display text-3xl md:text-5xl uppercase text-ink tracking-tight"
            >
              As Seen on Reels
            </h2>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal border border-teal px-6 py-3 hover:bg-teal hover:text-white transition-colors self-start sm:self-auto flex-shrink-0"
          >
            <InstagramIcon />
            Follow for More
          </a>
        </AnimateIn>

        {/* Mobile: snap-scroll reel carousel — tap to play */}
        <div className="md:hidden -mx-6 overflow-x-auto carousel-scroll">
          <div className="flex gap-2.5 px-6 pb-4 snap-x snap-mandatory">
            {REELS.map((reel) => (
              <button
                key={reel.id}
                type="button"
                onClick={(e) => {
                  const v = e.currentTarget.querySelector('video') as HTMLVideoElement | null
                  if (!v) return
                  if (v.paused) v.play().catch(() => {})
                  else v.pause()
                }}
                className="flex-shrink-0 w-[148px] snap-start block relative overflow-hidden rounded-xl bg-teal"
                style={{ aspectRatio: '9/16' }}
                aria-label="Play Fit Flour reel"
              >
                <video
                  src={reel.src}
                  poster={reel.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                  onPlay={(e) => hideOverlay(e.currentTarget)}
                  onPause={(e) => showOverlay(e.currentTarget)}
                />

                {/* Top row: mini profile + reel badge */}
                <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2.5 pt-2.5 pointer-events-none">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="w-[18px] h-[18px] rounded-full border border-white/50 flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1B3D35, #4A7A66)' }}
                    >
                      <span className="text-white font-black" style={{ fontSize: '6px' }}>FF</span>
                    </div>
                    <span className="text-white/90 font-semibold truncate drop-shadow" style={{ fontSize: '9px' }}>fit.flour</span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-black/35 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 1L4.5 9.5l7.5 4 7.5-4L12 5z" />
                    </svg>
                    <span className="text-white font-bold tracking-wide" style={{ fontSize: '7px' }}>REEL</span>
                  </div>
                </div>

                <PlayOverlay />
              </button>
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Desktop: grid — hover to play, click opens Instagram */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {REELS.map((reel, i) => (
            <AnimateIn key={reel.id} animation="up" delay={i * 60}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  const v = e.currentTarget.querySelector('video') as HTMLVideoElement | null
                  v?.play().catch(() => {})
                }}
                onMouseLeave={(e) => {
                  const v = e.currentTarget.querySelector('video') as HTMLVideoElement | null
                  if (v) {
                    v.pause()
                    v.currentTime = 0
                  }
                }}
                className="group block relative aspect-[9/16] overflow-hidden bg-teal"
                aria-label="Watch Fit Flour reel on Instagram"
              >
                <video
                  src={reel.src}
                  poster={reel.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                  onPlay={(e) => hideOverlay(e.currentTarget)}
                  onPause={(e) => showOverlay(e.currentTarget)}
                />
                <ReelBadge />
                <PlayOverlay />
              </a>
            </AnimateIn>
          ))}
        </div>

        {/* Mobile follow CTA */}
        <div className="mt-6 text-center md:hidden">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal border border-teal px-8 py-3 hover:bg-teal hover:text-white transition-colors"
          >
            <InstagramIcon />
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>

      </div>
    </section>
  )
}
