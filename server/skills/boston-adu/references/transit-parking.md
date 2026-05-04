---
title: Boston Transit Proximity and ADU Parking Exemption
category: state-law-application
relevance: critical
key_code_sections: "MGL Ch 40A §3 as amended by St. 2024 c. 150 §8 (parking floor: 1 max, 0 within 0.5 mi of qualifying transit); 760 CMR 71.00 (EOHLC application of the parking floor)"
last_verified: 2026-05-03
---

# Boston Transit Proximity and ADU Parking

## Why This File Is The MA Differentiator

Massachusetts ADU corrections in the post-Ch. 150 era hinge on parking more than any other single issue, and Boston's MBTA density makes the parking exemption the dominant lever. A correctly-documented 0.5-mile-to-MBTA-station finding turns a 1-parking-space requirement into 0 — often the difference between a buildable lot and a non-buildable one.

This file establishes the deterministic spatial workflow for the agent. The roadmap calls for "deterministic infrastructure + LLM reasoning split (Kepler)": parking-distance-to-MBTA is a GeoJSON lookup, not a Claude guess. This file documents the rule and the data source; the GeoJSON pipeline lands as a Phase 2 deliverable.

## State-Law Floor on ADU Parking

The Affordable Homes Act amended MGL Ch 40A §3 to set a parking maximum for Protected Use ADUs:

- **Maximum 1 additional parking space** required by any city for an ADU on a single-family lot
- **Zero parking required when the lot is within 0.5 miles of a qualifying transit facility**

[source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §8 amending MGL Ch 40A §3 — see `massachusetts-adu` skill `chapter-150-of-2024.md` for full text]

The qualifying transit facilities are:

- Commuter rail station
- Subway station
- Ferry terminal
- Bus station

[source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §8 — quoted in `massachusetts-adu` skill `dimensional-summary.md`]

## Boston Coverage: Why Most Lots Qualify

Boston has unusually dense MBTA service for a U.S. city of its size. Subway service includes the Red, Orange, Green, Blue, and Mattapan lines.

[source: https://www.mbta.com/stops | retrieved: 2026-05-03 | citation: MBTA system stops listing organizes service by Red Line, Orange Line, Green Line, Blue Line, Mattapan Line]

Commuter rail terminates at South Station, North Station, and Back Bay Station, all within Boston. Ferry terminals operate at Long Wharf, Hull, and other Inner Harbor locations. Bus service operates citywide on numerous local and key bus routes; the Silver Line provides bus rapid transit (BRT).

The practical effect: **a substantial majority of Boston residential parcels are within 0.5 miles of at least one qualifying MBTA facility.** Treat the parking exemption as the default for Boston ADU work, not the exception. Verify per-parcel before citing.

## What Counts as a "Bus Station" — The Open Question

The statutory text says "bus station" but does not define the term. EOHLC has issued guidance on the parking exemption; the precise interpretation of "bus station" is a known practitioner question.

**Practitioner consensus (per existing project research, requires re-verification before contractor-facing citation):** "bus station" is generally interpreted to include MBTA Key Bus Routes and major bus terminals/transfer stations, not every individual bus stop sign. The conservative reading is that any stop with a bench, shelter, or printed schedule counts; the aggressive reading would include any signed stop.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\dimensional-summary.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: existing PermitMonkey state-skill notes on EOHLC walking-distance method]

