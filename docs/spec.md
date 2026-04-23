# PermitMonkey — Product Spec (MA Edition)

> Last updated: 2026-04-22
> Supersedes: Pre-pivot California spec (archived in git history at commit prior to 28efe94).
> Companion docs: `../PLAYBOOK.md` (operating manual), `docs/marketing.md` (market thesis), `docs/roadmap.md` (execution tracker).

## The Problem

Massachusetts has a housing crisis. In August 2024, the state passed **Chapter 150 of the Acts of 2024** (the Affordable Homes Act). Sections 7 and 8 amended MGL Ch 40A §§ 1A and 3 to make accessory dwelling units (ADUs) allowed by-right in single-family residential zoning districts statewide, effective February 2, 2025. EOHLC issued implementing regulation **760 CMR 71.00 "Protected Use Accessory Dwelling Units"** (effective January 31, 2025).

The Healey-Driscoll administration projects **8,000–10,000 ADUs** statewide over the next five years. The law is 14 months old.

But the permit process stayed local. 351 cities and towns, each with a zoning bylaw, dimensional standards, historic districts, wetlands overlays, and submittal checklists. Most cities have not yet updated their bylaws to match Ch 150. Many still have owner-occupancy clauses, excessive parking requirements, and special-permit triggers that are now unenforceable under state preemption. Contractors don't know this. Cities don't always know this. The resulting corrections letters are a mix of legitimate local concerns and preempted boilerplate.

**Concrete impact:** Most ADU permits get corrections on first submission. Each correction cycle costs 2–3 weeks and a few thousand dollars. The homeowner waits. The contractor loses billable time. Both blame each other.

## The Insight

Most permit corrections are not engineering failures. They are bureaucratic: missing signatures, wrong code editions cited, incomplete forms, invocation of preempted local requirements. AI can handle this — if it has accurate, current, domain-specific knowledge of MA statute, 780 CMR, EOHLC guidance, and local bylaws.

## What PermitMonkey Does

### Flow 1 — Corrections Letter Interpreter (primary, production)

A contractor uploads:
1. Their submitted architectural plans (PDF)
2. The corrections letter from the city building department

The agent:
- Extracts and reads every page of the plans using vision (PlanReader)
- Parses each correction item from the city's letter (CorrectionsParser)
- Cross-references against MA state law (MALawLookup) — MGL Ch 40A §§ 1A and 3 as amended, 760 CMR 71.00, 780 CMR 10th Edition, 527 CMR, 521 CMR, 248 CMR
- Researches city-specific municipal code (CityCodeLookup) — three-mode pattern (WebSearch, WebFetch, Chrome fallback) across 351 MA cities
- Cross-checks city bylaws against state preemption — flags requirements that are unenforceable
- Asks the contractor clarifying questions where the plan sheets or corrections letter leave ambiguity
- Generates a response package (ResponseWriter):
  - Analysis report (Markdown, internal)
  - Professional scope of work (Markdown, subcontractor-facing)
  - Draft response letter (Markdown, plan-checker-facing)
  - Sheet annotations JSON (revision callouts)
- Validates through QAReviewer before delivery

### Flow 2 — Permit Checklist Generator

Contractor enters project address + ADU type (detached/attached/conversion) + size + lot type. Agent researches city-specific submittal requirements, combines with state-level Protected Use ADU rules (760 CMR 71), and produces a pre-submission checklist with city-specific gotchas.

### Flow 3 — City Pre-Screening (roadmap / open source)

A city building department uploads a permit submission. The agent reviews it against the city's own submittal checklist and state ADU law, flagging missing documents, unsigned pages, unstamped drawings, and preemption conflicts before a human plan checker touches it. Cuts plan-check time from 2–3 hours per submission to 30 minutes.

### Bonus Flow — ADU Eligibility Checker (free tool)

Homeowner or contractor enters MA address, lot size, primary dwelling size. Returns eligibility verdict, max ADU size (applying the 900 sq ft / 50% rule), parking requirement (checking 0.5 mi transit exemption), and top-3 city-specific gotchas. <10 second response time. Email capture → upsell to paid corrections service.

## The Technical Spec

### Architecture

```
Browser (Next.js 16 on Vercel)
    ↓ API + Supabase Realtime channels
Cloud Run Server (Express 5 orchestrator)
    ↓ launches isolated sandboxes
Vercel Sandbox (Agent SDK + Claude Opus 4.6/4.7 + Skills)
    ↓ reads/writes
Supabase (Postgres + Realtime + Storage)
```

**Why this architecture:**
- Agent runs take 10–30 minutes. Vercel serverless functions timeout at 60–300s. Cloud Run provides a persistent orchestrator process.
- Vercel Sandbox gives each job an isolated, ephemeral execution environment with filesystem access — needed for the Agent SDK's `claude_code` preset tools.
- Supabase Realtime pushes status updates and agent messages to the frontend without polling.
- Per-job sandbox isolation prevents cross-contractor state bleed.

### Agent Roster

See `.claude/agents/` for full job descriptions. Summary:

