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

Active skills after pivot:
- `massachusetts-adu` — state law, regulations, EOHLC guidance
- `ma-city-research` — three-mode research for MA municipalities
- `ma-corrections-interpreter` — workflow for the corrections multi-step
- `permitmonkey-ops` — operator knowledge
- `pdf-extraction` — plan sheet vision
- `permit-response-writer` — response letter patterns
- `adu-eligibility-checker` — free-tool backing skill

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
