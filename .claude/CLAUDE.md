# permitmonkey CLAUDE.md

## Product

PermitMonkey — AI ADU permit assistant. Currently pivoting California → Massachusetts. Win condition: contractor uploads plans + corrections letter, gets back a professional response package that holds up under a Massachusetts plan checker's review.

Three flows:
1. **Corrections Letter Interpreter** (primary, production) — plans + corrections → response package
2. **Permit Checklist Generator** — address + project basics → pre-submission checklist with city-specific gotchas
3. **City Pre-Screening** (roadmap) — cities upload submissions, agent triages before human plan check

## Non-Negotiables

- Every code citation must be real. Massachusetts statute citations resolve to MGL Ch 40A §§1A/3 as amended by St. 2024, c. 150, §§7-8. Regulatory citations resolve to 760 CMR 71.00. Never cite from memory — always check the skill's reference files or the canonical source.
- Never claim a property is ADU-eligible without checking local dimensional bylaws. State preemption under Ch 150 covers the USE question (can you build one), not the FORM question (how big, how set back, how tall). Local bylaws still govern form.
- When state statute and local bylaw conflict, flag the conflict explicitly. State wins on USE (prohibition, special permit, owner-occupancy, parking). Locality wins on FORM (dimensional setbacks, bulk, height, site plan review) within reasonableness limits.
- Never modify `test-assets/` without explicit approval.
- Agent SDK runs in Vercel Sandbox; don't propose patterns that assume persistent filesystem across runs.
- Uploaded plans and corrections letters may contain PII (owner names, contractor license numbers, addresses). Treat every upload as confidential. No logs, no debug prints, no external tool calls that include raw plan bytes.

## Editing Discipline (Karpathy)

Source: forrestchang/andrej-karpathy-skills CLAUDE.md @ main. These rules sit on top of the harness defaults and bias toward caution over speed on non-trivial edits.

- **Think before coding.** State assumptions explicitly. If multiple interpretations exist, surface them — don't pick silently. If something is unclear, ask before implementing.
- **Simplicity first.** Minimum code that solves the problem. No features beyond what was asked, no abstractions for single-use code, no error handling for impossible scenarios. If 200 lines could be 50, rewrite.
- **Surgical changes.** Touch only what the request requires. Don't "improve" adjacent code, comments, or formatting. Match existing style. Remove orphans your changes created; leave pre-existing dead code alone unless asked.
- **Goal-driven execution.** Translate vague tasks into verifiable goals ("add validation" → "tests for invalid inputs, then make them pass"). For multi-step work, state the plan with per-step verification.

## Opus 4.7 Calibration

- Default effort `xhigh` for corrections-response work
- For long autonomous agent runs, prefer one well-specified turn over many turns (adaptive thinking compounds overhead per turn)
- Sonnet 4.6 for research subagents (MA law lookup, city code lookup, corrections parsing); Opus 4.7 for synthesis (planner, response writer, QA reviewer)
- Use Advisor Tool (advisor_20260301) when Sonnet needs an Opus check on a hard call — cheaper than running full Opus

## Task Specification Discipline

- Treat Claude like a capable engineer I'm delegating to, NOT a pair programmer to guide line-by-line
- Specify task up front in the FIRST turn: intent, constraints, acceptance criteria, relevant files
- Batch questions — every user turn adds reasoning overhead on Opus 4.7
- Ambiguous prompts spread across many turns reduce both token efficiency AND quality

## Style

- Professional, institutional tone in all generated output that reaches contractors or plan checkers
- Cite, don't assert. Every material claim has a source (statute section, CMR, or city bylaw with URL).
- When unsure, ask the contractor a clarifying question rather than guessing
- Don't use em dashes in generated contractor-facing output (reads as AI; see anti-slop discipline)

## Architecture Constraints

- Frontend: Next.js 16 + React 19 + shadcn/ui + Tailwind 4 on Vercel
- Orchestrator: Express 5 on Cloud Run (needed for 10-30min agent runtimes)
- Agent runtime: Vercel Sandbox (ephemeral, per-job filesystem)
- Database: Supabase (Postgres + Realtime + Storage)
- Model: Opus 4.6 currently, upgrade path to 4.7 available

Do not propose:
- Serverless functions for agent work (timeouts before completion)
- Polling patterns (Supabase Realtime already wired)
- Shared state across sandbox runs (sandbox is ephemeral by design)
- Supabase service-role key in frontend code (security baseline)

## Self-Annealing Protocol

When you encounter an error during any workflow:
1. DIAGNOSE: identify exactly where and why it failed
2. FIX: attempt the fix yourself — try hard before escalating to user
3. UPDATE: modify the execution script AND the directive/skill to handle this error class in the future
4. DOCUMENT: add to "Lab Notes" section at the bottom of this file with the fix

Behave like a self-sufficient engineer, not a blocker.

## Diversification

When you update this CLAUDE.md, also update AGENTS.md (at project root) with equivalent changes in a format compatible with non-Claude coding agents (Cursor, Aider, Gemini Code Assist). This is our backup system — if Anthropic has an outage, we need to switch agents within 30 minutes without losing context.

## Token Conservation

