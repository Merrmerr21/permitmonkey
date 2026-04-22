# PermitMonkey Master Playbook — V1.0 (MA Edition)

Tailored from Castle Capital Master Claude Code Playbook V3.3 + V3.4 Addendum. Keeps the universal Claude Code operational patterns (context management, effort levels, sub-agents, skills, session handoffs, multi-agent coordination, Claude Design, distribution). Drops the Castle Capital verticals (trading, MemoAI, QuestKey, ContextOps). Pivots the regulatory domain from California to Massachusetts.

**What this document is:** The operating manual for building and shipping PermitMonkey as an ADU permit assistant for Massachusetts. Read top-down the first time. After that, treat it as a reference — the TOC is the index.

**What it isn't:** A technical spec (see `docs/spec.md`), a roadmap artifact (see `docs/schedule-permitmonkey.md`), or a pitch deck. It's how we work.

---

## STRATEGIC CONTEXT — WHY MA, WHY NOW

**The regulatory shift.** Massachusetts passed **Chapter 150 of the Acts of 2024** (the Affordable Homes Act) on August 6, 2024. Sections 7 and 8 amended MGL Ch 40A §§1A and 3 to make ADUs allowed by-right in single-family residential zoning districts statewide. EOHLC issued implementing regulation **760 CMR 71.00 "Protected Use Accessory Dwelling Units"** (published in the Massachusetts Register January 31, 2025). Law effective **February 2, 2025**. Max 900 sq ft or 50% of primary dwelling's gross floor area, whichever is less. No owner-occupancy requirement. Max 1 parking space; zero if within 0.5 mi of commuter rail, subway, ferry, or bus station. Cities retain authority over dimensional standards (setbacks, bulk, height) and can prohibit short-term rental of ADUs, but cannot prohibit the use itself, require a special permit for the first ADU, or impose owner-occupancy.

**Why this changes the market.** California's ADU market is saturated, hostile to new tools, and has a 90%+ rejection rate baked into the cultural expectation. Massachusetts is 14 months into statewide by-right. No entrenched permit-assist tool has staked the territory. Contractors, architects, and homeowners are all learning the new rules simultaneously. That's a distribution opportunity (§35–38) and a content opportunity (AEO on "MA ADU law [city]" queries has low competition).

**Why Merritt should own this.** Boston-based. Studying MA real estate license. CRE analyst at JLL — understands permitting, code, professional standards. Network is MA-weighted. Every advantage here points east.

**What stays from PermitMonkey v1 (CA).** Architecture (Next.js + Cloud Run + Vercel Sandbox + Supabase + Agent SDK), the three flows, the skills-first pattern, the corrections-interpreter loop, the orchestrator/subagent handoff contract, the test-asset discipline. The code doesn't change much. The domain content changes completely.

**What changes.** The California ADU skill (28 files referencing HCD Handbook + Gov Code §§66310–66342) gets retired. In its place: a Massachusetts ADU skill (MGL Ch 40A, 780 CMR, EOHLC guidance, local bylaws for priority cities). Test assets shift from Placentia/Long Beach to Boston/Cambridge/Somerville. Marketing copy, ICP, and distribution channels re-target MA contractors and homeowners.

---

## TABLE OF CONTENTS

**Part 1 — Foundation**
1. Project Snapshot
2. MA Regulatory Primer (for the codebase, not for legal advice)
3. Pivot Diff — What Changes, What Stays

**Part 2 — Claude Code Practice (for this project)**
4. First-Time Setup
5. Essential Slash Commands
6. Opus 4.7 Effort Levels
7. Permission Modes (incl. Auto Mode)
8. Global + Local CLAUDE.md (short, scoped)
9. Context Management — 1M Window, Rot, 120K Threshold, Five Options
10. Session Handoff Protocol
11. Adaptive Thinking
12. Sub-Agents — Research, Reviewer, QA
13. Skills vs. MCPs — When to use which
14. Workspace Hygiene

**Part 3 — PermitMonkey Architecture**
15. The Three Flows (Corrections, Checklist, Pre-Screening)
16. Orchestrator → Subagent Pattern
17. Agent Roster — JDs + Three-Strike Policy
18. Skills Registry

**Part 4 — MA Pivot Execution**
19. Retire the California Skill Cleanly
20. Build the Massachusetts ADU Skill
21. MA City Research Skill (Boston / Cambridge / Somerville first)
22. Test Assets — Source, Anonymize, Benchmark
23. Directive Updates

**Part 5 — Reliability, Security, Cost**
24. Pre-Deploy Security Audit
25. Cost Controls (Sonnet vs. Opus; caching; sandbox hygiene)
26. Monitoring — Success rate, run time, token spend

**Part 6 — Distribution & Market**
27. ICP for MA
28. Free-Tool Funnel (ADU Eligibility Checker)
29. MCP Server as Distribution
30. AEO on MA ADU Queries
31. Content Repurposing Engine
32. Viral Artifacts (Eligibility Scorecard)

**Part 7 — Operations**
33. Cadence
34. Roadmap (90 / 180 / 365 days)
35. Pivot Triggers

---

# PART 1 — FOUNDATION

## 1. Project Snapshot

- **Product name:** PermitMonkey (engineering codename: permitmonkey)
- **Category:** AI-powered ADU permit assistant
- **Winner:** Anthropic "Built with Opus 4.6" Hackathon, Feb 2026
- **Primary flow:** Contractor uploads architectural plans (PDF) + city corrections letter → agent returns a response package (analysis report, professional scope of work, draft response letter, sheet annotations)
- **Runtime:** Agent SDK `claude_code` preset, running in Vercel Sandbox, orchestrated by Express on Cloud Run, state in Supabase, realtime push to Next.js 16 frontend
- **Model:** Opus 4.6 currently; upgrade to Opus 4.7 is available (see §6)
- **Domain:** Pivoting California → Massachusetts (this playbook)
- **Status:** Post-hackathon. Architecture is production-shaped. Skills need to be rebuilt for MA.

