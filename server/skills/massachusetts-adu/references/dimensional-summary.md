# Dimensional Summary — State Floor vs. Local Ceiling

## The Core Pattern

Massachusetts ADU law establishes a **floor** for what cities must allow (the by-right use) and reserves a **ceiling** that cities can regulate (dimensional standards).

Think of it as a split:

| Axis | State (preemption) | Local (reserved) |
|------|--------------------|-------------------|
| CAN the ADU exist? | Yes, by-right | City cannot say no |
| WHO can use it? | No owner-occupancy req | City cannot require owner on site |
| WHAT SIZE is the max? | ≤900 sq ft / ≤50% primary | City can cap SMALLER |
| HOW many parking spaces? | ≤1 (0 near transit) | City can require FEWER |
| WHERE on lot? | — | City sets setbacks |
| HOW TALL? | — | City sets height limit |
| HOW MASSIVE? | — | City sets FAR/bulk |
| WHAT MATERIALS / DESIGN? | — | City can set design standards (must be reasonable) |
| STR allowed? | — | City can restrict/ban |

## State Floor — What Cities Must Allow

1. The ADU use itself, by-right, in single-family zones
2. Up to 900 sq ft or 50% of primary (whichever less)
3. No owner-occupancy requirement
4. No parking requirement beyond 1 space (0 near transit)
5. Rental of the ADU (except STR, which can be locally restricted)

## Local Ceiling — What Cities May Regulate

### Dimensional Setbacks

Cities set front, side, rear, and (if applicable) accessory structure setbacks. Typical MA single-family residential:
- Front: 20-30 ft
- Side: 10-15 ft
- Rear: 20-30 ft
- Accessory structure (often less strict): 5-10 ft

**Gotcha:** Some cities' accessory structure setbacks pre-Ch 150 were designed for sheds and garages, not ADUs. Cities may be updating these, but contractors encounter inconsistent interpretation. When a setback bylaw is so restrictive that no ADU is buildable on a typical lot, that may rise to "unreasonable restriction" under MGL Ch 40A §3.

### Height

Typical MA residential height limits for accessory structures: 15-25 ft. Cities vary widely.

**Gotcha:** ADUs on second floors above garages often push height limits. Some cities allow higher limits for ADUs specifically.

### Bulk / Floor Area Ratio (FAR) / Lot Coverage

Many MA cities cap lot coverage at 25-40% and have maximum FAR provisions. Adding a 900 sq ft ADU to a small lot can trigger coverage/FAR issues.

**Gotcha:** FAR calculations sometimes exclude below-grade basement ADUs. Check city bylaw. Conversion ADUs (basement finish, garage conversion) often don't change FAR at all.

### Site Plan Review

Cities may require site plan review. Key points:
- Site plan review is ADMINISTRATIVE (non-discretionary)
- Cannot be used to deny a by-right use
- Can impose reasonable conditions on layout, drainage, lighting, landscaping
- Timeline governed by city site plan ordinance, typically 30-60 days

### Design Standards

Reasonable design standards (materials, fenestration, rooflines, entry location) are allowed. "Reasonable" means relating to neighborhood character, not effectively preventing the use.

**Gotcha:** Design standards are the biggest gray area. A standard requiring "architecturally compatible materials with the primary dwelling" is probably reasonable. A standard requiring a specific builder's approval or aesthetic sign-off by a design board is not, because it's discretionary.

## Parking Specifics

The statute says zero parking required within "0.5 miles of a commuter rail station, subway station, ferry terminal or bus station."

Measurement method: typically walking distance, not straight-line. EOHLC guidance favors walking distance via existing pedestrian infrastructure.

**Practitioner note:** Google Maps / OpenStreetMap walking distance is the usual benchmark. If within 0.5 mi walking, the exemption applies.

## Historic Districts and Wetlands

These are NOT preempted by Ch 150. They operate under separate state laws (MGL Ch 40C for historic districts, MGL Ch 131 §40 for wetlands).

- In a local historic district, ADU exterior modifications require Historic District Commission approval.
- Within 100 ft of a wetland, Conservation Commission approval needed.
- These do NOT override by-right status for the ADU use, but they DO add review layers.

## How to Read a City Bylaw

For each city, check:
1. Dimensional standards in the single-family zoning district (front/side/rear setbacks, height, lot coverage, FAR)
2. Accessory structure provisions (may be less strict than primary)
3. ADU-specific provisions (if the city has updated its bylaw for Ch 150)
4. Site plan review triggers
5. Design standards
6. Historic district boundaries (if any)
7. Wetlands resource area regulations

The `ma-city-research` skill handles this research per-city.

## When to Invoke State Preemption in a Response

Only invoke preemption (i.e., "this city requirement is unenforceable") when:
- The requirement directly contradicts the state floor (e.g., owner-occupancy, parking >1 near transit, prohibition)
- There is no reasonable compliance alternative
- The contractor is willing to escalate if challenged

Prefer compliance with local rules when they are within the reserved dimensional/design authority. Save preemption arguments for clear cases. Escalation is costly for everyone.
