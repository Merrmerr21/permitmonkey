import fs from 'node:fs/promises'
import path from 'node:path'
import type { MetadataRoute } from 'next'

/**
 * Sitemap generation. Next.js 16 reads this file as the canonical sitemap
 * source. Override the base URL with NEXT_PUBLIC_SITE_URL in production
 * (e.g., https://permitmonkey.com); falls back to the Vercel-injected URL
 * for preview deployments and to localhost in dev.
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

async function articleSlugs(): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), 'content', 'articles')
    const files = await fs.readdir(dir)
    return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl()
  const now = new Date()
  const articles = await articleSlugs()

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/eligibility`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...articles.map((slug) => ({
      url: `${base}/articles/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
