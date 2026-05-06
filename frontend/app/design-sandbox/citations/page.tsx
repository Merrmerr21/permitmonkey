/**
 * Design sandbox — Provenance UI demo.
 *
 * Renders the five citation states as five separate labeled rows so a
 * designer can see each one independently. Each row contains a single
 * representative claim + pill. Click a pill to open the panel.
 *
 * To integrate into the corrections-response viewer in production:
 *   1. Replace the hard-coded statuses below with results from
 *      verifyCitation() invoked in a server action or route handler.
 *   2. Wrap the existing <ResultsViewer> markdown rendering with
 *      <CitationPanelProvider> + <MarkdownWithCitations> + <CitationPanel>.
 */

import { extractCitations } from '@/lib/citations/extract'
import type { VerifiedCitation, CitationStatus } from '@/lib/citations/types'
import { CitationPanelProvider } from '@/components/citation-panel-context'
import { CitationPanel } from '@/components/citation-panel'
import { MarkdownWithCitations } from '@/components/markdown-with-citations'

interface DemoRow {
  status: CitationStatus
  label: string
  blurb: string
  markdown: string
  matchedReference?: string
  error?: string
}

const DEMO_ROWS: DemoRow[] = [
  {
    status: 'verified-skill',
    label: 'Verified · Skill reference',
    blurb: 'Method 1 succeeded — the cited excerpt was found verbatim in a server-side skill reference file. Most reliable state.',
    markdown:
      'No additional parking space shall be required for an accessory dwelling located not more than 0.5 miles from a commuter rail station, subway station, ferry terminal or bus station. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: MGL Ch 40A §3]',
    matchedReference: 'massachusetts-adu/references/chapter-150-of-2024.md',
  },
  {
    status: 'verified-url',
    label: 'Verified · Canonical URL',
    blurb: 'Method 1 missed but Method 2 fetched the canonical source URL and matched the excerpt after HTML strip.',
    markdown:
      'Boston regulates short-term rentals under Sec. 9-14 of the City of Boston Code. [source: https://www.boston.gov/departments/inspectional-services/short-term-rentals | retrieved: 2026-05-01 | citation: City of Boston Code §9-14]',
  },
  {
    status: 'unverified',
    label: 'Unverified',
    blurb: 'Both methods returned "not found." The agent emitted the citation but neither verifier could locate the excerpt. The pill warns the user to check manually.',
    markdown:
      'Cambridge Historical Commission review applies to the proposed Old Cambridge ADU exterior modifications. [source: https://www.cambridgema.gov/historic | retrieved: 2026-05-04 | citation: Cambridge Historical Commission jurisdiction]',
    error: 'method1: excerpt_not_in_skill_references; method2: excerpt_not_found',
  },
  {
    status: 'broken',
    label: 'Broken source',
    blurb: 'Method 2 fetched the URL and got a 404 (or the skill path no longer exists). Hard fail — the agent should not be relying on this citation.',
    markdown:
      'Boston has adopted the Specialized Opt-In Energy Code (225 CMR 22 Appendix RC). [source: https://www.example.gov/specialized-not-real | retrieved: 2026-05-03 | citation: 225 CMR 22 Appendix RC]',
    error: 'url_404',
  },
  {
    status: 'pending',
    label: 'Pending',
    blurb: 'Verification is in flight (server action running). The pill renders muted with a soft pulse until a result arrives.',
    markdown:
      'Boston ADU dimensional standards are governed by per-neighborhood Articles under the special-act zoning enabling framework. [source: https://library.municode.com/ma/boston/codes/redevelopment_authority | retrieved: 2026-05-05 | citation: Boston Zoning Code per-neighborhood Articles]',
  },
]

const NOW_DEMO = new Date().toISOString().slice(0, 10)

export default function CitationsSandboxPage() {
  const rows = DEMO_ROWS.map((row) => {
    const extracted = extractCitations(row.markdown)
    const verified: VerifiedCitation[] = extracted.map((c) => ({
      ...c,
      verification: buildVerification(row.status, row.matchedReference, row.error),
    }))
    return { ...row, verified }
  })

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
              Five citation states, one per row. Click any pill to open the side panel.
              Statuses are pre-assigned for design review — production renders the same
              components after running{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">verifyCitation()</code>{' '}
              on each tag.
            </p>
            <p className="font-body text-sm text-muted-foreground mt-4">
              Last refreshed: {NOW_DEMO}
            </p>
          </div>

          <div className="rounded-lg bg-card border border-border/50 shadow-[0_4px_16px_rgba(28,25,23,0.06)] p-5 mb-8">
            <p className="font-body text-sm font-semibold text-foreground mb-3">Status legend</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body text-muted-foreground">
              <p><span className="inline-block w-2 h-2 rounded-full bg-primary mr-2 align-middle" /> Verified · skill reference (Method 1)</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-primary mr-2 align-middle" /> Verified · canonical URL (Method 2)</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2 align-middle" /> Unverified — agent emitted; verifier missed</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 align-middle" /> Broken — 404 / dead skill path</p>
              <p className="sm:col-span-2"><span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50 mr-2 align-middle" /> Pending — verification in flight</p>
            </div>
          </div>

          <div className="space-y-6">
            {rows.map((row, i) => (
              <article
                key={row.status + i}
                className="rounded-lg bg-card border border-border/50 shadow-[0_4px_16px_rgba(28,25,23,0.04)] p-6"
              >
                <header className="mb-3">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    State {i + 1} of {rows.length}
                  </p>
                  <h2 className="font-display text-xl font-bold tracking-tight text-foreground mt-0.5">
                    {row.label}
                  </h2>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    {row.blurb}
                  </p>
                </header>
                <div className="border-t border-border/40 pt-4">
                  <MarkdownWithCitations
                    citations={row.verified}
                    className="font-body text-[15px] leading-relaxed text-card-foreground"
                  >
                    {row.markdown}
                  </MarkdownWithCitations>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-sm font-body text-muted-foreground">
            <p>
              <strong className="text-foreground">Wire-up.</strong> Components live at{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">frontend/components/citation-pill.tsx</code>,{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">citation-panel.tsx</code>,{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">markdown-with-citations.tsx</code>.
              Verification logic at{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">frontend/lib/citations/verify.ts</code>{' '}
              and{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted">server/src/services/citation-verification.ts</code>{' '}
              (the same shape on both sides).
            </p>
          </div>
        </div>
        <CitationPanel />
      </div>
    </CitationPanelProvider>
  )
}

function buildVerification(
  status: CitationStatus,
  matchedReference?: string,
  error?: string,
) {
  switch (status) {
    case 'verified-skill':
      return { status, matched_reference: matchedReference ?? 'massachusetts-adu/references/dimensional-summary.md' }
    case 'verified-url':
      return { status }
    case 'unverified':
      return { status, error: error ?? 'method1: excerpt_not_in_skill_references; method2: excerpt_not_found' }
    case 'broken':
      return { status, error: error ?? 'url_404' }
    case 'pending':
      return { status }
  }
}
