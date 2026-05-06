---
title: Boston Residential Zoning Framework for ADUs
category: zoning
relevance: critical
key_code_sections: "Boston Zoning Code (Municode), neighborhood-specific articles (e.g., Article 51 Brighton, Article 56 Hyde Park); BPDA Neighborhood Housing Zoning initiative; PLAN: Mattapan (adopted Feb 2024)"
last_verified: 2026-05-03
---

# Boston Residential Zoning Framework for ADUs

## Why Boston is Different from Other MA Cities

Most Massachusetts municipalities zone under MGL Ch 40A and were directly affected by Ch. 150 of the Acts of 2024 (the Affordable Homes Act, §§7-8 amending Ch 40A §§1A and 3) on its February 2, 2025 effective date. **Boston is structurally different.** Boston operates under a special-act zoning enabling framework, which means Ch. 150's by-right ADU mandate does not flow through automatically — Boston is implementing equivalent ADU-enabling amendments **neighborhood-by-neighborhood** via the BPDA's "Neighborhood Housing Zoning" initiative.

[source: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing | retrieved: 2026-05-03 | citation: BPDA Neighborhood Housing Zoning landing page]

The practical consequence for permit work: **the answer to "is this lot ADU-eligible by-right?" depends on which neighborhood it sits in and whether that neighborhood's zoning has been amended yet.** Do not assume citywide by-right.

## Code Source of Truth

The Boston Zoning Code is hosted by Municode at:

```
https://library.municode.com/ma/boston/codes/redevelopment_authority
```

