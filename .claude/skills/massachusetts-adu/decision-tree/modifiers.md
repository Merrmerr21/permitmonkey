# Decision Tree — ADU Modifiers and Special Conditions

Overlays, exemptions, and special conditions that modify the baseline by-right analysis. Apply AFTER by-right eligibility (`by-right-eligibility.md`) and construction type (`construction-type.md`) are established.

## Transit Proximity (Parking Exemption)

**Rule:** If the ADU is within 0.5 miles of a commuter rail station, subway station, ferry terminal, or bus station, zero additional parking spaces are required. (MGL Ch 40A §3 as amended by St. 2024, c. 150, §8.)

**Measurement:** Walking distance via existing pedestrian infrastructure, not straight-line.

**Open interpretive question:** Does "bus station" include every MBTA local bus stop? EOHLC guidance favors a broader reading, but some cities interpret narrowly (only designated transit terminals). When in doubt, measure to nearest commuter rail or subway — these are unambiguous.

**Practical check:**
1. Look up the address on MBTA's trip planner or Google Maps
2. Identify the nearest transit facility
3. Measure walking distance (Google Maps "directions → walking")
4. If ≤ 0.5 mi, zero parking required

## Historic District Overlay

**Rule:** ADUs in locally designated historic districts (under MGL Ch 40C) require Historic District Commission (HDC) approval for exterior modifications. This is SEPARATE from zoning and not preempted by Ch 150.

**What HDC reviews:**
- Exterior materials
- Window and door placement / style
- Rooflines and massing
- Color (sometimes)
- Accessory structure placement

**What HDC does NOT review:**
- Interior modifications (unless visible from public way)
- The USE (whether ADU is allowed) — this remains by-right under state law
- Dimensional bylaws (those are zoning)

**Contractor implications:**
- HDC review typically takes 4-8 weeks
- Present HDC with materials matching surrounding historic character
- If denied, appeal via local HDC rules; if still denied, appeal to superior court

**How to identify if a lot is in a historic district:**
- Check municipal GIS
- Contact local HDC office
- Look for historic district signage on site

## Wetlands Resource Area

**Rule:** Construction within 100 feet of a wetland resource area requires Notice of Intent and Conservation Commission approval under the MA Wetlands Protection Act (MGL Ch 131 §40).

**Not preempted by Ch 150.** ADUs are subject to wetlands rules like any other construction.

**Resource areas include:**
- Bordering vegetated wetlands
- Streams, rivers, ponds
- Bordering Land Subject to Flooding
- Riverfront areas (100-200 ft)

**Contractor implications:**
- Wetlands review can take 8-12 weeks
- May require stormwater management plans, erosion control, limited alteration
- Detached ADUs placed near wetlands commonly hit this
- Conversions of existing structures generally OK if no footprint change

## Floodplain (FEMA Flood Zone)

**Rule:** Construction in FEMA-designated flood zones must meet floodplain management standards (780 CMR includes floodplain provisions; MA has a Floodplain Management Program).

**Common requirements:**
- Elevation above Base Flood Elevation (BFE)
- Flood venting in enclosed areas below BFE
- Flood-resistant materials
- Elevation certificate for insurance

**How to check:**
- FEMA Flood Map Service Center: https://msc.fema.gov/
- Municipal GIS
- City may publish local floodplain bylaw adding requirements beyond FEMA

## Specialized Opt-In Code Municipalities

**Rule:** Cities that have opted into the Specialized Energy Code (~60 MA municipalities as of 2026) require net-zero or near-net-zero performance — including electrification or renewable energy offset.

**Known Specialized Code adopters (verify per project; list grows):**
- Boston
- Cambridge
- Somerville
- Newton
- Brookline
- Many other metro Boston municipalities

**Contractor implications:**
- All-electric heating (heat pumps) or renewable offset required
- Higher envelope performance
- Typically HERS rating of 45-55 range
- Solar-ready provisions

**Verify:** https://www.mass.gov/info-details/specialized-stretch-code (check municipality adoption list)

## MBTA Communities (Not Directly Relevant)

MGL Ch 40A §3A (MBTA Communities Act) requires certain municipalities near transit to allow multi-family housing by-right. This is SEPARATE from ADU law. ADU analysis does not typically invoke §3A. Do not confuse the two.

## Short-Term Rental Restrictions

**Rule:** Cities may restrict or prohibit short-term rental (STR) of ADUs. This is explicit in the statute.

**Common local STR restrictions:**
- Minimum stay (e.g., 30 days minimum)
- Owner registration and licensing
- Prohibition of STR in residential zones
- Limits on number of STR days per year

**What this does NOT allow:**
- Cities cannot restrict LONG-TERM rental of an ADU
- Cities cannot confuse STR restrictions with owner-occupancy requirements

**Contractor implications:**
- If the contractor's client plans STR, verify local STR rules
- If long-term rental only, STR restrictions don't apply to this ADU

## Condo / HOA Restrictions

**Rule:** Private condo association rules or HOA covenants may prohibit ADUs on individual lots. This is private contractual restriction, not public zoning.

**State law does NOT preempt private contracts.** The by-right provision applies to ZONING, not private restrictions.

**Contractor implications:**
- Check condo docs or HOA covenants before designing
- Nothing the building department can do about private restrictions
- Private waiver or amendment needed

## Family Day Care / Group Home Special Cases

If the ADU will be used for family day care or as a group home, additional rules apply (separate statutes). Out of scope for this skill.

## Lot Eligibility Edge Cases

- **Duplex (2-family) already present, owner wants to add ADU:** Generally NOT protected use under Ch 150 because the lot is not in a single-family zone or doesn't have a single principal dwelling. Check local zoning.
- **Lot straddles multiple districts:** ADU rules of each district apply to the relevant portion.
- **Non-conforming lot (doesn't meet current min lot size):** ADU may still be allowed if primary dwelling is legally non-conforming. Check local bylaw.

## Output Format

When running this decision tree, return:

```json
{
  "transit_exemption_applies": true | false,
  "nearest_transit": {
    "type": "commuter_rail" | "subway" | "ferry" | "bus_station",
    "distance_miles": 0.3
  },
  "historic_district": null | {
    "district_name": "...",
    "commission_url": "..."
  },
  "wetlands_within_100ft": true | false,
  "floodplain_zone": null | "AE" | "X" | ...,
  "specialized_code_adopted": true | false,
  "notes": [
    "STR prohibited in this municipality",
    "HOA restrictions apply — contractor must verify separately"
  ]
}
```

## Common Pitfalls

- Don't measure transit distance as straight-line — use walking distance
- Don't assume Specialized Code applies state-wide — it's opt-in
- Don't treat HDC review as a zoning denial — it's a separate track
- Don't forget wetlands on waterfront or lowland lots
- Don't confuse MBTA Communities Act with ADU law
