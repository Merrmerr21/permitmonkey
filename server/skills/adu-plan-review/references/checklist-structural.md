---
title: "Structural — Plan Review Checklist (Massachusetts ADU)"
category: plan-review
sheet_type: structural
jurisdiction: Massachusetts
relevance: "Load when reviewing foundation plans, framing plans, and structural details (typically S-series sheets). Defines required elements for foundation type, framing layout, lateral resistance, snow load, structural notes, and PE stamp; high reviewer-blank rate (most structural items require human engineer review)."
---

# Structural Checklist — Massachusetts ADU

This file defines what must appear on the structural sheets and the code basis for each. Structural review is the area with the highest rate of `[REVIEWER:]` blanks — most engineering-adequacy questions require a licensed structural engineer to verify, not the AI to assess.

## Scope

Applies to S-series sheets (S1, S2, etc.) for foundations, framing, and structural details. Most ADU structural designs use prescriptive framing per IRC Chapter 6 with specific structural details for non-prescriptive elements. [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill 780 CMR structural reference]

## Required Elements

### 1. Structural Engineer's Stamp

**Must include:**
- Massachusetts-licensed Professional Engineer's stamp (Structural or Civil)
- Signature and date
- License number

**Code basis:**
- MGL Ch 112 §81D — engineer licensure and stamp [source: https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXVI/Chapter112/Section81D | retrieved: 2026-05-04 | citation: MGL Ch 112 §81D]
- 780 CMR 107.1 — design professional required for projects beyond homeowner-prepared scope

**When IS a PE required for an ADU?**
- New construction with non-prescriptive elements (e.g., engineered beams, retaining walls, irregular foundations) — yes
- Substantial additions or alterations to existing primary affecting load paths — yes
- Simple prescriptive ADU using IRC R602 conventional framing — sometimes architect stamp is acceptable; verify with city
- Conversion ADU without structural changes — generally architect stamp sufficient

**Visual identification:** Stamp on each structural sheet.

**Common deficiencies:**
- Architect stamp where structural engineer required
- Out-of-state PE without Massachusetts reciprocity
- Stamp on structural drawings but no structural calculations referenced

**Confidence:** HIGH for stamp presence; MEDIUM for whether stamp type matches scope.

### 2. Foundation Plan

**Must include:**
- Foundation type (slab-on-grade, crawlspace, basement, frost-protected shallow foundation)
- Footing dimensions and depth (note: MA frost depth typically 48 in)
- Foundation wall thickness and reinforcement
- Anchor bolt size and spacing
- Drainage and waterproofing notes for below-grade walls

