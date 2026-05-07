---
name: permitmonkey-ma-eligibility
description: "Companion skill for the PermitMonkey MCP server (mcp/) shipped to the Anthropic connector directory. Teaches an agent how to invoke the check_ma_adu_eligibility tool, interpret its structured verdict, render citations correctly, and escalate edge cases. Triggers when an agent has access to the permitmonkey-ma-eligibility MCP tool and the user asks about Massachusetts ADU eligibility, parking rules under 760 CMR 71.00, the lesser-of-900-or-50% size cap, or the difference between state preemption and local bylaws."
---

# PermitMonkey MA ADU Eligibility — Companion Skill

This skill pairs with the MCP server at [`mcp/`](../../../mcp/). The MCP server provides one deterministic tool, `check_ma_adu_eligibility`. This skill teaches you how to use it well.

Per master playbook §107, when the [MCP skill-delivery extension](https://github.com/modelcontextprotocol/experimental-ext-skills) stabilizes, this skill ships from the server itself and every MCP-compatible client inherits it automatically.

## When to invoke

- User asks about ADU eligibility for a specific Massachusetts address.
- User asks about state preemption versus local bylaws under MGL Ch 40A § 3 as amended by St. 2024 c. 150 § 8.
- User asks how the 900 sqft / 50% size cap interacts with their primary dwelling.
- User asks about parking under 760 CMR 71.00 and transit proximity.
- User asks about owner-occupancy preemption (cities cannot require owner-occupancy of either dwelling).

## When NOT to invoke

- Non-Massachusetts ADU questions — the tool will reject non-MA addresses.
- Questions about historic district approval procedures (the tool flags overlay, but Mass Historic Commission process is out of scope).
- Wetlands, floodplain, or specialized environmental review — tool returns `not_checked` for these.
- Questions about the actual *construction* of an ADU (building code, energy code) — those are downstream of eligibility.
- Corrections-letter interpretation — that's the paid PermitMonkey product, not this free tool.

## Inputs the user must provide

| Required | Source for the user |
|----------|--------------------|
| `address` (with "MA" or "Massachusetts" in the string) | Property address |
| `lot_size_sqft` | City assessor record, deed, or tax bill |
| `primary_dwelling_sqft` | Gross floor area of the existing main house |

| Optional but high-value | Why |
|------------------------|-----|
| `proposed_adu_sqft` | If provided and exceeds the state cap (lesser of 900 or 50% of primary), the verdict flags it with a clear reason |
| `within_half_mile_transit` | If true, parking_required becomes 0 (760 CMR 71.00 preempts local parking requirements near transit) |
| `in_historic_district` | If true and the city has historic overlays, verdict shifts to `needs_review` and adds 60-120 days to the timeline narrative |

If the user is missing required inputs, ask once, batched. Do not ask sequentially.

## How to interpret the result

The tool returns three verdict states:

**`likely_eligible`** — Lot clears the state floor. ADU is by-right under MGL Ch 40A § 3. Surface the `max_adu_sqft` and `parking_required` numbers prominently. Note the `city_gotchas` array — these are the local-form constraints that apply *after* state use preemption. Do not over-promise: the verdict is non-binding preliminary analysis.

**`needs_review`** — Lot probably qualifies but a flag exists (small lot, historic district, uncovered city). The first item in `next_steps` is usually the gating action. Frame this as "you're probably eligible, here's what to verify first."

**`not_eligible`** — Lot fails a structural test (primary too small to be a dwelling, proposed ADU exceeds the absolute cap). Be direct about the failure reason; do not soften.

For all three, render the `citations` array as inline pills with verifiable URLs. The MCP server's structured payload includes the canonical statute and CMR URLs — use them verbatim. **Never substitute a paraphrased citation for the verbatim authority field.**

## Coverage transparency

Five cities are fully researched (Boston, Cambridge, Somerville, Newton, Brookline). For everything else, `city_covered` is `false` and the verdict is `needs_review` even if the lot otherwise passes. This is honest signaling — say so to the user. Do not pretend the tool covers every MA municipality.

## Output format

When responding to the user, structure the answer like this:

1. **Verdict in plain language** — one sentence, lead with the verdict word.
2. **Numbers that matter** — `max_adu_sqft` and `parking_required` as a tight pair.
3. **City-specific gotchas** — bulleted, max 3 items, copied verbatim from the tool output.
4. **Next steps** — bulleted, exactly as returned (3 items).
5. **Citations** — inline links with the verbatim authority text.
6. **Disclaimer** — copied from the tool's `disclaimer` field. Do not paraphrase.
7. **Upgrade CTA** — copied from `upgrade_cta`. Do not pad.

## Edge cases

**User provides a non-MA address.** The tool's `evaluateEligibility` will populate `city: null` and produce `needs_review`. Do not let this slide — explicitly tell the user the tool covers Massachusetts only and ask if they want to provide a different address.

**User provides primary_dwelling_sqft below 400.** Verdict is `not_eligible`. The reason field references "below typical habitable threshold" — explain this means the state floor assumes an existing single-family primary dwelling. If the user is in pre-construction (no primary yet), the ADU framework does not apply.

**User provides proposed_adu_sqft above max_adu_sqft.** Verdict is `not_eligible`. State the gap explicitly: "Your 1,200 sqft proposal exceeds the state-protected max of 900 sqft. You can either reduce the ADU footprint or pursue a special permit (different legal track, no by-right protection)."

**User asks "what about my city" for a city not in the covered list.** Honestly: "We have not yet fully researched [city]'s ADU bylaw. Results below are based on state law only. Verify dimensional rules with [city]'s planning office before committing." Do not fabricate city-specific facts.

## Provenance discipline (master playbook §225)

This skill carries the same provenance bar as every other PermitMonkey reference file: every claim about MA ADU law traces to a verifiable canonical source. The MCP tool's `citations` array is the source of truth for the structural claims. When extending this skill with new guidance, tag each new fact with the inline `[source: URL | retrieved: YYYY-MM-DD | citation: SECTION]` format.

## Source Verification

[source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3 | retrieved: 2026-05-07 | citation: MGL Ch 40A § 3 — by-right ADU paragraph after Ch 150 § 8]
[source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-05-07 | citation: St. 2024, c. 150 §§ 7-8 — Affordable Homes Act ADU provisions]
[source: https://www.mass.gov/info-details/accessory-dwelling-units | retrieved: 2026-05-07 | citation: 760 CMR 71.00 — EOHLC implementing regulation]

**Last verified:** 2026-05-07
