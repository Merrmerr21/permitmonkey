'use client'

import { extractCitations } from '@/lib/citations/extract'
import type { CitationStatus, VerifiedCitation } from '@/lib/citations/types'
import { CitationPanelProvider } from '@/components/citation-panel-context'
import { CitationPanel } from '@/components/citation-panel'
import { MarkdownWithCitations } from '@/components/markdown-with-citations'

const SAMPLE_RESPONSE = `## Item 1 · Owner-occupancy condition

The corrections letter conditions the ADU permit on owner-occupancy of the primary dwelling. **State law preempts this condition.** Per state statute, no municipality may require the property owner to occupy either the primary dwelling or the ADU. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: MGL Ch 40A §3]

## Item 2 · Parking exemption

The proposed ADU sits within 0.5 miles walking distance of Forest Hills Station (Orange Line / commuter rail / bus). State law requires zero parking for ADUs in this proximity zone. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150 §8]

## Item 3 · Article 80 review

The proposed ADU is 712 square feet, far below the 20,000 square foot Small Project Review threshold. Article 80 review does not apply. [source: https://www.bostonplans.org/projects/development-review/what-is-article-80 | retrieved: 2026-05-03 | citation: Boston Zoning Code Article 80]
`

const DEMO_STATUSES: CitationStatus[] = ['verified-skill', 'verified-url', 'verified-skill']

export function LandingProvenanceDemo() {
  const extracted = extractCitations(SAMPLE_RESPONSE)
  const citations: VerifiedCitation[] = extracted.map((c, i) => ({
    ...c,
    verification: buildDemoVerification(c.authority, DEMO_STATUSES[i] ?? 'verified-skill'),
  }))

  return (
    <CitationPanelProvider>
      <div className="card-float rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-body uppercase tracking-widest text-foreground/50 font-semibold">
            Response letter · live preview
          </p>
          <span className="text-[11px] font-mono text-foreground/40">14 Maple St, Mattapan</span>
        </div>
        <div className="prose-permitmonkey">
          <MarkdownWithCitations citations={citations}>{SAMPLE_RESPONSE}</MarkdownWithCitations>
        </div>
        <div className="pt-3 mt-2 border-t border-primary/10 flex items-center gap-2 text-xs font-mono text-foreground/50">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-primary" fill="currentColor">
            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm4.7 6.7-5 5a1 1 0 0 1-1.4 0l-2-2 1.4-1.4L7 9.6l4.3-4.3z" />
          </svg>
          Click any pill to inspect the source · 3 of 3 citations verified
        </div>
      </div>
      <CitationPanel />
    </CitationPanelProvider>
  )
}

function buildDemoVerification(authority: string, status: CitationStatus) {
  if (status === 'verified-skill') {
    return { status, matched_reference: matchedReferenceFor(authority) }
  }
  if (status === 'verified-url') {
    return { status }
  }
  return { status }
}

function matchedReferenceFor(authority: string): string {
  if (authority.includes('Article 80')) return 'boston-adu/references/permit-process.md'
  if (authority.includes('40A')) return 'massachusetts-adu/references/chapter-150-of-2024.md'
  if (authority.includes('150')) return 'massachusetts-adu/references/chapter-150-of-2024.md'
  return 'massachusetts-adu/references/dimensional-summary.md'
}