## 2. MA Regulatory Primer

*This is engineering-level context, not legal advice. Every citation lands on a reference the agent skill points to.*

**Statute layer (state):**
- MGL Ch 40A — Zoning Enabling Act
- MGL Ch 40A §1A — Definitions (amended by St. 2024, c. 150, §7 to add "accessory dwelling unit")
- MGL Ch 40A §3 — Uses and structures permitted (amended by St. 2024, c. 150, §8 to establish by-right ADUs)
- 760 CMR 71.00 — EOHLC regulation implementing the ADU provisions ("Protected Use Accessory Dwelling Units"); published in MA Register Jan 31, 2025
- Key terms to encode: 900 sq ft OR 50% of primary dwelling's gross floor area (lesser); no owner-occupancy requirement; max 1 parking space; zero if within 0.5 mi of commuter rail/subway/ferry/bus station; dimensional regulation reserved to localities; cities may restrict/prohibit short-term rental of ADUs; single ADU is by-right; additional ADUs still require special permit

**Building code layer (state):**
- 780 CMR — Massachusetts State Building Code, 10th Edition (based on IBC/IRC 2021 with amendments)
- 780 CMR Ch 1 — Administration
- 521 CMR — Architectural Access Board regulations (accessibility)
- 527 CMR — Fire prevention (sprinklers if over thresholds)
- Massachusetts Stretch Energy Code (many municipalities) and Specialized Opt-In Code (larger cities)

**Agency layer:**
- **EOHLC** (Executive Office of Housing and Livable Communities) — issues ADU guidance, successor to DHCD
- **DOER** (Department of Energy Resources) — energy code compliance
- **Board of Building Regulations and Standards (BBRS)** — building code interpretations
- **Local Building Department** — plan check, permit issuance, inspection (351 cities/towns)
- **Local Zoning Board of Appeals (ZBA)** — only relevant if ADU exceeds dimensional bylaws

**Local layer (priority cities):**
- Boston — Zoning Code Article 26A (post-Ch 150 of 2024 ADU provisions). Boston Planning & Development Agency (BPDA) involved in many reviews.
- Cambridge — Cambridge Zoning Ordinance, Section 4.22
- Somerville — Somerville Zoning Ordinance, Section 9.2
- Newton — Newton Zoning Ordinance, Section 3.4
- Brookline — Brookline Zoning By-Law, §4.07

For each local, the skill needs: dimensional standards (max size, setbacks, height, lot coverage), design standards (parking, entry location, materials), submittal checklist, fees, review timeline, appeal path.

**Pattern:** State law establishes the right; local bylaws regulate the form. The skill must reason across both layers. Every correction item the agent responds to will cite one or both.

## 3. Pivot Diff — What Changes, What Stays

**Stays unchanged:**
- All architecture: Next.js frontend, Cloud Run orchestrator, Vercel Sandbox execution, Supabase state/storage
- Agent SDK `claude_code` preset usage
- The three flows (Corrections, Checklist, Pre-Screening)
- Orchestrator → subagent handoff contract
- Skills-first design pattern
- PDF vision pipeline (plans extraction)
- Realtime status push via Supabase channels
- Test-asset discipline (real permits, anonymized)
- Security model (per-job sandbox, ephemeral)

**Changes:**
- `.claude/skills/california-adu` → retire. New: `.claude/skills/massachusetts-adu`
- `.claude/skills/adu-city-research` → MA cities only; drop CA platform references (Municode, American Legal Publishing patterns are mostly MA too, but bylaw structure differs)
- `test-assets/corrections/` — Placentia docs retained for historical regression, but MA test assets become primary
- `test-assets/approved/` — Long Beach Flint Ave retained historical; MA approved plans become primary
- Marketing copy in `docs/marketing.md`, `docs/marketing-city.md` — rewrite for MA
- `README.md` — update top-line claim ("AI-powered ADU permit assistant for California" → "for Massachusetts")
- Agent system prompts — update jurisdictional references
- Directive files in agent configs — swap CA → MA

**Net effort estimate:** 2-3 weeks of focused work if test assets are sourceable within week 1. Skill rewrite is the critical path.

---

# PART 2 — CLAUDE CODE PRACTICE (FOR THIS PROJECT)

## 4. First-Time Setup

If you're cloning fresh onto a new machine:

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
claude  # authenticates against subscription

