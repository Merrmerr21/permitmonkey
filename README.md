# PermitMonkey

### Winner — Anthropic's Global Claude Code Hackathon "Built with Opus 4.6"

[Official announcement](https://x.com/claudeai/status/2024986294820958647?s=20)

AI-powered ADU permit assistant for Massachusetts. Upload your architectural plans and corrections letter — get back a professional response package ready for resubmission.

**Built for the Built with Opus 4.6: Claude Code Hackathon (Feb 10–16, 2026)**
**Pivoting California → Massachusetts (April 2026)** — see `PLAYBOOK.md` for strategic rationale.

### For Other Builders

If you're curious about the build process, check out `progress.md` — voice logs of the thinking throughout the hackathon while Claude was building. A raw, unfiltered look at the decision-making and problem-solving that went into this project.

The operating manual for how this project is run day-to-day now lives at `PLAYBOOK.md`. Skills live in `.claude/skills/`. Agent job descriptions in `.claude/agents/`.

### Contact

Questions? Reach out:
- X/Twitter: [@breezwoods](https://x.com/breezwoods)
- LinkedIn: [Michael Brown](https://www.linkedin.com/in/michael-t-brown-034aaa22/)

## The Problem

Massachusetts passed **Chapter 150 of the Acts of 2024** (the Affordable Homes Act) in August 2024. Effective February 2, 2025, Massachusetts General Laws Chapter 40A § 3 now allows accessory dwelling units (ADUs) **by-right** in single-family residential zoning districts statewide. Up to 900 square feet or 50% of the primary dwelling, whichever is less. No owner-occupancy requirement. No off-street parking within 0.5 miles of transit. EOHLC implementing regulation: **760 CMR 71.00**.

The Healey-Driscoll administration estimates 8,000–10,000 ADUs will be built across MA over the next five years.

But the permit process is still local. 351 cities and towns, each with their own zoning bylaw, design standards, historic districts, wetlands overlays, and submittal checklists. Contractors aren't zoning lawyers. Cities are understaffed and the bylaw updates are still rolling out. Corrections letters are inevitable.

Most rejections aren't engineering failures — they're bureaucratic: missing signatures, wrong code citations, incomplete forms, city requirements preempted by state law that haven't been updated. Every correction cycle costs weeks. Every week costs thousands.

## What PermitMonkey Does

PermitMonkey uses Claude Opus as an AI agent that reads your architectural plans, interprets city corrections letters, cross-references Massachusetts state law, and generates a professional response package.

### Flow 1: Corrections Letter Interpreter

The primary flow. A contractor uploads:
1. Their submitted architectural plans (PDF)
2. The corrections letter from the city building department

The agent then:
- Extracts and reads every page of the plans using vision
- Parses each correction item from the city's letter
- Cross-references against Massachusetts ADU law (MGL Ch 40A §§ 1A and 3 as amended by St. 2024, c. 150, §§ 7–8; 760 CMR 71.00)
- Researches city-specific municipal code via live web search (covered cities cache to local skill; uncovered cities via WebSearch → WebFetch → Chrome fallback)
- Cross-checks local bylaws against state preemption (flags requirements that are unenforceable)
- Asks the contractor clarifying questions about their project
- Generates a corrections response package: analysis report, professional scope of work, draft response letter, sheet annotations

### Flow 2: Permit Checklist Generator

A contractor enters their project address and basic info (ADU type, size, lot type). The agent researches city-specific requirements via web search, combines them with state-level ADU rules, and produces a pre-submission checklist with city-specific gotchas.

### Flow 3: City Pre-Screening (Roadmap)

A city building department uploads a permit submission. The agent reviews it against their own requirements and state ADU law, flagging missing documents, unsigned pages, and incomplete forms before a human plan checker ever touches it. This flow is not built — it's the open-source vision for how this tool could work on the city side.

### Bonus Flow: ADU Eligibility Checker (Free Tool)

A homeowner or contractor enters an MA address, lot size, and primary dwelling size. Returns eligibility verdict, max ADU size, parking requirement, and top-3 city-specific gotchas in under 10 seconds. Lead magnet for the paid corrections-interpretation service.

## Architecture

```
Browser (Next.js)
    ↓ API + Supabase Realtime
Cloud Run Server (Orchestrator)
    ↓ launches isolated sandboxes
Vercel Sandbox (Agent SDK + Claude Opus + Skills)
    ↓ reads/writes
Supabase (Database, Realtime, Storage)
```

**Why this architecture:**
- Agent runs take 10–30 minutes. Vercel serverless functions timeout at 60–300s. Cloud Run provides a persistent orchestrator process.
- Vercel Sandbox gives each job an isolated, ephemeral execution environment with file system access — needed for the Agent SDK's `claude_code` preset tools.
- Supabase Realtime pushes status updates and agent messages to the frontend without polling.

### Skills-First Design

The agent's domain knowledge comes from **skills** — structured reference files that teach Claude about a specific domain:

- **Massachusetts ADU Skill** (`.claude/skills/massachusetts-adu/`) — MGL Ch 40A §§ 1A and 3 as amended, 760 CMR 71.00 (Protected Use ADU), 780 CMR (MA State Building Code 10th Edition) essentials, EOHLC guidance, Stretch / Specialized Energy Code, dimensional summary (state floor vs. local ceiling), conflicts and preemption reasoning, and a three-file decision tree (by-right eligibility, construction type, modifiers).
- **MA City Research Skill** (`.claude/skills/ma-city-research/`) — Three-mode research (WebSearch discovery, WebFetch extraction, browser fallback). Covered cities currently: Boston, Cambridge, Somerville. Next: Newton, Brookline, Worcester, Quincy, Lowell.
- **ADU Eligibility Checker Skill** (`.claude/skills/adu-eligibility-checker/`) — Backs the free-tool funnel.
- **PermitMonkey Ops Skill** — Teaches agents how to operate the deployed system via API.

Retired California skills live in `_legacy/` for regression testing and historical reference.

### Agent Roster (see `.claude/agents/`)

| Agent | Role |
|-------|------|
| Planner (Opus xhigh) | Orchestrates, plans, synthesizes |
| PlanReader (Opus vision) | Extracts architectural plan sheets |
| CorrectionsParser (Sonnet) | Decomposes and classifies corrections |
| MALawLookup (Sonnet, advisor Opus) | State law citations — **zero-tolerance for hallucinations** |
| CityCodeLookup (Sonnet) | Local bylaw citations, preemption cross-check |
| ResponseWriter (Opus xhigh) | Produces the contractor-facing package |
| QAReviewer (Opus xhigh) | Final validation gate |

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, shadcn/ui, Tailwind CSS 4 |
| Server | Express 5, Cloud Run, Vercel Sandbox |
| Agent | Claude Opus 4.6 (4.7 upgrade path open), Agent SDK, `claude_code` preset |
| Database | Supabase (Postgres, Realtime, Storage) |
| Skills | Markdown reference files with frontmatter |
| Dev Tools | Claude Code (the entire project was built with Claude Code) |

## Project Structure

```
├── frontend/              # Next.js app (Vercel)
├── server/                # Express orchestrator (Cloud Run)
├── agents-permitmonkey/      # Agent SDK configurations
├── .claude/
│   ├── CLAUDE.md          # Project rules for Claude Code
│   ├── agents/            # Agent job descriptions (7 agents)
│   ├── agent-performance.md  # Three-strike policy tracker
│   └── skills/            # Active skills (MA-focused after pivot)
├── _legacy/               # Retired CA skills (regression reference)
├── test-assets/           # Real permit data for testing
│   ├── corrections/       # Placentia corrections letter + plans (CA, legacy)
│   ├── approved/          # Long Beach approved plans (CA, legacy)
│   └── correction-01/     # Sample agent output (CA, legacy)
├── design-directions/     # UI design exploration
├── docs/                  # Plans, research, learnings, schedule
├── AGENTS.md              # Non-Claude agent diversification mirror
├── PLAYBOOK.md            # Operating manual (see this first after README)
└── progress.md            # Voice-log build history from hackathon week
```

## Running Locally

### Prerequisites

- Node.js 20+
- Supabase project (for database + storage)
- Anthropic API key (for Claude Opus)
- Vercel account (for sandbox)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Fill in Supabase + API keys
npm run dev
```

### Server

```bash
cd server
npm install
cp .env.example .env  # Fill in API keys
npm run dev
```

## Test Data Attribution

The `test-assets/` directory contains real permit documents used for development and testing:

**Legacy California assets (retained for regression testing during the MA pivot):**
- **California ADU Handbook** (`adu-handbook-update-2026.pdf`) — California HCD. Public government document.
- **Placentia Submittal Requirements** — City of Placentia Building Division. Public government document.
- **Corrections Letter** (`corrections/2nd-Review-Corrections-1232-Jefferson-St-Placentia.pdf`) — City of Placentia plan check corrections. Public government correspondence.
- **Architectural Plans — 1232 N Jefferson, Placentia** (`corrections/Binder-1232-N-Jefferson.pdf`) — Included with permission from the project designer for demonstration purposes.
- **Architectural Plans — 326 Flint Ave, Long Beach** (`approved/FLINT-AVE-326-BADD326126-APPROVED-PLANS.pdf`) — Included with permission from the project designer for demonstration purposes.

**Massachusetts test assets:** Sourcing in progress. See `PLAYBOOK.md` §22 for sourcing paths. Will live at `test-assets/ma/` when collected.

## License

MIT — see [LICENSE](LICENSE)
