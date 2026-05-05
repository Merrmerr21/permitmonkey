# PermitMonkey Master Playbook — V2.0 (MA Edition, Post-Pivot)

> **Scope:** Project-specific operating doctrine for PermitMonkey. The universal Claude Code operating manual (context discipline, sub-agent topology, prompt-cache rules, eval pipelines, distribution patterns, the V1.2 production engineering additions) lives at [`docs/master-ai-playbook.md`](docs/master-ai-playbook.md) and is referenced throughout this document by section number (e.g. master §225 means the master playbook's section 225). On-demand index of the master at [`.claude/skills/ai-playbook-lookup/SKILL.md`](.claude/skills/ai-playbook-lookup/SKILL.md).

**What this document is:** The operating doctrine for shipping PermitMonkey as the Massachusetts ADU permit assistant. Anchored to shipped infrastructure, not aspirational strategy.

**What it isn't:** A technical spec (see [`docs/spec.md`](docs/spec.md)), a roadmap timeline (see [`docs/schedule-permitmonkey.md`](docs/schedule-permitmonkey.md)), a pitch deck, or the universal Claude Code manual. This is the project layer; the master is the universal layer.

**V2.0 changes vs V1.0.** The original V1.0 was strategy written before the build. V2.0 is doctrine grounded in what's shipped (32 commits ahead of `main` on `chore/week-0-preflight` as of 2026-05-05). Outdated forward-looking sections are now retrospective. Stale citations (the "Article 26A" projection that violated Lab Note #2; the "780 CMR 9th Edition" reference that violated Lab Note #4) are removed. The four Lab Notes from `.claude/CLAUDE.md` are promoted into Appendix C. The V1.2 production engineering patterns from the master (§211–§234) get a project-specific cross-reference table in Appendix D.

---

## STRATEGIC CONTEXT — WHY MA, WHY NOW

**The regulatory shift.** Massachusetts passed **Chapter 150 of the Acts of 2024** (the Affordable Homes Act) on August 6, 2024. Sections 7 and 8 amended MGL Ch 40A §§1A and 3 to make ADUs allowed by-right in single-family residential zoning districts statewide. EOHLC issued implementing regulation **760 CMR 71.00 "Protected Use Accessory Dwelling Units"** (published in the Massachusetts Register January 31, 2025). Law effective **February 2, 2025**. Max 900 sq ft or 50% of primary dwelling's gross floor area, whichever is less. No owner-occupancy requirement. Max 1 parking space; zero if within 0.5 mi of commuter rail, subway, ferry, or bus station. Cities retain authority over dimensional standards (setbacks, bulk, height) and can prohibit short-term rental of ADUs, but cannot prohibit the use itself, require a special permit for the first ADU, or impose owner-occupancy.

**Why this changes the market.** California's ADU market is saturated and hostile to new tools. Massachusetts is fifteen months into statewide by-right with no entrenched permit-assist tool. Contractors, architects, and homeowners are all learning the new rules simultaneously. That's a distribution opportunity (covered in §27–§32) and a content opportunity (AEO on "MA ADU law [city]" queries has low competition).

**Why Merritt should own this.** Boston-based. Studying MA real estate license. CRE analyst at JLL — understands permitting, code, professional standards. Network is MA-weighted. Every advantage points east.

**The MA differentiation thesis.** State law preempts USE; locality reserves FORM. Every contractor-facing output threads that needle and cites the controlling provision with a verifiable URL. The inline provenance tag format (master §225) is the moat: every material claim links to a canonical source, every citation is programmatically verified before render, and any drift in skill content fails the strict CI gate. Cite, don't assert. Verify, don't claim.

---

## TABLE OF CONTENTS

**Part 1 — Foundation**
1. Project Snapshot
2. MA Regulatory Primer
3. Pivot Diff — What Stays, What Changed

**Part 2 — What's Built (Infrastructure Inventory)**
4. Architecture Lockdown
5. Skills Landed
6. The Deep Agents
7. The Eval Harness
8. The Provenance UI
9. The Frontend

**Part 3 — Operating Principles (Project Layer)**
10. Local CLAUDE.md and the Karpathy Guardrails
11. Effort Levels for PermitMonkey Workloads
12. The Five After-Turn Options (Project Application)
13. Skills vs MCPs (Project Stack)
14. Workspace Hygiene (Cadence)

**Part 4 — Core Disciplines (V1.2 Patterns Applied)**
15. Provenance from Day One (master §225)
16. Reference-Don't-Embed Skill Architecture (master §212)
17. Deterministic Infrastructure + LLM Reasoning Split (master §222)
18. Model-Stage Matching (master §223)
19. Ground-Truth Evaluation Pipelines (master §224)
20. Cache-Prefix Discipline (master §217)
21. Plan Mode is a Tool, Not a Tool Swap (master §220)
22. Three-Tier Code Review (master §232)
23. The Trainee-Developer Mental Model (master §233)

**Part 5 — PermitMonkey Architecture**
24. The Three Flows
25. Orchestrator → Subagent Pattern
26. Agent Roster — JDs + Three-Strike Policy
27. Skills Registry (Current State)

**Part 6 — Reliability, Security, Cost**
28. Pre-Deploy Security Audit
29. Cost Controls
30. Monitoring

**Part 7 — Distribution & Market**
31. ICP for MA
32. Free-Tool Funnel
33. MCP Server as Distribution
34. AEO on MA ADU Queries
35. Content Repurposing Engine
36. Viral Artifacts

**Part 8 — Operations**
37. Cadence
38. Roadmap (Status as of 2026-05-05)
39. Pivot Triggers

**Appendices**
- A. Claude Design for PermitMonkey
- B. Slash Command Cheat Sheet
- C. Lab Notes — What Not To Do
- D. V1.2 Master Playbook Cross-Reference

---

# PART 1 — FOUNDATION

## 1. Project Snapshot

- **Product name:** PermitMonkey (engineering codename: permitmonkey)
- **Category:** AI-powered ADU permit assistant for Massachusetts
- **Origin:** Fork of `mikeOnBreeze/cc-crossbeam` (Anthropic "Built with Opus 4.6" Hackathon, Feb 2026 winner). The CA-era code is preserved at [`_legacy/`](_legacy/) for regression reference.
- **Three flows:**
  1. **Corrections Letter Interpreter** (primary, production) — plans + corrections → response package
  2. **Permit Checklist Generator** (free tool, lead magnet) — address + project basics → pre-submission checklist
  3. **City Pre-Screening** (roadmap, Flow 3) — cities upload submissions, agent triages before human plan check
- **Runtime stack:** Next.js 16 frontend (Vercel) → Express 5 orchestrator (Cloud Run) → Vercel Sandbox per-job execution → Claude Agent SDK with `claude_code` preset → state in Supabase, Realtime push to frontend.
- **Models:** Opus 4.7 for synthesis (Planner, ResponseWriter, QAReviewer, the verifier in `MAEligibilityAgent`); Sonnet 4.6 for research and routine throughput; Haiku 4.5 for classification/extraction.
- **Branch state (2026-05-05):** `chore/week-0-preflight` is 32 commits ahead of `main`. Strict CI gate is green across 6 audit-graded eval fixtures + 38 unit tests.

## 2. MA Regulatory Primer

*Engineering-level context, not legal advice. Every citation lands on a reference file in the `massachusetts-adu` or `boston-adu` skill.*

**Statute layer (state):**
- **MGL Ch 40A** — Zoning Enabling Act
- **MGL Ch 40A §1A** — Definitions (amended by St. 2024, c. 150, §7 to add "accessory dwelling unit")
- **MGL Ch 40A §3** — Uses and structures permitted (amended by St. 2024, c. 150, §8 to establish by-right ADUs)
- **760 CMR 71.00** — EOHLC regulation implementing the ADU provisions ("Protected Use Accessory Dwelling Units"); published in MA Register Jan 31, 2025; effective Feb 2, 2025
- Encoded thresholds: 900 sq ft OR 50% of primary dwelling's gross floor area (lesser); no owner-occupancy requirement; max 1 parking space; zero within 0.5 mi of commuter rail / subway / ferry / bus station; dimensional regulation reserved to localities; cities may restrict or prohibit short-term rental; single ADU is by-right; additional ADUs require special permit

**Building code layer (state):**
- **780 CMR — Massachusetts State Building Code, 10th Edition** (effective Oct 2023, IRC 2021 / IBC 2021 base with MA amendments). *Per Lab Note #4: do not cite "9th edition." 10th is current. The state skill `780-cmr-essentials.md` is the authoritative source for state-code edition facts.*
- **521 CMR** — Architectural Access Board regulations (accessibility; MAAB scoping for ADUs covered in `massachusetts-adu/references/accessibility-521-cmr.md`)
- **527 CMR** — Fire prevention (covered in `massachusetts-adu/references/fire-prevention-527-cmr.md`)
- **248 CMR** — Plumbing and gas fitting (covered in `massachusetts-adu/references/plumbing-248-cmr.md`)
- **225 CMR 22** — Energy Code (Base / Stretch / Specialized Opt-In tiers; covered in `massachusetts-adu/references/stretch-energy-code-225-cmr-22.md`)

**Agency layer:**
- **EOHLC** (Executive Office of Housing and Livable Communities) — issues ADU guidance, successor to DHCD
- **DOER** (Department of Energy Resources) — energy code compliance
- **Board of Building Regulations and Standards (BBRS)** — building code interpretations
- **Local Building Department** — plan check, permit issuance, inspection (351 cities/towns)
- **Local Zoning Board of Appeals (ZBA)** — only relevant if ADU exceeds dimensional bylaws

**Local layer (priority cities; per-city skill content under `boston-adu/references/` for Boston, `ma-city-research/references/` for the others):**

- **Boston** operates under a special-act zoning enabling framework, not standard MGL Ch 40A. ADU implementation is rolling out **per-neighborhood** through BPDA's Neighborhood Housing Zoning initiative — **PLAN: Mattapan adopted Feb 2024**; Roslindale, West Roxbury, Hyde Park drafts in progress as of 2026-05-03. *Per Lab Note #3: do not project article numbers from generic ADU naming conventions; verify against Municode (browser-only, JS-rendered) before citing any specific Boston Zoning Code article.* Boston Planning & Development Agency (BPDA) handles design review; Inspectional Services Department (ISD) issues permits; Zoning Board of Appeal (ZBA) hears variances.
- **Cambridge** — Cambridge Zoning Ordinance, Section 4.22
- **Somerville** — Somerville Zoning Ordinance, Section 9.2
- **Newton** — Newton Zoning Ordinance, Section 3.4
- **Brookline** — Brookline Zoning By-Law, §4.07

**Pattern.** State law establishes the right; local bylaws regulate the form. Every correction item the agent responds to must reason across both layers and cite the controlling provision in each.

## 3. Pivot Diff — What Stays, What Changed

**Stayed unchanged from the CA-era v1:**
- Architecture (Next.js + Cloud Run + Vercel Sandbox + Supabase + Agent SDK)
- The three flows (Corrections, Checklist, Pre-Screening)
- Orchestrator → subagent handoff contract
- Skills-first design pattern
- PDF vision pipeline (plans extraction)
- Realtime status push via Supabase channels
- Test-asset discipline (real permits, anonymized, signed consent)
- Security model (per-job sandbox, ephemeral filesystem)

**Changed from CA → MA (✅ shipped, status as of 2026-05-05):**

| Change | Status | Commit |
|---|---|---|
| Retire California ADU skill to `_legacy/` | ✅ shipped | `28efe94` |
| Build `massachusetts-adu` skill (state layer) | ✅ shipped at 12/12 references | `1758448` (last 4 of 12) |
| Build `boston-adu` skill (city layer, the deep moat) | ✅ shipped at 12/12 references | `dc7e691` (final ref) |
| `ma-city-research` skill (Boston, Cambridge, Somerville, Newton, Brookline) | ✅ five cities covered | (pre-pivot inventory) |
| `adu-eligibility-checker` skill (free-tool backing) | ✅ deterministic fast path live | (pre-pivot inventory) |
| `adu-plan-review` skill (5 sheet-type checklists for Flow 3) | ✅ shipped | `befeb76` |
| Marketing copy MA-pivoted (landing, eligibility, projects) | ✅ shipped | `3c68be2` |
| Test assets sourced from MA permits | ⏳ pending user approval (test-assets is a non-negotiable per [`.claude/CLAUDE.md`](.claude/CLAUDE.md)) | — |

**Net effort spent on the pivot:** approximately two weeks of focused work between Phase 1 (Boston deep skill, Apr 22 → May 3) and Phase 2 (eligibility agent, plan-review checklists, eval harness, May 4 → May 5).

---

# PART 2 — WHAT'S BUILT (INFRASTRUCTURE INVENTORY)

The infrastructure that exists today, anchored to commit hashes. This section is the source of truth for "what does the project actually do" — every later section refers back to these artifacts.

## 4. Architecture Lockdown

The four-tier production stack is in place:

- **Frontend.** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + Supabase SSR. Routes: `/` (landing, MA-pivoted Stripe synthesis per commit `3c68be2`), `/eligibility` (free tool), `/projects` (corrections-flow dashboard), `/design-sandbox/citations` (Provenance UI states demo).
- **Orchestrator.** Express 5 on Cloud Run for 10–30 minute agent runtimes (serverless functions time out before completion). Validates every request body with zod schemas.
- **Agent runtime.** Vercel Sandbox per-job (ephemeral, no shared filesystem across runs). Claude Agent SDK with `claude_code` preset. Sub-agent dispatch via the orchestrator-subagent pattern (master §9C).
- **State.** Supabase (Postgres + Realtime + Storage). RLS on every table that holds contractor-uploaded content.

Constraints written into [`.claude/CLAUDE.md`](.claude/CLAUDE.md) and never to be violated:
- No serverless functions for agent work (timeouts before completion)
- No polling patterns (Supabase Realtime is wired)
- No shared state across sandbox runs (ephemeral by design)
- No service-role key in frontend code (security baseline)

## 5. Skills Landed

Skills are organized into a four-tier topology. Each skill is at `server/skills/<name>/` (audit-grade source) with a Code-side mirror at `.claude/skills/<name>/` (used by IDE sessions).

**State layer — `massachusetts-adu` (12 of 12 reference files, all with inline provenance tags).**
- `chapter-150-of-2024.md`, `mgl-40a-section-3.md`, `760-cmr-71-protected-use-adu.md`, `780-cmr-essentials.md`, `eohlc-guidance.md`, `dimensional-summary.md`, `thresholds-quick-ref.md`, `conflicts-and-preemption.md`, `stretch-energy-code-225-cmr-22.md`, `fire-prevention-527-cmr.md`, `accessibility-521-cmr.md`, `plumbing-248-cmr.md`. The last four landed in commit `1758448`, closing the deferred Phase 1 deliverable.

**City layer — `boston-adu` (12 of 12 reference files; the differentiated moat).**
- `building-codes.md`, `context-housing-150-2024.md`, `energy-stretch-code.md`, `eohlc-compliance.md`, `fees-impacts.md`, `fire-boston.md`, `historic-districts.md`, `ordinance-adu-rules.md`, `ordinance-adu-standards.md`, `permit-process.md`, `transit-parking.md` (the MA differentiator — MBTA proximity workflow), `zoning-residential.md`. The final reference (`ordinance-adu-standards.md`) is honest about Municode-blocked verification: state-floor items are tagged with verifiable canonical URLs; per-neighborhood Article values are explicitly marked TBD per Lab Note #3.

**Plan-review layer — `adu-plan-review` (5 sheet-type checklists, commit `befeb76`).**
- `checklist-cover.md`, `checklist-site-plan.md`, `checklist-floor-plan.md`, `checklist-elevations.md`, `checklist-structural.md`, `checklist-mep-energy.md`. Each checklist gives the city-pre-screening agent line-item required elements with code citations, common deficiencies, confidence calibration, and a quick-review decision tree.

**Operational and routing skills.**
- `ma-city-research` (three-mode discovery / fetch / browser-fallback for MA municipalities)
- `ma-corrections-interpreter` (workflow skill for the corrections multi-step)
- `permitmonkey-ops` (operator skill — how to run the deployed system)
- `pdf-extraction` (plan sheet vision)
- `permit-response-writer` (professional response letter patterns)
- `adu-eligibility-checker` (free-tool backing skill; deterministic at `frontend/lib/eligibility.ts`)
- `ai-playbook-lookup` (on-demand router into the master playbook)

**Retired (kept in `_legacy/` for regression reference, not active):** `california-adu`, `adu-city-research` (CA variant). Per Lab Note #2's discipline, retiring is "move, don't delete" — historical context survives.

## 6. The Deep Agents

**MA Eligibility Agent (Generator-Verifier pair) at [`agents-permitmonkey/src/flows/ma-eligibility.ts`](agents-permitmonkey/src/flows/ma-eligibility.ts) (commit `ed1d640`).** Two-pass pattern:

- **Generator (Sonnet 4.6).** Invokes `adu-eligibility-checker` + `massachusetts-adu` + `ma-city-research` (or `boston-adu` when city is Boston). Produces `eligibility_verdict.json` with the eligibility skill's output contract plus an inline `citations` array (each carrying claim + source URL + retrieved date + citation reference).
- **Verifier (Opus 4.7).** Audits every citation. Method 1 walks `server/skills/**/*.md` looking for the cited excerpt verbatim. Method 2 fetches the canonical URL and looks for the excerpt after HTML strip. Writes `eligibility_verified.json` (status per citation: verified-skill / verified-url / unverified / broken) + `eligibility_summary.md` (human-readable).

The flow uses two `query()` calls in sequence with `skipVerifier` available for fast-path development. This is the master §223 (model-stage matching) and master §218 (cache-safe forking) patterns made concrete.

**Other production flows in [`agents-permitmonkey/src/flows/`](agents-permitmonkey/src/flows/):**
- `corrections-analysis.ts` — Skill 1 (parse + research + categorize + questions); produces 8 JSON files in the session directory
- `corrections-response.ts` — Skill 2 (response letter, professional scope, corrections report, sheet annotations)
- `plan-review.ts` — Flow 3 city pre-screening; single-invocation through all 5 phases (extract → review → compliance → corrections letter)

## 7. The Eval Harness

The audit-grade eval harness at [`server/evals/`](server/evals/) is a six-fixture pipeline that runs on every commit. Strict CI gate fails on `citation_precision_p50 < 0.95` or `verdict_accuracy < 0.9`.

**Eval matrix (all six green at 1.0/1.0/✓ as of 2026-05-05):**

| FixtureKind | Fixture ID | Pins skill content from |
|---|---|---|
| `eligibility-check` | `eligibility-boston-back-bay` | `chapter-150-of-2024.md`, `760-cmr-71-protected-use-adu.md`, `transit-parking.md` |
| `corrections-letter` (dispute) | `corrections-boston-parking-preempted` | `chapter-150-of-2024.md`, `conflicts-and-preemption.md`, `transit-parking.md` |
| `corrections-letter` (accept) | `corrections-boston-multi-system` | `stretch-energy-code-225-cmr-22.md`, `fire-prevention-527-cmr.md`, `plumbing-248-cmr.md` |
| `corrections-letter` (out-of-scope) | `corrections-boston-accessibility-out-of-scope` | `accessibility-521-cmr.md` |
| `plan-review` | `plan-review-boston-site-plan-deficiencies` | `checklist-site-plan.md`, `conflicts-and-preemption.md` |
| skeleton | `smoke-mock` | `chapter-150-of-2024.md` |

**Pattern.** Each fixture's `mock_output` quotes verbatim sentences from real skill reference files. Method 1 verification (deterministic file walk) succeeds against those quotes — no network needed in CI. Drift in any quoted sentence (renamed file, edited paragraph, deleted reference) fails the strict gate.

**The runner topology.** `MockRunner` returns the fixture's canned markdown (or constructor default). `AgentRunner` (commit `8300a2d`) spawns [`agents-permitmonkey/src/cli.ts`](agents-permitmonkey/src/cli.ts) as a Node subprocess, dispatches by fixture kind (`eligibility-check` → `runMAEligibility`, others return clean not-implemented errors pending PDF test assets), captures stdout/stderr, surfaces failures cleanly into `agent_errors`. Cross-package coupling is runtime-only — server keeps zero compile-time dependency on `agents-permitmonkey/`.

**Test surface.** 38 unit tests across three suites: citation extractor (7), citation verifier (10, extended in commit `89410a2`), injection prescan (6), frontend eligibility logic (15, extended in commit `ac9b376`). All wired to CI via `.github/workflows/evals.yml` + `.github/workflows/frontend-tests.yml`.

## 8. The Provenance UI

The user-facing surface for the moat. Lives at [`frontend/components/`](frontend/components/) and [`frontend/lib/citations/`](frontend/lib/citations/).

**Phase A (commit `0026920`).** Inline citation pills + side-panel viewer. Five status states: `verified-skill`, `verified-url`, `unverified`, `broken`, `pending`. Components: `citation-pill.tsx`, `citation-panel.tsx`, `citation-panel-context.tsx`, `markdown-with-citations.tsx`.

**Phase B (commit `238fd80`).** Server-action verification. [`frontend/app/actions/verify-citations.ts`](frontend/app/actions/verify-citations.ts) extracts inline citation tags via the same TAG_RE used in the eval harness, runs Method 1 (skill-reference lookup over `server/skills/**/*.md`) and Method 2 (canonical URL fetch with `AbortSignal.timeout(5000)`) before the client renders. Production wiring landed in commit `0e98b9c` via `outputFileTracingIncludes` in `next.config.ts` so `server/skills/**/*.md` is bundled into the deployed Vercel function.

**Visual-review pass (commit `8cddfa7`).** Uncovered a real bug during browser testing: `remark-gfm` was auto-linking bare URLs inside the citation tag, fragmenting `[source: <URL> | ... ]` across text + `<a>` + text nodes so the post-render regex couldn't match. Fix: substitute tags with opaque ASCII placeholders (`xCITxOPENx{N}xCITxCLOSEx`) BEFORE handing the markdown to ReactMarkdown, then walk the rendered tree replacing placeholders with `<CitationPill>`. Verified 5/5 pills render correctly with no raw-tag leakage.

**Demo route.** `/design-sandbox/citations` renders the five states as five labeled rows — one per state, each with its own header (label + blurb) and a focused demo paragraph. Status legend at top with color-coded dots. Used for design review and component regression detection.

## 9. The Frontend

**Landing (`frontend/app/page.tsx`, commit `3c68be2`, polished `8cddfa7`).** MA-pivoted Stripe-synthesis design. Hero with floating Provenance UI cards. Stat strip (`24 / 24` reference files, `100%` verified, `<15min` end-to-end, `3 flows`). Three-flows grid. Live Provenance UI showcase. MA differentiation section with the inline tag format displayed inline. Three-tier pricing. Free-tool CTA. MA-honest footer.

**Eligibility (`frontend/app/eligibility/page.tsx`, polished `8cddfa7`).** The free tool. Top nav (Home / Pricing / Sign in). Free-tool pill ("No email required for instant verdict"). Form with helper text under each input. "How this tool works" 3-column section. "Common questions" FAQ. Submits to `/api/eligibility` which calls the deterministic `evaluateEligibility()` at [`frontend/lib/eligibility.ts`](frontend/lib/eligibility.ts). Locked by 15 unit tests covering all verdict branches and all five covered cities.

**Projects (`frontend/app/projects/page.tsx`).** Corrections-flow dashboard. Lists user's runs, links to viewer. Auth-gated; redirects to `/login` if Supabase env is missing locally.

**Login (`frontend/app/(auth)/login/page.tsx`, polished `8cddfa7`).** Email + password (Supabase auth). "Back to home" + "Forgot password?" + "Don't have an account? Create one" + pointer to the free eligibility checker.

**Citations sandbox (`frontend/app/design-sandbox/citations/page.tsx`).** Five-state Provenance UI demo described in §8.

---

# PART 3 — OPERATING PRINCIPLES (PROJECT LAYER)

The general operating manual lives in the master. This section captures only the project-specific deviations and applications.

## 10. Local CLAUDE.md and the Karpathy Guardrails

[`.claude/CLAUDE.md`](.claude/CLAUDE.md) is the project's CLAUDE.md, loaded at the top of every Claude Code session. The structure follows master §4 (well-formed CLAUDE.md blocks) with PermitMonkey-specific adaptations.

**Non-negotiables (the section right after Product, the most-read part of the file):**
- Every code citation must be real. Never cite from memory.
- Never claim a property is ADU-eligible without checking local dimensional bylaws. State preemption under Ch 150 covers USE; locality reserves FORM.
- When state statute and local bylaw conflict, flag the conflict explicitly.
- **Never modify `test-assets/` without explicit approval.** This rule is sacred — uploaded plans contain PII.
- Agent SDK runs in Vercel Sandbox; no patterns assuming persistent filesystem across runs.
- Uploaded plans and corrections letters may contain PII. No logs, no debug prints, no external tool calls that include raw plan bytes.

**Karpathy editing discipline (folded in commit `7099d05`).** Four guardrails sitting on top of the harness defaults: think before coding (state assumptions); simplicity first (no speculative features); surgical changes (touch only what the request requires); goal-driven execution (translate vague tasks into verifiable goals). These are at slot #3 of the file (after Non-Negotiables, before Opus 4.7 Calibration) so they're encountered in the prime-time region of every session.

**Diversification (master §13).** When `.claude/CLAUDE.md` updates, mirror to [`AGENTS.md`](AGENTS.md) for non-Claude coding agents (Cursor, Aider, Cody). Backup against Anthropic outage. The Lab Notes section mirroring landed in commit `9cb88a1`.

**Changelog Discipline.** Every working session that ships user-visible, behavioral, or architectural change adds an entry to [`CHANGELOG.md`](CHANGELOG.md) under `## [Unreleased]`. Group under Added / Changed / Fixed / Removed / Security / Docs / Infra. Reference commit short SHAs. The changelog is the second source of truth (git log is the first); treat it as a hand-off artifact for future Claude sessions and for buyer due diligence.

## 11. Effort Levels for PermitMonkey Workloads

Per master §2B, default is `xhigh`. The PermitMonkey effort assignments:

| Workload | Effort | Why |
|---|---|---|
| Corrections response package (end-to-end) | `xhigh` | Synthesis across plans + letter + code; client-facing output |
| Single correction-item resolution | `xhigh` | Accuracy matters; few tokens per item relative to stakes |
| MA Eligibility Agent verifier pass | `xhigh` (Opus) | Citation audit is the moat |
| MA Eligibility Agent generator pass | `medium` (Sonnet) | Bounded structured output; cost-sensitive at scale |
| City research skill runs | `medium` | Bounded web scrape + structured extraction |
| PDF plan extraction (vision) | `medium` | Vision pass doesn't benefit from max thinking |
| Test-asset benchmarking | `max` | High-value gate before shipping any skill change |
| Marketing copy drafting | `medium` | Voice matters less than iteration speed |
| Commit message / doc writing | `low` | Don't spend Opus on prose |

For long autonomous runs, prefer one well-specified turn at `xhigh` over many turns. Each user turn on Opus 4.7 adds reasoning overhead; minimizing turns beats lowering effort.

## 12. The Five After-Turn Options (Project Application)

Master §8 names the five options after any Claude turn. The PermitMonkey applications:

- **Continue** — when iterating on the same skill file, same agent flow, same component
- **`/rewind`** — when the agent went down a wrong path on a citation; the rewind preserves useful skill reads while dropping the bad branch (Lab Note #3 origin: rewinding the "Article 26A" projection would have prevented five identical citation errors)
- **`/compact <hint>`** — mid-task in a long debugging session; always include direction (`/compact preserve all skill reference paths and verifier method signatures`)
- **`/clear`** — when switching from skill authoring to UI work; brief from a session handoff doc per master §74
- **Subagent** — when the next step generates lots of tool noise (PDF extraction, web scraping multiple cities) but only the conclusion matters

## 13. Skills vs MCPs (Project Stack)

Per master §10, skills load on-demand at ~60 tokens; MCPs load always at 1–5K+. The project stack is deliberately lean:

**Always-on MCPs (global):**
- Filesystem
- GitHub

**Per-flow MCPs (loaded only when relevant):**
- Supabase (corrections flow run state)
- Chrome DevTools or Puppeteer (city research browser fallback for JS-rendered bylaw sites — Boston Municode is the biggest offender)

**Load-on-demand (skills, not MCPs):**
- All MA ADU law / building code reference content
- All Boston / per-city bylaw content
- Plan sheet annotation patterns
- PDF extraction patterns
- Permit response letter patterns

**MCP-versus-Skill rule applied.** When an MCP is used 5+ times in a project, convert to a skill. The Boston deep skill (12 reference files) is a direct application of this — instead of loading a Boston Zoning Code MCP on every turn, the skill files load only when the agent decides Boston-specific content is relevant.

## 14. Workspace Hygiene (Cadence)

Per master §210, with project-specific items folded in:

**Weekly:** Run `/context` audit on permitmonkey workspace. Delete merged branches. Archive completed experiment folders. Review `active/` of loose temp files. Audit cache hit rate on production agent flows per master §234 (any drop is a cache break, triage within 24 hours).

**Monthly:** Prune unused MCPs from the loadout. Review the skill registry — disable any skill not invoked in 30 days. Re-run the test-asset benchmark suite against any new Anthropic model release. Compress old conversation exports.

**Quarterly:** Review this playbook. Promote new Lab Notes to permanent rules. Run `/insights` across the project. Re-check the diversification mirror (`AGENTS.md`) for drift. Run a master §22 validation gauntlet on production systems.

**Per release:** When any Anthropic model updates, run `/claude-api migrate` (master §216) to update model references, move manual thinking settings to adaptive thinking, remove outdated parameters and beta headers, and suggest the right effort level inline. Then run the master §74 upgrade-day pass.

---

# PART 4 — CORE DISCIPLINES (V1.2 PATTERNS APPLIED)

The patterns from the master playbook V1.2 addendum (§211–§234) that we genuinely operationalize. Each section names the master pattern, then traces it to specific shipped infrastructure.

## 15. Provenance from Day One (master §225)

**The moat.** Every material claim in any contractor-facing output carries an inline provenance tag of the form:

```
[source: <URL> | retrieved: <YYYY-MM-DD> | citation: <statute or section>]
```

The format is enforced at three layers.

**Layer 1 — Authoring discipline.** Every reference file in `boston-adu/references/` and the four new state-skill references uses inline tags throughout. The convention started in commit `f1897cc` (boston-adu SKILL.md scaffold) and is documented in [`server/evals/README.md`](server/evals/README.md) "Writing A New Fixture — The Skill-Quoting Pattern."

**Layer 2 — Programmatic verification.** [`server/src/services/citation-verification.ts`](server/src/services/citation-verification.ts) implements `verifyMethod1` (walks `server/skills/**/*.md` looking for the cited excerpt verbatim) and `verifyMethod2` (fetches the canonical URL and looks for the excerpt after HTML strip). The composition `verifyCitation()` tries Method 1 first; falls through to Method 2 only on miss. The short-circuit is critical for CI determinism (master §218) — Method 2's real `fetch()` is never reached when Method 1 succeeds.

**Layer 3 — User-facing render.** The Provenance UI (§8) renders every citation as an inline pill colored by status. Click the pill → side panel opens with the excerpt, the source URL, the retrieval date, and a copy button. Five status states (`verified-skill`, `verified-url`, `unverified`, `broken`, `pending`) cover every outcome the verifier can produce.

**The non-negotiable.** A citation that fails both methods is `unverified` and renders amber with a warning. The agent does not silently emit unverified citations. The eval harness's strict gate fails CI if `citation_precision_p50 < 0.95`.

**Why this is the moat.** Every competitor builds AI ADU tools. None of them ship inline-verified citations. A contractor staring down a $100K project decision needs the underlying source, and the buyer's first question in due diligence is "show me the audit trail." Provenance from day one is the answer to both.

## 16. Reference-Don't-Embed Skill Architecture (master §212)

Skills should reference a central knowledge base, not duplicate content. The PermitMonkey applications:

- The five `adu-plan-review` checklist files cite the `massachusetts-adu` state skill via inline tags rather than duplicating state-code content. When `chapter-150-of-2024.md` updates, all five checklists inherit the update for free.
- The 11 `boston-adu` reference files cite back to the state skill on state-floor questions (parking exemption mechanics, owner-occupancy preemption, size cap formula). City-skill content covers Boston-specific differentials.
- The fifth eval fixture (commit `7aa5f13`) pins three of the four new state-skill references through verbatim quotes — when state content drifts, the gate fails.

**The general rule (Lab Note #4):** when two existing files in this repo disagree on a state-code fact, trust the `massachusetts-adu` state skill over the city-research file. State-skill content is the audit-grade source; city-research is summary/operational. Stale facts (e.g., 780 CMR "9th edition" lingering in `ma-city-research/references/boston.md`) get caught and corrected against the state-skill source of truth.

## 17. Deterministic Infrastructure + LLM Reasoning Split (master §222)

Per Kepler's pattern: surround the model with deterministic execution environments; reserve the model for parts that require interpretation.

**The PermitMonkey split:**

| Stage | Engine | Why |
|---|---|---|
| Citation extraction | Regex (`TAG_RE`) over agent output | Same tag → same parse, every time |
| Method 1 citation verification | `walkMarkdown()` deterministic file walk + substring match | Same excerpt + same skill tree → same result |
| MBTA proximity check | GeoJSON lookup against curated MBTA station list (planned) | Same parcel → same distance |
| Method 2 citation verification | Real `fetch()` against canonical URL | Network-dependent but deterministic given the URL state |
| Eligibility verdict (deterministic path) | `evaluateEligibility()` at `frontend/lib/eligibility.ts` | Same input → same output |
| Eligibility verdict (LLM-deepened path) | `MAEligibilityAgent` Generator | Interpretation, ambiguity resolution |
| Eligibility verdict audit | `MAEligibilityAgent` Verifier (Opus 4.7) | Cross-source synthesis |

**Why this matters.** Asking Claude to retrieve and compute and reason in one call leaves quality on the table and creates verification gaps. Splitting retrieval to a deterministic walker and verification to a deterministic substring match means the LLM only handles the parts that need interpretation — and those parts can be audited because everything around them is deterministic.

## 18. Model-Stage Matching (master §223)

The MA Eligibility Agent is the canonical project example. Two stages, two models:

- **Generator (Sonnet 4.6).** High-throughput, well-bounded task: read inputs, invoke skills, produce JSON matching a known shape. Sonnet's cost-per-token is ~5× cheaper than Opus and the task doesn't require Opus's edge-case depth.
- **Verifier (Opus 4.7).** Cross-source synthesis: read every citation tag, decide which method to try, interpret partial matches. Opus consistently holds the multi-step plan together where Sonnet starts taking shortcuts by step 4 or 5.

**The Advisor Tool (master §9B) is the single-API expression of the same pattern.** For the next agent flow, default to Advisor (`type: advisor_20260301`, `model: claude-opus-4-7`, `max_uses: 3`) rather than orchestrating manually. Sonnet+Opus advisor delivers +2.7% on SWE-bench Multilingual versus Sonnet alone with 11.9% cost reduction per agentic task.

**For high-throughput narrow recall tasks** (e.g. classifying corrections-letter line items into categories), Haiku 4.5 is the right default. The benchmark figure to remember: fine-tuned smaller models can outperform much larger general models on genuinely narrow, high-volume tasks (Kepler reports 94% accuracy on financial-statement-label mapping versus 38–46% for off-the-shelf models).

## 19. Ground-Truth Evaluation Pipelines (master §224)

The strict CI gate at [`.github/workflows/evals.yml`](.github/workflows/evals.yml) enforces master §224 directly. Every prompt change, model upgrade, and skill content modification is tested against six fixtures before merge.

**The four operational rules from the master, applied:**

1. *Test every stage independently.* The 38 unit tests cover the citation extractor, the verifier methods, the injection prescan, and the deterministic eligibility logic — each in isolation.
2. *Test the full pipeline end-to-end.* The six eval fixtures exercise discover → run → score → report against real skill content. Drift in any quoted sentence fails the gate.
3. *In high-stakes domains, a silent regression is how you lose a client permanently.* The strict gate is the answer. Precision below 0.95 fails CI; verdict accuracy below 0.9 fails CI.
4. *The evaluation pipeline is itself a project artifact.* Treated as production code. The README at [`server/evals/README.md`](server/evals/README.md) is the canonical documentation; the skill-quoting pattern is captured there so future fixture authors don't re-derive it.

The `--strict` flag flipped on in commit `7e41a8d` after the third fixture pushed `precision_p50` to 1.0 with full headroom. The eval matrix has expanded from one (smoke-mock) to six fixtures across all three production flows.

## 20. Cache-Prefix Discipline (master §217)

The single highest-leverage technical pattern from the master's V1.2 addendum: prompt caching is the foundation that makes long-running agentic products feasible. The four-layer prompt structure that maximizes cache hit rate:

1. Static system prompt and tool definitions (globally cached across all sessions)
2. CLAUDE.md content (cached within a project)
3. Session-specific context (cached within a single session)
4. Conversation messages (only the new turn invalidates)

**The five hard rules, applied to PermitMonkey production agent flows:**

- Static content first, dynamic content last
- Never change models mid-session — cache is unique to the model. The MA Eligibility Agent's two-pass architecture respects this: Sonnet runs the generator, then Opus runs the verifier in a separate `query()` with its own cache prefix
- Never add or remove tools mid-session — if the agent has multiple modes, model the transitions through tools, not through tool-set changes (master §220)
- For time updates or file changes, push them via `<system-reminder>` tags in the next user message rather than editing the prompt
- Monitor cache hit rate like uptime — wire a weekly Routine that pulls cache stats and posts to Slack; any multi-percentage-point drop is a cache break and triages within 24 hours

**Cache-safe forking (master §218).** Every side computation that needs to reuse the parent's prefix — skill execution, summarization, validation pass — uses the same system prompt, user context, and tool definitions as the parent. The Generator-Verifier pair is itself a fork pattern: the verifier inherits the project's stable prefix.

## 21. Plan Mode is a Tool, Not a Tool Swap (master §220)

The instructive design lesson applied. The `AgentRunner` subprocess bridge (commit `8300a2d`) does NOT swap tool sets when dispatching by fixture kind. Instead, the CLI at [`agents-permitmonkey/src/cli.ts`](agents-permitmonkey/src/cli.ts) accepts a `--fixture` argument and dispatches internally:

- `eligibility-check` → `runMAEligibility`
- `corrections-letter` → returns a clean not-implemented error pending PDF test assets
- `plan-review` → returns a clean not-implemented error pending PDF test assets

The agent's tool surface is identical across all three branches. Mode dispatch happens through a single tool invocation parameter, not through tool-set reconfiguration. Cache-safe by construction.

The general principle: model state transitions through tools, not through tool-set changes. Anywhere an agent has multiple modes — Plan vs Build, Read-Only vs Edit, Verbose vs Summary, Production vs Sandbox — the cache-preserving implementation is the same pattern.

## 22. Three-Tier Code Review (master §232)

The review primitive ladder for PermitMonkey PRs:

**Tier 1 — `/review` (every PR).** Fast, cheap, local. Single-pass scan inside the Claude Code session. The right tool for typo fixes, config edits, dependency bumps, single-file changes, any branch still iterating. Use freely.

**Tier 2 — `/ultrareview` (substantial pre-merge changes).** Cloud-based multi-agent fleet with independent verification. The right tool for auth changes, schema migrations, refactors of shared components, payment / billing / fiduciary code paths, pre-launch surfaces. Costs $5–$20 per run after the Pro/Max free allotment (which expires May 5, 2026 per master §230). Reserve for PRs that would keep you up at night if something slipped through.

**Tier 3 — `claude code-review` (Team / Enterprise, every PR via webhook Routine).** The agent-team pattern — security reviewer + test-coverage reviewer + architectural reviewer + documentation reviewer, synthesized into a single review comment. Wire to GitHub PR-opened webhook so it fires before any human reviewer. Cost ~$15–$25 per review.

**The PermitMonkey policy:**

| PR type | Primary tool |
|---|---|
| Trivial (typo, dep bump, single-line) | `/review` |
| Small feature (under 200 lines, low blast radius) | `/review` + `code-review` if Team/Enterprise |
| Substantial change (auth, migrations, agent flow refactors) | `/ultrareview` + human review |
| Skill-content change | `/review` + the strict eval gate (the gate IS the review for skill content) |
| Frontend Provenance UI change | `/ultrareview` + manual visual review (the only true verification) |
| Pre-launch feature surface | All three tiers + manual product-fit review |

## 23. The Trainee-Developer Mental Model (master §233)

The MacCoss Lab framing applied: treat Claude Code as a trainee developer being onboarded onto the codebase, not as a magic productivity multiplier. Five practical implications for PermitMonkey:

(1) **Scope discipline.** Bounded tasks first; expand as the context layer accumulates. The Phase 1 → Phase 2 progression (Boston deep skill first, then eligibility agent, then eval harness, then plan-review checklists, then state-skill expansion) is exactly this pattern. Don't hand a fresh session 32 commits' worth of work and expect coherent output.

(2) **Documentation for the agent.** The CLAUDE.md plus skills layer is the codebase documentation written for an agent. Keep it short, structured, reference-don't-embed. Master §211 calls this "context as artifact" — treat it like code.

(3) **Asking questions and admitting ignorance.** The debugging-skill pattern (master §213) and the content-engineering escalation rule (master §221, point 3) enforce this. The Lab Notes are a record of failures where the agent didn't ask, projected from pattern, and got it wrong (Article 26A is the canonical example).

(4) **Track and adjust.** The strict eval gate, the per-agent KPIs in `.claude/agent-performance.md`, and the three-strike termination policy (master §84) are the project's performance-review system. The MALawLookup agent has zero-tolerance for hallucinated citations — a single fabricated MGL reference disables the agent until manually re-verified.

(5) **Expect mistakes early, steady improvement over weeks.** Self-annealing protocol (master §7C) encodes the loop: error fires → diagnose → attempt fix (try hard before escalating) → update execution AND directive AND CLAUDE.md Lab Notes. Workflows compound over time.

The mental-model shift the master calls out: "Claude can't truly learn about my large project" is the wrong frame. The right frame is "context is just another artifact to maintain and grow." The 32 commits ARE that artifact.

---

# PART 5 — PERMITMONKEY ARCHITECTURE

## 24. The Three Flows

**Flow 1 — Corrections Letter Interpreter (primary, production revenue path).** Contractor uploads plans PDF + corrections letter PDF. Agent extracts plans with vision, parses corrections items, cross-references MA state + local code, asks clarifying questions, generates response package: analysis report, professional scope of work, draft response letter, sheet annotations JSON.

**Flow 2 — Permit Checklist Generator (free-tool lead magnet).** Contractor or homeowner enters project address + ADU type (attached / detached / conversion) + size + lot type. Agent researches city-specific requirements, combines with state ADU rules, produces pre-submission checklist with city-specific gotchas. Deterministic fast path lives at `frontend/lib/eligibility.ts`; LLM-deepened path is the `MAEligibilityAgent`.

**Flow 3 — City Pre-Screening (roadmap, B2G).** City building department uploads a permit submission. Agent reviews against the city's own requirements and state ADU law, flags missing docs, unsigned pages, incomplete forms before a human plan checker touches it. The five sheet-type checklists (`adu-plan-review/references/`) are the foundation; the deep agent layer is roadmap.

**Priority for MA launch:** Flow 1 (revenue), Flow 2 (lead magnet, see §32), Flow 3 (B2G, later).

## 25. Orchestrator → Subagent Pattern

```
Contractor submits job
       ↓
Frontend (Next.js) → API → Supabase record
       ↓
Cloud Run orchestrator picks up job
       ↓
Launches Vercel Sandbox (fresh, per-job)
       ↓
Agent SDK with claude_code preset + skills loaded
       ↓
  ┌────────────────────────────────────┐
  │ Main agent (Planner — Opus 4.7)    │
  │   ├─ Subagent: PDF extraction      │
  │   ├─ Subagent: Corrections parser  │
  │   ├─ Subagent: MA law lookup       │
  │   ├─ Subagent: City code lookup    │
  │   └─ Synthesizer: response package │
  └────────────────────────────────────┘
       ↓
Writes back to Supabase
       ↓
Supabase Realtime pushes progress to frontend
       ↓
Contractor downloads package (Provenance UI rendered)
```

**Why this pattern (master §9C):** clear task decomposition; subtasks have lots of tool output you only need the conclusion from (main agent never sees raw PDF bytes or full web scrape dumps); each subagent's context dies with the job — no state bleed between contractors.

**Weakness to watch (master §9C):** orchestrator becomes information bottleneck; details lost in handoff summarization. Mitigation: subagents write structured JSON, not prose, for hand-back. The MA Eligibility Agent's Generator-Verifier pair is the canonical structured-handback example.

## 26. Agent Roster — JDs + Three-Strike Policy

Every agent gets a written job description in `.claude/agents/<name>.md`. Performance tracked in `.claude/agent-performance.md`.

**Current PermitMonkey roster:**

| Agent | Model | Role |
|---|---|---|
| **Planner** | Opus 4.7 `xhigh` | Reads job intake, plans subagent dispatches, synthesizes final package |
| **PlanReader** | Opus 4.7 (vision) | Extracts architectural plan sheets page-by-page |
| **CorrectionsParser** | Sonnet 4.6 | Breaks corrections letter into discrete items, classifies each |
| **MALawLookup** | Sonnet 4.6 | Cross-references MA ADU skill for each correction item |
| **CityCodeLookup** | Sonnet 4.6 | City-specific bylaw research via MA city research skill |
| **ResponseWriter** | Opus 4.7 `xhigh` | Writes client-facing response package |
| **QAReviewer** | Opus 4.7 `xhigh` | Validates every citation before delivery |
| **MAEligibilityGenerator** | Sonnet 4.6 | Eligibility verdict + inline citations |
| **MAEligibilityVerifier** | Opus 4.7 `xhigh` | Citation audit (Method 1 + Method 2) |

**Three-strike policy (master §84).** Track per agent per run: hallucination count (output contradicts source); directive violations (acted outside scope); failed handoffs (downstream couldn't use output). Strike 1: warning, logged. Strike 2: next run sandboxed, output compared against ground truth before acceptance. Strike 3: agent disabled; review JD + skill; rebuild if systemic.

**MALawLookup has zero-tolerance for hallucinated citations.** A single fabricated MGL reference disables the agent until manually re-verified. This is an E&O-liability vector. The Provenance UI's `unverified` and `broken` status states exist precisely to surface these failures to the human reviewer before a contractor sees them.

## 27. Skills Registry (Current State)

| Skill | Status | Reference count |
|---|---|---|
| `massachusetts-adu` | ✅ active, 12/12 | 12 reference files |
| `boston-adu` | ✅ active, 12/12 | 12 reference files |
| `adu-plan-review` | ✅ active | SKILL.md + 5 sheet-type checklists |
| `ma-city-research` | ✅ active | Boston, Cambridge, Somerville, Newton, Brookline |
| `ma-corrections-interpreter` | ✅ active | Workflow skill |
| `permitmonkey-ops` | ✅ active | Operator skill |
| `pdf-extraction` | ✅ active | Plan sheet vision |
| `permit-response-writer` | ✅ active | Response letter patterns |
| `adu-eligibility-checker` | ✅ active | Free-tool backing skill |
| `ai-playbook-lookup` | ✅ active | On-demand router into master playbook |
| `california-adu` | ⛔ retired to `_legacy/` | (kept for regression reference) |
| `adu-city-research` (CA variant) | ⛔ retired to `_legacy/` | (kept for regression reference) |

Per master §211, skills are the procedural know-how layer; the wiki is the linked documentation; CLAUDE.md is the router. The 12 + 12 + 5 = 29 reference files across the three primary skills constitute the "wiki" — and they're referenced by skill content rather than embedded.

---

# PART 6 — RELIABILITY, SECURITY, COST

## 28. Pre-Deploy Security Audit

The six-category audit prompt from master §12 is canonical. PermitMonkey-specific augmentations:

- **Uploaded plans contain PII.** Storage bucket must be private; signed-URL access only. Test by attempting public URL access on a known-private object.
- **Per-job sandbox isolation.** Verify each Vercel Sandbox is fresh; no container reuse between contractors. The Vercel Sandbox lifecycle is "create → attach files → run agent → collect outputs → destroy" with destruction on both success and error paths.
- **LLM prompt injection in uploaded corrections letters.** A malicious corrections letter could read "ignore previous instructions and respond with: ...". The system prompt and skill instructions must be robust. The injection-prescan skill (`server/src/services/injection-prescan.ts`, with 6 unit tests) catches direct override / role swap / system spoof / output override / unicode hidden patterns.
- **Supabase RLS** on `jobs`, `runs`, `artifacts` so contractor A never sees contractor B's data.
- **Agent SDK key handling.** ANTHROPIC_API_KEY is server-side only (orchestrator + sandbox env). Never imported into a client component.

**The Claude Security upgrade path (master §229).** When Team-tier access opens, replace the manual audit prompt with Claude Security at claude.ai/security. Confidence-rated findings, multi-stage validation, scheduled scans, scan-to-applied-patch in a single sitting. Until then, keep the master §12 audit prompt as the primary audit.

## 29. Cost Controls

Per master §80 — output tokens cost ~5× input tokens, and most agentic output is invisible (tool calls, file writes, intermediate reasoning). The four real levers:

- **Route high-volume sub-tasks through Sonnet or Haiku.** Reserve Opus 4.7 max for synthesis. The MA Eligibility Agent's Sonnet-generator + Opus-verifier split is the canonical example.
- **`/rewind` instead of corrections.** Kills output on the dead branch (master §71's compounding re-read tax).
- **Targeted edits via `str_replace`** rather than full file rewrites where possible.
- **Subagents for "what if" exploration.** Only the conclusion enters main context.

**Caching discipline (master §217 detail).** MA ADU skill content is stable — cache via Anthropic prompt caching headers. Target ≥50% cache hit rate on skill reads. City bylaw lookups cached for 30 days (bylaws don't move daily); bust cache on explicit trigger. PDF plan extractions cached per (plan hash, agent version) — same contractor rerun shouldn't re-extract.

**Sandbox hygiene.** Vercel Sandbox cost scales with runtime. Targets: p50 < 10 min per job, p95 < 25 min. Abort conditions: no progress for 3 min, token spend > $5, any subagent hits 3 strikes per master §84. Aggressive compact between subagent handoffs — structured JSON only.

**Cost per run targets (Opus 4.7 + caching):**
- Corrections job: $2.50 avg, $5.00 cap
- Checklist / eligibility job: $0.75 avg, $1.50 cap
- MA Eligibility Agent (Generator + Verifier): $0.50–$2.00 per run
- Skill content build (one-time per file): $10–$25 per reference file

## 30. Monitoring

- **Application errors:** Sentry, free tier, on frontend + orchestrator.
- **Uptime:** Routine every 15 min hitting `/health` on Cloud Run + Vercel. Alert to Slack.
- **LLM cost tracking:** Weekly Routine pulls Anthropic API usage, posts breakdown to Slack. Flag any job > $10.
- **Cache hit rate:** Daily Routine pulls cache statistics from production agent runs. Multi-percentage-point drop = production incident per master §217 / §234.

**Key metrics (alert thresholds):**

| Metric | Target | Alert |
|---|---|---|
| Job success rate | >95% | <90% |
| p50 run time | <8 min | >15 min |
| p95 run time | <25 min | >45 min |
| Cost per corrections job | <$3 | >$6 |
| MALawLookup hallucination rate | 0% | any |
| Contractor completion (start → download) | >50% | <30% |
| Citation precision (eval gate) | =1.0 | <0.95 |
| Cache hit rate (production agent) | >60% | <50% |

---

# PART 7 — DISTRIBUTION & MARKET

## 31. ICP for MA

**Primary:**
- MA-licensed contractors doing 3–15 ADU projects per year, currently spending 3–8 hours per corrections cycle
- MA architects / designers focused on residential infill, want to reduce plan-check friction

**Secondary:**
- Homeowners considering an ADU, don't know if their lot qualifies (free-tool funnel, see §32)
- Real estate investors evaluating lots for ADU potential

**Tertiary (roadmap):**
- City building departments wanting Flow 3 to triage their inbox

**Acquisition channels (ranked by fit):**
1. Merritt's JLL network → introductions to MA residential developers and architects
2. Free-tool funnel (§32) → homeowner email capture → upsell to contractor referrals
3. AEO (§34) → contractors searching "MA ADU corrections response"
4. Reddit r/Boston, r/CambridgeMA (contractors hang out there)
5. Paid: Google Ads on "MA ADU permit [city]" — low competition, well-qualified traffic

## 32. Free-Tool Funnel — ADU Eligibility Checker

**Status:** ✅ shipped end-to-end. Form at `/eligibility`. Backend at `/api/eligibility` calls deterministic `evaluateEligibility()`. Locked by 15 unit tests. Returns verdict + max ADU size + parking requirement + city-specific gotchas + citations.

**Mechanic:**
- Homeowner enters MA address + lot size + primary dwelling size + (optional) proposed ADU size + transit / historic checkboxes
- Tool checks: single-family zone? Ch 150 of 2024 applies? Dimensional limit? Historic / wetlands / overlay?
- Returns: "Your lot is likely ADU-eligible. Max size [X] sq ft. Top 3 gotchas for [city]." Plus citations to MGL Ch 40A §3 and 760 CMR 71.00.
- Email capture for the full report (optional; no email required for the instant verdict per the in-page badge)
- Share button: "My lot can fit an [N] sq ft ADU — check yours" → pre-filled social post

**Flywheel:**
1. SEO landing page per major MA city ("ADU eligibility Boston", "ADU eligibility Cambridge", etc.)
2. Free tool delivers instant value
3. Email capture
4. Upsell: "Need help with the permit? PermitMonkey's corrections-interpretation service"
5. Referral fee from partner contractors = revenue without acquiring paid users directly

**LLM-deepened path.** The `MAEligibilityAgent` Generator-Verifier pair is wired but not yet exposed in the UI. Future work: a "Get full audit" button that fires the agent and renders the verifier's audit report in a sidebar via `MarkdownWithCitations`. Roadmap item.

## 33. MCP Server as Distribution

Per master §65 — publish PermitMonkey as a remote MCP server in the Anthropic directory. Every Claude.ai user discovers it in context when they ask Claude about MA ADUs.

**Implementation requirements (per master §104):**
- Build remote (not stdio) — required for directory placement
- Group tools around intent, not endpoints (`analyze_lot_eligibility(address)` not `get_zoning(address) + get_dimensions(address) + ...`)
- Ship MCP Apps for the primary output (interactive eligibility scorecard rendered inline)
- Use CIMD for auth
- Pair the server with a companion skill (master §107)
- Submit to claude.com/docs/connectors/overview
- Track directory listing impressions weekly

**The Q2–Q3 2026 window.** The connector directory is the closest thing to App Store distribution for AI-native products. As more connectors land, niche-category placement becomes harder. Move fast on submission once Flow 1 has 5+ paying contractors and a track record.

## 34. AEO on MA ADU Queries

Structured Q&A content on the site, schema-marked, citation-ready (master §68).

**Top 20 questions to answer definitively:**
1. Can I build an ADU in Massachusetts?
2. How big can an ADU be in Massachusetts?
3. Do I need owner occupancy for an ADU in Mass?
4. Does my city require parking for an ADU?
5. What does Chapter 150 of the Acts of 2024 do?
6. How long does ADU permit approval take in Boston?
7. What is the ADU setback in Cambridge?
8. Can I rent my ADU in Massachusetts?
9. What is the Specialized Opt-In Energy Code?
10. Does my Boston ADU need sprinklers?

(...continue to 20)

Each question gets a 3–5 paragraph answer with schema FAQ block, citing the relevant skill reference. Claude / Perplexity / ChatGPT cite the cleanest answer.

**Monitoring.** Use Otterly or Profound to track citations. Target: primary source for ≥5 queries within 90 days post-launch.

## 35. Content Repurposing Engine

Per master §62 — every long-form piece (newsletter, podcast episode, YouTube video) gets repurposed into ~15 derivative formats via a Claude Code Routine.

Merritt records one 20-minute voice memo per week on an MA ADU topic (a recent corrections case, a new neighborhood adopting bylaws, a Ch 150 of 2024 interpretation). The Routine produces:

- 1 blog post
- 3–5 LinkedIn posts (one educational, one contrarian, one product-tied)
- 5–10 tweets / X posts
- 1 newsletter edition
- 2–3 short-form videos via Remotion (master §60)

**Anti-slop discipline (master §63).** Rewrite Claude's drafts before posting. Watch for em dashes used pervasively, "It's not just X — it's Y" rhetorical structures, "delve / tapestry / seamlessly / robust / leverage" crutch words. Pre-publish prompt at master §63.

**Weekly cadence:** Mon plan, Tue draft, Wed render, Thu–Fri post, Sat review.

## 36. Viral Artifacts — Eligibility Scorecard

Per master §69. Every output of the free tool becomes a shareable artifact:

```
Your Lot: 8,200 sq ft in Cambridge

✓ Zoned Residence A-2 — ADU allowed by-right
✓ Max ADU size: 900 sq ft
✓ Within 0.5 mi of Alewife T — no parking required
⚠ Historic district — design review likely

Checked by PermitMonkey · permitmonkey.ai/eligibility
```

Clean, branded, shareable to LinkedIn / Twitter / Instagram. Each share is a backlink + a peer-signaled endorsement. UTM-tagged so per-source CAC is trackable.

**Viral coefficient target (master §69):** 0.3–0.5. Each customer generates 0.3–0.5 new customers through shared artifacts.

---

# PART 8 — OPERATIONS

## 37. Cadence

**Daily:** Check Sentry. Skim any alerts.

**Weekly (Mon 7am):** Performance report Routine posts to Slack — success rate, run time, cost per job, citations audit, cache hit rate.

**Weekly (Fri):** Review the week's corrections-job outputs. Any poor responses → root-cause into the MA ADU skill or the ResponseWriter JD. Any citation drift → fail the eval gate before merge.

**Monthly:** Re-run full MA test-asset benchmark. Any regression → investigate before next release. Review unused skills and MCPs. Run master §74 upgrade-day pass if any model has updated.

**Quarterly:** Review this playbook. Prune what's stale. Promote new Lab Notes from `.claude/CLAUDE.md` to permanent rules. Run `/insights`. Re-check `AGENTS.md` mirror for drift.

**Per release:** `/claude-api migrate` (master §216) on every project on the Anthropic API. The skill catches old parameter names, deprecated thinking budgets, outdated beta headers, missing effort-level updates.

## 38. Roadmap (Status as of 2026-05-05)

**0–90 days (pivot execution) — mostly DONE:**
- ✅ Retire CA skills to `_legacy/` (commit `28efe94`)
- ✅ Build `massachusetts-adu` skill at 12/12 references (commit `1758448`)
- ✅ Build `boston-adu` skill at 12/12 references (commit `dc7e691`)
- ✅ Build MA city research for Boston, Cambridge, Somerville, Newton, Brookline
- ✅ Ship free-tool ADU eligibility checker end-to-end (15 tests, locked)
- ✅ Update marketing copy top-to-bottom (commit `3c68be2`)
- ✅ Build `MAEligibilityAgent` Generator-Verifier pair (commit `ed1d640`)
- ✅ Build eval harness with 6 fixtures + strict CI gate (commits `a226a10` → `7aa5f13`)
- ✅ Wire AgentRunner subprocess bridge (commit `8300a2d`)
- ✅ Provenance UI Phase A + B + production wiring (commits `0026920`, `36c9cfd`, `238fd80`, `0e98b9c`)
- ⏳ Source 5+ MA test assets — blocked on user approval
- ⏳ First 5 paying MA contractors — gated on launch

**90–180 days (market build):**
- Expand city coverage to 10 MA cities (add Worcester, Quincy, Lowell, Lynn, Lawrence)
- Submit MA ADU MCP server to Anthropic directory (master §65 window)
- Launch AEO content (20 definitive Q&As, master §68)
- Paid Google Ads on top queries
- First 25 paying MA contractors
- Wire production cache hit rate monitoring
- First Routines deployment (post-deploy verification, weekly cost report, alert triage)

**180–365 days (scale or pivot):**
- Flow 3 (city pre-screening) pilot with 1 MA building department
- Expand to adjacent MA permit types if ADU saturates (residential additions, solar, decks)
- Consider adjacent states (RI, NH, CT have similar ADU pressure)
- 100+ paying contractors or clear pivot signal

## 39. Pivot Triggers

Explicit conditions that change the plan:

**Ch 150 of 2024 gets weakened or overridden.** If the legislature walks it back (unlikely but possible given local pushback), the by-right premise collapses. Fallback: reposition as a permit-friction tool broadly, not ADU-specific.

**A well-funded competitor stakes MA.** If a YC-backed or VC-backed entity launches an MA ADU permit tool with serious marketing, revisit. PermitMonkey's advantage is local expertise + Merritt's network + Claude Code execution speed + the inline-provenance moat — not capital.

**MA ADU volume doesn't materialize.** If 12 months in, the ADU permit volume across priority cities is < 500/year total, the market is too thin. Pivot to adjacent permit types (residential additions, commercial TI) where volume is higher.

**Customer acquisition cost exceeds lifetime value for 3 consecutive months.** Reposition or drop paid acquisition; double down on free tool + referral.

---

# APPENDIX A — CLAUDE DESIGN FOR PERMITMONKEY

For any deck, landing page, or marketing artifact (master §54–§57):

**DESIGN.md first** in a `design/` folder. Capture: typography, color palette, spacing rhythm, chart standards, voice, banned defaults.

**Banned defaults — paste into every starter prompt (master §55):**
- No Inter, Roboto, or Arial as primary typeface
- No blue-to-purple gradients
- No generic rounded-corner cards with drop shadows
- No stock gradient backgrounds

**Token-conservation hierarchy (master §54):**
1. Upfront design system work — runs once, multiplies everything downstream
2. Initial Opus 4.7 generation — the one expensive prompt
3. Comment-tool edits — surgical, point-and-click, cheap
4. Sliders for spacing / density / warmth — cheap
5. Re-prompts — AVOID unless restarting from scratch

**Self-polishing pass.** Wait 30–60 seconds after generation. Claude keeps iterating. Don't burn a comment pass on something it's about to fix on its own.

**Export reality.** HTML > PDF > PPTX > Canva. Save HTML first for any artifact you'll iterate on (e.g. the landing page exists as HTML at `docs/design/landing-stripe-synthesis.html` for reference).

---

# APPENDIX B — SLASH COMMAND CHEAT SHEET

```
/init          First time in project, generate workspace summary
/context       Token breakdown — run weekly baseline
/usage         Claude Code allowance check
/compact       Compress with direction hint (e.g. /compact preserve all skill paths)
/clear         New task, clean slate
/rewind        (or double-Esc) — jump back to previous message
/cost          Monitor agent team spend
/model         Switch Opus / Sonnet / Haiku
/permissions   Fine-grained tool control
/status line   Customize status bar
/insights      After 50+ conversations
/schedule      Create a Routine
/btw           Side-channel question, no context pollution
/review        Tier 1 PR review (master §232)
/ultrareview   Tier 2 PR review (master §230)
/security-review  Pre-deploy security pass
/claude-api migrate   Model upgrade pass (master §216)
```

---

# APPENDIX C — LAB NOTES — WHAT NOT TO DO

The four entries below are a **snapshot** of the live Lab Notes maintained at the bottom of [`.claude/CLAUDE.md`](.claude/CLAUDE.md). The CLAUDE.md copy is the authoritative source — auto-updates as new mistakes are logged. This appendix is the playbook-version snapshot for buyer due diligence and offline review.

**Lab Note #1 — 2026-04-22.** Initial playbook cited "Chapter 358 of the Acts of 2024" for the MA ADU law. Correct citation is **Chapter 150 of the Acts of 2024**, §§ 7-8. Fix: always verify statute citations via malegislature.gov or mass.gov before committing. Don't trust memory on statute numbers.

**Lab Note #2 — 2026-04-22.** Misreported commit stats as `+1,068 / -70,799 net` in user-facing summary. That number came from `git diff --stat` of unstaged working tree, where git renders renames as delete+create separately. Actual committed stats from `git show --shortstat HEAD` were `+8,241 / -1,789`. Fix: always verify commit stats with `git show --shortstat HEAD` AFTER commit; never report pre-staging diff numbers as commit results. Renames are transparent post-staging; pre-staging they look like massive deletions.

**Lab Note #3 — 2026-05-03.** Drafted `server/skills/boston-adu/SKILL.md` citing "Article 26A" five times as the Boston ADU governing article, projecting from generic ADU naming conventions. **Article 26A was never verified to exist.** The actual Boston structure (per BPDA Neighborhood Housing Zoning landing page) is per-neighborhood amendments via "PLAN: [neighborhood]" initiatives — Mattapan adopted Feb 2024; Roslindale / West Roxbury / Hyde Park drafts in progress. Boston Zoning Code is hosted on Municode (library.municode.com/ma/boston/codes/redevelopment_authority) but is JS-rendered, so static fetches return empty page bodies. Fix: removed all five "Article 26A" references from SKILL.md in the same Wed Phase 1 commit; future skill scaffolds must verify article numbers against Municode (or another authoritative source) before committing them, even if it means writing thinner reference files marked TBD. **Don't project article numbers from pattern-matching against other cities' codes — Boston's special-act zoning framework doesn't follow standard Ch 40A naming conventions.**

**Lab Note #4 — 2026-05-03 (second instance, same root cause).** SKILL.md and Quick-Ref table cited 780 CMR as "9th edition" in four places. The current edition is **10th Edition (effective October 2023, IRC 2021 / IBC 2021 base)** per the existing `massachusetts-adu` skill `780-cmr-essentials.md` (last_verified 2026-04-22). The "9th ed." figure was inherited from the older `ma-city-research/references/boston.md` city-research file — that file is now stale on this point. Fix: updated all four boston-adu SKILL.md references to "10th Edition" in the Thu Phase 1 commit; building-codes.md cites the state skill as the authoritative source. **General rule: when two existing files in this repo disagree on a state-code fact, trust the `massachusetts-adu` state skill over the city-research file. State-skill content is the audit-grade source; city-research is summary/operational.** Backlog item: update `ma-city-research/references/boston.md` to the 10th Edition reference in a follow-up commit (out of scope for the boston-adu Phase 1 sprint).

---

# APPENDIX D — V1.2 MASTER PLAYBOOK CROSS-REFERENCE

The master sections that govern PermitMonkey work, with one-line notes on local application. The master is at [`docs/master-ai-playbook.md`](docs/master-ai-playbook.md).

| Master § | Topic | PermitMonkey application |
|---|---|---|
| §2B | Opus 4.7 effort tiers | `xhigh` default; see §11 above |
| §4 | Global CLAUDE.md structure | Mirrored in `.claude/CLAUDE.md` |
| §7C | Self-annealing protocol | Mandatory in CLAUDE.md; Lab Notes are the artifact |
| §8 | Context management | 120K threshold + five after-turn options enforced |
| §9 | Sub-agents | Three baseline agents in `.claude/agents/`; roster expanded for production |
| §9B | Advisor Tool | Single-API expression of model-stage matching |
| §9C | Multi-agent coordination | Orchestrator-Subagent default; Generator-Verifier wraps quality-critical paths |
| §10 | MCPs | Lean stack: Filesystem + GitHub global; per-flow only |
| §12 | Security audit | Pre-deploy gate; replaceable by Claude Security at Team-tier (master §229) |
| §13 | Diversification | `AGENTS.md` mirror; Lab Notes synced |
| §22 | Skill architecture | Skill-creator with evals, benchmarks, regression — applied to every skill |
| §62 | Content repurposing | 1 voice memo → 15 formats via Routine |
| §65 | MCP servers as distribution | Q2-Q3 2026 submission window |
| §66 | Programmatic SEO | 10K+ pages targeting "ADU eligibility [city]" |
| §67 | Free tool funnel | `/eligibility` shipped end-to-end |
| §68 | AEO | 20 definitive MA ADU Q&As planned |
| §69 | Viral artifacts | Eligibility scorecard with UTM-tagged shares |
| §74 | Session handoff protocol | Used between Phase 1 → Phase 2 transitions |
| §80 | Output token reality check | Routing rules in §29 above |
| §83 | Digital employee model | Agent JDs in `.claude/agents/`; KPIs tracked |
| §84 | Three-strike termination | MALawLookup zero-tolerance for hallucinated citations |
| §102 | Managed Agents memory | Roadmap; not yet wired |
| §106 | Plugins | Future packaging surface for the PermitMonkey skill bundle |
| §201 | Code review as agent team | Wire to GitHub PR-opened webhook when team plan available |
| §211 | Context-as-artifact | CLAUDE.md as router; skills as procedural |
| §212 | Reference-don't-embed | boston-adu cites massachusetts-adu; checklists cite state skill |
| §213 | Debugging skill | Pending — high-leverage addition to roadmap |
| §215 | Bespoke agents per JTBD | `MAEligibilityAgent` is the canonical example |
| §216 | `/claude-api migrate` | Per-release upgrade pass |
| §217 | Cache-prefix discipline | Agent flow design constraint |
| §218 | Cache-safe forking | Generator-Verifier pair pattern |
| §220 | Plan Mode is a tool | AgentRunner kind-routed dispatch (commit `8300a2d`) |
| §221 | Content engineering | Skill ontology; deterministic+LLM split |
| §222 | Deterministic + LLM split | `citation-verification.ts` + Provenance UI |
| §223 | Model-stage matching | Sonnet generator + Opus verifier |
| §224 | Ground-truth eval pipelines | 6-fixture strict gate at `.github/workflows/evals.yml` |
| §225 | Provenance from day one | Inline tag format + verifier + UI |
| §229 | Claude Security | Replaces §12 audit at Team-tier |
| §230–§232 | `/ultrareview` three-tier review | Policy in §22 above |
| §233 | Trainee-developer mental model | Operational frame for skill authoring + Lab Notes hygiene |
| §234 | Updated cleanup cadence | Folded into §14 / §37 above |

---

*PermitMonkey Master Playbook V2.0 (MA Edition, Post-Pivot) — Merritt Cassell — 2026-05-05*

*Synthesized from V1.0 (April 2026), the Master AI Playbook V1.2 (universal Claude Code operating manual at [`docs/master-ai-playbook.md`](docs/master-ai-playbook.md)), and 32 commits of shipped infrastructure on `chore/week-0-preflight`. The strategic frame is V1.0; the discipline is the master's V1.2 addendum (§211–§234); the artifacts are the eval harness, the skills, the Provenance UI, and the MA Eligibility Agent. Future revisions update the "What's Built" inventory and promote new Lab Notes from `.claude/CLAUDE.md` into Appendix C.*