# Optional: experimental agent teams for multi-agent dev work
$env:CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1"
```

IDE: VS Code with Claude Code extension (verified publisher). Enable "Allowed Dangerously Skip Permissions" in extension settings for this project only — you'll be iterating fast and the sandbox model already contains blast radius.

Desktop app (`claude.com/download`) is preferred for parallel session work — see §9 on session chaining.

## 5. Essential Slash Commands

Ordered by frequency on this project:

| Command | When |
|---------|------|
| `/context` | Before every heavy prompt. Baseline audit weekly. |
| `/usage` | Check weekly allowance before multi-agent runs. |
| `/rewind` (or double-Esc) | Agent went down a wrong path. Always prefer this over "that didn't work, try X". |
| `/compact <direction hint>` | Session past 60%, not 95%. Include what to preserve. |
| `/clear` + handoff doc | New task. See §10. |
| `/btw` | Side-channel question that shouldn't pollute the main thread. |
| `/model` | Switch to Sonnet for research/scraping subagents, Opus for synthesis. |
| `/permissions` | Lock down tools when handing a session to unattended operation. |
| `/cost` | Monitor spend during agent team runs. |

Anti-pattern: correcting Claude in a new turn after it went wrong. Rewind. The re-read tax of a dead branch is 98%+ of the cost (§9).

## 6. Opus 4.7 Effort Levels

Opus 4.7 ships a five-tier effort system replacing fixed thinking budgets. Default is `xhigh`.

**PermitMonkey effort assignments:**

| Workload | Effort | Why |
|----------|--------|-----|
| Corrections response package (end-to-end) | `xhigh` | Synthesis across plans + letter + code; client-facing output |
| Single correction item resolution | `xhigh` | Accuracy matters; few tokens per item relative to stakes |
| City research skill runs | `medium` | Bounded web scrape + structured extraction |
| PDF plan extraction (vision) | `medium` | Vision pass doesn't benefit from max thinking |
| MA ADU skill reference file generation | `high` | Want careful reasoning per topic |
| Test-asset benchmarking | `max` | High-value decision; gate before shipping skill changes |
| Marketing copy drafting | `medium` | Voice matters less than iteration speed |
| Commit message / doc writing | `low` or `medium` | Don't spend Opus on prose |

Override for long autonomous runs with full context up front: keep `xhigh`. Every user turn on 4.7 adds reasoning overhead, so minimizing turns > lowering effort.

## 7. Permission Modes

Toggle via bottom-left GUI or `/permissions`.

**Recommended flow:** Start in **Plan Mode** (read-only) → review the plan → switch to **Auto Mode** or **Bypass Permissions** → execute.

**PermitMonkey-specific rules:**
- Supabase writes: Auto Mode OK (classifier catches bulk deletes)
- Sandbox launches (cost): Auto Mode only if you're watching
- Skills authoring: Bypass — low blast radius, high iteration need
- Production deploy: Ask Before Edits

Auto Mode is the right default for long agent builds where you set up the task once and walk away. Research preview on Max plans.

## 8. Global + Local CLAUDE.md

Two-layer setup:

**Global (`~/.claude/CLAUDE.md`):** Merritt's identity, default preferences, diversification rules. Already exists.

**Local (`.claude/CLAUDE.md`) — to be created for permitmonkey:**

```markdown
# permitmonkey CLAUDE.md

## Product
PermitMonkey — AI ADU permit assistant. Currently pivoting CA → MA.
Win condition: contractor uploads plans + corrections letter, gets
back a professional response package that holds up under a plan
checker's review.

## Non-Negotiables
- Every code citation must be real (MGL Ch 40A, 780 CMR section, or
  a specific municipal bylaw with URL). Never cite from memory.
- Never claim a property is ADU-eligible without checking local
  dimensional bylaws. State preemption on USE does not override
  local dimensional standards.
- When MA statute and local bylaw conflict, state wins for USE
  questions, locality wins for FORM questions. Flag the conflict.
- Never modify test-assets/ without Merritt's explicit approval.
- Agent SDK runs in Vercel Sandbox; don't propose patterns that
  assume persistent filesystem across runs.

## Opus 4.7 Calibration
- Default effort is xhigh for corrections-response work
- For long autonomous agent runs, prefer one well-specified turn
  over many turns (adaptive thinking compounds overhead per turn)

## Style
- Professional, institutional tone in generated output
- Cite, don't assert
- When unsure, ask the contractor a clarifying question rather
  than guessing

## Self-Annealing Protocol
When an agent run fails:
1. Diagnose where and why
2. Attempt the fix (try hard before escalating)
3. Update the relevant skill AND the directive
4. Document in Lab Notes at bottom of this file

## Diversification
Every time this CLAUDE.md is updated, mirror the changes to
AGENTS.md for non-Claude coding agents (Cursor, Aider). Backup
system — don't lose productivity if Anthropic has an outage.

## Lab Notes — What Not To Do
(Auto-updates as mistakes are logged)
```

Ceiling: ~200 lines / ~2K tokens. Put critical guardrails at the top (primacy bias). When Claude makes the same mistake 2-3 times, add the rule here.

## 9. Context Management — 1M Window, Rot, 120K Threshold, Five Options

**The core math:** Every turn, Claude re-reads the entire conversation. At 30 turns, you're paying ~31× the cost of turn 1 on input tokens alone. Audits show ~98.5% of total tokens in long sessions are re-reads, not new work.

**1M context does not mean use 1M.** Retrieval accuracy drops from 92% at 256K to 78% at 1M. Thinking depth drops 67% across long sessions. Peak performance lives in the 10K-50K range.

**The 120K threshold.** Treat 120K as a voluntary reset trigger. Maps to the "60% of 200K" old discipline that produced good results. Crossing 120K with no plan is the single most common path to a bloated session.

**Prime time.** The first 0-20% of a session is peak performance — CLAUDE.md is fresh, attention isn't dispersed. Don't waste it on trivial setup.

**The five options after every turn:**
1. **Continue** — context is load-bearing; don't pay to rebuild it
2. **`/rewind`** — Claude went wrong; keep useful reads, drop the failed branch
3. **`/compact <hint>`** — mid-task but session bloated with stale debugging
4. **`/clear`** — genuinely new task; you control what carries forward
5. **Subagent** — next step has lots of output you only need the conclusion from

**Subagent mental test:** *Will I need this tool output again, or just the conclusion?* If just the conclusion → subagent.

**Fresh-session overhead audit.** Run `/context` at session start. If baseline > 25K, something's bloated — disable unused MCPs for this project, prune CLAUDE.md, move instructions into skills.

**Format conversion for inputs.** Pre-converting to markdown before handing to Claude: HTML → MD ~90% token reduction; PDF → MD ~65%; DOCX → MD ~33%. A 40-page PDF can equal ~130 pages of MD. Use Docling (CLI) as primary, pandoc as fallback. Exception: when you need the images/charts visually (plan sheets in PermitMonkey), rasterize instead.

## 10. Session Handoff Protocol

Higher-ROI than `/compact`. Fire when you hit 120K, or finish a meaningful chunk.

Template:

```markdown
# Session Handoff — [Project/Task] — [Date]

