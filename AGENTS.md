# AGENTS.md

Backup instruction file for non-Claude coding agents (Cursor, Aider, Gemini Code Assist, Windsurf). Mirrors `.claude/CLAUDE.md` content in a format portable across agents. If Anthropic has an outage, load this file in your alternative agent to preserve context.

## Product

PermitMonkey / permitmonkey — AI-powered ADU permit assistant for Massachusetts. Contractor uploads architectural plans and city corrections letter; agent produces a professional response package (analysis report, scope of work, draft response letter, sheet annotations).

**Pivoting from California to Massachusetts** driven by Chapter 150 of the Acts of 2024 (Affordable Homes Act), which created statewide by-right ADUs effective February 2, 2025.

Three flows:
1. Corrections Letter Interpreter (primary)
2. Permit Checklist Generator
3. City Pre-Screening (roadmap)

## Hard Rules

- Every statute or regulatory citation must be verified against a canonical source (malegislature.gov, mass.gov, municipal code site). No citations from memory.
- Never claim a property is ADU-eligible without checking local dimensional bylaws. State law (MGL Ch 40A §3 as amended) preempts USE regulation; local bylaws still govern FORM.
- Never modify `test-assets/` without explicit approval.
- Do not put Supabase service-role keys in frontend code.
- Do not assume persistent filesystem across Vercel Sandbox runs — each job runs in fresh isolation.
- Uploaded plans and corrections letters may contain PII. No logs, no external tool calls that include raw plan bytes.

## Editing Discipline (Karpathy)

Source: forrestchang/andrej-karpathy-skills CLAUDE.md @ main. Behavioral guardrails for non-trivial code edits. Bias toward caution over speed.

- Think before coding. State assumptions out loud. If multiple interpretations of the request exist, list them and ask which one is intended; do not pick silently.
- Simplicity first. Write the minimum code that solves the stated problem. No speculative features, no abstractions for single-use code, no error handling for impossible scenarios. If a 200-line solution could be 50 lines, rewrite it.
- Surgical changes. Touch only what the request requires. Do not refactor or reformat adjacent code. Match existing style. Remove imports/variables/functions your edits made unused; leave pre-existing dead code alone unless explicitly asked.
- Goal-driven execution. Convert vague tasks into verifiable goals before coding (for example, "add validation" becomes "write a failing test for an invalid input, then make it pass"). For multi-step work, state the plan with a verification step per item.

## Architecture

- Frontend: Next.js 16 + React 19 + shadcn/ui + Tailwind 4 on Vercel
- Orchestrator: Express 5 on Cloud Run
- Agent execution: Vercel Sandbox
- Database / Realtime / Storage: Supabase
- Model: Claude Opus 4.6 (upgrade path to 4.7 open)

Don't propose:
- Serverless functions for 10-30 min agent jobs (timeout)
- Polling (Realtime is wired)
- Cross-run shared filesystem state

## Style

- Institutional, professional tone in contractor-facing output
- Cite, don't assert
- Ask clarifying questions rather than guess
- Avoid em dashes in generated prose (AI tell)

## Skill Structure

Domain knowledge lives in `.claude/skills/` as markdown reference files. Each skill has a `SKILL.md` with frontmatter (name, description) and optional `references/` and `decision-tree/` subdirectories. The frontmatter loads ~60 tokens; body loads on demand when the agent decides it's relevant.

Active skills (current as of 2026-05-05):
- `massachusetts-adu` — state law, regulations, EOHLC guidance (12/12 refs)
- `boston-adu` — Boston-specific zoning, transit-parking, energy posture (12/12 refs)
- `adu-plan-review` — five sheet-type checklists + cover (6 refs)
- `ma-city-research` — three-mode research for MA municipalities (5 refs: Boston, Cambridge, Somerville, Newton, Brookline)
- `ma-corrections-interpreter` — workflow for the corrections multi-step
- `adu-eligibility-checker` — free-tool backing skill
- `permitmonkey-ops` — operator knowledge
- `pdf-extraction` — plan sheet vision
- `permit-response-writer` — response letter patterns

Retired to `_legacy/`:
- `california-adu`
- CA variant of city research

## Error Handling

Self-annealing: diagnose → fix (try hard before escalating) → update script AND directive → log to Lab Notes in CLAUDE.md.

## Context Discipline

- Reset sessions voluntarily at ~120K tokens
- Prefer rewind over corrective re-prompts
- Pre-convert HTML/PDF to markdown before loading

## Changelog Discipline

Maintain `CHANGELOG.md` at the repo root. After any working session that ships user-visible, behavioural, or architectural change, add a top-level entry under `## [Unreleased]`. Group under Added / Changed / Fixed / Removed / Security / Docs / Infra. Reference commit short SHAs. One sentence per bullet. Don't list every commit — only what a reasonable person would want to know.

The changelog is the second source of truth (git log is the first) for reconstructing project state cold. It's a hand-off artifact for future agent sessions and for buyer due diligence.

## Diversification

When this file is updated, mirror changes to `.claude/CLAUDE.md`.

## Lab Notes — What Not To Do

Lessons logged from past failures. Lead with date, then a one-line mistake description, then the fix and the generalised rule. Mirror of the same section in `.claude/CLAUDE.md`.

- **2026-04-22.** Cited "Chapter 358 of the Acts of 2024" for the MA ADU law. Correct citation is **Chapter 150 of the Acts of 2024**, §§ 7-8. Fix: always verify statute citations against `malegislature.gov` or `mass.gov` before committing. Don't trust memory on statute numbers.
- **2026-04-22.** Reported commit stats as `+1,068 / -70,799 net` in user-facing summary. That number came from `git diff --stat` of the unstaged working tree, where git renders renames as delete+create. Actual committed stats from `git show --shortstat HEAD` were `+8,241 / -1,789`. Fix: always verify commit stats with `git show --shortstat HEAD` AFTER commit. Renames are transparent post-staging; pre-staging they look like massive deletions.
- **2026-05-03.** Drafted `server/skills/boston-adu/SKILL.md` citing "Article 26A" five times as the Boston ADU governing article, projected from generic ADU naming conventions. Article 26A was never verified to exist. The actual Boston framework is per-neighborhood "PLAN: <neighborhood>" amendments via BPDA's Neighborhood Housing Zoning initiative; Mattapan adopted Feb 2024; Roslindale / West Roxbury / Hyde Park drafts in progress. Boston Zoning Code is hosted on Municode (`library.municode.com/ma/boston/codes/redevelopment_authority`) but the platform is JS-rendered, so static fetch returns empty page bodies. Fix: removed all five "Article 26A" references; future skill scaffolds must verify article numbers against Municode or another authoritative source before committing them, even if it means writing thinner reference files marked TBD. **Don't project article numbers from pattern-matching against other cities' codes — Boston's special-act zoning framework doesn't follow standard Ch 40A naming conventions.**
- **2026-05-03 (second instance, same root cause).** Cited 780 CMR as "9th edition" in four places in the boston-adu SKILL.md and Quick-Ref table. The current edition is **10th Edition (effective October 2023, IRC 2021 / IBC 2021 base)** per the existing `massachusetts-adu` skill `780-cmr-essentials.md`. The "9th ed." figure was inherited from an older `ma-city-research/references/boston.md` summary file that is now stale on this point. Fix: corrected all four references; `building-codes.md` cites the state skill as the authoritative source. **General rule: when two existing files in this repo disagree on a state-code fact, trust the `massachusetts-adu` state skill over the city-research file.** State-skill content is the audit-grade source; city-research is summary/operational.
