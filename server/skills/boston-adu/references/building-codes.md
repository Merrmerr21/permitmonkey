---
title: Boston Building Code — 780 CMR Application and Boston Energy Code Posture
category: building-code
relevance: critical
key_code_sections: "780 CMR 10th Edition (effective Oct 2023, IRC 2021 / IBC 2021 base); 225 CMR 22 (Stretch Energy Code); 225 CMR 22 Appendix RC (Specialized Opt-In Energy Code) — Boston is on Specialized; 248 CMR (MA Plumbing Code); 527 CMR (MA Fire Prevention)"
last_verified: 2026-05-03
---

# Boston Building Code — Application and Posture

## State Floor: 780 CMR 10th Edition

The Massachusetts State Building Code is **780 CMR, 10th Edition**, effective October 2023. The 10th Edition adopts the 2021 International Residential Code (IRC) and 2021 International Building Code (IBC) as base codes, with Massachusetts-specific amendments.

[source: https://www.mass.gov/state-building-code | retrieved: 2026-04-22 | citation: cited in `massachusetts-adu` skill `780-cmr-essentials.md` (last_verified 2026-04-22)]

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill confirms 10th Edition with IRC 2021 / IBC 2021 base, effective Oct 2023]

**Edition currency note:** Some older Boston ADU corrections and project files reference 780 CMR 9th Edition. Projects permitted before October 2023 may be grandfathered into the 9th Edition; projects permitted after that date must comply with the 10th Edition. When a Boston correction cites the 9th Edition for a post-October-2023 permit, flag the edition mismatch in the response.

## Boston-Specific Amendments to 780 CMR — TBD

ISD enforces 780 CMR as the state code; most Massachusetts municipalities (including Boston) do not amend the body of 780 CMR itself. However, individual ISD policies, plan-review interpretations, and BFD-coordinated requirements layer on top of the state code in practice.

**TBD — verification pending:** A definitive list of any Boston-specific amendments to or interpretations of 780 CMR. None were identified in the 2026-05-03 research session. Contact ISD or pull current ISD policy memos before asserting a Boston-specific code amendment in a contractor response.

## Energy Code: Boston Has Adopted the Specialized Opt-In Code

The Massachusetts energy code framework provides three paths:

- **Base Code** — IECC 2021 with MA amendments (state default, ~30% of MA municipalities by adoption count)
- **Stretch Energy Code** — 225 CMR 22; higher performance than Base; majority of MA municipalities
- **Specialized Opt-In Code** — 225 CMR 22 Appendix RC; net-zero or near-net-zero performance; ~60 municipalities including Boston, Cambridge, Somerville, Newton, Brookline

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill `780-cmr-essentials.md` lists Boston in the Specialized Opt-In municipalities ("~60 municipalities including Boston, Cambridge, Somerville, Newton, Brookline")]

[source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: city-research file confirms "Boston has adopted the Specialized Opt-In Code"]

**Implications for a Boston ADU:**

- All-electric heating (heat pumps) **OR** renewable offset (solar PV typically) — fossil-fuel space and water heating effectively requires offset
- Higher envelope R-values than baseline IRC
- Solar-ready provisions (conduit pathway, electrical panel capacity, structural roof load)
- HERS rating typically 45–55 for compliance
- Mechanical ventilation per IRC M1505 (whole-house, ASHRAE 62.2)

[source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md | retrieved: 2026-05-03 | citation: city-research file lists Specialized Opt-In implications for Boston ADUs]

When a Boston ADU correction invokes energy-code compliance, default to Specialized Opt-In requirements unless the project documentation establishes a base- or stretch-only carve-out.

## Commonly Cited 780 CMR Sections in Boston ADU Plan Reviews

These are high-frequency correction topics carried forward from the state-skill `780-cmr-essentials.md` (the state-skill file is authoritative on the underlying rule; this file is for Boston-specific application notes):

### Egress (IRC R310 as adopted by 780 CMR)

Every sleeping room requires emergency escape and rescue opening: minimum 5.7 sq ft net clear area, minimum 24" height, minimum 20" width, max sill height 44" above finished floor.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill quotes IRC R310 dimensional requirements]

Boston-specific note: many conversion ADUs (basement finishes especially) struggle to meet R310 sill-height and net-clear-area requirements with existing window openings. ADU egress is one of the most frequent Boston corrections; specify window dimensions and location on plans, do not assume existing windows comply.

### Smoke and CO Alarms (IRC R314, R315; MA Ch 148 §26F / §26F½)

Massachusetts has state-level smoke detector and CO alarm requirements that exceed IRC baseline. New-construction ADUs require interconnected hardwired smoke alarms with battery backup; CO alarms within 10 ft of sleeping areas if the ADU has fuel-burning appliances or an attached garage.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill cites IRC R314/R315 and MGL Ch 148 §§26F/26F½]