## Where We Started
[One sentence of the original task]

## Decisions Locked
- [Decision 1 and rationale]
- [Decision 2 and rationale]

## What Shipped
- [Files created/modified]
- [Tests passing: X/Y]

## Key Files for Next Session
- `path/to/file` — [state]
- `path/to/plan.md` — [reference first]

## Running State
- [Branch, deployment state, env flags]

## Verification Deferred
- [Things not yet checked]

## Open Questions
- [Unresolved items]

## Pick Up From Here
[One paragraph: exactly what the next session should do first]
```

**Usage:**
1. Prompt: "Generate a session handoff using [template] covering everything from this session."
2. Copy output.
3. `/clear`.
4. Paste as first prompt in new session.
5. End with "Confirm you understand and give me the next action."

This beats `/compact` because the model compacts at its least intelligent point (end-of-session rot). The handoff is generated while Claude is still sharp, is structured, and the new session starts at 0% rot.

**PermitMonkey uses:**
- Between skill-writing sessions (building MA ADU skill file-by-file)
- Between research (MA city bylaw scrape) and implementation
- Between test-asset benchmark runs

## 11. Adaptive Thinking

Opus 4.7 decides per-step whether to spend thinking tokens. Steering prompts:

**More thinking:**
> Think carefully and step-by-step before responding; this problem is harder than it looks.

**Less thinking:**
> Prioritize responding quickly rather than thinking deeply. When in doubt, respond directly.

**Force more thinking on:** Corrections items that touch code citations. Test-asset benchmarking. Conflicts between state preemption and local bylaw.

**Force less thinking on:** PDF page extraction. Repetitive file renames. Committing prose.

## 12. Sub-Agents

Three persistent subagents live in `.claude/agents/`:

**Researcher** (Sonnet 4.6)
- Tools: `web_fetch`, `web_search`, `bash`, `read`
- Use: MA bylaw scrape, regulatory research, city-specific rules

**Code-Reviewer** (Sonnet 4.6)
- Tools: `read`, `grep`, `glob`
- Use: After every meaningful change to skills, directives, or agent SDK code

**QA** (Sonnet 4.6)
- Tools: `bash`, `read`, `write`
- Use: Run the test-asset benchmark suite, flag regressions

**Sub-agent probability math:** 3 subagents at 95% each = 85.7%. 10 at 95% = 59.9%. Don't chain more than 5 without a validator.

**Explicit invocation** (Opus 4.7 spawns fewer by default):

> Spawn multiple subagents in the same turn when fanning out across MA cities. Do not spawn a subagent for work you can complete directly in a single response.

## 13. Skills vs. MCPs

**Skills** load on-demand (~60 tokens front matter). Body loads only when Claude decides to use it. Best for: deterministic workflows, domain knowledge, per-task references.

**MCPs** load always (1-5K+ per active MCP). Best for: real-time auth, persistent connections, stateful integrations.

**PermitMonkey MCP stack (keep lean):**

Always-on:
- Filesystem
- GitHub

Per-flow:
- **Corrections flow:** Supabase (for run state)
- **City research:** Chrome DevTools or Puppeteer (hard-to-scrape bylaw sites)

Load-on-demand only (skills):
- MA ADU law reference
- MA city bylaws
- Plan sheet annotation patterns
- PDF extraction patterns

**MCP → Skill conversion rule:** If you use 1-2 tools of an MCP, convert those to a skill.

## 14. Workspace Hygiene

**Weekly:** Delete merged branches. Archive old experiment folders. Run `/context` audit on each active project.

**Monthly:** Prune stale skills. Review MCP list for unused servers. Compress old conversation exports. Re-run test-asset benchmark against any new Opus or Sonnet release — any regression blocks the upgrade.

**Quarterly:** Review the global CLAUDE.md. Run `/insights` across all projects. Promote learnings to global rules.

---

# PART 3 — PERMITMONKEY ARCHITECTURE

## 15. The Three Flows

**Flow 1 — Corrections Letter Interpreter (primary, production).** Contractor uploads plans PDF + corrections letter PDF. Agent extracts plans with vision, parses corrections items, cross-references MA state + local code, asks clarifying questions, generates response package (analysis report, professional scope of work, draft response letter, sheet annotations JSON).

**Flow 2 — Permit Checklist Generator.** Contractor enters project address + ADU type (attached/detached/conversion) + size + lot type. Agent researches city-specific requirements, combines with state ADU rules, produces pre-submission checklist with city-specific gotchas.

**Flow 3 — City Pre-Screening (roadmap, unbuilt).** City building department uploads a permit submission. Agent reviews against the city's own requirements and state ADU law, flags missing docs/unsigned pages/incomplete forms before a human plan checker touches it. Open-source vision.

**Priority order for MA launch:** Flow 1 (revenue), Flow 2 (lead magnet / free tool, see §28), Flow 3 (B2G, later).

## 16. Orchestrator → Subagent Pattern

Claude Code's own architecture. PermitMonkey uses it:

```
Contractor submits job
       ↓
Frontend (Next.js) → API → Supabase record
       ↓
Cloud Run orchestrator picks up job
       ↓
Launches Vercel Sandbox (fresh, per-job)
       ↓
Agent SDK with claude_code preset + skills loaded
       ↓
  ┌────────────────────────────────────┐
  │ Main agent (planner)               │
  │   ├─ Subagent: PDF extraction      │
  │   ├─ Subagent: Corrections parser  │
  │   ├─ Subagent: MA law lookup       │
  │   ├─ Subagent: City code lookup    │
  │   └─ Synthesizer: response package │
  └────────────────────────────────────┘
       ↓
