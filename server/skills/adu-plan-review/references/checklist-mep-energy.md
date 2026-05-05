---
title: "MEP & Energy — Plan Review Checklist (Massachusetts ADU)"
category: plan-review
sheet_type: mep-energy
jurisdiction: Massachusetts
relevance: "Load when reviewing plumbing (P-series), mechanical (M-series), electrical (E-series), and energy compliance sheets. Defines required elements under 248 CMR (plumbing/gas), 527 CMR 12 (electrical), IRC mechanical, and 225 CMR 22 (Stretch Energy Code) or 225 CMR 22 Appendix RC (Specialized Opt-In Code)."
---

# MEP & Energy Checklist — Massachusetts ADU

This file defines what must appear on the mechanical, plumbing, electrical, and energy-compliance sheets. The Specialized Opt-In Code adopted by Boston, Cambridge, Somerville, Newton, Brookline, and ~55 other municipalities makes this domain the most code-dense of all sheet types. [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Specialized Opt-In Code adoption list]

## Scope

Applies to plumbing, mechanical, electrical, and energy compliance documentation. Each domain has its own MA regulatory authority:

- **Plumbing and gas**: 248 CMR (MA Plumbing and Fuel Gas Code)
- **Mechanical**: 780 CMR Chapter M / IRC M chapters
- **Electrical**: 527 CMR 12 (adopts NEC 2023 with MA amendments)
- **Energy**: 225 CMR 22 (Base Stretch Code) or 225 CMR 22 Appendix RC (Specialized Opt-In Code) per municipality

[source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill MEP authority references]

## Plumbing — Required Elements

### 1. Plumbing Plan and Riser Diagram

**Must include:**
- Floor plan with fixture locations (toilet, sink, shower/tub, kitchen sink, dishwasher)
- Drain, waste, and vent (DWV) riser diagram with pipe sizes
- Water supply riser diagram with pipe sizes
- Connection point to existing service or new service line

**Code basis:**
- 248 CMR (MA Plumbing Code) — DWV sizing, vent requirements, fixture spacing [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill 248 CMR plumbing reference]

**Visual identification:** Schematic riser; fixture symbols on floor plan.