- Prefer single Write calls over sequential Edits for brand-new files
- Read docs before coding to avoid wasted retry loops
- Use Sonnet for research sub-agents, Opus for synthesis only
- Pre-convert large docs (HTML/PDF) to markdown via Docling before loading — HTML→MD saves ~90%, PDF→MD saves ~65%
- Compress learnings into skill reference files instead of re-discovering them

## Context Management

- Run `/context` at session start. If baseline > 25K, prune CLAUDE.md or disable unused MCPs.
- Treat 120K tokens as the voluntary reset trigger. Past that, use the session-handoff protocol (PLAYBOOK.md §10) and `/clear`.
- Prefer `/rewind` (double-Esc) over "that didn't work, try X" — the re-read tax on a failed branch compounds across every subsequent turn.

## Skills Registry (target state after pivot)

Active:
- `massachusetts-adu` — state law + 760 CMR 71.00 + EOHLC guidance
- `ma-city-research` — three-mode city bylaw research for MA municipalities
- `ma-corrections-interpreter` — workflow skill for the corrections multi-step
- `permitmonkey-ops` — operator skill
- `pdf-extraction` — plan sheet reading with vision
- `permit-response-writer` — professional response letter patterns
- `adu-eligibility-checker` — free-tool backing skill

Retired (in `_legacy/` for regression reference):
- `california-adu` — CA HCD Handbook + Gov Code §§66310-66342
- `adu-city-research` (CA variant)

## Changelog Discipline

Maintain [`CHANGELOG.md`](../CHANGELOG.md) at the repo root. After any working session that ships user-visible, behavioural, or architectural change, add a top-level entry under `## [Unreleased]` (or open a new dated section if a release was cut). Group entries under: `Added`, `Changed`, `Fixed`, `Removed`, `Security`, `Docs`, `Infra`. Reference commit short SHAs (`abc1234`) so the entry stays linkable. One sentence per bullet, written so a non-engineer reading from cold can understand what shipped.

Don't list every commit — only what a reasonable person would want to know about: new flows, new skills, new reference files, regulatory citation changes, eval-harness milestones, breaking architectural decisions, security fixes, documentation that future Claude sessions need to find.

The changelog is the second source of truth (git log is the first) for reconstructing project state cold. Treat it as a hand-off artifact for future Claude sessions and for buyer due diligence.

## Lab Notes — What Not To Do

*Auto-updates as mistakes are logged. Lead with the date and a one-line mistake description, then the fix.*

- **2026-04-22**: Initial playbook cited "Chapter 358 of the Acts of 2024" for the MA ADU law. Correct citation is **Chapter 150 of the Acts of 2024**, §§7-8. Fix: always verify statute citations via malegislature.gov or mass.gov before committing to a reference. Don't trust memory on statute numbers.
- **2026-04-22**: Misreported commit stats as "+1,068 / -70,799 net" in user-facing summary. That number came from `git diff --stat` of unstaged working tree, where git sees renames as delete+create separately. Actual committed stats (from `git show --shortstat HEAD`) were +8,241 / -1,789. Fix: always verify commit stats via `git show --shortstat HEAD` after commit; never report pre-staging diff numbers as commit results. Renames are transparent after staging; pre-staging they look like massive deletions.
- **2026-05-03**: Drafted `server/skills/boston-adu/SKILL.md` citing "Article 26A" five times as the Boston ADU governing article, projecting from generic ADU naming conventions. **Article 26A was never verified to exist.** The actual Boston structure (per BPDA Neighborhood Housing Zoning landing page) is per-neighborhood amendments via "PLAN: [neighborhood]" initiatives — Mattapan adopted Feb 2024; Roslindale / West Roxbury / Hyde Park drafts in progress. Boston Zoning Code is hosted on Municode (library.municode.com/ma/boston/codes/redevelopment_authority) but is JS-rendered, so static fetches return empty page bodies. Fix: removed all five "Article 26A" references from SKILL.md in the same Wed Phase 1 commit; future skill scaffolds must verify article numbers against Municode (or another authoritative source) before committing them, even if it means writing thinner reference files marked TBD. **Don't project article numbers from pattern-matching against other cities' codes — Boston's special-act zoning framework doesn't follow standard Ch 40A naming conventions.**
- **2026-05-03 (second instance, same root cause)**: SKILL.md and Quick-Ref table cited 780 CMR as "9th edition" in four places. The current edition is **10th Edition (effective October 2023, IRC 2021 / IBC 2021 base)** per the existing `massachusetts-adu` skill `780-cmr-essentials.md` (last_verified 2026-04-22). The "9th ed." figure was inherited from the older `ma-city-research/references/boston.md` city-research file — that file is now stale on this point. Fix: updated all four boston-adu SKILL.md references to "10th Edition" in the Thu Phase 1 commit; building-codes.md cites the state skill as the authoritative source. **General rule: when two existing files in this repo disagree on a state-code fact, trust the `massachusetts-adu` state skill over the city-research file. State-skill content is the audit-grade source; city-research is summary/operational.** Backlog item: update `ma-city-research/references/boston.md` to the 10th Edition reference in a follow-up commit (out of scope for the boston-adu Phase 1 sprint).