Writes back to Supabase
       ↓
Supabase Realtime pushes progress to frontend
       ↓
Contractor downloads package
```

**Why orchestrator-subagent here:**
- Clear task decomposition (parse, lookup, synthesize)
- Subtasks have lots of tool output you only need the conclusion from — main agent never sees raw PDF bytes or full web scrape dumps
- Each subagent's context dies with the job; no state bleed between contractors

**Weakness to watch:** orchestrator becomes information bottleneck; details lost in handoff summarization. Mitigation: subagents write structured JSON, not prose, for hand-back.

## 17. Agent Roster — JDs + Three-Strike Policy

Every agent gets a **written job description** in `.claude/agents/<name>.md`. Track performance in `.claude/agent-performance.md`.

**Current PermitMonkey roster:**

| Agent | Model | Role |
|-------|-------|------|
| **Planner** | Opus 4.7 xhigh | Reads job intake, plans subagent dispatches, synthesizes final package |
| **PlanReader** | Opus 4.6 (vision) | Extracts architectural plan sheets page-by-page |
| **CorrectionsParser** | Sonnet 4.6 | Breaks corrections letter into discrete items, classifies each |
| **MALawLookup** | Sonnet 4.6 | Cross-references MA ADU skill for each correction item |
| **CityCodeLookup** | Sonnet 4.6 | City-specific bylaw research via MA city research skill |
| **ResponseWriter** | Opus 4.7 xhigh | Writes client-facing response package |
| **QAReviewer** | Opus 4.7 xhigh | Validates every citation before delivery |

**Three-strike policy:**

Track per agent per run:
- **Hallucination** (output contradicts source)
- **Directive violation** (acted outside scope)
- **Failed handoff** (downstream couldn't use output)

- Strike 1: warning, logged
- Strike 2: next run in sandbox — output compared against ground truth before acceptance
- Strike 3: agent disabled; review JD + skill; rebuild if systemic

**MALawLookup has zero-tolerance for hallucinated citations.** A single fabricated MGL reference disables the agent until manually re-verified. This is an E&O-liability vector — don't compromise.

## 18. Skills Registry

Post-pivot target state in `.claude/skills/`:

| Skill | Purpose |
|-------|---------|
| `massachusetts-adu` | State law, 780 CMR sections, EOHLC guidance |
| `ma-city-research` | Three-mode (WebSearch discovery, WebFetch, Chrome fallback) for MA cities |
| `ma-corrections-interpreter` | Workflow skill guiding the corrections multi-step |
| `permitmonkey-ops` | Operator skill — how to run the deployed system |
| `pdf-extraction` | Reading plan sheets with vision |
| `permit-response-writer` | Professional response letter patterns |
| `adu-eligibility-checker` | Free-tool backing skill (see §28) |

Retire from `.claude/skills/`: `california-adu`, `adu-city-research` (CA variant). Keep as git history for regression reference.

---

# PART 4 — MA PIVOT EXECUTION

## 19. Retire the California Skill Cleanly

**Don't delete. Retire.** Move `adu-skill-development/` and any `california-adu` folders into a `_legacy/` directory with a README note. Reasons:
- Regression testing — can still benchmark against the CA fixtures to catch architecture breaks
- Historical context — decisions in progress.md reference CA terms; keeping the skill findable preserves that trail
- Cheap to carry; no active cost

```powershell
New-Item -ItemType Directory -Path _legacy
Move-Item adu-skill-development _legacy\
Move-Item .claude\skills\adu-city-research _legacy\skills\
# Update README, add _legacy/README.md explaining the pivot
```

Update the top-level `README.md`: the one-liner changes from "AI-powered ADU permit assistant for California" to "AI-powered ADU permit assistant for Massachusetts."

## 20. Build the Massachusetts ADU Skill

Target structure for `.claude/skills/massachusetts-adu/`:

```
SKILL.md                      # Frontmatter + when-to-use + decision tree
references/
  chapter-150-of-2024.md              # Full text + engineering annotations
  mgl-40a-section-3.md        # Zoning preemption mechanics
  780-cmr-essentials.md       # Building code sections that hit ADUs
  eohlc-guidance.md           # Official guidance docs, updated list
  dimensional-summary.md      # State floor, local ceiling reasoning
  thresholds-quick-ref.md     # Numbers: 900sf, 50%, 0.5mi, etc.
  conflicts-and-preemption.md # When state overrides local
decision-tree/
  by-right-eligibility.md     # Property → eligible? flowchart
  construction-type.md        # New detached / attached / conversion
  modifiers.md                # Within 0.5mi transit, historic, etc.
