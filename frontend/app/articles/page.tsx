import fs from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

interface ArticleListing {
  slug: string
  title: string
  description: string
  published: string
  category: string
  city_focus: string
}

export const metadata = {
  title: 'Articles — PermitMonkey',
  description:
    'Verified, citation-backed guides to Massachusetts ADU permitting: state law, energy code, city bylaws, and corrections-letter strategy.',
}

async function listArticles(): Promise<ArticleListing[]> {
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
}

export default async function ArticlesIndex() {
  const articles = await listArticles()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← PermitMonkey
          </Link>
          <div className="flex gap-5 text-sm">
            <Link href="/eligibility" className="text-muted-foreground hover:text-foreground">Free tool</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Articles</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mt-3">
            Massachusetts ADU permitting, explained.
          </h1>
          <p className="mt-4 text-base text-foreground/70 leading-relaxed">
            Citation-backed guides to state law, energy code, city bylaws, and corrections-letter
            strategy. Every claim verified against the controlling statute, regulation, or municipal
            code.
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="text-foreground/60">No articles yet.</p>
        ) : (
          <div className="space-y-8">
            {articles.map((a) => (
              <article key={a.slug} className="border-b border-border/30 pb-8 last:border-b-0">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
                  {a.category.replace(/-/g, ' ')} · {a.city_focus}
                </p>
                <h2 className="font-display font-bold text-2xl text-foreground leading-tight">
                  <Link href={`/articles/${a.slug}`} className="hover:text-primary transition">
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{a.description}</p>
                <p className="mt-3 text-xs text-foreground/50">
                  {new Date(a.published).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 PermitMonkey</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
