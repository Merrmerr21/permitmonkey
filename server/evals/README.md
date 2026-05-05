# PermitMonkey Eval Harness

Audit-graded eval harness. Discovers fixtures under `server/evals/fixtures/`, runs each through a `Runner`, scores citation precision (via the existing `verifyCitation()` service), citation recall against fixture-declared expectations, verdict match, and latency. Writes a JSON report to `server/evals/reports/`.

## Why This Exists

Every skill change is graded automatically. The strict CI gate enforces the project's non-negotiable on citation precision: a regression in skill content (renamed file, deleted sentence, drifted authority) fails the build.

## Run It

```bash
# from server/
npm run eval                      # mock mode, default
npm run eval -- --mode=agent      # real Agent SDK invocation (requires creds)
npm run eval -- --filter=<id>     # single fixture
npm run eval -- --strict          # exit 1 if precision_p50 < 0.95 or verdict_accuracy < 0.9
```

Test the citation extractor independently:

```bash
npm run eval:test
```

CI runs `npm run eval -- --strict` on every change under `server/` (see `.github/workflows/evals.yml`).

## Current Fixtures

| FixtureKind          | ID                                          | Tests                                                                  |
|----------------------|---------------------------------------------|------------------------------------------------------------------------|
| `eligibility-check`  | `eligibility-boston-back-bay`               | Flow 2: by-right verdict + citation precision on Back Bay scenario     |
| `corrections-letter` | `corrections-boston-parking-preempted`      | Flow 1: state-preemption response on parking + accept other corrections |
| `plan-review`        | `plan-review-boston-site-plan-deficiencies` | Flow 3: required-element gaps on a site plan                           |
| (skeleton)           | `smoke-mock`                                | Pipeline-only: discover → run → score → report works                   |

All four currently score `precision=1.0 / recall=1.0 / verdict_match=true` in mock mode.

## Fixture Format

Each fixture is a directory under `server/evals/fixtures/<id>/` containing `fixture.json` shaped like:

```json
{
  "id": "eligibility-boston-back-bay",
  "kind": "eligibility-check",
  "description": "Boston Back Bay parcel, attached ADU within 0.5 mi of MBTA...",
  "input": {
    "prompt": "Is this lot eligible?",
    "eligibility": {
      "address": "123 Beacon St, Boston, MA 02116",
      "city": "Boston",
      "lot_size_sqft": 5000,
      "primary_dwelling_sqft": 1800,
      "within_half_mile_transit": true,
      "in_historic_district": true
    }
  },
  "ground_truth": {
    "expected_verdict": "approved",
    "expected_citations": [
      {
        "authority": "MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8",
        "source_url": "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3",
        "must_appear": true
      }
    ]
  },
  "mock_output": "...verbatim quotes from skill files with inline provenance tags...",
  "metadata": {
    "created": "2026-05-04",
    "last_verified": "2026-05-04",
    "domain": "boston-adu-eligibility"
  }
}
```

For Flow 1 / Flow 3 fixtures that need real plan PDFs, the agent inputs reference `test-assets/ma/<city>/<fixture-id>/` (creation requires explicit user approval per the root CLAUDE.md non-negotiable).

## Writing A New Fixture — The Skill-Quoting Pattern

To make Method 1 verification deterministic in CI (no network), `mock_output` must use **verbatim sentences from existing skill reference files**.

Three rules:

1. **Each tagged claim ends with `.` followed by space-then-tag.** The extractor's `precedingSentence()` walks backward from `[` looking for a sentence-end (`.`, `!`, `?` followed by whitespace). If no terminator is found, the entire document up to the tag is treated as the excerpt — Method 1 will fail because that excerpt is too long to match anything verbatim.

2. **The sentence is verbatim from a `.md` file under `server/skills/`.** `verifyMethod1()` walks every `.md` under the skills tree, normalizes (lowercase + collapse whitespace), and looks for the excerpt as a substring. Sentence must be at least 20 characters after normalization.

