import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const routes = [
    '',
    '/influencers',
    '/vehicle-ads',
    '/how-it-works',
    '/pricing',
    '/about',
    '/brand/login',
    '/brand/signup',
    '/influencer/login',
    '/influencer/signup',
    '/vehicle/login',
    '/vehicle/signup',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route.startsWith('/influencers') || route.startsWith('/vehicle-ads') ? 0.9 : 0.7,
  }))
}
