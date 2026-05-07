---
title: Massachusetts ADU Electrical Under 527 CMR 12 — Service Sizing, Sub-Panels, AFCI/GFCI, and the All-Electric Reality of Specialized Code
description: A working reference on Massachusetts electrical code for ADU permits. The NEC 2023 base with MA amendments under 527 CMR 12, when an ADU needs separate service vs sub-panel, AFCI and GFCI requirements, the all-electric load implications of Specialized Opt-In Code, and the most common electrical corrections plan checkers issue.
slug: ma-adu-electrical-527-cmr-12
published: 2026-05-07
last_updated: 2026-05-07
category: building-code
city_focus: statewide
---

# Massachusetts ADU Electrical Under 527 CMR 12

The Massachusetts electrical code is **527 CMR 12**, which adopts the National Electrical Code (currently NEC 2023) with Massachusetts-specific amendments. Like plumbing under 248 CMR, electrical work runs on a separate permit and inspection track from the building permit. This guide walks through what 527 CMR 12 requires for ADU work, when an ADU needs a separate electrical service versus a sub-panel from the primary, the AFCI/GFCI requirements that catch many homeowners off guard, and how the Specialized Opt-In Code's all-electric requirement changes the load math.

## The regulation and its authority

[source: https://www.mass.gov/regulations/527-CMR-12-massachusetts-electrical-code | retrieved: 2026-05-07 | citation: 527 CMR 12 — MA Electrical Code (NEC 2023 plus MA amendments)]

[source: https://www.mass.gov/orgs/department-of-fire-services | retrieved: 2026-05-07 | citation: DFS / BFPR — authority over 527 CMR]

527 CMR 12 is administered by the Department of Fire Services through the Board of Fire Prevention Regulations. Local electrical inspectors enforce. A Massachusetts master electrician must hold a license and pull the electrical permit.

The MA amendments to NEC 2023 are not minor. Common areas where MA differs from base NEC: smoke alarm wiring requirements (intersect with MGL Ch 148 § 26F), CO alarm wiring (MGL Ch 148 § 26F½), tamper-resistant receptacle requirements, and certain commercial-vs-residential distinctions.

## Service entrance — separate vs sub-panel

The first major decision for an ADU electrical design: does the ADU get its own electrical service from the utility, or does it feed off a sub-panel from the primary's main panel?

**Sub-panel from the primary's main:**
- Cheaper. No new utility service drop. Existing main panel feeds a sub-panel in the ADU.
- Simpler permitting. Fewer utility coordinations.
- Limited by the primary's existing service capacity. If the primary is on 100A or 150A service and you add a heat pump and electric water heater for the ADU, you can quickly exceed capacity.
- Ownership and metering: the ADU's electricity is on the primary's meter. Separate billing requires a tenant-meter sub-arrangement.

**Separate service to the ADU:**
- More expensive. Requires utility service drop, new meter, separate panel.
- Cleaner ownership. Separate billing if the ADU is rented.
- Independent capacity. Typically 100A or 200A service sized for the ADU's load.
- Coordinates with the local utility (Eversource, National Grid, MA Municipal Electric, etc.).

Most ADU projects use a sub-panel approach unless the primary has insufficient capacity. The decision often comes down to a load calculation under NEC Article 220.

## Load calculation under NEC Article 220

For a typical 720 sqft all-electric ADU on Specialized Opt-In Code:

- **Lighting** (3 VA per square foot): 720 × 3 = 2,160 VA
- **Kitchen small appliance circuits** (2 × 1,500 VA): 3,000 VA
- **Laundry circuit**: 1,500 VA
- **Heat pump (typical 9,000-12,000 BTU minisplit)**: 1,200-2,000 VA
- **Heat-pump water heater**: 4,500 VA
- **Range or cooktop** (if all-electric): 8,000-12,000 VA (with NEC demand factors typically derated to ~6,400-9,600 VA)
- **Dishwasher**: 1,500 VA
- **Other appliance and plug load**: 5,000-10,000 VA

Total connected load: typically 25,000-40,000 VA. Demand factors per NEC Article 220 typically reduce this to a calculated demand of 15,000-22,000 VA, equivalent to approximately 60-90 amps at 240V.

A 100A sub-panel comfortably handles a typical all-electric ADU's calculated load. A 200A sub-panel provides headroom for future expansion or aggressive loads like EV charging.

For the primary's main service to support both the existing primary and the new ADU sub-panel: typical existing 200A service in covered cities supports both. Existing 150A service is borderline; 100A service usually requires upgrade to support an all-electric ADU.

## AFCI and GFCI — the requirements that catch homeowners off guard

NEC 2023 (adopted by 527 CMR 12) requires extensive AFCI and GFCI protection in residential dwellings. For an ADU:

**AFCI (Arc-Fault Circuit Interrupter) required on:**
- All 15A and 20A general-use receptacle circuits in living rooms, bedrooms, dining rooms, family rooms, hallways, closets
- All 15A and 20A lighting circuits in dwelling unit rooms
- Circuits supplying outlets in laundry areas

**GFCI (Ground-Fault Circuit Interrupter) required on:**
- All 15A and 20A receptacles in bathrooms
- All 15A and 20A receptacles in kitchens (countertop receptacles)
- All 15A and 20A receptacles in laundry areas, garages, basements, outdoors
- Receptacles within 6 feet of a sink (kitchen, bath, laundry, wet bar)
- Receptacles serving the dishwasher

Combination AFCI/GFCI breakers are common solutions — one breaker provides both protections. Plan accordingly in the panel.

The cost implication: AFCI/GFCI breakers cost $50-$120 each versus $5-$15 for a standard breaker. A typical ADU panel with 12-16 circuits, most requiring either AFCI or GFCI or both, runs $800-$2,000 in breakers alone.

## Smoke and CO alarm electrical wiring

Smoke alarms (per MGL Ch 148 § 26F) and CO alarms (per MGL Ch 148 § 26F½) require:

- Hardwired with battery backup for new construction
- Interconnected so one alarm triggers all
- 120V power supply from a non-switched circuit

[source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXX/Chapter148 | retrieved: 2026-05-07 | citation: MGL Ch 148 §§ 26F and 26F½ — alarm requirements at sale/transfer/permit]

The electrical permit covers the wiring. The building permit covers the placement. Coordinate both.

## Common ADU electrical corrections

Plan checkers under 527 CMR 12 commonly issue:

- **"Provide load calculation per NEC Article 220."** A formal load calc is required, especially for sub-panel arrangements.
- **"Verify primary service capacity supports ADU sub-panel."** If the primary is on 150A or smaller service, the calculation must show the combined demand fits within the existing service capacity.
- **"Show AFCI/GFCI protection on circuit schedule."** A circuit-by-circuit panel schedule must indicate which circuits have AFCI, GFCI, or combination protection.
- **"Specify smoke and CO alarm wiring."** Show the alarm circuit, the interconnection method, and the battery-backup specification.
- **"Identify grounding and bonding."** Service equipment grounding electrode connection, bonding of metallic systems (water pipe, gas pipe, structural steel), and equipment grounding throughout.

## EV charging — the future load

Many ADU projects pre-wire for an EV charger even when the homeowner is not yet ready to install. NEC 2023 includes provisions for EV charging circuits (typically 240V, 30A or 50A).

Pre-wiring options:

- Empty conduit from the panel to the parking area, terminated with a junction box. Lowest cost; install the actual charger later.
- Roughed-in 240V circuit with a 14-50 outlet ready for a Level 2 charger. Mid cost.
- Fully installed Level 2 charger. Highest cost; ready for use day one.

For a single EV charger at 30A, the load is significant — about 7,200 VA. Account for it in the panel's load calculation if the homeowner plans to install one.

## What good ADU electrical plans include

- Load calculation per NEC Article 220 with all major loads listed
- Service sizing decision (separate service vs sub-panel) with rationale
- One-line diagram showing the panel feed, sub-panel, and major branches
- Panel schedule with circuit-by-circuit details: amperage, AFCI/GFCI status, room/load served
- Smoke and CO alarm wiring detail
- Grounding electrode and bonding plan
- EV charging provision if applicable
- Master electrician's stamp and signature

## What this guide does not cover

- **Solar PV** — separate scope under 527 CMR 12 with additional NEC Article 690 requirements. Engage a PV-specific electrician.
- **Battery storage** — also separate scope, increasingly common in Specialized Code projects but distinct from the base ADU electrical plan.
- **Ground-mount EV charging** — for detached ADUs with a separate driveway, the EV charging logic differs from attached scenarios.

## Run the eligibility check first

Before drafting plans, [run the PermitMonkey eligibility check](/eligibility) for your specific MA parcel. The check's `city_gotchas` for Specialized Opt-In Code cities (Boston, Cambridge, Somerville, Newton, Brookline) flags the all-electric implication for the load calculation up front, before service-sizing decisions are baked into the design.
