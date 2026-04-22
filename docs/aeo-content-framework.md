# PermitMonkey — AEO Content Framework (MA ADU)

> **Purpose:** Answer Engine Optimization content plan. Be the source Claude / Perplexity / ChatGPT cites when users ask MA ADU questions.
> **Authority:** `PLAYBOOK.md` §30. AEO is the new SEO. First-mover on MA ADU queries wins for years.
> **Status:** Framework only. Content authoring is scheduled for the 0–90 day roadmap.

---

## Why AEO for PermitMonkey

Traditional SEO: get to Google page one. Long posts. Backlink building. Keyword density.

AEO: structured, direct answers. FAQ format. Schema markup. Comparison tables the AI can parse and cite. Zero-click searches are growing; AI assistants route users to your product when they cite you.

MA ADU queries as of April 2026 have:
- Low content saturation (the law is 14 months old)
- High intent (contractor / homeowner actively making decisions)
- High commercial value (each query is a potential $500 corrections job)

Target: **become the primary source for ≥5 definitive queries within 90 days of publishing.**

## Content Production Standards

Every answer follows this structure:

```markdown
## [Direct question as H2]

**Short answer (1-2 sentences):** [Definitive, cite-ready answer]

**The full answer:**
[3-5 paragraphs with specific citations]

**Citations:**
- [MGL Ch 40A § 3 as amended by St. 2024, c. 150, § 8](URL)
- [760 CMR 71.00](URL)
- [EOHLC guidance doc](URL)

**Related questions:**
- Link to other answers in this set
- Link back to homepage / tool
```

Every answer is schema-marked with:
- `FAQPage` schema
- `Answer` schema
- `LegalService` schema where applicable

## The Top 20 Questions (Priority Order)

Prioritized by inferred search volume (from Google Keyword Planner data on "Massachusetts ADU" variants) and conversion intent.

### Tier 1 — Bedrock Questions (Write First)

1. **Can I build an ADU in Massachusetts?**
   - Keyword: "can i build an adu in massachusetts"
   - Intent: homeowner, beginning research
   - Answer: Yes, by-right in single-family residential zones statewide as of February 2, 2025, per Chapter 150 of the Acts of 2024.

2. **How big can an ADU be in Massachusetts?**
   - Keyword: "massachusetts adu size limit"
   - Intent: sizing decision
   - Answer: 900 sq ft or 50% of primary dwelling's gross floor area, whichever is less. Cities can cap smaller, not larger, on a single by-right Protected Use ADU.

3. **Do I need owner occupancy for an ADU in Massachusetts?**
   - Keyword: "massachusetts adu owner occupancy"
   - Intent: investor / landlord
   - Answer: No. MGL Ch 40A § 3 explicitly prohibits owner-occupancy requirements.

4. **How many parking spaces do I need for an ADU in Massachusetts?**
   - Keyword: "massachusetts adu parking requirement"
   - Intent: design / site planning
   - Answer: Max 1 additional space. Zero if the ADU is within 0.5 miles of commuter rail, subway, ferry, or bus station.

5. **What is Chapter 150 of the Acts of 2024?**
   - Keyword: "chapter 150 acts of 2024 massachusetts adu"
   - Intent: legal research
   - Answer: The Affordable Homes Act, signed by Governor Healey August 6, 2024. Sections 7 and 8 amended MGL Ch 40A to allow ADUs by-right in single-family zones statewide, effective February 2, 2025.

### Tier 2 — City-Specific (Drive Programmatic SEO)

6. **How do I get an ADU permit in Boston?**
7. **What are the ADU setback requirements in Cambridge?**
8. **How long does ADU permit approval take in Somerville?**
9. **Can I build an ADU in Newton, Massachusetts?**
10. **What are Brookline's ADU dimensional requirements?**

Each has a per-city landing page (`/eligibility/[city]`) that surfaces:
- Local dimensional standards (from `ma-city-research`)
- Top 3 city-specific gotchas
- Embedded eligibility checker CTA

### Tier 3 — Advanced Operator Questions

