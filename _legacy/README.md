# _legacy/

Retired California-focused skills and development artifacts from CrossBeam v1 (the hackathon-winning iteration, Feb 2026).

Kept here, not deleted, because:

1. **Regression testing** — The Placentia / Long Beach test fixtures (in `../test-assets/corrections/` and `../test-assets/approved/`) still work against the retired skills. Useful for verifying architecture hasn't broken during the MA pivot.
2. **Historical context** — Decisions in `../progress.md` and `../docs/` reference CA terms, HCD Handbook sections, Gov Code §§66310-66342. Keeping the skills findable preserves that trail.
3. **Rebuild reference** — The MA skill structure mirrors the CA skill structure. Having the CA version on-disk makes the MA build faster.

## Contents

- `skills/adu-city-research/` — original CA city research skill (WebSearch + WebFetch + Chrome DevTools three-mode pattern). MA version lives at `../.claude/skills/ma-city-research/`.
- `skills/adu-corrections-interpreter/` — original CA corrections workflow skill. MA version lives at `../.claude/skills/ma-corrections-interpreter/` (to be built).
- `adu-skill-development/` — raw HCD Handbook extractions, prompts, task JSON. The MA equivalent (760 CMR 71.00, EOHLC guidance, MGL Ch 40A as amended) lives at `../.claude/skills/massachusetts-adu/`.

## Do Not

- Reference `_legacy/` skills from production agent configs
- Import from `_legacy/` in frontend or server code
- Update `_legacy/` content — it's frozen. If a pattern is worth keeping, port it to an active skill.

## Pivot Context

Retired 2026-04-22 as part of the California → Massachusetts pivot driven by Chapter 150 of the Acts of 2024 (Affordable Homes Act), which created statewide by-right ADUs effective February 2, 2025. See `../PLAYBOOK.md` for full pivot rationale and `../.claude/CLAUDE.md` for active-project rules.
