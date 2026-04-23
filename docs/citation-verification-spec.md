# Citation Verification — Spec

> **Purpose:** Enforce zero-tolerance hallucination policy on MALawLookup and the QAReviewer gate. See `.claude/agent-performance.md` and `PLAYBOOK.md` §17.
> **Owner:** MALawLookup (generation), QAReviewer (validation), orchestrator (logging).
> **Status:** SPEC — citation structure defined; automated verification pass pending implementation before MA production launch.

## Why This Matters

Every citation in a response letter is a claim that the contractor is signing. If MALawLookup fabricates a statute section that doesn't exist, or misquotes one that does, the contractor's response letter has a fake citation. A plan checker or attorney could catch this. Reputational and E&O liability follow.

Zero-tolerance policy: a single hallucinated citation disables MALawLookup immediately until manually re-verified. See `.claude/agents/ma-law-lookup.md`.

## The Citation Object

Every citation emitted by MALawLookup or CityCodeLookup has this structure:

```json
{
  "authority": "MGL Ch 40A § 3",
  "amended_by": "St. 2024, c. 150, § 8",
  "subsection": "first paragraph, as amended",
  "source_url": "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3",
  "excerpt": "No zoning ordinance or by-law shall prohibit...",
  "excerpt_type": "direct_quote" | "paraphrase_with_reference",
  "verified": true,
  "verification_method": "canonical_url_fetch",
  "verification_date": "2026-04-22",
  "verifier": "MALawLookup v1.2.0",
  "skill_reference": "massachusetts-adu/references/mgl-40a-section-3.md"
}
```

Every field is required EXCEPT `amended_by` and `subsection` (which are context-dependent).

## Verification Methods

### Method 1 — Skill Reference Lookup (Fastest)

The citation matches a verified excerpt from the `massachusetts-adu` or `ma-city-research` skill's reference files. No network call needed.

**Pros:** fast, deterministic, no external dependency.
**Cons:** relies on skill files being current (quarterly verification required).

**When to use:** primary path for state-level citations.

### Method 2 — Canonical URL Fetch

The citation's `source_url` is fetched, and the `excerpt` is verified to appear verbatim (within tokenization tolerance) on the fetched page.

**Pros:** high confidence; catches skill-file drift.
**Cons:** adds latency and external dependency; mass.gov and malegislature.gov can be slow.

**When to use:**
- Every new MA city bylaw citation (not pre-verified in skill)
- Quarterly re-verification pass on all cached skill citations
- QAReviewer spot-check on high-stakes items

### Method 3 — Verification Agent (Opus advisor)

