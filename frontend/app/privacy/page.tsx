import fs from 'node:fs/promises'
import path from 'node:path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — PermitMonkey',
  description:
    'How PermitMonkey collects, uses, retains, and shares data from contractors using the AI permit assistant.',
}

async function loadPolicy() {
  const filePath = path.join(process.cwd(), '..', 'PRIVACY.md')
  return fs.readFile(filePath, 'utf-8')
}

export default async function PrivacyPage() {
  const md = await loadPolicy()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← PermitMonkey
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="font-body text-foreground/90 leading-7 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:font-display [&_h1]:tracking-tight [&_h1]:mb-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1 [&_em]:text-muted-foreground [&_em]:italic [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
        </article>
      </main>
    </div>
  )
}
