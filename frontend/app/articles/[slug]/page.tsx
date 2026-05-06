import fs from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { verifyCitationsAction } from '@/app/actions/verify-citations'
import { ArticleBody } from './article-body'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

interface ArticleFrontmatter {
  title: string
  description: string
  slug: string
  published: string
  last_updated: string
  category: string
  city_focus: string
}

interface Article {
  frontmatter: ArticleFrontmatter
  body: string
}

function parseFrontmatter(raw: string): Article | null {
  // Frontmatter must start with `---\n`. Cheap, deterministic; no yaml dep.
  if (!raw.startsWith('---\n')) return null
  const end = raw.indexOf('\n---\n', 4)
  if (end < 0) return null
  const yaml = raw.slice(4, end)
  const body = raw.slice(end + 5)

  const fm: Partial<ArticleFrontmatter> = {}
  for (const line of yaml.split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i)
    if (!m) continue
    const key = m[1] as keyof ArticleFrontmatter
    const value = m[2].trim().replace(/^['"]|['"]$/g, '')
    fm[key] = value
  }

  // Required fields.
  if (!fm.title || !fm.slug || !fm.description || !fm.published) return null
  return {
    frontmatter: {
      title: fm.title,
      description: fm.description,
      slug: fm.slug,
      published: fm.published,
      last_updated: fm.last_updated ?? fm.published,
      category: fm.category ?? 'general',
      city_focus: fm.city_focus ?? 'statewide',
    },
    body,
  }
}

async function loadArticle(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
    const raw = await fs.readFile(filePath, 'utf-8')
    return parseFrontmatter(raw)
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const files = await fs.readdir(ARTICLES_DIR)
    return files
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ slug: f.replace(/\.md$/, '') }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  if (!article) return { title: 'Article Not Found — PermitMonkey' }
  const title = `${article.frontmatter.title} — PermitMonkey`
  const { description, published, last_updated, slug: articleSlug } = article.frontmatter
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/articles/${articleSlug}`,
      siteName: 'PermitMonkey',
      publishedTime: published,
      modifiedTime: last_updated,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/articles/${articleSlug}`,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  if (!article) notFound()

  // Run the verifier on every inline provenance tag in the article body.
  // Same path the corrections viewer takes — eats our own dog food.
  const citations = await verifyCitationsAction(article.body)

  const publishedDate = new Date(article.frontmatter.published).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">
            {article.frontmatter.category.replace(/-/g, ' ')} · {article.frontmatter.city_focus}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground mt-3 leading-tight">
            {article.frontmatter.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Published {publishedDate}
            {article.frontmatter.last_updated !== article.frontmatter.published && (
              <> · Last updated {new Date(article.frontmatter.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>
            )}
          </p>
        </div>

        <ArticleBody markdown={article.body} citations={citations} />

        <section className="mt-16 p-8 rounded-2xl bg-foreground/5 border border-border/40">
          <h2 className="font-display font-bold text-xl text-foreground">
            Need this for your specific address?
          </h2>
          <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
            The free eligibility checker resolves your ADU verdict for any Massachusetts address in
            under ten seconds, with verified citations to the controlling statute, regulation, and
            local bylaw.
          </p>
          <Link
            href="/eligibility"
            className="inline-block mt-4 px-5 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
          >
            Run the eligibility checker
          </Link>
        </section>
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
