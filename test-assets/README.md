# test-assets/

Real permit documents used for benchmark testing. Each fixture is a real permit submission with consent from the project designer/contractor.

## MA Fixtures (Active, Target State)

All active benchmarks live under `ma/`. Each fixture is a directory with:

```
ma/<fixture-name>/
  plans.pdf                    # architectural plan set
  plans-raw.pdf                # (optional) original without any processing
  corrections-letter.pdf       # the city corrections letter
  corrections-letter.md        # extracted text (optional, auto-generated)
  project-metadata.json        # { address, city, adu_type, primary_dwelling_sqft, consent_on_file }
  contractor-notes.txt         # contractor's own notes on the corrections
  expected-response.md         # ground-truth response — what a good package looks like
  expected-citations.json      # ground-truth citations — each with verified URL
  ANONYMIZATION.md             # what was redacted and why
  CONSENT.md                   # signed consent on file with date
```

## Current MA Fixture Scaffolding

```
ma/
├── corrections-01/   ← PLACEHOLDER — needs real MA corrections submission
├── approved-01/      ← PLACEHOLDER — needs real approved MA ADU plan set
└── eligibility-samples/  ← PLACEHOLDER — sample inputs for adu-eligibility-checker
```

## How to Source MA Fixtures

Per `PLAYBOOK.md` §22:

1. **MA-based ADU architects** — Google "Boston ADU architect" and cold-email. Many are eager for AI tools that reduce corrections cycles.
2. **Public records requests** — MA cities publish permitted ADU submissions as public record.
3. **Merritt's JLL network** — Capital markets analysts routinely meet architects and contractors.
4. **Reddit** — r/Boston, r/CambridgeMA, r/Massachusetts. Post offer to build free AI tool for contractors in exchange for plan share (anonymized, with consent).

## Anonymization Rules

Before any asset enters `test-assets/ma/`:

- **Redact** owner names, exact addresses (keep city + zip)
- **Redact** contractor license numbers
- **Keep** all architectural and engineering content (sheet indexes, dimensional data, details)
- **Keep** all code citations
- **Obtain** written consent form from project designer (commit to `CONSENT.md` alongside the fixture)

## Benchmark Standard

Each fixture feeds the automated test suite. Target: **90%+ of corrections items receive a technically correct response with valid citations** when run through the full Flow 1 pipeline.

Benchmark run cadence:
- Before every merge to `main`
- After every Anthropic model release
- Monthly full benchmark per roadmap

## Legacy California Fixtures

Pre-pivot California fixtures (Placentia, Long Beach, Buena Park) are retained at `../_legacy/test-assets/` for regression testing. They should NOT be used for MA benchmarks, but they can verify architecture hasn't broken during the pivot:

```
_legacy/test-assets/
├── corrections/          # Placentia 2nd-review corrections letter
├── approved/             # Long Beach (326 Flint Ave) approved plans
├── correction-01/        # Sample agent output from hackathon
├── adu-handbook-update-2026.pdf   # California HCD Handbook (retired)
├── Placentia-Submittal Requirements...  # retired
└── 1ST SUB REDLINED SET_v1.pdf          # retired
```

## Critical Path

Sourcing 5+ MA fixtures is on the **critical path for MA production launch**. See `docs/roadmap.md` Phase 0. No MA deploy until 5+ fixtures are in place and passing benchmark.
