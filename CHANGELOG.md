# Changelog

All notable changes to **PermitMonkey** are recorded here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project loosely follows [Semantic Versioning](https://semver.org/) (pre-1.0; expect breaking changes between minor entries).

The product is an AI ADU permit assistant for Massachusetts. The MA pivot from a California ADU project (the upstream `mikeOnBreeze/cc-crossbeam` Anthropic Opus 4.6 hackathon winner) is in progress. Entries before 2026-05-03 in this file are backfilled from notable git commits; from 2026-05-04 onward each working session adds an entry.

## How to Update This File

When you finish a working session that ships user-visible, behavioural, or architectural change, add a top-level entry under `## [Unreleased]` (or open a new dated section if a release was cut). Group entries under: `Added`, `Changed`, `Fixed`, `Removed`, `Security`, `Docs`, `Infra`. Reference commit short SHAs (`abc1234`) so the entry stays linkable. One sentence per bullet, written so a non-engineer reading from cold can understand what shipped.

Don't list every commit. List things a reasonable person would want to know about: new flows, new skills, new reference files, regulatory citation changes, eval-harness milestones, breaking architectural decisions, security fixes, documentation that future Claude sessions need to find.

---

## [Unreleased]

### Added

- **Landing page design synthesis** at [`docs/design/landing-stripe-synthesis.html`](docs/design/landing-stripe-synthesis.html) — standalone single-file Tailwind-via-CDN landing page that combines Stripe's structural polish (mesh-gradient hero, stat strip, multi-section feature breakdown, code showcase, sticky CTAs), Magic Dirt v2 design tokens (moss green primary, warm earth gradient, photoreal ADU miniatures, Playfair Display + Nunito), and cc-crossbeam structural DNA (three-flow card layout, "built with Claude" attribution). Reflects the actual MA pivot — replaces the existing landing's CA-era copy ("28 reference files of CA law", "480+ cities supported") with MA-specific positioning. [`docs/design/landing-stripe-synthesis-rationale.md`](docs/design/landing-stripe-synthesis-rationale.md) documents what was kept, what was changed, and the port-to-Next.js plan. (commit pending)
- **`fees-impacts.md`** and **`fire-boston.md`** Boston reference files — bringing Boston deep skill to **9 of 12** reference files. `fees-impacts.md` covers ISD building permit fees (approximate), Article 80 linkage thresholds (single ADU exempt), Boston Inclusionary Development Policy applicability (single ADU exempt), and the impact-fee preemption analysis under the Boston special-act framework. `fire-boston.md` covers BFD plan-review scope, sprinkler triggers (state floor doesn't require IRC R313 in MA, but extension required if primary is sprinklered), apparatus access for rear-of-lot ADUs, fire flow in outer-neighborhood projects, fire separation IRC R302.3 for attached ADUs, and the construction-stage vs. sale-stage layers of MGL Ch 148 §§26F/26F½ smoke and CO alarm requirements. (commit pending)
- **Provenance UI Phase B verification** — server action [`frontend/app/actions/verify-citations.ts`](frontend/app/actions/verify-citations.ts) extracts inline citation tags and runs Method 1 (skill reference lookup) + Method 2 (canonical URL fetch) before the client renders. [`frontend/lib/citations/verify.ts`](frontend/lib/citations/verify.ts) is the frontend port of the server's `verifyCitation()`, with shared error codes so eval-harness scoring and UI verification agree. `results-viewer.tsx` calls the server action when output loads, populating real `verified-skill` / `verified-url` / `unverified` / `broken` statuses on every pill. Falls back to `pending` while in flight, `unverified` if the action throws. (commit pending)
- **`historic-districts.md`** and **`eohlc-compliance.md`** Boston reference files. `historic-districts.md` enumerates all 11 Boston Landmarks Commission districts (Beacon Hill, Back Bay, Bay State Road/Back Bay West, St. Botolph, South End, Bay Village, Mission Hill Triangle, Aberdeen, Fort Point Channel, Highland Park, plus the Charlestown Monument Square study) with designation dates, district types (Landmark District vs. Architectural Conservation District), and the practical implication that Landmarks review is NOT preempted by Ch. 150. `eohlc-compliance.md` documents the open legal question of how Ch. 150 reaches Boston's special-act zoning enabling framework, the two readings in the practitioner community, and the agent's hybrid-reading default for contractor responses. (`e4e7002`)
- **`results-viewer.tsx` wired** to the Provenance UI — replaces `<ReactMarkdown>` with `<MarkdownWithCitations>`, wraps in `<CitationPanelProvider>`, mounts `<CitationPanel>`. Phase A: extract-only, all pills render `unverified` so the contractor knows to click through to the source manually. (`36c9cfd`)
- **Provenance UI Phase A** — clickable inline citation pills and a side-panel viewer for cited claims in agent output ([`frontend/components/citation-pill.tsx`](frontend/components/citation-pill.tsx), [`citation-panel.tsx`](frontend/components/citation-panel.tsx), [`markdown-with-citations.tsx`](frontend/components/markdown-with-citations.tsx)). Five status states: verified via skill reference, verified via canonical URL, unverified, broken source, pending. Demo at `/design-sandbox/citations`. Wires to the existing `verifyCitation()` service from the route handler in a follow-up commit. (`0026920`)
- **Provenance UI design spec** at [`docs/design/provenance-ui.md`](docs/design/provenance-ui.md). (`29f88c7`)
- **Claude design prompt** at [`docs/claude-design-prompt.md`](docs/claude-design-prompt.md) — repo-wide context primer that loads the full project picture (product, ICP, voice, differentiation, design tokens, what to design, what not to design) into a fresh Claude session. (`d6941fb`)
- **Eval harness skeleton** at [`server/evals/`](server/evals/) — discovers fixtures under `server/evals/fixtures/`, runs each through a `Runner` (Mock or Agent), scores citation precision via the existing `verifyCitation()` service, citation recall against fixture-declared expectations, verdict match, and latency. JSON report per run. CI workflow at [`.github/workflows/evals.yml`](.github/workflows/evals.yml). 7/7 unit tests passing for the citation extractor. (`a226a10`)
- **`server/skills/boston-adu/`** — Boston deep-skill scaffold with 5 of 12 reference files: [`zoning-residential.md`](server/skills/boston-adu/references/zoning-residential.md), [`ordinance-adu-rules.md`](server/skills/boston-adu/references/ordinance-adu-rules.md), [`transit-parking.md`](server/skills/boston-adu/references/transit-parking.md) (the MA differentiator — MBTA proximity), [`permit-process.md`](server/skills/boston-adu/references/permit-process.md), [`building-codes.md`](server/skills/boston-adu/references/building-codes.md). All reference files use the new inline provenance tag format `[source: URL | retrieved: DATE | citation: SECTION]`. (`f1897cc`, `0563119`, `01f2bb6`)
- **"Editing Discipline (Karpathy)"** section folded into [`.claude/CLAUDE.md`](.claude/CLAUDE.md) at slot #3 (after Non-Negotiables, before Opus 4.7 Calibration) and mirrored to [`AGENTS.md`](AGENTS.md). Source: `forrestchang/andrej-karpathy-skills`. (`7099d05`)

### Changed

- **Boston ADU implementation framing** corrected throughout `server/skills/boston-adu/`. Boston operates under a special-act zoning enabling framework, not standard MGL Ch 40A. Boston implements Ch. 150 of the Acts of 2024 neighborhood-by-neighborhood through BPDA's "Neighborhood Housing Zoning" initiative — Mattapan adopted Feb 2024; Roslindale, West Roxbury, Hyde Park drafts in progress as of 2026-05-03. Removed five unverified "Article 26A" citations originally projected from generic ADU naming conventions. (`0563119`)
- **780 CMR edition** corrected from 9th to **10th Edition** (effective Oct 2023, IRC 2021 / IBC 2021 base) in four places in [`server/skills/boston-adu/SKILL.md`](server/skills/boston-adu/SKILL.md). Stale "9th ed." originated in [`.claude/skills/ma-city-research/references/boston.md`](.claude/skills/ma-city-research/references/boston.md) (last_verified 2026-04-22) and propagated. The state skill `780-cmr-essentials.md` is the authoritative source. Established a project-wide rule: when state skill and city-research disagree on a state-code fact, trust the state skill. (`01f2bb6`)

### Removed

- Side branch `chore/add-karpathy-claude-md` retired both locally and on `origin`. Content folded into `.claude/CLAUDE.md`. (`7099d05`)

### Docs

- **Lab Notes (`.claude/CLAUDE.md`)** extended with two citation-discipline failures from this session and the corresponding fixes (Article 26A projection, 780 CMR edition propagation). Each Lab Note documents the failure, root cause, fix, and a generalised rule. (`0563119`, `01f2bb6`)

### Infra

- `frontend/package-lock.json` renamed `crossbeam-frontend` → `permitmonkey-frontend` to match `package.json` (leftover from the earlier CA→MA rename). (`0026920`)
- `.gitignore` adds `server/evals/reports/` (eval report artifacts are uploaded as CI artifacts, not committed). (`a226a10`)

---

## [Pre-changelog baseline] — 2026-05-03

This entry collapses commits before this changelog was introduced. The full git log remains the authoritative record; entries below highlight what's load-bearing for future sessions.

### Added (pre-baseline)

- **Week 0 preflight** ([`a807b90`](.)) — repo migrated off OneDrive to `C:\dev\permitmonkey` to escape `node_modules` corruption from sync races. Saved master AI playbook at [`docs/master-ai-playbook.md`](docs/master-ai-playbook.md) (5,681 lines). Added on-demand index skill at [`.claude/skills/ai-playbook-lookup/SKILL.md`](.claude/skills/ai-playbook-lookup/SKILL.md). Scoped [`frontend/CLAUDE.md`](frontend/CLAUDE.md) (Next.js 16 + React 19 + Supabase SSR rules) and [`server/CLAUDE.md`](server/CLAUDE.md) (Cloud Run orchestrator + Vercel Sandbox + cache discipline). Header on [`PLAYBOOK.md`](PLAYBOOK.md) clarifying scope vs. master playbook.
- **MA eligibility checker** + **injection pre-scan** + **citation verification service** ([`7457154`](.)) — `server/src/services/citation-verification.ts` with Method 1 (skill reference cross-check) and Method 2 (canonical URL fetch).
- **MA pivot expansion** ([`c7b9b5f`](.)) — new MA-specific skills, regulatory references for Boston/Cambridge/Somerville/Newton/Brookline, SQL schema, security hardening.
- **Pivot from California to Massachusetts; rebrand to PermitMonkey** ([`28efe94`](.)) — first move off the upstream cc-crossbeam CA codebase. California content retained under `_legacy/` for regression reference.

### Notes

- Project pivots from California to Massachusetts driven by Chapter 150 of the Acts of 2024 (Affordable Homes Act, §§7-8 amending MGL Ch 40A §§1A and 3) — statewide by-right ADUs effective February 2, 2025.
- The upstream repository is [github.com/mikeOnBreeze/cc-crossbeam](https://github.com/mikeOnBreeze/cc-crossbeam) (Michael Brown / @breezwoods, original Anthropic Opus 4.6 hackathon winner). PermitMonkey origin is [github.com/Merrmerr21/permitmonkey](https://github.com/Merrmerr21/permitmonkey).
- The full AI ADU permit-assistant codebase mirrors the upstream's architecture: Next.js 16 + React 19 + shadcn/ui + Tailwind 4 frontend on Vercel; Express 5 orchestrator on Cloud Run; Vercel Sandbox for ephemeral agent runs; Supabase Postgres + Realtime + Storage; Claude Agent SDK + Skills.
