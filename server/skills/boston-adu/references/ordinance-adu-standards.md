---
title: Boston ADU Dimensional Standards — Size, Height, Setbacks, Lot Coverage
category: ordinance
relevance: critical
key_code_sections: "MGL Ch 40A §1A as amended by St. 2024 c. 150 §7 (state floor on size); Boston special-act zoning enabling framework; per-neighborhood Articles for dimensional control"
last_verified: 2026-05-04
---

# Boston ADU Dimensional Standards

This file covers dimensional rules — size cap, height, setbacks, lot coverage, FAR, location-on-lot, and building separation. Operational rules (occupancy, rental, STR) are in `ordinance-adu-rules.md`. The zoning framework and per-neighborhood adoption status is in `zoning-residential.md`.

## Why This File Is Thin

Boston's dimensional standards for ADUs are governed by **per-neighborhood Articles** under the city's special-act zoning enabling framework, not by a single city-wide Article. Each neighborhood has its own controlling Article number with its own dimensional table.

The Boston Zoning Code is hosted on Municode (`library.municode.com/ma/boston/codes/redevelopment_authority`) but the platform is JavaScript-rendered, so direct text fetch returns empty page bodies. Confirming specific Article numbers, setback values, or height limits requires browser access. **Where this file says "TBD pending Municode access," do not project values from other cities or from generic Ch 40A defaults — read the controlling neighborhood Article.**

This is the same discipline that retired the "Article 26A" projection in the original boston-adu SKILL.md. See `.claude/CLAUDE.md` Lab Notes (2026-05-03) for the failure pattern.

## State-Law Floor on Size (Verifiable)

Massachusetts Ch. 150 of the Acts of 2024 §7 added the ADU definition to MGL Ch 40A §1A. The size cap is statewide:

- **Maximum ADU size:** lesser of 900 sq ft OR 50% of primary dwelling gross floor area. [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §7 amending MGL Ch 40A §1A — see massachusetts-adu skill chapter-150-of-2024.md]

Boston cannot enlarge this size cap (state ceiling) but can require smaller ADUs in any specific neighborhood Article (state floor permits smaller). When in doubt, the controlling number is whichever is smaller.

## Boston Implementation Status (Verifiable)

Per the BPDA Neighborhood Housing Zoning landing page:

- **PLAN: Mattapan adopted February 2024** — first Boston neighborhood with ADU-enabling zoning amendment. [source: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing | retrieved: 2026-05-03 | citation: BPDA Neighborhood Housing Zoning page]
- **Roslindale, West Roxbury, Hyde Park drafts in progress** as of 2026-05-03; not yet adopted.
- **Other neighborhoods** are governed by their pre-existing Articles, which generally predate Ch. 150 and may require ZBA approval for accessory apartments. State preemption analysis applies on a case-by-case basis.

Whether each ADU permit application gets the modern "by-right under amended Article" treatment or the legacy "ZBA variance" treatment depends on which neighborhood the parcel is in and when. Confirm against the current BPDA initiative status before relying on by-right.

## Setbacks — TBD Pending Municode Access

Setbacks are reserved to local zoning under MGL Ch 40A §3 paragraph 1 ("subject to reasonable regulations, including site plan review, regulations concerning dimensional setbacks and the bulk and height of structures"). [source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3 | retrieved: 2026-04-22 | citation: MGL Ch 40A §3 paragraph 1 dimensional reservation]

For each Boston neighborhood Article, the controlling setbacks are:

- **Front yard setback** — TBD per neighborhood Article (typically 10-25 ft in Boston residential districts, but the controlling number is in the Article)
- **Side yard setback** — TBD per neighborhood Article (typically 5-10 ft)
- **Rear yard setback** — TBD per neighborhood Article (typically 20-30 ft)

For attached ADUs, the controlling setback is from the OUTERMOST envelope of the combined primary + ADU structure to the property line. For detached ADUs, the ADU has its own setback envelope.

**Plan review action:** read the proposed setback dimensions on the site plan and check them against the neighborhood Article. If the site plan does not call out the controlling Article (deficient — should appear on the cover sheet zoning compliance table), flag the deficiency before reviewing the dimensions.

## Height — TBD Pending Municode Access

