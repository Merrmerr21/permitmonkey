---
name: permit-response-writer
description: Authoring patterns for the contractor-facing response package produced at the end of the corrections-interpretation pipeline. Covers voice, structure, citation format, and tone for the four deliverables (analysis report, scope of work, response letter, sheet annotations). Use when ResponseWriter agent is composing the final package. Pairs with massachusetts-adu (state citations) and ma-city-research (local citations).
---

# Permit Response Writer — Authoring Patterns

## When To Use

ResponseWriter agent (Opus 4.7 xhigh) invokes this skill at Step 6 of the corrections-interpretation pipeline (see `ma-corrections-interpreter`). Loads this skill's body to produce the four deliverables in a consistent voice.

## The Four Deliverables

### 1. Analysis Report (`analysis-report.md`)

**Audience:** The contractor, internal use. Not shown to plan checker.

**Purpose:** Show the contractor what's going on with each correction — what the city asked, what the state/local code says, what the response approach is, and any open questions.

**Structure:**

```markdown
# Corrections Analysis — [Project Address]

**Job ID:** ...
**Date:** 2026-04-22
**City:** Cambridge
**Review cycle:** 2 of (typical 2-4)

## Summary

[2-3 sentences. Headline numbers: X corrections total, Y responded directly, Z requiring contractor input, W flagged as preempted.]

## Corrections — Item by Item

### Correction C-01 — [Category]

**City's text (verbatim):**
> [Exact text from corrections letter]

**Cited authority:**
- City cited: [what they cited]
- Verification: [what the authority actually says]

**Our analysis:**
[2-4 sentences explaining the issue, whether it's legitimate, and what the response approach is]

**Response approach:**
- [Bullet 1]
- [Bullet 2]

**Open question for contractor (if any):**
[Specific question]

**Affected sheets:**
[List of sheet numbers]

---

(Repeat for each correction item)

## Preemption Items

[Items where the city's correction invokes a bylaw preempted by Ch 150 of 2024. Call these out separately so the contractor can see the preemption argument.]

## Next Steps

1. Review this analysis
2. Answer the [N] open questions below
3. We'll generate the final response letter and scope of work
4. Plan revisions: [if applicable, pointer to sheet annotations]
```

### 2. Scope of Work (`scope-of-work.md`)

**Audience:** Subcontractors (architect, structural engineer, MEP engineers, general contractor).

**Purpose:** A clean statement of what will be changed in the plans to address the corrections. Usable for cost estimation and coordination.

**Structure:**

```markdown
# Professional Scope of Work — [Project Address]

**Project:** Accessory Dwelling Unit, [Address]
**ADU Type:** [Detached / Attached / Conversion]
**Current Review Cycle:** 2 of (typical 2-4)
**Prepared:** 2026-04-22

## Summary of Changes

[Bulleted list of high-level changes to the plan set]

## Detailed Scope — By Discipline

### Architectural

**Sheet A-2 (First Floor Plan):**
- [Specific change]
- [Specific change]

**Sheet A-5 (Elevations):**
- [Specific change]

### Structural

[If any]

### MEP (Mechanical, Electrical, Plumbing)

**Electrical:**
- [Per 527 CMR 12 adoption of NEC 2023 with MA amendments — specific change]

**Plumbing (248 CMR):**
- [Specific change]

**Mechanical:**
- [Specific change, including any energy code (Stretch/Specialized) implications]

### Energy Code Compliance

- Applicable code: [Stretch or Specialized Opt-In]
- HERS rating target: [number]
- Key envelope values: [walls R-value, roof R-value, windows U-factor]
- Renewable offset (if Specialized): [heat pumps, solar PV ready, etc.]

### Civil / Site

[If any]

## Excluded From This Scope

- [Things NOT being changed, for clarity]
- [Items contractor/owner must procure separately]

## Sign-Off

Upon plan revision, subcontractors should confirm scope completion by initialing the relevant sheet in the revision package.
```

### 3. Response Letter (`response-letter.md`)

**Audience:** City plan checker.

**Purpose:** Respond to each correction item with what was done and why, citing authorities.

**Tone:** Professional, institutional, understated. Cite, don't assert. Polite but firm when invoking state preemption.

**Structure:**

```markdown
[Letterhead — contractor firm, date, addressed to plan checker and city]

RE: Response to Plan Check Corrections — [Project Address]
Permit Application No.: [number]
Review Cycle: 2 of (typical 2-4)

Dear [Plan Checker Name],

Thank you for the corrections letter dated [date] regarding the above-referenced accessory dwelling unit permit application. We have reviewed each item and respond in order below.

## Item 1 — [City's Correction Summary]

**City's correction:** "[Exact quote from letter]"

**Response:** [What was done, where on the plans, with reference to applicable code]

**Reference:** 780 CMR [section], IRC [section]. [Optional: URL]

**Plan Sheet Affected:** [Sheet numbers with revision cloud callouts]

---

## Item 2 — [Category]

[Same structure]

---

## Item X — [Preemption Example]

**City's correction:** "The applicant must attest that the owner will occupy either the principal dwelling or the accessory dwelling unit."

**Response:** We respectfully note that this requirement is preempted by MGL Ch 40A § 3, as amended by St. 2024, c. 150, § 8, which provides in relevant part: "The use of land or structures for an accessory dwelling unit under this paragraph shall not require owner occupancy of either the accessory dwelling unit or the principal dwelling."

We have not included an owner-occupancy attestation on the revised plans and respectfully request that this correction item be withdrawn.

**Reference:**
- MGL Ch 40A § 3 (as amended): https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3
- Chapter 150 of the Acts of 2024, § 8: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150
- 760 CMR 71.00 (Protected Use ADU): https://www.mass.gov/info-details/accessory-dwelling-units

---

[Continue for all items]

## Summary

Total corrections in this cycle: [N]
Responses provided: [N]
Items flagged for preemption: [M]
Items requiring clarification: [P]

We believe this submission addresses all corrections. Please contact us if any item requires additional information or revision.

Respectfully,

[Contractor Signature Block]
```

