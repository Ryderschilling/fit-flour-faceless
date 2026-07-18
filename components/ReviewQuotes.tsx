import { getWixReviews } from '@/lib/wix-reviews'
import { AnimateIn } from './AnimateIn'

interface Review {
  id: string
  authorName: string
  rating: number
  body: string
  location?: string
}

const STATIC_REVIEWS: Review[] = [
  {
    id: 's1',
    authorName: 'Sarah M.',
    rating: 5,
    body: "I use it in literally everything — pancakes, muffins, banana bread. My family can't tell the difference and I'm hitting 40g of protein before noon.",
    location: 'Austin, TX',
  },
  {
    id: 's2',
    authorName: 'Jake T.',
    rating: 5,
    body: "Finally a flour that actually swaps 1:1. I've tried everything. This is the one that works.",
    location: 'Denver, CO',
  },
  {
    id: 's3',
    authorName: 'Rachel K.',
    rating: 5,
    body: 'As someone with celiac, the Gluten-Free blend is a game changer. My cookies finally taste like cookies again.',
    location: 'Nashville, TN',
  },
]

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= rating ? '#1B3D35' : '#D1D5DB'} aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function InitialsAvatar({ name }: { name: string }) {
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
      style={{ background: `hsl(${hue}, 35%, 42%)` }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export async function ReviewQuotes() {
  const wixReviews = await getWixReviews(6)

  const reviews: Review[] =
    wixReviews.length > 0
      ? wixReviews.slice(0, 6).map((r) => ({
          id: r.id,
          authorName: r.authorName,
          rating: r.rating,
          body: r.body,
          location: r.location,
        }))
      : STATIC_REVIEWS

  return (
    <section className="bg-paper py-12 md:py-28 px-6" aria-labelledby="reviews-heading">
      <div className="max-w-content mx-auto">

        <AnimateIn animation="fade" className="text-center mb-10 md:mb-14">
          <h2
            id="reviews-heading"
            className="font-display text-3xl md:text-5xl uppercase text-ink tracking-tight"
          >
            What Bakers Are Saying
          </h2>
        </AnimateIn>

        {/* Mobile: premium snap-scroll carousel */}
        <div className="md:hidden -mx-6 overflow-x-auto carousel-scroll">
          <div className="flex gap-3 px-6 pb-4 snap-x snap-mandatory">
            {reviews.map((r) => (
              <div key={r.id} className="flex-shrink-0 w-[272px] snap-start">
                <div
                  className="relative bg-white overflow-hidden h-full flex flex-col"
                  style={{ boxShadow: '0 4px 24px -4px rgba(27,61,53,0.12), 0 0 0 1px rgba(27,61,53,0.07)' }}
                >
                  {/* Teal top accent strip */}
                  <div className="h-[3px] bg-gradient-to-r from-[#1B3D35] via-[#2D5A4A] to-[#4A7A66]" />

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {/* Decorative quote + stars */}
                    <div className="flex items-start justify-between">
                      <span
                        className="font-display text-[64px] leading-[0.6] text-[#1B3D35] select-none"
                        style={{ opacity: 0.12 }}
                        aria-hidden="true"
                      >
                        &ldquo;
                      </span>
                      <StarRating rating={r.rating} size={13} />
                    </div>

                    {/* Review body */}
                    <p className="text-ink text-[13px] leading-relaxed flex-1 -mt-1">
                      &ldquo;{r.body}&rdquo;
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#1B3D35]/8">
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar name={r.authorName} />
                        <div>
                          <cite className="not-italic text-xs font-bold text-ink block leading-tight">
                            {r.authorName}
                          </cite>
                          <span className="text-[11px] text-[#8A8070]">
                            {r.location ?? 'Verified Buyer'}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-black uppercase tracking-widest text-[#1B3D35] px-2 py-1 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(27,61,53,0.08)' }}
                      >
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <AnimateIn key={r.id} animation="up" delay={i * 90}>
              <blockquote className="bg-white p-8 flex flex-col gap-5 border border-line h-full">
                <StarRating rating={r.rating} />
                <p className="text-ink text-base leading-relaxed flex-1">&ldquo;{r.body}&rdquo;</p>
                <footer className="flex items-center gap-3">
                  <InitialsAvatar name={r.authorName} />
                  <div className="text-sm text-muted">
                    <cite className="not-italic font-semibold text-ink block">{r.authorName}</cite>
                    {r.location ? r.location : 'Verified Buyer'}
                  </div>
                </footer>
              </blockquote>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  )
}
