---
name: ma-corrections-interpreter
description: Workflow skill for the corrections-interpretation multi-step pipeline for Massachusetts ADU permits. Guides the Planner agent through the full sequence (plan extraction → corrections parsing → state law lookup → city code lookup → preemption cross-check → response writing → QA validation), coordinating outputs between subagents. Use when a contractor submits a corrections-interpretation job. Pairs with massachusetts-adu (state law), ma-city-research (local bylaws), and permit-response-writer (final package authoring).
---

# MA Corrections Interpreter — Workflow Skill

## When To Use

Load this skill when starting a Flow 1 (Corrections Letter Interpreter) job. It orchestrates the full pipeline from job intake to delivered response package.

## When NOT To Use

- Flow 2 (Permit Checklist Generator) — different workflow
- Flow 3 (City Pre-Screening) — use `adu-plan-review` skill instead
- Eligibility-checker quick path — use `adu-eligibility-checker`

## Pipeline Overview

```
1. Job Intake
    ↓
2. Plan Extraction (PlanReader, Opus 4.6 vision)
    ↓ sheet manifest JSON
3. Corrections Parsing (CorrectionsParser, Sonnet)
    ↓ structured correction items JSON
4. Parallel Lookups (Sonnet subagents)
   ├── MALawLookup → state citations
   └── CityCodeLookup → local citations + preemption flags
    ↓ lookups JSON
5. Contractor Question Generation (optional pause for ambiguous items)
    ↓
6. Response Writing (ResponseWriter, Opus 4.7 xhigh)
    ↓ 4 artifacts: analysis, scope, letter, sheet annotations
7. QA Review (QAReviewer, Opus 4.7 xhigh)
    ↓ approve or revise
8. Delivery
```

## Step-by-Step Protocol

### Step 1 — Job Intake

**Inputs (from Supabase `jobs` table):**
- `plans_storage_url` — signed URL to plans PDF
- `corrections_letter_url` — signed URL to corrections letter PDF (or text)
- `project_address` — full street address
- `project_city` — parsed city name (for ma-city-research routing)
- `adu_type` — detached / attached / conversion / unknown
- `primary_dwelling_sqft` — for size rule cross-check
- `contractor_notes` — any free-text from the contractor

**Validation:**
- If any required input is missing, escalate to contractor before starting
- If city is not in MA, escalate ("This tool currently supports Massachusetts addresses only")
- If plans PDF is <3 pages or corrections letter is unreadable, escalate

### Step 2 — Plan Extraction

Dispatch **PlanReader** subagent.

**Input:** `plans_storage_url`
**Expected output:**
```json
{
  "sheet_count": N,
  "sheets": [
    {
      "page": 1,
      "sheet_number": "A-0",
      "title": "Cover Sheet",
      "scale": null,
      "date": "2026-03-15",
      "stamped": true,
      "key_callouts": ["..."]
    },
    ...
  ],
  "missing_sheets_suspected": [...],
  "unsigned_sheets": [...]
}
```

**Handoff:** Save to Supabase `sheet_manifest` field on the job. Flag any `unreadable: true` pages before proceeding.

### Step 3 — Corrections Parsing

Dispatch **CorrectionsParser** subagent.

**Input:** `corrections_letter_url` + `project_city`
**Expected output:**
```json
{
  "letter_metadata": {
    "city": "Cambridge",
    "reviewer_name": "...",
    "date": "2026-03-14",
    "review_number": 2
  },
  "correction_items": [
    {
      "id": "C-01",
      "original_text": "...",
      "category": "zoning" | "building_code" | "energy_code" | "fire_life_safety" | "accessibility" | "submittal_administrative" | "site_civil" | "structural" | "other",
      "cited_code": "...",
      "requires_lookup": ["building_code", "accessibility"]
    },
    ...
  ],
  "flags": {
    "unreadable_items": [],
    "outdated_citations": [...]
  }
}
```

### Step 4 — Parallel Lookups

Dispatch MALawLookup AND CityCodeLookup **in parallel** (both are Sonnet, no ordering dependency).

#### MALawLookup

For each `correction_item` where `requires_lookup` includes state-level category:
- Load relevant references from `massachusetts-adu` skill
- Return structured citations with verified URLs
- Use zero-tolerance citation policy (§3 of this file)

#### CityCodeLookup

For each `correction_item` where `requires_lookup` includes local/city category:
- Load relevant references from `ma-city-research` skill (Tier 1 cached → Tier 2 discover+extract → Tier 3 Chrome fallback)
- Cross-check against state preemption (MGL Ch 40A §3)
- Flag any local provision that conflicts with state law

### Step 5 — Contractor Question Generation (Optional)

Review the lookups output for ambiguities. Generate questions for the contractor where:
- The corrections item requires information not in the plans or letter (e.g., "Was this garage originally heated?")
- A design choice is needed between compliance alternatives (e.g., "Do you want to pull the detached ADU back from the side lot line to avoid fire-rated wall, or keep placement and add 1-hour rated assembly?")
- The contractor's narrative conflicts with the plans

**If questions are generated:** pause pipeline, post questions to frontend via Supabase Realtime, wait for contractor response. Max wait: 72 hours; after that, proceed with best-guess and flag.

**If no questions:** proceed directly to Step 6.

### Step 6 — Response Writing

