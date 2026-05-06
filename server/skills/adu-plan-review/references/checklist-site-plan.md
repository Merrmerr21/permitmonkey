---
title: "Site Plan — Plan Review Checklist (Massachusetts ADU)"
category: plan-review
sheet_type: site-plan
jurisdiction: Massachusetts
relevance: "Load when reviewing a site plan, grading plan, or utility plan (typically C1, A1, or SP1). Defines required elements with code citations for Massachusetts ADU permits, dimensional compliance checks, MBTA proximity workflow, and confidence calibration."
---

# Site Plan Checklist — Massachusetts ADU

This file defines WHAT must appear on the site plan / grading plan / utility plan sheets and WHY (per 780 CMR, MGL Ch 40A, 760 CMR 71.00, and municipal zoning). The site plan is where dimensional compliance is proven, parking is documented, and the MBTA proximity exemption (if claimed) lives.

## Scope

Applies to ADU permit submittals statewide. Local dimensional standards govern setbacks, height, lot coverage, and FAR; state law caps parking and use restrictions. [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\dimensional-summary.md | retrieved: 2026-05-04 | citation: state skill dimensional-summary.md state-floor vs. local-ceiling pattern]

## Required Elements on the Site Plan

### 1. Lot Boundary and Survey Reference

**Must include:**
- Property line locations with bearings and distances
- Reference to source survey (recorded plan number, surveyor name, date)
- Total lot area in square feet
- North arrow and graphic scale

**Code basis:**
- 780 CMR 107.3.1 — construction documents must show project location and dimensions [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: 780 CMR 107]
- Municipal zoning bylaw — typically requires recorded survey reference

**Visual identification:** Outer rectangle of plan with dimension and bearing callouts; survey reference block.

**Common deficiencies:**
- "Approximate" property lines without survey basis (city often rejects)
- Lot area calculated incorrectly (off by tens of square feet — pushes setback compliance into question)
- Missing north arrow or scale

**Confidence:** HIGH for presence; MEDIUM for survey accuracy verification.

### 2. Existing Structures and Features

