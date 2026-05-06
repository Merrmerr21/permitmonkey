---
title: Boston Landmarks Commission Historic Districts — ADU Review Layer
category: overlay
relevance: critical-for-affected-parcels
key_code_sections: "Boston Landmarks Commission jurisdiction; MGL Ch 40C (Massachusetts Historic Districts Act); separate Boston city ordinances for Landmark Districts"
last_verified: 2026-05-03
---

# Boston Landmarks Commission Historic Districts

## Why This File Replaces the Placentia Template's `utilities-grading.md` Slot

Boston Landmarks Commission jurisdiction is the single biggest non-state-preempted overlay affecting Boston ADU permits. Unlike most MA cities, where historic district concerns are limited to a handful of small districts, Boston has 11 designated districts (one under study) covering a substantial fraction of inner-city residential parcels — Beacon Hill, Back Bay, South End, and Bay Village alone include thousands of properties where any ADU exterior change requires Landmarks Commission review.

State preemption under Ch. 150 of the Acts of 2024 does NOT override historic district review. Historic district authority operates under MGL Ch 40C (Massachusetts Historic Districts Act) and separate Boston city ordinances — both layered on top of the by-right ADU framework, not displaced by it.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\dimensional-summary.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: state skill confirms historic districts and wetlands "are NOT preempted by Ch 150"]

## The 11 Designated Districts

