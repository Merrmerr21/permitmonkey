---
name: ai-playbook-lookup
description: Index into the project's master AI playbook at docs/master-ai-playbook.md. Load when reasoning about agent reliability math, prompt-cache discipline, generator-verifier patterns, skill-vs-MCP tradeoffs, distribution strategy (programmatic SEO, MCP directory, AEO, free-tool funnels), workflow phasing (Plan Mode → Build → Validate), context-rot management, sub-agent orchestration patterns, or production engineering practices (provenance, ground-truth evals, deterministic-infrastructure-plus-LLM split).
---

# AI Playbook Lookup

The full playbook lives at `docs/master-ai-playbook.md` (5,681 lines, ~500 KB). Do NOT read it whole. Use this index to `Read` only the relevant section.

## Section index (line ranges)

| Topic | Lines | Read when |
| --- | --- | --- |
| Slash commands & permission modes | 25–62 | Setting up workflow defaults; choosing Plan/Bypass/Auto/Edit |
| CLAUDE.md hierarchy & self-optimization | 63–98 | Designing project rules; updating directives after a mistake |
| DOE framework (Directives → Orchestration → Execution) | 99–113 | Structuring `directives/`, `agents/`, `execution/` folders |
| Context rot, /compact, session chaining | 121–185 | Long sessions; deciding when to chain vs continue |
| Format-conversion economics (Docling, pandoc) | 191–198 | Pre-processing PDFs/HTML before agent input |
| Memory layers (Managed Agents, MCP memory, Carrier File) | 221–236 | Cross-session persistence design |
| Sub-agent specialization (Researcher, Code-Reviewer, QA) | 237–260 | Picking which subagents a project needs |
| Coordination patterns (Orchestrator-Subagent, Generator-Verifier, Teams) | 261–276 | Deciding multi-agent topology |
| Agent-as-employee + three-strike termination | 287–300 | High-stakes agents; failure tracking |
| Stochastic consensus at scale (10–100 agents) | 301–316 | Game-theoretic / strategic decisions |
| MCP baseline & strategy + MCP-vs-Skill rule | 325–342 | Choosing between MCP and Skill |
| Managed Agents (cloud-hosted) | 343–408 | API endpoints, OAuth vaults, scheduled jobs |
| Managed Agents memory (filesystem-based) | 409–422 | Long-running learning agents |
| Production MCP patterns (5 patterns) | 435–492 | Shipping an MCP server |
| Workspace organization (5 rules + cleanup cadence) | 493–502 | Setting up `.claude/`, `directives/`, `active/`, `clients/` |
| Nine-phase build lifecycle | 615–634 | Mapping where you are in a project |
| Phase 2 research patterns (fan-out/fan-in, debate) | 637–650, 800–896 | Competitor / market / architecture research |
| Phase 3 Plan Mode (five canonical plans) | 651–660 | Before any non-trivial build |
| Phase 4 design loop (screenshot iteration) | 661–678 | UI/UX before code |
| Phase 5 build (Bypass Permissions, worktrees) | 679–700 | Parallel agent execution |
| Phase 6 validate (4 gates incl. ground-truth) | 701–712 | Before deploy |
| Phase 7 skills + skill-creator (evals, benchmarks) | 713–739 | Codifying reusable knowledge |
| Phase 8 deploy (smoke tests, monitoring, alerts) | 740–760 | Going live |
| Browser automation patterns | 907–924 | Scraping, listing search, interactive sessions |
| Distribution flip (engineering → distribution bottleneck) | 1383–1403 | Strategic re-prioritization at product-ready |
| MCP directory placement | 1404–1419 | Discoverability via Anthropic directory |
| Programmatic SEO at scale (10K+ pages) | 1420–1464 | Long-tail organic acquisition |
| Free tool as TOFU | 1465–1500 | Top-of-funnel design |
| Answer Engine Optimization (AEO) | 1501–1534 | Brand presence in LLM answers |
| Viral artifacts | 1535–1566 | Shareable outputs |
| Markets-of-one strategy | 1609–1625 | Niche product positioning |
| Context-as-artifact discipline | 2422–2433 | Versioning AI context separately |
| Reference-don't-embed skill architecture | 2434–2443 | Avoiding skill content drift |
| Debugging skill (six-step protocol) | 2444–2453 | Investigating bugs reliably |
| Prototype-the-spec on Managed Agents | 2454–2463 | Spec validation via prototype |
| Bespoke agents per JTBD | 2464–2475 | Replacing Zapier flows / scripts |
| Cache-prefix discipline (4-layer order) | 2492–2510 | Maximizing prompt cache hit rate |
| Deterministic infra + LLM reasoning split (Kepler) | 2559–2575 | Verifiable answers in regulated domains |
| Ground-truth evaluation pipelines | 2590–2607 | Pre-deploy regression gating |
| Provenance from day one | 2608–2619 | Compliance, audit logs, source tracing |
| Cowork five-level maturity + 6-month rollout | 2620–2653 | Enterprise / team distribution |
| Three pillars of enterprise AI transformation | 2654–2665 | Selling into firms |
| Claude Security (vuln scanning) | 2666–2684 | Replacing manual security audit |

## How to use this skill

1. Match the user's task to a row above.
2. `Read` `docs/master-ai-playbook.md` with the line range from that row only.
3. If multiple rows apply, read each range separately — never fetch the whole file.
4. If no row matches, the topic is likely outside the playbook's scope; do not guess.
