import { ImageResponse } from 'next/og'
import fs from 'node:fs/promises'
import path from 'node:path'

// Per-article OpenGraph card. Renders the article title + category +
// PermitMonkey wordmark on the brand moss-green gradient. Article-specific
// cards drive higher click-through on social shares than a generic
// site-wide image and tag every shared link with the canonical brand
// surface (master playbook §69 — viral artifacts).

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

export const alt = 'PermitMonkey article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface ArticleMeta {
  title: string
  category: string
  city_focus: string
}

async function loadArticleMeta(slug: string): Promise<ArticleMeta | null> {
  try {
    const raw = await fs.readFile(path.join(ARTICLES_DIR, `${slug}.md`), 'utf-8')
    if (!raw.startsWith('---\n')) return null
    const end = raw.indexOf('\n---\n', 4)
    if (end < 0) return null
    const yaml = raw.slice(4, end)
    const fm: Partial<ArticleMeta> = {}
    for (const line of yaml.split('\n')) {
      const m = line.match(/^([a-z_]+):\s*(.*)$/i)
      if (!m) continue
      const key = m[1] as keyof ArticleMeta
      const value = m[2].trim().replace(/^['"]|['"]$/g, '')
      fm[key] = value
    }
    if (!fm.title) return null
    return {
      title: fm.title,
      category: (fm.category ?? 'general').replace(/-/g, ' '),
      city_focus: fm.city_focus ?? 'statewide',
    }
  } catch {
    return null
  }
}

export default async function ArticleOpenGraphImage({
  params,
}: {
  params: { slug: string }
}) {
  const meta = (await loadArticleMeta(params.slug)) ?? {
    title: 'PermitMonkey',
    category: 'article',
    city_focus: 'statewide',
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)',
          color: '#F0FFF4',
          padding: '72px 80px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: '#F0FFF4',
              color: '#2D6A4F',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            P
          </div>
          PermitMonkey
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            marginTop: 36,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.7,
              fontWeight: 600,
            }}
          >
            {meta.category} · {meta.city_focus}
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: 1040,
              marginTop: 18,
              display: 'flex',
            }}
          >
            {meta.title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            opacity: 0.75,
            borderTop: '1px solid rgba(240, 255, 244, 0.2)',
            paddingTop: 20,
          }}
        >
          <span>Verified citations · MGL Ch 40A · 760 CMR 71.00 · 780 CMR</span>
          <span>permitmonkey.com</span>
        </div>
      </div>
    ),
    size,
  )
}