For ambiguous cases (e.g., a citation to a municipal bylaw section that seems plausible but isn't cached), dispatch a fresh Opus 4.7 verification agent whose only job is to:

1. Fetch the canonical URL
2. Search for the cited section
3. Compare the excerpt against what's found
4. Return a verification verdict with the actual fetched text

**Pros:** handles edge cases, new cities, and ambiguous citations.
**Cons:** most expensive; slow.

**When to use:** when Method 1 fails and Method 2 returns unclear content.

## Verification Gates

### Gate A — MALawLookup / CityCodeLookup Output

Before an agent returns citations to the Planner:

1. For each citation with `verified: true`, run Method 1 (skill reference lookup)
2. If Method 1 cannot confirm, run Method 2 (canonical URL fetch)
3. If Method 2 fails, set `verified: false` and include a `verification_error` field
4. Never return `verified: true` without at least Method 1 or Method 2 confirmation

### Gate B — QAReviewer Final Check

QAReviewer receives all citations emitted during the job. For each citation in the response letter:

1. Check that it has a matching `verified: true` entry from MALawLookup or CityCodeLookup output
2. Check that the URL resolves (HEAD request; expect 2xx)
3. Check that no CA-specific citations appear (HCD, Gov Code §§66310-66342)
4. Check that statute citations have amendment context where relevant (Ch 40A §3 post-Ch 150 always needs amendment reference)

If ANY check fails → REJECT. Package goes back to ResponseWriter.

### Gate C — Post-Delivery Audit Sweep

Daily Routine runs a verification sweep on all citations delivered in the last 24 hours:

- HEAD request on every `source_url` — flag 4xx/5xx as stale
- Quarterly full Method 2 re-verification on every cited excerpt
- Report to admin channel: any stale citations, any pattern of verification failures

## Citation Database

Schema for `citations` table (per `docs/supabase-rls-policies.sql`):

```sql
CREATE TABLE public.citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.runs(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  authority text NOT NULL,
  amended_by text,
  subsection text,
  source_url text NOT NULL,
  excerpt text NOT NULL,
  excerpt_type text CHECK (excerpt_type IN ('direct_quote', 'paraphrase_with_reference')),
  verified boolean NOT NULL DEFAULT false,
  verification_method text,
  verification_date timestamptz,
  verifier text,
  skill_reference text,
  appears_in_response_letter boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_citations_source_url ON public.citations(source_url);
CREATE INDEX idx_citations_job_id ON public.citations(job_id);
CREATE INDEX idx_citations_unverified ON public.citations(verified) WHERE verified = false;
```

Use this database for:
- Job-level audit trails (which citations were cited in response X)
- Pattern detection (is one URL frequently returning unverified status?)
- Retroactive verification sweeps

## Failure Modes

### Mode A — URL resolves but excerpt not found

The citation's URL is live, but the excerpt text isn't present on the page. Possible reasons:
- Statute section was amended or moved
- Excerpt is paraphrase but mislabeled as direct quote
- Wrong section cited

**Action:** mark `verified: false`, add `verification_error: "excerpt_not_found"`. Do not include in response letter.

### Mode B — URL 404s

The citation's URL is dead. Possible reasons:
- Mass.gov restructured (they do this periodically)
- Municipal site migration
- Typo in URL

**Action:** mark `verified: false`, add `verification_error: "url_404"`. Attempt alternate URL construction (e.g., if malegislature.gov URL fails, try the Mass Acts archive). Log for manual follow-up.

### Mode C — Stale Excerpt

Method 1 returns a cached excerpt that no longer matches the live canonical page (e.g., statute was amended, skill file not yet updated).

**Action:** mark `verified: false` on this run; trigger quarterly re-verification sweep to catch system-wide drift; update skill file within 7 days.

## Developer Workflow

### Adding a New Citation to a Skill Reference File

1. Find the canonical URL (malegislature.gov, mass.gov, municipal code site)
2. Copy the exact excerpt text (don't paraphrase unless intentional)
3. Format per the citation schema in `massachusetts-adu/references/` or `ma-city-research/references/`
4. Verify the URL loads and excerpt is present
5. Commit to the skill file
6. Run `docs/scripts/verify-skill-citations.py` (to be implemented) to confirm all citations in the skill verify under Method 2

### Verifying an Untrusted Citation

When MALawLookup encounters a correction citing an authority not in its skill references:

1. Attempt Method 2 (fetch canonical source)
2. If found, return `verified: true` with `verification_method: "canonical_url_fetch"`
3. If not found, return `verified: false` with `verification_error` — Planner escalates to contractor for clarification

## Testing

### Unit Tests

Every citation in `massachusetts-adu/references/` must pass Method 2 verification. Test suite in `server/tests/citation-verification.test.ts` (to be implemented):

```typescript
// Pseudocode
for (const skill of ['massachusetts-adu', 'ma-city-research']) {
  for (const citation of extractCitations(skill)) {
    test(`${citation.authority} verifies via canonical URL`, async () => {
      const result = await verifyMethod2(citation);
      expect(result.verified).toBe(true);
    });
  }
}
```

Run on every PR touching skill reference files.

### Integration Tests

Adversarial citation tests — mock MALawLookup emitting a fabricated citation, verify QAReviewer rejects:

```typescript
// Pseudocode
test('QAReviewer rejects package with unverified citation', async () => {
  const package = mockResponsePackageWith({
    citation: { authority: 'MGL Ch 999 § 9', source_url: '...', verified: false }
  });
  const result = await QAReviewer.review(package);
  expect(result.decision).toBe('reject');
});
```

## Monitoring

Track via weekly performance report (PLAYBOOK.md §26):

- **Verified rate:** % of citations emitted with `verified: true` (target: 100%)
- **Method distribution:** Method 1 vs Method 2 vs Method 3 usage
- **Verification failures per week:** trend; spike = investigate
- **Stale citation incidents:** detected by daily sweep; track to detect mass.gov restructurings

## What Zero-Tolerance Means for MALawLookup

Per `.claude/agents/ma-law-lookup.md`:

> A single hallucinated citation disables this agent immediately.

Enforcement:
- Any citation returned with `verified: true` that later fails verification (QAReviewer, daily sweep, manual report) = immediate agent disable
- Agent JD reviewed; skill reference file updated if the issue was in the source
- Re-enable requires: (a) root-cause fix, (b) full re-verification of all citations in `massachusetts-adu` + `ma-city-research` skills, (c) regression test pass

This is strict on purpose. E&O liability on citations is real.

## Implementation Checklist

Before MA production launch:

- [ ] `citations` table in Supabase (SQL in `docs/supabase-rls-policies.sql`)
- [ ] Method 1 verification function (skill reference cross-check)
- [ ] Method 2 verification function (URL fetch + excerpt presence check)
- [ ] Method 3 verification agent (Opus advisor pattern)
- [ ] Gate A integration in MALawLookup and CityCodeLookup
- [ ] Gate B integration in QAReviewer
- [ ] Daily Routine for post-delivery audit sweep
- [ ] Unit test suite on skill reference files
- [ ] Integration test suite for QAReviewer rejection on unverified citations
- [ ] Performance report integration (verified rate, method distribution)

## Source

- PLAYBOOK.md §17 (zero-tolerance policy)
- `.claude/agents/ma-law-lookup.md`
- `.claude/agents/qa-reviewer.md`
- Security audit 2026-04-22 §7 (MA-specific concerns)
- `massachusetts-adu/SKILL.md` (citation discipline block)

**Last revised:** 2026-04-22
