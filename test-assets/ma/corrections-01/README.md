# ma/corrections-01/ — PLACEHOLDER

This directory is reserved for the first Massachusetts corrections-fixture submission. Target contents once populated:

- `plans.pdf` — anonymized architectural plan set (typically 15-25 sheets)
- `corrections-letter.pdf` — the city corrections letter (typically 2-5 pages)
- `corrections-letter.md` — extracted text
- `project-metadata.json` — structured metadata:

  ```json
  {
    "address_redacted": "XXX Elm St",
    "city": "Cambridge",
    "zip": "02138",
    "adu_type": "detached",
    "primary_dwelling_sqft": 1850,
    "proposed_adu_sqft": 780,
    "zoning_district": "Residence A-2",
    "review_cycle": 2,
    "consent_on_file": true,
    "anonymized_by": "Merritt Cassell",
    "anonymization_date": "YYYY-MM-DD"
  }
  ```
- `contractor-notes.txt` — contractor's assessment of the corrections
- `expected-response.md` — ground-truth professional response letter
- `expected-citations.json` — ground-truth citations with verified URLs:

  ```json
  [
    {
      "correction_id": "C-01",
      "authority": "MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8",
      "source_url": "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3",
      "relevance": "owner-occupancy preemption"
    }
  ]
  ```
- `ANONYMIZATION.md` — list of what was redacted and how
- `CONSENT.md` — signed consent form on file, with date and contact

## Status

Empty placeholder. Populate with first sourced MA fixture per `test-assets/README.md` sourcing paths.

## Do Not

- Run agent benchmarks against this directory until it contains a full fixture
- Commit plans or corrections letters without anonymization + consent
- Use the California legacy fixtures (at `_legacy/test-assets/`) for MA benchmark validation
