import type { MetadataRoute } from 'next'
import { commerce } from '@/lib/commerce'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await commerce.getProducts()

  const productUrls = products.map((p) => ({
    url: `https://fitflour.shop/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://fitflour.shop',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://fitflour.shop/shop',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...productUrls,
    {
      url: 'https://fitflour.shop/our-story',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://fitflour.shop/recipes',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://fitflour.shop/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]
}
