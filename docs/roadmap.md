# PermitMonkey — Roadmap

> **Source of truth:** `PLAYBOOK.md` §34. This file is the operational tracker — checkboxes, dates, ownership. The playbook is the strategy; this is the execution.
> **Updated:** 2026-04-22
> **Cadence:** Review weekly (Monday), update status on every meaningful change.

---

## Phase 0 — Pivot Execution (0–90 days, target completion: 2026-07-22)

Core MA pivot work. Goal: ship a production-ready MA ADU permit assistant and land first paying customers.

### Foundation (done in April 2026 pivot sprint)

- [x] Write `PLAYBOOK.md` — operating manual for the project
- [x] Create `.claude/CLAUDE.md` — project rules for Claude Code sessions
- [x] Create `AGENTS.md` — backup instructions for non-Claude agents
- [x] Create `.claude/agents/` — 7 agent job descriptions (Planner, PlanReader, CorrectionsParser, MALawLookup, CityCodeLookup, ResponseWriter, QAReviewer)
- [x] Create `.claude/agent-performance.md` — three-strike tracking
- [x] Retire CA skills to `_legacy/` (regression-preserved)
- [x] Build `massachusetts-adu` skill — SKILL.md + 7 references + 3 decision-tree files
- [x] Build `ma-city-research` skill — SKILL.md + Boston + Cambridge + Somerville references
- [x] Build `adu-eligibility-checker` skill — free-tool spec
- [x] Mirror MA skills to `server/skills/` for production agent
- [x] Rename `crossbeam-ops` → `permitmonkey-ops`
- [x] Rename `agents-crossbeam/` → `agents-permitmonkey/`
- [x] Update `README.md` for MA positioning
- [x] Update `docs/marketing.md` and `docs/marketing-city.md` for MA
- [x] Create `docs/aeo-content-framework.md` — top 20 Q&A plan
- [x] Run security audit → `docs/security-audit-2026-04-22.md`

### Code pivot (remaining in Phase 0)

- [ ] Deep rewrite `server/skills/adu-plan-review/references/checklist-cover.md` — currently CA-specific code references (CBC, CRC, CPC, CMC, CEC, CEnC, CFC); needs MA equivalents (780 CMR, 248 CMR, 527 CMR, Stretch / Specialized Code, etc.)
- [ ] Rewrite `docs/spec.md` for MA
- [ ] Verify `frontend/` components — update any hardcoded CA text / HCD references
- [ ] Verify `frontend/app/(dashboard)/dashboard/page.tsx` copy — update MA framing
- [ ] Verify `frontend/lib/dev-fixtures.ts` — swap CA fixtures for MA placeholders
- [ ] Verify `server/src/utils/config.ts` — check for CA-specific config
- [ ] Verify `server/src/services/extract.ts`, `server/src/services/sandbox.ts` — update any domain-specific strings

### Test assets — CRITICAL PATH

- [ ] Source 5+ real MA ADU permit submissions (plans + corrections letter + metadata)
  - [ ] Outreach to MA-based ADU architects via Google search + cold email
  - [ ] Public records requests to priority cities
  - [ ] Leverage Merritt's JLL network for intros
  - [ ] Reddit r/Boston / r/CambridgeMA posts
- [ ] Anonymize each test asset (redact owner names, contractor license numbers)
- [ ] Obtain written consent for use
- [ ] Build `test-assets/ma/` structure with fixtures
- [ ] Write expected-output benchmarks
- [ ] Integrate into CI / pre-release benchmark suite

### Pre-MA-launch security hardening

- [ ] Enable Supabase RLS on all user-data tables; commit policies to `docs/supabase-rls-policies.sql`
- [ ] Audit PII in server logs; add redaction pass
- [ ] Verify storage bucket ACLs (no public read)
- [ ] Explicit CORS policy for Cloud Run server
- [ ] Add centralized error-response sanitizer
- [ ] Prompt injection hardening on CorrectionsParser (system prompt + input scan)
- [ ] `npm audit` on frontend + server; fix CVEs
- [ ] Citation verification QA step in production pipeline

### Free-tool funnel (1–2 weekend sprints)

- [ ] Build `/eligibility` landing page
- [ ] Wire `adu-eligibility-checker` skill to a fast-path API route (Sonnet 4.6 or Haiku)
- [ ] Email capture (Supabase table + Resend or Postmark for transactional)
- [ ] Share-card SVG → PNG renderer
- [ ] Per-city landing pages: `/eligibility/boston`, `/eligibility/cambridge`, `/eligibility/somerville`

