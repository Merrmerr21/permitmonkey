---
name: boston-adu
version: "1.0"
description: "City-level ADU regulations for Boston, Massachusetts. This skill should be used when answering ADU questions specific to Boston — local zoning code provisions (Boston operates under a special-act zoning framework with city-wide articles plus neighborhood-specific articles such as Article 51 Brighton, Article 56 Hyde Park; ADU-enabling amendments are being adopted neighborhood-by-neighborhood through BPDA's Neighborhood Housing Zoning initiative, starting with PLAN: Mattapan adopted February 2024), dimensional standards, BPDA/ISD process, Boston Fire Department review, Landmarks Commission jurisdiction over historic districts, Specialized Opt-In Energy Code, and anything that differs from or adds to Massachusetts state ADU law. This skill layers on top of the massachusetts-adu state law skill. Load state law first, then use this skill for Boston-specific requirements."
source: "Boston Zoning Code (hosted on Municode at library.municode.com/ma/boston/codes/redevelopment_authority; structure: neighborhood-specific articles plus city-wide articles like 80 development review), BPDA Neighborhood Housing Zoning initiative published guidance, MGL Ch 40A §§1A/3 as amended by St. 2024, c. 150, §§7-8, 760 CMR 71.00 (EOHLC)"
authority: "City of Boston Inspectional Services Department (ISD) + Boston Planning & Development Agency (BPDA)"
law_as_of: "2026-05-03 (760 CMR 71.00 effective Feb 2, 2025; Boston implementing zoning amendments tracked at bostonplans.org)"
---

# Boston ADU — City Regulatory Skill

This skill contains Boston's city-level ADU rules: the local ordinance, dimensional standards, BPDA/ISD process, fire and energy requirements, and historic district overlays that supplement or operate within the bounds of Massachusetts state ADU law.

**How this skill relates to state law**: The `massachusetts-adu` skill covers the state floor (MGL Ch 40A §§1A and 3 as amended by St. 2024, c. 150, §§7-8; 760 CMR 71.00 Protected Use ADU regulation). This skill covers what Boston adds, matches, or operates alongside. **Always load state law context first**, then layer this skill on top for Boston-specific questions.