### 4. Sheet Annotations (`sheet-annotations.json`)

**Audience:** The architect/designer revising the plans, and the city reviewer tracing revisions.

**Purpose:** Machine-readable callouts per sheet. Tells the designer where to add revision clouds and annotations.

**Structure:**

```json
{
  "project": "Accessory Dwelling Unit — [Address]",
  "revision_cycle": 2,
  "date": "2026-04-22",
  "sheets": [
    {
      "sheet_number": "A-2",
      "sheet_title": "First Floor Plan",
      "annotations": [
        {
          "correction_id": "C-03",
          "annotation_type": "revision_cloud",
          "location": "Kitchen area, approximately grid line 3",
          "note": "Add emergency egress compliant with IRC R310. New egress window meeting 5.7 sq ft net clear opening, min 24 inch height, min 20 inch width, max 44 inch sill height.",
          "code_reference": "IRC R310 as adopted by 780 CMR Ch 51"
        },
        {
          "correction_id": "C-04",
          "annotation_type": "dimensional_callout",
          "location": "South wall of ADU",
          "note": "Update dimension to show 5'-0\" setback (previously showed 3'-6\"). This removes need for fire-rated exterior wall.",
          "code_reference": "IRC R302.1 Table R302.1(1)"
        }
      ]
    },
    {
      "sheet_number": "A-5",
      "sheet_title": "Elevations",
      "annotations": [
        {
          "correction_id": "C-07",
          "annotation_type": "callout",
          "location": "All elevations",
          "note": "Add note stating: 'All exterior wall assemblies comply with 780 CMR Ch 51 / IRC R302.'"
        }
      ]
    }
  ]
}
```

## Voice Rules (Non-Negotiable)

### DO

- Use passive voice where appropriate for institutional tone ("has been added" rather than "we added")
- Cite specific sections ("780 CMR Ch 51 / IRC R310.1" not "the building code")
- Include URLs for every statute and regulation
- Acknowledge the city's position before pivoting to your response
- Use full, unabbreviated code references in the first mention, then shortened in subsequent mentions
- Include a "Respectfully" closing

### DO NOT

- Use em dashes (AI tell — use hyphens or parenthetical commas instead)
- Use marketing language ("exceptional," "innovative," "cutting-edge," "seamless")
- Use hedging language where the statute is clear ("may," "perhaps" — if the state law is definitive, be definitive)
- Argue or accuse
- Invoke state preemption casually — only for clear conflicts, with full citation
- Include internal notes from the analysis report in the plan-checker-facing response letter

## Citation Formatting

### State statute
`MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8`

### State regulation
`760 CMR 71.03` (or equivalent section)

### Building code
`780 CMR Chapter 51 (adopting IRC 2021)` — first mention
`780 CMR / IRC R310.1` — subsequent mentions

### Local bylaw
`Cambridge Zoning Ordinance § 4.22` — with URL on first mention

### URL placement

On first citation in the response letter, include the URL inline in parentheses:

> MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8 (https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3)

On subsequent citations, omit URL.

The analysis report always includes URLs for every citation.

## Preemption Invocation Pattern

When invoking state preemption in the response letter, use this template:

```
**Response:** We respectfully note that this requirement is preempted by [STATE AUTHORITY CITATION], which provides in relevant part:

> "[Exact statute or regulation text]"

[Our interpretation in one sentence]

We have [action taken — e.g., not included the owner-occupancy attestation] on the revised plans and respectfully request that this correction item be withdrawn.

**Reference:**
- [Full citation with URL]
```

This template:
- Opens with "respectfully" (tone)
- States preemption clearly (no hedging)
- Provides the exact statutory text (no paraphrasing)
- Offers a brief interpretation
- States what was done in response
- Makes the explicit request to withdraw the correction
- Closes with sourced citation

## Handling Edge Cases

### City cites a repealed statute
Note the repeal, cite the replacement, continue with the replacement's requirements.

### City's correction is unclear
Request clarification in the response letter AND flag in the analysis report AND generate a contractor question.

### City invokes a local bylaw with gray-area preemption
Comply if compliance is reasonable. Reserve preemption argument for clear conflicts only.

### City's correction is substantively wrong on facts (e.g., miscounts stories)
Politely note the factual discrepancy with evidence from the plans, offer to clarify.

## Final QA Checklist (Before Delivery)

Before marking the package complete, verify:

- [ ] Every citation in the response letter has a `verified: true` entry from MALawLookup or CityCodeLookup output
- [ ] No CA sources cited (CBC/CRC/CPC/HCD/Gov Code §§66310-66342)
- [ ] No em dashes in the response letter
- [ ] No marketing language
- [ ] Preemption arguments invoked only where CityCodeLookup flagged a conflict
- [ ] Sheet annotations reference real sheet numbers from PlanReader output
- [ ] Scope of work and response letter agree on what changed
- [ ] All four artifacts present in the deliverable
- [ ] Contractor signature block uses actual contractor info from job metadata
- [ ] Analysis report flags any contractor clarifying questions

## Source

- Patterns derived from institutional MA architect/engineer response letter conventions, MGL Ch 40A §3 as amended by St. 2024, c. 150, §8, 760 CMR 71.00, and 780 CMR 10th Edition.
- Tone guidance: PLAYBOOK.md §10 (style) and `.claude/CLAUDE.md` (voice rules).

**Last verified:** 2026-04-22