3. **The tag's `source` URL is canonical (mass.gov, malegislature.gov, etc.) — not a skill-file path.** Method 1 uses the excerpt; Method 2 uses the URL. Public-facing pills link to the canonical URL.

Example:

```markdown
This is the legal definition that every municipal bylaw must now work from. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §7]
```

The sentence "This is the legal definition that every municipal bylaw must now work from." appears verbatim in `server/skills/massachusetts-adu/references/chapter-150-of-2024.md`. Method 1 verifies; Method 2 isn't reached.

To find quotable sentences:

```bash
grep -n "^[A-Z].*\.$" server/skills/<skill>/references/*.md
```

Hits with bold prefixes like `**Visual identification:**` are quotable if you take only the part after the prefix.

## Runners

- **`MockRunner`** — returns canned markdown. If the fixture defines `mock_output`, that string is used; otherwise falls back to the constructor's default canned markdown. Used in CI to exercise discover → run → score → report without invoking the Agent SDK.
- **`AgentRunner`** — spawns `agents-permitmonkey/src/cli.ts` as a Node subprocess. The CLI dispatches by fixture kind: `eligibility-check` → `runMAEligibility`. `corrections-letter` and `plan-review` return clean not-implemented errors pending real PDF test assets. Cross-package coupling is runtime-only — server keeps zero compile-time dependency on `agents-permitmonkey/`. Requires `npm install` in `agents-permitmonkey/` and `ANTHROPIC_API_KEY` in env.

## Scoring

| Metric                 | Definition                                                                                | Strict gate target |
|------------------------|-------------------------------------------------------------------------------------------|--------------------|
| Citation precision_p50 | `verifyCitation()` returns `verified=true` over all extracted inline tags                 | ≥0.95              |
| Citation recall_p50    | Fraction of fixture `must_appear=true` citations present in output                        | (informational)    |
| Verdict accuracy       | Output verdict string matches `ground_truth.expected_verdict`                             | ≥0.90              |
| Latency p50 / p95      | Wall-clock per fixture                                                                    | (informational)    |

`verifyCitation()` (in `server/src/services/citation-verification.ts`) tries Method 1 (search the cited excerpt in skill `references/` markdown) before falling back to Method 2 (fetch the canonical URL and search after HTML strip). A citation that fails both is unverified.

## Citation Extractor

`citation-extractor.ts` parses the inline provenance tag format:

```
[source: <URL> | retrieved: <YYYY-MM-DD> | citation: <statute or section>]
```

Each match becomes an `ExtractedCitation`; `toCitation()` adapts it to the existing `Citation` shape consumed by `verifyCitation()`. The extractor pulls the **preceding sentence** (the most recent `.` / `!` / `?` followed by whitespace) as `excerpt` so Method 1 can match against skill references.

Legacy CA references in `_legacy/` do not use this format and are out of scope.

## Reports

`server/evals/reports/<timestamp>.json` contains the aggregate report plus per-fixture scores. Schema in `types.ts` (`RunReport`).

Reports are not committed — `.gitignore` covers them. They are uploaded as CI artifacts when the eval workflow runs in GitHub Actions.

## CI

`.github/workflows/evals.yml` runs:
- `extractor-tests` — `node:test` cases for the citation extractor (always; ~2s)
- `harness-mock` — `npm run eval -- --strict` on the four mock fixtures (always; ~1s)
- `provenance-lint` — warn-only scan of skill markdown for missing inline tags

Real `--mode=agent` runs are gated by repository secrets and not run on PRs by default.

## See Also

- [`server/src/services/citation-verification.ts`](../src/services/citation-verification.ts) — the verification service this harness depends on
- [`docs/citation-verification-spec.md`](../../docs/citation-verification-spec.md) — design spec for the verification methods
- [`agents-permitmonkey/src/cli.ts`](../../agents-permitmonkey/src/cli.ts) — agent-mode CLI dispatcher
