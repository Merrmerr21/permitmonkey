# PermitMonkey Eval Harness

Skeleton-grade eval harness. Discovers fixtures under `server/evals/fixtures/`, runs each through a `Runner`, scores outputs on citation precision (via the existing `verifyCitation()` service), citation recall against fixture-declared expectations, verdict match, and latency. Writes a JSON report to `server/evals/reports/`.

## Why This Exists

The roadmap's cross-cutting reliability workstream (Week 2 milestone) calls for an eval harness so every skill change is graded automatically. This is the foundation for the citation-precision CI gate (target: ≥98% per the project Non-Negotiable on real citations) and for the public benchmark page in Phase 5.

## Run It

```bash
# from server/
npm run eval                      # mock mode, default canned output
npm run eval -- --mode=agent      # real Agent SDK invocation (requires creds)
npm run eval -- --filter=<id>     # single fixture
npm run eval -- --strict          # exit 1 if precision_p50 < 0.95 or verdict_accuracy < 0.9
```

Test the citation extractor independently:

```bash
npm run eval:test
```

## Fixture Format

Each fixture is a directory under `server/evals/fixtures/<id>/` containing `fixture.json` shaped like:

```json
{
  "id": "boston-approved-01",
  "kind": "corrections-letter",
  "description": "Boston basement-conversion ADU, Mattapan parcel, by-right post-PLAN: Mattapan",
  "input": {
    "prompt": "Review this corrections letter for a Mattapan ADU...",
    "plans_path": "../../../test-assets/ma/boston/approved-01/plans.pdf",
    "correction_letter_path": "../../../test-assets/ma/boston/approved-01/correction-letter.pdf"
  },
  "ground_truth": {
    "expected_verdict": "approved",
    "expected_citations": [
      {
        "authority": "St. 2024, c. 150, §8",
        "source_url": "https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150",
        "must_appear": true
      }
    ],
    "expected_response_topics": ["parking exemption", "owner occupancy"]
  },
  "metadata": {
    "created": "2026-05-04",
    "last_verified": "2026-05-04",
    "domain": "boston"
  }
}
```

The actual plan PDFs and correction letters live under `test-assets/ma/<city>/<fixture-id>/` (creation requires explicit user approval per the root CLAUDE.md non-negotiable).

## Runners

- **`MockRunner`** — returns canned markdown. Used in CI to exercise discover → run → score → report without invoking the Agent SDK. Allows the harness pipeline to be verified independent of credentials.
- **`AgentRunner`** — stubbed at skeleton stage. Wires to `runCorrectionsAnalysis()` in `agents-permitmonkey/src/flows/corrections-analysis.ts` once a Boston fixture exists in `test-assets/ma/boston/`.

## Scoring

| Metric | Definition | Target |
|--------|------------|--------|
| Citation precision | `verifyCitation()` returns `verified=true` over all extracted inline tags | ≥0.98 (project non-negotiable) |
| Citation recall | Fraction of fixture `must_appear=true` citations present in output | ≥0.90 |
| Verdict match | Output verdict string matches `ground_truth.expected_verdict` | ≥0.90 |
| Latency p50 / p95 | Wall-clock per fixture | p95 ≤ 90s (Phase 1 target) |

`verifyCitation()` (in `server/src/services/citation-verification.ts`) tries Method 1 (search the cited excerpt in skill `references/` markdown) before falling back to Method 2 (fetch the canonical URL and search after HTML strip). A citation that fails both is unverified.

## Citation Extractor

`citation-extractor.ts` parses the inline provenance tag format established in `server/skills/boston-adu/SKILL.md`:

```
[source: <URL> | retrieved: <YYYY-MM-DD> | citation: <statute or section>]
```

Each match becomes an `ExtractedCitation`; `toCitation()` adapts it to the existing `Citation` shape consumed by `verifyCitation()`. The extractor pulls the surrounding sentence as `excerpt` so Method 1 can match against skill references.

Legacy CA references in `_legacy/` do not use this format and are out of scope.

## Reports

`server/evals/reports/<timestamp>.json` contains the aggregate report plus per-fixture scores. Schema in `types.ts` (`RunReport`).

Reports are not committed — `.gitignore` covers them. They are uploaded as CI artifacts when the eval workflow runs in GitHub Actions.

## CI

`.github/workflows/evals.yml` runs the citation extractor tests on every push under `server/`. The full eval (mock-mode harness end-to-end) runs as a separate job and uploads the report artifact. Real `--mode=agent` runs are gated by repository secrets and not run on PRs by default.

## Open Items

- Wire `AgentRunner` to `runCorrectionsAnalysis()` once a Boston fixture is approved (see roadmap Phase 1 Friday deliverable: 1 anonymized Boston fixture).
- Add `permitmonkey.eval_runs` Supabase table for historical trend tracking — `score.ts` and `run.ts` are designed to feed this without restructure.
- Add provenance-lint rule (project Lab Notes Week 4 milestone) that scans `references/` directories and rejects any material claim missing an inline tag.
- Extend scoring to include cost-per-fixture and token-budget compliance.

## See Also

- [`server/src/services/citation-verification.ts`](../src/services/citation-verification.ts) — the existing verification service this harness depends on
- [`docs/citation-verification-spec.md`](../../docs/citation-verification-spec.md) — design spec for the verification methods
- [`PLAYBOOK.md`](../../PLAYBOOK.md) — project doctrine, "provenance from day one"
- [`docs/master-ai-playbook.md`](../../docs/master-ai-playbook.md) — general engineering practice
