/**
 * InstagramFeed — shows latest reels with a Follow CTA.
 *
 * TO MAKE THIS LIVE (~5 min):
 * 1. Client signs up free at https://behold.so
 * 2. Connect Instagram Business/Creator account
 * 3. Create a feed, filter to Reels, copy the Feed ID
 * 4. Run: npm install @behold/react
 * 5. Replace the placeholder grid with: <BeholdWidget feedId="FEED_ID" />
 */

import { AnimateIn } from './AnimateIn'

const INSTAGRAM_HANDLE = 'fit.flour'
const INSTAGRAM_URL = 'https://www.instagram.com/fit.flour/'

const PLACEHOLDER_REELS = [
  {
    id: 1,
    caption: 'Protein banana bread that actually tastes like banana bread',
    gradient: 'from-[#2D5A4A] to-[#1B3D35]',
    likes: '2.4k',
    views: '18k',
  },
  {
    id: 2,
    caption: '1:1 swap. No adjustments. No failed bakes.',
    gradient: 'from-[#3D6B5A] to-[#2D5A4A]',
    likes: '1.8k',
    views: '14k',
  },
  {
    id: 3,
    caption: 'Macro breakdown: Power Flour vs. all-purpose',
    gradient: 'from-[#1B3D35] to-[#0F2820]',
    likes: '3.1k',
    views: '22k',
  },
  {
    id: 4,
    caption: "Gluten-free cookies that don't crumble — literally",
    gradient: 'from-[#4A7A66] to-[#2D5A4A]',
    likes: '2.9k',
    views: '19k',
  },
  {
    id: 5,
    caption: '6x the protein. Same recipe. Weekend pancakes done right.',
    gradient: 'from-[#2D5A4A] to-[#3D6B5A]',
    likes: '4.2k',
    views: '31k',
  },
  {
    id: 6,
    caption: 'The flour swap that changed our morning routine',
    gradient: 'from-[#1B3D35] to-[#2D5A4A]',
    likes: '1.6k',
    views: '12k',
  },
]

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
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

        {/* Mobile: premium snap-scroll reel carousel */}
        <div className="md:hidden -mx-6 overflow-x-auto carousel-scroll">
          <div className="flex gap-2.5 px-6 pb-4 snap-x snap-mandatory">
            {PLACEHOLDER_REELS.map((reel) => (
              <a
                key={reel.id}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[148px] snap-start group block relative overflow-hidden rounded-xl"
                style={{ aspectRatio: '9/16' }}
                aria-label={`View reel: ${reel.caption}`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient}`} />

                {/* Top row: mini profile + reel badge */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2.5 pt-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="w-[18px] h-[18px] rounded-full border border-white/50 flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1B3D35, #4A7A66)' }}
                    >
                      <span className="text-white font-black" style={{ fontSize: '6px' }}>FF</span>
                    </div>
                    <span className="text-white/90 font-semibold truncate" style={{ fontSize: '9px' }}>fit.flour</span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-black/35 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 1L4.5 9.5l7.5 4 7.5-4L12 5z" />
                    </svg>
                    <span className="text-white font-bold tracking-wide" style={{ fontSize: '7px' }}>REEL</span>
                  </div>
                </div>

                {/* Center play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-[18px] h-[18px] text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                {/* Bottom: engagement stats + caption */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 pt-8"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-0.5">
                      <svg className="w-2.5 h-2.5 text-white/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <span className="text-white/75 font-medium" style={{ fontSize: '8px' }}>{reel.likes}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg className="w-2.5 h-2.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span className="text-white/75 font-medium" style={{ fontSize: '8px' }}>{reel.views}</span>
                    </div>
                  </div>
                  <p className="text-white font-medium leading-tight" style={{ fontSize: '9px' }}>
                    {reel.caption.length > 48 ? reel.caption.slice(0, 48) + '…' : reel.caption}
                  </p>
                </div>
              </a>
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Desktop: full grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {PLACEHOLDER_REELS.map((reel, i) => (
            <AnimateIn key={reel.id} animation="up" delay={i * 60}>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative aspect-[9/16] overflow-hidden bg-teal"
                aria-label={`View reel: ${reel.caption}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient}`} />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 1L4.5 9.5l7.5 4 7.5-4L12 5z"/>
                  </svg>
                  <span className="text-white text-[9px] font-bold tracking-wide">REEL</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transition-transform group-hover:scale-110">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs leading-snug line-clamp-3">{reel.caption}</p>
                </div>
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