**TBD — verification pending:** Direct quote from EOHLC FAQs / TA letters establishing the "bus station" definition. The Mass.gov ADU FAQs page (https://www.mass.gov/info-details/accessory-dwelling-unit-adu-faqs) returned a 403 to programmatic fetch on 2026-05-03; verify in a browser session before citing the EOHLC interpretation in a contractor response.

When a Boston correction turns on the "bus station" question, default to the conservative reading (Key Bus Route or major terminal) unless the EOHLC guidance can be cited directly.

## Measurement Method

Per existing EOHLC guidance (as captured in the state skill), the 0.5-mile distance is **walking distance via existing pedestrian infrastructure**, not straight-line.

[source: c:\dev\permitmonkey\.claude\skills\massachusetts-adu\references\dimensional-summary.md (last_verified 2026-04-22) | retrieved: 2026-05-03 | citation: "Measurement method: typically walking distance, not straight-line. EOHLC guidance favors walking distance via existing pedestrian infrastructure"]

Practical methods:

- **Google Maps walking directions** — most contractors use this; defensible as the de facto industry method
- **OpenStreetMap routing (OSRM, Valhalla)** — programmatic walking-distance computation
- **Straight-line ("as the crow flies")** — not the EOHLC-favored method; do not use without disclosure

In a contractor response, document the measurement: name the routing tool, the parcel address, the destination station, the calculated distance, and the date of measurement. If walking distance is borderline (0.45–0.55 mi), include a screenshot.

## MBTA Data Source

The canonical machine-readable source for MBTA stops and stations is the GTFS feed:

```
https://cdn.mbta.com/MBTA_GTFS.zip
```

[source: https://www.mbta.com/developers/gtfs | retrieved: 2026-05-03 | citation: MBTA developer documentation lists this URL as the canonical GTFS feed]

The GTFS bundle includes `stops.txt` (with lat/lon for every stop and station), `routes.txt`, and mode metadata. This is the data source for the deterministic GeoJSON pipeline planned in roadmap Phase 2.

**Open question for Phase 2 implementation:** GTFS `stops.txt` contains every individual bus stop, but the "bus station" exemption likely should not flag every flag-pole stop. The Phase 2 GeoJSON build will need a filter rule — probably joining `stops.txt` to a curated list of Key Bus Route terminals plus all subway, commuter rail, and ferry stations. Document the filter rule in the GeoJSON build script when it lands.

## Boston Practitioner Guidance

For a Boston ADU correction that asserts a parking requirement:

1. **Pull the parcel coordinates** from the assessor's database or the Boston Zoning Viewer.
2. **Compute walking distance** to the nearest qualifying MBTA facility (subway, commuter rail, ferry, qualifying bus station).
3. **If ≤ 0.5 mi, assert the 0-parking exemption** under MGL Ch 40A §3 (as amended by St. 2024 c. 150 §8); cite the routing tool and the date.
4. **If > 0.5 mi, the maximum the city may require is 1 space** — a correction demanding 2 or more spaces is preempted.
5. **If the question turns on a non-subway, non-commuter-rail, non-ferry MBTA stop, default to the conservative "Key Bus Route or major terminal" reading** of "bus station" until EOHLC guidance can be cited directly.

## Edge Cases and Boston-Specific Gotchas

- **Silver Line BRT:** Treated as bus service for fare purposes but operates with rapid-transit-like infrastructure (dedicated lanes, branded stations). The parking exemption likely applies to Silver Line stations under the conservative "major bus terminal" reading. Verify per project.
- **Commuter rail in Boston:** South Station, North Station, Back Bay, JFK/UMass, Forest Hills, Ruggles. All clearly qualify.
- **Ferry terminals:** Long Wharf, Hingham/Hull (not Boston proper), Charlestown Navy Yard. All qualify when within 0.5 mi.
- **Closed or seasonal stations:** A station temporarily closed for construction does not lose its statutory qualification — but verify the station is in the MBTA's published service before citing.
- **Multi-modal stations:** A subway-and-bus station like Forest Hills counts on both modes; either citation works.

## Workflow for the Agent (Pre-Phase-2, Manual)

Until the deterministic GeoJSON pipeline ships in Phase 2, the agent's transit-parking workflow is manual lookup with documentation:

1. Receive parcel address from the contractor or extract from the corrections letter.
2. Open Google Maps walking directions from the address to the nearest MBTA subway, commuter rail, ferry, or major bus terminal.
3. If ≤ 0.5 mi, the parking exemption applies; document the route, distance, and screenshot URL in the response.
4. If > 0.5 mi, the maximum allowable parking is 1 space; if the city demands more, invoke state preemption.
5. Cite MGL Ch 40A §3 (as amended by St. 2024 c. 150 §8) inline with the response.

## Workflow for the Agent (Post-Phase-2, Deterministic)

Once `agents-permitmonkey/src/lib/mbta-proximity.ts` ships per the roadmap Phase 2 deliverable, the workflow becomes:

1. Receive parcel address.
2. Geocode to lat/lon (Mapbox or Google Geocoding API).
3. Call `mbta-proximity.checkExemption({ lat, lon })` which returns `{ exempt: boolean, nearestStation: {...}, walkingMeters: number, timestamp: string }`.
4. Claude interprets the result and writes the response — does not compute the distance itself.

## Source Maintenance

- Re-pull the GTFS feed quarterly; MBTA stops change with service updates.
- Re-verify EOHLC guidance on "bus station" definition quarterly; treat any new TA letter as a high-priority skill update.
- Watch for legislative or regulatory changes to the 0.5-mile threshold or the qualifying-facility list.

**Last verified:** 2026-05-03. Next check: 2026-08-03.

## See Also

- `ordinance-adu-rules.md` — owner-occupancy and operational rules layer
- `zoning-residential.md` — Boston residential zoning framework and per-neighborhood implementation
- `massachusetts-adu` skill, `chapter-150-of-2024.md` — full statutory text of the parking floor
- `massachusetts-adu` skill, `dimensional-summary.md` — state floor vs. local ceiling pattern
- `massachusetts-adu` skill, `eohlc-guidance.md` — EOHLC TA letter roster (verify current contents)
