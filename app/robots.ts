import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/workspace/', '/api/'],
    },
    sitemap: 'https://video2pen.vercel.app/sitemap.xml',
  }
}