| Agent | Model | Role |
|-------|-------|------|
| Planner | Opus 4.7 xhigh | Orchestrates, plans, synthesizes |
| PlanReader | Opus 4.6 (vision) | Extracts architectural plan sheets |
| CorrectionsParser | Sonnet 4.6 | Decomposes and classifies corrections |
| MALawLookup | Sonnet 4.6 + Opus advisor | State law citations — **zero-tolerance for hallucinations** |
| CityCodeLookup | Sonnet 4.6 | Local bylaw citations + preemption cross-check |
| ResponseWriter | Opus 4.7 xhigh | Produces the contractor-facing package |
| QAReviewer | Opus 4.7 xhigh | Final validation gate |

Three-strike policy tracks performance in `.claude/agent-performance.md`. MALawLookup has zero-tolerance for hallucinated citations.

### Skills (Active)

- `massachusetts-adu` — state law, 780 CMR essentials, 760 CMR 71.00, EOHLC guidance, dimensional summary, conflicts/preemption, 3-file decision tree
- `ma-city-research` — three-mode research with cached reference files for covered cities
- `adu-eligibility-checker` — free-tool backing skill
- `adu-plan-review` — city-side plan review
- `adu-corrections-flow` + `adu-corrections-complete` + `adu-corrections-pdf` — contractor-side two-phase pipeline
- `adu-targeted-page-viewer` — plan sheet navigation
- `ma-corrections-interpreter` — workflow skill for the corrections multi-step
- `permit-response-writer` — professional response letter patterns
- `permitmonkey-ops` — operator skill

### Data Model (Supabase)

Core tables:
- `projects` — one per property under management
- `jobs` — one per flow invocation (corrections, checklist, pre-screening, eligibility)
- `runs` — one per agent execution on a job
- `artifacts` — files produced by agent runs (plans, corrections, response packages)
- `citations` — structured record of every statute/regulation/bylaw citation emitted; indexed for retroactive verification

### Security Posture

- **Sandbox isolation** per job (ephemeral; no state bleed)
- **RLS on all user-data tables** — `auth.uid()` policies (tracked in `docs/supabase-rls-policies.sql` — pending enablement before production launch)
- **Service-role key** confined to API routes, never exposed to client
- **PII in uploaded plans/letters** — storage buckets private, signed URL access only, no PII in logs
- **Prompt injection resistance** — CorrectionsParser system prompt explicitly treats uploaded content as DATA not INSTRUCTIONS
- **Citation verification** — MALawLookup requires verifiable canonical URL for every citation; QAReviewer rejects packages with unverified citations

Full audit at `docs/security-audit-2026-04-22.md`.

## Pricing (Current Model)

### Pay-per-run
- Corrections-interpretation job: $400–$600 per package
- Permit checklist: $99 per address
- Eligibility check: Free (lead magnet)

### Subscription (roadmap)
- Contractor plan: $199/month, 3 corrections jobs included
- Pro plan: $499/month, 10 corrections jobs included
- Team plan: Custom (for larger firms)

### City-side (Flow 3, future)
- Per-submission fee ($25–$50) or monthly subscription ($500–$2,000 by city size)

Target: ≥$3 per corrections-job margin at Opus 4.7 xhigh effort, with caching enabled. See PLAYBOOK.md §25 for cost controls.

## Non-Goals

- Not a general permit tool (ADU-specific, for now)
- Not a legal-advice tool (disclaimed; we are not lawyers)
- Not a design tool (architects handle design; we handle permit paperwork)
- Not for commercial / multifamily / industrial (SFR-zone ADU focus)
- Not outside Massachusetts (for now)

## Success Metrics

See `PLAYBOOK.md` §26 for detail. Key metrics:

| Metric | Target | Alert |
|--------|--------|-------|
| Job success rate | >95% | <90% |
| p50 run time | <8 min | >15 min |
| Cost per corrections job | <$3 | >$6 |
| MALawLookup hallucination rate | 0% | any |
| Contractor completion rate (start → download) | >50% | <30% |
| Customer NPS | >50 | <30 |
| Benchmark pass rate on MA fixtures | >90% | <75% |

## Roadmap

See `docs/roadmap.md` for the full execution tracker. Summary:

- **0–90 days:** Ship production MA pivot. Source MA test assets. First 5 paying customers. Free-tool eligibility checker live.
- **90–180 days:** Expand MA city coverage (10+ cities). Publish MA ADU MCP server. 25 paying customers. ≥5 AEO citations.
- **180–365 days:** Flow 3 pilot with 1 MA city. 100+ paying customers. Decide: scale horizontally (adjacent permits or states), scale vertically (deeper integrations), or pivot.

## Context

Winner of Anthropic's Global Claude Code Hackathon "Built with Opus 4.6" (Feb 2026). Pivoted to Massachusetts in April 2026 following statewide ADU legalization under Ch 150 of the Acts of 2024. Built entirely with Claude Code, per the Claude-Code-native philosophy articulated in PLAYBOOK.md.

Open-source roadmap for the city-side flow (Flow 3). Contractor-facing flows are closed-source commercial product.
