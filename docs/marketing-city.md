# PermitMonkey — City-Side Marketing (MA Edition)

> **Last updated:** 2026-04-22
> **Purpose:** Positioning and channel plan for the **city pre-screening flow** (Flow 3 in `PLAYBOOK.md` §15) — selling to MA municipal building departments.
> **Supersedes:** `_legacy/docs/marketing-city-ca.md` (CA city-side thesis, retained)
> **Status:** Flow 3 is on the roadmap, not built. This doc is the pre-build plan.

---

## The Problem (From the City's Side)

351 MA cities and towns each process building permits with limited staff. Post-Ch 150, they are receiving ADU applications that their bylaws may not yet cover, and they are short on reviewers who know the new rules.

A plan checker's day is:
1. Pull a submission from the queue
2. Read the plans
3. Cross-reference against the municipal bylaw, 780 CMR, and (post-Ch 150) state preemption
4. Write a corrections letter
5. Send it

Most cities are at capacity. Backlogs are growing. Bad submissions slow the queue for everyone.

## What Flow 3 Does

A city uploads a permit submission package. The agent:

1. Reads every sheet of the plans (PlanReader)
2. Parses the submittal checklist and compares to what was submitted (identifies missing docs, unsigned pages, incomplete forms)
3. Cross-references state ADU law (MALawLookup) and the city's own bylaw (CityCodeLookup) against the submission
4. Produces a **draft corrections letter** with specific code citations, ready for a human plan checker to review, edit, and send

The value: cuts plan-check time from 2–3 hours per submission to 30 minutes (review + edit + send), and catches bureaucratic issues (missing signatures, wrong code editions) before a human reviewer sees them.

## ICP (City Side)

### Primary
- **Mid-sized MA cities** with building departments of 3–10 staff — too big to rely on informal knowledge, too small to have a dedicated ADU specialist. Examples: Newton, Brookline, Somerville, Medford, Arlington, Watertown, Waltham.

### Secondary
- **Small MA towns** (5,000–20,000 population) with one-person building departments who are the bottleneck for everything.

### Tertiary
- **Boston + Cambridge** — large departments that already have specialists; harder sell, longer procurement cycle, but high-volume if won.

## Pricing (City Side)

Not finalized. Two candidate models:

1. **Per-submission fee** ($25–50 per auto-review run). Low friction, easy to pilot.
2. **Subscription** ($500–2000/month based on city size, unlimited reviews). Predictable revenue, higher commitment.

**Recommended starting point:** Per-submission, upgrade-to-subscription conversion after 30+ submissions/month.

## Distribution Channels (City Side)

1. **EOHLC / MHP partnership** — If we can pilot with EOHLC's technical assistance program or MHP's housing support, we get warm intros to 50+ cities. High value, long sales cycle.
2. **MAPC (Metropolitan Area Planning Council)** — Covers 101 Boston-area municipalities. Their planning boards talk to each other. One pilot = potential 10-city pipeline.
3. **Massachusetts Municipal Association (MMA)** — Annual conference, members.
4. **Direct outreach** — Target mid-sized cities with known ADU volume. Start with 10 cold outreach / month.
5. **Free pilot program** — Offer 90-day free pilot to the first 5 MA cities that sign up. Case studies → sales material.

## Positioning Statement (City Side)

"Your ADU submissions triaged before they hit your reviewer's desk. PermitMonkey reads each submission against state law, your bylaw, and your submittal checklist, then drafts a corrections letter your reviewer can edit and send. Cut plan-check time per ADU submission in half."

## Differentiation (City Side)

- **MA-specific** — knows MGL Ch 40A, 760 CMR 71.00, 780 CMR 10th Edition, and your city's bylaw. Off-the-shelf tools don't.
- **Post-Ch 150 awareness** — flags when a city's own bylaw provisions are now preempted, helping reviewers stay consistent with state law
- **Human-in-the-loop** — the agent drafts; the plan checker reviews, edits, and sends. No approvals happen without a human.
- **Audit trail** — every automated review logs what was flagged and why, with citations. Useful for defending decisions on appeal.

## Competing Solutions

- **Manual review** — status quo; slow and error-prone
- **Generic AI** (Claude, ChatGPT without domain skills) — unreliable; hallucinates citations; doesn't know MA-specific rules
- **Larger municipal software vendors** (Tyler Tech, Accela) — don't do content-level plan review; workflow only
- **Consultants** — expensive; don't scale; knowledge doesn't transfer

PermitMonkey sits between generic AI (too unreliable) and consultants (too expensive) in a way that scales with city budget.

## Sales Process

1. Discovery call (30 min): understand the city's current ADU review pain
2. Free pilot (90 days): plug agent into their workflow, no charge
3. Impact review (end of pilot): metrics on time saved, corrections quality
4. Proposal: per-submission or subscription pricing
5. Procurement: most MA cities have streamlined procurement for tools under $25K/year

## Risks (City Side)

- **Public records / transparency** — municipal decisions must be documentable. Solution: agent logs everything with citations.
- **Accountability** — reviewer is still responsible. Solution: always human-in-the-loop; no auto-decisions.
- **Procurement complexity** — some cities need months for contracts. Solution: start with cities that have streamlined procurement; use free pilot to prove value first.
- **Political risk** — if a city reviewer uses the tool and makes a mistake, who's liable? Solution: tool is a draft generator, not a decision-maker. Reviewer approves/edits every output.

## Roadmap

See `PLAYBOOK.md` §34 for master roadmap. City-side specific:

- **0–90 days**: Flow 3 is NOT built. Flow 1 and 2 priority.
- **90–180 days**: Begin Flow 3 design. First conversations with EOHLC / MAPC / pilot city candidates.
- **180–365 days**: Flow 3 pilot with 1 MA city. Iterate. Case study.
- **365+ days**: Expand city-side to 5+ cities. Consider full procurement-ready productization.

---

*End of MA city-side doc. For Flow 1/2 marketing, see `docs/marketing.md`. For full strategy, see `PLAYBOOK.md`.*