**Code basis:**
- IRC Chapter 4 (as adopted by 780 CMR) — foundations [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC Ch 4 foundation reference]
- IRC R403.1.4.1 — frost depth (48 in for MA)
- IRC R403.1.6 — anchor bolts (typically 1/2" diameter, max 6 ft o.c.)

**Visual identification:** Plan view of foundation with dimensions; section details.

**Common deficiencies:**
- Footing depth less than 48 in below grade
- Anchor bolt spacing greater than 6 ft (or missing entirely)
- Foundation wall reinforcement not called out
- Below-grade waterproofing omitted (especially for habitable basement ADUs)

**Confidence:** HIGH for presence of foundation plan; MEDIUM for dimensional compliance; LOW for reinforcement adequacy (`[REVIEWER: confirm reinforcement adequate per loads]`).

### 3. Framing Plan(s)

**Must include:**
- Floor framing plan with joist size, spacing, and span
- Roof framing plan with rafter or truss layout
- Beam, header, and lintel sizes
- Bearing wall locations

**Code basis:**
- IRC Chapter 6 (as adopted by 780 CMR) — wall and floor construction [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC Ch 6 framing reference]
- IRC Chapter 8 — roof framing
- IRC Tables R602, R802 — prescriptive framing tables

**Visual identification:** Plan view with structural members shown as lines; size/spacing callouts.

**Common deficiencies:**
- Joist spans exceed prescriptive table limits without engineering analysis
- Headers undersized for span and tributary load
- Bearing wall locations not coordinated with foundation
- Engineered beams (LVL, glulam) without manufacturer specification

**Confidence:** MEDIUM for prescriptive sizing; LOW for non-prescriptive engineered elements (`[REVIEWER: verify engineered beam/header sizing]`).

### 4. Snow Load and Wind Design

**Must include:**
- Ground snow load (typically 50-60 psf in MA, varies by location)
- Wind design (basic wind speed, exposure category)
- Reference to applicable design code (typically IRC for prescriptive, ASCE 7 for engineered)

**Code basis:**
- IRC R301.2 — design loads [source: c:\dev\permitmonkey\server\skills\massachusetts-adu\references\780-cmr-essentials.md | retrieved: 2026-05-04 | citation: state skill IRC R301 design loads]
- ASCE 7 — referenced standard for wind and seismic
- 780 CMR Chapter 16 (for engineered design)

**Visual identification:** Design notes block on structural sheets.

**Common deficiencies:**
- Design loads not stated
- Snow load below regional minimum (most of MA: 50 psf ground snow load minimum)
- Wind design assumes Exposure B in actually-Exposure C site

**Confidence:** HIGH for design load callouts present; MEDIUM for correctness (varies by site).

### 5. Lateral Force Resistance

**Must include:**
- Shear wall or braced wall lines per IRC R602.10 (prescriptive) or engineered analysis
- Hold-down hardware locations (typically corners of shear walls)
- Diaphragm continuity (floor and roof sheathing nailing schedules)

**Code basis:**
- IRC R602.10 — prescriptive bracing (most common for ADUs)
- IRC R301.2 — wind and seismic design loads
- ASCE 7 (engineered analysis where prescriptive doesn't apply)

**Visual identification:** Plan callouts showing braced wall lines; hold-down details.

**Common deficiencies:**
- Insufficient bracing length per IRC R602.10 tables
- Hold-down hardware missing at shear wall ends
- Existing primary's bracing not analyzed when ADU is added (load path changes)

**Confidence:** MEDIUM for prescriptive compliance; LOW for engineered analysis (`[REVIEWER: verify lateral system meets ASCE 7]`).

### 6. Connections and Hardware

**Must include:**
- Joist hangers, post bases, post caps (manufacturer + model)
- Strap and tie hardware for tension connections
- Fasteners (size, type, spacing)

**Code basis:**
- IRC Chapter 6 — fastening schedules
- Manufacturer specifications (Simpson, USP, etc.)

**Visual identification:** Hardware schedule on structural sheets; section details showing connections.

**Common deficiencies:**
- Hardware called out without model number (reviewer can't verify capacity)
- Substitutions allowed without engineer approval
- Fastener pattern doesn't match table or detail

**Confidence:** HIGH for callout presence; MEDIUM for correctness.

### 7. Structural Notes

**Must include:**
- Concrete strength (typically 3,000 psi for footings; 4,000 psi for slab if exposed to freeze-thaw)
- Reinforcement grade (typically Grade 60 rebar)
- Lumber species and grade (typically Douglas Fir-Larch No. 2 for framing)
- Engineered wood manufacturer specifications (LVL, PSL, glulam)
- Wood preservative treatment for ground-contact and exposed members

**Code basis:**
- 780 CMR Chapter 19 (concrete), Chapter 23 (wood)
- IRC Chapters 4, 6, 8

**Visual identification:** Structural notes block on S1 typically.

**Common deficiencies:**
- Concrete strength not stated
- Rebar grade not stated
- Lumber species/grade not stated (defaults to lowest = SPF, may not be adequate)

**Confidence:** HIGH for note presence.

### 8. Existing Conditions Assessment (Conversion ADUs)

**Must include (for conversion ADUs):**
- Statement that existing structural elements were assessed
- Identification of existing load paths and any modifications
- New load analysis if existing structure is being augmented

**Code basis:**
- 780 CMR Chapter 34 (existing structures)
- IRC Appendix J (existing buildings)
- IEBC 2021 (referenced by 780 CMR)

**Visual identification:** Notes referencing existing-conditions analysis; plan markup showing new vs. existing.

**Common deficiencies:**
- "Existing to remain" without analysis of whether existing capacity is adequate for new ADU loads
- Floor joist spans assumed adequate for ADU live load when original design was for storage/attic

**Confidence:** LOW — most existing-condition assessment is `[REVIEWER:]` blank.

## Quick-Review Decision Tree

```
Is a Massachusetts-licensed PE stamp present (when scope requires it)?
├── NO → Deficient (if PE required) or homeowner-exemption verification needed.
└── YES → Continue.

Is the foundation plan dimensioned with footing depth ≥48 in?
├── NO → Deficient. Cite IRC R403.1.4.1.
└── YES → Continue.

Are floor and roof framing members called out with size and spacing?
├── NO → Deficient. Cite IRC Chapter 6 / 8.
└── YES → Continue.

Are design loads stated (snow ≥50 psf typical, wind speed, exposure)?
├── NO → Deficient. Cite IRC R301.2.
└── YES → Continue.

For non-prescriptive elements (engineered beams, irregular geometry):
Are they marked [REVIEWER:] for human engineer verification?
├── NO → Add reviewer blanks; do not assess engineering adequacy autonomously.
└── YES → Structural sheets pass to human engineer review.
```

## Reviewer Confidence Notes

- **HIGH confidence:** PE stamp presence, foundation plan presence, framing plan presence, structural notes presence.
- **MEDIUM confidence:** Prescriptive compliance with IRC tables, hardware callout completeness, design load reasonableness.
- **LOW confidence:** Engineered element adequacy, lateral system correctness, existing-condition load path analysis. **Most structural correctness questions require a licensed structural engineer reviewer — flag with `[REVIEWER:]`.**

## When to Escalate to Human Review

- Engineered beam / header sizing ("[REVIEWER: verify LVL size adequate for span and load]")
- Foundation reinforcement adequacy ("[REVIEWER: confirm reinforcement schedule adequate]")
- Lateral force resistance for non-prescriptive layouts
- Existing structure modifications affecting load paths
- Anything outside IRC prescriptive limits

The agent's job is to flag whether structural items are PRESENT and follow code formatting; human engineer reviewer assesses whether they're ADEQUATE.

## Source Verification

- IRC Chapters 4, 6, 8, R301.2, R403, R602: https://www.mass.gov/state-building-code [source: https://www.mass.gov/state-building-code | retrieved: 2026-04-22 | citation: 780 CMR portal]
- ASCE 7 (referenced by 780 CMR): https://www.asce.org/publications-and-news/asce-7

**Last verified:** 2026-05-04.