**What this covers**: Boston Zoning Code (city-wide articles plus neighborhood-specific articles; ADU-enabling amendments rolling out per-neighborhood through BPDA's Neighborhood Housing Zoning initiative — Mattapan adopted Feb 2024; Roslindale, West Roxbury, Hyde Park drafts in progress as of 2026-05-03), 780 CMR (10th Edition, effective Oct 2023) and Specialized Opt-In Energy Code as applied to ADUs in Boston, BPDA/ISD permit process, Boston Fire Department review, Landmarks Commission jurisdiction over locally-designated historic districts, local fee schedule, and short-term rental ordinance (Sec. 9-14).

**What this does NOT cover**: State-level ADU law (use `massachusetts-adu` skill), MBTA Communities Act under MGL Ch 40A §3A, Chapter 40B comprehensive permits, federal requirements, or project-specific engineering.

---

## Decision Tree Router

### STEP 1: What's the Question About?

| Topic | Load These References |
|-------|----------------------|
| ADU height, setbacks, size, lot coverage, FAR | `ordinance-adu-standards.md`, `zoning-residential.md` |
| Parking requirements or MBTA proximity exemptions | `transit-parking.md`, `ordinance-adu-standards.md` |
| Design review or BPDA Article 80 triggers | `ordinance-adu-standards.md`, `permit-process.md` |
| Owner occupancy, ADU sale/rental, deed restrictions | `ordinance-adu-rules.md` |
| Short-term rental (Sec. 9-14) | `ordinance-adu-rules.md` |
| Permit fees, linkage, inclusionary applicability | `fees-impacts.md` |
| Fire sprinklers, BFD review, fire department approval | `fire-boston.md` |
| Historic districts, Landmarks Commission review | `historic-districts.md` |
| Building code editions, 780 CMR amendments | `building-codes.md` |
| Stretch / Specialized Opt-In Energy Code | `energy-stretch-code.md` |
| ISD permit submittal, plan sheets, inspections | `permit-process.md` |
| Zoning sub-districts and dimensional standards | `zoning-residential.md` |
| EOHLC compliance, 760 CMR 71.00 application | `eohlc-compliance.md` |
| Ch. 150 implementation status in Boston | `context-housing-150-2024.md` |

### STEP 2: Does State Preemption Apply?

If the question involves any of these topics, also load `eohlc-compliance.md` and the `conflicts-and-preemption.md` reference in the `massachusetts-adu` skill:

- USE prohibition (Boston cannot prohibit ADUs in single-family residential districts)
- Owner-occupancy requirement (state preempts)
- First-ADU special permit (state preempts; ADUs are by-right)
- Parking requirements above 1 space, or any parking within 0.5 mi of MBTA service
- ADU size cap smaller than the state floor (900 sq ft or 50% of primary, whichever less)

**Key principle**: State law preempts on USE (whether the ADU can exist). Boston governs FORM (dimensional setbacks, height, design, historic, site plan review) within reasonableness limits. Where Boston's bylaw is more restrictive than state law on USE, state law wins. Where Boston regulates FORM, comply unless the bylaw functionally prevents the use.

### STEP 3: Need More Information?

Boston's implementation of Ch. 150 is actively evolving and **proceeds neighborhood-by-neighborhood**, not citywide. Confirm the project's neighborhood, then look up the governing Article on Municode (https://library.municode.com/ma/boston/codes/redevelopment_authority) before citing dimensional values. As of 2026-05-03, only Mattapan (PLAN: Mattapan, adopted Feb 2024) has a completed ADU-enabling amendment; Roslindale, West Roxbury, and Hyde Park are in Phase 1 with drafts pending. For all other neighborhoods, ADU rules follow the existing pre-Ch. 150 article (subject to MGL Ch 40A §3 / Ch. 150 preemption analysis if state law applies — see Section 8 caveat in `eohlc-compliance.md`). For Landmarks-jurisdiction lots, see the Landmarks Commission map for current district boundaries. The Boston Zoning Viewer (GIS) at https://maps.bostonplans.org/zoningviewer/ is the primary lookup for sub-district and overlay status by parcel.

---

## Quick-Reference: Boston vs. State Law

Key numbers where Boston differs from or matches state law. Boston-specific values marked **TBD** populate as their reference file is authored in subsequent Phase 1 commits — Boston dimensional standards must resolve to a verified Boston Zoning Code section, BPDA-published guidance, or ISD policy memo before citing.

| Standard | State Law (Floor) | Boston | Delta |
|----------|-------------------|--------|-------|
| ADU use in single-family zone | By-right | By-right per Ch. 150 implementation | Matches (preempted) |
| ADU max size | ≤900 sq ft or ≤50% primary | TBD — see `ordinance-adu-standards.md` | TBD |
| Owner occupancy | Cannot require | Cannot require | Matches (preempted) |
| First-ADU special permit | Cannot require | By-right | Matches (preempted) |
| Parking max | 1 space; 0 within 0.5 mi MBTA | Most lots qualify for 0 (extensive MBTA coverage) | Matches |
| Detached ADU height | — | TBD — see `zoning-residential.md` | TBD |
| Front setback | — | Varies by sub-district — see `zoning-residential.md` | TBD |
| Side setback | — | Varies by sub-district — see `zoning-residential.md` | TBD |
| Rear setback | — | Varies by sub-district — see `zoning-residential.md` | TBD |
| Lot coverage / FAR | — | Varies by sub-district — see `zoning-residential.md` | TBD |
| Building code edition | — | 780 CMR (10th Edition, effective Oct 2023) — see `building-codes.md` | State-set; no Boston amendments verified |
| Energy code | Stretch Energy Code (baseline) | Specialized Opt-In Code (net-zero / near-net-zero) | More stringent than state minimum |
| Fire sprinklers | 780 CMR triggers govern | Same triggers; BFD reviews — see `fire-boston.md` | Matches state triggers |
| Short-term rental | Cities may restrict per Ch. 150 | Licensed under Sec. 9-14; some districts prohibit | Matches state-reserved authority |
| Historic district review | MGL Ch 40C governs | Landmarks Commission jurisdiction in 7+ districts (4–8 wk added) | Not preempted by Ch. 150 |
| Wetlands | MGL Ch 131 §40 governs | Boston Conservation Commission within 100 ft of resource | Not preempted |
| Article 80 design review | — | Triggered by project size; single ADU usually exempt | See `permit-process.md` |
| Inclusionary / linkage | — | Applies above project size threshold; single ADU usually exempt | See `fees-impacts.md` |

---

## Key Boston Facts

- **Permit authorities**: Inspectional Services Department (ISD) issues building permits; Boston Planning & Development Agency (BPDA) handles zoning, design review, and Article 80 review for larger projects; Zoning Board of Appeal (ZBA) hears variances and appeals
- **Fire service**: Boston Fire Department (BFD), direct city service — reviews ADU plans for sprinklers, access, and water supply
- **Zoning framework**: city-wide articles (e.g., Article 80 Development Review) plus neighborhood-specific articles (e.g., Article 51 Brighton, Article 56 Hyde Park) — ADU-enabling amendments are rolling out neighborhood-by-neighborhood through BPDA's Neighborhood Housing Zoning initiative (Mattapan adopted Feb 2024; Roslindale / West Roxbury / Hyde Park drafts in progress as of 2026-05-03)
- **Building code**: 780 CMR (10th Edition, effective Oct 2023) with Boston amendments
- **Energy code**: Specialized Opt-In Code adopted (stricter than baseline Stretch Code) — all-electric heating or renewable offset, higher envelope R-values, solar-ready provisions, HERS ratings typically 45–55
- **MBTA proximity**: Extensive subway, commuter rail, and bus coverage means most Boston lots qualify for the 0-parking exemption under MGL Ch 40A §3 — measurement is walking distance via existing pedestrian infrastructure
- **Water and sewer**: Boston Water and Sewer Commission (BWSC)
- **Historic districts**: 7+ locally-designated districts under Landmarks Commission jurisdiction (Beacon Hill, Back Bay, South End, Bay Village, Fort Point Channel, Mission Hill Triangle, St. Botolph) — exterior modifications require Landmarks review, adding 4–8 weeks
- **Wetlands**: Boston Conservation Commission jurisdiction under MGL Ch 131 §40 — filing required within 100 ft of any wetland resource area
- **Short-term rental**: Sec. 9-14 ordinance governs ADUs used for STR; owner-adjacent registration required; some districts prohibit STR in residential zones
- **Permit timeline (typical)**: Administrative by-right ADU 2–6 weeks if complete submittal; +6–10 weeks if Landmarks Commission review applies; +8–12 weeks if Conservation Commission review applies
- **Common Boston gotcha**: Many urban lots cannot fit a detached ADU within setbacks and lot coverage limits — conversion ADUs (basement, attic, garage) are the more common path
- **Non-conforming primary**: Many Boston primary dwellings predate current zoning and are themselves non-conforming — adding an ADU interacts with non-conforming use rules and may need ZBA touch
- **Canonical lookups**: Boston Zoning Code → boston.gov/departments/boston-planning-development-agency/zoning-code-and-maps; ADU information → bostonplans.org/adu_zoning; Zoning Viewer (GIS) → maps.bostonplans.gov/zoningviewer/; Landmarks Commission → boston.gov/departments/landmarks-commission

---

## Reference File Catalog

The 12 reference files for this skill (all 12 now landed; `ordinance-adu-standards.md` is honest about Municode-blocked verification gaps and marks neighborhood-Article values as TBD pending browser access):

- `building-codes.md` — 780 CMR (10th Edition) application in Boston, Specialized Opt-In Energy Code posture, common ADU correction topics
- `context-housing-150-2024.md` — Ch. 150 §§7-8 implementation status in Boston, BPDA published guidance
- `energy-stretch-code.md` — Specialized Opt-In Energy Code requirements applied to ADUs in Boston
- `eohlc-compliance.md` — 760 CMR 71.00 application in Boston, EOHLC technical assistance letters
- `fees-impacts.md` — ISD permit fee schedule, linkage thresholds, inclusionary applicability for ADUs
- `fire-boston.md` — Boston Fire Department review process, sprinkler triggers, access requirements
- `historic-districts.md` — Boston Landmarks Commission jurisdiction, district maps, review process and timelines
- `ordinance-adu-rules.md` — operational rules: occupancy, sale/rental, deed restrictions, short-term rental
- `ordinance-adu-standards.md` — dimensional standards: size caps, height, setbacks, separation, design
- `permit-process.md` — ISD/BPDA submittal, plan sheets, Article 80 thresholds, inspection sequence
- `transit-parking.md` — MBTA proximity test (deterministic GeoJSON lookup with LLM interpretation), exemption logic
- `zoning-residential.md` — Boston residential zoning framework, neighborhood-article structure, per-neighborhood ADU implementation status, dimensional-lookup workflow via Municode + Zoning Viewer

**Substitution from the Placentia template**: Boston's `historic-districts.md` replaces Placentia's `utilities-grading.md` slot. Boston Landmarks Commission jurisdiction is the local differentiator that drives most non-state-preempted corrections. Boston utilities (BWSC water and sewer, no comparable grading code or WQMP/LID complex) are simpler than Placentia's GSWC and Title 8 grading regime and do not warrant a dedicated reference file.

A forthcoming `CLAUDE.md` in this skill directory will catalog each reference file with key code sections and topics (mirrors the `_legacy/server-skills/placentia-adu/CLAUDE.md` format).

---

## Citation Format

All reference files in this skill use **inline provenance tags** on every material claim:

```
[source: <URL> | retrieved: <YYYY-MM-DD> | citation: <statute or section>]
```

This is stricter than the legacy Placentia convention (which used YAML `key_code_sections` plus an end-of-file URL table). Inline tags are non-negotiable for sellability — see `PLAYBOOK.md` (project doctrine, "provenance from day one"). Legacy files in `_legacy/` are not retro-fitted.

When a Boston-specific dimensional number appears in a reference file, the inline tag must resolve to a current Boston Zoning Code section, BPDA-published guidance document, or ISD policy memo with a verifiable URL. If a number cannot be verified, the reference file marks it `TBD — verification pending` rather than asserting it.
