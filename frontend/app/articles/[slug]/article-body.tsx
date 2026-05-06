'use client'

import { CitationPanelProvider } from '@/components/citation-panel-context'
import { CitationPanel } from '@/components/citation-panel'
import { MarkdownWithCitations } from '@/components/markdown-with-citations'
import type { VerifiedCitation } from '@/lib/citations/types'

interface ArticleBodyProps {
  markdown: string
  citations: VerifiedCitation[]
}

export function ArticleBody({ markdown, citations }: ArticleBodyProps) {
  return (
    <CitationPanelProvider>
      <article className="font-body text-foreground/90 leading-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:font-display [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_table]:w-full [&_table]:my-6 [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:py-2 [&_th]:px-3 [&_th]:bg-foreground/5 [&_td]:py-2 [&_td]:px-3 [&_td]:border-t [&_td]:border-border/40 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/75 [&_blockquote]:my-5">
        <MarkdownWithCitations citations={citations}>{markdown}</MarkdownWithCitations>
      </article>
      <CitationPanel />
    </CitationPanelProvider>
  )
}
