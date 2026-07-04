import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://jordantransfer.jo'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'ar']
  const pages = [
    { path: '', priority: 1.0 },
    { path: '/cars', priority: 0.9 },
    { path: '/booking', priority: 0.8 },
  ]

  return locales.flatMap((locale) =>
    pages.map(({ path, priority }) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority,
    }))
  )
}
