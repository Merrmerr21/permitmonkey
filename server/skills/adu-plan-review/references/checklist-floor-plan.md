---
title: "Floor Plan — Plan Review Checklist (Massachusetts ADU)"
category: plan-review
sheet_type: floor-plan
jurisdiction: Massachusetts
relevance: "Load when reviewing floor plan sheets (typically A2-A4). Defines required elements for room labeling, dimensions, egress, fire separation, ADU dimensional rules under 760 CMR 71.00, accessibility-as-applicable, and confidence calibration."
---

# Floor Plan Checklist — Massachusetts ADU

This file defines what must appear on the floor plan sheets and the code basis for each. Floor plans are where ADU eligibility (size, three-element dwelling unit, separate entrance) and life-safety (egress, fire separation) are proven.

## Scope

Applies to existing-condition and proposed floor plans for ADU permit submittals. Both interior conversions and new-construction ADUs require floor plans showing the ADU as a complete dwelling unit. [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\760-cmr-71-protected-use-adu.md | retrieved: 2026-05-04 | citation: 760 CMR 71.00 Protected Use ADU criteria]

## Required Elements

### 1. Existing Conditions Floor Plan

**Must include:**
- Existing room layout with all walls, doors, windows
- Existing room labels (kitchen, bath, bedroom, living, etc.)
- Existing dimensions (overall and key interior partitions)
- Existing structural elements (load-bearing walls, columns, beams)

**Code basis:**
- 780 CMR 107.3.1 — must show existing conditions for alteration projects [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: 780 CMR 107]
- IRC R104 — building official may require existing condition documentation

**Visual identification:** Typically the first floor plan sheet, drawn at lighter line weight or with shaded existing walls.

