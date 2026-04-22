# Decision Tree — By-Right ADU Eligibility

Walks through the factors that determine whether a proposed ADU qualifies for by-right approval under MGL Ch 40A §3 / 760 CMR 71.00.

## Step 1 — Is the lot in a single-family residential zoning district?

```
YES → continue to Step 2
NO (multi-family / mixed-use / commercial / industrial) → NOT state-preempted
    The ADU may still be allowed under local zoning — check ma-city-research skill for the
    specific district rules. But do NOT invoke Ch 150 §8 preemption for non-single-family zones.
```

## Step 2 — Is there an existing principal dwelling on the lot (or being built concurrently)?

```
YES → continue to Step 3
NO (ADU proposed without a principal dwelling) → NOT an ADU
    Ch 150 §7 defines ADU as "on the same lot as a principal dwelling". No principal = no ADU.
    This would be a standalone dwelling, subject to different rules (including potentially
    larger minimum lot size requirements).
```

## Step 3 — Is this the first/only ADU proposed on the lot?

```
YES → continue to Step 4
NO (2nd, 3rd ADU) → NOT by-right
    MGL Ch 40A §3 preempts only for a SINGLE ADU. Additional ADUs require special permit
    under general zoning rules. Contractor should expect discretionary ZBA review.
```

## Step 4 — Is the proposed ADU within state size limits?

Check two conditions. Both must be true:

- (a) Gross floor area ≤ 900 sq ft
- (b) Gross floor area ≤ 50% of primary dwelling's gross floor area

```
BOTH TRUE → continue to Step 5
EITHER FALSE → NOT a Protected Use ADU
    The ADU exceeds the state ceiling. Options:
    1. Reduce size to fit within the lesser of 900 sq ft or 50% of primary
    2. Proceed as a non-Protected Use ADU under local discretionary review (probably
       requires special permit; local rules apply without preemption)
```

Example calculations:
- Primary 1,200 sq ft, proposed ADU 700 sq ft → (a) 700 < 900 ✓, (b) 700 / 1,200 = 58.3% ✗. Exceeds 50% cap.
- Primary 1,800 sq ft, proposed ADU 900 sq ft → (a) 900 ≤ 900 ✓, (b) 900 / 1,800 = 50% ✓. At the cap.
- Primary 2,500 sq ft, proposed ADU 950 sq ft → (a) 950 > 900 ✗. Exceeds absolute cap.

## Step 5 — Does the ADU include all three dwelling unit elements?

Check:
- Sleeping area (bedroom or designated sleeping space)
- Cooking facilities (full kitchen or at minimum cooking appliance + sink)
- Sanitary facilities (bathroom with toilet, sink, bathing facility)

```
ALL THREE PRESENT → continue to Step 6
MISSING ONE OR MORE → NOT an ADU
    Without all three, the unit is not a "self-contained housing unit" under Ch 150 §7's
    definition. It may be an "accessory apartment" under a different local definition, or a
    home office, or a guest suite. Different rules apply.
```

## Step 6 — Does the ADU have a compliant separate entrance?

Per Ch 150 §7, the ADU must have "a separate entrance, either directly from the outside or through an entry hall or corridor shared with the principal dwelling sufficient to meet the requirements of the state building code for safe egress."

```
YES → continue to Step 7
NO → NOT a compliant ADU
    Redesign to include compliant separate entrance. This is a design issue, not a zoning
    question.
```

## Step 7 — Do local dimensional bylaws permit the proposed structure?

This is where the state floor ends and local authority starts. Check:
- Setbacks (front, side, rear, and possibly accessory structure setbacks)
- Height limit
- Lot coverage / FAR
- Any zone-specific requirements

```
YES (proposed design fits dimensional bylaws) → QUALIFIES FOR BY-RIGHT APPROVAL ✓
NO (proposed design exceeds dimensional limits) → Redesign or pursue variance
    Dimensional requirements are reserved to localities under Ch 150 §8. The state floor
    does NOT preempt dimensional rules. Contractor either redesigns or seeks a variance
    (which is a separate process and may be denied).
```

## Step 8 — Are there overlay restrictions?

Even after clearing Steps 1-7, check for:
- Historic district (MGL Ch 40C) — requires Historic District Commission approval if in a district
- Wetlands (MGL Ch 131 §40) — requires Conservation Commission approval if within 100 ft of a wetland resource area
- Flood plain — FEMA flood zone rules, elevation certificates
- Overlay districts specific to the municipality

```
NO OVERLAYS APPLY → BY-RIGHT APPROVAL PATH IS CLEAR
OVERLAYS APPLY → additional approvals needed alongside the by-right path
    These do NOT override by-right status, but add review layers. Plan for both
    the building permit track AND the overlay review track.
```

## Final Determination

If all checks pass:

**PROTECTED USE ADU — BY-RIGHT APPROVAL APPLIES**

The city must review the ADU administratively (site plan review if applicable, building permit review, standard inspections). Discretionary denial is not permitted. If the city attempts to impose discretionary review, cite preemption.

If any check fails:

**NOT A PROTECTED USE ADU — LOCAL DISCRETIONARY REVIEW APPLIES**

Contractor must comply with whatever local process applies (special permit, variance, or full denial with appeal path). State preemption does not help.

## Output Format

When running this decision tree, return:

```json
{
  "eligibility": "Protected Use ADU" | "Not Protected Use ADU",
  "failed_check": null | "Step X",
  "failure_reason": null | "...",
  "next_steps": [
    "Apply for building permit",
    "Request site plan review",
    ...
  ],
  "flags": [
    "Historic district applies",
    "Within 100 ft of wetland",
    ...
  ]
}
```

## Common Pitfalls

- Don't assume single-family zone — verify by address
- Don't confuse lot coverage with FAR
- Don't forget the "lesser of" rule on size
- Don't overlook that 2nd ADU is NOT by-right
- Don't skip the overlay check (historic and wetlands frequently apply in MA)
