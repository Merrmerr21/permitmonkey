/**
 * Design sandbox — Provenance UI demo.
 *
 * Renders a sample corrections-response markdown with inline citation tags,
 * substitutes them with <CitationPill> components, and demonstrates all
 * five verification states. Used for design review and component
 * regression detection. Not linked from production navigation.
 *
 * To integrate into the corrections-response viewer in a follow-up commit:
 *   1. Replace this page's hard-coded citations with results from
 *      verifyCitation() invoked in a server action or route handler.
 *   2. Wrap the existing <ResultsViewer> markdown rendering with
 *      <CitationPanelProvider> + <MarkdownWithCitations> + <CitationPanel>.
 */

import { extractCitations } from '@/lib/citations/extract'
import type { VerifiedCitation, CitationStatus } from '@/lib/citations/types'
import { CitationPanelProvider } from '@/components/citation-panel-context'
import { CitationPanel } from '@/components/citation-panel'
import { MarkdownWithCitations } from '@/components/markdown-with-citations'

const SAMPLE_MARKDOWN = `# Response to City Corrections — 14 Maple Street, Mattapan

## Item 1 — Owner-occupancy condition

The corrections letter conditions the ADU permit on owner-occupancy of the primary dwelling. **State law preempts this condition.** Per MGL Ch 40A §3 as amended by St. 2024, c. 150, §8, no municipality may require the property owner to occupy either the primary dwelling or the ADU. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §8] We respectfully request the city remove this condition.

## Item 2 — Parking exemption

The proposed ADU sits within 0.5 miles walking distance of Forest Hills Station (Orange Line / commuter rail / bus). State law requires zero parking for ADUs in this proximity zone. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: MGL Ch 40A §3] The walking-distance measurement is documented in Attachment B (Google Maps walking directions, dated 2026-05-01).

## Item 3 — Article 80 review

The corrections letter references Article 80 of the Boston Zoning Code as a procedural review step. Article 80 Small Project Review thresholds at 20,000 square feet and Large Project Review at 50,000 square feet. [source: https://www.bostonplans.org/projects/development-review/what-is-article-80 | retrieved: 2026-05-03 | citation: Boston Zoning Code Article 80] The proposed ADU is 712 square feet, far below either threshold, and does not trigger Article 80 review.

## Item 4 — Building code edition

The correction cites 780 CMR 9th Edition. The current Massachusetts State Building Code is 780 CMR 10th Edition, effective October 2023, adopting IRC 2021 with Massachusetts amendments. [source: https://www.mass.gov/state-building-code | retrieved: 2026-04-22 | citation: 780 CMR (10th Edition)] The plans were prepared under the 10th Edition; we request the corrections be updated to reference the current edition.

## Item 5 — Stretch energy code (advisory)

Boston has adopted the Specialized Opt-In Energy Code (225 CMR 22 Appendix RC), which requires net-zero or near-net-zero performance for new ADU construction. [source: https://www.example.gov/specialized-not-real | retrieved: 2026-05-03 | citation: 225 CMR 22 Appendix RC] The plans demonstrate compliance via heat-pump heating, HRV ventilation, and solar-ready provisions on Sheet A-301.
`

const NOW_DEMO = new Date().toISOString().slice(0, 10)

export default function CitationsSandboxPage() {
  const extracted = extractCitations(SAMPLE_MARKDOWN)

  // Demo: assign deterministic statuses cycling through all 5 variants so a
  // designer can see each state without running the verifier. In production
  // each citation gets its real verification from verifyCitation().
  const demoStatuses: CitationStatus[] = [
    'verified-url',
    'verified-skill',
    'verified-url',
    'verified-skill',
    'broken',
  ]

  const verified: VerifiedCitation[] = extracted.map((c, i) => ({
    ...c,
    verification: buildDemoVerification(c.authority, demoStatuses[i] ?? 'pending'),
  }))

  return (
    <CitationPanelProvider>
      <div className="bg-permitmonkey-gradient min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-8">
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Design sandbox · Provenance UI · Phase A
            </p>
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground mb-3">
              Clickable inline citations
            </h1>
            <p className="font-body text-base text-muted-foreground max-w-2xl">
              Click any pill below to open the citation panel. Five states demo: verified
              against skill reference, verified against canonical source, unverified,
              broken source, and pending. The verifier is not invoked on this page —
              statuses are pre-assigned for design review. Production integration runs{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">verifyCitation()</code>{' '}
              before render.
            </p>
            <p className="font-body text-sm text-muted-foreground mt-4">
              Last refreshed: {NOW_DEMO}
            </p>
          </div>

          <article className="rounded-lg bg-card border border-border/50 shadow-[0_8px_32px_rgba(28,25,23,0.08)] p-8">
            <MarkdownWithCitations
              citations={verified}
              className="font-body text-base leading-relaxed text-card-foreground prose-headings:font-display prose-headings:tracking-tight"
            >
              {SAMPLE_MARKDOWN}
            </MarkdownWithCitations>
          </article>

          <div className="mt-10 grid gap-3 text-sm font-body text-muted-foreground">
            <p>
              <strong className="text-foreground">Status legend.</strong> Verified
              citations render in moss green. Unverified renders amber. Broken sources
              render autumn red. Pending verifications pulse muted.
            </p>
            <p>
              <strong className="text-foreground">Wire-up status.</strong> Components
              live at <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">frontend/components/citation-pill.tsx</code>,
              {' '}<code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">citation-panel.tsx</code>,
              {' '}<code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">markdown-with-citations.tsx</code>.
              Phase B brings caching, async re-verification via Supabase Realtime, and
              the compact pill variant for marketing pages.
            </p>
          </div>
        </div>
        <CitationPanel />
      </div>
    </CitationPanelProvider>
  )
}

function buildDemoVerification(authority: string, status: CitationStatus) {
  switch (status) {
    case 'verified-skill':
      return {
        status,
        matched_reference: matchedReferenceFor(authority),
      }
    case 'verified-url':
      return { status }
    case 'unverified':
      return {
        status,
        error: 'method1: excerpt_not_in_skill_references; method2: excerpt_not_found',
      }
    case 'broken':
      return {
        status,
        error: 'url_404',
      }
    case 'pending':
      return { status }
  }
}

function matchedReferenceFor(authority: string): string {
  if (authority.includes('Article 80')) {
    return 'boston-adu/references/permit-process.md'
  }
  if (authority.includes('780 CMR')) {
    return 'boston-adu/references/building-codes.md'
  }
  if (authority.includes('40A')) {
    return 'massachusetts-adu/references/chapter-150-of-2024.md'
  }
  if (authority.includes('CMR 22')) {
    return 'boston-adu/references/building-codes.md'
  }
  return 'massachusetts-adu/references/dimensional-summary.md'
}