[source: https://www.bostonplans.org/planning-zoning/zoning-code | retrieved: 2026-05-03 | citation: BPDA Zoning Code page links to Municode as full-text host]

The page is JavaScript-rendered — the article hierarchy must be navigated in a browser, not extracted via a static HTTP fetch. For programmatic provenance, the Boston Zoning Viewer (GIS) at https://maps.bostonplans.org/zoningviewer/ returns the governing district and applicable article for any Boston parcel.

[source: https://maps.bostonplans.org/zoningviewer/ | retrieved: 2026-05-03 | citation: Boston Zoning Viewer GIS tool]

## Code Structure: City-Wide Articles + Neighborhood Articles

Boston's zoning code combines city-wide articles (procedural and city-spanning rules) with neighborhood-specific articles (district maps and dimensional rules per neighborhood).

**City-wide articles relevant to ADU work** (verified to exist in BPDA's published initiatives index):

- **Article 80** — Development Review process. Triggered by project size; single ADU permits typically do not invoke Article 80. [source: https://www.bostonplans.org/planning-zoning | retrieved: 2026-05-03 | citation: BPDA zoning landing page references Article 80 review]
- **Article 25A** — referenced in BPDA initiatives list (subject area not confirmed in this research session). [source: https://www.bostonplans.org/planning-zoning | retrieved: 2026-05-03]
- **Article 37** — referenced in BPDA initiatives list (subject area not confirmed in this research session). [source: https://www.bostonplans.org/planning-zoning | retrieved: 2026-05-03]
- **Article 89** — referenced in BPDA initiatives list (subject area not confirmed in this research session). [source: https://www.bostonplans.org/planning-zoning | retrieved: 2026-05-03]

**Neighborhood-specific articles confirmed by name** (article numbers per existing internal city-research notes — verify against Municode before citing in a contractor response):

- Article 51 — Brighton Neighborhood District
- Article 56 — Hyde Park Neighborhood District

[source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: existing PermitMonkey city-research notes naming Article 51 / Article 56]

Other neighborhoods (Mattapan, Roslindale, West Roxbury, Roxbury, Dorchester, Allston, Jamaica Plain, Charlestown, East Boston, South Boston, etc.) each have their own neighborhood districts under separate articles. **TBD — verification pending**: a complete enumeration of neighborhood-article numbers requires browser-mediated Municode navigation. Do not cite a specific article number for a neighborhood without verifying it on Municode for the project at hand.

## ADU Implementation Status by Neighborhood (as of 2026-05-03)

| Neighborhood | Status | Date | Notes |
|---|---|---|---|
| Mattapan | **Adopted** | February 2024 | PLAN: Mattapan rezoning. After adoption, ~90% of small-scale residential projects allowed by-right (up from ~60% prior). ADU-enabling amendment included. |
| Roslindale | In progress (Phase 1) | Drafts pending after Fall 2025 community meetings | Part of Neighborhood Housing Zoning Phase 1 |
| West Roxbury | In progress (Phase 1) | Drafts pending after Fall 2025 community meetings | Part of Neighborhood Housing Zoning Phase 1 |
| Hyde Park | In progress (Phase 1) | Drafts pending after Fall 2025 community meetings | Part of Neighborhood Housing Zoning Phase 1 |
| All other neighborhoods | Not yet amended | — | Pre-existing neighborhood article governs; preemption analysis required if state law applies |

[source: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing | retrieved: 2026-05-03 | citation: BPDA Neighborhood Housing Zoning page status table]

## Mattapan ADU Provisions — TBD

**Verification pending**: the Mattapan amendment (PLAN: Mattapan, adopted February 2024) created or amended specific Articles introducing ADU rules. The exact Article number, ADU size cap, height, setback, parking, and owner-occupancy provisions in the Mattapan amendment must be read from Municode directly. As of this writing the Mattapan amendment has been confirmed adopted with the by-right small-scale residential outcome, but the dimensional and operational terms have not been quoted into this reference file.

[source: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing | retrieved: 2026-05-03 | citation: BPDA confirms PLAN: Mattapan adoption, dimensional terms not quoted on landing page]

When citing a Mattapan ADU rule in a contractor response, fetch the current article text from Municode and pin the citation to a specific section, with retrieval date.

## Pre-Amendment Boston: The Variance Reality

For neighborhoods not yet amended, BPDA's own framing is that "most homes in Boston don't comply with current zoning rules, forcing homeowners through expensive variance processes for renovations or accessory dwelling units."

[source: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing | retrieved: 2026-05-03 | citation: BPDA Neighborhood Housing Zoning page, framing paragraph]

Practical implication: pre-amendment ADU permits in Boston typically required a Zoning Board of Appeal (ZBA) variance, especially for detached ADUs on small urban lots. After Ch. 150's effective date, the question is whether state preemption forces by-right treatment in pre-amendment neighborhoods. **TBD — preemption applicability to Boston requires legal analysis of Boston's special-act enabling framework vs. Ch 40A's reach**. Cross-reference `eohlc-compliance.md` and the `conflicts-and-preemption.md` reference in the `massachusetts-adu` skill before asserting a preemption-based by-right conclusion in a Boston response.

## Dimensional Standards — TBD

This reference file does NOT yet include verified Boston dimensional standards for residential sub-districts (front/side/rear setbacks, height, lot coverage, FAR). Those numbers vary by neighborhood district and must be read from the controlling article on Municode for the specific parcel.

**Workflow for the agent when a dimensional question arises:**

1. Use the Boston Zoning Viewer (https://maps.bostonplans.org/zoningviewer/) to identify the parcel's neighborhood district and any overlays.
2. Open Municode (https://library.municode.com/ma/boston/codes/redevelopment_authority) and navigate to the matching neighborhood article.
3. Quote the exact section number and dimensional values.
4. Tag the citation with retrieval date in the contractor-facing response.
5. If the parcel falls in Mattapan or another amended neighborhood, prefer the post-amendment article. If pre-amendment, flag the variance/preemption question.

Do not return a numeric setback or height to a contractor without doing this lookup.

## Common Boston Residential Zoning Gotchas

These are workflow flags, not specific citations:

- **Non-conforming primary dwellings are the rule, not the exception.** Many Boston primary dwellings predate current zoning — adding an ADU often interacts with non-conforming use rules. [source: https://www.bostonplans.org/planning-zoning/zoning-initiatives/neighborhood-housing | retrieved: 2026-05-03 | citation: BPDA confirms most Boston homes don't comply with current zoning]
- **Detached ADUs rarely fit on Boston lots.** Lot coverage and setback constraints in dense neighborhoods make conversion ADUs (basement, attic, garage) the more common path. [source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md (last_verified 2026-04-22) | retrieved: 2026-05-03]
- **Historic districts overlay independently.** Landmarks Commission jurisdiction operates separately from base zoning and is not preempted by Ch. 150 — see `historic-districts.md`.
- **Article 80 design review applies to larger projects only.** Single ADU additions typically do not trigger Article 80, but verify against the article's project-size thresholds.

## Source Maintenance

Boston zoning is one of the highest-churn references in this skill. Re-verify before each contractor response that involves a citation, and re-walk this file quarterly:

- Verify Mattapan amendment article numbers and quoted dimensional values once Municode access is established
- Add new neighborhoods to the implementation status table as they advance through Phase 1 and beyond
- Update the city-wide-article subject areas (25A, 37, 89) when their roles are confirmed
- Replace each "TBD" marker with a quoted-text citation as research progresses

**Last verified:** 2026-05-03. Next check: 2026-08-03.

## See Also

- `ordinance-adu-rules.md` — operational rules layer (occupancy, sale/rental, STR)
- `historic-districts.md` — Landmarks Commission overlay (forthcoming)
- `permit-process.md` — ISD/BPDA submittal sequence (forthcoming)
- `eohlc-compliance.md` — Ch. 150 preemption analysis as it applies (or doesn't) to Boston (forthcoming)
- `massachusetts-adu` skill, `conflicts-and-preemption.md` — state-law preemption framework
