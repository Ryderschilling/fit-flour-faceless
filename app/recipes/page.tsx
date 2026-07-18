import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getRecipePosts } from '@/lib/wix-blog'

export const metadata: Metadata = {
  title: 'Recipes',
  description:
    'High-protein, low-carb recipes using Fit Flour — cookies, biscuits, pizza, pancakes, and more. All your favorites, upgraded.',
  openGraph: {
    title: 'Recipes | Fit Flour',
    description: 'Make your favorite recipes with Fit Flour. Same taste, more protein, fewer carbs.',
  },
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}

export default async function RecipesPage() {
  const posts = await getRecipePosts()

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-content mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <header className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted mb-3">
            Bake Better
          </p>
          <h1 className="font-display text-5xl md:text-7xl uppercase text-ink tracking-tight">
            Recipes
          </h1>
          <p className="text-base text-muted mt-4 max-w-md mx-auto leading-relaxed">
            All your favorites — just upgraded. Drop Fit Flour in cup-for-cup and go.
          </p>
        </header>

        {posts.length === 0 ? (
          /* Fallback if API is down */
          <div className="text-center py-20 text-muted">
            <p className="text-sm">Recipes loading — check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/recipes/${post.slug}`}
                className="group bg-white flex flex-col overflow-hidden border border-line hover:border-teal transition-colors duration-300"
              >
                {/* Cover image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                  {post.coverImageUrl ? (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-paper flex items-center justify-center text-muted/20">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal">
                      Recipe
                    </span>
                    {post.minuteReadTime > 0 && (
                      <span className="text-[10px] text-muted uppercase tracking-widest">
                        {post.minuteReadTime} min read
                      </span>
                    )}
                    {post.publishedDate && (
                      <span className="text-[10px] text-muted ml-auto">
                        {formatDate(post.publishedDate)}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl uppercase text-ink tracking-tight leading-tight group-hover:text-teal transition-colors duration-200">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-sm text-muted leading-relaxed line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="text-xs font-bold uppercase tracking-widest text-ink border-b border-ink pb-0.5 self-start mt-auto group-hover:text-teal group-hover:border-teal transition-colors">
                    View Recipe →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-16 pt-10 border-t border-line">
          <p className="text-muted text-sm mb-6">
            New recipes every week — follow us for more.
          </p>
          <Link
            href="https://www.instagram.com/fitflour"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-ink text-ink text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-ink hover:text-paper transition-colors"
          >
            @fit.flour on Instagram
          </Link>
        </div>
      </div>
    </div>
  )
}
