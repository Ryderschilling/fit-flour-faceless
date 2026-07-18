/**
 * InstagramFeed — shows latest reels with a Follow CTA.
 *
 * TO MAKE THIS LIVE (easiest path — ~5 min):
 * 1. Client signs up free at https://behold.so
 * 2. Connect their Instagram Business/Creator account
 * 3. Create a feed, filter to Reels, copy the Feed ID
 * 4. Send Ryder the Feed ID
 * 5. Run: npm install @behold/react
 * 6. Replace the placeholder grid below with: <BeholdWidget feedId="FEED_ID" />
 *
 * Note: Instagram account must be Business or Creator (not personal).
 */

import { AnimateIn } from './AnimateIn'

// ── Update these when going live ──────────────────────────────────────────────
const INSTAGRAM_HANDLE = 'fitflour'
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`

// Placeholder reels — replaced by Behold widget once client connects Instagram
const PLACEHOLDER_REELS = [
  {
    id: 1,
    caption: 'Protein banana bread that actually tastes like banana bread',
    gradient: 'from-[#2D5A4A] to-[#1B3D35]',
  },
  {
    id: 2,
    caption: '1:1 swap. No adjustments. No failed bakes.',
    gradient: 'from-[#3D6B5A] to-[#2D5A4A]',
  },
  {
    id: 3,
    caption: 'Macro breakdown: Power Flour vs. all-purpose',
    gradient: 'from-[#1B3D35] to-[#0F2820]',
  },
  {
    id: 4,
    caption: "Gluten-free cookies that don't crumble — literally",
    gradient: 'from-[#4A7A66] to-[#2D5A4A]',
  },
  {
    id: 5,
    caption: '6x the protein. Same recipe. Weekend pancakes done right.',
    gradient: 'from-[#2D5A4A] to-[#3D6B5A]',
  },
  {
    id: 6,
    caption: 'The flour swap that changed our morning routine',
    gradient: 'from-[#1B3D35] to-[#2D5A4A]',
  },
]

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
        <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </div>
  )
}

export function InstagramFeed() {
  return (
    <section className="bg-paper py-20 md:py-28 px-6 overflow-hidden" aria-labelledby="ig-heading">
      <div className="max-w-content mx-auto">

        {/* Header */}
        <AnimateIn animation="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-teal/60 mb-2">
              @{INSTAGRAM_HANDLE}
            </p>
            <h2
              id="ig-heading"
              className="font-display text-4xl md:text-5xl uppercase text-ink tracking-tight"
            >
              As Seen on Reels
            </h2>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal border border-teal px-6 py-3 hover:bg-teal hover:text-white transition-colors self-start sm:self-auto flex-shrink-0"
          >
            <InstagramIcon />
            Follow for More
          </a>
        </AnimateIn>

        {/* Reels grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {PLACEHOLDER_REELS.map((reel, i) => (
            <AnimateIn key={reel.id} animation="up" delay={i * 60}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative aspect-[9/16] overflow-hidden bg-teal"
                aria-label={`View reel: ${reel.caption}`}
              >
                {/* Placeholder thumbnail */}
                <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient}`} />

                {/* Reels badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 1L4.5 9.5l7.5 4 7.5-4L12 5z"/>
                  </svg>
                  <span className="text-white text-[9px] font-bold tracking-wide">REEL</span>
                </div>

                {/* Play button */}
                <div className="transition-transform group-hover:scale-110">
                  <PlayIcon />
                </div>

                {/* Caption on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs leading-snug line-clamp-3">{reel.caption}</p>
                </div>
              </a>
            </AnimateIn>
          ))}
        </div>

        {/* Mobile CTA */}
        <AnimateIn animation="up" delay={200} className="mt-10 text-center md:hidden">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-teal border border-teal px-8 py-4 hover:bg-teal hover:text-white transition-colors"
          >
            <InstagramIcon />
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </AnimateIn>

      </div>
    </section>
  )
}
