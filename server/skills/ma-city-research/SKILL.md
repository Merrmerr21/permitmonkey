---
name: ma-city-research
description: Three-mode research skill for Massachusetts municipal ADU rules. Covers local zoning bylaws, dimensional standards, design standards, historic district overlays, short-term rental restrictions, and submittal checklists for any MA city or town. Use for any correction item that cites a local bylaw, references a municipal code, or requires city-specific research. Pair with massachusetts-adu skill for state-level questions.
---

# Massachusetts City Research Skill

## When To Use

- Any correction item citing a local zoning bylaw or ordinance
- Dimensional compliance questions (setbacks, height, lot coverage, FAR)
- Design review questions
- City-specific submittal, fee, or timeline questions
- Historic district or wetlands overlay questions (city-specific jurisdictional info)

## When NOT To Use

- State law / regulation questions — use `massachusetts-adu`
- 780 CMR building code questions — use `massachusetts-adu` references
- Questions that generalize across multiple cities — use `massachusetts-adu` dimensional summary

## The Three Modes

### Mode 1 — Discovery (WebSearch)

When encountering a city for the first time in the session, discover the canonical URLs:
- Zoning ordinance / bylaw home page
- Building department home page
- ADU-specific guidance page (if published)
- Historic district commission (if applicable)
- Conservation commission (if applicable)

**Search queries:**
```
"{city} Massachusetts zoning ordinance accessory dwelling unit"
"{city} Massachusetts building department ADU"
"{city} MA {zone_district} dimensional requirements"
```

**Output:** URL manifest for the city.

### Mode 2 — Targeted Extraction (WebFetch)

With URLs in hand, extract specific provisions:
- Section(s) of the zoning bylaw addressing ADUs
- Dimensional bylaws for the relevant zoning district
- Design standards if any
- Submittal requirements
- Fee schedule
- Review timeline

**WebFetch pattern:**
```
url: <canonical zoning section URL>
prompt: "Extract the exact text of sections addressing accessory dwelling units, dimensional requirements (front/side/rear setbacks, height, lot coverage), design standards, and any submittal process for ADUs. Return verbatim where possible."
```

### Mode 3 — Chrome DevTools Fallback

For cities whose websites resist WebFetch (heavy JavaScript, dynamic rendering, or anti-bot measures — Boston is the biggest offender):

1. Launch Chrome via Chrome DevTools MCP
2. Navigate to the zoning page
3. Extract rendered content
4. Close browser

Use Mode 3 sparingly — it's expensive in tokens and time. Only fall back when Mode 2 fails twice.

## Reference Files (Cached Per-City Research)

Covered cities live in `references/` as markdown files. Each covered city has:
- Dimensional bylaws for single-family districts
- ADU-specific provisions (if published)
- Design standards
- Submittal checklist
- Fee structure
- Review timeline
- Historic district boundaries (if applicable)
- Known gotchas

Currently covered:
- `references/boston.md`
- `references/cambridge.md`
- `references/somerville.md`

Next in build queue (per PLAYBOOK.md §21):
- Newton
- Brookline
- Worcester
- Quincy
- Lowell

## Three-Tier Research Priority

When a correction item comes in citing a city:

**Tier 1 — Local Cache**
Check `references/{city}.md`. If city is covered, use cached data. Fast, cheap, reliable.

**Tier 2 — Discovery + Extraction**
If city is not covered, run Mode 1 (discovery) + Mode 2 (extraction). Write a new `references/{city}.md` for future runs.

**Tier 3 — Chrome Fallback**
If Mode 2 fails, run Mode 3. Update `references/{city}.md` with findings even if incomplete.

## State Preemption Cross-Check

ALWAYS cross-check local provisions against state preemption. The pattern:

1. Extract the local provision
2. Cross-reference against MGL Ch 40A §3 as amended (via `massachusetts-adu`)
3. If the local provision conflicts with state preemption, FLAG IT
4. Return both the local citation AND the preemption flag to ResponseWriter

## Output Contract

```json
{
  "city": "Cambridge",
  "last_verified": "2026-04-22",
  "lookups": [
    {
      "topic": "ADU dimensional setbacks in Residence B",
      "citations": [
        {
          "authority": "Cambridge Zoning Ordinance § 4.22",
          "source_url": "https://library.municode.com/ma/cambridge/...",
          "excerpt": "...",
          "verified": true
        }
      ],
      "conflict_with_state_law": null | { ... }
    }
  ]
}
```

## Rate Limiting and Respectful Scraping

- Max 1 request per city per 5 seconds during active research
- Cache results for 30 days (bylaws don't change daily)
- Honor robots.txt
- Identify as PermitMonkey user-agent where possible
- If site owner blocks: don't circumvent — email for permission

## Source Maintenance

- Verify each covered city's references quarterly against canonical sources
- When a city adopts new ADU bylaws (many will as they implement Ch 150), update within 14 days
- Flag stale references with a `stale: true` marker in YAML frontmatter of the reference file

## Platforms We Encounter

Most MA cities publish zoning bylaws via one of these platforms:
- **eCode360** (General Code) — e.g., Somerville, Brookline
- **Municode** (Civic Plus) — e.g., Cambridge, Newton
- **American Legal Publishing / CodeLibrary** — some smaller municipalities
- **City-hosted CMS / static PDF** — e.g., Boston (hostile), many small towns

WebFetch works well on eCode360 and Municode. Boston's site and static PDFs sometimes require Mode 3.

## Known Limitations

- This skill does NOT cover dimensional details for every MA municipality — only the covered cities. Uncovered cities fall to Tier 2/3 research.
- This skill does NOT handle wetlands mapping — that requires the Conservation Commission URL per city.
- This skill does NOT handle FEMA flood zones — see the `modifiers.md` decision tree in `massachusetts-adu`.
