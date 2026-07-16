import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'The story behind Fit Flour — why we built the 1:1 high-protein flour substitute and the mission to make healthier baking accessible to everyone.',
  openGraph: {
    title: 'Our Story | Fit Flour',
    description: "How Fit Flour was born — and why we believe you should never have to choose between the food you love and the goals you're chasing.",
  },
}

export default function OurStoryPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-3">
            The Mission
          </p>
          <h1 className="font-display text-5xl md:text-7xl uppercase text-ink tracking-tight leading-none mb-6">
            Our Story
          </h1>
          <p className="text-base text-muted leading-relaxed">
            We believe you shouldn't have to choose between the food you love and the goals you're chasing.
          </p>
        </header>

        {/* Story body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start max-w-5xl mx-auto">
          <div className="relative aspect-[3/4] bg-white overflow-hidden">
            <Image
              src="/images/lifestyle/img-9246.jpg"
              alt="Fit Flour — baking with high-protein flour"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col gap-8 md:pt-4">
            <div>
              <h2 className="font-display text-3xl uppercase text-ink tracking-tight mb-4">
                The Problem
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Most "healthy" baking alternatives sacrifice texture, taste, or require a PhD to use
                correctly. You've seen them — the gummy bread, the flat cookies, the chalky pancakes.
                We were sick of it.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl uppercase text-ink tracking-tight mb-4">
                The Solution
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Fit Flour is engineered to be a true 1:1 cup-for-cup substitute. Same rise. Same
                texture. Same taste. Just 6x the protein and a third of the carbs. Drop it into any
                recipe you already love — no adjustments, no failed bakes.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl uppercase text-ink tracking-tight mb-4">
                The Formula
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Crafted from a blend of protein-rich, whole-food ingredients. Gluten-free.
                Dairy-free. Nut-free. No artificial anything. Just clean macros and real baking
                performance.
              </p>
            </div>

            <Link
              href="/shop"
              className="self-start bg-teal text-paper text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-teal2 transition-colors"
            >
              Shop the Blends
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
