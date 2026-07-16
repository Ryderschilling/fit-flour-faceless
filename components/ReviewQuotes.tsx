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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? '#1B3D35' : '#D1D5DB'} aria-hidden="true">
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
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
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
        }))
      : STATIC_REVIEWS

  return (
    <section className="bg-paper py-20 md:py-28 px-6" aria-labelledby="reviews-heading">
      <div className="max-w-content mx-auto">

        <AnimateIn animation="fade" className="text-center mb-14">
          <h2
            id="reviews-heading"
            className="font-display text-4xl md:text-5xl uppercase text-ink tracking-tight"
          >
            What Bakers Are Saying
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
