/**
 * Wix Blog API — fetches recipe posts with full content.
 *
 * Uses POST /blog/v3/posts/query so we can include fieldsets in the body.
 * Fieldsets as GET query params cause a 400 error.
 * CONTENT_TEXT fieldset returns the full post body as plain text.
 */

export interface RecipePost {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImageUrl: string | null
  publishedDate: string
  minuteReadTime: number
  contentText: string
}

function wixBlogHeaders() {
  const apiKey = process.env.WIX_API_KEY
  const siteId = process.env.WIX_SITE_ID
  if (!apiKey || !siteId) throw new Error('WIX_API_KEY and WIX_SITE_ID required')
  return {
    'Content-Type': 'application/json',
    Authorization: apiKey,
    'wix-site-id': siteId,
  }
}

/** Try every known path where Wix Blog v3 stashes cover images */
function extractCoverImage(post: any): string | null {
  const candidates = [
    post?.media?.wixMedia?.image?.imageInfo?.url,
    post?.media?.wixMedia?.image?.url,
    post?.coverMedia?.image?.imageInfo?.url,
    post?.coverMedia?.image?.url,
    post?.heroImage?.imageInfo?.url,
    post?.heroImage?.url,
    post?.image?.imageInfo?.url,
    post?.image?.url,
  ]
  for (const url of candidates) {
    if (typeof url === 'string' && url.trim()) {
      return url.startsWith('http') ? url : `https://static.wixstatic.com/media/${url}`
    }
  }
  return null
}

function mapPost(p: any): RecipePost {
  // contentText from CONTENT_TEXT fieldset is the full recipe body
  const fullContent = p.contentText ?? ''
  return {
    id: p.id ?? '',
    slug: p.slug ?? '',
    title: p.title ?? 'Untitled',
    excerpt: p.excerpt ?? '',
    coverImageUrl: extractCoverImage(p),
    publishedDate: p.firstPublishedDate ?? p.publishedDate ?? '',
    minuteReadTime: p.minuteReadTime ?? 1,
    contentText: fullContent || (p.excerpt ?? ''),
  }
}

/** Fetch all published posts with full content via POST query */
export async function getRecipePosts(): Promise<RecipePost[]> {
  try {
    const res = await fetch('https://www.wixapis.com/blog/v3/posts/query', {
      method: 'POST',
      headers: wixBlogHeaders(),
      body: JSON.stringify({
        fieldsets: ['CONTENT_TEXT'],
        paging: { limit: 50 },
      }),
      next: { revalidate: 21600 },
    } as any)

    if (!res.ok) {
      console.error('[wix-blog] query error', res.status, await res.text())
      // Fallback: GET without fieldsets
      return getRecipePostsFallback()
    }
    const data = await res.json()
    return (data.posts ?? []).map(mapPost)
  } catch (err) {
    console.error('[wix-blog] error', err)
    return []
  }
}

/** Fallback: GET endpoint (no full content, just excerpts) */
async function getRecipePostsFallback(): Promise<RecipePost[]> {
  try {
    const res = await fetch('https://www.wixapis.com/blog/v3/posts?paging.limit=50', {
      headers: wixBlogHeaders(),
      next: { revalidate: 21600 },
    } as any)
    if (!res.ok) return []
    const data = await res.json()
    return (data.posts ?? []).map(mapPost)
  } catch {
    return []
  }
}

/** Fetch a single post by slug with full content */
export async function getRecipePost(slug: string): Promise<RecipePost | null> {
  try {
    // Try POST query with slug filter + full content
    const res = await fetch('https://www.wixapis.com/blog/v3/posts/query', {
      method: 'POST',
      headers: wixBlogHeaders(),
      body: JSON.stringify({
        fieldsets: ['CONTENT_TEXT'],
        filter: { slug: { $eq: slug } },
        paging: { limit: 1 },
      }),
      next: { revalidate: 21600 },
    } as any)

    if (res.ok) {
      const data = await res.json()
      const post = data.posts?.[0]
      if (post) return mapPost(post)
    }

    // Fallback: GET by slug (no fieldsets)
    const fallback = await fetch(
      `https://www.wixapis.com/blog/v3/posts/slugs/${encodeURIComponent(slug)}`,
      { headers: wixBlogHeaders(), next: { revalidate: 21600 } } as any
    )
    if (!fallback.ok) return null
    const fb = await fallback.json()
    return fb.post ? mapPost(fb.post) : null
  } catch (err) {
    console.error('[wix-blog] get post error', err)
    return null
  }
}