Boston residential districts typically cap height at 35 ft, but the actual controlling number lives in the neighborhood Article. Height measurement methodology (to ridge / to eaves / to highest point / from average grade) varies by Article. **Read the Article before assuming the methodology.**

## Lot Coverage and FAR — TBD Pending Municode Access

Lot coverage (footprint of all structures / lot area) and FAR (gross floor area / lot area) are reserved to the neighborhood Article. Common Boston residential FAR caps fall in the range 0.5–1.5 depending on district, but the controlling number is in the Article.

For ADUs, the practical question on plan review: does the primary + ADU combined footprint (or combined GFA) exceed the controlling cap? Many Boston ADU corrections turn on this rather than on setbacks, because urban lots are FAR-constrained before they're setback-constrained.

## Location-On-Lot Rules

For attached ADUs:
- The ADU is part of the primary dwelling envelope. Setbacks measure from the combined envelope.
- Detached entrance is permitted under state floor (separate entrance can be direct or via shared hall/corridor that meets building code egress). Some Boston Articles add aesthetic / front-facing-entrance rules; check the Article.

For detached ADUs:
- Setbacks measure from the ADU envelope.
- Building separation between the primary and detached ADU is governed by 780 CMR (the building code, IRC R302.1 fire-separation distance), not zoning. See `building-codes.md` for the fire-separation table.
- Some Boston Articles restrict detached ADUs to the rear half of the lot; check the Article.

For conversion ADUs (basement, attic, garage):
- No new exterior envelope, so setbacks are not affected.
- Existing structure must meet 780 CMR for the new use (egress, fire separation, alarms). See `building-codes.md`.

## Common Boston Plan-Review Findings on Dimensional Items

- **Site plan does not cite the controlling neighborhood Article** — required for the zoning compliance table; flag as deficient.
- **Setback dimensions claimed against generic Ch 40A defaults rather than the neighborhood Article** — flag and request revision.
- **Height measurement methodology not stated** — flag; the Article specifies the reference (eaves / ridge / average grade) and the contractor must document which.
- **FAR calculation excludes basements** — verify against the Article (some Articles include conditioned basements in GFA, others don't).
- **Lot coverage calculation uses gross lot area inclusive of public right-of-way** — flag; net lot area is the controlling number.
- **Conversion ADU asserted as exempt from FAR** — verify; some Articles count interior conversion against GFA even though no new exterior envelope is added.

## Plan-Review Decision Tree

```
Is the controlling neighborhood Article cited on the site plan?
├── NO  → Deficient. Request the Article number and its dimensional table.
└── YES → Continue.

Are setbacks dimensioned and labeled?
├── NO  → Deficient. Cite checklist-site-plan.md required elements.
└── YES → Continue.

Do dimensioned setbacks meet the cited Article's controlling values?
├── NO  → Deficient. Cite the Article number and the discrepancy.
└── YES → Continue.

Is the height measurement methodology stated?
├── NO  → Deficient. Methodology varies by Article.
└── YES → Continue.

Is the FAR / lot-coverage compliance table present and correct?
├── NO  → Deficient. Cite the Article's calculation method.
└── YES → Dimensional review passes; flag any TBD items for human reviewer.
```

## Source Verification

- BPDA Neighborhood Housing Zoning landing page: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing
- Boston Zoning Code on Municode (browser-only): https://library.municode.com/ma/boston/codes/redevelopment_authority
- MGL Ch 40A §1A and §3 (state floor — directly verifiable): https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A
- BPDA Plan: Mattapan resources: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing/plan-mattapan

**Verification posture:** State-floor items in this file are verified against MGL Ch 40A and the Acts of 2024. Boston-specific dimensional values are explicitly NOT verified at this revision and are marked TBD. Future revisions should fill these in by reading the controlling neighborhood Article on Municode (browser session required); once filled in, replace the TBD markers with the actual values plus an inline provenance tag pointing to the Municode permalink.

**Last verified:** 2026-05-04.

## See Also

- `zoning-residential.md` — Boston special-act zoning framework, neighborhood Article roster, adoption status
- `ordinance-adu-rules.md` — operational rules (occupancy, rental, STR, sale)
- `building-codes.md` — 780 CMR provisions including IRC R302.1 fire-separation by lot-line distance
- `.claude/CLAUDE.md` Lab Notes (2026-05-03) — Article 26A projection failure and the rule against projecting from generic ADU naming conventions
