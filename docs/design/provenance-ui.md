# Provenance UI — Clickable Inline Citations

> Design produced under [`docs/claude-design-prompt.md`](../claude-design-prompt.md). Written 2026-05-04. Status: spec for implementation; no React written yet.

## Design Brief

The Provenance UI is the visual heart of PermitMonkey's "better than the winner" moat. Wherever an agent emits a cited claim, the citation is rendered as a clickable affordance — a small inline pill in the body text that opens a side panel showing verbatim quoted source text, verification status, and a link to the canonical source. A contractor (or the plan checker reviewing the contractor's response) can verify any cited claim in one click without leaving the page. cc-crossbeam doesn't have this; AI permit competitors don't have this; this single component is what makes a PermitMonkey response read as "from a competent paralegal" rather than "from a chatbot." It's load-bearing for the Phase 4 sellability docs and the public benchmark page.

The component lives in the corrections-response viewer at [`frontend/components/results-viewer.tsx`](../../frontend/components/results-viewer.tsx) and any other surface that renders agent markdown output (audit reports, programmatic city pages with cited rules, the eligibility-checker verdict screen).

## Architecture

```
Agent markdown output
        │
        ▼
┌──────────────────────────┐
│ <MarkdownWithCitations>  │   wrapper around react-markdown
│ ─ rehype plugin extracts │   that intercepts the inline
│   [source|retrieved|     │   provenance tag pattern
│    citation] tags        │
│ ─ replaces them with     │
│   <CitationPill /> nodes │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐         on click
│ <CitationPill>           │ ─────────────────────►  ┌───────────────────────┐
│ inline element with      │                         │ <CitationPanel>       │
│ status-colored pill      │                         │ side sheet on desktop │
│                          │                         │ bottom sheet on mobile│
│ shows: short authority + │                         │                       │
│ external-link icon       │                         │ shows: full citation, │
└──────────────────────────┘                         │ verbatim source quote,│
                                                     │ verification status,  │
                                                     │ canonical URL         │
                                                     └───────────────────────┘
```

Data flow:

1. Server-side: agent emits markdown containing inline tags. The eval harness's [`citation-extractor.ts`](../../server/evals/citation-extractor.ts) is the parsing reference; the frontend uses an equivalent rehype plugin (or extracts in the route handler before passing to the client).
2. The route handler (or RSC) calls [`server/src/services/citation-verification.ts`](../../server/src/services/citation-verification.ts)'s `verifyCitation()` for each extracted tag, attaches the result, and ships the markdown + per-citation metadata to the client.
3. Client renders `<MarkdownWithCitations>`, which substitutes each tag with `<CitationPill>` carrying the verification metadata as props.
4. Click opens `<CitationPanel>` from a context store (Zustand or React 19 `use()` with a server-action-fed promise). Panel shows verbatim quoted text from the relevant skill reference file (Method 1 source) or the cached HTML excerpt (Method 2 source).

The panel is a single instance at the page level (mounted once in the layout); pills broadcast to it via context. This avoids re-mounting the panel for every citation and keeps state predictable.

## Layout — Pill (Inline)

```
... per state law cities cannot require owner-occupancy. ┌─ MGL Ch 40A §3 ↗ ─┐
                                                          └────────────────────┘
                                                          ▲
                                                       inline pill,
                                                       button element
```

Pill anatomy: short authority label + external-link icon (16px). Clicking opens the panel; hovering highlights and shows a tooltip with the retrieval date.

The displayed authority is the **short form** of the `citation:` field (e.g., "MGL Ch 40A §3" not "MGL Ch 40A §3 as amended by St. 2024, c. 150, §8"). Use a `formatAuthorityShort()` helper:

```ts
function formatAuthorityShort(authority: string): string {
  // Strip "as amended by ..." trailers
  const cleaned = authority.split(' as amended by ')[0];
  // Truncate after 28 chars with ellipsis
  return cleaned.length > 28 ? cleaned.slice(0, 27) + '…' : cleaned;
}
```

