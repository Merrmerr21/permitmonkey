---
title: Boston ADU Fees, Linkage, and Inclusionary Applicability
category: fees
relevance: medium
key_code_sections: "ISD building permit fee schedule (city ordinance); BPDA Article 80 linkage thresholds; Boston Inclusionary Development Policy (IDP)"
last_verified: 2026-05-03
---

# Boston ADU Fees, Linkage, Inclusionary Applicability

## Building Permit Fees

Boston ISD calculates building permit fees on construction valuation. Approximate ranges for a typical single-family ADU project (~$100K–$200K stated valuation):

- **Building permit**: ~$1,500–$3,000
- **Mechanical, plumbing, and electrical permits** (separate from building): ~$200–$500 each
- **Plan review surcharges**: variable; typically rolled into the building permit fee

[source: c:\dev\permitmonkey\.claude\skills\ma-city-research\references\boston.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: existing PermitMonkey city-research notes — "Fees (Approximate)" section]

**TBD — verification pending:** the current ISD-published fee schedule with exact valuation-to-fee formula. Fees scale by valuation tier and may have been adjusted since the 2026-04-22 verification of the city-research notes. Pull the current schedule from the ISD building forms page at https://www.boston.gov/departments/inspectional-services/building-forms-and-applications before quoting an exact dollar figure in a contractor response.

When citing a Boston permit fee in a corrections response or contractor estimate, default to "approximately $X based on the 2026-04-22 verified range; confirm current ISD fee schedule before invoicing." Do NOT assert a precise dollar figure as if it's pulled from a current authoritative source unless you have just verified.

## Linkage (Large Project Linkage Fee)

Boston's Linkage program imposes a per-square-foot fee on large commercial and residential projects to fund affordable housing and workforce training. Linkage applies above a project-size threshold tied to Article 80 review.

[source: https://www.bostonplans.org/projects/development-review/what-is-article-80 | retrieved: 2026-05-03 | citation: Article 80 framework (linkage tied to large-project thresholds)]

**Practical implication for ADUs**: a single Protected Use ADU is capped at 900 sq ft by state law (760 CMR 71.00) — far below any linkage threshold. **Linkage does not apply to a single Boston ADU.**

When a Boston correction letter references linkage in connection with an ADU permit, treat as likely-erroneous unless the project includes substantial primary-dwelling work or multiple ADUs that aggregate above the threshold. Verify the cited threshold by parsing the corrections letter for the specific dollar-per-sq-ft rate and project size, then cross-check against the controlling Article.

## Inclusionary Development Policy (IDP)

Boston's IDP requires set-asides of affordable units in residential developments above a project-size threshold. IDP, like linkage, attaches to large projects via the Article 80 review framework.

[source: https://www.bostonplans.org/projects/development-review/what-is-article-80 | retrieved: 2026-05-03 | citation: Article 80 framework]

**Practical implication for ADUs**: a single Protected Use ADU does not trigger IDP. IDP applies to multi-unit residential projects above the unit-count threshold, not to single accessory dwellings on a single-family lot.

When a Boston correction letter cites IDP applicability for an ADU permit, treat as likely-erroneous and respond accordingly.

**TBD — verification pending:** the precise IDP unit-count threshold and per-unit set-aside formula. Pull from the BPDA IDP guidance page before quoting in a contractor response.

## State Impact Fee Exemption (When It Applies)

For municipalities zoned under standard MGL Ch 40A, 760 CMR 71.00 limits cities' authority to impose impact fees on Protected Use ADUs above what would be charged for an equivalent unit of housing. Boston's special-act framework reaches this question with the same hybrid-reading framework as the broader USE preemption — see `eohlc-compliance.md` for the Boston-specific caveat.

[source: c:\dev\permitmonkey\server\skills\boston-adu\references\eohlc-compliance.md | retrieved: 2026-05-03 | citation: this skill's eohlc-compliance reference]

**Default for the agent's response**: if a Boston correction imposes a permit fee that appears to exceed what a comparable single-family unit would be charged, frame as "this fee may be inconsistent with the 760 CMR 71.00 framework as applied to Protected Use ADUs; we request the city confirm the fee calculation and reduce if appropriate." Do NOT flat-assert state preemption against the Boston fee schedule.

## Fee Categories That Don't Trigger Easy Preemption

Some Boston fee categories are clearly within the city's reserved authority:

- **Plan review and inspection fees**: these are administrative cost recovery, not impact fees. Not subject to Ch. 150 floor.
- **Certificate of occupancy fees**: same — administrative, recoverable.
- **Stormwater management fees**: tied to environmental authority under MGL Ch 131 §40 (wetlands) and separate stormwater permitting, not preempted by Ch. 150.
- **BWSC connection fees** (water and sewer): utility-based, not preempted.

Don't argue preemption against these. Cite them as legitimate municipal fees and budget accordingly in the contractor response.

## Workflow for the Agent

When a Boston ADU correction touches fees:

1. **Identify the fee category.** Building permit / MPE / plan review / inspection / linkage / IDP / impact fee / utility / stormwater. The category determines the analysis path.
2. **For linkage and IDP**: confirm whether the project triggers Article 80 thresholds. A single ADU under 900 sq ft does not.
3. **For impact fees that appear excessive**: frame as "may be inconsistent with 760 CMR 71.00" rather than flat preemption assertion.
4. **For administrative fees**: treat as legitimate; budget without protest.
5. **Quote a current dollar figure only if you have just verified against the ISD-published schedule.** Otherwise frame as approximate.

## Source Maintenance

- Re-verify the ISD building permit fee schedule quarterly. Boston updates fees at the start of each fiscal year (July 1).
- Watch for changes to Article 80 linkage thresholds and IDP unit-count thresholds.
- If 760 CMR 71.00 receives an EOHLC TA letter on Boston-specific impact-fee applicability, update the impact-fee section here and in `eohlc-compliance.md`.

**Last verified:** 2026-05-03. Next check: 2026-08-03.

## See Also

- `permit-process.md` — Article 80 thresholds (single ADU does not trigger)
- `eohlc-compliance.md` — Boston preemption-reach framework that governs the impact-fee analysis
- `building-codes.md` — code-edition transition affects permit-fee calculation
- BPDA Linkage program page (URL pending verification)
- BPDA IDP guidance page (URL pending verification)