```

**Build order (recommended, 1-2 weeks):**

1. **Day 1-2:** Read Ch 150 of 2024 + EOHLC guidance. Write `chapter-150-of-2024.md` with every material provision annotated.
2. **Day 3-4:** Decision tree — `by-right-eligibility.md` + `construction-type.md`. This is what the agent branches on.
3. **Day 5:** `thresholds-quick-ref.md` — the numbers. Opus should be able to answer "what's the max ADU size in MA" without loading any other file.
4. **Week 2:** 780 CMR extracts (fire separation, egress, energy code), then conflicts-and-preemption, then EOHLC roll-up.
5. **Week 2 end:** SKILL.md with routing logic. Description < 200 words — this is what determines whether the agent loads the body.

**Source discipline:** Every citation in every reference file links to a canonical URL (mass.gov statute viewer, municipal bylaw PDF, EOHLC guidance doc). If the URL isn't canonical, the citation doesn't go in.

## 21. MA City Research Skill

Three-mode pattern, same as the CA version:

**Mode 1 — Discovery (WebSearch).** Find the city's zoning code URL, building department page, ADU-specific guidance.

**Mode 2 — Targeted Extraction (WebFetch).** Pull canonical bylaw sections, submittal checklists, fee schedules.

**Mode 3 — Browser Fallback (Chrome DevTools MCP).** For cities whose websites resist WebFetch (Boston's is the biggest offender — heavy client-side rendering).

**MA platform landscape:** Most cities publish via eCode360 (General Code) or Municode. Boston uses its own CMS. Cambridge has a static PDF. Somerville eCode360. Newton Municode. Brookline eCode360. Pattern recognition in the skill speeds up new-city onboarding.

**Priority city build order (4 weeks):**
- Week 1: Boston (hardest, highest demand)
- Week 2: Cambridge + Somerville (similar patterns, high demand)
- Week 3: Newton + Brookline (affluent homeowner demand)
- Week 4: Worcester + Quincy + Lowell (volume, outside Route 128)

Per-city output target: one markdown reference file with dimensional bylaws, submittal checklist, fees, appeal path, review timeline, and a "gotchas" section (owner's affidavits, historic district overlays, wetlands, etc.).

## 22. Test Assets — Source, Anonymize, Benchmark

This is the hardest part of the pivot. You need:

**5-8 real MA ADU permit submissions** with all documents:
- Architectural plans (PDF)
- Site plans
- Any corrections letter received
- Approved plans (for "approved" fixtures)

**Sourcing paths:**
1. Ask MA-based architects who design ADUs (Google "Boston ADU architect" and cold-email — many are eager for AI tools that reduce corrections cycles)
2. Public records requests to city building departments (permitted ADUs with granted permits are public record in most MA cities)
3. Merritt's JLL network — capital markets analysts routinely get introduced to architects/contractors
4. Reddit r/Boston / r/CambridgeMA / r/Massachusetts — post offer to build free AI tool for contractors in exchange for plan share (anonymized)

**Anonymization rules:**
- Redact owner names, exact addresses (keep city + zip)
- Redact contractor license numbers
- Keep all architectural and engineering content (sheet indexes, dimensional data, details)
- Keep all code citations
- Signed consent form before any asset enters `test-assets/`

**Fixture structure:**

```
test-assets/
  ma/
    corrections-boston-01/
      plans.pdf
      corrections-letter.pdf
      contractor-notes.txt     # What the contractor thinks the issues are
      expected-response.md     # Ground truth — what a good response looks like
    approved-cambridge-01/
      plans.pdf
      stamp-page.pdf
    corrections-somerville-01/
      ...
```

**Benchmark cadence:**
- Run full MA fixture suite before any skill change merges
- Run after every Anthropic model release (re-run on new Opus/Sonnet)
- Accuracy target: 90%+ of corrections items receive a technically correct response with valid citations

**Don't ship to production without 5+ MA fixtures.** The CA Placentia fixtures prove the pipeline works architecturally; they don't prove MA domain coverage.

## 23. Directive Updates

Every agent SDK directive / system prompt file that mentions California needs review. Suspected locations:
- `agents-permitmonkey/` configurations
- `.claude/skills/adu-corrections-interpreter/` — check SKILL.md
- `.claude/skills/demo-city-review/` and `demo-contractor-corrections/` — CA-tuned demo flows
- `frontend/` — any hardcoded copy mentioning "California", "HCD", "Gov Code 66310"
- `server/` — orchestrator prompts, fallback messages
- `README.md`, `docs/spec.md`, `docs/marketing.md` — all domain-specific copy

**Search pattern:**

```bash
grep -rn -i "california\|HCD\|66310\|66341\|Placentia\|Long Beach" .
```

Build a single commit that does the find/replace for the universal patterns (CA → MA, HCD → EOHLC, Gov Code §66310 → MGL Ch 40A §3), then individual commits for each skill rebuild.

---

# PART 5 — RELIABILITY, SECURITY, COST

## 24. Pre-Deploy Security Audit

Run before every production deploy. Paste into Claude Code verbatim:

```
Conduct a full security audit of this codebase. Check for:

1. CREDENTIALS: hardcoded API keys, .env files in git, creds in logs,
   keys as URL params.
2. INJECTION: SQL string concat, user input to shell, user input to
   HTML without escaping, LLM prompt injection in uploaded plans.
3. AUTH: routes missing auth middleware, Supabase RLS disabled or
   misconfigured, admin endpoints without admin checks, JWT in
   localStorage.
4. DATA EXPOSURE: stack traces to client in prod, internal IDs
   exposed, PII in logs, CORS wildcards.
5. DEPENDENCY: outdated packages with CVEs (npm audit), unknown-
   source packages.
6. INFRASTRUCTURE: Supabase service-role key in frontend, Cloud Run
   env var scope, Vercel Sandbox filesystem reuse between jobs,
   Supabase Storage public ACLs on uploaded plans.

