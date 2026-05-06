import fs from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'
import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

interface ArticleListing {
  slug: string
  title: string
  description: string
  published: string
  category: string
  city_focus: string
}

async function listArticles(limit = 3): Promise<ArticleListing[]> {
  let files: string[]
  try {
    files = await fs.readdir(ARTICLES_DIR)
  } catch {
    return []
  }

  const listings = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (f): Promise<ArticleListing | null> => {
        const slug = f.replace(/\.md$/, '')
        try {
          const raw = await fs.readFile(path.join(ARTICLES_DIR, f), 'utf-8')
          if (!raw.startsWith('---\n')) return null
          const end = raw.indexOf('\n---\n', 4)
          if (end < 0) return null
          const yaml = raw.slice(4, end)
          const fm: Record<string, string> = {}
          for (const line of yaml.split('\n')) {
            const m = line.match(/^([a-z_]+):\s*(.*)$/i)
            if (!m) continue
            fm[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '')
          }
          if (!fm.title || !fm.description || !fm.published) return null
          return {
            slug,
            title: fm.title,
            description: fm.description,
            published: fm.published,
            category: fm.category ?? 'general',
            city_focus: fm.city_focus ?? 'statewide',
          }
        } catch {
          return null
        }
      }),
  )

  return listings
    .filter((l): l is ArticleListing => l !== null)
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, limit)
}

export async function LandingArticlesPreview() {
  const articles = await listArticles(3)
  if (articles.length === 0) return null

  return (
    <section id="articles" className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <p className="eyebrow">What we&apos;re publishing</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mt-3">
            Citation-backed guides to MA permit work.
          </h2>
          <p className="mt-4 text-lg text-foreground/70 leading-relaxed">
            Every claim verified against the controlling statute, regulation, or
            municipal code. The same provenance pipeline that powers the corrections
            interpreter ships under every article.
          </p>
        </div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-body font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
        >
          See all articles <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group card-float rounded-2xl p-6 bg-card hover:-translate-y-1 transition-transform duration-300 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
                <BookOpenIcon className="w-4 h-4" />
              </span>
              <p className="text-xs uppercase tracking-widest font-semibold text-foreground/55">
                {article.category.replace(/-/g, ' ')}
              </p>
            </div>

            <h3 className="font-display font-bold text-lg leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-4 flex-1">
              {article.description}
            </p>

            <p className="mt-5 inline-flex items-center gap-1 text-xs font-mono text-foreground/45">
              {article.city_focus} · {new Date(article.published).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