[source: https://www.boston.gov/departments/landmarks-commission | retrieved: 2026-05-03 | citation: Boston Landmarks Commission departmental page lists active districts]

| District | Neighborhood | Designated | Type |
|---|---|---|---|
| Historic Beacon Hill District | Beacon Hill | 1955 (expanded 1958, 1963, 1975, 2024) | Landmark District |
| Back Bay Architectural District | Back Bay | 1966 (expanded 1974, 1979, 1981) | Landmark District (Architectural) |
| Bay State Road / Back Bay West Area ACD | Back Bay | 1979 | Architectural Conservation District |
| St. Botolph Area ACD | Fenway/Kenmore | 1981 | Architectural Conservation District |
| South End Landmark District | South End | 1983 | Landmark District |
| Bay Village Historic District | Bay Village | 1983 | Historic District |
| Mission Hill Triangle ACD | Mission Hill | 1985 | Architectural Conservation District |
| Aberdeen ACD | Brighton | 2002 | Architectural Conservation District |
| Fort Point Channel Landmark District | South Boston | 2009 | Landmark District |
| Highland Park ACD | Roxbury | 2022 | Architectural Conservation District |
| Monument Square (study) | Charlestown | Under study (2022) | Pending designation |

[source: https://www.boston.gov/departments/landmarks-commission | retrieved: 2026-05-03 | citation: district list table on Landmarks Commission page]

The two legal categories — **Landmark District** and **Architectural Conservation District (ACD)** — operate under different procedural frameworks. **TBD — verification pending:** quote-level confirmation of how Landmark District review differs from ACD review (scope of review, materials list, finish review, demolition review, internal alterations, etc.). The city Landmarks Commission departmental page does not enumerate the differences; review the per-district page (URLs listed above) for each project's specific district before citing.

## Practical Implication for ADU Permits

For any Boston ADU project, the first workflow step is determining whether the parcel falls inside one of these districts:

1. Use the Boston Zoning Viewer (https://maps.bostonplans.org/zoningviewer/) — overlays show Landmarks Commission jurisdiction in addition to base zoning.
2. If inside any district, Landmarks Commission review is required for any change visible from a public way (exterior wall surfaces, windows, doors, roofs, dormers, decks, additions). Interior-only changes typically do not require Landmarks review but verify per district.
3. The review adds calendar time on top of the by-right ADU permit timeline.

[source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: existing PermitMonkey city-research notes — "Historic districts require separate Landmarks Commission review" and the typical 4-8 week timeline]

**Practical patterns by ADU type:**

- **Detached ADUs in a Landmarks district:** rarely buildable without significant design accommodation — most districts have stringent rules on visible new construction. Expect either denial or a long iterative review.
- **Conversion ADUs (basement, attic, garage) in a Landmarks district:** more often approvable because the exterior changes are minimal. New egress windows or skylights still require review.
- **Attached ADUs adding a wing or rear addition:** mid-difficulty; depends heavily on whether the addition is visible from a public way.

## Review Timeline

Approximate added time for Landmarks Commission review on top of the base ISD permit:

- Administrative / staff-level review for minor exterior work: **2-4 weeks**
- Full commission review for visible additions or new construction: **4-8 weeks**
- Iterative review with required re-submittals: **8-16 weeks**

[source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: existing PermitMonkey city-research notes — "+6-10 weeks if Landmarks Commission review applies"]

These are practitioner approximations, not Landmarks Commission published service-level commitments. **TBD — verification pending:** published Landmarks Commission review-timeline targets, if any.

## Legal Authority — TBD on Specifics

Historic districts in Boston operate under a layered authority:

- **MGL Ch 40C (Massachusetts Historic Districts Act)** governs locally-designated historic districts statewide. State law authorizes municipalities to create districts and grants the local commission review authority over exterior changes.
- **Boston city ordinances** create each individual district and define its scope and the commission's procedural rules.

[source: state-law analog — see state skill `dimensional-summary.md` reference to MGL Ch 40C governing historic districts | retrieved: 2026-05-03 | citation: MGL Ch 40C]

**TBD — verification pending:** the specific Boston ordinance section creating each district, the procedural rules per district (review thresholds, public hearing requirements, certificate of appropriateness vs. certificate of non-applicability vs. exemption), and the appellate path. The Landmarks Commission departmental page does not enumerate this; the per-district pages (URLs in the table above) are the next research step.

## Interaction with Ch. 150 Preemption

State preemption under Ch. 150 does NOT override historic district review. The state skill `conflicts-and-preemption.md` framework still applies to USE questions (can the ADU exist) and operational questions (owner-occupancy, parking) — but FORM questions inside a Landmarks district are subject to BOTH the base zoning's dimensional standards (set by neighborhood-specific Articles in Boston, see `zoning-residential.md`) AND the Landmarks Commission's design review.

**Common Boston correction-letter scenario:** a contractor receives a corrections letter referencing both a zoning issue and a Landmarks issue. The two are independent. Address them separately in the response, citing:

- For the zoning issue: the controlling neighborhood Article + Ch. 150 preemption analysis if applicable
- For the Landmarks issue: the specific Boston ordinance for the district + MGL Ch 40C, accepting that this is properly within the city's reserved authority

Do NOT invoke state preemption against Landmarks Commission review. That's a different statute and a different review standard, and asserting preemption against historic district review is a guaranteed loss in court.

## Workflow for the Agent

When a Boston ADU correction touches historic district review:

1. **Identify the district.** From the corrections letter or by parcel lookup on the Boston Zoning Viewer.
2. **Identify the district type.** Landmark District vs. Architectural Conservation District. Use the table above.
3. **Identify the visible-from-public-way scope** of the proposed work. Anything visible triggers review; anything purely interior or on a non-visible facade typically does not.
4. **Cite the specific district's commission and the controlling MGL Ch 40C provision** in the response. Do NOT cite generic "historic district review" — cite by name.
5. **For corrections that conflate Landmarks and zoning issues**, address them as separate corrections in the response; do not invoke state preemption against the Landmarks portion.
6. **For corrections that demand a level of review beyond what's typical** (e.g., a Landmarks objection to interior-only conversion), flag for human review — the agent should escalate, not assert.

## Source Maintenance

- Re-verify the district list quarterly. The Monument Square district status (under study 2022) may shift.
- Watch for new ACD designations as the Neighborhood Housing Zoning initiative advances — neighborhoods being upzoned for ADUs may simultaneously gain ACD overlays.
- Re-verify Landmarks Commission published procedural rules quarterly.

**Last verified:** 2026-05-03. Next check: 2026-08-03.

## See Also

- `zoning-residential.md` — base zoning framework (Landmarks operates as overlay on top of base zoning)
- `permit-process.md` — ISD/BPDA permit process (Landmarks adds calendar time to this)
- `ordinance-adu-rules.md` — operational rules layer
- `massachusetts-adu` skill, `conflicts-and-preemption.md` — state preemption framework (does NOT override Landmarks)
- MGL Ch 40C (Massachusetts Historic Districts Act) — state-level enabling authority for historic district review