Dispatch **ResponseWriter** (Opus 4.7 xhigh).

**Inputs to the agent:**
- Sheet manifest (from Step 2)
- Correction items (from Step 3)
- State citations (from Step 4 MALawLookup)
- Local citations + preemption flags (from Step 4 CityCodeLookup)
- Contractor answers (from Step 5, if any)
- Project metadata

**Expected outputs (four artifacts):**
1. `analysis-report.md` — contractor-facing internal breakdown
2. `scope-of-work.md` — subcontractor-facing scope statement
3. `response-letter.md` — plan-checker-facing response letter
4. `sheet-annotations.json` — per-sheet revision callouts

See `permit-response-writer` skill for the detailed authoring patterns.

### Step 7 — QA Review

Dispatch **QAReviewer** (Opus 4.7 xhigh).

**Checks:**
- Every citation in the response letter traces back to a verified entry in MALawLookup / CityCodeLookup output
- No CA sources cited (no CBC/CRC/CPC/HCD/Gov Code §66310-66342)
- Preemption arguments invoked wherever CityCodeLookup flagged a conflict
- No marketing language, no em dashes
- Sheet annotations reference real sheet numbers
- All four artifacts present

**Outputs:**
- `approve` → proceed to Step 8
- `reject` → return to ResponseWriter with specific issues; max 2 revision cycles before escalation

### Step 8 — Delivery

- Upload artifacts to Supabase Storage under `jobs/{job_id}/response-package/`
- Update `jobs.status = 'complete'`
- Push notification to frontend via Supabase Realtime
- Email the contractor a download link (via Resend/Postmark)

## Error Handling

Each step has specific failure modes documented in the individual agent JDs. Pipeline-level escalations:

| Situation | Action |
|-----------|--------|
| Plans corrupt/unreadable | Escalate to contractor for re-upload |
| Corrections letter not in English | Escalate (not supported) |
| Address not in MA | Escalate with clear message |
| MALawLookup returns `verified: false` for a critical item | Halt pipeline, escalate to human review |
| CityCodeLookup unable to find city bylaw | Continue with state-only analysis + flag |
| QAReviewer rejects twice | Escalate to human review |
| Agent hits 3 strikes | Pipeline halts; rebuild agent per `.claude/agent-performance.md` |

## Token Budget

Typical corrections-interpretation job:

| Step | Agent | Model | Effort | Tokens (in/out) |
|------|-------|-------|--------|----------------|
| 2 | PlanReader | Opus 4.6 | medium | 50K / 5K |
| 3 | CorrectionsParser | Sonnet 4.6 | medium | 10K / 3K |
| 4a | MALawLookup | Sonnet 4.6 | medium | 20K / 5K |
| 4b | CityCodeLookup | Sonnet 4.6 | medium | 30K / 5K |
| 5 | (optional) | — | — | 5K / 2K |
| 6 | ResponseWriter | Opus 4.7 | xhigh | 30K / 15K |
| 7 | QAReviewer | Opus 4.7 | xhigh | 40K / 5K |

**Total target:** ~185K input, ~40K output per job. At Opus 4.7 pricing with caching enabled, target cost is <$3 per job.

## Caching Strategy

- `massachusetts-adu` skill content is static; cache at 1h TTL
- `ma-city-research` references cache at 30-day TTL (bylaws don't change daily)
- Plan extractions cache per (plan hash, agent version) — same contractor rerun doesn't re-extract

## Preemption Cross-Check Discipline

**Critical:** For every CityCodeLookup finding, MALawLookup must ALSO have been consulted on the relevant state provision. If CityCodeLookup identifies a local rule that conflicts with state law, the response MUST:

1. Acknowledge the local bylaw respectfully
2. Cite the state statute or regulation that preempts
3. Invoke preemption (polite but firm)
4. Offer a compliance alternative if one exists

See `massachusetts-adu/references/conflicts-and-preemption.md` for the full preemption reasoning tree.

## Self-Annealing Hooks

When an agent fails or produces poor output at any step:

1. **DIAGNOSE:** Which agent failed? What was the input? What was the expected vs. actual output?
2. **FIX:** Try once with a clearer spec before escalating
3. **UPDATE:** If systemic, update the agent's JD in `.claude/agents/` and the relevant skill reference
4. **DOCUMENT:** Log to `.claude/CLAUDE.md` Lab Notes

## Output Contract (Job Completion)

```json
{
  "job_id": "...",
  "status": "complete",
  "duration_seconds": 480,
  "token_spend_usd": 2.35,
  "qa_decision": "approve",
  "qa_confidence": 0.92,
  "artifacts": {
    "analysis_report": "jobs/{job_id}/analysis-report.md",
    "scope_of_work": "jobs/{job_id}/scope-of-work.md",
    "response_letter": "jobs/{job_id}/response-letter.md",
    "sheet_annotations": "jobs/{job_id}/sheet-annotations.json"
  },
  "citations_count": 12,
  "citations_verified": 12,
  "preemption_items_flagged": 2
}
```

## Metrics to Report

Each completed job writes metrics to Supabase `job_metrics`:
- Total duration
- Tokens in/out per step
- Cost in USD
- Citation count (and verified count)
- Preemption items flagged
- QA revision cycles used
- Contractor clarification pause (yes/no, duration)

These feed the weekly performance report routine (PLAYBOOK.md §26).