**Common deficiencies:**
- Missing existing-conditions plan entirely (especially for "new construction" that's actually a conversion)
- Existing dimensions don't match field-measured reality
- Load-bearing walls not identified before being removed

**Confidence:** HIGH for presence; MEDIUM for accuracy.

### 2. Proposed Floor Plan(s)

**Must include:**
- Proposed room layout for the ADU showing all walls, doors, windows
- Room labels with specific use (kitchen, bedroom, bath, etc.)
- Dimensions (overall, room sizes, door/window rough openings)
- Wall types (existing vs. proposed; rated vs. non-rated)
- Door and window schedule reference

**Code basis:**
- 780 CMR 107.3.1 — construction documents must be coordinated and complete
- IRC R301 — adequate spaces and dimensions

**Visual identification:** Distinct line weight from existing conditions; new walls heavier or shaded.

**Common deficiencies:**
- Bedroom labeled but lacks egress window
- Bathroom layout violates IRC fixture clearance rules
- Walls dimensioned in inches without aggregating to overall

**Confidence:** HIGH for room labels; MEDIUM for dimensional accuracy.

### 3. ADU Dwelling-Unit Completeness

**Must include (for the ADU to qualify as Protected Use):**
- Sleeping room (one or more — labeled bedroom or studio sleeping area)
- Cooking facilities (kitchen with sink, range/cooktop, refrigerator location)
- Sanitary facilities (bathroom with toilet, sink, shower or tub)
- Separate entrance providing egress per IRC R311

**Code basis:**
- 760 CMR 71.00 — Protected Use ADU requires all three dwelling-unit elements [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\760-cmr-71-protected-use-adu.md | retrieved: 2026-05-04 | citation: 760 CMR 71.00 dwelling-unit completeness]
- MGL Ch 40A §1A — statutory ADU definition [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §7 amending §1A]

**Visual identification:** Room labels + fixture symbols (toilet, range, sink) on plan.

**Common deficiencies:**
- "ADU" labeled but no kitchen (just a kitchenette nook without a range — borderline)
- Two ADUs proposed on a single lot when only one qualifies as Protected Use [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\760-cmr-71-protected-use-adu.md | retrieved: 2026-05-04 | citation: single ADU per lot under Protected Use]
- ADU lacks separate entrance from primary dwelling (interior-only access is allowed but separate entrance is preferred)

**Confidence:** HIGH for presence of all three elements; MEDIUM for whether kitchenette qualifies as full kitchen.

### 4. ADU Size Compliance (≤900 sq ft or ≤50% of primary)

**Must include:**
- ADU gross floor area calculation (specify methodology — interior measurement vs. exterior wall)
- Primary dwelling gross floor area for the 50% comparison
- Compliance statement: ADU ≤ 900 sq ft AND ADU ≤ 50% of primary

**Code basis:**
- MGL Ch 40A §1A as amended — 900 sq ft or 50% cap, whichever is less [source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §7 amending §1A]
- 760 CMR 71.00 — Protected Use envelope [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\760-cmr-71-protected-use-adu.md | retrieved: 2026-05-04 | citation: 760 CMR 71.00 size cap]

**Visual identification:** Square-footage table on floor plan or cover sheet.

**Common deficiencies:**
- ADU at 920 sq ft assuming "rounding" — state cap is hard
- 50%-of-primary calculation excludes finished basement of primary (which may count under municipal bylaw)
- Conversion ADU sized larger than the converted space actually permits

**Confidence:** HIGH for presence; MEDIUM for measurement methodology consistency.

### 5. Egress (Emergency Escape and Rescue Opening)

**Must include:**
- Every sleeping room shows a compliant egress window or door
- Window dimensions called out on plan or in window schedule
- Sill height noted (max 44" above finished floor)
- Egress path from sleeping rooms to public way

**Code basis:**
- IRC R310 (as adopted by 780 CMR) — emergency escape and rescue opening required from every sleeping room [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC R310 reference]
- Minimum: 5.7 sq ft net clear, 24" min height, 20" min width, 44" max sill

**Visual identification:** Window symbols at exterior walls of bedrooms; sill-height callouts.

**Common deficiencies:**
- Basement bedroom egress: existing window doesn't meet 5.7 sq ft net clear (most common conversion ADU correction)
- Sill height >44" — fixed by adding window well or lower-sill replacement
- Egress window obstructed by mechanical equipment (HVAC condenser, dryer vent)
- Bedroom labeled as "office" or "den" to avoid egress requirement (improper if used for sleeping) [source: c:\dev\permitmonkey\server\skills\boston-adu\references\building-codes.md | retrieved: 2026-05-04 | citation: Boston building-codes.md egress section]

**Confidence:** HIGH for presence of windows in bedrooms; MEDIUM for dimensional compliance (requires careful measurement).

### 6. Fire Separation (Attached and Conversion ADUs)

**Must include:**
- Wall and ceiling assemblies between the ADU and primary dwelling
- Fire-resistance rating callout (typically 1-hour per IRC R302.3)
- Penetration sealing details
- Door rating between dwelling units (typically 20-minute per IRC)

**Code basis:**
- IRC R302.3 (as adopted by 780 CMR) — 1-hour fire-resistance separation between dwelling units [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC R302 fire separation]
- IRC R302.5 — openings between dwelling units (20-minute door)

**Visual identification:** Wall-type schedule with rated assemblies; section detail referenced from floor plan.

**Common deficiencies:**
- Conversion ADU shows shared wall without fire separation called out
- Stacked ADU without rated floor/ceiling assembly
- Door between primary and ADU shown without 20-minute rating

**Confidence:** HIGH for callout presence; MEDIUM for assembly correctness (requires section detail review).

### 7. Smoke and CO Alarms

**Must include:**
- Smoke alarm symbols in every sleeping room
- Smoke alarm symbols outside sleeping areas on every story
- CO alarm symbols within 10 ft of sleeping areas (if fuel-burning appliance or attached garage)
- Note that alarms are interconnected and hardwired with battery backup (new construction) or battery (alteration)

**Code basis:**
- IRC R314, R315 (as adopted by 780 CMR) — smoke and CO alarm placement [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC R314/R315 reference]
- MGL Ch 148 §§26F, 26F½ — MA-specific smoke and CO requirements (applicable at sale/transfer; design-stage compliance via 780 CMR) [source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleII/Chapter148/Section26F | retrieved: 2026-05-04 | citation: MGL Ch 148 §26F]

**Visual identification:** "S" and "C" or specific alarm symbols on floor plan with legend.

**Common deficiencies:**
- Alarms shown without interconnection note
- Missing CO alarm where fuel-burning appliance present (gas range, gas water heater, attached garage)
- Battery-only alarms in new construction (must be hardwired)

**Confidence:** HIGH for symbol presence; MEDIUM for compliance detail.

### 8. Mechanical Ventilation

**Must include:**
- Whole-house mechanical ventilation method (exhaust-only, supply-only, balanced HRV/ERV)
- Bath fan with timer or humidistat
- Range hood vented to exterior
- For Specialized Opt-In Code municipalities: balanced HRV/ERV strongly recommended/required

**Code basis:**
- IRC M1505 — whole-house ventilation per ASHRAE 62.2 [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC M1505 mechanical ventilation]
- For Boston, Cambridge, Somerville, Newton, Brookline: 225 CMR 22 Appendix RC tight-envelope effectively requires balanced ventilation [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Boston Specialized Opt-In ventilation]

**Visual identification:** Fan symbols, ducting on plan, ventilation note block.

**Common deficiencies:**
- Bath fan without exterior termination
- Range hood recirculating (over-the-range microwave) when local code requires exterior duct
- No HRV/ERV in Specialized Opt-In municipality with tight envelope target

**Confidence:** MEDIUM — varies by municipality.

### 9. Accessibility (Applicability Limited)

**Must include (only if accessibility applies):**
- Note about whether 521 CMR (Architectural Access Board) accessibility applies
- For ADUs in 1- and 2-family dwellings: 521 CMR generally does NOT apply
- For ADUs in 3+ family or where the project triggers public accommodation thresholds: apply 521 CMR

**Code basis:**
- 521 CMR (MA Architectural Access Board) — generally not applicable to single-family ADUs [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill 521 CMR scope]

**Visual identification:** Note on cover sheet typically; floor plan may show accessible dimensions if applicable.

**Common deficiencies:**
- Treating 521 CMR as universally applicable to residential ADUs (it generally isn't for 1-2 family)
- Missing 521 CMR analysis when ADU is in a 3+ family building

**Confidence:** HIGH for non-applicability; MEDIUM for boundary cases.

## Quick-Review Decision Tree

```
Does the floor plan show all three dwelling-unit elements (sleep / cook / sanitary)?
├── NO → Deficient. ADU does not qualify as Protected Use.
└── YES → Continue.

Is the ADU sized at ≤900 sq ft AND ≤50% of primary (whichever is less)?
├── NO → Outside Protected Use envelope. Discretionary review applies.
└── YES → Continue.

Does every sleeping room have a compliant egress window?
├── NO → Deficient. Cite IRC R310.
└── YES → Continue.

For attached ADUs: is fire separation called out (IRC R302.3, 1-hour)?
├── NO → Deficient. Cite IRC R302.3.
└── YES → Continue.

Are smoke and CO alarms shown per IRC R314/R315?
├── NO → Deficient. Cite IRC R314/R315.
└── YES → Floor plan passes.
```

## Reviewer Confidence Notes

- **HIGH confidence:** Room labels, basic dimensions, alarm symbol presence, egress window presence.
- **MEDIUM confidence:** Egress dimensional compliance (need careful measurement), fire separation assembly correctness, ADU size measurement methodology.
- **LOW confidence:** Whether kitchenette qualifies as full kitchen (case-by-case), accessibility applicability for boundary cases.

## When to Escalate to Human Review

- Bedroom egress at borderline dimensions (5.5 sq ft net clear, etc.)
- Conversion ADU with non-standard fire separation approach
- ADU in 3+ family building (accessibility analysis needed)
- Kitchenette-vs-full-kitchen judgment call

## Source Verification

- IRC R310, R302, R314, R315 via 780 CMR: https://www.mass.gov/state-building-code [source: https://www.mass.gov/state-building-code | retrieved: 2026-04-22 | citation: 780 CMR portal]
- MGL Ch 148 §§26F, 26F½: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleII/Chapter148

**Last verified:** 2026-05-04.