## Layout — Panel (Side Sheet on Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Page content (dimmed 30% when panel open)         │  ┌───────────────┐ │
│                                                   │  │ ✕             │ │
│  ... per state law cities cannot require owner-   │  │               │ │
│  occupancy. [MGL Ch 40A §3 ↗]                     │  │  MGL Ch 40A   │ │
│                                                   │  │  Section 3    │ │
│                                                   │  │  (Playfair    │ │
│                                                   │  │   700, 24px)  │ │
│                                                   │  │               │ │
│                                                   │  │  ┌─────────┐  │ │
│                                                   │  │  │ Verified│  │ │
│                                                   │  │  │ via skill│  │ │
│                                                   │  │  │ reference│  │ │
│                                                   │  │  └─────────┘  │ │
│                                                   │  │               │ │
│                                                   │  │  "No accessory│ │
│                                                   │  │  dwelling unit│ │
│                                                   │  │  shall be     │ │
│                                                   │  │  prohibited..."│ │
│                                                   │  │  (Nunito 400, │ │
│                                                   │  │  serifed quote│ │
│                                                   │  │  treatment)   │ │
│                                                   │  │               │ │
│                                                   │  │  Retrieved    │ │
│                                                   │  │  2026-04-22   │ │
│                                                   │  │               │ │
│                                                   │  │  [View source]│ │
│                                                   │  └───────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

Panel width: `w-[420px]` on desktop, full-width on mobile (transitions to bottom sheet at `md:` breakpoint).

## Component Specs

### `<CitationPill>`

```tsx
type CitationStatus = 'verified-skill' | 'verified-url' | 'unverified' | 'broken';

interface CitationPillProps {
  authority: string;          // e.g., "MGL Ch 40A §3 as amended by St. 2024, c. 150, §8"
  source_url: string;
  retrieved: string;          // YYYY-MM-DD
  excerpt: string;            // surrounding sentence from agent output
  status: CitationStatus;
  matched_reference?: string; // Method 1 source path, when verified-skill
  error?: string;
}
```

Tailwind classes by status:

```tsx
const baseClasses = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-body font-semibold transition-colors duration-200 cursor-pointer';

const statusClasses: Record<CitationStatus, string> = {
  'verified-skill': 'bg-success/10 text-success border border-success/30 hover:bg-success/20',
  'verified-url':   'bg-success/10 text-success border border-success/30 hover:bg-success/20',
  'unverified':     'bg-warning/10 text-warning-foreground border border-warning/30 hover:bg-warning/20',
  'broken':         'bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20',
};
```

Both verified states use the same color but show different copy in the panel ("Verified via skill reference" vs. "Verified via canonical URL fetch") so the contractor can tell whether the citation was checked against a curated knowledge base or a live fetch.

Icon: `lucide-react` `<ExternalLink size={14} className="opacity-60" />` for verified states; `<AlertTriangle size={14} />` for unverified; `<XCircle size={14} />` for broken.

Tooltip on hover: `<Tooltip>` from shadcn, content "Retrieved 2026-04-22 — click to verify source." Mobile users skip the tooltip and tap directly to open the panel.

Accessibility: `<button>` element, not `<a>` (the panel is a dialog, not a page navigation). `aria-label="View citation: ${shortAuthority}, ${statusLabel}"`. Keyboard: tab to focus, Enter/Space to open. Focus ring uses `ring-ring` (moss green).

### `<CitationPanel>`

shadcn primitive: `Sheet` (side variant) on desktop, transitions to bottom sheet at `md:` breakpoint via Tailwind responsive props. Width `w-[420px]`, padding `p-6`.

Header section:
- Status badge (pill, full width, 4px tall): success/warning/destructive matching the pill state
- H2: full citation in Playfair 700, 24px, `tracking-tight`
- Sub-line in Nunito 400 muted-foreground: "Retrieved 2026-04-22"

Body section:
- Verification source line: "Verified via skill reference: `boston-adu/references/transit-parking.md`" (when Method 1) OR "Verified via canonical URL fetch on 2026-04-22" (when Method 2). Nunito 400 14px text-muted-foreground.
- Verbatim quote: blockquote-styled, Nunito 400 16px, with a moss-green left border `border-l-4 border-primary`, padding `pl-4 py-2`, italic. Text-card-foreground.
- If unverified: amber-toned warning block with "This citation could not be verified against the source. The agent emitted it but verifyCitation() failed. Inspect manually before relying on this in a contractor response." Plus a "Report this citation" affordance that opens a mailto: or in-app feedback form.
- If broken: destructive-toned block with the HTTP status code returned and "The canonical URL appears to be unreachable. The cited rule may have been moved or amended."

Footer section:
- `<Button variant="outline" asChild>` containing `<a href={source_url} target="_blank" rel="noopener noreferrer">View source ↗</a>` — opens the canonical URL in a new tab. Pill-shaped to match the broader CTA system: `rounded-full`.
- Below the button: small "Copy citation" affordance that copies the Bluebook-style citation string to clipboard.