### AEO content (start authoring)

- [ ] Tier 1 answers (5 bedrock questions) published
- [ ] Schema markup (FAQPage, Answer) added
- [ ] Internal linking between answers
- [ ] Submit to Perplexity / Google for indexing

### First paying customers

- [ ] Identify 10 MA contractors to onboard (from JLL network + free-tool email captures)
- [ ] Personal outreach
- [ ] First paid corrections-interpretation delivery
- [ ] Case study from first success

### Exit criteria for Phase 0

- Production-deployed MA version of PermitMonkey
- 5+ MA test fixtures passing benchmark
- RLS + security baseline complete
- 5 Tier 1 AEO answers live
- ≥5 paying MA contractors

---

## Phase 1 — Market Build (90–180 days, target: 2026-10-22)

Goal: expand city coverage, publish MCP server, establish AEO citation presence, grow to 25 paying customers.

- [ ] Add Newton `ma-city-research` reference file
- [ ] Add Brookline `ma-city-research` reference file
- [ ] Add Worcester `ma-city-research` reference file
- [ ] Add Quincy `ma-city-research` reference file
- [ ] Add Lowell `ma-city-research` reference file
- [ ] Plus 5 more priority MA municipalities (total 10 covered)
- [ ] Publish MA ADU MCP server to Smithery, MCPT, Open Tools
- [ ] AEO Tier 2 content (5 city-specific answers) published
- [ ] AEO Tier 3 content (5 advanced operator answers) published
- [ ] Paid Google Ads campaign on top 5 queries
- [ ] Content repurposing engine — weekly voice memo → multi-channel posts
- [ ] Viral artifact (eligibility scorecard) share card live
- [ ] 25 paying contractors
- [ ] Track ≥5 AEO queries where PermitMonkey is cited as primary source

### Exit criteria for Phase 1

- 10+ MA cities with dedicated `ma-city-research` reference files
- MA ADU MCP server live and listed in 2+ registries
- 15+ AEO answers published with schema markup
- ≥5 Perplexity / ChatGPT citations
- 25 paying MA contractors

---

## Phase 2 — Scale or Pivot (180–365 days, target: 2027-04-22)

Goal: validate scaling thesis or decide on pivot direction. Begin Flow 3 pilot. Consider adjacent markets.

- [ ] Flow 3 (city pre-screening) design and implementation
- [ ] Flow 3 pilot with 1 MA building department
- [ ] Flow 3 case study + metrics
- [ ] 20+ MA cities covered
- [ ] Tier 4 AEO content (5 edge-case answers) published
- [ ] Consider adjacent MA permit types (residential additions, solar, decks) if ADU market saturates
- [ ] Consider adjacent states (RI, NH, CT) if MA market is mature enough
- [ ] 100+ paying contractors

### Exit criteria for Phase 2

Decision point — one of:
- **Scale horizontally** (adjacent permit types or adjacent states)
- **Scale vertically** (deeper integrations, larger deals)
- **Pivot** (if market signal is weaker than projected)
- **Acqui-hire / strategic acquisition** (if incumbents take notice)

---

## Ongoing (All Phases)

- [ ] Weekly performance report (Monday 7am automated)
- [ ] Weekly review of corrections-job outputs for quality regressions
- [ ] Monthly full MA test-asset benchmark
- [ ] Quarterly source re-verification on all skill references (URLs, statute text)
- [ ] Quarterly PLAYBOOK.md review and update

---

## Pivot Triggers

Explicit conditions that would change the plan (from `PLAYBOOK.md` §35):

1. **Chapter 150 weakened or overridden** — legislative rollback unlikely but possible; fallback is broader permit-friction positioning
2. **Well-funded competitor stakes MA** — revisit; our advantage is local expertise + Merritt's network + Claude Code execution speed, not capital
3. **MA ADU volume does not materialize** — if <500 permits/year total across priority cities after 12 months, pivot to adjacent permit types where volume is higher
4. **CAC exceeds LTV for 3 months** — reposition or drop paid acquisition, double down on free-tool + referral

---

## Open Questions / Decision Points

- [ ] Pricing: per-job flat fee vs. subscription? (Current bias: per-job first, subscription later)
- [ ] Partner contractor referral model: fee / revenue share / none?
- [ ] Brand: keep "PermitMonkey" or revisit before production launch?
- [ ] Legal entity: sole proprietor / LLC? (When should Merritt formalize?)
- [ ] Insurance: E&O needed for launch?

---

*End of roadmap. Update status weekly; update structure only with Merritt approval.*
