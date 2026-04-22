---
name: adu-eligibility-checker
description: Free-tool backing skill for the "Is my lot ADU-eligible?" quick check. Takes an MA address, lot size, primary dwelling size, and zoning district; returns eligibility verdict (likely eligible / needs review / not eligible), maximum ADU size, parking requirement, and top-3 city-specific gotchas. Distribution lead magnet — runs in <10 seconds, collects email, upsells to paid corrections-interpretation service. Uses massachusetts-adu for state floor and ma-city-research for local overlays.
---

# ADU Eligibility Checker Skill

## Purpose

Powers the public-facing "Quick ADU Eligibility Check" free tool (PLAYBOOK.md §28). A homeowner enters a few data points and gets an instant verdict. The tool is the top of the funnel — users who want the full corrections-response service upgrade to paid.

## Non-Goals

- Not a substitute for professional plan check review
- Not a binding eligibility determination (always disclaimed)
- Not a substitute for actually reading the city bylaw in edge cases
- Does NOT handle the full corrections-interpreter flow — that's the paid product

## Inputs

| Field | Required | Format |
|-------|----------|--------|
| `address` | yes | MA street address, city, zip |
| `lot_size_sqft` | yes | integer |
| `primary_dwelling_sqft` | yes | integer |
| `zoning_district` | no (inferred if possible) | string |
| `proposed_adu_type` | no (defaults to undecided) | "detached"/"attached"/"conversion"/"undecided" |
| `proposed_adu_sqft` | no | integer |

## Processing Steps

### Step 1 — Resolve location
- Parse address to city
- If city not resolvable or not in MA, return "This tool currently supports Massachusetts addresses only."
- If city is in MA but not in `ma-city-research` cache, run Mode 1 discovery to identify zoning district (optional — may fall back to generic MA analysis with a flag)

### Step 2 — Apply state floor (via `massachusetts-adu`)
Use `massachusetts-adu/decision-tree/by-right-eligibility.md`:
- Is location in a single-family residential zone? (Assume yes based on user-provided zoning_district; if unclear, ask)
- Calculate max ADU size: `min(900, primary_dwelling_sqft * 0.5)`
- Determine parking requirement:
  - If user confirms within 0.5 mi of transit: 0 spaces
  - Else: up to 1 space

### Step 3 — Apply city overlay (via `ma-city-research`)
For covered cities (Boston, Cambridge, Somerville, Newton, Brookline):
- Pull dimensional standards for zoning district
- Calculate if proposed_adu (if provided) fits within setback / coverage rules
- Surface top-3 city-specific gotchas from the reference file

For uncovered cities:
- Flag: "We haven't fully researched [city] yet. Results based on state law only."
- Continue with state floor analysis

### Step 4 — Check overlay flags (via `massachusetts-adu/decision-tree/modifiers.md`)
- Historic district membership (flag if known)
- Wetlands risk (if available from municipal GIS)
- Floodplain risk (if available from FEMA)
- Specialized energy code adoption (affects construction cost)

### Step 5 — Compute verdict
- **likely_eligible** — state floor passes, local dimensionals plausible, no flagged overlays
- **needs_review** — state floor passes but local dimensionals tight OR overlay flag present
- **not_eligible** — fails state floor (e.g., not single-family zone, primary dwelling missing) OR exceeds local dimensionals with no variance path

## Output Contract

```json
{
  "verdict": "likely_eligible" | "needs_review" | "not_eligible",
  "verdict_summary": "<one sentence for the UI>",
  "max_adu_sqft": 700,
  "parking_required": 0,
  "parking_exemption_reason": "Within 0.5 mi of Alewife T (Red Line)",
  "city_gotchas": [
    "Historic district review likely applies in Old Cambridge",
    "Lot coverage limit 50% — proposed 900 sq ft detached may push past limit",
    "Specialized Energy Code — heat pump required"
  ],
  "overlay_flags": {
    "historic": "possible",
    "wetlands": "unlikely",
    "floodplain": "not applicable",
    "specialized_code": "yes"
  },
  "next_steps": [
    "Confirm zoning district with city planning office",
    "Verify lot coverage headroom for primary + ADU combined footprint",
    "Plan for heat pump and HERS rating"
  ],
  "upgrade_cta": "Ready to submit? PermitMonkey's corrections-interpretation service gets your permit through plan check 3x faster.",
  "disclaimer": "This is a non-binding preliminary analysis. Always verify with your city's building department before committing."
}
```

## User Experience Flow (Frontend)

1. User lands on `/eligibility` page
2. Enters address + lot size + primary size
3. Tool runs this skill, <10 sec
4. Results page shows:
   - Verdict card (with big number: "Your max ADU is 750 sq ft")
   - Top 3 city-specific gotchas
   - Share buttons (pre-filled social posts)
   - Email capture for full PDF report
5. After email capture: upsell to paid service + referral to partner contractors

## Privacy

- Address is collected for analysis but NOT stored with email capture — store anonymized analysis metadata only (city, lot size, outcome)
- Email capture is opt-in with clear value prop
- No PII in logs

## Rate Limiting

- Max 5 eligibility checks per IP per hour (prevents scraping)
- Captcha after 3 checks

## Share Artifact Format

For the viral artifact (PLAYBOOK.md §32):

```
Your Lot: 8,200 sq ft in Cambridge
✓ Zoned Residence A-2 — ADU allowed by-right
✓ Max ADU size: 900 sq ft
✓ Within 0.5 mi of Alewife T — no parking required
⚠ Historic district — design review likely

Checked by PermitMonkey · permitmonkey.ai/eligibility
```

Rendered as a branded card image (SVG → PNG via server-side renderer) suitable for LinkedIn / Twitter / Instagram.

## SEO Integration

The eligibility check page has a per-city landing page variant for programmatic SEO:
- `/eligibility/boston`
- `/eligibility/cambridge`
- `/eligibility/somerville`
- etc.

Each per-city page is seeded with:
- "ADU eligibility [City]" title
- Top-3 gotchas for that city prominently displayed
- Schema FAQ markup from `ma-aeo-content` (planned skill)

## Implementation Notes

- Runs as a fast path in the server, not through the full Agent SDK pipeline
- Model: Sonnet 4.6 or Haiku 4.5 (doesn't need Opus for this)
- Response time SLA: <10 seconds
- Cached results per (city, dimensional parameters) for 7 days

## Known Limitations

- Historic district detection currently relies on user self-report or city-level flags (not per-parcel GIS)
- Wetlands detection not yet wired to MassGIS or FEMA APIs — flagged as "possible" on waterfront lots via simple heuristics
- Floodplain detection not yet wired
- Non-standard zoning districts (e.g., Boston's neighborhood-specific articles) may not resolve cleanly — falls back to state analysis with flag

## Roadmap

- v1 (launch, 1 weekend): state floor + 3 covered cities, text output, email capture
- v2 (30 days): visual scorecard artifact, 10 covered cities, share integration
- v3 (90 days): MassGIS wetlands integration, per-parcel historic district lookup, FEMA flood zone integration, geolocated transit distance
