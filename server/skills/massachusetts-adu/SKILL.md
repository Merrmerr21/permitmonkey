---
name: massachusetts-adu
description: Massachusetts accessory dwelling unit law, regulations, and engineering-level reference. Covers MGL Ch 40A §§1A and 3 as amended by St. 2024, c. 150, §§7-8 (Affordable Homes Act), 760 CMR 71.00 (EOHLC Protected Use ADU regulation), MA State Building Code (780 CMR) provisions that hit ADUs, Stretch Energy Code, accessibility (521 CMR), and fire prevention (527 CMR). Use for any correction item that invokes state law, EOHLC guidance, statewide preemption, or baseline building code applied to ADUs. Pair with ma-city-research skill for local bylaw questions.
---

# Massachusetts ADU Skill

## When To Use

- Any correction item that cites MGL, CMR, EOHLC, or references "state law"
- Determining whether a city's correction is preempted by state law
- Answering dimensional/parking/occupancy questions at the state floor
- Explaining the Ch 150 / 760 CMR 71 framework to a contractor
- Cross-checking a city bylaw against state preemption

## When NOT To Use

- City-specific dimensional bylaws (use `ma-city-research`)
- Historic district, wetlands, or overlay district rules (use `ma-city-research`)
- Non-ADU zoning questions
- California ADU questions (use `_legacy/skills/` — but don't apply CA rules in MA responses)

## Decision Tree Entry Point

Start here for any eligibility or compliance question:

1. **Is this a by-right eligibility question?** → `decision-tree/by-right-eligibility.md`
2. **What construction type is this (detached / attached / conversion)?** → `decision-tree/construction-type.md`
3. **Are there special modifiers (transit proximity, historic, wetlands)?** → `decision-tree/modifiers.md`

## Quick-Reference Thresholds

For fast answers without loading full references, see `references/thresholds-quick-ref.md`.

## Citation Discipline (NON-NEGOTIABLE)

- Every material claim cites a statute, regulation, or EOHLC document with a verifiable URL
- Statute citations use format: "MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8"
- Regulation citations use format: "760 CMR 71.XX" (where XX is the section)
- Building code citations use format: "780 CMR Chapter/Section.X (10th Edition)"
- If you cannot verify a citation against a canonical source (malegislature.gov, mass.gov, municipal code platforms), DO NOT USE IT. Return `{"verified": false}` and let the orchestrator decide.

## Reference Files

- `references/chapter-150-of-2024.md` — Affordable Homes Act statutory text and engineering annotations
- `references/mgl-40a-section-3.md` — Full current §3 text with the §8 amendment integrated
- `references/760-cmr-71-protected-use-adu.md` — EOHLC regulation detail
- `references/780-cmr-essentials.md` — MA State Building Code sections relevant to ADUs
- `references/eohlc-guidance.md` — Official guidance documents roster
- `references/dimensional-summary.md` — State floor vs. local ceiling reasoning
- `references/thresholds-quick-ref.md` — Numbers-only quick card
- `references/conflicts-and-preemption.md` — When state overrides local
- `references/stretch-energy-code-225-cmr-22.md` — Base / Stretch / Specialized Opt-In tiers, envelope targets, three compliance pathways
- `references/fire-prevention-527-cmr.md` — 527 CMR 1 + 12 (electrical) and MGL Ch 148 §§26F/26F½ smoke / CO alarms
- `references/accessibility-521-cmr.md` — MAAB scoping for single-family ADUs, 30%-of-FCV work-cost threshold, variance procedure
- `references/plumbing-248-cmr.md` — 248 CMR 10 plumbing + 248 CMR 4-7 gas fitting, four-permit ADU workflow, HPWH coordination

## Output Contract

When this skill is invoked, always return structured JSON for downstream agents (ResponseWriter consumes this). Never return prose when a lookup is expected.

```json
{
  "lookups": [
    {
      "question": "<what was asked>",
      "citations": [
        {
          "authority": "<MGL / CMR / EOHLC doc>",
          "section": "<exact section>",
          "source_url": "<canonical URL>",
          "excerpt": "<exact quote or paraphrase labeled as such>",
          "verified": true,
          "verification_date": "YYYY-MM-DD"
        }
      ],
      "summary": "<one sentence>",
      "flags": []
    }
  ]
}
```

## Source Maintenance

The skill's reference files must be re-verified against canonical sources on a quarterly basis. Citation URLs that 404 or redirect are flagged by the QA routine. When EOHLC publishes new guidance or 760 CMR 71 is amended, update this skill within 7 days.

## Known Limitations

- The skill does NOT currently cover MBTA Communities Act (MGL Ch 40A §3A) — that's a separate zoning requirement for multi-family housing near transit and is out of scope for single ADU analysis.
- The skill does NOT currently cover Chapter 40B comprehensive permits.
- The skill covers the statewide floor set by state law; dimensional requirements (setbacks, height, lot coverage, etc.) live in the `ma-city-research` skill.
