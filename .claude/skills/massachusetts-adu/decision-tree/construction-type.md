# Decision Tree — ADU Construction Type

Identifies which construction type applies and what code pathway that invokes. Used after by-right eligibility is established.

## The Four Types

### Type A — Detached New Construction
A separate structure on the lot from the primary dwelling. "Backyard cottage," "granny flat," "carriage house" style.

**Code pathway:**
- IRC 2021 (adopted by 780 CMR Ch 51) — full new one-family dwelling requirements
- New foundation (frost-depth, 48" in MA typical)
- Independent utilities or metered sub-feeds from primary
- Fire-separation distance from primary and lot lines (IRC R302.1)
- Full energy code compliance (Stretch or Specialized per municipality)

**Common corrections:**
- Fire-rated exterior walls if < 5 ft from lot line
- Emergency egress from sleeping areas (R310)
- Mechanical ventilation (M1505 / ASHRAE 62.2)
- Energy code: envelope R-values, HERS rating, blower door test
- Separate electrical service or sub-panel with load calc

### Type B — Attached New Construction
Addition to the existing primary dwelling creating an ADU.

**Code pathway:**
- IRC for new construction portion
- Existing Building Code (780 CMR Ch 34 / IEBC 2021) for alterations to primary
- 1-hour fire-resistance-rated separation between ADU and primary (R302.3)
- Shared or separate utilities depending on design

**Common corrections:**
- Fire separation between dwelling units
- Sound separation (often local design standard)
- Modifications to existing structure to accommodate addition (structural review)
- Energy code applies to the new construction; existing dwelling envelope not required to upgrade unless triggered
- Plumbing/electrical tie-in

### Type C — Interior Conversion
Conversion of space within the existing primary dwelling (basement finish, attic conversion, interior re-partition) to create an ADU.

**Code pathway:**
- Existing Building Code (780 CMR Ch 34 / IEBC 2021) as primary
- IRC referenced for new work (e.g., new partitions, new egress windows, new kitchen)
- Fire separation between ADU and rest of primary (R302.3)
- Egress compliance is the big-ticket item — retrofitting egress windows in basements is common

**Common corrections:**
- Habitable space requirements (ceiling height R305 — 7 ft in most habitable rooms, 6'8" in bathrooms)
- Emergency egress from basement bedrooms (window or door meeting R310)
- Moisture/vapor management in basements
- Ventilation and ceiling height in attic conversions
- Electrical service capacity (add ADU load to existing service)
- Fire separation (1 hour between units)

### Type D — Exterior Conversion (Garage, Barn, Carriage House)
Conversion of an existing detached accessory structure (garage, barn, outbuilding) to an ADU.

**Code pathway:**
- Existing Building Code (780 CMR Ch 34)
- Major retrofit to dwelling-unit standards (IRC requirements applied to what was not previously a dwelling)
- Fire-separation distances from primary and lot lines
- Insulation, mechanical systems, plumbing often entirely new

**Common corrections:**
- Existing garage often doesn't meet frost-depth footing requirements for dwelling use — may require underpinning or rebuild
- Fire-separation if close to lot line
- Full mechanical, electrical, plumbing installation often triggers full new-construction-level compliance
- Energy code: upgrading envelope to meet Stretch/Specialized standards
- Accessibility: 521 CMR rarely triggers but check
- Flood zone if garage is in a floodplain

## Decision Tree

```
Is the ADU a separate structure from the primary?
├── YES
│   ├── Is it NEW construction?
│   │   ├── YES → Type A (Detached New)
│   │   └── NO → Type D (Exterior Conversion)
│   └── — (no other branches)
└── NO
    ├── Is new building envelope being added?
    │   ├── YES → Type B (Attached New)
    │   └── NO → Type C (Interior Conversion)
```

## Mixed Cases

Some ADU projects combine types. Examples:
- Garage conversion with a second-story addition above = Type D + Type A hybrid
- Basement finish with a new walk-out exit = Type C + Type A for the new egress

When mixed, apply the most stringent applicable requirement per element.

## Code Version

As of April 2026, MA is on:
- 780 CMR 10th Edition (adopted Oct 2023)
- IRC 2021 with MA amendments
- IEBC 2021 with MA amendments
- IECC 2021 with MA amendments (or Stretch / Specialized)

Projects permitted before 10th Edition effective date may be grandfathered.

## Output Format

```json
{
  "construction_type": "A" | "B" | "C" | "D" | "mixed",
  "primary_code_path": "IRC 2021" | "IEBC 2021" | "mixed",
  "likely_correction_categories": [
    "fire_separation",
    "egress",
    "energy_code",
    "mechanical_ventilation",
    "electrical_service"
  ],
  "special_considerations": [
    "Frost depth footings required",
    "Existing structure may need structural assessment"
  ]
}
```

## Common Pitfalls

- Don't treat a conversion as new construction — different code path, different requirements
- Don't assume existing garage can bear residential loads without engineer review
- Don't skip energy code compliance on conversions — it usually applies to the ADU portion
- Don't forget fire separation in stacked or attached ADUs