### Fire Separation (IRC R302)

Attached ADUs require 1-hour fire-resistance-rated separation between the ADU and the primary dwelling (R302.3) — wall and floor/ceiling if stacked. Detached ADU separation requirements depend on distance from the primary dwelling and lot lines (R302.1, Table R302.1(1)).

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill quotes IRC R302 fire-separation requirements]

Boston-specific note: in dense Boston neighborhoods, detached ADUs often sit close to lot lines, triggering exterior wall fire-rating requirements. Verify the lot-line distance early — if under 5 ft, factor exterior wall fire-rating into the cost and design.

### Mechanical Ventilation (IRC M1505)

Whole-house mechanical ventilation is required for new-construction and gut-rehab ADUs under IRC M1505 (ASHRAE 62.2). Boston ADUs in tight Specialized-code envelopes effectively require continuous balanced ventilation (HRV/ERV) to meet both energy and indoor-air-quality requirements.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill IRC M1505 / ASHRAE 62.2 reference]

### Plumbing (248 CMR)

Plumbing is governed by 248 CMR (MA Plumbing Code), not 780 CMR. ADUs need a compliant DWV system, water supply, and fixture schedule per 248 CMR; cross-coordinate with the Boston plumbing inspector under ISD.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill confirms 248 CMR governs MA plumbing]

### Electrical (NEC 2023 via 527 CMR 12)

Electrical for ADUs is NEC 2023 with MA amendments per 527 CMR 12. ADUs need a separate electrical service or a dedicated sub-panel from the primary; AFCI/GFCI per NEC 210; load calculations, grounding, bonding all subject to plan review.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill confirms NEC 2023 / 527 CMR 12 framework]

## Sprinklers — Forward Reference to fire-boston.md

780 CMR sprinkler triggers govern when a sprinkler system is required for a Boston ADU; BFD performs the city-level review. Detailed sprinkler-trigger analysis lives in `fire-boston.md` (forthcoming). Brief: small detached ADUs typically do not require sprinklers; sprinklers may be triggered if the primary dwelling is sprinkler-required, if the ADU is part of a substantial alteration to a multi-unit primary, or by specific Boston BFD policy.

## Compliance Paths

780 CMR generally allows:

1. **Prescriptive** — meet specific requirements as written; standard for ADU plans
2. **Performance** — demonstrate equivalent performance via sealed engineering analysis

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-03 | citation: state skill notes prescriptive vs. performance paths]

Boston ADU corrections are almost always on the prescriptive path; a performance-equivalence argument is a structural/mechanical engineer or registered architect deliverable.

## Workflow for the Agent

When a Boston ADU correction invokes building code:

1. **Confirm the cited edition** — if 9th Edition, check the permit date; if post-October-2023, flag the edition mismatch.
2. **Pull the cited IRC/IBC section** from the state skill `780-cmr-essentials.md` first (most ADU corrections live in IRC R302, R310, R314, R315, M1505, IRC Ch 11 energy provisions, NEC 210 electrical).
3. **For Boston-specific energy code applications**, default to Specialized Opt-In Code requirements; do not assume Stretch or Base Code without project-specific evidence.
4. **For Boston-specific 780 CMR amendments**, do not assert a Boston amendment without verification — Boston enforces 780 CMR directly except where a verified ISD policy memo states otherwise.
5. **Cite both the state code section and the Boston enforcement context inline** with the response.

## Open Items / TBD

- Verified list of any Boston-specific amendments to 780 CMR (none confirmed; assume none until proven otherwise)
- Boston-specific Specialized Opt-In implementation memos from ISD (if any)
- BFD sprinkler-trigger interpretations specific to Boston ADUs (in `fire-boston.md` when written)

## Source Maintenance

- Re-verify 780 CMR edition currency annually (next major edition transition: pending)
- Re-verify Specialized Opt-In Code 225 CMR 22 Appendix RC currency quarterly
- Watch for ISD policy memos that amend or interpret 780 CMR for Boston application

**Last verified:** 2026-05-03. Next check: 2026-08-03.

## See Also

- `massachusetts-adu` skill, `780-cmr-essentials.md` — authoritative source for state-floor building code rules
- `energy-stretch-code.md` — Specialized Opt-In Code application detail (forthcoming)
- `fire-boston.md` — BFD sprinkler triggers and fire-life-safety review (forthcoming)
- `permit-process.md` — ISD plan review process and submittal specs
- `eohlc-compliance.md` — Ch. 150 preemption applicability to Boston (forthcoming)
