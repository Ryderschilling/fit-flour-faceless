import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRecipePost, getRecipePosts } from '@/lib/wix-blog'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getRecipePosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getRecipePost(params.slug)
  if (!post) return { title: 'Recipe Not Found' }
  return {
    title: post.title,
    description: post.excerpt || `High-protein recipe using Fit Flour: ${post.title}`,
    openGraph: {
      title: `${post.title} | Fit Flour Recipes`,
      description: post.excerpt,
      ...(post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : {}),
    },
  }
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(iso))
  } catch {
    return ''
  }
}

/**
 * Render plain-text recipe content with smart formatting.
 * Handles Fit Flour's recipe format: macros block, ingredients, numbered steps.
 */
function renderContent(text: string) {
  if (!text.trim()) return null

  // Split on newlines OR on sentence-ending keywords that run together
  // (Wix sometimes returns content with minimal whitespace)
  const normalized = text
    .replace(/\s*(Ingredients:|INGREDIENTS:)\s*/gi, '\n\nINGREDIENTS:\n')
    .replace(/\s*(Instructions:|INSTRUCTIONS:|Steps:|STEPS:)\s*/gi, '\n\nINSTRUCTIONS:\n')
    .replace(/\s*(Macros:|Full Macros:|MACROS:)\s*/gi, '\n\nMACROS:\n')
    .replace(/\s*(Notes?:|NOTES?:)\s*/gi, '\n\nNOTES:\n')

  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => {
        // Section header (all caps keyword or ends with colon)
        const isHeader =
          /^(INGREDIENTS|INSTRUCTIONS|MACROS|STEPS|NOTES|DIRECTIONS|METHOD)[:.]?$/i.test(line) ||
          (line.endsWith(':') && line.length < 40 && line === line.toUpperCase())

        // Numbered step: "1." "1)" "Step 1"
        const stepMatch = line.match(/^(?:step\s*)?(\d+)[.):\s]\s*(.+)/i)

        // Ingredient: starts with quantity (numbers, fractions, measurements)
        const isIngredient =
          !isHeader &&
          !stepMatch &&
          line.length < 120 &&
          /^[\d½¼¾⅓⅔⅛⅜⅝⅞]|^\d+\/\d+|^(a |an |the )?\d/i.test(line)

        if (isHeader) {
          return (
            <h3 key={i} className="font-display text-2xl uppercase text-ink tracking-tight mt-8 mb-3 pb-2 border-b border-line">
              {line.replace(/:$/, '')}
            </h3>
          )
        }

        if (stepMatch) {
          const [, num, content] = stepMatch
          return (
            <div key={i} className="flex gap-4 items-start py-2">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal text-paper text-xs font-black flex items-center justify-center mt-0.5 leading-none">
                {num}
              </span>
              <p className="text-sm text-ink leading-relaxed flex-1 pt-1">{content}</p>
            </div>
          )
        }

        if (isIngredient) {
          return (
            <div key={i} className="flex gap-3 items-start py-1">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-teal/60 mt-[7px]" />
              <p className="text-sm text-ink leading-relaxed">{line}</p>
            </div>
          )
        }

        // Macro stat line (e.g. "555 calories 88g of Protein...")
        if (/calories|protein|carbs|fat/i.test(line) && /\d+g?\s/i.test(line)) {
          const stats = line
            .replace(/(\d+g?\s*(calories?|protein|carbs?|fat))/gi, '||$1||')
            .split('||')
            .filter(Boolean)

          return (
            <div key={i} className="flex flex-wrap gap-3 my-2">
              {stats.map((s, j) =>
                /calories|protein|carbs|fat/i.test(s) ? (
                  <span key={j} className="bg-teal/10 text-teal text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
                    {s.trim()}
                  </span>
                ) : null
              )}
            </div>
          )
        }

        return (
          <p key={i} className="text-sm text-muted leading-relaxed py-0.5">
            {line}
          </p>
        )
      })}
    </div>
  )
}

export default async function RecipeDetailPage({ params }: Props) {
  const post = await getRecipePost(params.slug)
  if (!post) notFound()

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: post.title,
    description: post.excerpt,
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    ...(post.publishedDate ? { datePublished: post.publishedDate } : {}),
    author: { '@type': 'Organization', name: 'Fit Flour' },
    recipeIngredient: [],
  }

  return (
    <div className="bg-paper min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />

      {/* Cover image — full bleed */}
      {post.coverImageUrl && (
        <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden bg-ink">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          {/* Title on image */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 text-paper/70 text-xs font-bold uppercase tracking-widest mb-4 hover:text-paper transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                All Recipes
              </Link>
              <h1 className="font-display text-4xl md:text-6xl uppercase text-paper tracking-tight leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">

        {/* No cover — show title here */}
        {!post.coverImageUrl && (
          <header className="mb-10">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-widest mb-6 hover:text-teal transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              All Recipes
            </Link>
            <h1 className="font-display text-4xl md:text-6xl uppercase text-ink tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
          </header>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap py-5 border-y border-line mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">Recipe</span>
          {post.minuteReadTime > 0 && (
            <span className="text-xs text-muted">{post.minuteReadTime} min read</span>
          )}
          {post.publishedDate && (
            <span className="text-xs text-muted">{formatDate(post.publishedDate)}</span>
          )}
          <div className="ml-auto">
            <Link
              href="/shop"
              className="bg-teal text-paper text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-teal2 transition-colors"
            >
              Shop Fit Flour
            </Link>
          </div>
        </div>

        {/* Recipe content — full body from CONTENT_TEXT fieldset */}
        {post.contentText ? (
          <div className="mb-12">
            {renderContent(post.contentText)}
          </div>
        ) : (
          <div className="bg-white border border-line p-8 text-center mb-12">
            <p className="text-muted text-sm mb-4">
              View the full recipe on the Fit Flour blog.
            </p>
            <a
              href={`https://fitflour.shop/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal text-paper text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-teal2 transition-colors inline-block"
            >
              View Full Recipe
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="bg-teal p-8 md:p-10 text-center">
          <p className="font-display text-3xl uppercase text-paper tracking-tight mb-2">
            Ready to Bake This?
          </p>
          <p className="text-paper/80 text-sm mb-6">
            Grab a bag of Fit Flour and swap it 1:1 in any recipe.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-paper text-teal text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-white transition-colors"
          >
            Shop Now — $29.99
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/recipes"
            className="text-xs font-bold uppercase tracking-widest text-muted hover:text-teal transition-colors"
          >
            ← Back to All Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