Close affordance: `<X />` in top-right corner. Escape key closes. Click-outside closes.

### `<MarkdownWithCitations>`

Wraps `react-markdown` with `remark-gfm`. A custom rehype plugin walks the AST, finds text nodes matching the inline tag pattern, and replaces them with `<CitationPill>` invocations.

Pattern (matches the eval harness extractor):

```ts
const TAG_RE = /\[\s*source:\s*([^|\]]+?)\s*\|\s*retrieved:\s*([^|\]]+?)\s*\|\s*citation:\s*([^\]]+?)\s*\]/g;
```

Verification metadata is supplied via React context — the route handler runs `verifyCitation()` on every extracted tag before rendering, attaches `{status, matched_reference, error}` keyed by raw tag, and `<MarkdownWithCitations>` looks up the metadata when substituting pills.

Rationale: doing verification per-render in the client would mean fetch-on-fetch on every navigation. Verification is bounded by how many distinct tags appear, so the route handler can verify in parallel with `Promise.all()` and pass results down. Cache-friendly via Supabase Realtime channels (subscribe to verification-result updates if a long-running re-verify job is needed).

## Copy

### Pill labels

The pill shows `formatAuthorityShort(citation)` — the short form of the citation field. Examples:

- `"MGL Ch 40A §3 as amended by St. 2024, c. 150, §8"` → **MGL Ch 40A §3**
- `"760 CMR 71.04(2)"` → **760 CMR 71.04(2)**
- `"780 CMR (10th Edition) Section R310"` → **780 CMR R310**
- `"Boston Zoning Code Article 80, Small Project Review threshold"` → **Bos. Zoning Art. 80**

### Panel header

`H2: <full citation>` — the full citation field, no truncation. Playfair 700, 24px.

### Panel verification source line

| Method | Copy |
|---|---|
| `verified-skill` | "Verified against skill reference: `<matched_reference path>`" |
| `verified-url` | "Verified via canonical source fetch on `<retrieved date>`" |
| `unverified` | "Could not verify against skill references or canonical source. See details below." |
| `broken` | "Canonical source returned `<error>`. Cited rule may have moved or been amended." |

### Verbatim quote treatment

Display the verbatim quoted text from the source. Wrap in:

```tsx
<blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-card-foreground font-body">
  {excerpt}
</blockquote>
```

If the quote exceeds 8 lines, truncate visually with a "Show full text" affordance that expands inline (no second modal).

### Footer button labels

- Primary: "View source ↗"
- Secondary: "Copy citation"

Don't say "Read more" or "Learn more" — those are SEO-mill clichés. The contractor already knows this is a legal source.

### Empty / loading states copy

- Loading verification: pill shows skeleton-styled neutral background with `animate-pulse`. No copy. Panel header in loading state: "Verifying citation…" in Nunito 400 muted.
- No citations in agent output (whole-page state, not per-pill): no special UI. The output renders without pills. Don't show a "no citations found" banner — that would imply citations are expected when sometimes they aren't.

## Edge Cases