**Common deficiencies:**
- DWV pipe sizing inadequate (e.g., 1-1/2" drain on bathroom sink + tub combined)
- Vent missing at fixture
- Trap arm length exceeds limit
- Cleanouts missing at directional changes

**Confidence:** MEDIUM — depends on completeness of riser diagram.

### 2. Hot Water Source

**Must include:**
- Water heater type (tank, tankless, heat pump water heater)
- Capacity / sizing per fixture demand
- Energy source (gas, electric, heat pump)
- Location and clearances

**Code basis:**
- 248 CMR — fuel gas water heaters
- 527 CMR 12 — electric water heaters
- 225 CMR 22 Appendix RC — Specialized Opt-In requires electric or renewable-offset [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Boston Specialized Opt-In water heater pathway]

**Visual identification:** Water heater symbol on plumbing or mechanical plan.

**Common deficiencies:**
- Gas water heater specified in Specialized Opt-In municipality's all-electric pathway project
- Sizing inadequate for fixture count
- Combustion air not provided for atmospheric-vent gas water heater

**Confidence:** HIGH for type/sizing presence; MEDIUM for energy-pathway compatibility.

## Mechanical — Required Elements

### 3. Heating, Cooling, and Ventilation Equipment

**Must include:**
- Equipment schedule with manufacturer, model, capacity (BTU/h or tons)
- Heating type (heat pump, gas furnace, electric resistance) — for Specialized Opt-In, heat pump strongly preferred or required
- Cooling type
- Ventilation strategy (exhaust-only, supply-only, balanced HRV/ERV)

**Code basis:**
- 780 CMR / IRC Chapter M — mechanical [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill mechanical reference]
- IRC M1505 — whole-house ventilation per ASHRAE 62.2
- 225 CMR 22 Appendix RC — Specialized Opt-In Code electrification requirements

**Visual identification:** Equipment schedule block; HVAC layout on mechanical plan.

**Common deficiencies:**
- Manual J load calculation not provided (heat pump must be sized to actual load, not rule-of-thumb)
- Gas furnace specified in Specialized Opt-In municipality without renewable offset
- HRV/ERV not specified in tight-envelope project
- Bath fan only without whole-house ventilation strategy

**Confidence:** MEDIUM — depends on calc completeness.

### 4. Ductwork and Distribution

**Must include:**
- Supply and return duct layout
- Duct sizing
- Conditioned-space duct location preferred (especially for Specialized Opt-In)
- Insulation R-value for ducts in unconditioned space

**Code basis:**
- IRC Chapter M / IECC 2021 — duct insulation in unconditioned spaces (R-8 typical)
- 225 CMR 22 — Stretch Code may push for conditioned-space ductwork

**Visual identification:** Duct lines on mechanical plan; insulation callouts.

**Common deficiencies:**
- Ducts in unconditioned attic without R-8 insulation
- Returns missing from rooms (creating pressure imbalance)
- Duct sizing inadequate for design airflow

**Confidence:** MEDIUM.

### 5. Combustion Air and Venting

**Must include (for combustion appliances):**
- Combustion air source (sealed combustion preferred)
- Vent termination location
- Clearances to openings, property lines, ground

**Code basis:**
- 248 CMR (fuel gas)
- IRC Chapter M

**Visual identification:** Vent termination noted on elevations or mechanical plan.

**Common deficiencies:**
- Atmospheric-vent equipment in tight-envelope dwelling (creates depressurization risk)
- Vent termination too close to operable window or door

**Confidence:** HIGH for callout presence.

## Electrical — Required Elements

### 6. Electrical Service and Distribution

**Must include:**
- Service amp rating (existing and proposed)
- Sub-panel for ADU (typically 60A or 100A) with location
- Load calculation for ADU
- Service entrance location

**Code basis:**
- 527 CMR 12 (adopts NEC 2023 with MA amendments) [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill 527 CMR 12 electrical reference]
- NEC Article 220 — load calculations
- NEC Article 230 — service equipment

**Visual identification:** Single-line diagram or panel schedule; load calc table.

**Common deficiencies:**
- Sub-panel undersized for ADU load
- Existing service overstressed by adding ADU without service upgrade
- Load calculation not provided
- For Specialized Opt-In: panel capacity insufficient for future solar PV interconnection

**Confidence:** HIGH for service rating presence; MEDIUM for load calc adequacy.

### 7. Branch Circuits and Receptacles

**Must include:**
- Receptacle locations per NEC Article 210 (every wall section, kitchen counter, bathroom, exterior)
- AFCI / GFCI protection per NEC 210.12 / 210.8
- Lighting layout
- Smoke and CO alarm circuit (typically dedicated)

**Code basis:**
- NEC Article 210 — branch circuits [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill NEC reference]
- AFCI required on all 15A and 20A residential branch circuits per NEC 210.12
- GFCI required on bathroom, kitchen counter, exterior, garage receptacles

**Visual identification:** Electrical plan with receptacle and switch symbols.

**Common deficiencies:**
- Bathroom receptacle without GFCI
- Bedroom receptacle without AFCI
- Exterior receptacle without weather-resistant rating
- Kitchen counter receptacle spacing exceeds 4 ft

**Confidence:** HIGH for symbol presence; MEDIUM for AFCI/GFCI annotation.

### 8. Equipment Disconnects and Specialty Items

**Must include:**
- HVAC disconnect at unit
- Water heater disconnect (electric)
- EV charger circuit (if applicable; required by some municipalities)
- Solar PV interconnection (if installed at construction)

**Code basis:**
- NEC Article 440 (HVAC), 422 (appliances), 690 (PV systems)
- Specialized Opt-In municipalities: solar-ready conduit and panel capacity [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Boston solar-ready provisions]

**Visual identification:** Disconnect symbols at equipment.

**Common deficiencies:**
- Disconnect missing at HVAC unit
- EV charger circuit specified without dedicated branch
- Solar-ready conduit pathway omitted in Specialized Opt-In municipality

**Confidence:** HIGH.

## Energy Code — Required Elements

### 9. Energy Code Compliance Path

**Must include:**
- Statement of which energy code applies (Base Code / Stretch / Specialized Opt-In)
- Compliance pathway (prescriptive / performance / Passive House)
- HERS rating target if performance pathway
- For Specialized Opt-In: which compliance pathway (all-electric / mixed-fuel + solar PV offset / Passive House)

**Code basis:**
- 225 CMR 22 (Stretch) [source: https://www.mass.gov/info-details/specialized-stretch-code | retrieved: 2026-05-04 | citation: 225 CMR 22 Stretch Code]
- 225 CMR 22 Appendix RC (Specialized Opt-In)
- IRC Chapter 11 / IECC 2021 (Base)

**Visual identification:** Energy compliance block on cover sheet or dedicated energy sheet.

**Common deficiencies:**
- Wrong code claimed (e.g., Base Code in a Specialized Opt-In municipality)
- Compliance pathway not stated
- HERS rating missing for performance pathway

**Confidence:** HIGH once verifier knows the municipality's adoption status.

### 10. Envelope Compliance Documentation

**Must include:**
- Wall, roof, floor, slab R-values (matched to building section callouts)
- Window U-factor and SHGC
- Air leakage target (ACH50)
- For Specialized Opt-In: tested air leakage at 3.0 ACH50 max

**Code basis:**
- 225 CMR 22 / 225 CMR 22 Appendix RC envelope tables [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Boston energy envelope targets]

**Visual identification:** Envelope summary table on energy sheet or in section.

**Common deficiencies:**
- R-values inconsistent between section callouts and envelope summary
- U-factor at 0.30 in Specialized Opt-In municipality (must be 0.27)
- ACH50 target absent or at 5.0 (Base) when 3.0 is required

**Confidence:** HIGH for table presence; MEDIUM for value correctness.

### 11. Mechanical Sizing and Efficiency

**Must include:**
- Heating equipment sizing (Manual J load calc)
- Cooling equipment sizing
- Equipment efficiency ratings (HSPF, SEER, AFUE)
- For Specialized Opt-In: heat pump COP / HSPF meeting elevated threshold

**Code basis:**
- IRC Chapter 11 / IECC 2021 — mechanical efficiency
- 225 CMR 22 — Stretch / Specialized efficiency requirements

**Visual identification:** Equipment schedule with efficiency ratings.

**Common deficiencies:**
- Manual J calc missing
- Heat pump efficiency below Specialized threshold
- Oversized equipment (heat pumps lose efficiency when oversized)

**Confidence:** HIGH for schedule presence; MEDIUM for sizing methodology.

### 12. Solar PV (When Installed at Construction)

**Must include (if solar PV is installed):**
- PV array sizing and location
- Inverter and interconnection details
- Structural roof load adequacy (cross-reference to structural)
- Energy production estimate (for renewable-offset compliance)

**Code basis:**
- 527 CMR 12 / NEC Article 690 — PV systems
- 225 CMR 22 Appendix RC — Specialized Opt-In renewable offset pathway [source: c:\dev\permitmonkey\server\skills\boston-adu\references\energy-stretch-code.md | retrieved: 2026-05-04 | citation: Boston renewable-offset pathway]

**Visual identification:** PV layout on roof plan; inverter and meter details.

**Common deficiencies:**
- Solar PV claimed for renewable offset without production calculation
- Roof structural adequacy not verified for PV load
- Interconnection method inconsistent with utility requirements

**Confidence:** MEDIUM.

## Quick-Review Decision Tree

```
Plumbing: are DWV and water supply riser diagrams present?
├── NO → Deficient. Cite 248 CMR.
└── YES → Continue.

Mechanical: is the heating/cooling system sized via Manual J?
├── NO → Deficient. Request load calculation.
└── YES → Continue.

Electrical: is service amp rating and ADU sub-panel sizing documented?
├── NO → Deficient. Cite 527 CMR 12.
└── YES → Continue.

Energy: is the applicable code (Base / Stretch / Specialized) stated?
├── NO → Deficient. Cite 225 CMR 22 (or Appendix RC).
└── YES → Continue.

For Specialized Opt-In municipality:
Is the compliance pathway (all-electric / mixed-fuel + offset / Passive House) stated?
├── NO → Deficient. Cite 225 CMR 22 Appendix RC.
└── YES → Continue.

Are envelope R-values and air-leakage target consistent with applicable code?
├── NO → Deficient. Reconcile with code requirements.
└── YES → MEP & Energy sheets pass.
```

## Reviewer Confidence Notes

- **HIGH confidence:** Riser diagram presence, equipment schedule presence, panel schedule presence, energy compliance block presence, code citation correctness for the municipality.
- **MEDIUM confidence:** DWV pipe sizing, Manual J completeness, R-value consistency, AFCI/GFCI annotations.
- **LOW confidence:** Equipment selection adequacy for actual loads (`[REVIEWER: verify HVAC sizing against Manual J]`), structural adequacy for solar PV mounting (`[REVIEWER: cross-reference structural]`).

## When to Escalate to Human Review

- Heat pump sizing borderline (oversize / undersize impacts efficiency and comfort)
- Specialized Opt-In compliance via performance pathway (energy modeling output review)
- Solar PV structural adequacy for the roof
- Service upgrade necessity question (existing service may or may not be adequate)

## Source Verification

- 248 CMR Plumbing/Gas: https://www.mass.gov/info-details/regulations-of-the-board-of-state-examiners-of-plumbers-and-gas-fitters
- 527 CMR 12 Electrical: https://www.mass.gov/regulations/527-CMR-12-massachusetts-electrical-code-amendments
- 225 CMR 22 Stretch / Specialized: https://www.mass.gov/info-details/specialized-stretch-code [source: https://www.mass.gov/info-details/specialized-stretch-code | retrieved: 2026-05-04 | citation: 225 CMR 22 portal]
- IRC Chapter M / Chapter 11 via 780 CMR: https://www.mass.gov/state-building-code

**Last verified:** 2026-05-04.