**Must include:**
- All existing buildings on the lot (primary dwelling, sheds, garages, fences over 6 ft)
- Existing trees of significance (typically >6" caliper)
- Existing curb cuts and driveways
- Existing utilities (water, sewer, gas, electric service)
- Existing setback dimensions to property lines

**Code basis:**
- 780 CMR 107.3.1 — must show existing conditions
- Municipal zoning bylaw — non-conforming structure protections require existing-condition documentation

**Visual identification:** Distinct line type for existing (typically lighter / dashed) vs. proposed (solid / heavier).

**Common deficiencies:**
- Existing primary dwelling shown with wrong footprint
- Missing accessory structures (sheds, gazebos that affect coverage calc)
- No tree information when site has mature trees the city protects

**Confidence:** HIGH for major structures; MEDIUM for tree count and minor accessories.

### 3. Proposed ADU Footprint and Setbacks

**Must include:**
- Proposed ADU footprint with dimensions
- Front, side, and rear setback dimensions to nearest property line
- Setback to nearest neighboring structure (if local bylaw requires building separation)
- Setback compliance comparison: required vs. provided (table format)

**Code basis:**
- Municipal zoning bylaw — dimensional setbacks reserved to localities
- MGL Ch 40A §3 — local dimensional standards governed by reasonableness [source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3 | retrieved: 2026-05-04 | citation: MGL Ch 40A §3]

**Visual identification:** Setback dimension lines with arrows; compliance table near the proposed structure.

**Common deficiencies:**
- Setback measured to wrong reference point (eaves vs. wall face vs. foundation)
- Compliance table shows only "provided" without "required" — reviewer can't verify
- Encroachment on accessory structure setback when ADU is detached
- For Boston neighborhoods: assumes standard residential setbacks rather than the controlling neighborhood Article [source: c:\dev\permitmonkey\server\skills\boston-adu\references\zoning-residential.md | retrieved: 2026-05-04 | citation: Boston zoning is per-neighborhood-Article]

**Confidence:** HIGH for setback dimensions; MEDIUM for measured-to-correct-reference accuracy.

### 4. Lot Coverage and FAR Compliance

**Must include:**
- Existing lot coverage percentage (existing structure footprint / lot area)
- Proposed lot coverage percentage including the ADU
- Maximum lot coverage allowed by zoning district
- FAR calculation if applicable (some districts use FAR; some use coverage)
- Worksheet showing the calculation, not just the result

**Code basis:**
- Municipal zoning bylaw — coverage and FAR are local
- MGL Ch 40A §3 — dimensional regulation reserved [source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3 | retrieved: 2026-05-04 | citation: MGL Ch 40A §3]

**Visual identification:** Compliance table on site plan or in cover-sheet zoning block.

**Common deficiencies:**
- FAR calculation excludes basements when local bylaw includes them above a finished-ceiling threshold
- Coverage calculation uses lot area inclusive of public street area (incorrect; use net lot area)
- For Mattapan parcels post-PLAN: Mattapan: applies pre-amendment coverage rule when post-amendment rule is more permissive [source: c:\dev\permitmonkey\server\skills\boston-adu\references\zoning-residential.md | retrieved: 2026-05-04 | citation: Mattapan adopted Feb 2024 changing applicable rules]

**Confidence:** HIGH for presence; MEDIUM for calculation accuracy (varies by city's bylaw nuance).

### 5. Parking Layout

**Must include:**
- Existing parking spaces (count, size, location, type — paved/unpaved)
- Proposed parking spaces if any (count, size, location)
- Parking compliance statement: required vs. provided
- For zero-parking ADUs: MBTA proximity demonstration

**Code basis:**
- MGL Ch 40A §3 as amended by St. 2024, c. 150, §8 — max 1 additional parking space; 0 within 0.5 mi of MBTA station [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §8]
- 760 CMR 71.00 — implements the parking floor [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\760-cmr-71-protected-use-adu.md | retrieved: 2026-05-04 | citation: 760 CMR 71.00 parking provisions]

**Visual identification:** Parking spaces shown as rectangles with dimensions; MBTA proximity note (typically near parking compliance table).

**Common deficiencies:**
- City demands 2+ parking spaces (preempted; the state floor is 1 max, 0 near transit)
- MBTA proximity claimed without distance calculation or routing tool documentation
- Tandem parking documented without confirming local bylaw allows tandem
- For Boston: claiming parking exemption without identifying which MBTA facility (Forest Hills? Mattapan? Ashmont?) [source: c:\dev\permitmonkey\server\skills\boston-adu\references\transit-parking.md | retrieved: 2026-05-04 | citation: Boston transit-parking.md MBTA proximity workflow]

**Confidence:** HIGH for state-floor compliance; MEDIUM for transit-proximity correctness.

### 6. Site Drainage and Stormwater

**Must include:**
- Existing drainage pattern (arrows showing surface flow)
- Proposed drainage pattern
- Roof drainage termination (gutters, downspouts, dry wells if required)
- Local stormwater management requirements compliance (if applicable to project size)

**Code basis:**
- 780 CMR Chapter 18 — drainage requirements
- Municipal stormwater ordinance (typically triggered above a square-footage threshold; most single ADUs below threshold)
- MA wetlands regulations under MGL Ch 131 §40 if within 100 ft of resource area

**Visual identification:** Drainage arrows on plan; downspout symbols.

**Common deficiencies:**
- Roof runoff directed onto neighboring property (will be flagged)
- Existing drainage swale obliterated by ADU footprint without replacement
- Wetland resource area within 100 ft not flagged

**Confidence:** MEDIUM — depends heavily on specific site and city.

### 7. Utility Connections

**Must include:**
- Water service line (existing and proposed; size, route)
- Sewer service line (existing and proposed; size, route, slope)
- Electrical service (existing service amp rating; proposed sub-panel or new service)
- Gas service if applicable (note: Specialized Opt-In Code may push toward all-electric)

**Code basis:**
- 248 CMR (MA Plumbing Code) — water and sewer connection standards [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill 248 CMR plumbing reference]
- 527 CMR 12 — MA Electrical Code [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill 527 CMR 12 electrical reference]
- For Boston: Boston Water and Sewer Commission (BWSC) connection standards [source: c:\dev\permitmonkey\server\skills\boston-adu\references\zoning-residential.md | retrieved: 2026-05-04 | citation: Boston zoning-residential.md BWSC reference]

**Visual identification:** Utility lines shown with line-type legend; service entry points.

**Common deficiencies:**
- Sewer slope insufficient (must be ≥1/4" per foot for 4" residential)
- New electrical service added when existing service is adequate (cost issue, not code)
- For Specialized Opt-In municipalities: gas service shown when project claims all-electric pathway [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Boston Specialized Opt-In all-electric pathway]

**Confidence:** MEDIUM — utility detail varies by sheet level of completion.

### 8. Topography and Grading

**Must include:**
- Existing contour lines (typically 1- or 2-foot intervals)
- Proposed contour lines if grading changes
- Spot elevations at key points (corners of new structure, drainage points)
- Cut and fill volumes if substantial earthwork

**Code basis:**
- 780 CMR Chapter 18 — site work and excavation
- Municipal grading ordinance (rare for single ADU; common for hillside construction)

**Visual identification:** Contour lines with elevation labels.

**Common deficiencies:**
- Missing existing topography on sloped lots
- ADU foundation elevation set without referencing existing grade

**Confidence:** MEDIUM — depends on site complexity.

### 9. Historic District Indication (When Applicable)

**Must include (only if parcel is in a designated historic district):**
- Note that parcel is within [district name]
- Reference to Landmarks Commission review process
- Date of Landmarks Commission certificate (if obtained pre-permit)

**Code basis:**
- MGL Ch 40C — Massachusetts Historic Districts Act [source: c:\dev\permitmonkey\server\skills\boston-adu\references\historic-districts.md | retrieved: 2026-05-04 | citation: MGL Ch 40C governs historic districts; not preempted by Ch 150]
- For Boston: applicable to all 11 designated districts [source: c:\dev\permitmonkey\server\skills\boston-adu\references\historic-districts.md | retrieved: 2026-05-04 | citation: 11 Boston Landmarks districts]

**Visual identification:** Note block on site plan or cover sheet.

**Common deficiencies:**
- Missing district indication on Beacon Hill, Back Bay, South End, etc. parcels
- Landmarks review claimed but no certificate referenced

**Confidence:** HIGH — parcel-in-district is binary; verify against Boston Zoning Viewer or equivalent municipal GIS.

### 10. Wetlands / Conservation Indication

**Must include (only if parcel is within 100 ft of a wetland resource area):**
- Wetland boundary delineation (or note that none exists within 100 ft)
- Conservation Commission filing reference (Notice of Intent / Order of Conditions)

**Code basis:**
- MGL Ch 131 §40 — Wetlands Protection Act
- Municipal wetlands ordinance (often more restrictive than state)

**Visual identification:** Wetland boundary line; resource area buffer shown.

**Common deficiencies:**
- Resource area within 100 ft not shown
- Conservation filing claimed but no Order of Conditions referenced

**Confidence:** HIGH — buffer-zone proximity is verifiable from MassGIS data.

## Quick-Review Decision Tree

```
Are property lines drawn from a recorded survey?
├── NO → Deficient. Request survey reference.
└── YES → Continue.

Is the proposed ADU footprint dimensioned with setbacks to all property lines?
├── NO → Deficient. Request setback dimensions.
└── YES → Continue.

Does the lot coverage / FAR compliance table show required vs. provided?
├── NO → Deficient. Request compliance table.
└── YES → Continue.

Is parking documented with state-floor compliance (≤1 space, or 0 if MBTA proximity claimed)?
├── NO → Deficient. Reconcile with Ch. 150 floor; if city demands more, flag preemption.
└── YES → Continue.

If parcel is in a historic district, is the district named?
├── NO → If parcel IS in a district: deficient. If parcel is NOT in a district: pass this check.
└── YES → Continue.

If parcel is within 100 ft of a wetland resource area, is it shown?
├── NO → If buffer applies: deficient. If buffer does not apply: pass this check.
└── YES → Site plan passes.
```

## Reviewer Confidence Notes

- **HIGH confidence:** Setback dimensions present, parking count present, wetlands proximity flagged, north arrow + scale.
- **MEDIUM confidence:** Setback measured to correct reference point, FAR calculation correctness, MBTA proximity correctness.
- **LOW confidence:** Subtle drainage issues, hidden encroachments, undisclosed easements (require human reviewer).

## When to Escalate to Human Review

- Drainage discharge onto neighboring property (legal exposure)
- Encroachment of existing structure on setback that ADU exacerbates
- Wetland resource area shown without Conservation filing
- Historic district parcel without Landmarks certificate
- Tandem or undersized parking that may not meet local bylaw

## Source Verification

- 780 CMR home: https://www.mass.gov/state-building-code [source: https://www.mass.gov/state-building-code | retrieved: 2026-04-22 | citation: 780 CMR portal]
- MGL Ch 40A §3: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3 [source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3 | retrieved: 2026-05-04 | citation: MGL Ch 40A §3]
- MassGIS for wetland resource areas: https://www.mass.gov/info-details/massgis-data-massdep-wetlands

**Last verified:** 2026-05-04.