Flag only. Do not attempt to fix. Output format:
- Severity (critical/high/medium/low)
- File:line
- Recommended fix
```

**PermitMonkey-specific:**
- Uploaded plans can contain PII (owner names, addresses). Storage bucket must be private, signed-URL access only.
- Agent SDK runs in Vercel Sandbox — verify each job gets a fresh sandbox, no reuse of sandbox containers across contractors.
- LLM prompt injection via uploaded corrections letters: contractors could upload a letter that says "ignore previous instructions." System prompt must be robust. Test with adversarial uploads.
- Supabase RLS on `jobs`, `runs`, `artifacts` so contractor A never sees contractor B's data.

## 25. Cost Controls

**Model routing:**
- Opus 4.7 (`xhigh`): Planner, ResponseWriter, QAReviewer, final synthesis
- Sonnet 4.6: CorrectionsParser, MALawLookup, CityCodeLookup, subagent research
- Haiku 4.5: classification/extraction tasks (e.g., correction item categorization)

**Caching discipline:**
- MA ADU skill content is STABLE. Cache via Anthropic prompt caching headers — target ≥50% cache hit rate on skill reads.
- City bylaw lookups cached for 30 days (bylaws don't move daily). Bust cache on explicit trigger.
- PDF plan extractions cached per (plan hash, agent version). Same contractor rerun shouldn't re-extract.

**Sandbox hygiene:**
- Vercel Sandbox cost scales with runtime. Target p50 < 10min per job, p95 < 25min.
- Abort conditions: no progress for 3min, token spend >$5, any subagent hits 3 strikes (§17).
- Aggressive compact between subagent handoffs — structured JSON only.

**Cost/run targets (Opus 4.7 + caching):**
- Corrections job: $2.50 avg, $5.00 cap
- Checklist job: $0.75 avg, $1.50 cap
- Research skill build (dev time): $10-25 per city

## 26. Monitoring

**Application errors:** Sentry, free tier, on frontend + orchestrator.

**Uptime:** Routine every 15min hitting `/health` on Cloud Run + Vercel. Alert to Slack.

**LLM cost tracking:** Weekly Routine pulls Anthropic API usage, posts breakdown to Slack. Flag any job >$10.

**Key metrics:**

| Metric | Target | Alert |
|--------|--------|-------|
| Job success rate | >95% | <90% |
| p50 run time | <8min | >15min |
| p95 run time | <25min | >45min |
| Cost per corrections job | <$3 | >$6 |
| MALawLookup hallucination rate | 0% | any |
| Contractor completion (start → download) | >50% | <30% |

---

# PART 6 — DISTRIBUTION & MARKET

## 27. ICP for MA

**Primary:**
- **MA-licensed contractors** doing 3-15 ADU projects per year, currently spending 3-8 hours per corrections cycle
- **MA architects/designers** focused on residential infill, want to reduce plan-check friction

**Secondary:**
- **Homeowners** considering an ADU, don't know if their lot qualifies (free-tool funnel, see §28)
- **Real estate investors** evaluating lots for ADU potential

**Tertiary (roadmap):**
- **City building departments** wanting Flow 3 to triage their inbox

**Acquisition channels (ranked by fit):**
1. Merritt's JLL network → introductions to MA residential developers and architects
2. Free-tool funnel (§28) → homeowner email capture → upsell to contractor referrals
3. AEO (§30) → contractors searching "MA ADU corrections response"
4. Reddit r/Boston, r/CambridgeMA (contractors hang out there)
5. Paid: Google Ads on "MA ADU permit [city]" — low competition, well-qualified traffic

## 28. Free-Tool Funnel — ADU Eligibility Checker

Build this first, before the paid product has a single MA customer. The tool IS the marketing.

**Mechanic:**
- Homeowner enters MA address + lot size + primary dwelling size
- Tool checks: is this lot in a single-family zone? Does Ch 150 of 2024 apply? What's the dimensional limit? Any historic/wetlands/overlay issues?
- Returns: "Your lot is likely ADU-eligible. Here's the max size. Here are the top 3 gotchas for [city]."
- Capture email for the full report
- Share button: "My lot can fit an 850 sq ft ADU — check yours" → pre-filled social post

**Flywheel:**
1. SEO landing page per major MA city ("ADU eligibility Boston", "ADU eligibility Cambridge", etc.)
2. Free tool delivers instant value
3. Email capture
4. Upsell: "Need help with the permit? We work with contractors who can build it"
5. Referral fee from partner contractors = revenue without acquiring paid users directly

**Build target:** One weekend. Skill is `adu-eligibility-checker`. Frontend is a single Next.js page. This is not a moonshot — it's 48 hours of work.

## 29. MCP Server as Distribution

Publish an MCP server that exposes MA ADU data: dimensional thresholds by city, submittal checklists, contact info for building departments. Any AI assistant (Claude, ChatGPT, Cursor) that connects to the MCP will answer MA ADU questions using your data.

**Mechanic:**
- User asks their AI: "Can I build an ADU in Cambridge?"
- AI discovers your MCP, pulls your data
- User gets answer, PermitMonkey URL in the citation

**Publish to:** Smithery, MCPT, Open Tools.

**Why first-mover matters:** Building an MCP for a domain in 2026 is like building for mobile in 2010. The first authoritative MA ADU MCP will be the default source.

## 30. AEO on MA ADU Queries

Structured Q&A content on the site, schema-marked, citation-ready.

**Top 20 questions to answer definitively:**
1. Can I build an ADU in Massachusetts?
2. How big can an ADU be in Massachusetts?
3. Do I need owner occupancy for an ADU in Mass?
4. Does my city require parking for an ADU?
5. What does Chapter 150 of the Acts of 2024 do?
6. How long does ADU permit approval take in Boston?
7. What is the ADU setback in Cambridge?
(etc.)

Each question gets a 3-5 paragraph answer, schema FAQ block, link to the relevant MA ADU skill reference file. Claude/Perplexity/ChatGPT will cite you if the answer is clean.

**Monitoring:** Use Otterly or Profound to track citations. Target: primary source for ≥5 queries within 90 days.

## 31. Content Repurposing Engine

Merritt records one 20-minute voice memo per week on an MA ADU topic (a recent corrections case, a new city rolling out bylaws, a Ch 150 of 2024 interpretation). Claude repurposes:
- 1 blog post
- 3-5 LinkedIn posts
- 5-10 tweets
- 1 newsletter edition
- 2-3 short-form videos via Remotion

**Anti-slop discipline:** Rewrite Claude's drafts before posting. Human voice beats AI-native content for engagement. If you use Claude as starting material, fully rewrite. Watch for em dashes — dead giveaway.

**Weekly cadence:** Mon plan, Tue draft, Wed render, Thu-Fri post, Sat review.

## 32. Viral Artifacts — Eligibility Scorecard

From the free-tool flow, generate a shareable scorecard:

> **Your Lot: 8,200 sq ft in Cambridge**
>
> ✓ Zoned Residence B — ADU allowed by-right
> ✓ Max ADU size: 900 sq ft
> ✓ Within 0.5mi of Alewife T — no parking required
> ⚠ Historic district — design review likely
>
> Checked by PermitMonkey · Run yours at permitmonkey.ai

Clean, branded, shareable to LinkedIn/Twitter/Instagram. Each share is a backlink + a peer-signaled endorsement.

---

# PART 7 — OPERATIONS

## 33. Cadence

**Daily:** Check Sentry. Skim any alerts.

**Weekly (Mon 7am):** Performance report Routine posts to Slack — success rate, run time, cost per job, citations audit.

**Weekly (Fri):** Review the week's corrections-job outputs. Any poor responses → root-cause into the MA ADU skill or the ResponseWriter JD.

**Monthly:** Re-run full MA test-asset benchmark. Any regression → investigate before next release.

**Quarterly:** Review this playbook. Prune what's stale. Promote new Lab Notes to permanent rules.

## 34. Roadmap

**0-90 days (pivot execution):**
- [ ] Retire CA skills to `_legacy/`
- [ ] Build MA ADU skill (Ch 150 of 2024, 780 CMR, EOHLC)
- [ ] Source 5+ MA test assets
- [ ] Build MA city research for Boston, Cambridge, Somerville
- [ ] Ship free-tool ADU eligibility checker
- [ ] Update marketing copy top-to-bottom
- [ ] First 5 paying MA contractors

**90-180 days (market build):**
- [ ] Expand city coverage to 10 MA cities
- [ ] Publish MA ADU MCP server
- [ ] Launch AEO content (20 definitive Q&As)
- [ ] Paid Google Ads on top queries
- [ ] First 25 paying MA contractors

**180-365 days (scale or pivot):**
- [ ] Flow 3 (city pre-screening) pilot with 1 MA building department
- [ ] Expand to adjacent MA permit types (residential additions, solar, decks) if ADU proves saturated
- [ ] Consider adjacent states (RI, NH, CT have similar ADU pressure)
- [ ] 100+ paying contractors or clear pivot signal

## 35. Pivot Triggers

Explicit conditions that would change the plan:

**Ch 150 of 2024 gets weakened or overridden.** If the legislature walks it back (unlikely but possible given local pushback), the by-right premise collapses. Fallback: reposition as a permit-friction tool broadly, not ADU-specific.

**A well-funded competitor stakes MA.** If a YC-backed or VC-backed entity launches an MA ADU permit tool with serious marketing, revisit. Castle Capital's advantage is local expertise + Merritt's network + Claude Code execution speed, not capital.

**MA ADU volume doesn't materialize.** If 12 months in, the ADU permit volume across priority cities is <500/year total, the market is too thin. Pivot to adjacent permit types (residential additions, commercial TI) where volume is higher.

**Customer acquisition cost exceeds lifetime value for 3 months.** Reposition or drop paid acquisition, double down on free tool + referral.

---

## APPENDIX A — CLAUDE DESIGN FOR PERMITMONKEY

For any deck, landing page, or marketing artifact:

**DESIGN.md first** (in a `design/` folder). Capture: typography, color, spacing rhythm, chart standards, voice, banned defaults.

**Banned defaults — paste into every starter prompt:**
- No Inter, Roboto, or Arial as primary typeface
- No blue-to-purple gradients
- No generic rounded-corner cards with drop shadows
- No stock gradient backgrounds

**Token-conservation hierarchy:**
1. Upfront design system work (DESIGN.md + core screens) — runs once
2. Initial Opus 4.7 generation — the one expensive prompt
3. Comment tool for surgical edits — cheap
4. Sliders for spacing/density/warmth — cheap
5. Re-prompts — AVOID unless restarting from scratch

**Fidelity rule:** Lowest-fi OR hi-fi. Never mid-fi. Wireframe first to save tokens before committing to hi-fi.

**Self-polishing pass:** Wait 30-60 seconds after generation. Claude keeps iterating. Don't burn a comment pass on something it's about to fix.

**Export reality:** HTML > PDF > PPTX > Canva. Save HTML first for any artifact you'll iterate on.

---

## APPENDIX B — KEY SLASH COMMAND CHEAT SHEET

```
/init          First time in project, generate workspace summary
/context       Token breakdown — run weekly baseline
/usage         Claude Code allowance check
/compact       Compress with direction hint
/clear         New task, clean slate
/rewind        (or double-Esc) — jump back to previous message
/cost          Monitor agent team spend
/model         Switch Opus/Sonnet/Haiku
/permissions   Fine-grained tool control
/status line   Customize status bar
/insights      After 50+ conversations
/schedule      Create a Routine
/btw           Side-channel question, no context pollution
```

---

## APPENDIX C — LAB NOTES — WHAT NOT TO DO

(Auto-updates as mistakes accrue. Entries start with the date and one-line description of the mistake, then the fix.)

*No entries yet. First lesson learned will be logged here.*

---

*PermitMonkey Master Playbook V1.0 (MA Edition) — Merritt Cassell — April 2026*

*Tailored from: Castle Capital Master Claude Code Playbook V3.3 + V3.4 Addendum. Source playbook covers broader Castle Capital operations (trading, CRE tooling, consulting). This version retains the universal Claude Code operational patterns and re-targets them at a single product: PermitMonkey for Massachusetts.*

*Next revision triggers: major Opus release, Ch 150 of 2024 amendment, first 10 MA customers shipped.*