| Scenario | Handling |
|---|---|
| Verification still in flight when panel opens | Loading skeleton in panel; live-update via Supabase Realtime if verification job is async (>2s). Status is `unverified` until result lands. |
| `verifyCitation()` returned `verified=false` with `excerpt_not_found` (Method 1+2 both failed) | Pill renders amber. Panel shows the verbatim agent-emitted excerpt, the Method 1 + Method 2 errors, and a "Report this citation" affordance. Do NOT hide the citation; transparency is the brand. |
| Canonical URL returns 4xx/5xx | Pill renders destructive (autumn red). Panel shows HTTP status, suggests the rule may have moved, surfaces the matched skill reference if Method 1 succeeded as a fallback. |
| Agent emitted a malformed tag (missing pipe, missing field) | Tag is not extracted → renders as literal text with a small `<AlertCircle />` annotation in dev mode only. Production: tag passes through as plain text, no pill, no error. (The eval harness's `citation-extractor.test.ts` covers malformed-tag tolerance.) |
| Multiple pills in one sentence | All render as separate pills. Click on one opens panel for that citation; clicking another switches the panel content (no panel closing animation between switches — instant content swap with 200ms crossfade). |
| Pill on mobile (< md breakpoint) | Tap opens a bottom sheet (`Sheet` with `side="bottom"`) instead of the right-side panel. Sheet height `60vh` initially, drag-to-expand. |
| Print / PDF export of the response | Pills become inline footnote markers (`¹`, `²`, `³`); the citation list moves to a "Citations" section at the document end with full URLs. The audit report (Phase 4) reuses this print stylesheet. |
| Agent flagged the citation for human review | Pill renders amber with a `<HelpCircle />` icon instead of `<ExternalLink />`. Panel shows "The agent emitted this citation but flagged it for human verification before the contractor relies on it." Plus an in-app "Approve / Reject / Replace" affordance for the firm-tier user. |
| Same citation referenced 5+ times in one document | First occurrence renders as full pill; subsequent occurrences render as a smaller `<sup>` superscript (still clickable, opens same panel). Reduces visual clutter on dense pages. |

## Open Questions

1. **Panel persistence across page navigation.** When a user clicks a pill on the response viewer, then navigates to the audit report tab, should the panel stay open with the same citation? My recommendation: close on route change unless the new route also uses the panel (corrections viewer ↔ audit report). Confirm before implementing.

2. **Verification freshness.** `verifyCitation()` runs on every page render, which is fine for skill-reference lookups (Method 1, ~10ms) but expensive for canonical-URL fetches (Method 2, 200-2000ms). My recommendation: cache Method 2 results in `permitmonkey.citation_verifications` table keyed by `source_url + excerpt_hash + retrieved_date`, with a 24-hour TTL. Expensive verifications run async via the orchestrator. Confirm the table schema lands in a separate migration before this UI ships.

3. **Citation density on the public marketing site.** The corrections-response viewer needs citations on every claim. Marketing pages (programmatic city pages, AEO articles) also have cited claims, but rendering 30+ pills on a single landing page would be visually heavy. My recommendation: marketing pages use a lighter "compact" pill variant (`text-xs px-1.5 py-0`, no border, just colored text + tiny icon), and the panel still works the same way. This is an instance of the same component family but a different visual register. Confirm whether you want one component or two.

## Implementation Phasing

The component family ships in three phases to avoid scope creep:

- **Phase A (Week 5 in current sprint):** `<CitationPill>` and `<CitationPanel>` for the corrections-response viewer only. Verification runs synchronously in the route handler. Method 2 results cached in-memory per request. Just enough to be a hero demo.
- **Phase B (Week 7-8):** Caching to `permitmonkey.citation_verifications` table; async re-verify worker; Realtime updates when a re-verify completes. Compact pill variant for public marketing pages.
- **Phase C (Phase 4 sellability):** Print stylesheet for PDF audit reports; "Approve / Reject / Replace" firm-tier affordance for human-reviewed citations.

Phase A is tractable as a single-session implementation against the existing `verifyCitation()` service and the eval harness's extractor as a reference parser.

## Reference Patterns to Reuse

- [`server/evals/citation-extractor.ts`](../../server/evals/citation-extractor.ts) — the regex pattern and the surrounding-sentence extraction logic. Port directly to the frontend rehype plugin; do NOT reinvent the regex.
- [`server/src/services/citation-verification.ts`](../../server/src/services/citation-verification.ts) — `verifyCitation()`, `verifyMethod1()`, `verifyMethod2()`. The route handler calls these on extracted tags before passing to the client.
- [`frontend/components/results-viewer.tsx`](../../frontend/components/results-viewer.tsx) — the existing component that will host `<MarkdownWithCitations>`. Read it before designing siblings.
- [`docs/DESIGN-BIBLE.md`](../DESIGN-BIBLE.md) — color tokens, shadow values, motion easing. Match exactly.
- shadcn `Sheet`, `Tooltip`, `Button` primitives — use these, do not roll custom.

## Why This Component Wins

A contractor opens a corrections-response from PermitMonkey. The first line says "Per state law, owner-occupancy cannot be required for an ADU." The pill `[MGL Ch 40A §3 ↗]` sits at the end of the sentence in moss green. The contractor clicks it. A side panel slides in showing the verbatim statutory text, the retrieval date, and a "View source ↗" button to the malegislature.gov page. The contractor copies the citation, pastes it into their reply email to the city, and ships.

That sequence — claim, pill, click, verbatim source, paste — is the entire moat. Three clicks to verify versus the alternative ("trust the AI" or "find a lawyer"). cc-crossbeam doesn't have it. SaaS permit competitors don't have it. PermitMonkey has it because the eval harness already grades the citations the UI is surfacing — what's verified in CI is what gets shown to the contractor.
