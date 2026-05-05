# Skills Ontology

_How the PermitMonkey skill tree composes. Cross-references master playbook
§212 (reference-don't-embed) and §221 (content engineering)._

## Five skill categories

A skill in this codebase is a directory under `server/skills/<name>/` with
a `SKILL.md` (frontmatter + body) and an optional `references/` subtree.
Skills are the **content engineering** layer — facts and procedural
knowledge that loads on demand into agent context.

| Category | Purpose | Example |
|---|---|---|
| **State** | Authoritative source of state-level law and regulation. The "audit-grade" tier. | `massachusetts-adu` |
| **City** | Per-municipality dimensional bylaws, special districts, design review, energy posture. References *up* into State for state-level facts. | `boston-adu` |
| **Flow** | Procedural workflow for one of the three product flows. Pure orchestration; no regulatory facts. | `adu-corrections-flow`, `adu-corrections-complete`, `adu-corrections-pdf` |
| **Helper** | Domain-agnostic capability invoked by Flow skills. | `pdf-extraction`, `adu-targeted-page-viewer`, `permit-response-writer` |
| **Free tool / Operator** | Backing knowledge for free-tool surfaces and operator runbooks. | `adu-eligibility-checker`, `permitmonkey-ops` |

This taxonomy maps directly to the rules in `.claude/CLAUDE.md` "Skills
Registry."

## The composition rule

**State is canonical. City references State. Flow references both. Helpers
and Free Tools reference whichever they need.**

The rule exists for two reasons:

1. **Audit grade.** Lab Notes #3 and #4 (2026-05-03) caught a city skill
   citing the wrong state-code edition because it had embedded a stale
   summary instead of pointing at the state skill. The rule eliminates a
   class of drift: when state law changes, only one file changes.
2. **Token cost.** Embedding a paragraph of state code in 5 different
   city skills costs 5× the inference tokens versus citing the state skill
   once. Master §212.

Concretely, the rule looks like this in `boston-adu/references/building-codes.md`:

```markdown
## State Floor: 780 CMR 10th Edition

The Massachusetts State Building Code is **780 CMR, 10th Edition**...

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md
| retrieved: 2026-05-03 | citation: state skill confirms 10th Edition...]
```

The citation tag points at the state skill file, not at a paraphrased copy
of its contents. The verifier (Method 1) walks the actual file at
`server/skills/massachusetts-adu/references/780-cmr-essentials.md` and
confirms the cited assertion.

## State skills

| Skill | Coverage | Reference count | Audit-grade? |
|---|---|---|---|
| `massachusetts-adu` | MGL Ch 40A as amended by St. 2024 c. 150; 760 CMR 71.00; 780 CMR 10th Ed; 225 CMR 22 (energy); 527 CMR (fire); 521 CMR (accessibility); 248 CMR (plumbing) | 12/12 | ✅ |

## City skills

| Skill | Coverage | Reference count | Lab notes |
|---|---|---|---|
| `boston-adu` | Boston special-act zoning framework; Neighborhood Housing Zoning amendments; Landmarks overlay; Specialized Opt-In Energy; ISD plan-review process | 12/12 | "Article 26A" projection caught and corrected; Municode JS-rendered limitation noted; per-neighborhood "PLAN: <neighborhood>" amendment framework documented |

**Pending Phase 3 (master plan):** `cambridge-adu`, `somerville-adu`,
`newton-adu`, `brookline-adu`. Each will follow the `boston-adu` shape:
12 reference files plus a `lab-notes.md` documenting verification source
and any deferrals.

## Flow skills

| Skill | What it does | Stateful? |
|---|---|---|
| `adu-corrections-flow` | Phase 1 of corrections: read letter, build sheet manifest, research codes, categorize items, generate contractor questions | Reads state + city skills; writes 8 JSON outputs |
| `adu-corrections-complete` | Phase 2 of corrections: fold in contractor answers, generate response paragraphs, draft revised submission | Reads Phase 1 outputs + answers |
| `adu-corrections-pdf` | Render the response package as a watermarked PDF | Pure rendering |
| `adu-plan-review` | Pre-screening checklist for one of five sheet types (site / floor / elevations / structural / MEP) | Reads city + state skills |

## Helper skills

| Skill | Capability |
|---|---|
| `pdf-extraction` | Plan-binder PDF → structured JSON via vision |
| `adu-targeted-page-viewer` | Single-sheet vision lookup |
| `permit-response-writer` | Style guard: institutional tone, no em dashes (CLAUDE.md style rule) |

## Free-tool / Operator skills

| Skill | Surface |
|---|---|
| `adu-eligibility-checker` | Backing for `/eligibility` free tool — reads state + city skills, returns verdict + citations |
| `permitmonkey-ops` | Operator runbook for sandbox lifecycle, error patterns, model-stage selection |

## Frontmatter contract

Every `SKILL.md` opens with YAML frontmatter:

```yaml
---
name: <skill-name>
description: <one-line — used to decide relevance in future conversations>
---
```

Optional fields used by some skills:

```yaml
last_verified: 2026-05-03      # for state and city skills only
relevance: critical | high | medium
key_code_sections: "MGL Ch 40A §3; 760 CMR 71.00 §§4-5"
```

## Reference-file shape

Every file under `references/` opens with YAML frontmatter parallel to the
skill's, scoped to that file:

```yaml
---
title: 780 CMR Essentials — 10th Edition Application
category: building-code
relevance: critical
key_code_sections: "780 CMR 10th Edition (effective Oct 2023)"
last_verified: 2026-04-22
---
```

The body is markdown. Every regulatory claim carries an inline provenance
tag: `[source: URL | retrieved: DATE | citation: SECTION]`. The provenance
lint rule at `server/evals/provenance-lint.ts` warns when factual sentences
are missing this tag within ±250 characters; the strict gate flips on once
the warning count hits zero.

## When a fact lives in two places

If a fact appears in both a state skill and a city-research file, the
**state skill is canonical** (Lab Note #4 rule). Procedure when you find a
disagreement:

1. Check the state skill's `last_verified` date.
2. Check the city-research file's `last_verified` date.
3. If state is newer, update the city file or delete the duplicated fact in
   favor of a citation tag pointing at the state file.
4. If city is newer (rare — would mean the city has hand-verified state
   law), promote the corrected fact into the state skill and re-verify.

This procedure is the substrate of the Self-Annealing Protocol from
`.claude/CLAUDE.md`.

## Adding a new skill

For each new city in Phase 3:

1. Mirror the `boston-adu` directory structure.
2. Author 12 reference files following the canonical category list (zoning,
   dimensional, density, parking, energy, fire, accessibility, plumbing,
   special districts, historic overlay, plan review, ordinance standards).
3. Cite `massachusetts-adu` for state-level facts; do not paraphrase.
4. Verify each citation either against Municode (if accessible — JS-rendered
   sites need browser scraping, not curl) or against the city's official
   ADU page.
5. Add a `lab-notes.md` in the new skill's root recording verification
   sources and dates and any deferrals.
6. Add at least one eval fixture under `server/evals/fixtures/` that pins
   verbatim sentences from the new skill — drift in those sentences must
   fail CI.
7. Run `npm run evals -- --strict` to confirm the gate is still green.

## See also

- `PLAYBOOK.md` Appendix A (Claude Design for PermitMonkey)
- `.claude/CLAUDE.md` Skills Registry
- `docs/master-ai-playbook.md` §212 (reference-don't-embed) and §221 (content engineering)
- `server/evals/provenance-lint.ts` (drift detection)
- `server/src/services/citation-verification.ts` (Method 1 + Method 2 verifier)