11. **Can I rent an ADU short-term in Massachusetts?**
    - Answer: Depends on the city. State law explicitly authorizes cities to restrict or ban STR use.

12. **Does the Massachusetts ADU law preempt local zoning?**
    - Answer: Partially. State law preempts USE (prohibition, special permits, owner-occupancy). Cities retain FORM authority (setbacks, height, bulk, design).

13. **What happens if my city's ADU bylaw conflicts with state law?**
    - Answer: The conflicting local provision is unenforceable. Response strategy: comply where possible, cite preemption where not.

14. **Is my ADU subject to the Massachusetts Specialized Energy Code?**
    - Answer: Depends on the municipality. ~60 MA cities have adopted Specialized Code (including Boston, Cambridge, Somerville, Newton, Brookline).

15. **Does 780 CMR apply to an ADU conversion?**
    - Answer: Yes. Conversions are subject to the Existing Building Code (780 CMR Ch 34 / IEBC 2021) with IRC applied to new work.

### Tier 4 — Edge Cases

16. **Can I build a second ADU on my lot in Massachusetts?**
    - Answer: Not by-right. Second and subsequent ADUs still require special permit.

17. **What's the difference between an ADU and a JADU in Massachusetts?**
    - Answer: Massachusetts doesn't use the JADU term (that's California). MA has one category: ADU. Size capped at 900 sq ft / 50% of primary.

18. **Can my HOA prevent me from building an ADU?**
    - Answer: Possibly. State law preempts public zoning, not private HOA / condo restrictions. Check your CC&Rs.

19. **Is an ADU in a historic district still by-right?**
    - Answer: The USE is by-right. Exterior modifications still require Historic District Commission approval under MGL Ch 40C.

20. **How much does an ADU permit cost in Massachusetts?**
    - Answer: Varies by city and construction value. Typical range: $1,500–3,500 for building permit, plus trade permits ($200–500 each).

## Publication Schedule

- **Weeks 1–2:** Write Tier 1 (5 answers). Highest-volume, highest-intent.
- **Weeks 3–4:** Write Tier 2 (5 answers) for 3 priority cities (Boston, Cambridge, Somerville).
- **Weeks 5–8:** Write Tier 3 (5 answers). Longer-tail operator questions.
- **Weeks 9–12:** Write Tier 4 (5 answers). Edge cases. Link back to Tier 1 anchors.

## Hosting & Structure

- `/faq/[slug]` — one page per answer
- `/faq/city/[city]` — per-city landing pages (Tier 2)
- `/faq` — master index with schema `FAQPage`
- Internal linking: every answer links to 2–3 related answers + the eligibility tool

## Monitoring

Per `PLAYBOOK.md` §30, monitor citations via:
- **Perplexity / ChatGPT / Claude** — manually test each question monthly
- **Otterly** or **Profound** — dedicated AEO citation tracking tools
- **Google Search Console** — track organic traffic from the FAQ pages

Target: **≥5 queries where PermitMonkey is cited as primary source within 90 days of the first 5 answers going live.**

## Voice / Anti-Slop

- No em dashes in the answers (AI tell)
- Human rewrite required — Opus drafts, Merritt edits, rewrite any AI tells before publishing
- Cite, don't assert
- Use short paragraphs, clean headings, bullet lists where they help scanability
- Include a "last verified" date on every answer; re-verify quarterly

## Link Architecture

Every answer page ends with:
1. A CTA to the free eligibility checker: "Check your lot in 10 seconds"
2. A CTA to the paid corrections service: "Already received corrections? Let PermitMonkey handle it"
3. An email capture for the "MA ADU Law 2026 Updates" newsletter

## Anti-Patterns

- Don't stuff keywords. Write for humans first, AI citations second.
- Don't write 3,000-word fluff articles. AI assistants prefer direct, structured answers.
- Don't duplicate content across pages. Each answer stands alone.
- Don't cite from memory. Verify every URL at publish time.

---

*Framework complete. Authoring starts in the 0–90 day roadmap block (`PLAYBOOK.md` §34).*
