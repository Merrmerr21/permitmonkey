# The Master AI Playbook

**The Definitive Reference for Claude, Claude Code, and the Modern AI Stack**

A condensed compendium of every learning worth keeping from Anthropic engineering blogs, practitioner courses, podcast deep-dives, YouTube transcripts, and field-tested production patterns. The format is optimized for instructional density: definitions precede rules, mechanisms precede applications, and quantification is welded to the claim that requires it. Read it linearly to install a strong foundation; reference it sectionally once you know your way around.

## How to Use This Document

The numbering is historical, preserving the order in which each pattern entered the canon. Letter-suffixed sections (e.g., §2B, §10D) are extensions to a parent topic added in later revisions. Cross-references use the `§NN` notation. Imperative verbs ("run," "use," "set") indicate operational instructions. Numerical thresholds always carry units. Every example is generic — replace bracketed placeholders with project-specific values.

The document is organized in nine parts. Part 1 (Foundations) covers the global setup, slash commands, permission modes, CLAUDE.md hierarchy, sub-agents, MCP, skills, deployment, and security. Part 2 (Workflow Phasing) covers the canonical execution order — Setup → Research → Plan → Design → Build → Validate → Skills → Deploy → Optimize. Part 3 (Advanced Patterns) covers fan-out/fan-in, stochastic consensus, model-chat debate, agent teams, auto-research, and parallel development with git worktrees. Part 4 (Production Surfaces) covers Managed Agents, Cowork, Routines, Plugins, and the connector directory. Part 5 (Selling AI Workflows) covers the agency sales motion, the Overhang Pitch, and pricing frameworks. Part 6 (AI-Powered Marketing) covers the design and content stack — Claude Design, Paper, Pomelli, Remotion, HumbleLytics. Part 7 (Distribution) covers the seven mechanics for shipping AI products — MCP servers as sales teams, programmatic SEO, free-tool funnels, AEO, viral artifacts, niche newsletters, and AI content repurposing. Part 8 covers high-ROI additions — PM principles on the AI exponential, code review as an agent team, skill-creator evals and regression testing, notification hooks, status-line customization, the distillation prompt, direct Anthropic API patterns, the Conductor and Codex MCP diversification stack, and the cleanup cadence. Part 9 covers production engineering patterns — context-as-artifact discipline, reference-don't-embed skill architecture, prompt-caching cache-prefix discipline, content engineering, ground-truth evaluation pipelines, Cowork enterprise deployment, Claude Security, and the `/ultrareview` three-tier review framework.

---

# PART 1 — FOUNDATIONS

Configure these once before any project-specific work. Revisit quarterly as Anthropic ships changes.

## §1 — First-Time Setup

Install Claude Code with a single command per platform. macOS, Linux, and WSL: `curl -fsSL https://claude.ai/install | sh`. Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`. Authenticate by running `claude` and selecting the Pro, Max, Team, or Enterprise subscription path.

The recommended IDE is Antigravity (anti-gravity.google), Anthropic's purpose-built editor. Supported alternatives are VS Code with the Anthropic-verified Claude Code extension and JetBrains products with the Claude Code plugin from the JetBrains Marketplace. Inside the IDE, enable "Claude Code Allowed Dangerously Skip Permissions" via Extensions → Claude Code → Settings, and set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` to enable agent teams. The redesigned desktop application from claude.com/download is purpose-built for parallel sessions; full details appear in §14D.

## §2 — Essential Slash Commands

Slash commands operate on the active session. The frequency-ordered set:

`/init` scans the workspace and generates a local CLAUDE.md. Run it first inside any new project folder. `/context` displays a token breakdown by category; consult it before any large prompt. `/usage` displays the broader Claude Code consumption breakdown and informs whether to compact, clear, or continue. `/compact` compresses the conversation; trigger it at roughly 80% context occupancy. `/compact` accepts a steering hint — for example, `/compact preserve all API endpoints and database schema` — which controls what survives the summarization. `/clear` wipes the conversation entirely; use it when switching to an unrelated task. `/rewind` (or double-Esc) returns to a prior message and re-prompts; this is structurally superior to typing "that didn't work, try X" because the dead branch never accumulates the re-read tax (§71). `/cost` reports the running dollar spend and is useful for monitoring agent teams. `/model` switches between Opus, Sonnet, and Haiku; assign Sonnet to research subagents and Opus to synthesis. `/permissions` provides per-tool access control to lock down dangerous tools in production code. `/status line` customizes the terminal status bar; the recommended layout adds a token-usage progress bar, the active model, and the current Git branch. `/insights` runs subagents across the conversation history, intended for invocation after roughly 50 sessions, with the output fed back into the global CLAUDE.md. `/schedule` creates cron-style routines that execute on Claude Code's web infrastructure; existing `/schedule` jobs are now Routines (§10D).

The status line setup prompt: `/status line — Update my status line so it includes a loading bar showing tokens used out of total context, the current model, and the current git branch.`

## §2B — Opus 4.7 Effort Levels

Opus 4.7 replaces fixed thinking budgets with a five-tier effort system. The default `xhigh` sits between the legacy `high` and `max` tiers and applies to roughly 90% of work.

The five tiers, ordered by cost and capability: `low` for cost-sensitive, tightly scoped work — less capable on hard tasks but still outperforms Opus 4.6 at the same effort; `medium` for routine coding and simple refactors with a balanced cost-quality trade-off; `high` for concurrent sessions where the operator wants to spend less with minimal quality loss; `xhigh` (default) for most coding and agentic work — APIs, schemas, migrations, code review — delivering strong autonomy without runaway tokens; `max` reserved for genuinely hard problems and eval-ceiling tests, applied deliberately because of diminishing returns and overthinking risk.

Effort can be toggled mid-task. Existing Claude Code users who never manually set effort auto-upgrade to `xhigh`. Effort assignment by task type: long-form synthesis and consensus runs at `xhigh` to `max`; routine coding at `xhigh`; programmatic SEO page generation across thousands of pages at `low` or `medium`; stochastic consensus at `high` per agent (cost discipline, since N agents fan out); production code review at `xhigh`; simple file manipulation at `low`.

## §2C — `/btw` Side-Channel Overlay

`/btw` opens a quick overlay for questions that do not enter the main conversation history. Ask a clarifying question, read the answer, return to the main thread without polluting context. Use it for syntax lookups, API endpoint verifications, and definitional questions whose answers will not change subsequent work in the main thread. The anti-pattern is using `/btw` for questions whose answers should genuinely inform the main work — those belong in the main thread.

## §2D — `/rewind` Summarize-From-Here

Within the `/rewind` menu (accessed via double-Esc), the "summarize from here" option produces a handoff note from the current Claude iteration to the iteration that will resume after the rewind. Use it when rewinding to fix a wrong approach but the lessons from the dead branch should survive: Claude summarizes what was learned, the rewind executes, and the summary becomes the next prompt. Pair with the Session Handoff Protocol (§74) for the longer-form version when crossing the 120K threshold.

## §3 — Permission Modes

Permission mode controls how aggressively Claude executes file changes. Toggle via the bottom-left button in the GUI or `/permissions` in the terminal. Six modes are available.

**Ask Before Edits** prompts before every file change; reserve it for high-risk production code or compliance-sensitive content. **Edit Automatically** auto-edits existing files but asks before creating new ones; this is the general-development default. **Plan Mode** is read-only — Claude researches, reads, and reasons but makes no changes — and should precede any complex build. **Bypass Permissions** grants full autonomy to edit, create, and delete; use it for trusted tasks where speed matters and the operator is observing. **Auto Mode** is a middle path: a safety classifier evaluates each tool call before execution, allowing safe actions through and blocking destructive ones (mass file deletion, data exfiltration, malicious code execution); when blocked, Claude redirects to a different approach. **Delegate** is the agent-team-lead mode that can manage teams but not edit directly.

The recommended flow: start in Plan Mode, review the plan, switch to Auto Mode (if walking away) or Bypass Permissions (if observing) to execute.

Auto Mode is in research preview for Claude Code Max users. Toggle it with Shift+Tab after enabling via `claude --enable-auto-mode` (or in desktop and VS Code, Settings → Claude Code → Toggle Auto Mode). It is available on the Team plan now, with Enterprise and API rolling out, and works with both Sonnet 4.6 and Opus 4.7. It may have small impact on token consumption and latency. Anthropic recommends running it in isolated environments. Administrators can disable it via managed settings using `"disableAutoMode": "disable"`. Auto Mode is especially well suited to Opus 4.7 long-running tasks where full context is provided up front; because each user turn on 4.7 carries reasoning overhead, removing unnecessary check-ins compounds savings. Claude Code can also create its own hook-based notifications without setup ("Please play a sound when you're done with this task. Create whatever hook you need.").

The mode-selection rule: Bypass Permissions for quick trusted tasks under direct observation; Auto Mode for long tasks where the operator is absent for thirty minutes or more; Ask Before Edits for high-stakes production code or anything a regulator might read; Plan Mode for read-only planning and research.

To bypass all permission prompts globally on Windows: `'{"permissions":{"defaultMode":"bypassPermissions"}}' | Out-File "$env:USERPROFILE\.claude\settings.json" -Encoding utf8`. Restart the IDE.

## §4 — Global CLAUDE.md

CLAUDE.md is injected at the top of every conversation before the first user message. It sets the trajectory of the entire session: a one-degree heading error at departure becomes a hundred-mile miss across the ocean. Make it precise.

The file resolves in three layers, in order of precedence: Enterprise `~/.claude/CLAUDE.md` (managed, where applicable), Global `~/.claude/CLAUDE.md` (personal, applies to every workspace), and Local `.claude/CLAUDE.md` (per-project, workspace-specific).

A well-formed global CLAUDE.md includes seven blocks. **Profile** identifies the operator (role, domain, current ventures) so Claude can default to domain-appropriate language and formatting. **Standard interaction rules** are absolute behavioral constraints — for example, never delete `.env` files; do not over-explain or add unrequested improvements; use a single write call rather than many sequential edits; do not fetch well-known sites unnecessarily; read API documentation before attempting to use an unfamiliar platform, falling back to Chrome DevTools MCP if HTTP access fails; when instructed to "visualize app" or "open it," actually open Chrome rather than describing it; reason extensively in the thinking channel and keep output concise. **Opus 4.7 calibration** fixes the operating defaults: effort defaults to `xhigh`; fixed thinking budgets are not supported on 4.7; explicit cues steer reasoning depth ("Think carefully and step-by-step before responding; this problem is harder than it looks" pushes thinking up; "Prioritize responding quickly rather than thinking deeply. When in doubt, respond directly" pushes it down); 4.7 is less verbose, calls tools less often, and spawns fewer subagents by default — for aggressive search, fan-out, or parallel execution, specify the behavior explicitly. **Task-specification discipline** enforces the delegation model: treat Claude as a capable engineer being delegated to, not as a pair programmer guided line-by-line; specify intent, constraints, acceptance criteria, and relevant files in the first turn; batch all clarifying questions; ambiguous prompts spread across many turns reduce both token efficiency and quality. **Token conservation** rules: prefer single write calls over sequential edits; read documentation before coding to avoid retry loops; assign Sonnet to research subagents and reserve Opus for synthesis; prefer the Advisor Tool (§9B) to manual Opus subagents for API pipelines; compress learnings into CLAUDE.md rather than rediscovering them; one minute of planning saves ten minutes of building. **Self-Annealing Protocol** (§7C) is mandatory across every CLAUDE.md. **Lab Notes — What Not To Do** is a running log at the bottom of the file that auto-updates when mistakes are logged.

## §5 — CLAUDE.md Best Practices

Run `/init` first in any new folder. Use bullet points and short headings for high information density. Place critical guardrails at the top of the file: Claude exhibits primacy bias — beginnings are remembered best, then endings, with the middle the weakest. Review and prune CLAUDE.md periodically as living technical debt. When Claude makes the same mistake two or three times, instruct it to add the lesson to CLAUDE.md so a fresh instance does not repeat it. Use `@include` to reference other files rather than pasting them in.

Avoid four anti-patterns. Do not dump entire API documents or style guides — those belong in skills, which load on demand at roughly 60 tokens versus thousands. Do not write vague rules ("be smart," "make no mistakes"). Do not exceed roughly 500 lines. Do not paste raw voice transcripts directly — compress them through a cheaper model first.

To find current high-ROI patterns, query Grok on Twitter/X for the last month of CLAUDE.md writings from power users.

Two standard additions belong in every local CLAUDE.md. The Diversification rule mirrors any update into a parallel `agents.md` formatted for non-Claude coding agents (Cursor, Cody, Aider) so a provider outage does not halt operations. The running "Lab Notes — What Not To Do" section auto-updates as mistakes are logged.

## §6 — Rules Folder Structure

Split CLAUDE.md into independently editable rule files under `.claude/`. The top-level `CLAUDE.md` becomes a deliberately short high-level project summary. The `rules/` folder holds `workflow.md` (planning, building, verification), `tech-defaults.md` (stack preferences and API patterns), `design-rules.md` (UI/UX standards), and `security.md` (auth, RLS, key management). The `agents/` folder holds named subagent prompts: `code-reviewer.md`, `researcher.md`, `qa.md`. The `skills/` folder holds task-specific skill packs.

Benefits of the split: workflow can evolve without touching design rules; collaborators get scoped access to style rules while workflow control stays centralized; bloat surfaces immediately when one rule file grows oversized.

## §7 — Self-Optimization Meta-Prompts

Three meta-prompts run after every major task and embed in every CLAUDE.md.

**Meta-Prompt #1 (permanent, in CLAUDE.md):** "When you have made a mistake, update CLAUDE.md with a running log of things not to try next time, formatted as research notes for future Claude instances, all under 'Lab Notes — What Not To Do' at the bottom of the file."

**Meta-Prompt #2 (after any major task):** "How could you have arrived at these conclusions and done everything I just asked you to do faster and for fewer tokens? Save your answer in the local CLAUDE.md under 'User Preferences.'"

**Meta-Prompt #3 (after `/insights`, ~50+ sessions):** "Take this insights file. Distill the obvious design patterns and recurring miscommunications into high-information-density snippets ready to paste into the global CLAUDE.md, optimizing for token economy and avoidance of common Claude mistakes."

The local optimization loop has four steps: plan the feature; let Claude build it (with failures and successes); compile all learnings; update the local CLAUDE.md. Each cycle gets faster — roughly 0.9× → 0.8× → 0.7× the original time. The global optimization loop runs after hundreds of local runs: invoke `/insights`; distill the output into high-density global CLAUDE.md updates; manually review (human-in-the-loop is critical because compounding AI errors degrade quality); add the high-ROI bullets; repeat periodically.

## §7B — DOE Framework: Directive · Orchestration · Execution

DOE is a folder structure plus a system prompt drawn from Nick Saraf's Agentic Sells course. It narrows the agent's total range of possible outputs to a tightly bounded operating envelope — the bowling-guardrails analogy — and achieves a 2–3% error rate on business functions versus ~20% unconstrained.

**Layer 1 — Directives (the WHAT).** SOPs written as natural-language markdown files in a `directives/` folder. One directive per workflow: `scrape_leads.md`, `generate_om.md` — never `run_business.md`. Directives contain no code, so any employee can read them. Filenames are descriptive because the agent routes by filename. Each directive specifies goals, inputs, tools, expected outputs, and edge cases. Related directives may sit under umbrella directives (e.g., `run_onboarding_flow.md` referencing `scrape_leads.md`, `generate_proposal.md`, `send_email.md`).

**Layer 2 — Orchestration (the WHO).** The AI agent itself, acting as a project-manager nexus. It reads directives, makes runtime routing decisions, and calls tools. It replaces the human operator who used to wire n8n / Zapier nodes manually. With DOE, the agent ensures work completes according to directives but retains flexibility to handle breakdowns creatively. Subagents handle documentation flows that log changes for future instances.

**Layer 3 — Execution (the HOW).** Python scripts stored in `execution/` folder, each handling one job. Deterministic (same input → same output every time). Reusable across multiple directives — `send_email.py` invoked by both `scrape_leads.md` and `generate_proposal.md`. Scripts may include AI calls but only wrapped in predictable input/output contracts (low temperature, structured output). Unit-testable from the CLI: `python scrape_zillow.py --address "123 Main St" --radius 2`. Version-controllable. Scripts are not AI — they either work correctly or throw a clear error.

DOE works because pre-built tools replace construction on the fly (recipe versus inventing a new dish every time). When enough atomic scripts exist, multiple directives share the same tools — a force multiplier. Any non-technical employee can read and improve directives in plain English. The agent knows exactly what to expect from each execution script — no ambiguity.

The configuration files: `claude.md` / `agents.md` / `gemini.md` / `cursor.md` are the system prompts injected at session start; they explain the DOE structure to the orchestrator and define error handling. `.env` holds all API keys and credentials, never hardcoded. Maintain all model-specific config files simultaneously to switch IDEs and models freely.

The reference deployment (from Agentic Sells): Nick introduced DOE to a $2M/yr dental marketing company. He fed their entire knowledge base into Claude Code. Within fifteen minutes, most SOPs became agentic workflows. The director and managers now run 90% of economically valuable work through the IDE. Non-technical staff read and improve directives in plain English.

## §7C — Self-Annealing Protocol

The four-step self-annealing loop, drawn from Agentic Sells Chapter 25: an error fires; the agent diagnoses where and why it failed; the agent attempts the fix, trying at least three approaches before escalating; and the agent updates both the execution script and the directive to prevent recurrence. Add the protocol verbatim to every CLAUDE.md so failures route into permanent learning rather than ephemeral frustration. The standing instruction is to try super hard before escalating.

The protocol's economic logic: workflows get stronger over time, unlike n8n/Zapier flows that break silently when an upstream API changes. After approximately thirty runs of the same directive with self-annealing active, the workflow is battle-hardened.

## §8 — Context Management (1M Context + Context Rot)

The Claude Code context window is 1,000,000 tokens. The fixed overhead before the first message totals: system tools at ~17K, system prompt and CLAUDE.md plus rules at ~5–10K, MCP tools at a variable 5–20K (they load every message regardless of use, so be selective), `memory.md` at ~100 tokens, and ~60 tokens per registered skill (the body loads on demand). The remaining ~950K is the working space.

**Context Rot** is the central new concept. Model performance degrades as context grows because attention spreads across more tokens and older irrelevant content distracts from the current task. Possessing 1M tokens does not justify using 1M tokens; peak performance lives in the 10K–50K range for most tasks. Critical implication: the model is at its least intelligent point when autocompact fires, so always invoke `/compact` proactively with a description of upcoming work; never wait for autocompact.

After any Claude turn, five moves are available, not one. Continue (the default) sends another message in the same session. `/rewind` (double-Esc) jumps to a prior point and re-prompts. `/clear` starts a fresh session, ideally with a brief distilled from what was just learned. `/compact` summarizes the session and continues on top of the summary. A subagent (§9) takes the next chunk of work into a clean isolated context.

The decision matrix: continue when the same task remains relevant and everything in context is load-bearing; rewind when Claude went down a wrong path — the rewind preserves the useful file reads while dropping the failed attempt; `/compact` with a hint when the session is bloated mid-task with stale debugging or exploration; `/clear` when starting a genuinely new task; a subagent when the next step generates lots of intermediate output but only the conclusion is needed.

Rewinding beats correcting because telling Claude "that didn't work, try X" leaves the failed attempt in context and the re-read tax compounds (§71); rewinding deletes the dead branch entirely. Pair `/rewind` with the "summarize from here" option (§2D) so Claude leaves a handoff note. The default rule for new sessions: "new task = new session," with one exception — writing docs for a feature just implemented, where a new session would re-read everything redundantly.

`/compact` and `/clear` differ in who chooses what survives. `/compact` lets Claude summarize (lossy, low effort, steerable with hints — `/compact focus on the auth refactor, drop the test debugging`). `/clear` forces the operator to write the brief; more work, but the surviving context is exactly what was decided to be relevant.

Bad autocompact occurs when the model cannot predict where work is going. Example: a long debug session autocompacts after the bug is fixed; the summary focuses on the debug path; the next message refers to a warning that was dropped from the summary. With 1M context, runway exists to `/compact` proactively with the next direction included in the hint.

Strategies, ordered by impact: proactive `/compact` with direction hints; rewind over correction; plan before build (front-load research in Plan Mode, build in Bypass or Auto Mode); skills over MCPs (skills at ~60 tokens on demand vs MCPs at 1–5K+ always); subagents for conclusion-only work, applying the §9 mental test; Sonnet subagents for research at roughly 50× cost savings; Advisor Tool for API pipelines at 11.9% cost reduction; proactive monitoring via `/context` and `/usage` before big prompts.

## §8B — Adaptive Thinking

Fixed thinking budgets are not supported on Opus 4.7. The model uses adaptive thinking: thinking is optional at each step, and the model decides when to invest thinking tokens based on context. Where Opus 4.6 with a 32K thinking budget would think hard on every turn regardless of need, Opus 4.7 skips thinking on easy steps and invests on hard ones. Across an agentic run this compounds into faster responses and better UX, and 4.7 is also less prone to overthinking than 4.6.

To force more thinking, prepend: "Think carefully and step-by-step before responding; this problem is harder than it looks." To force less thinking, prepend: "Prioritize responding quickly rather than thinking deeply. When in doubt, respond directly."

Push thinking up on financial assumptions for high-value decisions, market positioning sections for institutional audiences, strategy parameter changes, tax and legal document review, and any consensus synthesis step. Push thinking down on repetitive CRUD, batch renders, programmatic page generation, simple file renames or imports or config edits, and code-review pass-throughs on low-stakes PRs.

## §70 — Fresh-Session Overhead Audit

Run `/context` before sending the first message in any new session. Tokens are already burning from the system prompt (~5–10K), the global plus local CLAUDE.md, MCP tools (5–20K+ if the loadout is heavy), skills front matter (~60 tokens per skill registered), and `memory.md` plus always-loaded rules. The practitioner benchmark: fresh sessions routinely consume 40–60K+ tokens before the first user prompt with a heavy MCP loadout; one report measured 62K at t=0.

Run the audit weekly. If the baseline exceeds 25K, the session is bloated. The remediation: disable MCPs not used in the current project (per-project, never globally); prune CLAUDE.md toward the 200-line / ~2K-token ceiling; move specialized instructions into skills (load-on-demand) or `rules/` (routed) rather than the top-level CLAUDE.md.

## §71 — The Compounding Re-Read Cost

Claude re-reads the entire conversation on every turn, so per-message cost compounds rather than adds. Turn 1 costs about 500 input tokens for the prompt plus system overhead. Turn 10 costs about 5,000 because Claude is re-reading all nine prior turns each time. Turn 30 costs about 15,000 — roughly 31× turn 1.

A developer audit of 100+ message sessions found that approximately 98.5% of all tokens consumed were re-reads of prior conversation, not new work.

This metric explains three rules: manual `/compact` at 60% beats autocompact at 95% because manual compaction also kills future re-read costs; `/rewind` after a failed attempt beats correction because rewind deletes the re-read tax on the dead branch forever; and session chaining (§75) is dramatically more efficient than one mega-session.

## §72 — Prime Time and the 120K Discipline Threshold

The first 0–20% of a session is **prime time**: CLAUDE.md is fresh, attention has not dispersed, and no failed attempts or stale reads have accumulated. Prime time must not be spent on trivial setup or chitchat.

The **120K threshold** — about 12% of the 1M window — is the voluntary reset trigger. The number maps to the "60% of 200K" old discipline that produced reliably good results. Pre-emptive reset locks in peak-quality output before context rot kicks in. Crossing 120K with no plan is the single most common path to a bloated session.

The exceptions: do not interrupt mid-generation of a long artifact; do not cut off a large test suite producing meaningful intermediate results; do not abandon a plan that explicitly needs the accumulated context.

## §73 — Accuracy Degradation Statistics

Two numbers belong in muscle memory. **Retrieval accuracy** drops from 92% at 256K tokens to 78% at 1M tokens — filling the window measurably degrades the model's ability to find what it needs inside that window. **Thinking depth** dropped 67% as sessions lengthened across a sample of 18,000 thinking blocks in 7,000 sessions, while "edit without reading first" rose from 6% to 34% over the same range.

Application: any high-stakes task — financial validation, strategy synthesis, client deliverable — must start in a fresh session under 50K tokens, never midway through a long session.

## §74 — Session Handoff Protocol

The Session Handoff Protocol is a higher-ROI alternative to `/compact`, implemented either as a custom slash command (`/session-handoff`) or a reusable prompt template. Fire it at the 120K threshold or when finishing a meaningful chunk of work that warrants a clean reset.

The handoff document covers eight fields. **Where We Started** states the original task in one sentence. **Decisions Locked** lists the decisions and their rationale. **What Shipped** lists files created or modified, plus tests passing as X/Y. **Key Files for Next Session** lists each file with its current state. **Running State** documents environment, flags, branches, deployment. **Verification Deferred** captures what needs checking but was not checked. **Open Questions** captures anything unresolved. **Pick Up From Here** is one paragraph specifying what the next session does first.

The usage pattern: prompt Claude to generate the handoff using the template; copy the result; `/clear`; paste the handoff as the first prompt of the new session; close that prompt with "Confirm you understand and give me the next action."

The handoff outperforms `/compact` because the model compacts at its least intelligent point (end-of-session rot), whereas the handoff is generated while Claude is still in reasonable shape, is structured rather than free-form, and starts the new session with 0% rot.

## §75 — Session Chaining (Assembly Line Pattern)

Any project expected to consume more than 200K tokens should run as a chain of specialized sessions, not a single mega-session. The four stages: **Discovery** on Opus 4.7 high or Sonnet, producing a research summary; **Planning** on Opus 4.7, producing an implementation plan; **Implementation**, mixing Sonnet with Opus synthesis, producing the code or deliverable; **Review** on Opus 4.7 max or a multi-agent run, producing QA and sign-off.

Between sessions, only the artifact carries over — the doc, the plan, the code — never the conversation. Each session starts clean, at prime time, with only the information it needs. Stages 1–2 should rarely exceed 80K tokens each; stage 3 is the long one and should be subdivided further if it exceeds 300K.

## §76 — Format Conversion Economics

Pre-converting inputs to markdown is a high-ROI habit. The token reductions: HTML → Markdown drops roughly 90% by stripping layout, styles, scripts, and metadata; PDF → Markdown drops 65–70% by stripping layout, images, and font encoding; DOCX → Markdown drops about 33% by stripping formatting wrappers. A 40-page PDF therefore consumes the same context as roughly 130 pages of markdown — pre-conversion fits about 3× more content in the same window.

The tools, ranked by capability: Docling (CLI, handles PDF, DOCX, HTML, preserves tables and structure) is primary; pandoc is the battle-tested fallback; `pdftotext -layout` is the quick option when Docling is overkill.

Do not pre-convert when the document must be reviewed visually (rasterize the relevant pages instead), when it is a filled form (use field extraction), or when it is scanned (OCR first).

## §77 — Context-Reduction Ecosystem

A community-built compression toolkit sits one tier below the official Anthropic features. Rust Token Killer is a Rust CLI that strips boilerplate from large codebases before feeding them to Claude. Context Mode pre-processes prompts to remove redundant whitespace, repeated citations, and stale comment blocks. Token Savior is a lightweight statistical compressor for large markdown files. None of these tools replaces `/compact` or the Format Conversion Economics rule; they sit alongside as auxiliary trim layers when working at the edge of a session budget. Reach for them only when an audit per §70 shows MCP and CLAUDE.md are already lean. Premature compression of prose Claude needs to read carefully degrades quality more than it saves tokens.

## §78 — Session Budget and Time-to-Reset Strategy

Treat the session limit as a visible, active variable in the workflow, not a constraint noticed only on impact. Keep the limit visible on the desktop app; on terminal, surface the percentage in the status line.

The strategic rules. With less than 20% of the session remaining and more than an hour to reset: pause heavy work; do light admin or doc review (or take a walk). With less than 20% and under thirty minutes to reset: stop entirely — the reset will unlock more than grinding can save. With more than 60% remaining and over an hour to reset: run heavy jobs — multi-agent runs, big refactors, consensus runs. At 30–60%: normal operations, but do not start a new big task. With more than 60% remaining and under thirty minutes to reset: exploit the window — fire stochastic consensus, run the full benchmark suite, spin up agent teams; the refresh is imminent.

The anti-pattern: the "I'll just push through" mindset when low. Quality degrades (§73), output per token drops, and rushed compaction can corrupt the work.

## §79 — The I/O Ratio Diagnostic

Track input versus output tokens per project. Under normal workflow, output exceeds input meaningfully because Claude is generating code, docs, and analysis rather than just reading. The red flag is a project where input ≫ output over a 7-day window. The signals: too much reference material loaded per turn; CLAUDE.md or rules bloat; MCP tools returning excessive noise; re-reading large files instead of using targeted views; or session re-read tax (too many long sessions, not enough chaining). The fix is a 1–2 hour cleanup of CLAUDE.md, MCP loadout, and session patterns; the payback is often 10× in the next week.

## §80 — Output Tokens Reality Check

Output tokens cost roughly 5× input tokens at Anthropic's pricing. The intuition that "tell Claude to be concise" should save money is wrong, because the vast majority of output tokens in agentic work are invisible — they are tool calls, file writes, test runs, and intermediate reasoning steps. Asking Claude to respond in one sentence does not change any of that.

The four levers that actually reduce output cost: route high-volume sub-tasks through Sonnet or Haiku and reserve Opus 4.7 max for synthesis; use `/rewind` instead of corrections (which kills output on the dead branch); make targeted edits via `str_replace` rather than full file rewrites; route exploratory "what if" work to subagents so only the conclusion enters main context. Aggressive "be terse" instructions are fine for chat UX but are not a token-saving strategy.

## §87 — Carrier File: Portable Plain-Text Context

The Carrier File is a plain-text file pasted into any AI tool to restore context — a zero-dependency cousin of the shared MCP memory server (§86).

The structure is short by design. A Carrier header with the project name and last-updated date, followed by Identity (role and goals), Active Work (three bullets of current activity), Decisions Locked (top five decisions that should not be re-litigated), Known Failures and Dead Ends (what has been tried so the next AI does not repeat them), and Next Action (one sentence).

Paste the carrier as the first message when moving between Claude, ChatGPT, Gemini, or different Claude Code sessions. Update as work progresses. The carrier complements but does not replace CLAUDE.md: CLAUDE.md is persistent project rules; the carrier is a session-state snapshot.

## §86 — Shared MCP Memory Server Across IDEs

A single MCP memory server can be exposed to Claude Code, Cursor, and Windsurf simultaneously. Each tool reads and writes to the same memory layer, so switching IDEs no longer loses context. This matters when multiple operators collaborate on the same codebase from different tools, or when one operator switches between IDEs depending on task.

The implementation: self-host an MCP memory server (mem0, OpenBrain-style, or Anthropic's managed memory if eligible); expose it to Claude Code via the standard MCP config and to Cursor via its MCP support; have each session begin by reading the project's memory slice and end by writing updates.

The trade-off is roughly 1–3K tokens added to baseline context per session for the memory payload — worth it for projects with cross-tool or cross-person workflow. See §87 (Carrier File) for the zero-dependency alternative.

## §9 — Sub-Agents

A subagent is a child Claude instance with its own isolated context. Subagents perform work and return only a summary, keeping the parent's context clean.

The practitioner heuristic: stick to two subagent types per project. Research subagents handle context-heavy tasks and isolate 100K+ tokens from the parent. Documentation subagents handle post-run logging and directive updates.

The three essential subagents in `.claude/agents/`: **RESEARCHER** (Sonnet 4.6, with `web_fetch`, `web_search`, `bash`, `read`) for deep research without polluting parent context; **CODE-REVIEWER** (Sonnet 4.6, with `read`, `grep`, `glob`) for review with zero context bias; **QA** (Sonnet 4.6, with `bash`, `read`, `write`) to generate and run tests.

The probability math is sobering. Three subagents at 95% reliability each produce 0.95³ = 85.7% end-to-end. Ten produce 0.95¹⁰ = 59.9%. Fifty produce 0.95⁵⁰ = 7.7%. The case for tight subagent design at scale is mathematical, not stylistic.

The Anthropic mental test for whether to spawn a subagent is one question: will I need this tool output again, or just the conclusion? If just the conclusion, use a subagent — the intermediate tool noise stays in the child's context, and only the final report returns.

Claude Code auto-spawns subagents, but Opus 4.7 spawns them less often by default, so explicit invocation is required. Useful patterns: "Spin up a subagent to verify the result of this work based on the following spec file"; "Spin off a subagent to read through this other codebase and summarize how it implemented the auth flow, then implement it yourself in the same way"; "Spin off a subagent to write the docs on this feature based on my git changes." For agentic pipelines, specify when to fan out: "Spawn multiple subagents in the same turn when fanning out across items or reading multiple files. Do not spawn a subagent for work you can complete directly in a single response."

The benchmark figure: in Anthropic's research evaluations, sub-agents outperform single-agent Opus by 90%+ on research-style tasks because each subagent specializes in a slice and the synthesizer gets clean inputs.

## §9B — Advisor Tool: Sonnet + Opus Pairing

The Advisor Tool, released April 9, 2026, lets Sonnet or Haiku run a task end-to-end and consult Opus on hard decisions. One API parameter, no orchestration logic. The configuration uses `model="claude-sonnet-4-6"` as the executor with a tool of `type: advisor_20260301`, `name: advisor`, `model: claude-opus-4-7`, and `max_uses: 3`. The beta header `anthropic-beta: advisor-tool-2026-03-01` is required.

The measured results: Sonnet plus Opus advisor delivers +2.7% on SWE-bench Multilingual versus Sonnet alone, with an 11.9% cost reduction per agentic task. Haiku plus Opus advisor doubled the BrowseComp score at 85% less cost than Sonnet solo.

The Advisor Tool is the official version of the V3.3 manual pattern of routing research to Sonnet subagents and synthesis to Opus. Replace manual orchestration with a single API parameter.

## §9C — Multi-Agent Coordination Patterns

The April 10, 2026 Anthropic Engineering blog ships official guidance on five coordination patterns. The critical principle: start with the simplest pattern that could work, watch where it struggles, evolve from there. Choose patterns based on what fits the problem, not what sounds sophisticated.

**Generator-Verifier.** A generator produces output, a verifier evaluates against criteria, and the loop runs until pass or max iterations. Best for quality-critical output with explicit evaluation criteria — code generation, compliance, fact-checking, document section generation against a quality rubric. The verifier requires explicit criteria, never just "check if good." Max iteration limits with fallback to human escalation are mandatory.

**Orchestrator-Subagent.** One lead agent plans, delegates, and synthesizes — the pattern Claude Code itself uses, with the main agent writing code while subagents search codebases. Best for clear task decomposition with bounded subtasks, including any pipeline that dispatches a sequence of named specialists. Weakness: the orchestrator becomes an information bottleneck and details are lost in handoff summarization.

**Agent Teams.** A coordinator spawns persistent worker agents that stay alive across many assignments and accumulate context and domain specialization over time. Best for parallel, independent, long-running subtasks like codebase migrations or multi-property analysis. Weakness: worker independence is critical — if one worker's output affects another, neither is aware.

**Message Bus.** Agents publish and subscribe to events through a shared communication layer. Best for event-driven pipelines with a growing agent ecosystem — deal-pipeline alerts, cloud monitoring, webhook routing. Weakness: tracing and debugging are harder than sequential orchestration; silent failures occur if the router misclassifies.

**Shared State.** Agents coordinate through a persistent store (database, filesystem, document) with no central coordinator. Best for collaborative research where agents build on each other's discoveries — fan-out / fan-in research, stochastic consensus synthesis. Weakness: reactive loops can burn tokens indefinitely without termination conditions like a time budget or convergence threshold.

The default for most use cases is Orchestrator-Subagent. Evolve toward other patterns as specific needs become clear. Production reality is hybrids: Orchestrator-Subagent overall with Shared State for collaboration-heavy subtasks; Message Bus for event routing with Agent-Teams-style workers handling each event; Generator-Verifier wrapped around any other pattern as a quality gate.

## §9D — Seeing Like an Agent (Tool Design Philosophy)

The April 10, 2026 Anthropic Engineering essay's principle: design tools shaped to the agent's abilities, not to human workflows. The math-problem analogy makes the point. Paper is the minimum but limited by manual calculation. A calculator is better but requires familiarity with the advanced options. A computer is most powerful but requires coding ability. The right tool depends on the problem-solver's skill set, and the same is true of agents.

Claude Code's AskUserQuestion tool went through three iterations before landing. Adding questions to ExitPlanTool confused Claude with dual purposes. Modifying the markdown output format produced output Claude could not reliably generate. The dedicated AskUserQuestion tool with structured output worked well, and Claude "liked" calling it.

Four design principles emerge. If the model cannot reliably use a tool, the tool design is wrong, not the model. Iteratively read agent outputs, experiment with parameters, observe the results. Structured output via tools is more reliable than format instructions in prompts. Tools should compose across the SDK, CLI, and skills.

Application: when building any agent pipeline, design each agent's tools to match what that agent does. Do not give an Ingestion agent the same tools as a QA agent. Each agent's tool surface should reflect its narrow specialization.

## §83 — Digital Employee / Org Chart Mental Model

Stop framing multi-agent systems as tools; reframe them as employees with defined roles. Every agent gets a named persona, a role, and a scope. Every agent gets a written job description — a directive file covering what it does, what it does not do, the handoff protocol, and the escalation path. The orchestrator is the manager: it coordinates, but it also fires (per §84) and hires (spawning new specialists) as needed. Track KPIs per agent — success rate, false-positive rate, token cost, average latency.

Naming conventions force clarity. "Avery (data ingestion)" forces an explicit scope; "the data agent" does not. Treating agents like employees also surfaces design defects faster: if a JD reads as "do everything related to property analysis," the scope is too broad and the agent will fail.

## §84 — Three-Strike Termination Policy

Observed at production AI companies and across Agent Madness submissions: hallucinating agents are fired after three strikes. Track per-agent counts in `.claude/agent-performance.md`, one row per agent, updated after each run. The tracked fields are hallucination count (output contradicts source data), directive violations (agent acted outside scope), and failed handoffs (downstream agent could not use the output).

Strike 1 is a logged warning. Strike 2 puts the agent in a sandbox where output is compared against ground truth before acceptance. Strike 3 disables the agent for the project and triggers a CLAUDE.md and directive review, with a full rebuild from scratch if the issue is systemic.

For high-stakes agents (financial calculation engines, compliance reviewers), tolerance is zero — a single strike disables the agent until manually re-verified against source.

## §9E — Stochastic Consensus at Scale

Heavy users report $8,000 per month in fast-mode usage, primarily on stochastic multi-agent consensus workflows. The pattern: rather than one Claude instance attacking a problem, spawn 10–100 instances attacking it in slightly different ways, then have a final synthesizer identify consensus positions and notable outliers.

Use 100-agent consensus when even a 1% improvement justifies $100–$1,000 in token spend; for game-theoretic optimization (client disputes, negotiation strategy, pricing decisions); to maximize search-space coverage per unit time; for strategic decisions (go-to-market, product positioning, competitive response).

The implementation runs N agents simultaneously with slightly varied system prompts or temperature settings, then a synthesizer that produces what all agents agreed on, what most agents agreed on, and notable outlier perspectives worth considering. The framing is a "mini democracy" — but the operator remains the dictator who makes the final call. The value is in surfacing perspectives that would not have been considered alone.

A reference example: a 100-Opus 4.7 consensus run on a client dispute, producing a game-theoretically optimal resolution that maximized reputation while keeping the bridge intact. The operator used none of the specific solutions, but the breadth of perspectives informed the final approach.

The cost-benefit rule: if the decision's expected-value swing exceeds 100× the token cost, run the consensus. A $100K relationship justifies $1,000 in consensus runs. A $500 operational decision does not justify $200 in tokens.

The reference prompt: "Use stochastic multi-agent consensus to determine all of the different ways that you could [achieve goal]. I want every agent to come up with at least 10 independent responses. Then have them synthesized and turned into just a giant list of all of the possible things you could do."

**Stochastic consensus is terminal-only and does not work in IDE environments.** It requires the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` environment variable.

## §85 — Argument as Architecture

A name for the consensus + debate pattern elevated to an architectural principle. The principle: when a single LLM call is unreliable or incomplete for a decision, the reflex must not be "add more retrieval" or "add more context." It must be "have agents argue, then synthesize."

Reach for argument when the model gives a confidently wrong answer (an adversarial agent exposes the error); when multiple valid approaches exist (debate surfaces tradeoffs explicitly); when the decision has asymmetric downside (forcing disagreement reduces confirmation bias); and when ground truth is unavailable (consensus is the best available proxy).

Default scheduling: any decision above a project-specific dollar threshold gets consensus automatically rather than optionally. For trading-style decisions, $10K impact triggers 10-agent and $100K impact triggers 50-agent. For underwriting, any recommendation reversal (PASS → BUY or vice versa) requires debate. For strategic client recommendations, debate is mandatory. Wire these into CI and scheduled jobs, not ad-hoc prompts.

## §10 — MCP Installation and Usage

MCPs (Model Context Protocol servers) extend Claude's capabilities by connecting it to external services, APIs, and data sources. Anthropic invented the standard in 2024; it has become the universal way AI assistants talk to tools — "USB for AI." An MCP server exposes tools (functions) and resources (data) that Claude can invoke during a conversation; once installed, Claude learns it exists on startup and calls its tools when relevant without manual wiring.

The trade-off: every active MCP consumes context tokens on every message even when unused. A chatty MCP can burn 5–20K tokens of context budget before the operator types anything. Be selective.

Install an MCP via `claude mcp add <name> <command>` — for example, `claude mcp add filesystem npx @modelcontextprotocol/server-filesystem /path/to/project` — or by editing `~/.claude/mcp.json` directly with an `mcpServers` block listing each server's command, args, and env variables, then restarting Claude Code.

The MCP categories worth standardizing. **Filesystem** for read/write of local files. **Database** (Supabase, Postgres) for query and mutation. **Repository** (GitHub) for issue, PR, and branch management. **Browser** (Chrome DevTools, Puppeteer, Playwright) for scraping and visual QA. **Document** (Google Drive, Notion) for asset retrieval. **Communication** (Slack, Gmail) for notifications and correspondence. **Project Management** (Linear) for roadmap state. **Domain-specific** (Composer for trading, Plaid for banking, AirDNA for STR data) per the project's specialty.

Find MCPs at the official registry github.com/modelcontextprotocol/servers; smithery.ai (one-click install); mcpt.com (curated); opentools.ai; github.com/punkpeye/awesome-mcp-servers.

When no existing MCP fits, build a custom one in Claude Code by describing the desired tools (`get_X(id)`, `list_X(filter=None)`, `update_X(id, fields)`), specifying TypeScript with `@modelcontextprotocol/sdk` and `stdio` transport for internal use (or HTTP for production distribution), and asking for a README with install instructions.

The **MCP-versus-Skill rule**: many MCPs are overkill. If only one or two of an MCP's tools are used, convert those to a skill. Skills load on-demand at roughly 60 tokens. MCPs load always at 1–5K+. Reach for an MCP when the surface is used every session, when real-time auth is required, or when persistent connection is required. Reach for a skill when the workflow is occasional, static, or a multi-step deterministic process. The conversion prompt: "Great, the [tool] MCP worked well for [task]. Turn this into a skill instead because skills are much more token-efficient. Take what you just did via MCP, find the direct API endpoints, and build a skill with scripts that calls the API directly."

The recommended baseline keeps the always-on set lean. Globally: Filesystem, GitHub, project-context MCP. Per-project additions only as needed; nothing should load globally that is not used in every session.

## §10B — Managed Agents (Cloud-Hosted)

Anthropic Managed Agents launched in Q1 2026 as Anthropic-hosted containers that run skills on standardized infrastructure. They solve the "where does my agent run" problem and replace Modal, serverless wrangling, and `.env` key management.

The differences from local Claude Code: Managed Agents run in Anthropic's cloud rather than the operator's laptop; they are triggered by API endpoints, Routines, or webhooks rather than terminal typing; they use one-click OAuth rather than manual `.env` rotation; they persist sessions resumably rather than dying on terminal close; they scale across multiple concurrent users; and they bill at standard token rates plus roughly $0.08 per session-hour rather than via subscription. Currently locked to Sonnet 4.6 as executor.

Key features. Production-grade sandboxing (authentication, tool execution handled). Long-running sessions (operate autonomously for hours, persist through disconnections). Multi-agent coordination (agents can spin up and direct other agents — research preview, request access at claude.com/form/claude-managed-agents). Built-in OAuth credential vaults (no raw API keys; MCP connectors built in). Full session tracing (every tool call, decision, and failure mode visible in Claude Console with visual timeline). "Ask Claude" button (after testing, generates a Claude Code prompt to build a frontend in ~30 seconds). Self-evaluation (research preview — Claude evaluates its own output and iterates until success criteria are met).

Use Managed Agents when an API endpoint must accept hits from a client or webhook; when the workflow runs without operator presence; when OAuth to Gmail, Drive, or Slack should not store tokens locally; or when productizing an agent workflow for paid customers.

Setup runs through claude.ai/agents or console.anthropic.com/agents: click New Agent, give it a name, system prompt, and allowed tools and skills, connect external services via OAuth, deploy to receive an API endpoint and auth token, POST to the endpoint to invoke. Test with the built-in test panel (transcript view + debug view with raw API events). Iterate based on agent suggestions from the test conversation.

Operational notes. Archive both the agent and its environment when done — they are separate objects; environments persist independently and accrue cost. Credential vaults store OAuth tokens securely, shared across the organization. The analytics dashboard shows tokens in/out, cost breakdowns by model, access logs across all managed agents. The sessions view shows independent conversation runs with full debug/trace. Filter debug by type — agent messages, thinking sections, tool calls.

The selection rule between Managed Agents and Modal. Need LLM in the production loop with guardrails: Managed Agents (sandboxed, state managed, error recovery). Pure deterministic execution scripts only: Modal (no LLM overhead, pennies per month). Interactive agent that adapts to user input: Managed Agents (runtime flexibility, MCP connectors). Scheduled or triggered workflows with no judgment needed: Modal cron or webhook (cheaper, faster, deterministic).

## §10C — Claude Cowork

Claude Cowork (launched October 2025) is the non-developer, consumer-facing version of Claude Code — same underlying runtime (skills, tools, MCPs, Managed Agents) wrapped in a desktop application for users who do not live in the terminal. Anthropic's release pattern is consistent: ship the technical feature, watch power users hack it, release a consumer wrapper.

Cowork users include non-developer team members in operations, marketing, and finance; clients receiving deployed AI workflow packages; and power users preferring a GUI plus file browser to a CLI.

The features. A visual file browser with drag-and-drop inputs (no command-line file paths). A skill marketplace for installing skills without touching the filesystem. A shared team workspace where multiple members work in the same session. Background agents that run while the application is closed. Feature parity with Claude Code on skills, MCPs, and Managed Agents.

Enterprise features (April 2026): role-based access controls (SCIM integration); group spend limits per team; usage analytics (admin dashboard plus Analytics API); OpenTelemetry support for SIEM pipelines (Splunk, Cribl); per-tool connector controls (e.g., allow read but disable write).

A reference customer quote (Airtree, a VC firm): "Using Claude Cowork across teams multiplied its value. Skills built by one person could be used by everyone. Claude Cowork became shared firm infrastructure rather than just an individual productivity tool."

The distribution implication: deploy AI workflow products as Cowork-installable skill packs rather than teaching enterprise clients to install Claude Code. Client downloads Cowork, installs the skill pack, runs workflows with zero technical onboarding.

## §10D — Routines: Scheduled and Event-Triggered Automation

Routines (Anthropic blog, April 14, 2026, research preview) are Claude Code automations configured once with a prompt, repo, and connectors, then run on a schedule, from an API call, or in response to an event. They run on Claude Code's web infrastructure, so nothing depends on the operator's laptop being open.

Three types. **Scheduled** routines pair a prompt with a cadence: "Every night at 2am: pull the top bug from Linear, attempt a fix, and open a draft PR." **API** routines each receive an endpoint and auth token; POST a message and receive a session URL: "Read the alert payload, find the owning service, and post a triage summary to `#oncall` with a proposed first step." **GitHub webhook** routines subscribe to repository events and create a new session per matching PR, with subsequent comments and CI failures fed into the same session: "Please flag PRs that touch the `/auth-provider` module. Any changes need to be summarized and posted to `#auth-changes`."

Daily limits: Pro 5, Max 15, Team 25, Enterprise 25. Extras are available via additional usage.

Common patterns. Nightly backlog triage. Weekly docs-drift scans. Post-deploy verification. Alert triage from Datadog. Library port routines that mirror Python SDK changes into the Go SDK. Stripe webhook → automated post-purchase pipeline. Fireflies transcript webhook → post-call follow-up email plus summary. Health-check routine every 15 minutes hitting production endpoints with Slack alert on failure.

Get started at claude.ai/code or via `/schedule` in the CLI.

The selection rule for execution surfaces. Cron-style automation on the operator's repo: Routines (built-in, no infra management). Deterministic execution scripts only: Modal (no LLM overhead, cheapest). Interactive agents needing runtime flexibility: Managed Agents (full sandboxed runtime). GitHub event-triggered workflows: Routines via the GitHub webhook mode (native integration). Long-running autonomous agents: Managed Agents (persistent sessions).

The Saraf framing: routines replace the entire middle layer of automation. The old model was Event → n8n / Make.com → Output. The new model is Event → Routine (natural-language instructions) → Output. Operators no longer need node-based automation; they describe what they want in plain English. Routines are the standardized enterprise version of agentic workflows.

Be more precise in routines than in skills. Routine execution is hands-off and must work nearly perfectly every time, so decrease the total scope of possible errors by being clear and verbose; lean toward more context rather than less. There appears to be no length limit.

The UX walkthrough. Navigate to claude.ai/code/routines. Click New Routine. Name it. Write the description like a detailed skill or SOP. Select repository. Select model (Opus 4.7 recommended for complex tasks). Select cloud environment with env vars. Add a trigger (Schedule, GitHub Event, or API). Add connectors via Settings → Connectors. Run Now to test, or save to schedule. The calendar view at claude.ai/code/routines shows all scheduled routine executions with exact times.

To convert n8n / Make.com workflows, build a "routine generator" skill. In n8n, hold Shift to select nodes and copy the JSON. In Claude Code, paste the JSON and say "Use the routine generator to turn this n8n workflow into a routine." Claude parses node logic and produces a natural-language equivalent. Add connectors and set the trigger. Iterate via API: "Update this so it sends me a Slack message with the scrape after it's done" — three seconds versus dragging new nodes.

The cost note: routines operate in the token domain (more expensive per operation than pure compute). Do not blindly port all n8n workflows. Build new workflows as routines only when time savings justify token cost; simple deterministic tasks may remain cheaper on n8n or Modal.

## §10E — Managed Agents Practitioner Deep-Dive

The practitioner framing of Managed Agents: standardization of the "middle layer" of automation. Previously, hosting agentic workflows required n8n, Make.com, or custom serverless backends. Anthropic now provides dedicated infrastructure that runs skills in containerized, predictable environments with standardized OAuth — no more wrangling API keys in `.env` files.

Managed Agents replace four things. The action modules of no-code platforms (not the triggers — those still need Routines or webhooks). Custom serverless deployments for agentic workflows. Manual API key management (replaced by one-click OAuth). Inconsistent execution environments (replaced by standardized containers).

A reference deployment: a proposal generator that takes a sales call transcript and returns a URL with a beautiful proposal including built-in payments and signature functionality. Every request to the agent endpoint returns a shareable URL, replacing a 1–2 hour build process across 5–6 platforms (JotForm, PandaDoc, etc.) with a single natural-language instruction.

The Anthropic release-pattern observation: ship technical / code-heavy feature → power users hack it and demonstrate spikes → consumer-friendly version released. That was the Claude Code → Cowork story. Expect Managed Agents to follow the same trajectory toward a more visual, non-technical interface.

Current limitations. No built-in scheduling yet; use Routines. The dashboard is developer-oriented; non-technical users may struggle. The interface is text-based only; a visual layer is expected in a future update.

## §102 — Managed Agents Memory: Built-In Filesystem Persistence

As of April 23, 2026, Managed Agents include a built-in memory layer in public beta. This is a material change because Managed Agents are no longer stateless task runners — they can now learn across sessions.

Memory is filesystem-based, not vector-DB-based. It mounts directly onto the agent's filesystem, so Claude uses the same `bash` and code-execution tools it already has to read and write memories. No new tool vocabulary. Opus 4.7 is specifically tuned for filesystem-based memory: it saves more comprehensive, well-organized memories and is more discerning about what to remember. Memories are files — exportable, independently manageable via the API, under developer control.

The enterprise features make this production-relevant. Permissions are scoped: org-wide stores can be read-only while per-user stores allow read and write. Multiple agents can work concurrently against the same store without overwriting each other. The audit log records which agent and which session produced each memory. Version control allows rollback to an earlier version or redaction of content from history. Memory updates appear in the Claude Console as session events so developers can trace what an agent learned and where it came from.

The customer performance data is striking. Rakuten's task-based long-running agents that learn from every session deliver 97% fewer first-pass errors at 27% lower cost and 34% lower latency. Wisedocs' document verification pipeline on Managed Agents using cross-session memory accelerated verification by 30%. Netflix's agents carry context across sessions including human mid-conversation corrections. Ando is building its workplace messaging platform on Managed Agents instead of building memory infrastructure itself. Rakuten's numbers are framework-level, not marginal.

Access is via the Claude Console or the new CLI; documentation lives at platform.claude.com/docs/en/managed-agents/memory.

The three-layer memory landscape. §102 Managed Agents Memory provides production persistence for cloud-hosted agents (audit, scoped, observable, enterprise-ready). §86 Shared MCP Memory provides cross-tool / cross-IDE sync for individual developer workflow (self-hosted, with ~1–3K context overhead). §87 Carrier File provides a zero-dependency manual snapshot that works anywhere via copy-paste. Pick the layer by deployment context.

## §101 — Consumer Connector Directory

The Claude directory at claude.ai/directory holds over 200 connectors spanning design, finance, productivity, and health. As of April 23, 2026, Anthropic expanded the directory beyond work-first tools into consumer surface area.

The April 2026 connectors cover four categories. Travel and activities: AllTrails, Booking.com, TripAdvisor, Viator, StubHub. Commerce and logistics: Instacart, Uber, Uber Eats, Taskrabbit, Thumbtack, Resy. Media: Audible, Spotify. Finance and tax: Intuit Credit Karma, Intuit TurboTax.

The platform-model shift: from a static tool picker to dynamic suggestion. Claude now surfaces the right app for the task at hand, driven by user preferences, context, and conversation rather than manual selection. When more than one connected app could answer, Claude shows them all and lets the user choose.

The commercial posture is explicit. Claude is ad-free with no paid placements or sponsored answers. Connected-app data is not used to train Anthropic models. Connected apps do not see other Claude conversations. Destructive actions (booking, purchasing) require user confirmation before execution. Connectors are available on all plans, with mobile in beta.

The strategic implication: the directory is the most likely single channel for AI product user acquisition in the near term. Every new connector trains users to expect Claude can reach their tools, and absence from the directory means a missed surface.

## §103 — Production MCP: The Three-Path Integration Model

Anthropic's official framing for connecting agents to external systems names three paths.

**Direct API** fits one agent talking to one service or a small number of integrations. The failure mode at scale is the M×N integration problem: every agent-service pair becomes a bespoke integration with its own auth, tool descriptions, and edge cases.

**CLI** fits local environments and sandboxed containers where a filesystem and shell are present. The limits are hard ceilings reaching mobile, web, or cloud-hosted platforms with no container, and auth handled via a credential file on disk. Best for quick, permissive integrations.

**MCP** fits production cloud agents reaching cloud-hosted systems where the data, work, and infrastructure already live. It requires more upfront investment but returns portability, auth standardization, discovery, and rich semantics. One remote server reaches every compatible client (Claude, ChatGPT, Cursor, VS Code, and more) in any deployment environment.

Mature integrations ship all three: API as the foundation, CLI for local-first environments, MCP for cloud agents.

The April 2026 adoption data is concrete. MCP SDKs are at roughly 300 million monthly downloads, up from 100 million at the start of 2026 — 3× growth in a single quarter. The Anthropic directory holds 200+ MCP servers used by millions daily. MCP underpins Claude Cowork, Claude Managed Agents, and Claude Code channels.

The decision rule. One-off internal automation in a single Claude Code project: skill (load-on-demand, ~60 tokens). Reusable cross-project work that needs real-time state and auth: MCP on local stdio transport. Reaching users via Claude.ai, ChatGPT, or Cursor: remote MCP (see §104). Narrow internal scripts used by one person: skill — MCP is overkill.

## §104 — MCP Server Design Patterns for Production

These five patterns separate "works" from "gets adopted."

**Pattern 1 — Build remote servers for maximum reach.** A remote server is the only configuration that runs across web, mobile, and cloud-hosted agents, and every major client is optimized to consume remote servers. Local-only stdio servers are fine for developer loops but invisible to the broader ecosystem. Any product MCP server must be remote if directory-driven distribution (§62) is the goal.

**Pattern 2 — Group tools around intent, not endpoints.** Do not wrap an API one-to-one. Fewer, well-described tools consistently outperform exhaustive API mirrors. A single `create_issue_from_thread` tool beats `get_thread` + `parse_messages` + `create_issue` + `link_attachment`. For an analysis product, `analyze_property` (takes an address or URL, returns full analysis) beats exposing raw pipeline primitives.

**Pattern 3 — Code orchestration for large tool surfaces.** Services with hundreds of operations (Cloudflare, AWS, Kubernetes) will not fit an intent-grouped toolset. The right move is a thin tool surface that accepts code: the agent writes a short script, the server runs it in a sandbox against the API, only the result returns. Cloudflare's MCP uses two tools (search and execute) to cover roughly 2,500 endpoints in about 1,000 tokens.

**Pattern 4 — Ship rich semantics where they help.** MCP Apps — the first official protocol extension — let a tool return an interactive interface (chart, form, dashboard) rendered inline in the chat. Servers shipping MCP Apps see meaningfully higher adoption and retention than text-only servers. The extension is supported in Claude.ai, Claude Cowork, and many top AI tools. Elicitation lets the server pause mid-tool-call to ask the user for input. Form mode sends a schema and the client renders a native form (use for missing parameters, confirming destructive actions, disambiguating options). URL mode hands the user to a browser for downstream OAuth, payment, or any credential that should never transit the MCP client (supported in Claude Code, with more clients in progress).

**Pattern 5 — Lean on standardized auth.** CIMD (Client ID Metadata Documents) in the latest MCP spec (2025-11-25) is Anthropic's recommended approach: fast first-time auth, far fewer surprise re-auth prompts, supported in MCP SDKs, Claude.ai, and Claude Code, with broad industry adoption in progress. Vaults in Managed Agents register a user's OAuth tokens once, reference the vault by ID at session creation, and the platform injects credentials into each MCP connection and refreshes them on the operator's behalf — no custom secret store, no per-call token passing. If shipping as a remote MCP server behind OAuth, use CIMD for registration. If deployed as a Managed Agent, use Vaults for credential management. Do not build a custom secret store.

## §105 — MCP Client Context Efficiency

Two client-side patterns reduce context pressure when connecting many MCPs to Claude Code.

**Tool search** defers loading all tool definitions into context. The agent searches the catalog at runtime and pulls in relevant tools only when needed. The measured impact is an 85%+ reduction in tool-definition tokens with high selection accuracy maintained, per Anthropic's internal "advanced tool use" testing. This is the programmatic answer to §70 (Fresh-Session Overhead Audit): instead of manually disabling MCPs per project, tool search keeps them available but out of context until invoked.

**Programmatic tool calling** processes tool results in a code-execution sandbox rather than returning them raw. The agent loops, filters, and aggregates across calls in code, with only the final output reaching context. The measured impact is roughly 37% token reduction on complex multi-step workflows. Use it for any pipeline where intermediate agent outputs would otherwise pollute downstream contexts — extract only the fields each downstream agent needs.

Combined, the 85% tool-definition reduction and the 37% multi-step reduction compose naturally across multiple servers, yielding leaner context, fewer round-trips, and faster responses.

## §106 — Plugins: Bundling MCP + Skills + Hooks + LSP + Subagents

Plugins are Anthropic's official abstraction for bundling multiple context providers into one distributable unit. A plugin contains skills, MCP servers, hooks (event-triggered behaviors), LSP servers (language server protocol integrations), and specialized subagents. Plugins replace the ad-hoc "install five things manually" workflow.

The reference example is Anthropic's Data Plugin for Cowork: 10 skills plus 8 MCP servers covering Snowflake, Databricks, BigQuery, Hex, and more, acting as a domain-specialist layer that gives Claude both raw capabilities and the procedural knowledge of how to use them well.

Install plugins via `/plugin marketplace add <repo>` and `/plugin install <plugin-name>@<marketplace>`. Examples: `/plugin marketplace add anthropics/skills`, `/plugin install document-skills@anthropic-agent-skills`; `/plugin marketplace add anthropics/claude-plugins-official`, `/plugin install claude-code-setup@claude-plugins-official`.

Notable plugin and skill repositories. **anthropics/skills** holds Anthropic's production skills: `docx`, `pdf`, `pptx`, `xlsx`, `pdf-reading`, `frontend-design`, `skill-creator`. **anthropics/claude-plugins-official** holds the official plugin marketplace including `github`, `claude-code-setup`, `pyright-lsp`, `code-review`, `commit-commands`. **Community plugins** like `oh-my-claudecode` (yeachan-heo) provide multi-AI orchestration across Claude, Gemini, and Codex with 19 specialized agents and execution modes (autopilot, ralph, ultrawork, deep-interview, team mode, planning mode).

The rule going forward: by end of 2026, any AI-product offering that bundles more than two components ships as a plugin, not as a manual setup guide. Manual setup is a sales-friction point.

## §107 — Skills Distribution from MCP Servers

Increasingly common: MCP servers publish an accompanying skill alongside the server, so the agent gets raw capabilities (from MCP) plus an opinionated playbook for using them well (from the skill). Canva, Notion, and Sentry already list skills next to their connector in the Anthropic web directory. The MCP community is actively developing an extension at github.com/modelcontextprotocol/experimental-ext-skills for delivering skills directly from servers; once it stabilizes, every client (Claude.ai, Cursor, Claude Code, ChatGPT) will inherit the skill automatically, versioned with the API it depends on.

When building a remote MCP server, pair it with a companion skill that teaches Claude how to use it well (voice, methodology, output format). When the extension stabilizes, migrate to server-delivered skills so every client inherits the methodology without per-client setup. Track the GitHub experimental extension repo for status, with a Q2–Q3 2026 timeline likely.

## §11 — Workspace Organization

The recommended root structure carries a top-level `.claude/` containing the workspace-wide CLAUDE.md, the shared `mcp.json`, the agent definitions for `researcher`, `code-reviewer`, and `qa`, and the skills folder. Each project lives in its own top-level folder with its own `.claude/`. The `directives/` folder holds DOE directives. The `execution/` folder holds DOE execution scripts. The `active/` folder holds working files (research, model-chat transcripts, drafts). The `clients/` folder holds external client work, each with its own `.env` and `.claude/`. The `shared/` folder holds cross-project execution scripts and reference data.

The five rules are absolute. One project per top-level folder. Shared code lives in `/shared/` — if two projects use the same script, it belongs there. Every project has its own `.claude/` folder so local rules override global. Every project has `directives/` and `execution/` per the DOE framework. Data never lives in the code folder — it goes in `/shared/data/` or a database. Don't pollute root: always store generated files in `active/` subfolders. Skills specify their own output paths.

Color-code workspaces. Use VS Code `settings.json` to change the header bar color (green for personal, blue for business). Keep business and personal separate — different workspaces, different CLAUDE.md files. Workspace preferences should be pinned to the global CLAUDE.md: default working directory, requirement to check `pwd` before shell commands, requirement to ask the user if a file is not where they say it is rather than creating it, prohibition on modifying `/shared/data/` without explicit confirmation, requirement to follow the standard folder template for new projects.

Cleanup cadence. **Weekly:** delete merged branches; archive old experiment folders; clean `active/` of loose temp files. The reference cleanup prompt: "Clean up my active/ folder. Anything inside subfolders is fine, but anything just loosely in the folder — any .txt, .py, .json, .jpeg, or temp files — clean up by deciding if it's necessary. If it's a temp file, delete it. Otherwise, store it in a subfolder that makes sense. Also enumerate anything that looks personal vs. business and flag it." **Monthly:** prune stale skills, review the MCP list for unused servers, compress old conversation exports. **Quarterly:** review the global CLAUDE.md, run `/insights` across all projects, promote learnings to global rules.

## §11B — Shared Execution Script Library

The `/shared/execution/` folder is the deterministic code library — pure Python (no LLM), callable from any project, the "E" of DOE applied across the workspace. Shared scripts are deterministic (same input, same output), testable (unit tests catch regressions), cheap (no token cost to invoke), and reusable (write once, call from any project).

The standard library breaks out into modules. `data/` for I/O (`fetch_csv.py`, `upsert_database.py`, `query_database.py`). `finance/` for calculations (`cap_rate.py`, `cash_on_cash.py`, `irr.py`, `dscr.py`, `mortgage_calc.py`, `winsorize_zscore.py`). `scraping/` for browser automation. `reporting/` for output (`render_pdf.py`, `render_docx.py`, `render_xlsx.py`, `send_to_slack.py`). `testing/` for fixtures and the full suite runner.

Every directive that needs deterministic work imports from these modules. Adding a new script: write it with a docstring covering inputs and outputs; add a unit test under `/shared/execution/testing/`; run `pytest shared/execution/testing/` to confirm pass; reference it from any directives that need it.

The five script-design rules. One job per script (UNIX philosophy). No hidden state — all inputs via function args or CLI flags. Clear error messages identifying the failure. Structured return data (dicts, DataFrames — not prose). No LLM calls inside; that is the Orchestration layer's job.

## §12 — Security Audit

Run the pre-deploy security audit verbatim against every project before pushing to production. The audit is a single Claude Code prompt that scans for six categories of risk.

**Credentials.** Hardcoded API keys, passwords, or secrets. `.env` files committed to Git. Credentials in log statements. Keys passed as URL parameters instead of headers. Search patterns: `sk-`, `sk_live`, `sk_test`, `Bearer`, `API_KEY`, `password=`, `secret=`.

**Injection risks.** SQL queries built via string concatenation rather than parameterized queries. User input passed to shell commands without sanitization. User input rendered as HTML without escaping. LLM prompt injection in user-supplied content.

**Auth and authorization.** Routes missing authentication middleware. Database Row-Level Security disabled or misconfigured. Admin endpoints accessible without admin checks. JWT tokens in localStorage rather than `httpOnly` cookies.

**Data exposure.** Stack traces returned to the client in production. Internal database row IDs exposed where UUIDs should be used. PII logged without redaction. CORS misconfigurations allowing any origin.

**Dependency risks.** Outdated packages with known CVEs (run `npm audit` and `pip-audit`). Packages from unknown or untrusted sources. Unnecessary dependencies that expand the attack surface. Typosquatted packages.

**Infrastructure.** Service-role keys used in frontend code (catastrophic — must be server-side only). Production secrets accessible to non-production builds. Rate limiting absent or misconfigured. Conversation history in `~/.claude/*.jsonl` containing leaked keys.

The audit prompt: "Run a comprehensive security audit on this project. Check for [the six categories above]. Return PASS / FAIL / N-A for each category with specific remediation steps. Fix everything you can automatically, then list what requires manual intervention."

Use a separate agent for the audit. Do not let the builder audit itself — bias is real.

## §12B — Code Review (Multi-Agent PR Review)

The agent-team pattern for PR review on production code. The lead reviewer (Opus 4.7, `xhigh`) reads the PR diff and identifies architectural concerns. The security subagent (Sonnet 4.6 with Opus advisor) runs the §12 audit on changed code. The test subagent (Sonnet 4.6) verifies test coverage and proposes additional test cases. The docs subagent (Sonnet 4.6) checks whether docstrings, READMEs, or external docs need updates. The synthesizer (Opus 4.7) consolidates findings into a single review comment with prioritized action items.

Wire this into a Routine on the GitHub webhook so it fires on PR-opened events and leaves inline comments before human review. The Anthropic `code-review` plugin from `claude-plugins-official` ships a starter implementation.

## §13 — Diversification & Backup

Single-provider dependency is existential risk. The diversification rule has three planes.

**Tool diversification.** Maintain `agents.md` files mirroring CLAUDE.md content in a format compatible with non-Claude coding agents (Cursor, Cody, Aider) so a provider outage does not halt operations. Sync prompt: "Duplicate the workspace configuration. Change anything Claude-specific — the CLAUDE.md, `.claude/` folder structure, skill formats — to a generic agent specification compatible with Codex CLI. Save to a parallel `agents.md` file and a `.codex/` folder. Keep both in sync by updating `agents.md` whenever you update CLAUDE.md."

The multi-IDE DOE strategy: maintain `claude.md`, `gemini.md`, `cursor.md`, and `agents.md` simultaneously in the workspace. All contain the same DOE framework directives. Switch between IDEs and models freely. If one hits rate limits, open another tab with a different model.

**Model diversification.** Do not lock to one Anthropic model. Opus 4.7 for synthesis and high-value decisions. Sonnet 4.6 for research subagents and routine coding. Haiku 4.5 for cheap throughput tasks (classification, extraction). Local models (Gemma 4, Qwen) for tasks that should not leave the operator's network.

**Data and code backup.** Database providers usually offer daily automated backups, but trust no single provider. Weekly: export critical tables to encrypted S3. Monthly: full database dump to an encrypted external drive. Quarterly: verify backups by restoring to a staging project. Code: GitHub primary; GitLab or Bitbucket as secondary mirror auto-synced via GitHub Actions; local-drive copy of every repo refreshed monthly.

The outage playbook: when a provider is degraded, the active directive runs through the backup agent; output routes through the same `execution/` scripts; post-outage, a comparison logs any output-quality differences for future reference.

## §14 — Workflow Cheat Sheet

The new-project flow: open the folder in Antigravity or the desktop app; run `/init` to generate CLAUDE.md; review and customize; run `/context` and `/usage` to baseline; confirm effort is at the `xhigh` default; create the standard subagents (researcher, code-reviewer, qa); set up the DOE folder structure (`directives/` plus `execution/`); configure Routines for recurring work.

The complex-build flow: voice-dump requirements through a cheap model for compression; switch to Plan Mode; fully specify the task in the first turn (intent, constraints, acceptance criteria, file locations) with all clarifying questions batched; review the plan and adjust; switch to Auto Mode or Bypass Permissions; say "Execute the plan" with API keys provided; walk away while it builds (Auto Mode keeps it safe); use `/rewind` or double-Esc when Claude hits a wrong path rather than correcting in a new turn; return to test and iterate; run the code-reviewer and QA subagents on the result; run the §12 security audit before deploying.

The context-hygiene loop runs every 30 turns: `/context` and `/usage` to check baseline; `/compact` with a direction hint when the session is bloated mid-task; `/clear` with a written brief when starting a genuinely new task; `/rewind` instead of corrections when Claude went down a wrong path.

Advanced research: fan-out / fan-in (5+ Sonnet researchers synthesized by Opus 4.7); stochastic consensus (10 agents brainstorming independently with consensus and outliers, terminal only); model-chat debate (10+ agents structured argument, terminal only); auto-research (metric + change method + assessment for an autonomous improvement loop). Critical reminder: stochastic multi-agent consensus and model-chat debate are CLI-only; they do not work in IDE environments.

Deployment surfaces map cleanly. Static sites: Netlify (free). Backend APIs: Modal ($5 free credit, pennies after). Full-stack apps: Vercel + Supabase + Modal. Cloud agents with LLM judgment: Anthropic Managed Agents at roughly $0.08 per session-hour. Non-developer team workflows: Claude Cowork. Recurring or event-driven automation: Routines.

## §14B — Cloud Deployment Strategy

The production stack maps each layer to a single provider chosen for cost efficiency and operational simplicity. Static frontends: Netlify or Vercel (generous free tiers, instant CDN). Stateless backend APIs: Modal ($5 free credit, serverless GPU available, Python-native). Stateful or long-running backend APIs: Railway (easy Postgres and Redis add-ons, cheap). Postgres + Auth + Storage + RLS in one: Supabase. File storage: Supabase Storage or S3 (one per project, do not mix). LLM-orchestrated agents: Anthropic Managed Agents at roughly $0.08 per session-hour. Background and scheduled jobs: Routines. Webhooks and triggers: Routines in API or GitHub mode (replacing n8n / Zapier). Non-dev workflows: Claude Cowork. Transactional email: Resend or Postmark. Payments: Stripe (the only choice worth considering). Analytics: HumbleLytics (§59).

The environment-variable rule: never commit `.env` to Git; use provider-native secret management (Vercel Project Settings → Environment Variables, `modal secret create`, Railway Variables tab, Supabase Project Settings → Vault). Rotation cadence: payment provider keys on suspicion only; database service-role key annually; OAuth tokens on revocation only. The cost ballpark — early stage, low traffic — is roughly $20–50/mo for hosting before token costs.

## §14C — Webhook & Scheduled Operations

Common webhook patterns. **Stripe → product pipeline.** A webhook on `checkout.session.completed` triggers the product Routine with the order ID. **Fireflies → post-call follow-up.** A transcript webhook triggers a routine that fetches the transcript, extracts action items and next steps, drafts a follow-up email, and posts to a Slack sales channel. **Trading rebalance check.** A scheduled Routine fires every Monday at 9:30am ET, pulls the latest allocations, compares to last week, flags drift greater than 5% on any position, and posts a summary with rebalance recommendations. **Health check.** A Routine fires every 15 minutes hitting production `/health` endpoints and posts to `#ops-alerts` if either returns non-200 or takes more than 2 seconds.

When a webhook source sends bursts (Stripe resends, Fireflies bulk imports), throttle at the Modal layer rather than the Routine layer because Routines are metered per-day by plan. Modal supports `@modal.rate_limit(calls=10, seconds=60)` decorators directly.

## §14D — Claude Code Desktop App: Parallel Agent Workspace

The April 14, 2026 redesigned desktop app is built for running multiple sessions in parallel. Agentic coding now means many things in flight with the operator in the orchestrator seat.

The features. The parallel session sidebar shows every active and recent session, filterable by status, project, or environment, groupable by project for navigation speed, auto-archiving on PR merge or close. Side Chats (⌘+; / Ctrl+;) branch off a conversation to ask a quick question mid-task; they pull context from the main thread but do not add anything back. Integrated tools include a built-in terminal for running tests or builds alongside the session, an in-app file editor for spot edits, a faster diff viewer rebuilt for large changesets, and a preview pane for HTML, PDFs, and local app servers. Drag-and-drop layout lets the operator arrange terminal, preview, diff viewer, and chat in any grid. Three view modes: Verbose (full transparency into Claude's tool calls), Normal (balanced), Summary (just results). ⌘+/ (or Ctrl+/) shows the full keyboard-shortcut list. Plugin parity is total between desktop and CLI; org-managed and locally installed plugins work identically. SSH support extends to macOS alongside Linux, so sessions can target remote machines from either platform.

A canonical desktop workflow runs three parallel tabs against three projects. Use the sidebar to switch. Use Side Chat for quick lookups. Use the integrated terminal for tests within the app. Switch to Summary view for monitoring and Verbose view for debugging.

## §14E — Token Economics & Usage Strategy

The reason usage limits feel restrictive even as models improve: two compounding factors. First, users progressively give harder tasks as they habituate to capability — "change background color" becomes "refactor my entire codebase." Second, Anthropic expanded Opus from 200K to 1M context, so each task can consume up to 5× more tokens before compaction. Users are not doing the same work for more cost; they are doing fundamentally harder work with fundamentally larger context windows.

The strategic implications: budget token spend by decision value, not task count; reserve Opus 4.7 max effort for high-value synthesis and consensus runs; use Sonnet 4.6 for all research, data gathering, and routine subagent work; track monthly token spend by project via `/cost` and `/usage`; recognize that Routines on cloud infrastructure consume tokens, so do not blindly port n8n workflows — convert only when time savings justify token cost; consider local models (Gemma 4, Qwen) for low-stakes tasks.

Two Opus 4.7 changes directly impact spend. The updated tokenizer means the same text may use a different number of tokens than on 4.6. More thinking on later turns in long sessions improves coherence and quality but increases token use. Budgets set against Opus 4.6 are not directly portable; re-baseline during the first week on 4.7. Long interactive sessions consume more than equivalent-length autonomous runs; the fix is structural (fewer, better-specified first turns), not just lower effort. Run `/usage` at start and end of each major session for the first two weeks to build a new mental model.

Opus 4.7 behaves differently in two regimes. **Interactive (synchronous)**: multiple user turns, more reasoning per turn, higher coherence — fits human-in-the-loop work. **Autonomous (asynchronous)**: single user turn up front, long agent run, fewer reasoning-overhead spikes — fits Routines, overnight batch jobs, Managed Agents endpoints. The optimization: fully specify cost-sensitive recurring jobs in turn one to push them into the autonomous regime and cut per-run cost.

Three independent metering surfaces exist: Claude chat (claude.ai) on the chat usage allowance with weekly reset; Claude Code (CLI / IDE / Desktop) on its own allowance with weekly reset; Claude Design (§57B) on a separate allowance with weekly reset. Running into limits on one does not affect the others. Budget and track separately.

## §14F — The War on Context: Strategic Positioning

The thesis: as models commoditize ("just matrices trained on quadrillions of tokens"), value shifts to whoever controls the richest context about users, businesses, and workflows.

The context hierarchy. **Layer 1 (highest value)**: speech-to-text tools that capture everything said between operator and computer; no other data source can replicate this context. Granola has reached a 9-figure valuation on always-on desktop transcription. **Layer 2**: email plus meeting notes, accessible via MCPs, holding large swaths of business context. **Layer 3**: structured business data — CRM, project management, code repositories — already accessible but often siloed. **Layer 4**: web data, public and indexable, low marginal value because everyone has it.

The strategic implication: an enduring moat is not the product — it is the context layer the product generates. Every output through an AI workflow generates context that compounds. The competitive defense is to capture and structure context proprietarily before competitors do — own the data flywheel, not the tooling.

## §14G — Anthropic Ecosystem Lock-In

The 2026 strategy is ecosystem capture through infrastructure. Claude Code, Managed Agents, MCP, Cowork, Routines, Plugins, and the Connector Directory form a moat that gets deeper with every developer and every shipped server. Anthropic hit roughly $30B annual run rate in 2026 (~10× YoY growth), with a growth curve steeper than OpenAI at the same stage. OpenAI's $120B funding round confirms raw capital is still a factor. User loyalty is extremely low — one superior model can shift the market overnight — so infrastructure lock-in is the only durable advantage.

The strategic posture: build entirely inside the Anthropic ecosystem and ride the platform velocity. Keep the diversification plane (§13) as the insurance policy rather than the default operating mode. Maintain `agents.md` as a non-Claude backup. The DOE framework is model-agnostic by design — only the orchestration layer is Claude-specific.

# PART 2 — WORKFLOW PHASING

The canonical execution order for any AI-assisted build. Phases are sequenced by dependency: each one's output becomes the next one's input. Skipping ahead is the most reliable way to ship the wrong thing fast.

## §15 — The Nine Phases

**Phase 1 — Setup.** Folder structure, CLAUDE.md, rules, subagents, MCPs, self-optimization prompts. Done once per project.

**Phase 2 — Research.** Competitor analysis, data-source survey, monetization research, architecture exploration. Done before any code is written. Outputs land in `active/research/` for downstream phases to reference.

**Phase 3 — Planning (Plan Mode).** Pipeline architecture, individual agent design, database schema, API design, frontend dashboard. No building yet. Plans land in `active/plans/`.

**Phase 4 — Design.** Screenshot loops for UI/UX before coding. Outputs land in `active/designs/`.

**Phase 5 — Build.** Switch to Bypass Permissions or Auto Mode. Execute the approved plans. Use git worktrees for parallel work.

**Phase 6 — Validate.** Test against ground truth. Accuracy benchmarking. User acceptance testing. Security audit. No deployment until all four pass.

**Phase 7 — Skills & Directives.** Codify what works into reusable skills and DOE directives.

**Phase 8 — Deploy.** Push to production once validation passes. Choose the deployment surface from §14B.

**Phase 9 — Optimize.** Auto-research loops on accuracy, speed, and prompt quality. Agent-team patterns for ongoing scaling. Distribution mechanics from Part 7.

The principle: each phase outputs an artifact that survives the session it was created in. Plans, research, designs, and code all live on disk. Conversation context is ephemeral.

## §16 — Phase 2: Research Patterns

The four standard research patterns, ordered by problem complexity.

**Competitor analysis.** Fan-out / fan-in across 5–10 competitors. Each subagent researches one competitor; the synthesizer produces a comparison matrix and differentiation strategy. Reference prompt: "Use a fan-out fan-in researchers/synthesizer approach to do a competitive analysis of [market]. Research [list 8–10 competitors]. For each: features, pricing, user reviews (love/hate), data sources, accuracy, mobile app, API. Minimum 5 sub-agents. Sonnet for research, Opus to synthesize. Output: competitive matrix plus differentiation strategy. Save synthesized report to `active/research/competitor-analysis-[date].md`. Save each agent's findings to `active/research/raw/competitors-agent-[N].md`."

**Data-source research.** Fan-out/fan-in across 5+ subagents enumerating public, paid, and scrape-able data sources. Output: cost, reliability, coverage, integration effort per source.

**Monetization research.** Stochastic consensus with 10 agents, each generating 10 monetization paths. Synthesizer produces a deduplicated ranked list. Reference prompt: "Use stochastic multi-agent consensus with 10 agents to determine all ways [product] could generate revenue. Each agent independently generates at least 10 monetization ideas. Synthesizer ranks by feasibility plus market size. Output: ranked list of monetization paths."

**Architecture debate.** Model-chat with 6–10 agents arguing for distinct architectural approaches across 3 rounds. Synthesizer recommends with confidence level. Reference prompt: "Use model-chat with 6 agents debating [architectural choice]. Three agents argue for [option A], three for [option B]. Three rounds: Round 1 independent positions; Round 2 challenge each other; Round 3 final positions. Synthesizer identifies strongest arguments, unresolved disagreements, and recommended decision. Save full transcript to `active/model-chat/[topic]-debate-[date].md`."

The save-location rule for all research: every fan-out, consensus, or debate prompt must specify explicit output paths. Conversation context is lost on `/compact` or `/clear`; files are not.

## §17 — Phase 3: Plan Mode Workflow

Plan Mode is read-only. Claude reads files, reasons, and writes a plan as text in the conversation. Claude builds nothing in Plan Mode.

The flow. **Step 1.** Voice-dump or write the requirements. Compress through a cheaper model if the dump is long. **Step 2.** Switch to Plan Mode (Shift+Tab cycles modes). **Step 3.** Feed the requirements with explicit references to existing research outputs: "Read all research findings in `active/research/` and use them to architect [the system]." **Step 4.** Claude produces a detailed plan — architecture diagrams in text, JSON schemas, endpoint specs, database tables — printed in the chat. **Step 5.** Save the plan: "Save this plan to `active/plans/[topic]-plan.md`." **Step 6.** Review. Read the plan carefully. Does the schema make sense? Do the agent specs match what research recommended? Are RLS policies in place? **Step 7.** Request changes if needed: "I want to change two things: [list]. Update the plan and save it again." **Step 8.** Only after all plans are done and approved, switch to Build Mode.

Claude will typically ask at the end: "Would you like me to implement this?" Do not say yes yet. Save the plan, review, request changes, repeat until satisfied. Then switch modes and execute.

The five canonical plan files for a multi-agent product: `pipeline-architecture-plan.md`, `individual-agent-design-plan.md`, `database-schema-plan.md`, `api-design-plan.md`, `frontend-dashboard-plan.md`. Each ships separately. Time estimate: 1–2 hours across all five plans.

## §18 — Phase 4: Screenshot Design Loop

The iteration pattern for UI/UX before any code is written.

**Step 1 — Source inspiration.** Find 3–10 reference sites with great design. For consumer products: clean SaaS landing pages (Linear, Notion, Stripe). For institutional products: domain leaders (industry-specific). Take full-page screenshots via DevTools (Cmd+Shift+P → "screenshot full size page" in Chrome). Resize each to under 4MB.

**Step 2 — Extract the design system.** Drop screenshots into Claude Code. Prompt: "Extrapolate the key design elements from these pages and help me create a design system. Output: exact hex colors, font stack, type scale, spacing rules, component patterns, animation guidelines (subtle only), overall aesthetic direction. Save to `active/designs/design-system.md`."

**Step 3 — Reference design system in every component build.** Subsequent prompt: "Reference design style guide as the basis as you're creating new components so that you have consistency."

**Step 4 — Iterate on layouts via Paper or Claude Design.** Build static mockups before committing to code. Take screenshots. Compare side by side.

**Step 5 — Use TailArc components as reference blocks.** Find a TailArc component for the section type needed (testimonial, pricing, content section). Screenshot it. Have Claude install or replicate it.

The critical prompt insight on refinement: "Improve the design" is too broad. Use "Refine the design. Make sure you have consistent layouts and themes and keep it subtle enough to make sure there's cohesiveness across the entire page." The word "subtle" constrains the agent's tendency to over-animate or over-design.

The two canonical design loops in any product build. **Dashboard UI.** Reference 3–5 SaaS dashboards. Build mockup. Save final HTML mockup to `active/designs/dashboard-mockup.html`. **Output document (PDF / report).** Reference 3–5 institutional reports. Build mockup. Save to `active/designs/report-mockup.html`. Time estimate: 30–60 minutes per loop. Worth every minute — redesigning a built React app later takes 10× longer.

## §19 — Phase 5: Build Patterns

Switch to Bypass Permissions or Auto Mode before building. The build flow: "I've reviewed all plans in `active/plans/` and I'm satisfied. Switch to bypass permissions. Read all plans in `active/plans/` and all research in `active/research/` and `active/model-chat/` before starting. [Build instructions here]."

The build sequence runs in dependency order. For a multi-agent product, build the agent that everything else depends on first (data ingestion), then the parallel-buildable layer (analysis agents that operate on the same data), then synthesis (the agent that consumes upstream output), then QA. After each agent, run subagents on the result: "Run the code-reviewer subagent on this agent's code. Then run the QA subagent. Fix any issues they find."

After all agents are built: "Merge all worktrees back to main in order. Then run a full end-to-end integration test with [reference input]."

## §20 — Git Worktrees: Parallel Agent Development

Worktrees let multiple Claude Code instances work on different branches simultaneously without file conflicts. Each worktree is an isolated working directory sharing the same Git history.

**Worktrees are terminal-only.** Claude Code cannot create worktrees through the IDE; the operator must run the git commands first.

The setup. From the project root: `git worktree add ../project-feature-A feature-A`, `git worktree add ../project-feature-B feature-B`, etc. Each worktree gets its own folder. Each agent works only in its worktree.

The build prompt after worktrees exist: "Set up parallel development of [N features] using the worktrees I just created. Each agent works ONLY in its worktree — do NOT modify files in the main branch. When all features are done, merge back to main in this order: [dependency order]. Then run full integration tests."

Add to CLAUDE.md: "Git Worktrees — We use Git WorkTrees for parallel development. Every WorkTree is an isolated working directory sharing the same Git history. Workflow: 1) Create feature branch + worktree for each parallel task. 2) Each agent works only in its worktree folder. 3) When done, merge branches back to main. 4) Delete worktrees after successful merge."

The use case is wherever multiple independent features can be built simultaneously: parallel features for a single product; multi-agent pipelines where each agent is independently buildable; large refactors split across files; experiments where the operator wants to keep the main branch clean.

## §21 — Phase 6: Validation Workflow

No deployment until four validations pass.

**Validation 1 — Ground truth benchmark.** Run the system against a known-good dataset. For underwriting: a portfolio of historical decisions with known outcomes. For document generation: a set of human-reviewed reference outputs. Acceptance criterion: the system agrees with ground truth on at least 85% of cases. Disagreements must be defensible.

**Validation 2 — Accuracy benchmarking.** Quantitative metrics: mean absolute error on numerical outputs; section-level quality scores from a rubric-based evaluator agent; pipeline success rate above 95%.

**Validation 3 — User acceptance testing.** Run the system against the actual workflow with the actual users. Collect feedback. Fix issues before deploy.

**Validation 4 — Security audit.** Run the §12 audit. PASS on all six categories before deploy. Use a separate agent — do not let the builder audit itself.

## §22 — Phase 7: Skills Architecture

A skill is an organized collection of files that packages domain expertise — workflows, best practices, scripts — in a format agents can access on demand. Skills turn a capable generalist into a knowledgeable specialist. The analogy: a math genius versus an experienced tax professional. The tax pro wins not because they're smarter, but because they have the right expertise pre-loaded.

The Anthropic philosophy ("code is all you need"): code is not just a use case but a universal interface for agents to do almost any digital work. Claude Code is a coding agent and a general-purpose agent that works through code.

**Skill structure.** A skill is a folder containing `SKILL.md` (front matter plus instructions) and any supporting scripts. The `SKILL.md` front matter:

```yaml
---
name: skill-name
description: "What this skill does. Trigger phrases: phrase1, phrase2, phrase3."
---
```

Front matter loads at ~60 tokens per skill. The body loads only when the trigger phrase fires.

**Skill creation workflow.** 1) Do the task manually once with Claude, noting the steps. 2) Ask Claude to format it as a skill with scripts and YAML front matter. 3) Write evals: define test inputs and expected outputs. 4) Run benchmarks on a fresh instance. 5) Test on a fresh instance — important, no prior context bias. 6) Fix errors, update skill. 7) Run regression tests after model updates. 8) Optimize the skill description for trigger accuracy.

**Skill-Creator improvements (March 2026).** The skill-creator now includes evals (test cases verifying skills work), benchmarks (test suites measuring accuracy), regression testing (catching when model updates break existing skills), and description optimization (improving trigger accuracy). Available built into Claude.ai and Cowork; as a plugin for Claude Code at `github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator`; in the skills repo at `github.com/anthropics/skills/tree/main/skills/skill-creator`.

**MCP-to-skill conversion.** When an MCP is used more than 5× in a project, convert it to a skill. The conversion prompt: "The [tool] MCP worked well for [task]. Turn this into a skill instead because skills are much more token-efficient. Take what you just did via MCP, find the direct API endpoints, and build a skill with scripts that calls the API directly. Check my other skills for formatting examples."

**Available production skills from Anthropic.** `docx` (Word documents). `pdf` (PDF generation). `pdf-reading` (PDF extraction). `pptx` (PowerPoint). `xlsx` (Excel). `frontend-design` (polished UI generation). Install via `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills`.

Target accuracy on production skills: 95%+. Re-run regression tests after every model upgrade.

## §23 — Phase 8: Deployment

Map each component to its surface per §14B. The deployment checklist before any push: tests pass; security audit clean; environment variables set in every deployment surface; database migrations run on staging then production; webhooks verified; email domains verified; Managed Agents redeployed with the latest skills; smoke test running the full pipeline end-to-end on production.

The monitoring stack. Sentry on the free tier for application errors. A 15-minute Routine for uptime checks. A weekly Routine pulling Anthropic API costs and posting to Slack. HumbleLytics on marketing pages. Dashboard provider metrics on in-app funnels.

Standard alert thresholds. Pipeline success rate above 95% (alert below 90%). Average runtime under 10 minutes (alert above 15). QA pass rate on first try above 80% (alert below 70%). Cost per run under product-specific threshold (alert at 2× threshold). Customer-facing completion rate within funnel above 40% (alert below 30%).

## §24 — Phase 9: Auto-Research Framework (Karpathy)

Auto-research is the autonomous improvement loop drawn from Andrej Karpathy's framework at `github.com/karpathy/auto-research`. Clone it into a project to set up an iterative optimization loop.

The three requirements for auto-research are absolute. **(1) A metric to optimize.** Concrete, measurable, reproducible. Examples: rubric score from an evaluator agent; mean absolute error against ground truth; pipeline runtime; conversion rate; cost per output. **(2) A change method to influence the metric.** What the agent is allowed to modify — system prompts, few-shot examples, model parameters, code paths, hyperparameters, data sources. **(3) An assessment to measure results.** How outputs are evaluated each iteration — a fresh evaluator instance, a deterministic scoring function, an A/B comparison.

The loop runs autonomously: agent proposes a change, executes it, measures, logs, proposes the next change. The dashboard shows iteration count, current metric, change history.

**Reference auto-research configurations.**

For document quality: METRIC = rubric score (1–10) on generated sections rated by an evaluator agent against reference documents; CHANGE METHOD = system prompts and few-shot examples; ASSESSMENT = run generated output through an Opus evaluation prompt scoring against the rubric; TARGET = consistently scoring 8+ on the rubric.

For pipeline speed: METRIC = end-to-end runtime; CHANGE METHOD = backend modifications — caching, parallel section generation, output assembly optimization, image compression; ASSESSMENT = time the full pipeline; TARGET = under 30 seconds.

For underwriting accuracy: METRIC = mean absolute error between projected and actual outcomes; CHANGE METHOD = agent prompts, data source weights, financial model assumptions; ASSESSMENT = run pipeline against known properties and compare to actual performance; TARGET = MAE below 5%.

For trading parameters: METRIC = Sharpe ratio over trailing 12-month backtest; CHANGE METHOD = momentum lookback periods, rebalance frequency, volatility thresholds, asset universe; ASSESSMENT = backtest API capturing Sharpe, max drawdown, annual return; TARGET = Sharpe above 1.5 with max drawdown below 15%.

For prompt optimization: METRIC = human evaluation score (1–10) of narrative outputs on clarity, actionability, accuracy, tone, completeness; CHANGE METHOD = system prompts, few-shot examples, output format instructions, temperature; ASSESSMENT = generate 10 outputs across diverse inputs, have Opus rate each on the criteria, average the scores; TARGET = average score 8.5+ across all criteria.

The reference prompt: "Clone github.com/karpathy/auto-research into the [project] repo. Set up an auto-research loop to optimize [target]. METRIC: [definition]. CHANGE METHOD: [scope of allowed modifications]. ASSESSMENT: [evaluator definition]. Give me a live dashboard to watch iterations. Target: [specific number]."

Auto-research is the Phase 9 capstone — the loop that runs after deploy and continuously improves the system without manual intervention. It compounds with the §7 self-optimization meta-prompts: meta-prompts improve human-AI interaction; auto-research improves AI-AI internal loops.

## §25 — Voice Dump → Compress

A pattern for getting full requirements out of the operator's head efficiently. Long-form requirements are easier to dictate than to type. But raw transcripts are token-expensive and disorganized.

The workflow. Open a voice memo or transcription tool. Talk for 5–15 minutes about the requirements: what the system should do, who it's for, constraints, edge cases, examples, gotchas. Save the transcript. Feed it to a cheap model (Haiku or a free tier) with: "Compress this voice dump into structured requirements. Headings: Goal, Users, Inputs, Outputs, Constraints, Edge Cases, Open Questions. Cut all filler, all repetition, all 'um' and 'like.' Output should be ~25% the length of the input."

Feed the compressed output to the main session as the first prompt. Cuts 75% of input tokens; preserves all signal.

This pairs with the global CLAUDE.md rule: "Never paste raw voice transcripts directly — compress them through a cheaper model first."

## §26 — Implementation Checklist (4-Week Ramp)

**Week 1 — Foundational setup.** Install Claude Code per §1. Install Antigravity or VS Code with the Claude Code extension. Enable Bypass Permissions and `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Download the desktop app. Run `/init` in the workspace root to scaffold the global CLAUDE.md, then customize per §4 with profile, interaction rules, Opus 4.7 calibration, task specification discipline, token conservation, and self-annealing protocol. Run the §70 Fresh-Session Overhead Audit on every project — disable per-project MCPs that aren't needed, prune any CLAUDE.md exceeding 200 lines. Connect 2–3 personal-productivity connectors per §101.

**Week 2 — DOE structure and subagent baseline.** Create the workspace folder structure per §11. Build the `/shared/execution/` library per §11B. Create the three baseline subagents in `.claude/agents/` per §9. Configure the MCP baseline per §10. Evaluate Managed Agents migration per §102 — pilot one workload. Set up Vault for any OAuth credentials per §104.

**Week 3 — Phase-aligned project builds.** Pick a project. Run Phase 2 (research) per §16. Run Phase 3 (planning) per §17. Run Phase 4 (design) per §18. Establish ground-truth benchmarks per §21. Begin Phase 5 (build) per §19 with worktrees per §20 if parallel.

**Week 4 — Production deployment, marketing, distribution.** Run the §12 security audit on the project before any production push. Deploy per §14B. Set up the §14C webhook routines. Build the design system in Claude Design per §57B. Generate first marketing assets per §56B. Launch the marketing cadence per §60. Enable tool_search per §105 for any project running >3 MCPs. Audit pipelines for programmatic-tool-calling opportunities per §105 Pattern 2. Scope a Plugin per §106.

**Strategic, ongoing.** Run quarterly /insights across all projects and promote learnings to the global CLAUDE.md per §7. Run consensus debates per §85 on any decision above the project-specific dollar threshold. Track three independent Claude metering surfaces per §14E. Monitor the MCP skill-delivery extension per §107. Quarterly: re-check directory composition per §108 for defensibility versus crowding.

---

# PART 3 — ADVANCED RESEARCH PATTERNS

The four patterns for getting beyond what a single Claude turn can produce. Use them when problem complexity, decision value, or asymmetric downside justifies the token spend.

## §27 — Fan-Out / Fan-In Research

The simplest multi-agent pattern. N research subagents work independently on slices of a problem; one synthesizer combines their outputs.

The default configuration: 5+ Sonnet subagents researching, one Opus synthesizer. Sonnet's cost-per-token is roughly 5× cheaper than Opus, and synthesis is the only step where Opus's marginal capability matters.

**Reference prompt:** "Use a fan-out fan-in researchers/synthesizer approach to research [question]. Minimum 5 sub-agents. Use Sonnet for research, Opus for synthesis. Each sub-agent saves findings to `active/research/raw/[topic]-agent-[N].md`. Synthesizer saves to `active/research/[topic]-[date].md`."

Fan-out / fan-in works in both terminal and IDE. It is the most underused pattern in the toolkit because operators default to single-turn queries when they should be parallelizing.

The use cases. Competitor analysis (one agent per competitor). Data source survey (one agent per provider). Codebase optimization analysis (one agent per concern: frontend, backend, database, security). Market research across regions or segments. Literature review across papers.

The benchmark figure: in Anthropic's evaluations, fan-out / fan-in subagents outperform single-agent Opus by 90%+ on research-style tasks.

## §28 — Stochastic Multi-Agent Consensus

When the goal is exhaustive enumeration — "all possible X" — rather than one optimal answer.

The pattern: spawn N agents (default 10) with the same core prompt but different perspectives or temperatures. Each agent independently generates 10+ responses with no coordination. A synthesizer collects all outputs, deduplicates, counts frequency, identifies consensus (3+ agents converged) and outliers (1 agent), ranks by consensus strength.

**Skill definition for `.claude/skills/stochastic-consensus/SKILL.md`:**

```yaml
---
name: stochastic-consensus
description: "Spawns N agents independently, each generates 10+ responses, then synthesizes consensus and outliers. Trigger: stochastic consensus, multi-agent consensus, run consensus."
---

# Stochastic Consensus

## Process
1. Extract problem statement
2. Spawn N agents (default 10), each with SAME core prompt but DIFFERENT perspective
3. Each agent independently generates 10+ responses — no coordination
4. Synthesizer agent (Opus) collects all outputs, deduplicates, counts frequency, identifies consensus (3+ agents) and outliers (1 agent), ranks by consensus strength

## Output
- Synthesized report to `active/research/[topic]-consensus-[date].md`
- Raw per-agent outputs to `active/research/raw/`
- Consensus matrix

## Models
- Sub-agents: Sonnet
- Synthesizer: Opus
```

**Reference prompt:** "Use stochastic multi-agent consensus to determine all of the different ways that you could [achieve goal]. I want every agent to come up with at least 10 independent responses. Then have them synthesized and turned into just a giant list of all of the possible things you could do."

The 100-agent variant is for high-value game-theoretic decisions per §9E. Cost runs $100–$1,000 per run; reserve for decisions where expected-value swing exceeds 100× the token cost.

**Stochastic consensus is terminal-only.** Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Does not work in IDE environments.

## §29 — Model-Chat / Debate

When agents need to challenge each other, not just enumerate independently.

The pattern: N agents (default 10) in a shared debate across multiple rounds (default 3). Each round, agents see all prior responses and refine their positions.

**Round 1.** Each agent independently states a position with arguments. No agent sees others yet.

**Round 2.** Each agent reads all Round 1 responses. Each must state whether they changed position and why; challenge at least one other agent's argument by name; introduce any new arguments inspired by reading others.

**Round 3.** Each agent reads all Round 1 + Round 2 responses. Each states their final position; identifies the strongest argument they heard from another agent; identifies the weakest argument and explains why; states what they changed their mind about.

The synthesizer (Opus) produces: points of strong agreement; unresolved disagreements (genuine tradeoffs with no clear winner); the 3 strongest arguments from the debate; the 3 weakest arguments that got challenged; recommended decision with reasoning; confidence level.

**Skill definition for `.claude/skills/model-chat/SKILL.md`:**

```yaml
---
name: model-chat
description: "Spawns N agents in a shared debate across multiple rounds. Each round, agents see all prior responses. Trigger: model-chat, debate, have agents debate, run model-chat."
---

# Model-Chat / Debate

## Process
1. Extract topic, number of agents (default 10), rounds (default 3)
2. Round 1: independent positions
3. Round 2: agents read all Round 1, update positions, challenge weak arguments
4. Round 3: final positions, identify strongest/weakest from debate
5. Synthesizer produces agreement, disagreements, strongest/weakest arguments, recommendation

## Output
- Full transcript to `active/model-chat/[topic]-debate-[date].md`
- Per-round transcripts to `active/model-chat/raw/`
- Final recommendation to `active/model-chat/[topic]-recommendation-[date].md`

## Models
- Debate agents: Sonnet
- Synthesizer: Opus
```

**Reference prompt:** "Run model-chat with [N] agents debating [question]. [N/2] agents argue [position A], [N/2] agents argue [position B]. Three rounds: independent positions, mutual challenge, final positions. Synthesizer identifies strongest arguments and recommends a decision."

**Model-chat is terminal-only.** Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Does not work in IDE environments.

## §30 — Agent Teams + Consensus

The most aggressive pattern: stochastic consensus combined with agent teams to produce parallel optimization across many dimensions simultaneously.

**Reference prompt:** "I'd like you to optimize [system / codebase] and turn it into a full-fledged [target]. Rather than do this naively yourself, take advantage of stochastic multi-agent consensus. Take that skill and apply it using the agent teams feature. Orchestrate a team of agents that fan out across the optimization dimensions, run consensus within each dimension, and synthesize across all teams."

Use cases. Codebase optimization where each agent team focuses on a different concern (frontend performance, backend architecture, database, security) with consensus within each team. Pre-launch product audit where teams tackle UX, technical debt, marketing positioning, and pricing strategy simultaneously. Trading strategy review where teams analyze edge decay, alternative signals, risk management, and live-vs-backtest divergence.

This is the highest-token pattern in the toolkit. A 4-team consensus run with 5 agents per team plus a synthesizer can hit $200–$500 in a single execution. Reserve for strategic decisions where the expected-value math justifies the spend.

## §31 — Browser Automation Patterns

Browser automation extends Claude beyond text. Three integration paths: Chrome DevTools MCP, Puppeteer/Playwright via dedicated MCPs, and Claude in Chrome extension for live browser sessions.

**Market data scraping.** "Using Chrome DevTools MCP, go to [data sites] for the following markets: [list]. For each market, collect: [structured field list]. Save to `active/market-snapshots/[location]-[date].json`. Compile a summary comparison table across all markets."

**Comp scraping.** "Using Chrome DevTools MCP, pull [type] comps for [target]. Go to [3 sites]. For each platform: search within [radius/filter], capture [field list], screenshot each. Compile all results into a single JSON file with source attribution. Calculate aggregate statistics. Save to `active/comp-data/[target]-comps-[date].json`."

**Listing search and screening.** "Using Chrome DevTools MCP, search for [target] matching: [criteria]. Go to [sites]. For each listing, capture: [fields]. Save results to `active/deal-screening/[market]-listings-[date].json`. Flag any matching [screening rule]."

**Long-running interactive sessions** use the Claude in Chrome extension. Live tab connection lets Claude execute JavaScript in the browser, navigate paginated results, extract data progressively, and accumulate state across pages. The pattern is heavier than DevTools MCP but handles authenticated sessions and dynamic content.

## §32 — Skill Conversion After Validation

Once a browser automation pattern works reliably, convert it from MCP-driven to skill-driven for token efficiency. Reference prompt: "The [MCP] works for [task]. Convert this to a skill instead — find the direct API endpoints (or build a stable scraper script), and build a Python script that calls them without the MCP overhead. Add to `/shared/execution/scraping/`."

The conversion typically drops 1–5K tokens of MCP overhead per session and eliminates the dependency on a chatty MCP that loads always.

---

# PART 4 — PRODUCTION SURFACES

The deployment surfaces for AI workflows. Each maps a different operational shape — interactive tool, scheduled job, event-triggered automation, customer-facing API.

## §33 — Surface Selection Matrix

| Workflow Shape | Surface | Why |
|---|---|---|
| Interactive coding/research | Claude Code (CLI / IDE / Desktop) | Full agentic runtime, parallel sessions |
| Non-developer team workflows | Claude Cowork | GUI for skills, MCPs, Managed Agents |
| Scheduled background jobs | Routines | Built-in, no infra |
| API endpoint with LLM in loop | Managed Agents | Sandboxed, OAuth vaults, $0.08/session-hour |
| Pure deterministic execution | Modal | No LLM overhead, pennies/month |
| GitHub event-triggered automation | Routines (webhook mode) | Native integration |
| Long-running autonomous agents | Managed Agents | Persistent sessions |

## §34 — Anthropic Plugin Repositories

**anthropics/skills.** Anthropic's production skills. Install via `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills`. Top skills:

- `docx` — Word document generation (python-docx production patterns)
- `pdf` — PDF generation
- `pdf-reading` — PDF extraction (page rasterization, text extraction, embedded image and table extraction, form field handling)
- `pptx` — PowerPoint generation
- `xlsx` — Excel generation and modification
- `frontend-design` — Polished UI generation patterns
- `skill-creator` — Skill scaffolding with evals, benchmarks, regression tests
- `file-reading` — Router skill for choosing the right reader per file type

**anthropics/claude-plugins-official.** The official plugin marketplace. Install via `/plugin marketplace add anthropics/claude-plugins-official`:

- `github` — MCP server for managing PRs and issues
- `claude-code-setup` — Analyzes codebase and recommends hooks, skills, and CLAUDE.md config
- `pyright-lsp` — Python type checking (catches Pydantic validation issues before runtime)
- `code-review` — Multi-agent PR review starter
- `commit-commands` — Commit message generation

**Community plugins.** `oh-my-claudecode` (yeachan-heo) provides multi-AI orchestration across Claude, Gemini, and Codex with 19 specialized agents and execution modes (autopilot, ralph, ultrawork, deep-interview, team mode, planning mode), built-in MCP tools (LSP integration, AST-based code search, persistent Python REPL, session state and memory), and magic keywords (autopilot, ulw, etc.).

## §35 — Connector Directory as Distribution

The Claude directory at claude.ai/directory holds 200+ connectors. April 2026 saw the consumer expansion: travel (AllTrails, Booking.com, TripAdvisor, Viator, StubHub), commerce (Instacart, Uber, Uber Eats, Taskrabbit, Thumbtack, Resy), media (Audible, Spotify), finance (Intuit Credit Karma, Intuit TurboTax). MCP SDKs at ~300M monthly downloads, up from ~100M at start of 2026 — 3× growth in a single quarter.

The directory is the single highest-leverage distribution channel for AI products. Submission path: build a remote MCP server per §104 patterns; submit via claude.com/docs/connectors/overview; track listing impressions weekly via the publisher dashboard. The viral compound: every new connector trains users to expect Claude can reach their tools, raising the implicit expectation that any specialized AI workflow appears in the directory.

---

# PART 5 — SELLING AGENTIC WORKFLOWS

The agency motion for productizing AI workflows for enterprise clients. Drawn from Nick Saraf's Agentic Sells course; tested at scale (two AI agencies to $160K/month combined revenue).

## §36 — The Overhang Pitch

AI capabilities are far beyond what most businesses use them for. Most companies are "drinking the Pacific Ocean with a tiny straw" — they copy-paste from ChatGPT and never integrate AI into operations.

The gap between reality and perception is the **arbitrage window**. The window is closing as awareness spreads, but in 2026 it remains wide open.

The credibility stats for client conversations. Frontier models score ~80% on SWE-bench Verified (professional-grade software engineering). Sub-agents outperform single-agent Opus by 90%+ on research tasks. Agentic workflows turn 3–4 hours/day of manual work into 30–40 hours of equivalent output. Self-annealing workflows get stronger over time, unlike n8n / Zapier flows that break silently. Most businesses already have SOPs — they just need conversion to directives.

The framing line: "Capital flows to whoever provides value. For centuries that value came from human labor. Agentic workflows redirect that river. The people who understand this technology now capture the arbitrage before the window closes."

## §37 — The DOE Sales Process

The six-step process tested at scale.

**1.** Ask the client: "Do you have a knowledge base or SOPs?"

**2.** Feed the entire knowledge base into Claude Code in one dump.

**3.** Within 15 minutes, turn SOPs into DOE directives plus execution scripts.

**4.** Demo a working workflow in the meeting — lead scraping, proposal generation, report automation. Not a slide deck. A working system.

**5.** Client sees: 90% of economically valuable work → automated.

**6.** Close: "We can have this running in production within 2 weeks."

The reference deployment: a $2M/yr dental marketing company. The director sat down with the consultant. The team's full knowledge base was fed into Claude Code. Fifteen minutes later, agentic workflows existed for most business functions. The director and managers now run 90% of economically valuable work through the IDE. All directives are readable by non-technical staff.

Why it works. Directives are human-readable — clients can review and improve them. No black boxes — full interpretability. The demo is in the meeting, not in a follow-up call. SOPs already exist — the consultant is converting format, not inventing process.

## §38 — Service Tiers

Four tiers with structural rationale. **Tier 1 — Diagnostic** ($5K, 2 weeks). A paid audit. Interview the team, map workflows, identify the 10 highest-ROI automation candidates, deliver a 20-page roadmap. No implementation. Low-friction door — the client can hire anyone to execute.

**Tier 2 — Foundation Deploy** ($15K, 30 days). Foundational infrastructure: global CLAUDE.md, folder structure, DOE framework, 3–5 initial skills, 2–3 sub-agents, Claude Code for the team, basic MCP setup for internal tools. Deliverable: working environment, 2-hour training, 30-day support. The no-brainer entry tier for committed clients.

**Tier 3 — Production Workflows** ($40K, 60 days). Foundation plus 5–10 production directives, full skill library scoped to the client's domain, Routines for recurring automations, 1–2 Managed Agents in production, Cowork onboarding for non-technical staff. Deliverable: multiple live automations producing measurable time savings, plus 90-day support. The production workhorse.

**Tier 4 — Enterprise** (custom, 90+ days, typically $100K–$250K). Production plus custom skill development, multi-department rollout, advanced patterns (multi-agent coordination, stochastic consensus for strategic decisions), Auto Mode for autonomous operation, Code Review for PR quality gates, Opus 4.7 effort-level guidance for client-facing infrastructure. One year of support and quarterly business reviews. The deep enterprise engagement.

The 30-day Foundation arc. **Week 1.** Discovery and audit — interview each team member 30 minutes, shadow 1–2 team members for a half-day, map current workflows, identify quick wins under 1 week of effort. **Week 2.** Design — draft global CLAUDE.md from interviews, propose folder structure, design 3–5 initial skills, design 2–3 sub-agents, get client approval. **Week 3.** Build — set up repos and Claude Code access, implement skills, write directives for top-5 workflows, configure MCPs. **Week 4.** Rollout and training — 2-hour training, pair-work with 2 power users, document everything in a runbook, kick off 30-day support.

## §39 — Discovery Playbook

The 30-minute client interview is the most important hour of the engagement. The questions, asked of each team member individually:

- Walk me through your day yesterday chronologically.
- Which of those tasks did you find annoying or repetitive?
- If you had an intern who could do anything, what would you give them?
- Where do you currently lose context switching between tools?
- What information lives only in your head that slows down teammates?
- What reports or documents do you produce repeatedly?
- What meetings feel like they could be replaced by a document?
- Where do you currently use AI tools, and what do you wish they did?
- What are you afraid AI will mess up?
- If we delivered perfect AI automation in 30 days, what would change?

For each identified workflow, document: the workflow name; the current process (who, time per week, tools, frequency, steps); the potential automation (which DOE layer it belongs in — Skill / Directive / Agent / Routine / Managed Agent — plus dependencies on tool MCPs, build effort in hours, savings as hours-per-week × hourly-rate, what could go wrong); a priority score of impact × feasibility ÷ risk.

The Tier 1 Diagnostic Report is a 20-page roadmap covering team-by-team workflow inventory, top-10 automation candidates with priority scores, recommended deployment path, expected time-savings projection, and a no-pressure summary that lets the client take the roadmap to any vendor.

## §40 — Pricing Rationale and Margins

Margins are healthy. Tier 1 takes 2 weeks at one consultant lead with mostly Claude work — gross margin north of 70%. Tier 2 takes 30 days with similar leverage. Tier 3 and Tier 4 require more consultant time but command commensurate pricing.

Growth comes from Tier 1 → Tier 2 conversions (target above 50%); Tier 2 → Tier 3 expansion (target above 30%); Tier 4 reference accounts compounding through case-study content and warm referrals.

The Memory Design service offering layers on top of Tier 2+. Three sub-tiers. **Memory Design Sprint** at $3,500 flat per agent pipeline: design per-agent memory scope (what goes in, what expires, review cadence), set up org-wide versus per-user stores, write the initial memory hygiene directive. **Memory + Initial Seed** at $8,000 one-time plus $1,200/month for monitoring: above plus 30-day memory review, seed memories from existing client data, audit log dashboard setup. **Memory Operations Retainer** at $3,500/month after Tier 2: above plus weekly audit-log review, memory schema drift detection, quarterly re-scoping, redaction on request.

The offering works because memory is now explicit in the platform (scoped permissions, audit logs, rollback) — clients see the surface but don't know how to operate it. Rakuten's 97% fewer first-pass errors at 27% lower cost and 34% lower latency make the ROI argument trivial. The positioning line: "You bought Managed Agents. We make them remember the right things, forget the wrong things, and prove it in the audit log."


# PART 6 — AI-POWERED MARKETING

The marketing stack combines AI-native production tools with a content-engine approach to produce volume and quality at a fraction of historic cost. The full stack: Idea Browser (business context) → Claude Design (decks, wireframes, hi-fi) → Paper (in-IDE iteration) → TailArc (reference component blocks) → Claude Code (build and deploy) → Pomelli (social campaigns, photoshoot, animate) → Remotion (programmatic video) → HumbleLytics (analytics, AB testing, CRO) → distribution surfaces (Twitter/X, LinkedIn, YouTube, Instagram).

## §53 — Marketing Strategy Overview

The content mix for an AI-native business: 40% educational (industry insights, tutorials, technical posts), 30% product (demos, case studies, behind-the-scenes), 20% personal (the build journey, lessons learned, contrarian takes), 10% direct response (offers, lead magnets).

The cadence: daily on Twitter/X (1–3 posts), 3× weekly on LinkedIn (longer-form), 1× weekly on YouTube (long-form video), 2–3× weekly on Instagram (Reels), weekly newsletter.

The compounding mechanic: each long-form piece (newsletter, YouTube, podcast) gets repurposed into ~15 derivative formats per §62. One piece of authentic content produces a week of distribution surface across every channel.

## §54 — Claude Design

Claude Design is a separate Anthropic product with its own weekly usage allowance, metered independently from chat and Claude Code. It is Opus 4.7 with a design canvas, comment tools, sliders, layered iteration, and export paths to PPTX, PDF, HTML, Canva, or Claude Code handoff bundles.

Claude Design is not a better Figma. It is a different AI-native category. Treating it as a canvas tool produces frustration. It does not replace a tasteful designer; it replaces the "I don't have a designer" bottleneck. It is not a video tool — output is 5/10; use Remotion for video.

Output strength: decks excellent (investor decks, LP one-pagers, seed decks); wireframes and hi-fi mockups very good; video weak.

The token-conservation hierarchy is the most important rule. Order operations from cheap to expensive: long prompt fixes are token-wasteful. The hierarchy:

1. **Upfront design-system work** (runs once, multiplies everything downstream)
2. **Initial Opus 4.7 generation** (the one expensive prompt)
3. **Comment-tool edits** (surgical, point-and-click, cheap)
4. **Sliders** (spacing, density, warmth — cheap)
5. **Re-prompts** (avoid unless starting fresh)

Fighting a bad start with long prompts burns the weekly allowance in under an hour. Front-load with one hour of `DESIGN.md` work for forever savings.

## §55 — DESIGN.md and Banning the Generic SaaS Aesthetic

`DESIGN.md` is the design analog to `CLAUDE.md`: a single file referenced at the start of every design session that fixes the brand voice, typography, palette, components, and explicit bans.

The standard `DESIGN.md` skeleton:

```markdown
## Brand Voice
[1–3 sentences describing the voice. Adjectives are not enough — give an
example sentence in the brand voice and an example of what the brand
voice rejects.]

## Typography
- Primary: [font family] [allowed weights] [size scale]
- Secondary: [if any, with restrictions]
- Maximum 1–3 faces total

## Color Palette
- Primary: #[hex] [semantic role]
- Accent: #[hex] [semantic role]
- Muted: #[hex] [semantic role]
- Maximum 5–7 colors with semantic roles

## Component Patterns
[Cards, buttons, forms, navigation — describe the canonical version of
each. Reference an example screenshot if available.]

## Animation Guidelines
[One word: subtle. Specify max duration, max distance, easing curve.]

## Aesthetic Direction
[One paragraph describing the overall feel.]

## Explicit Bans
- No Inter, Roboto, or Arial as primary typeface
- No blue-to-purple gradients
- No generic rounded-corner cards with drop shadows as the primary
  container pattern
- No stock gradient backgrounds
- [Any other anti-patterns specific to this brand]
```

The four bans above are the most important sentence in the file. They produce more distinctive output than any other refinement. Without them, Claude Design's default is the "YC batch 2024 aesthetic" — Inter typography, blue-to-purple gradient hero, rounded cards with drop shadows, stock gradient background. Banning these explicitly forces the model to reach for distinctive choices.

## §56 — Asset vs Systems Design Tool Selection

The selection rule:

| Need | Tool | Rationale |
|------|------|-----------|
| Systems design (website, app, full deck with design system) | Claude Design | AI excels at consistency across many artifacts; design-system extraction is its strength |
| Asset design (single image, single social post, one-off graphic) | Canva | Template library and single-asset workflow more mature |
| Pro design handoff (designer → engineer with strict specs) | Figma | Standard for component libraries, design tokens at scale, team workflows |

The default for AI-native operators: decks, pitch materials, OMs, and landing pages through Claude Design; one-off social graphics through Canva; component library for code handoff goes Claude Design → export HTML → hand to Claude Code.

## §57 — Claude Design Operating Patterns

Six patterns refined across many sessions:

**Socratic onboarding.** Claude Design's onboarding offers multiple-choice thesis answers rather than blank questions. Use it as thinking scaffolding — when you don't have a strong prior, the options reveal what the model thinks the design space is, and you'll often find your actual preference in an option you wouldn't have articulated.

**The "let it decide" default.** For any onboarding question where you don't have a strong preference, use the "let Claude decide" option. The model has sampled orders of magnitude more design than you. Its default on a low-stakes axis is usually fine.

**Less-prescriptive second version.** If the first generation feels over-constrained or generic, generate a loose-direction second version with a one-line aesthetic brief — "1950s retrofuturism," "Bauhaus editorial," "mid-century Swiss." Less-prescriptive runs often produce the most distinctive output because the model executes confidently within a well-known aesthetic.

**Design extraction without DESIGN.md.** Claude Design can extract the visual language from an existing branded asset — a deck, a website screenshot, a Canva template — and maintain consistency across new artifacts from that single example. Use when you have a branded asset but no formal design system, when you want a one-off companion artifact, or when testing whether Claude Design can capture your brand before investing in DESIGN.md.

**Self-polishing second pass.** After initial generation, Claude Design continues iterating on its own — fixing text overflow, alignment inconsistencies, small polish issues without being asked. Wait 30–60 seconds after generation completes before commenting. The second pass often resolves 20–40% of the issues you would have flagged.

**Variation-set generation.** For any decision where you'll want a second look, generate 4–6 layout variations in a single session. The cost is roughly the same as iterating on one, and the variation set surfaces options you wouldn't have articulated. Pick on substance, not on the first plausible draft.

The export hierarchy: HTML preserves animations, hover states, and responsive behavior; PPTX preserves layout but loses interactive elements; PDF freezes everything; Canva is editable but limited. For website work, export HTML and hand to Claude Code for refinement. For client decks, PPTX is fine because the client expects to edit. For static deliverables, PDF is the final form.

The SVG and code imagery boundary: Claude Design generates SVG graphics and code-based imagery competently for charts, diagrams, and abstract visuals — but struggles with photorealistic imagery. Use real photography or Pomelli-generated imagery (§59) for product shots, lifestyle imagery, and anything requiring photorealism.

## §58 — Paper: In-IDE Design Iteration

Paper is a design tool connected to Claude Code via MCP. It fills the gap between Figma and code — iterate on designs visually inside the IDE, create variations, then port to code. Variations are fast (no rewriting). Components port to code when ready.

The Paper workflow integrates with the §18 Screenshot Design Loop: screenshot reference sites; drop into Claude Code; ask Claude to extrapolate design elements and create a design system; reference the design system in future sessions; use Paper MCP to iterate on layouts before committing to code; use TailArc components as polished reference blocks.

The critical refinement prompt — be specific about subtlety:

```
Refine the design. Make sure you have consistent layouts and themes and
keep it subtle enough to ensure cohesiveness across the entire page.
```

The word "subtle" constrains the agent's tendency to over-animate or over-design.

## §59 — Pomelli: AI Brand Marketing Automation

Google Pomelli launched October 2025 and expanded globally in March 2026. It is free during beta with no credit card. It scans a website URL, builds a "Business DNA" profile (brand colors, fonts, tone, imagery style), and auto-generates brand-consistent campaigns, ad creatives, product photography, and animated video.

The four primary features:

**Business DNA.** Paste a URL. Pomelli extracts brand colors, fonts, tone, and visual identity in minutes.

**Campaign Generation.** Describe the campaign in plain English. Pomelli returns multiple variations with images, captions, and platform-specific formats.

**Photoshoot** (released February 2026). Upload product screenshots. Pomelli returns studio-quality marketing images, powered by the Nano Banana model.

**Animate** (released January 2026). Turn any static visual into a branded Reel- or TikTok-ready animated video with one click, powered by Veo 3.1.

The standard Pomelli workflow:

1. Enter the website URL. Pomelli builds the Business DNA.
2. Generate per-campaign variants in plain English.
3. Download campaign assets (Instagram posts, LinkedIn banners, ad creatives).
4. Use Animate for short video versions of the static creatives.
5. Use Photoshoot for product mockups.
6. Post per the §61 content calendar.

Limitations: no direct posting or scheduling — download and upload manually (or via Buffer / Hootsuite); English only during beta; works best with clear brand elements; cannot replace long-form video or complex narratives (use Remotion for that).

## §60 — Remotion: Programmatic Video Creation

Remotion is a React framework for creating videos programmatically with TypeScript and JSX. Instead of editing in Premiere or After Effects, you write code that defines animations, text, transitions, and visual elements. Template once, generate variations at scale. Programmatic, brand-consistent, scalable, integrates with Claude Code, exports MP4 for every social surface.

The three-step setup:

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Install the Remotion skill: visit the Remotion website, copy the one-line install command, paste into Claude Code; the skill provisions the entire video editing environment automatically
3. Verify by asking Claude to create a simple test video; if the Remotion studio opens in the browser with a preview, you're ready

Remotion works for AI video because of the real-time feedback loop. Claude writes code, sees the result instantly via browser preview, and iterates until it looks right. Other one-shot generation tools lack this loop and produce lower-quality output.

The standard templates to build for any AI-native business:

**30-second product demo** at 1080×1920. Animated title card in brand colors; screen-recording mockup; key stats animated in; CTA; royalty-free music. Vertical for Twitter/X, Instagram Reels, TikTok.

**15-second stat-highlight** template. Takes (stat number, stat label, context sentence) and generates variations. Use for headline metrics, comparison stats, social proof.

**30-second feature-announcement** template. Title; 3-panel breakdown with icon animations; before/after comparison; CTA.

**60-second educational** template. 3-second hook; 3–5 key points with animated text reveals; data visualization via Recharts; closing CTA.

**30-second reel/short edit** template for repurposing long-form content into vertical clips.

The five copy-paste prompts (battle-tested):

**Product Demo (20s):**

```
Create a 20-second product demo video for [App Name]. Here's the product
overview document [attach doc] and the website [paste URL]. I need: a
hook scene with the problem statement, a brand reveal with the logo and
tagline, 3-4 feature scenes showing the app in action with animated phone
mockups, smooth transitions between scenes, and a CTA at the end. Use
the brand colors from the website. Add background music and sound
effects for transitions. Vertical format (1080x1920).
```

**App Walkthrough (30s):**

```
Create a 30-second app walkthrough video for [App Name]. Show: opening
the app, the main dashboard, performing the core action, viewing results,
and closing on a value proposition. Real screenshots animated inside an
iPhone mockup. Subtle background music. Vertical format (1080x1920).
```

**Social Media Ad (15s):**

```
Create a 15-second social media ad for [App Name]. Open with a strong
hook (problem statement), reveal the product as the solution, show one
key feature with motion graphics, end with CTA "Try [App Name] free."
Vertical format (1080x1920). Energy: high.
```

**YouTube Explainer (30s, horizontal):**

```
Create a 30-second YouTube explainer for [App Name]. Horizontal format
(1920x1080). Open with the headline question, walk through the 3-step
explanation with motion graphics, end with the answer + CTA. Background
music + voiceover script that I'll record separately.
```

**Reel/Short Edit (30s):**

```
Create a 30-second reel by editing this long-form clip [attach clip].
Pull the strongest 30 seconds. Add captions throughout. Add 2-3 motion
graphic emphasis moments on the key insights. Vertical format. Music
matching the original tone.
```

The tips for better output: give Claude reference documents (product overview, brand guidelines, website URL) — more context yields better output; share real screenshots and assets so Claude animates them inside device mockups; always ask for sound effects and background music; watch the real-time preview and give specific feedback ("scene 3 is too slow," "make the phone mockup bigger"); keep videos short — 15–20s for ads, 20–30s for demos, 30–60s for educational; shorter is easier for Claude to nail and performs better on social.

The batch generation pattern uses Remotion's data-driven rendering:

```typescript
const videoData = [
  { product: "[Product A]", stat: "30min", comparison: "vs 8 hours manual" },
  { product: "[Product B]", stat: "6 agents", comparison: "full pipeline" },
  { product: "[Product C]", stat: "30%", comparison: "avg annual returns" },
];
// Render all variations:
// npx remotion render src/index.tsx StatHighlight --props='{"data": ...}'
```

## §61 — HumbleLytics and the AB Testing Loop

HumbleLytics is a Claude Code-native analytics layer. It integrates directly with Claude Code so the AB testing and CRO optimization loops are agentic by default, not manual.

The standard deployment: HumbleLytics on every public-facing surface. A weekly Routine pulls traffic and conversion data, identifies underperforming pages, generates variant hypotheses, and ships variants for testing. The AB testing cadence: weekly variant generation, two-week test windows, statistical significance threshold of 95%, ship the winner.

The corollary rule: do not build landing pages in Webflow or other no-code tools — build them in Next.js so Claude Code can read the source, modify it, and ship variants without leaving the terminal. Custom code lets the agent be your CMS.

The standard CRO optimization prompt:

```
Pull this week's HumbleLytics data for [SITE]. Identify the 3 pages
with the worst conversion-to-target metric. For each, generate 3 variant
hypotheses based on common CRO patterns (above-fold clarity, social
proof placement, CTA contrast, friction reduction, trust signals).

Build the variants in Next.js. Set up AB tests at 50/50 traffic split.
Save the variants and hypotheses to active/cro/[date]/.
Schedule a follow-up routine in 2 weeks to evaluate results at 95%
significance threshold.
```

## §62 — The Content Repurposing Engine

Every long-form piece (newsletter article, YouTube video, podcast episode) gets repurposed into ~15 derivative formats:

- 1 Twitter/X thread
- 5–7 standalone Twitter/X posts pulled from key insights
- 2–3 LinkedIn posts in different angles (educational, contrarian, product-tied)
- 1 60-second YouTube Short pulling the strongest 60 seconds
- 2–3 30-second Remotion-rendered Reels for Instagram and TikTok
- 1 quote-graphic for Pinterest
- 1 audiogram for SoundCloud or Twitter audio
- 1 200-word email teaser
- 1 SEO-optimized blog post variant

The engine is a Claude Code Routine that takes the long-form input and a "platform-format library" and outputs all 15 variants in one pass.

The reference cost: ~$2 in tokens per long-form piece's repurposing. Time saved versus manual: 4–6 hours per piece.

The standard repurposing prompt:

```
Repurpose [LONG-FORM ASSET — newsletter / YouTube transcript / podcast
transcript] into the standard 15-format engine output:

1. Twitter/X thread (5-12 tweets, narrative arc)
2. 5-7 standalone Twitter/X posts (each a complete insight)
3. 2-3 LinkedIn posts (one educational, one contrarian, one product-tied)
4. 60-second YouTube Short transcript (strongest 60 seconds)
5. 2-3 30-second Remotion Reel scripts
6. 1 quote-graphic concept (text + visual direction)
7. 1 audiogram script (60-90 seconds)
8. 200-word email teaser
9. SEO-optimized blog post variant (1500 words, H2/H3 structure)

Save all outputs to active/repurposing/[asset-name]-[date]/.
Reference the platform-format library at .claude/skills/repurposing/.
Match the original voice exactly — do not introduce new claims or change
the tone.
```

## §63 — AI Content Authenticity (Anti-Slop)

The anti-slop rule: never publish AI-generated content that has not been read end-to-end by a human before posting.

Specific bans on AI-native marketing output:

- No em-dash hallmarks of AI prose pervasively (sparingly used is fine; pervasive is a tell)
- No "It's not just X — it's Y" rhetorical structures
- No "In today's fast-paced world..." opener variations
- No "delve / tapestry / seamlessly / robust / leverage" as crutch words
- No listicles where items are obviously LLM-padded to hit a count
- No pictures of obviously-AI faces (six fingers, asymmetric ears) on any branded surface

The positive rule: every published piece passes the test of "would the founder actually say this in conversation with a peer?" If not, rewrite. The voice North Star is whatever the brand voice is — institutional, casual, contrarian, technical — but never corporate, never hype-y, never vague.

The pre-publish prompt:

```
Read this piece [PASTE]. Run it through the anti-slop check:

1. Does it contain any of the banned phrases? [list]
2. Does the rhetorical structure feel AI-generated?
3. Are there any factual claims I cannot verify?
4. Does the voice match my established brand voice in [reference asset]?
5. Would I be embarrassed to attribute this to myself in a peer
   conversation?

Flag any issues. Rewrite the flagged sections in my voice. Do not
introduce new claims.
```


---

# PART 7 — DISTRIBUTION

Distribution determines whether an AI product reaches 10 paying customers or 10,000. The 2026 reality is that AI-native product distribution looks different from 2020 SaaS distribution: programmatic SEO at scale, MCP servers in the connector directory, free tools as top-of-funnel, viral artifacts that spread inside the product, and AI-aware repurposing engines.

## §64 — Distribution > Engineering: The Great Flip

In 2020, the bottleneck was usually engineering. Building the product was hard; distribution was relatively cheap if the product was good (SEO, content, organic Twitter all worked).

In 2026, the engineering bottleneck has collapsed. Claude Code makes building 10× faster. Distribution is harder: organic reach degraded across every platform, paid CAC higher, AI-generated content saturates every channel.

The flip means more time goes into distribution mechanics than into engineering once the product works. Once core product-market fit is in sight, time spent on distribution returns more than time spent on marginal product features.

The seven distribution strategies in the AI-native playbook:

1. **MCP servers in the connector directory** as a sales team (§65)
2. **Programmatic SEO at scale** — 10,000+ pages (§66)
3. **Free tool as top-of-funnel** (§67)
4. **Answer Engine Optimization (AEO)** — SEO for AI assistants (§68)
5. **Viral artifacts** — every product output is shareable (§69)
6. **Buying a niche newsletter** for instant audience (§70)
7. **AI content repurposing** — covered in §62 above

Each compounds differently. The decision matrix in §71 maps which strategy fits which audience and product.

## §65 — Strategy 1: MCP Servers as a Sales Team

Ship the product as a remote MCP server in the Anthropic directory (§42, §103). Every Claude.ai user discovers it in context — when a user asks Claude about the product's domain, the MCP surfaces. The directory is the closest thing to App Store distribution for AI-native products.

The implementation requirements:

- Build remote (§104 Pattern 1) — local-only stdio servers do not qualify for directory placement
- Group tools around intent, not endpoints (§104 Pattern 2)
- Ship MCP Apps for the primary output (§104 Pattern 4) — interactive cards, rich semantics
- Use CIMD for auth (§104 Pattern 5)
- Pair the server with a companion skill (§107)
- Submit to claude.com/docs/connectors/overview
- Track directory listing impressions weekly via the publisher dashboard

The strategic posture: Q2–Q3 2026 is the window. As more connectors land, niche category placement becomes harder. Move fast on the directory.

## §66 — Strategy 2: Programmatic SEO at Scale

Generate 10,000+ pages targeting long-tail queries in the product's domain. Each page is generated by a Routine that pulls live data, runs a lightweight version of the product on representative inputs for that page's topic, and publishes a short page with a CTA to the full product.

The reference economics for an analysis product:

- Cost per page on Sonnet 4.6: ~$0.10
- Cost for 10,000 pages: ~$1,000 one-time
- Monthly refresh of top 1,000 pages: ~$100/month
- Expected outcome: 10,000 pages indexed within 6 months
- Long-tail traffic: 100–500 organic visits per month per page (most pages get few; a small number drive most traffic)
- Conversion to free trial: 1–5%

The infrastructure: Next.js with ISR (incremental static regeneration); pages stored in Supabase; sitemap generation; Google and Bing search console verification.

The standard programmatic SEO routine prompt:

```
Build a programmatic SEO routine for [PRODUCT]:

Target queries: "[BRACKETED TEMPLATE]" — e.g., "[city] rental property
analysis", "[city] vacation rental investment outlook"

For each query in the target list (provided as CSV):
1. Pull live data for the [variable] (rent comps, vacancy rates,
   demographics, recent transactions)
2. Run a lightweight version of [PRODUCT'S CORE ANALYSIS] on a
   representative example for that [variable]
3. Publish a short page (800-1500 words) with:
   - The market summary
   - The example analysis
   - A CTA: "Run a full analysis with [PRODUCT]"
   - Schema.org structured data
4. Add to sitemap
5. Monitor index status

Pages stored in Supabase. Next.js ISR for serving. Refresh top 1000
cities monthly.

Estimate: 10,000 pages at $0.10 each = $1000 one-time. Refresh cost:
$100/month.
```

The targeting rule: programmatic SEO works when the audience is large enough to support 10,000+ city/category/keyword pages. For narrow audiences (e.g., regional CRE brokers), the page count is too small to support the strategy economically. Different mechanic for different audience size.

## §67 — Strategy 3: Free Tool as Top of Funnel

Build a stripped-down version of the product as a free tool. Users get one-shot value (single analysis, single document, single calculation) at high quality, with the CTA "Sign up to get the full report / unlimited use / advanced features."

The reference shape: a free tool produces a real result with the headline metrics. The full product produces the complete deliverable with depth (more comps, deeper analysis, portfolio view, API access, integrations).

Free tier limits: typically one use per IP per day, 10 per email per month — enough to demonstrate value, scarce enough to drive conversion. Expected conversion to paid: 5–10%.

The free tool also serves as the programmatic SEO endpoint (§66). Every city/category/keyword page links to "Run a free analysis on [example]" through the free tool. Two strategies, one CTA target.

The standard free tool architecture prompt:

```
Build a free-tool version of [PRODUCT]:

User flow:
1. User submits [INPUT] (no signup required)
2. System runs a lightweight version of [PRODUCT] producing [OUTPUT]
3. Output includes:
   - Headline metrics (3-5 numbers)
   - Top-line recommendation
   - Visual/chart
4. CTA below output: "Sign up to get [WHAT'S BEHIND THE PAYWALL]"
5. Email capture for users who want to save the result

Limits:
- 1 use per IP per day
- 10 uses per email per month
- Rate limiting on the API

Frontend: Next.js. Backend: Modal or Railway. Database: Supabase.
Tracking: HumbleLytics.

Goal: 5-10% conversion to paid. Track per-source CAC.
```

## §68 — Strategy 4: Answer Engine Optimization (AEO)

AEO is SEO for AI assistants. When users ask Claude, ChatGPT, Perplexity, or Gemini a question relevant to the product's domain, the AI assistants pull from indexed sources. The strategy is to ensure the brand's content appears in those answers.

The tactics:

- Publish long-form authoritative content covering high-intent queries (target ~50 articles in the first year)
- Structure content with clear H2/H3 hierarchy and explicit answer sentences (so AI assistants extract clean snippets)
- Include citations and primary sources (AI assistants prefer citable content)
- Submit to known AI training data sources (Common Crawl, public datasets)

The expected outcome: by month 12, the brand's content appears in AI assistant answers for 20+ high-intent queries. Slow-build channel that compounds.

The standard AEO content brief:

```
Write a [TOPIC] reference article optimized for AI Answer Engines.

Structure:
- H1: The headline question, phrased the way users ask AI assistants
- H2 #1: One-sentence answer to the question, then 2-3 paragraphs of
  supporting explanation
- H2 #2-N: Sub-questions and sub-answers, each in the same one-sentence-
  then-explain structure
- Each major claim has a citation to a primary source

Voice: authoritative, neutral, fact-dense. No hype. No filler.
Length: 1500-2500 words.
Output: Markdown with proper schema.org Article structured data.

Goal: this article gets cited when users ask any AI assistant about
[TOPIC]. Avoid fluff that AI assistants will skip.
```

## §69 — Strategy 5: Viral Artifacts

Make every product output shareable. Every generated artifact carries a "Made with [PRODUCT]" footer with a link. Users proud of their output share it. Shared outputs drive signups.

For a document-generation product: every generated document has a "Shared via [PRODUCT]" footer with a link to a free version of the tool.

For an analysis product: every output has a public-shareable URL with the headline result and reasoning (the full detail behind a paywall). Users share their analyses on Twitter, niche forums, Reddit. Shared analyses drive signups.

For a track-record product (trading, fitness, productivity): weekly performance reports posted to a public account become a leading-indicator marketing channel. The track record markets itself.

The viral coefficient target: 0.3–0.5 across most categories. Each customer generates 0.3–0.5 new customers through shared artifacts. Meaningful even without going viral; transformative if the product is naturally viral.

The implementation prompt:

```
Make every output of [PRODUCT] viral-by-default.

For each generated artifact, add:
1. A "Made with [PRODUCT]" footer
2. A public-shareable URL (e.g., share.product.com/[uuid])
3. Open Graph and Twitter Card metadata so links preview well
4. UTM parameters tracking the source artifact
5. A "Run your own analysis" CTA in the footer of the shared view

For analytics:
- Track viral coefficient (signups per shared artifact)
- Track sharing surface (which platforms drive signups)
- Track converting shares (which artifacts drive paid conversions)

Goal: 0.3-0.5 viral coefficient. Reduce CAC by [X]%.
```

## §70 — Strategy 6: Buy a Niche Newsletter

For each target audience, identify the 3 most-read niche newsletters (5K–50K subscribers). Either advertise in them, or buy the smaller ones outright.

Acquisition cost for a 5K–20K newsletter: roughly $50K–$250K. The newsletter becomes a permanent distribution surface and a brand-owned thought leadership platform.

This is typically a Year 2+ strategy once cash flow supports it, not a Year 1 strategy. The scouting work (identifying the target newsletters, building relationships) starts in Year 1.

The scouting prompt:

```
Identify the top 5 niche newsletters in the [INDUSTRY/AUDIENCE] category.
For each:
- Subscriber count (estimated if not public)
- Founder/operator background
- Content cadence and quality
- Existing monetization model (ads, sponsorships, paid tiers)
- Approximate acquisition price (10-20x annual revenue is the rough rule)
- Strategic fit: how would [PRODUCT] benefit from owning this?
- Risk factors: founder dependency, audience trust, platform risk

Output as a comparison table plus a one-paragraph recommendation per
newsletter.
```

## §71 — Distribution Strategy Decision Matrix

The selection rule by audience size and product type:

| Audience | LTV | Best Strategies |
|----------|-----|-----------------|
| Niche professional (5K–50K total addressable) | High | MCP directory (§65), AEO (§68), viral artifacts (§69), niche newsletter (§70) |
| Broad consumer/SMB (50K–5M total addressable) | Mid | Programmatic SEO (§66), free tool (§67), viral artifacts (§69), MCP directory (§65) |
| Enterprise (1K–10K decision-makers) | Very high | Warm referrals from completed engagements, targeted content, AEO on enterprise queries |
| Technical/developer | Variable | MCP directory (§65), AEO (§68), open-source presence, technical content |

The recommended starting pair for any AI product launching in 2026: **MCP directory placement + free tool as top-of-funnel**. The MCP gets discovery; the free tool gets conversion. Both compound. Both are zero-CAC.

For products with broad audiences, layer in **programmatic SEO** within 90 days of launch — it takes 6 months to compound but the cost is low.

For products targeting enterprise, lead with **case-study content + AEO**. Reference accounts at the enterprise tier compound through warm referrals more than any acquisition channel.

## §72 — Markets of One

A "market of one" is a niche so specific that one well-built solution captures it entirely — not a million customers, but 500 deeply paying ones.

The strategic insight: as AI commoditizes general products, the defensible plays shift toward niches where deep domain knowledge and integrated workflows create real barriers. The competitive moat is not the product; it is the operator's domain fluency translated into the product.

The pattern recognition for identifying markets of one:

- A profession with 1K–50K practitioners nationally
- A tooling gap that current SaaS does not address
- A workflow currently done in spreadsheets or by hand
- A buyer who is technical enough to recognize good software but not so technical they will build their own

Examples by category: regional CRE brokers, family offices managing 50–500 unit portfolios, indie game developers, niche academic research workflows, specialty medical practice management, regional law firm matter management, vertical-specific HR for specialized industries.

The pricing for markets of one: $200–$2,000/month per customer. 500 customers at $1,000/month is $6M ARR — a real business with no need for 10,000 customers.

## §73 — Solo vs Team

The April 2026 practitioner data: solo founders ship faster but plateau on quality; two-founder teams ship slightly slower but deliver 87% of the way to professional outcomes versus 51% for solo. Teams win on quality benchmarks; solos win on iteration speed.

The operational implication: assign work along the comparative-advantage axis when in a two-founder team. Plan the highest-collaboration work for windows when both founders are available. Pitch enterprise sales explicitly as a "two-founder team" rather than solo — the market's current reliability heuristic favors the team framing.

For solo operators, the compensation pattern: lean heavier on agent teams (§29, §33, §34) to simulate the second-pair-of-eyes that a co-founder would provide. Run code review through multi-agent teams. Run consensus on strategic decisions. Maintain a rigorous schedule of audit prompts and self-critique loops.


---

# THE COPY-PASTE PROMPT LIBRARY

The 30 most-used prompts from the playbook, indexed for quick reference. Copy-paste; replace bracketed placeholders.

## Setup

```
/init
```

```
/context
```

```
/usage
```

```
/insights
```

## Self-Optimization Meta-Prompts (§7)

**Add to every CLAUDE.md permanently:**

```
When you have made a mistake, update CLAUDE.md with a running log of
things not to try next time. Format as research notes for future Claude
instances. Add under "Lab Notes — What Not To Do" at the bottom of the
file.
```

**Run after any major task:**

```
How could you have arrived at these conclusions and done everything I
just asked you to do faster and for fewer tokens? Save your answer in
the local CLAUDE.md under "User Preferences."
```

**Run after `/insights`:**

```
This is my Claude insights file. Distill the obvious design patterns
and recurring miscommunications into a list of high-information-density
snippets for my global CLAUDE.md. Optimize for token economy and avoid
the most common Claude mistakes.
```

## Research (§16, §25–§27)

**Fan-out / fan-in:**

```
Use a fan-out fan-in researchers/synthesizer approach to research:
[QUESTION]. Minimum five sub-agents. Use Sonnet for research, Opus to
synthesize.

Save synthesized output to active/research/[topic]-[date].md.
Save raw per-agent findings to active/research/raw/[topic]-agent-[N].md.
```

**Stochastic consensus (terminal only):**

```
Use stochastic multi-agent consensus with 10 agents to determine
[QUESTION]. Each agent independently generates 10+ responses. Synthesizer
collects all outputs, deduplicates, identifies consensus (3+ agents) and
outliers (1 agent insight worth keeping). Sub-agents Sonnet, synthesizer
Opus.

Save to active/research/[topic]-consensus-[date].md.
```

**Model-chat / debate (terminal only):**

```
Run model-chat with 10 agents over 3 rounds debating: [QUESTION].
Round 1: independent positions. Round 2: read all R1, update or
challenge. Round 3: final position + strongest/weakest argument from
others. Synthesizer (Opus) produces agreement, disagreements, top 3
strongest/weakest arguments, and recommended decision.

Save to active/model-chat/[topic]-debate-[date].md.
```

## Voice-Dump → Compress (§28)

```
This is a voice transcript of me describing requirements for [PROJECT].
Verbose and unstructured. Compress into a structured spec:

## Goals
## Constraints
## Acceptance criteria
## Open questions
## Out of scope

Preserve every requirement. Do not interpret or extrapolate. Output
only the structured spec.

Transcript:
[PASTE]
```

## Plan Mode (§17)

```
[Switch to Plan Mode]
Read all research findings in active/research/ and all debates in
active/model-chat/. Use them to architect [SYSTEM]. Produce a detailed
plan covering: system architecture, component specs, data flow, schema,
API design, frontend layout, test strategy, deployment topology.

Save each major section as a separate file in active/plans/.
Do not build anything yet.
```

```
Save this plan to active/plans/[plan-name].md.
```

```
I want to change two things:
- [CHANGE 1]
- [CHANGE 2]
Update the plan and save it again.
```

## Screenshot Design Loop (§18)

```
Here is a screenshot of a reference site whose visual design I want to
emulate. Build an HTML mockup of [PAGE/COMPONENT] for my product,
matching this aesthetic. Take a screenshot when done so I can compare.
```

```
Extrapolate the key design elements from these reference pages and help
me create a design system. Output as design-system.md covering color
palette, typography, spacing, component patterns, animation guidelines
(subtle only), and aesthetic direction. Save to .claude/design-system.md.
```

```
Refine the design. Make sure you have consistent layouts and themes and
keep it subtle enough to ensure cohesiveness across the entire page.
```

## Build (§19)

```
I have reviewed all plans in active/plans/. Switch to bypass permissions.
Read all plans before starting. Build [COMPONENT] per the plan in
active/plans/[component]-plan.md.

After completing:
1. Run the code-reviewer subagent
2. Run the QA subagent and have it generate tests
3. Fix any issues either subagent finds
4. Report back with a summary and any deviations from the plan
```

## Validate (§20)

```
Run the full validation gauntlet for [SYSTEM]:
1. Integration tests against tests/fixtures/
2. Reference benchmark against tests/reference/, threshold [X%]
3. UAT with 5 representative scenarios, rate quality on [criteria]
4. Security audit per .claude/rules/security.md, PASS/FAIL per category

Do not deploy until all four pass.
```

## Auto-Research (§32)

```
Clone github.com/karpathy/auto-research into [project repo]. Set up an
auto-research loop to optimize [METRIC NAME].

- METRIC: [definition]
- CHANGE METHOD: [what the loop modifies]
- ASSESSMENT: [how iterations are scored]
- TARGET: [threshold defining "done"]
- BUDGET: [max iterations or tokens]

Live dashboard for iterations. Save to active/auto-research/[metric]-[date]/.
```

## Git Worktrees (§31)

```bash
# Terminal — create worktrees first
git worktree add ../project-feature-a feature/a
git worktree add ../project-feature-b feature/b
```

```
The worktrees are at ../project-feature-a and ../project-feature-b.
Spawn one agent per worktree. Each agent works ONLY in its assigned
worktree. When done, run code-reviewer and QA on each, then merge to
main in dependency order.
```

## Skills (§21)

```
Create a skill called [skill-name] in .claude/skills/[skill-name]/.

skill.md should have YAML front matter (name, description, trigger
phrases), specify trigger conditions, define the process step-by-step,
define output format, note model selection.

Reference my other skills for formatting examples.
After creating, write evals in evals/. Test on a fresh instance.
```

## Browser Automation (§30)

```
Using Chrome DevTools MCP, scrape [TARGET SITES] for the following
fields: [LIST]. Filter for [CRITERIA]. Rate limit 1 request/5 sec.
Save results to active/scraping/[site]-[date].json with source attribution.
Validate every record has all required fields.
```

## Distribution (§65–§67)

**MCP server submission:**

```
Build [PRODUCT] as a remote MCP server for the Anthropic directory.
Apply the five Pattern rules:
1. Remote transport (not stdio)
2. Intent-grouped tools (not endpoint mirror)
3. MCP App for primary output
4. CIMD auth
5. Companion skill at .claude/skills/[product-skill]/

Submit to claude.com/docs/connectors/overview.
```

**Programmatic SEO:**

```
Build a programmatic SEO routine. Target queries: "[BRACKETED TEMPLATE]".
For each query: pull live data, run lightweight version of [PRODUCT],
publish 800-1500 word page with CTA, schema.org structured data, sitemap.
10,000 pages at $0.10 each. Refresh top 1000 monthly at $100/month.
```

**Free tool:**

```
Build a free-tool version of [PRODUCT]:
- User submits [INPUT] (no signup)
- System runs lightweight [PRODUCT] producing [OUTPUT]
- Output: headline metrics + recommendation + visual
- CTA: "Sign up to get [WHAT'S BEHIND PAYWALL]"
- Email capture optional
- Limits: 1/IP/day, 10/email/month
```

## Anti-Slop (§63)

```
Read this piece. Run the anti-slop check:
1. Banned phrases? [list]
2. Rhetorical structure feel AI-generated?
3. Factual claims I cannot verify?
4. Voice match brand voice in [reference]?
5. Would I be embarrassed to attribute this to myself in peer conversation?

Flag issues. Rewrite flagged sections in my voice. Do not introduce
new claims.
```

---

# QUICK REFERENCE

## The Nine-Phase Workflow

Setup → Research → Plan → Design → Build → Validate → Skills → Deploy → Optimize

Skipping phases produces predictable failures. Each phase has explicit deliverables.

## The DOE Framework

**D**irectives (the WHAT — natural-language SOPs in `directives/`) → **O**rchestration (the WHO — the agent reading directives at runtime) → **E**xecution (the HOW — deterministic Python scripts in `execution/`).

Achieves 2–3% error rates on business functions versus ~20% unconstrained.

## The Five After-Turn Options

1. **Continue** — same task, default
2. **`/rewind`** (double-Esc) — drop a wrong path; preserves prior reads
3. **`/clear`** — fresh session for new task
4. **`/compact`** with hint — bloated mid-task
5. **Subagent** — when you need just the conclusion, not the tool noise

## Effort Levels (Opus 4.7)

`low` → cost-sensitive | `medium` → routine coding | `high` → concurrent sessions | `xhigh` (default) → most coding | `max` → eval-ceiling problems

## Permission Modes

Plan Mode (read-only) → Edit Automatically (default) → Auto Mode (classifier-gated) → Bypass Permissions (full autonomy) → Ask Before Edits (high-stakes)

## The Five Critical Numbers

- **120K tokens (12% of 1M)** — the voluntary reset threshold
- **40–60K tokens** — typical fresh-session overhead before first prompt
- **98.5%** — share of session tokens that are re-reads in long sessions
- **92% → 78%** — retrieval accuracy drop from 256K → 1M tokens
- **0.95^N** — reliability of N chained subagents at 95% individual reliability

## The Three Memory Layers

§102 Managed Agents Memory (production, audited, scoped) → §86 Shared MCP Memory (cross-tool dev sync) → §87 Carrier File (zero-dependency manual snapshot)

## Reference Repositories

- `github.com/anthropics/skills`
- `github.com/anthropics/claude-plugins-official`
- `github.com/modelcontextprotocol/servers`
- `github.com/modelcontextprotocol/experimental-ext-skills`
- `github.com/punkpeye/awesome-mcp-servers`
- `github.com/karpathy/auto-research`

## Reference Documentation

- platform.claude.com/docs (full platform documentation)
- platform.claude.com/docs/en/managed-agents/memory (Managed Agents Memory beta)
- claude.ai/directory (connector directory)
- claude.com/docs/connectors/overview (connector submission)
- claude.ai/code/routines (Routines management)

---

# PART 8 — ADDENDUM: HIGH-ROI ADDITIONS

The patterns below were identified in a comprehensive audit of the source corpus and represent the highest-ROI additions to the foundation playbook. They cover practitioner principles from Anthropic's own product team, native Claude Code features under-documented in the early sections, and operational hygiene that prevents the most common late-stage failure modes.

## §200 — Product Management on the AI Exponential

Anthropic's head of Claude Code product (April 2026 essay) codified four principles that change how AI products are built. They are habit-shifts, not toolkit additions.

**Prototype the spec, do not just write it.** After writing any spec or plan, immediately prototype it in Claude Code — even a rough prototype changes the conversation more than a polished doc. Stakeholders react to running software in ways they never react to written architecture. Reserve the polished doc for after the prototype validates the direction.

**Optimize capability first; cut cost later.** The most common mistake is cutting tokens too early and shipping a weak product. Get the system to high quality on whatever model and effort tier produces the best output. Then, only after capability is locked in, work backward through cheaper models, sub-agent routing, advisor pairings, prompt compression, and skill conversion. Capability is the moat; cost is an optimization.

**The simplest implementation wins.** Clever workarounds for current model limitations become unnecessary the moment the next model drops. Anthropic cut roughly 20% of their own system prompt with the Opus 4.6 release because old hacks were no longer needed. Build the simplest thing that works at the current capability frontier; expect the frontier to move.

**Revisit prompts and skills with each model release.** Re-run every skill without its instructions and see if the base model can now do it without scaffolding. Re-test every prompt hack against the new model — many will be obsolete. Bake this into the upgrade routine: every time a new Anthropic model lands, run the regression suite (§22), then run a "could this be simpler now" pass on the top-5 most-used skills.

The standard upgrade-day prompt:

```
A new Anthropic model has released: [MODEL NAME, DATE].

Run the regression pass:
1. Execute the full skill regression suite (.claude/skills/*/evals/) on
   the new model. Report PASS/FAIL/IMPROVED per skill.
2. For each PASS skill, attempt the same task with the skill's instructions
   stripped — does the base model now succeed unaided? Flag candidates
   for retirement.
3. Re-run the top-5 most-invoked production prompts. Compare quality.
   Identify any prompt-engineering hacks that are now redundant.
4. Re-run the §70 Fresh-Session Overhead Audit; the new model may have
   different baseline token usage.
5. Update CLAUDE.md with any rules that are now obsolete.

Save findings to active/upgrades/[model]-[date].md.
```

## §201 — Code Review as an Agent Team

The `claude code-review` command (Team and Enterprise plans) dispatches a multi-agent team on every PR rather than a single review pass. The reference benchmarks: roughly 84% of large PRs receive findings worth acting on; fewer than 1% of findings are flagged as incorrect by reviewers. Cost runs $15–25 per review.

The configuration: enable in admin settings. The team auto-includes a security reviewer, a test-coverage reviewer, an architectural reviewer, and a documentation reviewer. Output appears as inline GitHub PR comments and a top-level summary comment ranking findings by severity.

The integration pattern: wire `claude code-review` into a Routine (§40) on the GitHub PR-opened webhook. The agent team review fires before any human reviewer is requested, so human review starts with the issues already triaged.

The prompt to verify configuration:

```
Verify our claude code-review setup:

1. Confirm code-review is enabled at the org level (admin settings)
2. Confirm the GitHub webhook routine is firing on PR-opened events
3. Pull the last 10 reviews and report:
   - Average finding count per PR
   - Average severity distribution
   - Average reviewer agreement rate
   - Total spend
4. Flag any PRs where the team missed a real issue (false negative)
5. Recommend any tuning to the reviewer team composition

Save the audit to active/qa/code-review-audit-[date].md.
```

## §202 — Skill-Creator: Evals, Benchmarks, Regression

The Skill-Creator plugin gained four capabilities in March 2026 that promote skills from one-off scripts to versioned, testable artifacts: **evals** (test cases with inputs and expected outputs), **benchmarks** (running skills against test suites to measure accuracy), **regression testing** (catching when model updates break existing skills), and **description optimization** (improving trigger accuracy so skills activate when they should).

The Skill-Creator is available three ways: built into Claude.ai and Cowork; as a plugin for Claude Code at `github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator`; and in the skills repo at `github.com/anthropics/skills/tree/main/skills/skill-creator`.

The updated skill creation workflow:

1. Do the task manually once with Claude, noting the steps
2. Ask Claude to format it as a skill with scripts and YAML front matter
3. **Write evals: define test inputs and expected outputs** (the new step)
4. **Run benchmarks on a fresh instance** (the new step)
5. Test on a fresh instance (no prior context bias)
6. Fix errors, update skill
7. **Run regression tests after model updates** (the new step)
8. **Optimize the skill description for trigger accuracy** (the new step)
9. Save under `.claude/skills/[skill-name]/`

The standard skill-with-evals creation prompt (extends §21):

```
Create a skill called [skill-name] in .claude/skills/[skill-name]/.

skill.md has YAML front matter (name, description, trigger phrases),
specifies trigger conditions, defines the process step-by-step, defines
output format, and notes model selection.

evals/ subdirectory contains:
- test_cases.json with at least 5 (input, expected_output) pairs
- regression_baseline.md documenting current model + current pass rate
- description_test.md with 10 user prompts that should trigger this skill
  and 10 that should not, to verify the description's trigger accuracy

Run the evals on a fresh Claude instance. Report:
- Pass rate on test cases
- False positive rate on description test (skill triggered when it
  shouldn't)
- False negative rate on description test (skill didn't trigger when
  it should)

Iterate skill.md until pass rate ≥95% and trigger accuracy ≥95% on
both directions.
```

Target accuracy: 95%+ on the eval suite. Re-run after every model upgrade as part of the §74 upgrade-day pass.

## §203 — Notification Hooks

Claude Code's hooks system fires shell commands on events. The `Stop` event fires when a task completes. Wire it to play a sound when long-running tasks finish, freeing the operator to context-switch without missing completion.

The configuration lives at `~/.claude/settings.json`. It is shared across all Claude Code surfaces (CLI, Antigravity, VS Code, JetBrains) — configure once, works everywhere.

The cross-platform configurations:

**macOS:**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "afplay /System/Library/Sounds/Glass.aiff"
      }
    ]
  }
}
```

**Linux:**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "paplay /usr/share/sounds/freedesktop/stereo/complete.oga"
      }
    ]
  }
}
```

**Windows (PowerShell):**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "powershell -c \"(New-Object Media.SoundPlayer 'C:\\Windows\\Media\\notify.wav').PlaySync()\""
      }
    ]
  }
}
```

**Cross-platform terminal bell fallback:**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "printf '\\a'"
      }
    ]
  }
}
```

A simpler one-line config command exists: `claude config set --global preferredNotifChannel terminal_bell`.

For richer notifications on macOS, combine sound with a desktop banner:

```json
"command": "afplay /System/Library/Sounds/Glass.aiff && osascript -e 'display notification \"Task complete\" with title \"Claude Code\"'"
```

The hooks system supports more events: `PreToolUse` fires before any tool call (useful for guardrails); `PostToolUse` fires after a tool call completes (useful for logging or post-processing). Reserve hooks for events that genuinely should always fire — every hook adds latency and complicates debugging.

A useful pattern: have Claude create its own notification hook at the operator's request. Example: "Please play a sound when you're done with this task. Create whatever hook you need." Claude writes the appropriate `settings.json` modification, applies it, and confirms.

## §204 — Status Line Customization

The `/status line` slash command customizes the Claude Code terminal status bar. The high-ROI default adds three elements: a token-usage progress bar, the active model, and the current Git branch.

The standard setup prompt:

```
/status line
Update my status line so it includes:
- A loading bar showing tokens used out of total context
- The current model (Opus 4.7 / Sonnet 4.6 / Haiku 4.5)
- The current Git branch
- An indicator when in Plan Mode vs Edit Auto vs Bypass Permissions

Use compact formatting — total status line under 80 characters.
```

The token-usage bar is the highest-value addition. Operating without it means the operator only notices context bloat at autocompact, which is too late (§8). With the bar visible, the 120K threshold (§72) is enforceable in muscle memory rather than as a discipline.

## §205 — `/compact` with Priority Guidance

The `/compact` slash command is more powerful than the bare invocation suggests. It accepts a free-form steering hint that controls what survives the summarization pass.

The bare form: `/compact` (Claude decides what to keep, lossy)

The steered form: `/compact [INSTRUCTIONS]` (Claude prioritizes per the hint)

Reference invocations:

```
/compact preserve all API endpoints and Supabase schema details
```

```
/compact focus on the auth refactor; drop the test debugging tangent
```

```
/compact keep all decisions and rationale; drop the file-by-file
exploration; preserve the agent prompt iterations
```

```
/compact prioritize the in-progress feature; everything before the
current commit can be summarized aggressively
```

The principle: compaction is lossy by definition. The hint controls which losses are acceptable. Without a hint, Claude makes the call at its least intelligent point (high context rot at the end of session). With a hint, the operator chooses what matters before the summarizer runs.

## §206 — The Distillation Prompt

A specialized prompt for compressing many sources (playbook drafts, research outputs, blog summaries, transcripts) into a single high-density CLAUDE.md update. Not for everyday use; reserve for periodic consolidation, typically after a major reading session or quarterly review.

The full prompt:

```
I have multiple source files: a master playbook, project-specific
playbooks, course notes, blog post summaries, and podcast transcripts.

Distill ALL of these into a compressed, high-information-density update
for my CLAUDE.md. NOT the full content. Just the rules, principles, and
patterns that should change how you behave on every future task.

Rules for the compression:
- Maximum 200 lines total
- Bullet points only, no paragraphs
- Each bullet must be actionable — something you DO differently
- Group by category: Architecture, Agent Interaction, Token Management,
  Deployment, Self-Annealing, Tool Design, Security
- No context that's already obvious
- Prioritize rules that PREVENT mistakes over rules that explain concepts
- Include specific patterns: shared state, generator-verifier, advisor
  tool config, progressive disclosure
- Include deployment decisions: what goes on Managed Agents vs Modal
- Include the DOE framework rules that actually matter at execution time

Read these files:
- .claude/CLAUDE.md (current CLAUDE.md)
- .claude/rules/ (all rule files)
- active/research/ (all research outputs)
- active/model-chat/ (all debate outputs)
- active/plans/ (all plans)
- directives/ (all directives)

Then produce a compressed learnings section I can append to my CLAUDE.md.
Save it to active/compressed-learnings.md for my review before I add it.
```

The discipline: review the output before adding it to CLAUDE.md. Compounding AI compression errors degrade quality. Take the best 50–100 lines, cut anything that duplicates existing rules files, and keep CLAUDE.md under 500 lines total.

## §207 — Skepticism for Community Tools

Not every tool surfaced by community posts, AI-generated guides, or social-media threads exists. Among recently-circulated examples that were either fictional or unverifiable: "OneContext" claiming to be an `npm i -g onecontext-ai` package; "OpenClaw" claiming to be an Anthropic-adjacent framework; certain MCP server claims with eye-catching savings ("704K tokens → 2.6K tokens, 99.6% savings on Yahoo Finance"). Some of these resolve to no real package on npm, no real GitHub repository, or measured benchmarks that cannot be reproduced.

The verification protocol before installing any tool surfaced from a non-Anthropic, non-major-vendor source:

1. **Resolve the claim.** Search for the GitHub repository directly. Confirm the org or user exists and the repo is recent and active.
2. **Resolve the package.** Search npm or PyPI for the exact package name. Verify it has reasonable download numbers and a maintained changelog.
3. **Verify the benchmark.** If the tool claims a measured improvement, look for the methodology. Untraceable numbers are red flags.
4. **Sanity-check the model references.** If the tool references models like "claude-3-opus" when the current model is Opus 4.7, the source is stale or hallucinated.
5. **Run in an isolated environment.** Even after the above, install in a sandbox or container before integrating into a production workflow.

The fallback rule: when in doubt, the legitimate built-in techniques (skills, MCPs from the official directory, sub-agents, the §76 Format Conversion Economics, careful CLAUDE.md curation) cover the vast majority of optimization needs without external dependencies.

The gold-standard sources are:

- **Anthropic's official documentation** at platform.claude.com/docs and claude.com/docs
- **Anthropic's official GitHub orgs** at github.com/anthropics
- **The MCP standard's organization** at github.com/modelcontextprotocol
- **Verified practitioner sources** with measurable engagement (book authors, course publishers with revenue, podcast hosts with discoverable archives)

## §208 — The Anthropic API: Direct Use Patterns

Beyond Claude Code, the Anthropic API supports building agents directly. The reference patterns belong in the toolkit even for operators who primarily use Claude Code, because Managed Agents (§37), Routines (§40), and any custom MCP server (§44) ultimately call the API underneath.

The Python and Node SDKs follow the same shape: `client.messages.create(model=..., messages=[...], tools=[...])`.

The minimal agent loop:

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY from env

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    tools=[
        {
            "name": "search_property",
            "description": "Search property records",
            "input_schema": {
                "type": "object",
                "properties": {
                    "address": {"type": "string"}
                },
                "required": ["address"]
            }
        }
    ],
    messages=[{"role": "user", "content": "Find 123 Main St"}]
)
```

The Advisor Tool (§9B) configuration:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",  # the executor
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-7",
            "max_uses": 3
        }
        # ... your other tools
    ],
    extra_headers={
        "anthropic-beta": "advisor-tool-2026-03-01"
    },
    messages=[{"role": "user", "content": "[TASK]"}]
)
```

The MCP-server-as-Python pattern:

```python
from mcp import Server

server = Server("my-server")

@server.tool()
async def my_tool(arg: str) -> dict:
    """Tool description"""
    return {"result": "..."}
```

For the most up-to-date patterns, the Anthropic documentation at platform.claude.com/docs is canonical. Patterns drift across SDK versions; pin a known-good version in production until validated.

## §209 — Diversification: Conductor and Codex MCP

Two specific tools support the §35 diversification posture beyond the conceptual pattern.

**Conductor** is a desktop platform that runs Claude Code and OpenAI Codex (and other agents) in parallel isolated workspaces. If Claude degrades or Anthropic experiences an outage, work shifts to Codex without context loss. The recommended split for most operators is roughly 70% Claude Code, 30% alternatives.

**Codex MCP server** lets Claude Code delegate tasks to OpenAI models from within a Claude Code session. Install with `npm i -g @openai/codex`, then add to Claude Code MCP config with the OpenAI API key. Useful for cross-model verification: have Claude write code, have Codex review it, have Claude review the review.

The standard cross-tool sync prompt:

```
Duplicate the workspace configuration. Take everything Claude-specific —
the CLAUDE.md, .claude/ folder structure, skill formats — and produce a
generic agent specification compatible with Codex CLI (and Cursor, and
Aider).

Save to:
- agents.md (in the repo root)
- .codex/ (mirror of .claude/ structure)
- .cursor/ (mirror of .claude/ structure)

Going forward, when CLAUDE.md is updated, mirror the change to all
parallel directories in the same commit. This is the backup system.
```

The CLAUDE.md addition that enforces the discipline:

```
When you update the local CLAUDE.md, also update agents.md with the
equivalent changes in a format compatible with non-Claude coding agents.
This is our backup system — we cannot afford downtime if Anthropic has
an outage.
```

## §210 — The Cleanup Cadence

The `active/` folder accumulates research outputs, plan files, design mockups, scraping results, model-chat transcripts, audit reports, and one-off experiments. Without periodic cleanup, the workspace becomes archaeological — every session reads or ignores stale content, both of which cost.

The standard cadence:

**Weekly:** delete merged Git branches; archive completed experiment folders to `archive/[year]/[month]/`; compact `active/research/raw/` (keep synthesized outputs, drop raw per-agent findings older than 30 days); delete obsolete plan files for shipped features.

**Monthly:** prune unused MCPs from the loadout; review the skill registry and disable any skill not invoked in 30 days; compress old conversation exports (one tarball per month under `archive/conversations/`); review CLAUDE.md and rules/ for accumulated cruft.

**Quarterly:** run `/insights` across all projects and feed the output into the §80 distillation pass; promote learnings to global CLAUDE.md; review the diversification mirror (agents.md, .codex/, .cursor/) for drift; run a §22 validation gauntlet on production systems.

**Per release:** run the §74 upgrade-day pass when any Anthropic model updates.

The standard weekly cleanup prompt:

```
Run the weekly active/ folder cleanup:

1. List all files in active/ older than 30 days, grouped by directory
2. For each, propose: KEEP, ARCHIVE, or DELETE
   - KEEP: actively referenced from CLAUDE.md, rules/, or current plans
   - ARCHIVE: completed work that may need future reference; move to
     archive/[year]/[month]/
   - DELETE: superseded versions, raw agent outputs older than 30 days,
     experimental dead ends
3. Show me the proposed actions before executing anything
4. After my approval, execute the moves and deletions
5. Report final counts: kept / archived / deleted, and the size reduction

Do not delete anything from .claude/, rules/, directives/, or execution/.
```

The discipline saves token cost (smaller search spaces in `active/`) and decision cost (fewer stale files to ignore in every fresh session).

---

# PART 9 — V1.2 ADDENDUM: PRODUCTION ENGINEERING PATTERNS

This addendum integrates eight Anthropic engineering posts published April 28–30, 2026, plus the `/ultrareview` research preview shipped in Claude Code v2.1.86 (escalating to v2.1.111 with branch and PR modes). The patterns are deliberately weighted toward production-grade reliability — context durability, prompt caching, verification pipelines, agent fleets — because the late-April 2026 release wave moves the frontier of what counts as a "production-ready" agent forward by a meaningful step. Sections continue from §210; cross-references to V1.1 sections use the existing §NN notation.

## §211 — The Context-as-Artifact Discipline

The thesis from Brendan MacLean's 17-year onboarding methodology applied to Claude Code: context is a project artifact like code or tests, not a session variable. Version it, grow it, maintain it. Skipping this is why most developer workflows plateau.

The Skyline reference deployment runs on a 700,000-line C# codebase maintained for 17 years through dozens of grad-student rotations. The pwiz-ai pattern is the operational unit: a separate repository — distinct from the code repo — holding all AI context. Separation matters because context grows at a different cadence than code, applies across all branches and time points, and survives any individual contributor leaving. The split is not the only valid choice; same-repo storage works if it is genuinely versioned and maintained. What is non-negotiable is that context lives somewhere it can be tracked, reviewed, and inherited.

The two-tier architecture: `CLAUDE.md` is the lay of the land — environment setup, repo structure, where the documentation lives, project-specific conventions. The expertise lives in skills under `.claude/skills/` , each one a focused encoding of a specific capability. CLAUDE.md is never a wiki; it is a router. The wiki is the linked documentation. The skills are the procedural know-how.

Operational rule: when the same explanation is needed in three or more sessions, it goes into a skill. When the same correction is needed in three or more sessions, it goes into CLAUDE.md. The cycle compounds — each skill reduces friction for every subsequent session.

The compounding payoff is concrete. Skyline's Files View panel, abandoned for a year after the owning developer left, shipped in two weeks with all final commits co-authored by Claude. The nightly test management module, untouched for three years after losing its maintainer, gained features in less than a day. The mobilogram pane — built by a developer who had been skeptical of agentic coding tools — shipped as a new plotting extension with explicit Claude Code credit.

## §212 — Reference-Don't-Embed Skill Architecture

The most important skill design rule observed in production: skills should reference a central knowledge base, not duplicate content. Each skill points into the documentation rather than embedding the documentation. Skills stay lightweight (faster to load, easier to update) and the knowledge base remains the single source of truth.

The pattern: a `skyline-development` skill that orients Claude to the project and points to the documentation directory, not a skill that contains the documentation. A `version-control` skill that encodes the project's commit and PR conventions and references the contributing guide, not a skill that copies the contributing guide. A `debugging` skill that defines the debugging methodology and references the architecture map, not a skill that includes the architecture map.

The benefit at scale: when documentation updates, all skills inherit the update for free. When a skill needs revision, the revision is small and localized. The anti-pattern (embedding) creates a silent drift between skill content and source-of-truth documentation, and skills bloat to the point that they consume meaningful context just to load.

The rule applies to the skill's body, not to its trigger description. Trigger descriptions should be specific and self-contained — the front-matter description is what determines whether the skill loads at all, and it has a roughly 60-token budget.

## §213 — The Debugging Skill: Anti-Guess-and-Test

Without a debugging skill, the model defaults to "guess and test" — modify code, run, observe, modify again. The pattern wastes time and corrupts the codebase with speculative changes. The fix is a debugging skill with an explicit always-load trigger: "ALWAYS load when investigating bugs, failures, or unexpected behavior."

The standard debugging skill body covers six steps. (1) Reproduce the failure deterministically before any code change. (2) Read the failing code path end-to-end before forming a hypothesis. (3) State the hypothesis explicitly — what is the model's current best guess for the root cause, with confidence. (4) Predict what the next observation should show if the hypothesis is correct. (5) Run the observation. If it disconfirms the hypothesis, return to step 2 with new information. (6) Only after the root cause is identified does code change.

The skill's value is not what it tells Claude to do; it is what it forbids. Without it, Claude rushes toward a fix. With it, Claude is structurally constrained toward investigation. Production teams report dramatic reductions in regression-introduction rates after installing a debugging skill of this shape.

Pair with §201 (Code Review as an Agent Team) for compounded effect: the debugger investigates root cause; the reviewer team verifies the fix does not introduce new defects.

## §214 — Prototype-the-Spec: PM Workflow on the Exponential

The product-management discipline shift, drawn from Anthropic's Managed Agents PM (April 29, 2026): API design used to live in documents and comment threads; in the agentic era, build with what you ship. A spec that reads elegantly in a doc can fall apart the first time you try to build against it.

The workflow split is concrete and replicable. Use Claude (chat) and Claude Cowork for open-ended research and discovery — the murky, early-stage exploration where ongoing conversation is the right mode. Once the job-to-be-done is sharp, switch to Claude Code to write and ship a custom agent for it, built atop Managed Agents. The two-pronged payoff: building against your own product raises the ceiling on what you can imagine shipping next, and the same development muscle automates the long tail of operational work that used to stall in your backlog.

The standard PM-day-one prompt sequence: chat to surface the shape of the problem; switch to Claude Code with the Managed Agents skill loaded; sketch the agent in plain English; let Claude scaffold it; iterate end-to-end before any spec is finalized. Multi-week doc reviews are replaced by an afternoon of running prototypes.

The unlock for non-engineering PMs: the latest Claude Code includes the built-in `claude-api skill`. Prompt with "start onboarding for managed agents in Claude API" and Claude walks the integration steps inline. No prior infrastructure familiarity required.

## §215 — Bespoke Agents Per Job-To-Be-Done

The new operational unit for any role-specific workflow is a bespoke Managed Agent — not a Zapier flow, not a one-off script, not a recurring meeting. Three reference patterns from the Managed Agents launch:

The Adoption Analytics agent has persistent access to internal databases plus skills for understanding the data schemas. It runs queries, surfaces interesting outliers and patterns, and uses memory of prior runs (§102) to build on previous findings. It compounds — each run is smarter than the last because it remembers what it has already investigated.

The Developer Sentiment Monitoring agent uses the pre-built web search tool plus guidance on focus areas to scan a specific list of domains for the latest user feedback. Because the volume of content is high, it fans out research to multiple agents in parallel (§9C Orchestrator-Subagent), waits for results, and synthesizes the findings into a single report.

The Demo Building agent has access to demo GitHub repos, branding assets, and an event deck. It turns prebuilt templates into a polished demo tailored to the audience for a specific conference or customer meeting. The same workflow that previously required 1–2 hours per event becomes a single prompt.

The pattern generalizes. Anywhere there is a recurring job that requires interpretation plus access to internal data plus a tailored output, a bespoke Managed Agent is the right shape. The build cost is roughly an afternoon. The runtime cost is fractions of a dollar per invocation. The operational cost is zero.

## §216 — The claude-api Skill and /claude-api Commands

The `claude-api` skill (introduced in Claude Code in March 2026, expanded April 29, 2026 to CodeRabbit, JetBrains, Junie, Resolve AI, and Warp) captures the details that make Claude API code work well: which agent pattern fits a given job, what parameters change between model generations, and when to apply prompt caching. It stays current as SDKs change. The result is fewer errors, better caching, cleaner agent patterns, and smoother model migrations.

Three high-leverage invocations work anywhere the skill is available:

"Improve my cache hit rate" → applies the prompt-caching rules in §217 that most developers miss.

"Add context compaction to my agent" → walks through the compaction primitives and the cache-safe forking pattern in §218.

"Upgrade me to the latest Claude model" → reviews code and updates model names, prompts, and effort settings for a new model. In Claude Code specifically, this is invocable directly as `/claude-api migrate`. The migration command updates model references, moves manual thinking settings to adaptive thinking (§8B), removes outdated parameters and beta headers, and suggests the right effort level inline.

"Build a deep research agent for my industry" → walks through configuring Managed Agents end-to-end. In Claude Code, invocable directly as `/claude-api managed-agents-onboard`.

The skill is open source at github.com/anthropics/skills/tree/main/skills/claude-api . Any Claude-powered coding tool can bundle it; setup is roughly 20 lines of CI. The migration on every model release is the biggest single workflow improvement: the §74 upgrade-day prompt becomes a single command.

## §217 — Prompt Caching Is Everything: The Cache-Prefix Discipline

The single highest-leverage technical pattern from the April 30, 2026 Claude Code engineering post: prompt caching is the foundation that makes long-running agentic products feasible. Reusing computation across roundtrips is what allows Claude Code's pricing and rate limits to make economic sense at scale. Anthropic runs alerts on cache hit rate and treats cache breaks as production incidents.

The mechanism: the API caches everything from the start of the request up to each `cache_control` breakpoint. Caching is prefix-match — any change anywhere in the prefix invalidates everything after it.

The four-layer prompt structure that maximizes hit rate, ordered most-stable to least-stable:

(1) Static system prompt and tool definitions — globally cached across all sessions.
(2) CLAUDE.md content — cached within a project.
(3) Session-specific context — cached within a single session.
(4) Conversation messages — only the new turn invalidates.

The fragility is real. Cache breaks observed in production at Anthropic include: putting an in-depth timestamp in the static system prompt; shuffling tool order non-deterministically across requests; updating tool parameters mid-session.

The five hard rules: (a) static content first, dynamic content last; (b) never change models mid-session — cache is unique to the model, so switching from Opus to Haiku at 100K tokens costs more than completing on Opus; (c) never add or remove tools mid-session — use tools to model state transitions instead (see §220); (d) for time updates or file changes, push them via a `<system-reminder>` tag in the next user message rather than editing the prompt; (e) monitor cache hit rate like uptime — a few percentage points of cache miss can dramatically affect cost and latency.

The implication for any agent built on the API: design the entire system around the prefix-match constraint from day one. Get the ordering right and most caching works for free.

## §218 — Cache-Safe Forking (Compaction Without Breaking Cache)

The naive compaction pattern — separate API call with "summarize this" system prompt and no tools — is exactly the trap. Caching only applies when the prefix matches byte-for-byte from the start. The summarization call's prefix diverges at the first token, so the entire conversation re-bills at the uncached input rate. The longer the conversation needing compaction, the more expensive the compaction itself.

The fix is cache-safe forking: when running compaction, use the exact same system prompt, user context, system context, and tool definitions as the parent conversation. Prepend the parent's conversation messages, then append the compaction prompt as a new user message at the end. From the API's perspective the request looks nearly identical to the parent's last request, so the cached prefix is reused. The only new tokens are the compaction prompt itself.

Reserve a "compaction buffer" of context window space — enough room for the compaction prompt and the summary output tokens. Without the buffer, compaction can trigger context-overflow errors at the wrong moment.

The same forking principle generalizes. Any side computation — skill execution, summarization, validation pass, side question — should reuse the parent's prefix where possible. Forking with identical cache-safe parameters means the side computation gets cache hits on the parent's prefix, and only the new instructions are billed at full rate.

This pattern is now built directly into the API as native compaction (`platform.claude.com/docs/en/build-with-claude/compaction`). For new agents, use the native primitive. For existing agents, port to it during the next refactor.

## §219 — Tool Search and defer_loading

Loading dozens of MCP tool definitions on every request consumes meaningful context budget. Removing tools mid-conversation breaks the cache (§217). The native solution: `defer_loading: true` on tool stubs.

The mechanism: send lightweight stubs (the tool name and a short description, marked `defer_loading: true`) instead of the full tool schemas. The model can "discover" tools via the tool search tool (§105) when needed. Full schemas load only when the model selects them. The cached prefix stays stable because the same stubs always appear in the same order.

The composed payoff: Anthropic's internal testing reports an 85%+ reduction in tool-definition tokens with high selection accuracy preserved (§105 Pattern 1), plus a roughly 37% reduction on multi-step workflows (§105 Pattern 2). The combination compounds across servers — leaner context, fewer round-trips, faster responses.

The integration cost is low. Existing MCP configurations gain `defer_loading: true` on individual tools. The agent's behavior is unchanged. The cache hit rate jumps. Run this audit on every project with five or more MCPs.

## §220 — Plan Mode Is a Tool, Not a Tool Swap

The instructive design lesson: when Claude Code's Plan Mode shipped, the obvious implementation was to swap out the tool set for read-only tools when entering Plan Mode. This would break the cache at every mode toggle.

The shipped solution keeps all tools in the request at all times and uses `EnterPlanMode` and `ExitPlanMode` as tools themselves. When the user toggles Plan Mode, the agent gets a system message explaining the mode and its constraints — explore the codebase, do not edit files, call `ExitPlanMode` when the plan is complete. Tool definitions never change. The cache survives every mode toggle.

A bonus: because `EnterPlanMode` is a tool the model can call autonomously, the agent can self-elect into Plan Mode when it detects a hard problem, without any cache break.

The general principle: model state transitions through tools, not through tool-set changes. Anywhere an agent has multiple modes — Plan vs Build, Read-Only vs Edit, Verbose vs Summary, Production vs Sandbox — the cache-preserving implementation is the same pattern. Add tools that gate behavior; never swap the toolset.

## §221 — Content Engineering vs Prompt Engineering (Kepler)

The Kepler Finance team's framing, drawn from their April 30, 2026 case study: "Prompt engineering optimizes a call. Content engineering optimizes the system around the call." For high-stakes domains, content engineering is the larger lever.

Kepler indexed 26M+ SEC filings, 50M+ public documents, 1M+ private documents, and 14,000+ companies across 27 global markets in under three months — and built infrastructure that validates every number to the exact filing, page, and line item. The breakthrough was not a better prompt. It was a deliberate split between deterministic infrastructure and LLM reasoning, with structured domain knowledge (proprietary ontology, definitions, and formulas) packaged around every Claude call.

The four content-engineering levers (apply to any verticalized AI product):

(1) Hand the model exactly what it needs to succeed at exactly its stage. Retrieval is a job for a query engine. Computation is a job for a formula engine. Claude is for interpretation, decomposition, and reasoning. Asking Claude to retrieve and compute and reason in one call leaves quality on the table — and creates verification gaps.

(2) Build a domain ontology. Map domain concepts to precise definitions and formulas. For finance: enterprise value, segment revenue, fiscal-period normalization. For healthcare: clinical-trial-data-to-treatment-protocol mapping. For legal: precedent traceability. The ontology is customizable per use case, but the spine is shared.

(3) Define hard boundaries between resolve-locally and escalate-to-human. Most models, given an ambiguous term, pick one meaning and continue. Claude in Kepler's setup stops and asks the analyst to decide. That behavior matters more than any benchmark score because one wrong assumption early in the analysis breaks everything downstream.

(4) Build idempotent skills around the most common workflows. Same input, same output, every time. Skills coordinate between deterministic and nondeterministic stages. Kepler built skills for enterprise-value calculations across complex capital structures (preferred shares, convertibles, minority interests) and segment-revenue waterfall reconciliation across reporting-period changes — both are exactly the right shape for skill encoding.

## §222 — Deterministic Infrastructure + LLM Reasoning Split

The Kepler architectural pattern that generalizes to any verifiable AI product: surround the model with deterministic execution environments, and reserve the model for the parts that require interpretation. Same input always generates same output for everything that needs to be provably correct.

The split:

| Stage | Engine | Why |
|---|---|---|
| Retrieval | Query engine (deterministic) | Same query → same documents |
| Computation | Formula engine (deterministic) | Same numbers in → same numbers out |
| Interpretation | Claude (Opus 4.7 for hard reasoning) | Decompose intent, resolve ambiguity, produce structured plans |
| High-throughput constrained tasks | Claude (Sonnet 4.6) | Where tasks are well-bounded |

The benefit at scale: a small team can build the equivalent of what would otherwise require many domain-specific NLP engineers. Kepler's claim is that new capabilities that would take a large team months ship in weeks because the architecture is modular. Reasoning improves at one stage without touching the rest of the pipeline.

The pattern applies wherever professionals need verifiable answers from large document collections — finance, healthcare, legal, compliance, regulatory. The architecture is domain-agnostic; the ontology is domain-specific.

## §223 — Model-Stage Matching for Multi-Stage Pipelines

Running a verticalized AI pipeline on a single model leaves either quality or cost on the table. The Kepler stage-matching policy makes the trade-offs explicit:

Opus 4.7 for complex reasoning — decomposing intent, resolving ambiguity, producing structured execution plans, navigating overloaded terminology, holding long multi-step plans together. The benchmark difference: on long, multi-step plans with interdependencies, all but Claude started taking shortcuts or losing track of constraints by the fourth or fifth step. Opus consistently held the plan together.

Sonnet 4.6 for high-throughput constrained stages — where the task is well-defined and the input space is bounded. Tasks that benefit from Opus's depth on edge cases but where most calls are routine.

Specialized models trained on the domain (some Claude-foundation, some proprietary) for narrow recall tasks. Kepler reports 94% accuracy on mapping financial statement labels to standardized taxonomy codes, versus 38–46% for off-the-shelf models. The lesson: for genuinely narrow, high-volume tasks, fine-tuned smaller models can outperform much larger general models.

The composition principle: each stage gets the smallest model that delivers the required quality. The synthesis point gets the strongest model. Cost compounds as the pipeline grows; quality compounds as the model fits.

The Advisor Tool (§9B) is the simplest expression of stage-matching for any team that does not need a custom pipeline. Sonnet 4.6 as executor with Opus 4.7 as advisor delivers +2.7% on SWE-bench Multilingual versus Sonnet alone, with 11.9% cost reduction per agentic task.

## §224 — Ground-Truth Evaluation Pipelines (The Pre-Production Gate)

The Kepler verification discipline is now the standard for any production AI deployment in a regulated or trust-critical domain: every prompt change, model upgrade, and context modification is tested against thousands of cases before production. Automated evaluation pipelines compare Claude's output against known-correct answers at every stage, checking both the structured plan and the final computed result.

When a test fails, the failure is traceable — the issue was in Claude's reasoning, the context provided, or the downstream execution, and the trace identifies which. When Anthropic ships a new model, Kepler benchmarks within hours and knows exactly which stages improve, which regress, and which need prompt adjustments.

The four operational rules:

(1) Test every stage independently. End-to-end tests catch nothing about which stage broke.

(2) Test the full pipeline end-to-end. Stage-level tests catch nothing about composition errors.

(3) In high-stakes domains, a silent regression is how you lose a client permanently. The cost of detection has to be lower than the cost of one missed regression.

(4) The evaluation pipeline is itself a project artifact. Version it. Update it. Treat regressions in the eval suite as production bugs.

This pattern extends §22 (Skill-Creator with evals) to the entire pipeline. The skill-creator workflow scales to per-skill evals; this scales to whole-system evals. Wire the eval suite into a Routine that fires nightly and on every model release.

## §225 — Provenance from Day One

Professionals in regulated industries (finance, legal, healthcare, compliance) are trained to verify everything. Every figure must trace to a source document. Provenance is not a feature added at the end — it has to shape the entire system.

The Kepler implementation: every figure pulled from verified SEC filings is tagged at ingest with the filing, page, and line item. Computation routes through deterministic infrastructure that preserves the lineage. The result is an Excel template where, with a single click, analysts trace each number back to its exact line item highlighted in the source document.

The four design rules: (a) tag every fact with its source at ingest, never retroactively; (b) preserve lineage through every computation — operations on facts produce new facts whose lineage references the inputs; (c) require source-of-truth resolution for every output, not just every input; (d) build the audit log as a first-class artifact that downstream compliance systems consume.

The compliance package required to even engage with regulated buyers: full audit logging, siloed customer environments, end-to-end provenance, SOC 2 Type II, ISO 27001 (or in progress). Build this from the start; retrofitting costs more and delays the first regulated-customer contract by quarters.

Kepler's architecture is domain-agnostic by design. The team started in finance deliberately — dense data, overloaded terminology, complex calculations, zero tolerance for error. The architecture built to survive that scrutiny applies wherever professionals need verifiable answers from large document collections.

## §226 — Cowork Five-Level Maturity Model

The April 29, 2026 Cowork enterprise deployment guide formalizes adoption maturity. Use it to diagnose where any team currently sits and what the next move is.

Level 1 — Chat Q&A. Individuals using Claude (chat) for drafting, summarization, research. Value is per-individual. No shared infrastructure. The default starting point for non-developer teams.

Level 2 — Connected Workflows. Cowork installed; users connect Slack, Google Drive, Gmail, the browser. Claude operates across local files plus connected apps. Value compounds within the individual's workflow. Skills are not yet shared.

Level 3 — Shared Skills. Skills built by power users are installed by the team. The accountant who built the variance-analysis skill makes it available to every analyst. Value compounds at the team level. The team's procedural knowledge becomes inheritable.

Level 4 — Shared Plugins. Plugins (skills + MCPs + hooks bundled per §106) deploy across departments. Finance gets the data plugin; legal gets the contract-review plugin; sales gets the deal-pipeline plugin. Value compounds at the department level. Each plugin is the encoded operating procedure of a function.

Level 5 — Department-Wide Plugins. Plugins are managed centrally — versioned, audited, governed. The shared firm infrastructure that the Cowork blog quotes Airtree describing. Skills built by one person are used by everyone, and the organization develops a portfolio of reusable AI capabilities.

The honest assessment: most enterprises in mid-2026 sit at Level 1 or 2. Level 3 requires deliberate investment in skill authorship. Level 4 requires plugin-development capacity. Level 5 requires governance, security, and analytics maturity. The right next move is always one level up — never skip levels because the operational discipline at each level is what makes the next level work.

## §227 — Cowork Six-Month Deployment Roadmap

The standard rollout cadence for moving from champion teams to organization-wide deployment:

Month 1 — Champion team selection. Identify 3–5 power users across distinct functions. Provide Cowork access plus skill-creator training. Collect baseline metrics (hours-per-week on rote tasks, deliverable cycle time).

Month 2 — First production skills. Each champion ships at least two domain-specific skills. Champions document the skill purpose, trigger conditions, and expected output. Internal blog post or all-hands demo.

Month 3 — Pilot expansion. Each champion onboards 5–10 colleagues. Skills move from individual to team. Build the first plugin (skills + MCPs + connectors bundled) for the strongest function.

Month 4 — Department rollout. The pilot department deploys Cowork plus plugins to every team member. Collect post-deployment metrics versus baseline. Identify the next two departments for rollout.

Month 5 — Cross-department pattern recognition. The plugins from one department are reviewed for cross-department applicability. Shared infrastructure (RBAC, group spend limits, OpenTelemetry pipelines) is configured per §10C.

Month 6 — Organization-wide. Cowork becomes the default surface for any non-developer workflow. Plugins are governed centrally. Analytics dashboards track usage and cost by team. The organization's procedural knowledge is encoded as inheritable infrastructure.

The customer references the Cowork blog highlights — Thomson Reuters, Zapier, Jamf — all describe this arc. The patterns are broadly applicable across industries and company sizes. The variable is not what to do; it is how fast each level can be sustained.

## §228 — Three Pillars of Enterprise AI Transformation

The April 30, 2026 enterprise-agents guide names three pillars that distinguish AI deployments that compound from those that plateau within a quarter:

Pillar 1 — Upskill employees with AI that reflects how the organization actually works. Generic Claude.ai usage is not transformation. Encoding the firm's voice, style, decision criteria, and approval workflows into skills and plugins is what produces durable productivity gains. Reference deployments (L'Oreal, Lyft, Rakuten) describe specific encoded workflows tied to specific business outcomes.

Pillar 2 — Compress information-dense processes without sacrificing human-in-the-loop judgment. The high-leverage targets are workflows where humans currently spend most of their time on retrieval, formatting, and synthesis — leaving little time for the judgment the firm actually pays them for. Compress retrieval/format/synthesis with Claude; reserve the human for the judgment. The Rakuten figure cited elsewhere (97% fewer first-pass errors at 27% lower cost and 34% lower latency on long-running learning agents — §102) is what this pillar achieves at scale.

Pillar 3 — Build new product capabilities that generate revenue, not just reduce cost. The cost-reduction story plateaus because cost cannot go below zero. The revenue-generation story compounds because each new capability creates a new market surface. Verticalized AI products that productize internal workflows for external customers are the high-multiplier path. Kepler is one such productization (§221–§225); it captures domain-specific infrastructure into a customer-facing platform.

The "agentic thinking divide" the guide calls out: organizations that view agents as tools-to-deploy plateau; organizations that view agents as employees-to-manage compound. The Digital Employee mental model (§83) is the operational form of this distinction. Wire it into every agent with named personas, written job descriptions, and tracked KPIs.

## §229 — Claude Security: Native Replacement for the §12 Audit

Claude Security (public beta as of April 30, 2026, formerly Claude Code Security) makes the §12 manual security audit largely obsolete for Enterprise customers. It uses Opus 4.7 to scan repositories for vulnerabilities and generate targeted patches, available directly from the Claude.ai sidebar or at claude.ai/security . Available now to Enterprise; Team and Max access coming.

The mechanism differs from pattern-matching scanners. Claude reasons about code as a security researcher would — understanding component interaction across files and modules, tracing data flows, reading the source. Each finding includes a confidence rating, severity, likely impact, and reproduction instructions. The multi-stage validation pipeline independently examines each finding before it reaches an analyst, keeping signal high.

The four production-tested capabilities, refined across hundreds of enterprise pilots:

(a) Confidence-rated findings with reproduction steps. The signal that reaches the team is worth acting on.
(b) Time-from-scan-to-fix as the metric that matters. Multiple teams report scan-to-applied-patch in a single sitting versus days of back-and-forth between security and engineering.
(c) Scheduled scans for ongoing coverage rather than one-off audits. Set a regular cadence around reviewing and acting on findings.
(d) Targeted scans (per directory or branch), dismissable findings with documented reasons (so future reviewers trust prior triage), CSV/Markdown export for audit systems, and Slack/Jira webhook integration.

The deployment options expanded to the broader ecosystem. Direct in Claude Security for Enterprise customers. Embedded in CrowdStrike Falcon, Microsoft Security, Palo Alto Networks, SentinelOne, TrendAI, and Wiz for organizations using those platforms. Through services partners (Accenture, BCG, Deloitte, Infosys, PwC) for organizations preferring a guided rollout.

The §12 audit prompt in V1.0 still has value for non-Enterprise teams and for in-CI lightweight scanning. The shift: for any Enterprise team, run Claude Security as the default audit and reserve the §12 prompt for ad-hoc spot checks during development. For non-Enterprise teams, keep the §12 prompt as the primary audit until Team-tier access opens.

The note on safeguards: Opus 4.7 includes cyber safeguards that automatically detect and block requests suggestive of prohibited or high-risk cybersecurity uses. Organizations doing legitimate security work that may trigger these safeguards can join the Cyber Verification Program — frontier capability access for verified defenders.

## §230 — `/ultrareview`: The Cloud Bug-Hunter Fleet

`/ultrareview` is a research-preview command shipped in Claude Code v2.1.86 (with branch and PR modes formalized in v2.1.111 on April 16, 2026). It launches a fleet of reviewer agents in a remote Anthropic sandbox to find bugs in your branch or pull request. Each finding is independently reproduced and verified before it is surfaced.

The mechanism, four stages in the cloud sandbox:

(1) Setup — Anthropic provisions remote infrastructure and spins up the agent fleet. Default fleet is 5 agents; configurations support up to roughly 20. Setup takes about 90 seconds.
(2) Find — Agents explore different execution paths through the changed code in parallel. Race conditions, logic errors, and cross-module type mismatches receive pressure from multiple angles at once.
(3) Verify — Separate agents independently reproduce each candidate finding. Anthropic's internal target is below 1% incorrect-finding rate. The verification stage is what differentiates this command from `/review`.
(4) Deduplicate — Multiple agents often surface the same issue from different angles. Dedup combines them into a single, enriched finding with multi-angle context.

A typical review takes 5–20 minutes depending on diff size. It runs as a background task — terminal stays usable, the session can close, and findings drop into Claude Code and Claude Desktop when ready. Track with `/tasks` ; stop with `/tasks` (stopping archives the session and returns no partial findings).

The two invocation modes:

`/ultrareview` (no arguments) — reviews the diff between the current branch and the default branch, including uncommitted and staged changes. Use when working locally on a manageable repo.

`/ultrareview <PR-number>` — clones directly from GitHub. Use when the repo is too large to bundle, or when reviewing a PR opened by a teammate. Push the branch, open a draft PR, then pass the number.

The CI variant: `claude ultrareview <args>` runs the same review headlessly. It launches the remote review, blocks until complete, prints findings to stdout, and exits 0 on success or 1 on failure. Wire into pre-merge CI for any branch where the diff justifies the cost.

Free runs: Pro and Max subscribers receive three free ultrareview runs to try the feature. **The runs are a one-time allotment per account, do not refresh, and expire May 5, 2026.** After the free allotment ends or expires, each review bills as extra usage at typically $5–$20 depending on diff size. Team and Enterprise plans pay per review from the start (no free tier).

Prerequisites: Claude Code v2.1.86 or later; authentication with a Claude.ai account (API-key-only auth does not qualify); extra usage enabled on the account (verify with `/extra-usage` ). The command blocks at launch if extra usage is off and cannot be enabled mid-flow.

## §231 — Spending the Three Free Runs Before May 5, 2026

The free allocation is small and expiring. Treat it as test capital, not as a routine review tool.

What to spend free runs on:
- Authentication and authorization changes (auth flows, session handling, RBAC additions, OAuth integrations) — the highest-cost-when-broken category.
- Schema migrations on production databases, especially anything that touches a 1M+ row table, modifies indexes, or alters constraints. The reviewers catch lock-duration risks that single-pass review misses.
- Refactors on shared components — anything imported by 10+ files where the blast radius of a regression is large.
- Payment, billing, or fiduciary code paths. The cost of a single production bug here easily justifies the run.
- Pre-launch reviews of any new product surface that will be exposed to customer traffic.

What to never spend free runs on:
- Typo fixes, dependency bumps, formatting-only PRs, single-file CRUD additions. The expected finding count is too low to justify the run.
- Repos with no diff against the default branch — the command returns "no commits or changes to review."
- Branches still mid-implementation. Run `/review` (local, fast, free) until the branch is genuinely merge-ready, then spend the ultrareview run on the final shape.
- PRs you have not yet read. The reviewers find bugs; the human reviewer judges whether the bugs matter for the product, the user, the roadmap. Reading the PR first is what makes the findings actionable.

The recommended allocation across the three free runs by May 5, 2026, for a typical operator: Run 1 — an authentication or authorization PR. Run 2 — a schema migration. Run 3 — a refactor on shared components. This spread covers the most expensive risk classes and produces a personal calibration of whether the post-trial pricing ($5–$20 per review) is worth it for the operator's specific risk profile.

The pre-flight checklist: confirm `/extra-usage` is on; commit (or at least stage) everything in the diff so the bundle is predictable; ensure CLAUDE.md is tight (the reviewers read it — non-obvious project rules belong there so the review enforces them); pair with `/security-review` for any security-sensitive subset of the change.

## §232 — `/ultrareview` vs `/review` vs Code Review (the Three-Tier Decision)

Three different review primitives exist. They target different stages and different cost profiles.

Tier 1 — `/review` (every PR). Fast, cheap, local. Single-pass scan inside the Claude Code session. The right tool for typo fixes, config edits, dependency bumps, single-file changes, and any branch you are still iterating on. Anthropic reports a 31% finding rate on small PRs, averaging 0.5 issues per scan. Use it freely.

Tier 2 — `/ultrareview` (substantial pre-merge changes). Cloud-based. Multi-agent fleet with independent verification. The right tool for auth, migrations, refactors, and any change where confidence matters before merging. Costs $5–$20 per run after the free allotment. Use it deliberately on the changes that would keep you up at night if something slipped through.

Tier 3 — Claude Code `code-review` (Team and Enterprise, multi-agent PR review on every PR). The agent-team pattern from §201. Wired to the GitHub webhook so it fires on PR-opened events and posts inline review comments before any human reviewer is requested. Roughly 84% of large PRs receive findings worth acting on; sub-1% of findings are flagged as incorrect by reviewers. Cost runs $15–$25 per review.

The honest production framework after a week of testing the three tiers:

| PR type | Primary tool | Why |
|---|---|---|
| Trivial (typo, dep bump, single-line) | `/review` | Fast, free, sufficient |
| Small feature (under 200 lines, low blast radius) | `/review` + `code-review` if Team/Enterprise | The webhook automation pays for itself |
| Substantial change (auth, migrations, refactors) | `/ultrareview` + human review | Verification is what justifies the cost |
| Security-sensitive subset | `/security-review` + Claude Security scan | Specialized tooling beats general tooling |
| Pre-launch feature surface | All three tiers + manual product-fit review | Last gate before customer traffic |

A team pushing 10 PRs/day running ultrareview on every PR is at $150–$250/day or roughly $3,000–$5,000/month for code review alone. That math is justified only if it catches at least one production bug per month that would have cost more to fix post-deployment. Most teams should run ultrareview on the substantial-change subset (typically 10–20% of PRs) and `/review` plus `code-review` on the rest.

What `/ultrareview` is not:
- Not a replacement for CI. Test suites, type checkers, and linters still run where they ran. Ultrareview adds a semantic layer on top; it does not replace the mechanical layer.
- Not a replacement for human review. The fleet catches a lot, but it does not know your product, users, roadmap, or why specific tradeoffs are right. Human reviewers still matter — ultrareview makes their time more valuable by handling what a machine can handle first.
- Not full-codebase audit. Scope is the diff vs. the default branch. A finished, fully committed codebase with no recent changes produces a near-empty result. Use Claude Security (§229) for whole-codebase audit.
- Not invokable from inside an agent or subagent. The command is user-triggered by design — an intentional human types it.

## §233 — The Trainee-Developer Mental Model

The MacCoss Lab framing is the operational mental model that ties §211–§232 together: treat Claude Code as a trainee developer being onboarded onto the codebase, not as a magic productivity multiplier.

What this changes in daily practice:

(1) You would not hand a new hire a 700,000-line codebase and expect day-one results. You would find them a contained project, walk them through it, and expand scope as understanding grew. Apply the same scope-management discipline to Claude — start with bounded tasks; expand as the context layer (§211) accumulates.

(2) You would document the codebase for the new hire. The CLAUDE.md plus skills layer is exactly that documentation, written for an agent. Keep it short, structured, and reference-don't-embed (§212).

(3) You would expect the new hire to ask questions and admit ignorance rather than guess. The debugging skill (§213) and the content-engineering escalation rule (§221, point 3) enforce the same discipline on the agent.

(4) You would track the new hire's performance and adjust. The §84 three-strike termination policy and the §224 ground-truth eval pipelines enforce the same discipline on the agent.

(5) You would expect mistakes early and steady improvement over weeks. The §7C self-annealing protocol and the §7 self-optimization meta-prompts encode the improvement loop.

The mental-model shift to internalize: "Claude can't truly learn about my large project" is the wrong frame. The right frame is "context is just another artifact to maintain and grow." Once enough context exists, an engineer can work across branches and time points — and so can Claude. The work of building and maintaining that context layer is what most developers skip, and it is why most developer success plateaus.

## §234 — Updated Cleanup Cadence (V1.2)

The §210 cleanup cadence still applies. V1.2 adds two recurring tasks tied to the new patterns:

Weekly: review cache hit rate metrics for any production agent built on the API. A multi-percentage-point drop is a cache break and should be triaged within 24 hours per §217. Add the metric to the same dashboard as uptime.

Per release: when any Anthropic model updates, run `/claude-api migrate` (§216) on every project on the API. The skill catches old parameter names, deprecated thinking budgets (§8B), outdated beta headers, and missing effort-level updates. Run before the §74 upgrade-day pass, since the migration informs which prompts need re-tuning.

Per significant PR: the three-tier review framework (§232) with explicit policy on which tier each PR class lands in. The policy belongs in CLAUDE.md or `.claude/rules/code-review.md` so reviewers and contributors share the same expectation.

Per quarter: re-run the §80 distillation prompt on the accumulated active/ folder, this time including any new skills built per §211–§213 and any new agents built per §215. Promote learnings into the global CLAUDE.md and into the canonical skill set.


# SOURCES

**Anthropic platform documentation and engineering blogs (April 2026):**
- "Multi-Agent Coordination Patterns" (Apr 10, 2026)
- "Seeing Like an Agent" (Apr 10, 2026)
- "The Advisor Strategy: Give Agents an Intelligence Boost" (Apr 9, 2026)
- "Building Agents with Skills: Equipping Agents for Specialized Work" (Jan 22, 2026)
- "The Complete Guide to Building Skills for Claude" (Jan 29, 2026)
- "Improving Skill-Creator: Test, Measure, and Refine" (Mar 3, 2026)
- "Code Review" (April 2026)
- "Auto Mode" (April 2026)
- "Product Management on the AI Exponential" (April 2026)
- "Introducing Routines in Claude Code" (Apr 14, 2026)
- "Redesigning Claude Code on Desktop for Parallel Agents" (Apr 14, 2026)
- "Claude Cowork" (October 2025 launch; Enterprise April 2026)
- "Claude Managed Agents" (Apr 8, 2026)
- "Built-in Memory for Claude Managed Agents" (Apr 23, 2026)
- "Building Agents That Reach Production Systems With MCP" (Apr 22, 2026)
- "New Connectors in Claude for Everyday Life" (Apr 23, 2026)

**Anthropic engineering blog posts (April 28–30, 2026):**
- "Onboarding Claude Code like a new developer: Lessons from 17 years of development" (Brendan MacLean / MacCoss Lab, Apr 28, 2026) — pwiz-ai context repository pattern, reference-don't-embed skills, debugging skill design.
- "Product development in the agentic era" (Jess Yan, Managed Agents PM, Apr 29, 2026) — prototype-the-spec workflow, Claude/Cowork-for-discovery plus Claude-Code-for-shipping split, bespoke Managed Agents per job-to-be-done.
- "Claude API skill now in CodeRabbit, JetBrains, Resolve AI, and Warp" (Apr 29, 2026) — `/claude-api migrate`, `/claude-api managed-agents-onboard`, model-migration as a guided IDE workflow.
- "Deploying Claude across the enterprise with Claude Cowork" (Apr 29, 2026) — five-level maturity model, six-month deployment roadmap, Thomson Reuters / Zapier / Jamf customer references.
- "How Kepler built verifiable AI for financial services with Claude" (Apr 30, 2026) — content engineering vs prompt engineering, deterministic-infrastructure-plus-LLM-reasoning split, model-stage matching, ground-truth evaluation, provenance from day one.
- "Lessons from building Claude Code: Prompt caching is everything" (Thariq Shihipar, Claude Code engineering, Apr 30, 2026) — cache-prefix discipline, cache-safe forking, tool search and `defer_loading`, Plan-Mode-as-tools.
- "Claude Security is now in public beta" (Apr 30, 2026) — Opus 4.7 vulnerability scanning, multi-stage validation pipeline, scheduled scans, partner integrations (CrowdStrike, Microsoft Security, Palo Alto, SentinelOne, TrendAI, Wiz).
- "Building AI agents for the enterprise" (Apr 30, 2026) — three pillars of enterprise AI transformation, agentic-thinking divide, L'Oreal / Lyft / Rakuten reference deployments.

**Practitioner sources:**
- Nick Saraf, "4-Hour Beginner Claude Code Course" (2025–2026)
- Nick Saraf, "Advanced Claude Code Course" (2026)
- Nick Saraf, "Agentic Sells Course" (2026) — DOE framework, self-annealing protocol, enterprise sales motion
- Nick Saraf, "Routines walkthrough" (April 2026)
- Stack Podcast (Nick Saraf and Jack Roberts, April 2026) — Managed Agents practitioner deep-dive, token economics, war on context, ecosystem strategy
- Nick Saraf with Amir on HumbleLytics, Paper, design refinement (April 2026)
- Nate Herk, "99% of Claude Code Users Don't Know This About Tokens" (YouTube, April 2026)
- AI Daily Brief — Claude Design hands-on review (April 2026)
- AI Daily Brief Operators Bonus — Agent Madness (April 2026)
- SF49 / Actionable AI Accelerator — Remotion exact prompts (2026)
- Greg Isenberg (Startup Ideas Podcast) — Distribution Strategy framework

**Tooling and frameworks:**
- Andrej Karpathy — auto-research framework (`github.com/karpathy/auto-research`)
- Google Labs / DeepMind — Pomelli (October 2025 launch; March 2026 global expansion)
- Remotion — programmatic video framework
- HumbleLytics — Claude Code-native analytics

**Claude Code documentation:**
- `/ultrareview` research preview (code.claude.com/docs/en/ultrareview) — cloud-hosted multi-agent code review, branch and PR modes, three-free-run allocation expiring May 5, 2026, post-trial pricing of $5–$20 per review.
- Claude Code v2.1.86 (initial `/ultrareview` ship); v2.1.111 on April 16, 2026 (formalized branch and PR modes alongside Opus 4.7 release and the xhigh effort level).# The Master AI Playbook

**The Definitive Reference for Claude, Claude Code, and the Modern AI Stack**

A condensed compendium of every learning worth keeping from Anthropic engineering blogs, practitioner courses, podcast deep-dives, YouTube transcripts, and field-tested production patterns. The format is optimized for instructional density: definitions precede rules, mechanisms precede applications, and quantification is welded to the claim that requires it. Read it linearly to install a strong foundation; reference it sectionally once you know your way around.

## How to Use This Document

The numbering is historical, preserving the order in which each pattern entered the canon. Letter-suffixed sections (e.g., §2B, §10D) are extensions to a parent topic added in later revisions. Cross-references use the `§NN` notation. Imperative verbs ("run," "use," "set") indicate operational instructions. Numerical thresholds always carry units. Every example is generic — replace bracketed placeholders with project-specific values.

The document is organized in nine parts. Part 1 (Foundations) covers the global setup, slash commands, permission modes, CLAUDE.md hierarchy, sub-agents, MCP, skills, deployment, and security. Part 2 (Workflow Phasing) covers the canonical execution order — Setup → Research → Plan → Design → Build → Validate → Skills → Deploy → Optimize. Part 3 (Advanced Patterns) covers fan-out/fan-in, stochastic consensus, model-chat debate, agent teams, auto-research, and parallel development with git worktrees. Part 4 (Production Surfaces) covers Managed Agents, Cowork, Routines, Plugins, and the connector directory. Part 5 (Selling AI Workflows) covers the agency sales motion, the Overhang Pitch, and pricing frameworks. Part 6 (AI-Powered Marketing) covers the design and content stack — Claude Design, Paper, Pomelli, Remotion, HumbleLytics. Part 7 (Distribution) covers the seven mechanics for shipping AI products — MCP servers as sales teams, programmatic SEO, free-tool funnels, AEO, viral artifacts, niche newsletters, and AI content repurposing. Part 8 covers high-ROI additions — PM principles on the AI exponential, code review as an agent team, skill-creator evals and regression testing, notification hooks, status-line customization, the distillation prompt, direct Anthropic API patterns, the Conductor and Codex MCP diversification stack, and the cleanup cadence. Part 9 covers production engineering patterns — context-as-artifact discipline, reference-don't-embed skill architecture, prompt-caching cache-prefix discipline, content engineering, ground-truth evaluation pipelines, Cowork enterprise deployment, Claude Security, and the `/ultrareview` three-tier review framework.

---

# PART 1 — FOUNDATIONS

Configure these once before any project-specific work. Revisit quarterly as Anthropic ships changes.

## §1 — First-Time Setup

Install Claude Code with a single command per platform. macOS, Linux, and WSL: `curl -fsSL https://claude.ai/install | sh`. Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`. Authenticate by running `claude` and selecting the Pro, Max, Team, or Enterprise subscription path.

The recommended IDE is Antigravity (anti-gravity.google), Anthropic's purpose-built editor. Supported alternatives are VS Code with the Anthropic-verified Claude Code extension and JetBrains products with the Claude Code plugin from the JetBrains Marketplace. Inside the IDE, enable "Claude Code Allowed Dangerously Skip Permissions" via Extensions → Claude Code → Settings, and set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` to enable agent teams. The redesigned desktop application from claude.com/download is purpose-built for parallel sessions; full details appear in §14D.

## §2 — Essential Slash Commands

Slash commands operate on the active session. The frequency-ordered set:

`/init` scans the workspace and generates a local CLAUDE.md. Run it first inside any new project folder. `/context` displays a token breakdown by category; consult it before any large prompt. `/usage` displays the broader Claude Code consumption breakdown and informs whether to compact, clear, or continue. `/compact` compresses the conversation; trigger it at roughly 80% context occupancy. `/compact` accepts a steering hint — for example, `/compact preserve all API endpoints and database schema` — which controls what survives the summarization. `/clear` wipes the conversation entirely; use it when switching to an unrelated task. `/rewind` (or double-Esc) returns to a prior message and re-prompts; this is structurally superior to typing "that didn't work, try X" because the dead branch never accumulates the re-read tax (§71). `/cost` reports the running dollar spend and is useful for monitoring agent teams. `/model` switches between Opus, Sonnet, and Haiku; assign Sonnet to research subagents and Opus to synthesis. `/permissions` provides per-tool access control to lock down dangerous tools in production code. `/status line` customizes the terminal status bar; the recommended layout adds a token-usage progress bar, the active model, and the current Git branch. `/insights` runs subagents across the conversation history, intended for invocation after roughly 50 sessions, with the output fed back into the global CLAUDE.md. `/schedule` creates cron-style routines that execute on Claude Code's web infrastructure; existing `/schedule` jobs are now Routines (§10D).

The status line setup prompt: `/status line — Update my status line so it includes a loading bar showing tokens used out of total context, the current model, and the current git branch.`

## §2B — Opus 4.7 Effort Levels

Opus 4.7 replaces fixed thinking budgets with a five-tier effort system. The default `xhigh` sits between the legacy `high` and `max` tiers and applies to roughly 90% of work.

The five tiers, ordered by cost and capability: `low` for cost-sensitive, tightly scoped work — less capable on hard tasks but still outperforms Opus 4.6 at the same effort; `medium` for routine coding and simple refactors with a balanced cost-quality trade-off; `high` for concurrent sessions where the operator wants to spend less with minimal quality loss; `xhigh` (default) for most coding and agentic work — APIs, schemas, migrations, code review — delivering strong autonomy without runaway tokens; `max` reserved for genuinely hard problems and eval-ceiling tests, applied deliberately because of diminishing returns and overthinking risk.

Effort can be toggled mid-task. Existing Claude Code users who never manually set effort auto-upgrade to `xhigh`. Effort assignment by task type: long-form synthesis and consensus runs at `xhigh` to `max`; routine coding at `xhigh`; programmatic SEO page generation across thousands of pages at `low` or `medium`; stochastic consensus at `high` per agent (cost discipline, since N agents fan out); production code review at `xhigh`; simple file manipulation at `low`.

## §2C — `/btw` Side-Channel Overlay

`/btw` opens a quick overlay for questions that do not enter the main conversation history. Ask a clarifying question, read the answer, return to the main thread without polluting context. Use it for syntax lookups, API endpoint verifications, and definitional questions whose answers will not change subsequent work in the main thread. The anti-pattern is using `/btw` for questions whose answers should genuinely inform the main work — those belong in the main thread.

## §2D — `/rewind` Summarize-From-Here

Within the `/rewind` menu (accessed via double-Esc), the "summarize from here" option produces a handoff note from the current Claude iteration to the iteration that will resume after the rewind. Use it when rewinding to fix a wrong approach but the lessons from the dead branch should survive: Claude summarizes what was learned, the rewind executes, and the summary becomes the next prompt. Pair with the Session Handoff Protocol (§74) for the longer-form version when crossing the 120K threshold.

## §3 — Permission Modes

Permission mode controls how aggressively Claude executes file changes. Toggle via the bottom-left button in the GUI or `/permissions` in the terminal. Six modes are available.

**Ask Before Edits** prompts before every file change; reserve it for high-risk production code or compliance-sensitive content. **Edit Automatically** auto-edits existing files but asks before creating new ones; this is the general-development default. **Plan Mode** is read-only — Claude researches, reads, and reasons but makes no changes — and should precede any complex build. **Bypass Permissions** grants full autonomy to edit, create, and delete; use it for trusted tasks where speed matters and the operator is observing. **Auto Mode** is a middle path: a safety classifier evaluates each tool call before execution, allowing safe actions through and blocking destructive ones (mass file deletion, data exfiltration, malicious code execution); when blocked, Claude redirects to a different approach. **Delegate** is the agent-team-lead mode that can manage teams but not edit directly.

The recommended flow: start in Plan Mode, review the plan, switch to Auto Mode (if walking away) or Bypass Permissions (if observing) to execute.

Auto Mode is in research preview for Claude Code Max users. Toggle it with Shift+Tab after enabling via `claude --enable-auto-mode` (or in desktop and VS Code, Settings → Claude Code → Toggle Auto Mode). It is available on the Team plan now, with Enterprise and API rolling out, and works with both Sonnet 4.6 and Opus 4.7. It may have small impact on token consumption and latency. Anthropic recommends running it in isolated environments. Administrators can disable it via managed settings using `"disableAutoMode": "disable"`. Auto Mode is especially well suited to Opus 4.7 long-running tasks where full context is provided up front; because each user turn on 4.7 carries reasoning overhead, removing unnecessary check-ins compounds savings. Claude Code can also create its own hook-based notifications without setup ("Please play a sound when you're done with this task. Create whatever hook you need.").

The mode-selection rule: Bypass Permissions for quick trusted tasks under direct observation; Auto Mode for long tasks where the operator is absent for thirty minutes or more; Ask Before Edits for high-stakes production code or anything a regulator might read; Plan Mode for read-only planning and research.

To bypass all permission prompts globally on Windows: `'{"permissions":{"defaultMode":"bypassPermissions"}}' | Out-File "$env:USERPROFILE\.claude\settings.json" -Encoding utf8`. Restart the IDE.

## §4 — Global CLAUDE.md

CLAUDE.md is injected at the top of every conversation before the first user message. It sets the trajectory of the entire session: a one-degree heading error at departure becomes a hundred-mile miss across the ocean. Make it precise.

The file resolves in three layers, in order of precedence: Enterprise `~/.claude/CLAUDE.md` (managed, where applicable), Global `~/.claude/CLAUDE.md` (personal, applies to every workspace), and Local `.claude/CLAUDE.md` (per-project, workspace-specific).

A well-formed global CLAUDE.md includes seven blocks. **Profile** identifies the operator (role, domain, current ventures) so Claude can default to domain-appropriate language and formatting. **Standard interaction rules** are absolute behavioral constraints — for example, never delete `.env` files; do not over-explain or add unrequested improvements; use a single write call rather than many sequential edits; do not fetch well-known sites unnecessarily; read API documentation before attempting to use an unfamiliar platform, falling back to Chrome DevTools MCP if HTTP access fails; when instructed to "visualize app" or "open it," actually open Chrome rather than describing it; reason extensively in the thinking channel and keep output concise. **Opus 4.7 calibration** fixes the operating defaults: effort defaults to `xhigh`; fixed thinking budgets are not supported on 4.7; explicit cues steer reasoning depth ("Think carefully and step-by-step before responding; this problem is harder than it looks" pushes thinking up; "Prioritize responding quickly rather than thinking deeply. When in doubt, respond directly" pushes it down); 4.7 is less verbose, calls tools less often, and spawns fewer subagents by default — for aggressive search, fan-out, or parallel execution, specify the behavior explicitly. **Task-specification discipline** enforces the delegation model: treat Claude as a capable engineer being delegated to, not as a pair programmer guided line-by-line; specify intent, constraints, acceptance criteria, and relevant files in the first turn; batch all clarifying questions; ambiguous prompts spread across many turns reduce both token efficiency and quality. **Token conservation** rules: prefer single write calls over sequential edits; read documentation before coding to avoid retry loops; assign Sonnet to research subagents and reserve Opus for synthesis; prefer the Advisor Tool (§9B) to manual Opus subagents for API pipelines; compress learnings into CLAUDE.md rather than rediscovering them; one minute of planning saves ten minutes of building. **Self-Annealing Protocol** (§7C) is mandatory across every CLAUDE.md. **Lab Notes — What Not To Do** is a running log at the bottom of the file that auto-updates when mistakes are logged.

## §5 — CLAUDE.md Best Practices

Run `/init` first in any new folder. Use bullet points and short headings for high information density. Place critical guardrails at the top of the file: Claude exhibits primacy bias — beginnings are remembered best, then endings, with the middle the weakest. Review and prune CLAUDE.md periodically as living technical debt. When Claude makes the same mistake two or three times, instruct it to add the lesson to CLAUDE.md so a fresh instance does not repeat it. Use `@include` to reference other files rather than pasting them in.

Avoid four anti-patterns. Do not dump entire API documents or style guides — those belong in skills, which load on demand at roughly 60 tokens versus thousands. Do not write vague rules ("be smart," "make no mistakes"). Do not exceed roughly 500 lines. Do not paste raw voice transcripts directly — compress them through a cheaper model first.

To find current high-ROI patterns, query Grok on Twitter/X for the last month of CLAUDE.md writings from power users.

Two standard additions belong in every local CLAUDE.md. The Diversification rule mirrors any update into a parallel `agents.md` formatted for non-Claude coding agents (Cursor, Cody, Aider) so a provider outage does not halt operations. The running "Lab Notes — What Not To Do" section auto-updates as mistakes are logged.

## §6 — Rules Folder Structure

Split CLAUDE.md into independently editable rule files under `.claude/`. The top-level `CLAUDE.md` becomes a deliberately short high-level project summary. The `rules/` folder holds `workflow.md` (planning, building, verification), `tech-defaults.md` (stack preferences and API patterns), `design-rules.md` (UI/UX standards), and `security.md` (auth, RLS, key management). The `agents/` folder holds named subagent prompts: `code-reviewer.md`, `researcher.md`, `qa.md`. The `skills/` folder holds task-specific skill packs.

Benefits of the split: workflow can evolve without touching design rules; collaborators get scoped access to style rules while workflow control stays centralized; bloat surfaces immediately when one rule file grows oversized.

## §7 — Self-Optimization Meta-Prompts

Three meta-prompts run after every major task and embed in every CLAUDE.md.

**Meta-Prompt #1 (permanent, in CLAUDE.md):** "When you have made a mistake, update CLAUDE.md with a running log of things not to try next time, formatted as research notes for future Claude instances, all under 'Lab Notes — What Not To Do' at the bottom of the file."

**Meta-Prompt #2 (after any major task):** "How could you have arrived at these conclusions and done everything I just asked you to do faster and for fewer tokens? Save your answer in the local CLAUDE.md under 'User Preferences.'"

**Meta-Prompt #3 (after `/insights`, ~50+ sessions):** "Take this insights file. Distill the obvious design patterns and recurring miscommunications into high-information-density snippets ready to paste into the global CLAUDE.md, optimizing for token economy and avoidance of common Claude mistakes."

The local optimization loop has four steps: plan the feature; let Claude build it (with failures and successes); compile all learnings; update the local CLAUDE.md. Each cycle gets faster — roughly 0.9× → 0.8× → 0.7× the original time. The global optimization loop runs after hundreds of local runs: invoke `/insights`; distill the output into high-density global CLAUDE.md updates; manually review (human-in-the-loop is critical because compounding AI errors degrade quality); add the high-ROI bullets; repeat periodically.

## §7B — DOE Framework: Directive · Orchestration · Execution

DOE is a folder structure plus a system prompt drawn from Nick Saraf's Agentic Sells course. It narrows the agent's total range of possible outputs to a tightly bounded operating envelope — the bowling-guardrails analogy — and achieves a 2–3% error rate on business functions versus ~20% unconstrained.

**Layer 1 — Directives (the WHAT).** SOPs written as natural-language markdown files in a `directives/` folder. One directive per workflow: `scrape_leads.md`, `generate_om.md` — never `run_business.md`. Directives contain no code, so any employee can read them. Filenames are descriptive because the agent routes by filename. Each directive specifies goals, inputs, tools, expected outputs, and edge cases. Related directives may sit under umbrella directives (e.g., `run_onboarding_flow.md` referencing `scrape_leads.md`, `generate_proposal.md`, `send_email.md`).

**Layer 2 — Orchestration (the WHO).** The AI agent itself, acting as a project-manager nexus. It reads directives, makes runtime routing decisions, and calls tools. It replaces the human operator who used to wire n8n / Zapier nodes manually. With DOE, the agent ensures work completes according to directives but retains flexibility to handle breakdowns creatively. Subagents handle documentation flows that log changes for future instances.

**Layer 3 — Execution (the HOW).** Python scripts stored in `execution/` folder, each handling one job. Deterministic (same input → same output every time). Reusable across multiple directives — `send_email.py` invoked by both `scrape_leads.md` and `generate_proposal.md`. Scripts may include AI calls but only wrapped in predictable input/output contracts (low temperature, structured output). Unit-testable from the CLI: `python scrape_zillow.py --address "123 Main St" --radius 2`. Version-controllable. Scripts are not AI — they either work correctly or throw a clear error.

DOE works because pre-built tools replace construction on the fly (recipe versus inventing a new dish every time). When enough atomic scripts exist, multiple directives share the same tools — a force multiplier. Any non-technical employee can read and improve directives in plain English. The agent knows exactly what to expect from each execution script — no ambiguity.

The configuration files: `claude.md` / `agents.md` / `gemini.md` / `cursor.md` are the system prompts injected at session start; they explain the DOE structure to the orchestrator and define error handling. `.env` holds all API keys and credentials, never hardcoded. Maintain all model-specific config files simultaneously to switch IDEs and models freely.

The reference deployment (from Agentic Sells): Nick introduced DOE to a $2M/yr dental marketing company. He fed their entire knowledge base into Claude Code. Within fifteen minutes, most SOPs became agentic workflows. The director and managers now run 90% of economically valuable work through the IDE. Non-technical staff read and improve directives in plain English.

## §7C — Self-Annealing Protocol

The four-step self-annealing loop, drawn from Agentic Sells Chapter 25: an error fires; the agent diagnoses where and why it failed; the agent attempts the fix, trying at least three approaches before escalating; and the agent updates both the execution script and the directive to prevent recurrence. Add the protocol verbatim to every CLAUDE.md so failures route into permanent learning rather than ephemeral frustration. The standing instruction is to try super hard before escalating.

The protocol's economic logic: workflows get stronger over time, unlike n8n/Zapier flows that break silently when an upstream API changes. After approximately thirty runs of the same directive with self-annealing active, the workflow is battle-hardened.

## §8 — Context Management (1M Context + Context Rot)

The Claude Code context window is 1,000,000 tokens. The fixed overhead before the first message totals: system tools at ~17K, system prompt and CLAUDE.md plus rules at ~5–10K, MCP tools at a variable 5–20K (they load every message regardless of use, so be selective), `memory.md` at ~100 tokens, and ~60 tokens per registered skill (the body loads on demand). The remaining ~950K is the working space.

**Context Rot** is the central new concept. Model performance degrades as context grows because attention spreads across more tokens and older irrelevant content distracts from the current task. Possessing 1M tokens does not justify using 1M tokens; peak performance lives in the 10K–50K range for most tasks. Critical implication: the model is at its least intelligent point when autocompact fires, so always invoke `/compact` proactively with a description of upcoming work; never wait for autocompact.

After any Claude turn, five moves are available, not one. Continue (the default) sends another message in the same session. `/rewind` (double-Esc) jumps to a prior point and re-prompts. `/clear` starts a fresh session, ideally with a brief distilled from what was just learned. `/compact` summarizes the session and continues on top of the summary. A subagent (§9) takes the next chunk of work into a clean isolated context.

The decision matrix: continue when the same task remains relevant and everything in context is load-bearing; rewind when Claude went down a wrong path — the rewind preserves the useful file reads while dropping the failed attempt; `/compact` with a hint when the session is bloated mid-task with stale debugging or exploration; `/clear` when starting a genuinely new task; a subagent when the next step generates lots of intermediate output but only the conclusion is needed.

Rewinding beats correcting because telling Claude "that didn't work, try X" leaves the failed attempt in context and the re-read tax compounds (§71); rewinding deletes the dead branch entirely. Pair `/rewind` with the "summarize from here" option (§2D) so Claude leaves a handoff note. The default rule for new sessions: "new task = new session," with one exception — writing docs for a feature just implemented, where a new session would re-read everything redundantly.

`/compact` and `/clear` differ in who chooses what survives. `/compact` lets Claude summarize (lossy, low effort, steerable with hints — `/compact focus on the auth refactor, drop the test debugging`). `/clear` forces the operator to write the brief; more work, but the surviving context is exactly what was decided to be relevant.

Bad autocompact occurs when the model cannot predict where work is going. Example: a long debug session autocompacts after the bug is fixed; the summary focuses on the debug path; the next message refers to a warning that was dropped from the summary. With 1M context, runway exists to `/compact` proactively with the next direction included in the hint.

Strategies, ordered by impact: proactive `/compact` with direction hints; rewind over correction; plan before build (front-load research in Plan Mode, build in Bypass or Auto Mode); skills over MCPs (skills at ~60 tokens on demand vs MCPs at 1–5K+ always); subagents for conclusion-only work, applying the §9 mental test; Sonnet subagents for research at roughly 50× cost savings; Advisor Tool for API pipelines at 11.9% cost reduction; proactive monitoring via `/context` and `/usage` before big prompts.

## §8B — Adaptive Thinking

Fixed thinking budgets are not supported on Opus 4.7. The model uses adaptive thinking: thinking is optional at each step, and the model decides when to invest thinking tokens based on context. Where Opus 4.6 with a 32K thinking budget would think hard on every turn regardless of need, Opus 4.7 skips thinking on easy steps and invests on hard ones. Across an agentic run this compounds into faster responses and better UX, and 4.7 is also less prone to overthinking than 4.6.

To force more thinking, prepend: "Think carefully and step-by-step before responding; this problem is harder than it looks." To force less thinking, prepend: "Prioritize responding quickly rather than thinking deeply. When in doubt, respond directly."

Push thinking up on financial assumptions for high-value decisions, market positioning sections for institutional audiences, strategy parameter changes, tax and legal document review, and any consensus synthesis step. Push thinking down on repetitive CRUD, batch renders, programmatic page generation, simple file renames or imports or config edits, and code-review pass-throughs on low-stakes PRs.

## §70 — Fresh-Session Overhead Audit

Run `/context` before sending the first message in any new session. Tokens are already burning from the system prompt (~5–10K), the global plus local CLAUDE.md, MCP tools (5–20K+ if the loadout is heavy), skills front matter (~60 tokens per skill registered), and `memory.md` plus always-loaded rules. The practitioner benchmark: fresh sessions routinely consume 40–60K+ tokens before the first user prompt with a heavy MCP loadout; one report measured 62K at t=0.

Run the audit weekly. If the baseline exceeds 25K, the session is bloated. The remediation: disable MCPs not used in the current project (per-project, never globally); prune CLAUDE.md toward the 200-line / ~2K-token ceiling; move specialized instructions into skills (load-on-demand) or `rules/` (routed) rather than the top-level CLAUDE.md.

## §71 — The Compounding Re-Read Cost

Claude re-reads the entire conversation on every turn, so per-message cost compounds rather than adds. Turn 1 costs about 500 input tokens for the prompt plus system overhead. Turn 10 costs about 5,000 because Claude is re-reading all nine prior turns each time. Turn 30 costs about 15,000 — roughly 31× turn 1.

A developer audit of 100+ message sessions found that approximately 98.5% of all tokens consumed were re-reads of prior conversation, not new work.

This metric explains three rules: manual `/compact` at 60% beats autocompact at 95% because manual compaction also kills future re-read costs; `/rewind` after a failed attempt beats correction because rewind deletes the re-read tax on the dead branch forever; and session chaining (§75) is dramatically more efficient than one mega-session.

## §72 — Prime Time and the 120K Discipline Threshold

The first 0–20% of a session is **prime time**: CLAUDE.md is fresh, attention has not dispersed, and no failed attempts or stale reads have accumulated. Prime time must not be spent on trivial setup or chitchat.

The **120K threshold** — about 12% of the 1M window — is the voluntary reset trigger. The number maps to the "60% of 200K" old discipline that produced reliably good results. Pre-emptive reset locks in peak-quality output before context rot kicks in. Crossing 120K with no plan is the single most common path to a bloated session.

The exceptions: do not interrupt mid-generation of a long artifact; do not cut off a large test suite producing meaningful intermediate results; do not abandon a plan that explicitly needs the accumulated context.

## §73 — Accuracy Degradation Statistics

Two numbers belong in muscle memory. **Retrieval accuracy** drops from 92% at 256K tokens to 78% at 1M tokens — filling the window measurably degrades the model's ability to find what it needs inside that window. **Thinking depth** dropped 67% as sessions lengthened across a sample of 18,000 thinking blocks in 7,000 sessions, while "edit without reading first" rose from 6% to 34% over the same range.

Application: any high-stakes task — financial validation, strategy synthesis, client deliverable — must start in a fresh session under 50K tokens, never midway through a long session.

## §74 — Session Handoff Protocol

The Session Handoff Protocol is a higher-ROI alternative to `/compact`, implemented either as a custom slash command (`/session-handoff`) or a reusable prompt template. Fire it at the 120K threshold or when finishing a meaningful chunk of work that warrants a clean reset.

The handoff document covers eight fields. **Where We Started** states the original task in one sentence. **Decisions Locked** lists the decisions and their rationale. **What Shipped** lists files created or modified, plus tests passing as X/Y. **Key Files for Next Session** lists each file with its current state. **Running State** documents environment, flags, branches, deployment. **Verification Deferred** captures what needs checking but was not checked. **Open Questions** captures anything unresolved. **Pick Up From Here** is one paragraph specifying what the next session does first.

The usage pattern: prompt Claude to generate the handoff using the template; copy the result; `/clear`; paste the handoff as the first prompt of the new session; close that prompt with "Confirm you understand and give me the next action."

The handoff outperforms `/compact` because the model compacts at its least intelligent point (end-of-session rot), whereas the handoff is generated while Claude is still in reasonable shape, is structured rather than free-form, and starts the new session with 0% rot.

## §75 — Session Chaining (Assembly Line Pattern)

Any project expected to consume more than 200K tokens should run as a chain of specialized sessions, not a single mega-session. The four stages: **Discovery** on Opus 4.7 high or Sonnet, producing a research summary; **Planning** on Opus 4.7, producing an implementation plan; **Implementation**, mixing Sonnet with Opus synthesis, producing the code or deliverable; **Review** on Opus 4.7 max or a multi-agent run, producing QA and sign-off.

Between sessions, only the artifact carries over — the doc, the plan, the code — never the conversation. Each session starts clean, at prime time, with only the information it needs. Stages 1–2 should rarely exceed 80K tokens each; stage 3 is the long one and should be subdivided further if it exceeds 300K.

## §76 — Format Conversion Economics

Pre-converting inputs to markdown is a high-ROI habit. The token reductions: HTML → Markdown drops roughly 90% by stripping layout, styles, scripts, and metadata; PDF → Markdown drops 65–70% by stripping layout, images, and font encoding; DOCX → Markdown drops about 33% by stripping formatting wrappers. A 40-page PDF therefore consumes the same context as roughly 130 pages of markdown — pre-conversion fits about 3× more content in the same window.

The tools, ranked by capability: Docling (CLI, handles PDF, DOCX, HTML, preserves tables and structure) is primary; pandoc is the battle-tested fallback; `pdftotext -layout` is the quick option when Docling is overkill.

Do not pre-convert when the document must be reviewed visually (rasterize the relevant pages instead), when it is a filled form (use field extraction), or when it is scanned (OCR first).

## §77 — Context-Reduction Ecosystem

A community-built compression toolkit sits one tier below the official Anthropic features. Rust Token Killer is a Rust CLI that strips boilerplate from large codebases before feeding them to Claude. Context Mode pre-processes prompts to remove redundant whitespace, repeated citations, and stale comment blocks. Token Savior is a lightweight statistical compressor for large markdown files. None of these tools replaces `/compact` or the Format Conversion Economics rule; they sit alongside as auxiliary trim layers when working at the edge of a session budget. Reach for them only when an audit per §70 shows MCP and CLAUDE.md are already lean. Premature compression of prose Claude needs to read carefully degrades quality more than it saves tokens.

## §78 — Session Budget and Time-to-Reset Strategy

Treat the session limit as a visible, active variable in the workflow, not a constraint noticed only on impact. Keep the limit visible on the desktop app; on terminal, surface the percentage in the status line.

The strategic rules. With less than 20% of the session remaining and more than an hour to reset: pause heavy work; do light admin or doc review (or take a walk). With less than 20% and under thirty minutes to reset: stop entirely — the reset will unlock more than grinding can save. With more than 60% remaining and over an hour to reset: run heavy jobs — multi-agent runs, big refactors, consensus runs. At 30–60%: normal operations, but do not start a new big task. With more than 60% remaining and under thirty minutes to reset: exploit the window — fire stochastic consensus, run the full benchmark suite, spin up agent teams; the refresh is imminent.

The anti-pattern: the "I'll just push through" mindset when low. Quality degrades (§73), output per token drops, and rushed compaction can corrupt the work.

## §79 — The I/O Ratio Diagnostic

Track input versus output tokens per project. Under normal workflow, output exceeds input meaningfully because Claude is generating code, docs, and analysis rather than just reading. The red flag is a project where input ≫ output over a 7-day window. The signals: too much reference material loaded per turn; CLAUDE.md or rules bloat; MCP tools returning excessive noise; re-reading large files instead of using targeted views; or session re-read tax (too many long sessions, not enough chaining). The fix is a 1–2 hour cleanup of CLAUDE.md, MCP loadout, and session patterns; the payback is often 10× in the next week.

## §80 — Output Tokens Reality Check

Output tokens cost roughly 5× input tokens at Anthropic's pricing. The intuition that "tell Claude to be concise" should save money is wrong, because the vast majority of output tokens in agentic work are invisible — they are tool calls, file writes, test runs, and intermediate reasoning steps. Asking Claude to respond in one sentence does not change any of that.

The four levers that actually reduce output cost: route high-volume sub-tasks through Sonnet or Haiku and reserve Opus 4.7 max for synthesis; use `/rewind` instead of corrections (which kills output on the dead branch); make targeted edits via `str_replace` rather than full file rewrites; route exploratory "what if" work to subagents so only the conclusion enters main context. Aggressive "be terse" instructions are fine for chat UX but are not a token-saving strategy.

## §87 — Carrier File: Portable Plain-Text Context

The Carrier File is a plain-text file pasted into any AI tool to restore context — a zero-dependency cousin of the shared MCP memory server (§86).

The structure is short by design. A Carrier header with the project name and last-updated date, followed by Identity (role and goals), Active Work (three bullets of current activity), Decisions Locked (top five decisions that should not be re-litigated), Known Failures and Dead Ends (what has been tried so the next AI does not repeat them), and Next Action (one sentence).

Paste the carrier as the first message when moving between Claude, ChatGPT, Gemini, or different Claude Code sessions. Update as work progresses. The carrier complements but does not replace CLAUDE.md: CLAUDE.md is persistent project rules; the carrier is a session-state snapshot.

## §86 — Shared MCP Memory Server Across IDEs

A single MCP memory server can be exposed to Claude Code, Cursor, and Windsurf simultaneously. Each tool reads and writes to the same memory layer, so switching IDEs no longer loses context. This matters when multiple operators collaborate on the same codebase from different tools, or when one operator switches between IDEs depending on task.

The implementation: self-host an MCP memory server (mem0, OpenBrain-style, or Anthropic's managed memory if eligible); expose it to Claude Code via the standard MCP config and to Cursor via its MCP support; have each session begin by reading the project's memory slice and end by writing updates.

The trade-off is roughly 1–3K tokens added to baseline context per session for the memory payload — worth it for projects with cross-tool or cross-person workflow. See §87 (Carrier File) for the zero-dependency alternative.

## §9 — Sub-Agents

A subagent is a child Claude instance with its own isolated context. Subagents perform work and return only a summary, keeping the parent's context clean.

The practitioner heuristic: stick to two subagent types per project. Research subagents handle context-heavy tasks and isolate 100K+ tokens from the parent. Documentation subagents handle post-run logging and directive updates.

The three essential subagents in `.claude/agents/`: **RESEARCHER** (Sonnet 4.6, with `web_fetch`, `web_search`, `bash`, `read`) for deep research without polluting parent context; **CODE-REVIEWER** (Sonnet 4.6, with `read`, `grep`, `glob`) for review with zero context bias; **QA** (Sonnet 4.6, with `bash`, `read`, `write`) to generate and run tests.

The probability math is sobering. Three subagents at 95% reliability each produce 0.95³ = 85.7% end-to-end. Ten produce 0.95¹⁰ = 59.9%. Fifty produce 0.95⁵⁰ = 7.7%. The case for tight subagent design at scale is mathematical, not stylistic.

The Anthropic mental test for whether to spawn a subagent is one question: will I need this tool output again, or just the conclusion? If just the conclusion, use a subagent — the intermediate tool noise stays in the child's context, and only the final report returns.

Claude Code auto-spawns subagents, but Opus 4.7 spawns them less often by default, so explicit invocation is required. Useful patterns: "Spin up a subagent to verify the result of this work based on the following spec file"; "Spin off a subagent to read through this other codebase and summarize how it implemented the auth flow, then implement it yourself in the same way"; "Spin off a subagent to write the docs on this feature based on my git changes." For agentic pipelines, specify when to fan out: "Spawn multiple subagents in the same turn when fanning out across items or reading multiple files. Do not spawn a subagent for work you can complete directly in a single response."

The benchmark figure: in Anthropic's research evaluations, sub-agents outperform single-agent Opus by 90%+ on research-style tasks because each subagent specializes in a slice and the synthesizer gets clean inputs.

## §9B — Advisor Tool: Sonnet + Opus Pairing

The Advisor Tool, released April 9, 2026, lets Sonnet or Haiku run a task end-to-end and consult Opus on hard decisions. One API parameter, no orchestration logic. The configuration uses `model="claude-sonnet-4-6"` as the executor with a tool of `type: advisor_20260301`, `name: advisor`, `model: claude-opus-4-7`, and `max_uses: 3`. The beta header `anthropic-beta: advisor-tool-2026-03-01` is required.

The measured results: Sonnet plus Opus advisor delivers +2.7% on SWE-bench Multilingual versus Sonnet alone, with an 11.9% cost reduction per agentic task. Haiku plus Opus advisor doubled the BrowseComp score at 85% less cost than Sonnet solo.

The Advisor Tool is the official version of the V3.3 manual pattern of routing research to Sonnet subagents and synthesis to Opus. Replace manual orchestration with a single API parameter.

## §9C — Multi-Agent Coordination Patterns

The April 10, 2026 Anthropic Engineering blog ships official guidance on five coordination patterns. The critical principle: start with the simplest pattern that could work, watch where it struggles, evolve from there. Choose patterns based on what fits the problem, not what sounds sophisticated.

**Generator-Verifier.** A generator produces output, a verifier evaluates against criteria, and the loop runs until pass or max iterations. Best for quality-critical output with explicit evaluation criteria — code generation, compliance, fact-checking, document section generation against a quality rubric. The verifier requires explicit criteria, never just "check if good." Max iteration limits with fallback to human escalation are mandatory.

**Orchestrator-Subagent.** One lead agent plans, delegates, and synthesizes — the pattern Claude Code itself uses, with the main agent writing code while subagents search codebases. Best for clear task decomposition with bounded subtasks, including any pipeline that dispatches a sequence of named specialists. Weakness: the orchestrator becomes an information bottleneck and details are lost in handoff summarization.

**Agent Teams.** A coordinator spawns persistent worker agents that stay alive across many assignments and accumulate context and domain specialization over time. Best for parallel, independent, long-running subtasks like codebase migrations or multi-property analysis. Weakness: worker independence is critical — if one worker's output affects another, neither is aware.

**Message Bus.** Agents publish and subscribe to events through a shared communication layer. Best for event-driven pipelines with a growing agent ecosystem — deal-pipeline alerts, cloud monitoring, webhook routing. Weakness: tracing and debugging are harder than sequential orchestration; silent failures occur if the router misclassifies.

**Shared State.** Agents coordinate through a persistent store (database, filesystem, document) with no central coordinator. Best for collaborative research where agents build on each other's discoveries — fan-out / fan-in research, stochastic consensus synthesis. Weakness: reactive loops can burn tokens indefinitely without termination conditions like a time budget or convergence threshold.

The default for most use cases is Orchestrator-Subagent. Evolve toward other patterns as specific needs become clear. Production reality is hybrids: Orchestrator-Subagent overall with Shared State for collaboration-heavy subtasks; Message Bus for event routing with Agent-Teams-style workers handling each event; Generator-Verifier wrapped around any other pattern as a quality gate.

## §9D — Seeing Like an Agent (Tool Design Philosophy)

The April 10, 2026 Anthropic Engineering essay's principle: design tools shaped to the agent's abilities, not to human workflows. The math-problem analogy makes the point. Paper is the minimum but limited by manual calculation. A calculator is better but requires familiarity with the advanced options. A computer is most powerful but requires coding ability. The right tool depends on the problem-solver's skill set, and the same is true of agents.

Claude Code's AskUserQuestion tool went through three iterations before landing. Adding questions to ExitPlanTool confused Claude with dual purposes. Modifying the markdown output format produced output Claude could not reliably generate. The dedicated AskUserQuestion tool with structured output worked well, and Claude "liked" calling it.

Four design principles emerge. If the model cannot reliably use a tool, the tool design is wrong, not the model. Iteratively read agent outputs, experiment with parameters, observe the results. Structured output via tools is more reliable than format instructions in prompts. Tools should compose across the SDK, CLI, and skills.

Application: when building any agent pipeline, design each agent's tools to match what that agent does. Do not give an Ingestion agent the same tools as a QA agent. Each agent's tool surface should reflect its narrow specialization.

## §83 — Digital Employee / Org Chart Mental Model

Stop framing multi-agent systems as tools; reframe them as employees with defined roles. Every agent gets a named persona, a role, and a scope. Every agent gets a written job description — a directive file covering what it does, what it does not do, the handoff protocol, and the escalation path. The orchestrator is the manager: it coordinates, but it also fires (per §84) and hires (spawning new specialists) as needed. Track KPIs per agent — success rate, false-positive rate, token cost, average latency.

Naming conventions force clarity. "Avery (data ingestion)" forces an explicit scope; "the data agent" does not. Treating agents like employees also surfaces design defects faster: if a JD reads as "do everything related to property analysis," the scope is too broad and the agent will fail.

## §84 — Three-Strike Termination Policy

Observed at production AI companies and across Agent Madness submissions: hallucinating agents are fired after three strikes. Track per-agent counts in `.claude/agent-performance.md`, one row per agent, updated after each run. The tracked fields are hallucination count (output contradicts source data), directive violations (agent acted outside scope), and failed handoffs (downstream agent could not use the output).

Strike 1 is a logged warning. Strike 2 puts the agent in a sandbox where output is compared against ground truth before acceptance. Strike 3 disables the agent for the project and triggers a CLAUDE.md and directive review, with a full rebuild from scratch if the issue is systemic.

For high-stakes agents (financial calculation engines, compliance reviewers), tolerance is zero — a single strike disables the agent until manually re-verified against source.

## §9E — Stochastic Consensus at Scale

Heavy users report $8,000 per month in fast-mode usage, primarily on stochastic multi-agent consensus workflows. The pattern: rather than one Claude instance attacking a problem, spawn 10–100 instances attacking it in slightly different ways, then have a final synthesizer identify consensus positions and notable outliers.

Use 100-agent consensus when even a 1% improvement justifies $100–$1,000 in token spend; for game-theoretic optimization (client disputes, negotiation strategy, pricing decisions); to maximize search-space coverage per unit time; for strategic decisions (go-to-market, product positioning, competitive response).

The implementation runs N agents simultaneously with slightly varied system prompts or temperature settings, then a synthesizer that produces what all agents agreed on, what most agents agreed on, and notable outlier perspectives worth considering. The framing is a "mini democracy" — but the operator remains the dictator who makes the final call. The value is in surfacing perspectives that would not have been considered alone.

A reference example: a 100-Opus 4.7 consensus run on a client dispute, producing a game-theoretically optimal resolution that maximized reputation while keeping the bridge intact. The operator used none of the specific solutions, but the breadth of perspectives informed the final approach.

The cost-benefit rule: if the decision's expected-value swing exceeds 100× the token cost, run the consensus. A $100K relationship justifies $1,000 in consensus runs. A $500 operational decision does not justify $200 in tokens.

The reference prompt: "Use stochastic multi-agent consensus to determine all of the different ways that you could [achieve goal]. I want every agent to come up with at least 10 independent responses. Then have them synthesized and turned into just a giant list of all of the possible things you could do."

**Stochastic consensus is terminal-only and does not work in IDE environments.** It requires the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` environment variable.

## §85 — Argument as Architecture

A name for the consensus + debate pattern elevated to an architectural principle. The principle: when a single LLM call is unreliable or incomplete for a decision, the reflex must not be "add more retrieval" or "add more context." It must be "have agents argue, then synthesize."

Reach for argument when the model gives a confidently wrong answer (an adversarial agent exposes the error); when multiple valid approaches exist (debate surfaces tradeoffs explicitly); when the decision has asymmetric downside (forcing disagreement reduces confirmation bias); and when ground truth is unavailable (consensus is the best available proxy).

Default scheduling: any decision above a project-specific dollar threshold gets consensus automatically rather than optionally. For trading-style decisions, $10K impact triggers 10-agent and $100K impact triggers 50-agent. For underwriting, any recommendation reversal (PASS → BUY or vice versa) requires debate. For strategic client recommendations, debate is mandatory. Wire these into CI and scheduled jobs, not ad-hoc prompts.

## §10 — MCP Installation and Usage

MCPs (Model Context Protocol servers) extend Claude's capabilities by connecting it to external services, APIs, and data sources. Anthropic invented the standard in 2024; it has become the universal way AI assistants talk to tools — "USB for AI." An MCP server exposes tools (functions) and resources (data) that Claude can invoke during a conversation; once installed, Claude learns it exists on startup and calls its tools when relevant without manual wiring.

The trade-off: every active MCP consumes context tokens on every message even when unused. A chatty MCP can burn 5–20K tokens of context budget before the operator types anything. Be selective.

Install an MCP via `claude mcp add <name> <command>` — for example, `claude mcp add filesystem npx @modelcontextprotocol/server-filesystem /path/to/project` — or by editing `~/.claude/mcp.json` directly with an `mcpServers` block listing each server's command, args, and env variables, then restarting Claude Code.

The MCP categories worth standardizing. **Filesystem** for read/write of local files. **Database** (Supabase, Postgres) for query and mutation. **Repository** (GitHub) for issue, PR, and branch management. **Browser** (Chrome DevTools, Puppeteer, Playwright) for scraping and visual QA. **Document** (Google Drive, Notion) for asset retrieval. **Communication** (Slack, Gmail) for notifications and correspondence. **Project Management** (Linear) for roadmap state. **Domain-specific** (Composer for trading, Plaid for banking, AirDNA for STR data) per the project's specialty.

Find MCPs at the official registry github.com/modelcontextprotocol/servers; smithery.ai (one-click install); mcpt.com (curated); opentools.ai; github.com/punkpeye/awesome-mcp-servers.

When no existing MCP fits, build a custom one in Claude Code by describing the desired tools (`get_X(id)`, `list_X(filter=None)`, `update_X(id, fields)`), specifying TypeScript with `@modelcontextprotocol/sdk` and `stdio` transport for internal use (or HTTP for production distribution), and asking for a README with install instructions.

The **MCP-versus-Skill rule**: many MCPs are overkill. If only one or two of an MCP's tools are used, convert those to a skill. Skills load on-demand at roughly 60 tokens. MCPs load always at 1–5K+. Reach for an MCP when the surface is used every session, when real-time auth is required, or when persistent connection is required. Reach for a skill when the workflow is occasional, static, or a multi-step deterministic process. The conversion prompt: "Great, the [tool] MCP worked well for [task]. Turn this into a skill instead because skills are much more token-efficient. Take what you just did via MCP, find the direct API endpoints, and build a skill with scripts that calls the API directly."

The recommended baseline keeps the always-on set lean. Globally: Filesystem, GitHub, project-context MCP. Per-project additions only as needed; nothing should load globally that is not used in every session.

## §10B — Managed Agents (Cloud-Hosted)

Anthropic Managed Agents launched in Q1 2026 as Anthropic-hosted containers that run skills on standardized infrastructure. They solve the "where does my agent run" problem and replace Modal, serverless wrangling, and `.env` key management.

The differences from local Claude Code: Managed Agents run in Anthropic's cloud rather than the operator's laptop; they are triggered by API endpoints, Routines, or webhooks rather than terminal typing; they use one-click OAuth rather than manual `.env` rotation; they persist sessions resumably rather than dying on terminal close; they scale across multiple concurrent users; and they bill at standard token rates plus roughly $0.08 per session-hour rather than via subscription. Currently locked to Sonnet 4.6 as executor.

Key features. Production-grade sandboxing (authentication, tool execution handled). Long-running sessions (operate autonomously for hours, persist through disconnections). Multi-agent coordination (agents can spin up and direct other agents — research preview, request access at claude.com/form/claude-managed-agents). Built-in OAuth credential vaults (no raw API keys; MCP connectors built in). Full session tracing (every tool call, decision, and failure mode visible in Claude Console with visual timeline). "Ask Claude" button (after testing, generates a Claude Code prompt to build a frontend in ~30 seconds). Self-evaluation (research preview — Claude evaluates its own output and iterates until success criteria are met).

Use Managed Agents when an API endpoint must accept hits from a client or webhook; when the workflow runs without operator presence; when OAuth to Gmail, Drive, or Slack should not store tokens locally; or when productizing an agent workflow for paid customers.

Setup runs through claude.ai/agents or console.anthropic.com/agents: click New Agent, give it a name, system prompt, and allowed tools and skills, connect external services via OAuth, deploy to receive an API endpoint and auth token, POST to the endpoint to invoke. Test with the built-in test panel (transcript view + debug view with raw API events). Iterate based on agent suggestions from the test conversation.

Operational notes. Archive both the agent and its environment when done — they are separate objects; environments persist independently and accrue cost. Credential vaults store OAuth tokens securely, shared across the organization. The analytics dashboard shows tokens in/out, cost breakdowns by model, access logs across all managed agents. The sessions view shows independent conversation runs with full debug/trace. Filter debug by type — agent messages, thinking sections, tool calls.

The selection rule between Managed Agents and Modal. Need LLM in the production loop with guardrails: Managed Agents (sandboxed, state managed, error recovery). Pure deterministic execution scripts only: Modal (no LLM overhead, pennies per month). Interactive agent that adapts to user input: Managed Agents (runtime flexibility, MCP connectors). Scheduled or triggered workflows with no judgment needed: Modal cron or webhook (cheaper, faster, deterministic).

## §10C — Claude Cowork

Claude Cowork (launched October 2025) is the non-developer, consumer-facing version of Claude Code — same underlying runtime (skills, tools, MCPs, Managed Agents) wrapped in a desktop application for users who do not live in the terminal. Anthropic's release pattern is consistent: ship the technical feature, watch power users hack it, release a consumer wrapper.

Cowork users include non-developer team members in operations, marketing, and finance; clients receiving deployed AI workflow packages; and power users preferring a GUI plus file browser to a CLI.

The features. A visual file browser with drag-and-drop inputs (no command-line file paths). A skill marketplace for installing skills without touching the filesystem. A shared team workspace where multiple members work in the same session. Background agents that run while the application is closed. Feature parity with Claude Code on skills, MCPs, and Managed Agents.

Enterprise features (April 2026): role-based access controls (SCIM integration); group spend limits per team; usage analytics (admin dashboard plus Analytics API); OpenTelemetry support for SIEM pipelines (Splunk, Cribl); per-tool connector controls (e.g., allow read but disable write).

A reference customer quote (Airtree, a VC firm): "Using Claude Cowork across teams multiplied its value. Skills built by one person could be used by everyone. Claude Cowork became shared firm infrastructure rather than just an individual productivity tool."

The distribution implication: deploy AI workflow products as Cowork-installable skill packs rather than teaching enterprise clients to install Claude Code. Client downloads Cowork, installs the skill pack, runs workflows with zero technical onboarding.

## §10D — Routines: Scheduled and Event-Triggered Automation

Routines (Anthropic blog, April 14, 2026, research preview) are Claude Code automations configured once with a prompt, repo, and connectors, then run on a schedule, from an API call, or in response to an event. They run on Claude Code's web infrastructure, so nothing depends on the operator's laptop being open.

Three types. **Scheduled** routines pair a prompt with a cadence: "Every night at 2am: pull the top bug from Linear, attempt a fix, and open a draft PR." **API** routines each receive an endpoint and auth token; POST a message and receive a session URL: "Read the alert payload, find the owning service, and post a triage summary to `#oncall` with a proposed first step." **GitHub webhook** routines subscribe to repository events and create a new session per matching PR, with subsequent comments and CI failures fed into the same session: "Please flag PRs that touch the `/auth-provider` module. Any changes need to be summarized and posted to `#auth-changes`."

Daily limits: Pro 5, Max 15, Team 25, Enterprise 25. Extras are available via additional usage.

Common patterns. Nightly backlog triage. Weekly docs-drift scans. Post-deploy verification. Alert triage from Datadog. Library port routines that mirror Python SDK changes into the Go SDK. Stripe webhook → automated post-purchase pipeline. Fireflies transcript webhook → post-call follow-up email plus summary. Health-check routine every 15 minutes hitting production endpoints with Slack alert on failure.

Get started at claude.ai/code or via `/schedule` in the CLI.

The selection rule for execution surfaces. Cron-style automation on the operator's repo: Routines (built-in, no infra management). Deterministic execution scripts only: Modal (no LLM overhead, cheapest). Interactive agents needing runtime flexibility: Managed Agents (full sandboxed runtime). GitHub event-triggered workflows: Routines via the GitHub webhook mode (native integration). Long-running autonomous agents: Managed Agents (persistent sessions).

The Saraf framing: routines replace the entire middle layer of automation. The old model was Event → n8n / Make.com → Output. The new model is Event → Routine (natural-language instructions) → Output. Operators no longer need node-based automation; they describe what they want in plain English. Routines are the standardized enterprise version of agentic workflows.

Be more precise in routines than in skills. Routine execution is hands-off and must work nearly perfectly every time, so decrease the total scope of possible errors by being clear and verbose; lean toward more context rather than less. There appears to be no length limit.

The UX walkthrough. Navigate to claude.ai/code/routines. Click New Routine. Name it. Write the description like a detailed skill or SOP. Select repository. Select model (Opus 4.7 recommended for complex tasks). Select cloud environment with env vars. Add a trigger (Schedule, GitHub Event, or API). Add connectors via Settings → Connectors. Run Now to test, or save to schedule. The calendar view at claude.ai/code/routines shows all scheduled routine executions with exact times.

To convert n8n / Make.com workflows, build a "routine generator" skill. In n8n, hold Shift to select nodes and copy the JSON. In Claude Code, paste the JSON and say "Use the routine generator to turn this n8n workflow into a routine." Claude parses node logic and produces a natural-language equivalent. Add connectors and set the trigger. Iterate via API: "Update this so it sends me a Slack message with the scrape after it's done" — three seconds versus dragging new nodes.

The cost note: routines operate in the token domain (more expensive per operation than pure compute). Do not blindly port all n8n workflows. Build new workflows as routines only when time savings justify token cost; simple deterministic tasks may remain cheaper on n8n or Modal.

## §10E — Managed Agents Practitioner Deep-Dive

The practitioner framing of Managed Agents: standardization of the "middle layer" of automation. Previously, hosting agentic workflows required n8n, Make.com, or custom serverless backends. Anthropic now provides dedicated infrastructure that runs skills in containerized, predictable environments with standardized OAuth — no more wrangling API keys in `.env` files.

Managed Agents replace four things. The action modules of no-code platforms (not the triggers — those still need Routines or webhooks). Custom serverless deployments for agentic workflows. Manual API key management (replaced by one-click OAuth). Inconsistent execution environments (replaced by standardized containers).

A reference deployment: a proposal generator that takes a sales call transcript and returns a URL with a beautiful proposal including built-in payments and signature functionality. Every request to the agent endpoint returns a shareable URL, replacing a 1–2 hour build process across 5–6 platforms (JotForm, PandaDoc, etc.) with a single natural-language instruction.

The Anthropic release-pattern observation: ship technical / code-heavy feature → power users hack it and demonstrate spikes → consumer-friendly version released. That was the Claude Code → Cowork story. Expect Managed Agents to follow the same trajectory toward a more visual, non-technical interface.

Current limitations. No built-in scheduling yet; use Routines. The dashboard is developer-oriented; non-technical users may struggle. The interface is text-based only; a visual layer is expected in a future update.

## §102 — Managed Agents Memory: Built-In Filesystem Persistence

As of April 23, 2026, Managed Agents include a built-in memory layer in public beta. This is a material change because Managed Agents are no longer stateless task runners — they can now learn across sessions.

Memory is filesystem-based, not vector-DB-based. It mounts directly onto the agent's filesystem, so Claude uses the same `bash` and code-execution tools it already has to read and write memories. No new tool vocabulary. Opus 4.7 is specifically tuned for filesystem-based memory: it saves more comprehensive, well-organized memories and is more discerning about what to remember. Memories are files — exportable, independently manageable via the API, under developer control.

The enterprise features make this production-relevant. Permissions are scoped: org-wide stores can be read-only while per-user stores allow read and write. Multiple agents can work concurrently against the same store without overwriting each other. The audit log records which agent and which session produced each memory. Version control allows rollback to an earlier version or redaction of content from history. Memory updates appear in the Claude Console as session events so developers can trace what an agent learned and where it came from.

The customer performance data is striking. Rakuten's task-based long-running agents that learn from every session deliver 97% fewer first-pass errors at 27% lower cost and 34% lower latency. Wisedocs' document verification pipeline on Managed Agents using cross-session memory accelerated verification by 30%. Netflix's agents carry context across sessions including human mid-conversation corrections. Ando is building its workplace messaging platform on Managed Agents instead of building memory infrastructure itself. Rakuten's numbers are framework-level, not marginal.

Access is via the Claude Console or the new CLI; documentation lives at platform.claude.com/docs/en/managed-agents/memory.

The three-layer memory landscape. §102 Managed Agents Memory provides production persistence for cloud-hosted agents (audit, scoped, observable, enterprise-ready). §86 Shared MCP Memory provides cross-tool / cross-IDE sync for individual developer workflow (self-hosted, with ~1–3K context overhead). §87 Carrier File provides a zero-dependency manual snapshot that works anywhere via copy-paste. Pick the layer by deployment context.

## §101 — Consumer Connector Directory

The Claude directory at claude.ai/directory holds over 200 connectors spanning design, finance, productivity, and health. As of April 23, 2026, Anthropic expanded the directory beyond work-first tools into consumer surface area.

The April 2026 connectors cover four categories. Travel and activities: AllTrails, Booking.com, TripAdvisor, Viator, StubHub. Commerce and logistics: Instacart, Uber, Uber Eats, Taskrabbit, Thumbtack, Resy. Media: Audible, Spotify. Finance and tax: Intuit Credit Karma, Intuit TurboTax.

The platform-model shift: from a static tool picker to dynamic suggestion. Claude now surfaces the right app for the task at hand, driven by user preferences, context, and conversation rather than manual selection. When more than one connected app could answer, Claude shows them all and lets the user choose.

The commercial posture is explicit. Claude is ad-free with no paid placements or sponsored answers. Connected-app data is not used to train Anthropic models. Connected apps do not see other Claude conversations. Destructive actions (booking, purchasing) require user confirmation before execution. Connectors are available on all plans, with mobile in beta.

The strategic implication: the directory is the most likely single channel for AI product user acquisition in the near term. Every new connector trains users to expect Claude can reach their tools, and absence from the directory means a missed surface.

## §103 — Production MCP: The Three-Path Integration Model

Anthropic's official framing for connecting agents to external systems names three paths.

**Direct API** fits one agent talking to one service or a small number of integrations. The failure mode at scale is the M×N integration problem: every agent-service pair becomes a bespoke integration with its own auth, tool descriptions, and edge cases.

**CLI** fits local environments and sandboxed containers where a filesystem and shell are present. The limits are hard ceilings reaching mobile, web, or cloud-hosted platforms with no container, and auth handled via a credential file on disk. Best for quick, permissive integrations.

**MCP** fits production cloud agents reaching cloud-hosted systems where the data, work, and infrastructure already live. It requires more upfront investment but returns portability, auth standardization, discovery, and rich semantics. One remote server reaches every compatible client (Claude, ChatGPT, Cursor, VS Code, and more) in any deployment environment.

Mature integrations ship all three: API as the foundation, CLI for local-first environments, MCP for cloud agents.

The April 2026 adoption data is concrete. MCP SDKs are at roughly 300 million monthly downloads, up from 100 million at the start of 2026 — 3× growth in a single quarter. The Anthropic directory holds 200+ MCP servers used by millions daily. MCP underpins Claude Cowork, Claude Managed Agents, and Claude Code channels.

The decision rule. One-off internal automation in a single Claude Code project: skill (load-on-demand, ~60 tokens). Reusable cross-project work that needs real-time state and auth: MCP on local stdio transport. Reaching users via Claude.ai, ChatGPT, or Cursor: remote MCP (see §104). Narrow internal scripts used by one person: skill — MCP is overkill.

## §104 — MCP Server Design Patterns for Production

These five patterns separate "works" from "gets adopted."

**Pattern 1 — Build remote servers for maximum reach.** A remote server is the only configuration that runs across web, mobile, and cloud-hosted agents, and every major client is optimized to consume remote servers. Local-only stdio servers are fine for developer loops but invisible to the broader ecosystem. Any product MCP server must be remote if directory-driven distribution (§62) is the goal.

**Pattern 2 — Group tools around intent, not endpoints.** Do not wrap an API one-to-one. Fewer, well-described tools consistently outperform exhaustive API mirrors. A single `create_issue_from_thread` tool beats `get_thread` + `parse_messages` + `create_issue` + `link_attachment`. For an analysis product, `analyze_property` (takes an address or URL, returns full analysis) beats exposing raw pipeline primitives.

**Pattern 3 — Code orchestration for large tool surfaces.** Services with hundreds of operations (Cloudflare, AWS, Kubernetes) will not fit an intent-grouped toolset. The right move is a thin tool surface that accepts code: the agent writes a short script, the server runs it in a sandbox against the API, only the result returns. Cloudflare's MCP uses two tools (search and execute) to cover roughly 2,500 endpoints in about 1,000 tokens.

**Pattern 4 — Ship rich semantics where they help.** MCP Apps — the first official protocol extension — let a tool return an interactive interface (chart, form, dashboard) rendered inline in the chat. Servers shipping MCP Apps see meaningfully higher adoption and retention than text-only servers. The extension is supported in Claude.ai, Claude Cowork, and many top AI tools. Elicitation lets the server pause mid-tool-call to ask the user for input. Form mode sends a schema and the client renders a native form (use for missing parameters, confirming destructive actions, disambiguating options). URL mode hands the user to a browser for downstream OAuth, payment, or any credential that should never transit the MCP client (supported in Claude Code, with more clients in progress).

**Pattern 5 — Lean on standardized auth.** CIMD (Client ID Metadata Documents) in the latest MCP spec (2025-11-25) is Anthropic's recommended approach: fast first-time auth, far fewer surprise re-auth prompts, supported in MCP SDKs, Claude.ai, and Claude Code, with broad industry adoption in progress. Vaults in Managed Agents register a user's OAuth tokens once, reference the vault by ID at session creation, and the platform injects credentials into each MCP connection and refreshes them on the operator's behalf — no custom secret store, no per-call token passing. If shipping as a remote MCP server behind OAuth, use CIMD for registration. If deployed as a Managed Agent, use Vaults for credential management. Do not build a custom secret store.

## §105 — MCP Client Context Efficiency

Two client-side patterns reduce context pressure when connecting many MCPs to Claude Code.

**Tool search** defers loading all tool definitions into context. The agent searches the catalog at runtime and pulls in relevant tools only when needed. The measured impact is an 85%+ reduction in tool-definition tokens with high selection accuracy maintained, per Anthropic's internal "advanced tool use" testing. This is the programmatic answer to §70 (Fresh-Session Overhead Audit): instead of manually disabling MCPs per project, tool search keeps them available but out of context until invoked.

**Programmatic tool calling** processes tool results in a code-execution sandbox rather than returning them raw. The agent loops, filters, and aggregates across calls in code, with only the final output reaching context. The measured impact is roughly 37% token reduction on complex multi-step workflows. Use it for any pipeline where intermediate agent outputs would otherwise pollute downstream contexts — extract only the fields each downstream agent needs.

Combined, the 85% tool-definition reduction and the 37% multi-step reduction compose naturally across multiple servers, yielding leaner context, fewer round-trips, and faster responses.

## §106 — Plugins: Bundling MCP + Skills + Hooks + LSP + Subagents

Plugins are Anthropic's official abstraction for bundling multiple context providers into one distributable unit. A plugin contains skills, MCP servers, hooks (event-triggered behaviors), LSP servers (language server protocol integrations), and specialized subagents. Plugins replace the ad-hoc "install five things manually" workflow.

The reference example is Anthropic's Data Plugin for Cowork: 10 skills plus 8 MCP servers covering Snowflake, Databricks, BigQuery, Hex, and more, acting as a domain-specialist layer that gives Claude both raw capabilities and the procedural knowledge of how to use them well.

Install plugins via `/plugin marketplace add <repo>` and `/plugin install <plugin-name>@<marketplace>`. Examples: `/plugin marketplace add anthropics/skills`, `/plugin install document-skills@anthropic-agent-skills`; `/plugin marketplace add anthropics/claude-plugins-official`, `/plugin install claude-code-setup@claude-plugins-official`.

Notable plugin and skill repositories. **anthropics/skills** holds Anthropic's production skills: `docx`, `pdf`, `pptx`, `xlsx`, `pdf-reading`, `frontend-design`, `skill-creator`. **anthropics/claude-plugins-official** holds the official plugin marketplace including `github`, `claude-code-setup`, `pyright-lsp`, `code-review`, `commit-commands`. **Community plugins** like `oh-my-claudecode` (yeachan-heo) provide multi-AI orchestration across Claude, Gemini, and Codex with 19 specialized agents and execution modes (autopilot, ralph, ultrawork, deep-interview, team mode, planning mode).

The rule going forward: by end of 2026, any AI-product offering that bundles more than two components ships as a plugin, not as a manual setup guide. Manual setup is a sales-friction point.

## §107 — Skills Distribution from MCP Servers

Increasingly common: MCP servers publish an accompanying skill alongside the server, so the agent gets raw capabilities (from MCP) plus an opinionated playbook for using them well (from the skill). Canva, Notion, and Sentry already list skills next to their connector in the Anthropic web directory. The MCP community is actively developing an extension at github.com/modelcontextprotocol/experimental-ext-skills for delivering skills directly from servers; once it stabilizes, every client (Claude.ai, Cursor, Claude Code, ChatGPT) will inherit the skill automatically, versioned with the API it depends on.

When building a remote MCP server, pair it with a companion skill that teaches Claude how to use it well (voice, methodology, output format). When the extension stabilizes, migrate to server-delivered skills so every client inherits the methodology without per-client setup. Track the GitHub experimental extension repo for status, with a Q2–Q3 2026 timeline likely.

## §11 — Workspace Organization

The recommended root structure carries a top-level `.claude/` containing the workspace-wide CLAUDE.md, the shared `mcp.json`, the agent definitions for `researcher`, `code-reviewer`, and `qa`, and the skills folder. Each project lives in its own top-level folder with its own `.claude/`. The `directives/` folder holds DOE directives. The `execution/` folder holds DOE execution scripts. The `active/` folder holds working files (research, model-chat transcripts, drafts). The `clients/` folder holds external client work, each with its own `.env` and `.claude/`. The `shared/` folder holds cross-project execution scripts and reference data.

The five rules are absolute. One project per top-level folder. Shared code lives in `/shared/` — if two projects use the same script, it belongs there. Every project has its own `.claude/` folder so local rules override global. Every project has `directives/` and `execution/` per the DOE framework. Data never lives in the code folder — it goes in `/shared/data/` or a database. Don't pollute root: always store generated files in `active/` subfolders. Skills specify their own output paths.

Color-code workspaces. Use VS Code `settings.json` to change the header bar color (green for personal, blue for business). Keep business and personal separate — different workspaces, different CLAUDE.md files. Workspace preferences should be pinned to the global CLAUDE.md: default working directory, requirement to check `pwd` before shell commands, requirement to ask the user if a file is not where they say it is rather than creating it, prohibition on modifying `/shared/data/` without explicit confirmation, requirement to follow the standard folder template for new projects.

Cleanup cadence. **Weekly:** delete merged branches; archive old experiment folders; clean `active/` of loose temp files. The reference cleanup prompt: "Clean up my active/ folder. Anything inside subfolders is fine, but anything just loosely in the folder — any .txt, .py, .json, .jpeg, or temp files — clean up by deciding if it's necessary. If it's a temp file, delete it. Otherwise, store it in a subfolder that makes sense. Also enumerate anything that looks personal vs. business and flag it." **Monthly:** prune stale skills, review the MCP list for unused servers, compress old conversation exports. **Quarterly:** review the global CLAUDE.md, run `/insights` across all projects, promote learnings to global rules.

## §11B — Shared Execution Script Library

The `/shared/execution/` folder is the deterministic code library — pure Python (no LLM), callable from any project, the "E" of DOE applied across the workspace. Shared scripts are deterministic (same input, same output), testable (unit tests catch regressions), cheap (no token cost to invoke), and reusable (write once, call from any project).

The standard library breaks out into modules. `data/` for I/O (`fetch_csv.py`, `upsert_database.py`, `query_database.py`). `finance/` for calculations (`cap_rate.py`, `cash_on_cash.py`, `irr.py`, `dscr.py`, `mortgage_calc.py`, `winsorize_zscore.py`). `scraping/` for browser automation. `reporting/` for output (`render_pdf.py`, `render_docx.py`, `render_xlsx.py`, `send_to_slack.py`). `testing/` for fixtures and the full suite runner.

Every directive that needs deterministic work imports from these modules. Adding a new script: write it with a docstring covering inputs and outputs; add a unit test under `/shared/execution/testing/`; run `pytest shared/execution/testing/` to confirm pass; reference it from any directives that need it.

The five script-design rules. One job per script (UNIX philosophy). No hidden state — all inputs via function args or CLI flags. Clear error messages identifying the failure. Structured return data (dicts, DataFrames — not prose). No LLM calls inside; that is the Orchestration layer's job.

## §12 — Security Audit

Run the pre-deploy security audit verbatim against every project before pushing to production. The audit is a single Claude Code prompt that scans for six categories of risk.

**Credentials.** Hardcoded API keys, passwords, or secrets. `.env` files committed to Git. Credentials in log statements. Keys passed as URL parameters instead of headers. Search patterns: `sk-`, `sk_live`, `sk_test`, `Bearer`, `API_KEY`, `password=`, `secret=`.

**Injection risks.** SQL queries built via string concatenation rather than parameterized queries. User input passed to shell commands without sanitization. User input rendered as HTML without escaping. LLM prompt injection in user-supplied content.

**Auth and authorization.** Routes missing authentication middleware. Database Row-Level Security disabled or misconfigured. Admin endpoints accessible without admin checks. JWT tokens in localStorage rather than `httpOnly` cookies.

**Data exposure.** Stack traces returned to the client in production. Internal database row IDs exposed where UUIDs should be used. PII logged without redaction. CORS misconfigurations allowing any origin.

**Dependency risks.** Outdated packages with known CVEs (run `npm audit` and `pip-audit`). Packages from unknown or untrusted sources. Unnecessary dependencies that expand the attack surface. Typosquatted packages.

**Infrastructure.** Service-role keys used in frontend code (catastrophic — must be server-side only). Production secrets accessible to non-production builds. Rate limiting absent or misconfigured. Conversation history in `~/.claude/*.jsonl` containing leaked keys.

The audit prompt: "Run a comprehensive security audit on this project. Check for [the six categories above]. Return PASS / FAIL / N-A for each category with specific remediation steps. Fix everything you can automatically, then list what requires manual intervention."

Use a separate agent for the audit. Do not let the builder audit itself — bias is real.

## §12B — Code Review (Multi-Agent PR Review)

The agent-team pattern for PR review on production code. The lead reviewer (Opus 4.7, `xhigh`) reads the PR diff and identifies architectural concerns. The security subagent (Sonnet 4.6 with Opus advisor) runs the §12 audit on changed code. The test subagent (Sonnet 4.6) verifies test coverage and proposes additional test cases. The docs subagent (Sonnet 4.6) checks whether docstrings, READMEs, or external docs need updates. The synthesizer (Opus 4.7) consolidates findings into a single review comment with prioritized action items.

Wire this into a Routine on the GitHub webhook so it fires on PR-opened events and leaves inline comments before human review. The Anthropic `code-review` plugin from `claude-plugins-official` ships a starter implementation.

## §13 — Diversification & Backup

Single-provider dependency is existential risk. The diversification rule has three planes.

**Tool diversification.** Maintain `agents.md` files mirroring CLAUDE.md content in a format compatible with non-Claude coding agents (Cursor, Cody, Aider) so a provider outage does not halt operations. Sync prompt: "Duplicate the workspace configuration. Change anything Claude-specific — the CLAUDE.md, `.claude/` folder structure, skill formats — to a generic agent specification compatible with Codex CLI. Save to a parallel `agents.md` file and a `.codex/` folder. Keep both in sync by updating `agents.md` whenever you update CLAUDE.md."

The multi-IDE DOE strategy: maintain `claude.md`, `gemini.md`, `cursor.md`, and `agents.md` simultaneously in the workspace. All contain the same DOE framework directives. Switch between IDEs and models freely. If one hits rate limits, open another tab with a different model.

**Model diversification.** Do not lock to one Anthropic model. Opus 4.7 for synthesis and high-value decisions. Sonnet 4.6 for research subagents and routine coding. Haiku 4.5 for cheap throughput tasks (classification, extraction). Local models (Gemma 4, Qwen) for tasks that should not leave the operator's network.

**Data and code backup.** Database providers usually offer daily automated backups, but trust no single provider. Weekly: export critical tables to encrypted S3. Monthly: full database dump to an encrypted external drive. Quarterly: verify backups by restoring to a staging project. Code: GitHub primary; GitLab or Bitbucket as secondary mirror auto-synced via GitHub Actions; local-drive copy of every repo refreshed monthly.

The outage playbook: when a provider is degraded, the active directive runs through the backup agent; output routes through the same `execution/` scripts; post-outage, a comparison logs any output-quality differences for future reference.

## §14 — Workflow Cheat Sheet

The new-project flow: open the folder in Antigravity or the desktop app; run `/init` to generate CLAUDE.md; review and customize; run `/context` and `/usage` to baseline; confirm effort is at the `xhigh` default; create the standard subagents (researcher, code-reviewer, qa); set up the DOE folder structure (`directives/` plus `execution/`); configure Routines for recurring work.

The complex-build flow: voice-dump requirements through a cheap model for compression; switch to Plan Mode; fully specify the task in the first turn (intent, constraints, acceptance criteria, file locations) with all clarifying questions batched; review the plan and adjust; switch to Auto Mode or Bypass Permissions; say "Execute the plan" with API keys provided; walk away while it builds (Auto Mode keeps it safe); use `/rewind` or double-Esc when Claude hits a wrong path rather than correcting in a new turn; return to test and iterate; run the code-reviewer and QA subagents on the result; run the §12 security audit before deploying.

The context-hygiene loop runs every 30 turns: `/context` and `/usage` to check baseline; `/compact` with a direction hint when the session is bloated mid-task; `/clear` with a written brief when starting a genuinely new task; `/rewind` instead of corrections when Claude went down a wrong path.

Advanced research: fan-out / fan-in (5+ Sonnet researchers synthesized by Opus 4.7); stochastic consensus (10 agents brainstorming independently with consensus and outliers, terminal only); model-chat debate (10+ agents structured argument, terminal only); auto-research (metric + change method + assessment for an autonomous improvement loop). Critical reminder: stochastic multi-agent consensus and model-chat debate are CLI-only; they do not work in IDE environments.

Deployment surfaces map cleanly. Static sites: Netlify (free). Backend APIs: Modal ($5 free credit, pennies after). Full-stack apps: Vercel + Supabase + Modal. Cloud agents with LLM judgment: Anthropic Managed Agents at roughly $0.08 per session-hour. Non-developer team workflows: Claude Cowork. Recurring or event-driven automation: Routines.

## §14B — Cloud Deployment Strategy

The production stack maps each layer to a single provider chosen for cost efficiency and operational simplicity. Static frontends: Netlify or Vercel (generous free tiers, instant CDN). Stateless backend APIs: Modal ($5 free credit, serverless GPU available, Python-native). Stateful or long-running backend APIs: Railway (easy Postgres and Redis add-ons, cheap). Postgres + Auth + Storage + RLS in one: Supabase. File storage: Supabase Storage or S3 (one per project, do not mix). LLM-orchestrated agents: Anthropic Managed Agents at roughly $0.08 per session-hour. Background and scheduled jobs: Routines. Webhooks and triggers: Routines in API or GitHub mode (replacing n8n / Zapier). Non-dev workflows: Claude Cowork. Transactional email: Resend or Postmark. Payments: Stripe (the only choice worth considering). Analytics: HumbleLytics (§59).

The environment-variable rule: never commit `.env` to Git; use provider-native secret management (Vercel Project Settings → Environment Variables, `modal secret create`, Railway Variables tab, Supabase Project Settings → Vault). Rotation cadence: payment provider keys on suspicion only; database service-role key annually; OAuth tokens on revocation only. The cost ballpark — early stage, low traffic — is roughly $20–50/mo for hosting before token costs.

## §14C — Webhook & Scheduled Operations

Common webhook patterns. **Stripe → product pipeline.** A webhook on `checkout.session.completed` triggers the product Routine with the order ID. **Fireflies → post-call follow-up.** A transcript webhook triggers a routine that fetches the transcript, extracts action items and next steps, drafts a follow-up email, and posts to a Slack sales channel. **Trading rebalance check.** A scheduled Routine fires every Monday at 9:30am ET, pulls the latest allocations, compares to last week, flags drift greater than 5% on any position, and posts a summary with rebalance recommendations. **Health check.** A Routine fires every 15 minutes hitting production `/health` endpoints and posts to `#ops-alerts` if either returns non-200 or takes more than 2 seconds.

When a webhook source sends bursts (Stripe resends, Fireflies bulk imports), throttle at the Modal layer rather than the Routine layer because Routines are metered per-day by plan. Modal supports `@modal.rate_limit(calls=10, seconds=60)` decorators directly.

## §14D — Claude Code Desktop App: Parallel Agent Workspace

The April 14, 2026 redesigned desktop app is built for running multiple sessions in parallel. Agentic coding now means many things in flight with the operator in the orchestrator seat.

The features. The parallel session sidebar shows every active and recent session, filterable by status, project, or environment, groupable by project for navigation speed, auto-archiving on PR merge or close. Side Chats (⌘+; / Ctrl+;) branch off a conversation to ask a quick question mid-task; they pull context from the main thread but do not add anything back. Integrated tools include a built-in terminal for running tests or builds alongside the session, an in-app file editor for spot edits, a faster diff viewer rebuilt for large changesets, and a preview pane for HTML, PDFs, and local app servers. Drag-and-drop layout lets the operator arrange terminal, preview, diff viewer, and chat in any grid. Three view modes: Verbose (full transparency into Claude's tool calls), Normal (balanced), Summary (just results). ⌘+/ (or Ctrl+/) shows the full keyboard-shortcut list. Plugin parity is total between desktop and CLI; org-managed and locally installed plugins work identically. SSH support extends to macOS alongside Linux, so sessions can target remote machines from either platform.

A canonical desktop workflow runs three parallel tabs against three projects. Use the sidebar to switch. Use Side Chat for quick lookups. Use the integrated terminal for tests within the app. Switch to Summary view for monitoring and Verbose view for debugging.

## §14E — Token Economics & Usage Strategy

The reason usage limits feel restrictive even as models improve: two compounding factors. First, users progressively give harder tasks as they habituate to capability — "change background color" becomes "refactor my entire codebase." Second, Anthropic expanded Opus from 200K to 1M context, so each task can consume up to 5× more tokens before compaction. Users are not doing the same work for more cost; they are doing fundamentally harder work with fundamentally larger context windows.

The strategic implications: budget token spend by decision value, not task count; reserve Opus 4.7 max effort for high-value synthesis and consensus runs; use Sonnet 4.6 for all research, data gathering, and routine subagent work; track monthly token spend by project via `/cost` and `/usage`; recognize that Routines on cloud infrastructure consume tokens, so do not blindly port n8n workflows — convert only when time savings justify token cost; consider local models (Gemma 4, Qwen) for low-stakes tasks.

Two Opus 4.7 changes directly impact spend. The updated tokenizer means the same text may use a different number of tokens than on 4.6. More thinking on later turns in long sessions improves coherence and quality but increases token use. Budgets set against Opus 4.6 are not directly portable; re-baseline during the first week on 4.7. Long interactive sessions consume more than equivalent-length autonomous runs; the fix is structural (fewer, better-specified first turns), not just lower effort. Run `/usage` at start and end of each major session for the first two weeks to build a new mental model.

Opus 4.7 behaves differently in two regimes. **Interactive (synchronous)**: multiple user turns, more reasoning per turn, higher coherence — fits human-in-the-loop work. **Autonomous (asynchronous)**: single user turn up front, long agent run, fewer reasoning-overhead spikes — fits Routines, overnight batch jobs, Managed Agents endpoints. The optimization: fully specify cost-sensitive recurring jobs in turn one to push them into the autonomous regime and cut per-run cost.

Three independent metering surfaces exist: Claude chat (claude.ai) on the chat usage allowance with weekly reset; Claude Code (CLI / IDE / Desktop) on its own allowance with weekly reset; Claude Design (§57B) on a separate allowance with weekly reset. Running into limits on one does not affect the others. Budget and track separately.

## §14F — The War on Context: Strategic Positioning

The thesis: as models commoditize ("just matrices trained on quadrillions of tokens"), value shifts to whoever controls the richest context about users, businesses, and workflows.

The context hierarchy. **Layer 1 (highest value)**: speech-to-text tools that capture everything said between operator and computer; no other data source can replicate this context. Granola has reached a 9-figure valuation on always-on desktop transcription. **Layer 2**: email plus meeting notes, accessible via MCPs, holding large swaths of business context. **Layer 3**: structured business data — CRM, project management, code repositories — already accessible but often siloed. **Layer 4**: web data, public and indexable, low marginal value because everyone has it.

The strategic implication: an enduring moat is not the product — it is the context layer the product generates. Every output through an AI workflow generates context that compounds. The competitive defense is to capture and structure context proprietarily before competitors do — own the data flywheel, not the tooling.

## §14G — Anthropic Ecosystem Lock-In

The 2026 strategy is ecosystem capture through infrastructure. Claude Code, Managed Agents, MCP, Cowork, Routines, Plugins, and the Connector Directory form a moat that gets deeper with every developer and every shipped server. Anthropic hit roughly $30B annual run rate in 2026 (~10× YoY growth), with a growth curve steeper than OpenAI at the same stage. OpenAI's $120B funding round confirms raw capital is still a factor. User loyalty is extremely low — one superior model can shift the market overnight — so infrastructure lock-in is the only durable advantage.

The strategic posture: build entirely inside the Anthropic ecosystem and ride the platform velocity. Keep the diversification plane (§13) as the insurance policy rather than the default operating mode. Maintain `agents.md` as a non-Claude backup. The DOE framework is model-agnostic by design — only the orchestration layer is Claude-specific.

# PART 2 — WORKFLOW PHASING

The canonical execution order for any AI-assisted build. Phases are sequenced by dependency: each one's output becomes the next one's input. Skipping ahead is the most reliable way to ship the wrong thing fast.

## §15 — The Nine Phases

**Phase 1 — Setup.** Folder structure, CLAUDE.md, rules, subagents, MCPs, self-optimization prompts. Done once per project.

**Phase 2 — Research.** Competitor analysis, data-source survey, monetization research, architecture exploration. Done before any code is written. Outputs land in `active/research/` for downstream phases to reference.

**Phase 3 — Planning (Plan Mode).** Pipeline architecture, individual agent design, database schema, API design, frontend dashboard. No building yet. Plans land in `active/plans/`.

**Phase 4 — Design.** Screenshot loops for UI/UX before coding. Outputs land in `active/designs/`.

**Phase 5 — Build.** Switch to Bypass Permissions or Auto Mode. Execute the approved plans. Use git worktrees for parallel work.

**Phase 6 — Validate.** Test against ground truth. Accuracy benchmarking. User acceptance testing. Security audit. No deployment until all four pass.

**Phase 7 — Skills & Directives.** Codify what works into reusable skills and DOE directives.

**Phase 8 — Deploy.** Push to production once validation passes. Choose the deployment surface from §14B.

**Phase 9 — Optimize.** Auto-research loops on accuracy, speed, and prompt quality. Agent-team patterns for ongoing scaling. Distribution mechanics from Part 7.

The principle: each phase outputs an artifact that survives the session it was created in. Plans, research, designs, and code all live on disk. Conversation context is ephemeral.

## §16 — Phase 2: Research Patterns

The four standard research patterns, ordered by problem complexity.

**Competitor analysis.** Fan-out / fan-in across 5–10 competitors. Each subagent researches one competitor; the synthesizer produces a comparison matrix and differentiation strategy. Reference prompt: "Use a fan-out fan-in researchers/synthesizer approach to do a competitive analysis of [market]. Research [list 8–10 competitors]. For each: features, pricing, user reviews (love/hate), data sources, accuracy, mobile app, API. Minimum 5 sub-agents. Sonnet for research, Opus to synthesize. Output: competitive matrix plus differentiation strategy. Save synthesized report to `active/research/competitor-analysis-[date].md`. Save each agent's findings to `active/research/raw/competitors-agent-[N].md`."

**Data-source research.** Fan-out/fan-in across 5+ subagents enumerating public, paid, and scrape-able data sources. Output: cost, reliability, coverage, integration effort per source.

**Monetization research.** Stochastic consensus with 10 agents, each generating 10 monetization paths. Synthesizer produces a deduplicated ranked list. Reference prompt: "Use stochastic multi-agent consensus with 10 agents to determine all ways [product] could generate revenue. Each agent independently generates at least 10 monetization ideas. Synthesizer ranks by feasibility plus market size. Output: ranked list of monetization paths."

**Architecture debate.** Model-chat with 6–10 agents arguing for distinct architectural approaches across 3 rounds. Synthesizer recommends with confidence level. Reference prompt: "Use model-chat with 6 agents debating [architectural choice]. Three agents argue for [option A], three for [option B]. Three rounds: Round 1 independent positions; Round 2 challenge each other; Round 3 final positions. Synthesizer identifies strongest arguments, unresolved disagreements, and recommended decision. Save full transcript to `active/model-chat/[topic]-debate-[date].md`."

The save-location rule for all research: every fan-out, consensus, or debate prompt must specify explicit output paths. Conversation context is lost on `/compact` or `/clear`; files are not.

## §17 — Phase 3: Plan Mode Workflow

Plan Mode is read-only. Claude reads files, reasons, and writes a plan as text in the conversation. Claude builds nothing in Plan Mode.

The flow. **Step 1.** Voice-dump or write the requirements. Compress through a cheaper model if the dump is long. **Step 2.** Switch to Plan Mode (Shift+Tab cycles modes). **Step 3.** Feed the requirements with explicit references to existing research outputs: "Read all research findings in `active/research/` and use them to architect [the system]." **Step 4.** Claude produces a detailed plan — architecture diagrams in text, JSON schemas, endpoint specs, database tables — printed in the chat. **Step 5.** Save the plan: "Save this plan to `active/plans/[topic]-plan.md`." **Step 6.** Review. Read the plan carefully. Does the schema make sense? Do the agent specs match what research recommended? Are RLS policies in place? **Step 7.** Request changes if needed: "I want to change two things: [list]. Update the plan and save it again." **Step 8.** Only after all plans are done and approved, switch to Build Mode.

Claude will typically ask at the end: "Would you like me to implement this?" Do not say yes yet. Save the plan, review, request changes, repeat until satisfied. Then switch modes and execute.

The five canonical plan files for a multi-agent product: `pipeline-architecture-plan.md`, `individual-agent-design-plan.md`, `database-schema-plan.md`, `api-design-plan.md`, `frontend-dashboard-plan.md`. Each ships separately. Time estimate: 1–2 hours across all five plans.

## §18 — Phase 4: Screenshot Design Loop

The iteration pattern for UI/UX before any code is written.

**Step 1 — Source inspiration.** Find 3–10 reference sites with great design. For consumer products: clean SaaS landing pages (Linear, Notion, Stripe). For institutional products: domain leaders (industry-specific). Take full-page screenshots via DevTools (Cmd+Shift+P → "screenshot full size page" in Chrome). Resize each to under 4MB.

**Step 2 — Extract the design system.** Drop screenshots into Claude Code. Prompt: "Extrapolate the key design elements from these pages and help me create a design system. Output: exact hex colors, font stack, type scale, spacing rules, component patterns, animation guidelines (subtle only), overall aesthetic direction. Save to `active/designs/design-system.md`."

**Step 3 — Reference design system in every component build.** Subsequent prompt: "Reference design style guide as the basis as you're creating new components so that you have consistency."

**Step 4 — Iterate on layouts via Paper or Claude Design.** Build static mockups before committing to code. Take screenshots. Compare side by side.

**Step 5 — Use TailArc components as reference blocks.** Find a TailArc component for the section type needed (testimonial, pricing, content section). Screenshot it. Have Claude install or replicate it.

The critical prompt insight on refinement: "Improve the design" is too broad. Use "Refine the design. Make sure you have consistent layouts and themes and keep it subtle enough to make sure there's cohesiveness across the entire page." The word "subtle" constrains the agent's tendency to over-animate or over-design.

The two canonical design loops in any product build. **Dashboard UI.** Reference 3–5 SaaS dashboards. Build mockup. Save final HTML mockup to `active/designs/dashboard-mockup.html`. **Output document (PDF / report).** Reference 3–5 institutional reports. Build mockup. Save to `active/designs/report-mockup.html`. Time estimate: 30–60 minutes per loop. Worth every minute — redesigning a built React app later takes 10× longer.

## §19 — Phase 5: Build Patterns

Switch to Bypass Permissions or Auto Mode before building. The build flow: "I've reviewed all plans in `active/plans/` and I'm satisfied. Switch to bypass permissions. Read all plans in `active/plans/` and all research in `active/research/` and `active/model-chat/` before starting. [Build instructions here]."

The build sequence runs in dependency order. For a multi-agent product, build the agent that everything else depends on first (data ingestion), then the parallel-buildable layer (analysis agents that operate on the same data), then synthesis (the agent that consumes upstream output), then QA. After each agent, run subagents on the result: "Run the code-reviewer subagent on this agent's code. Then run the QA subagent. Fix any issues they find."

After all agents are built: "Merge all worktrees back to main in order. Then run a full end-to-end integration test with [reference input]."

## §20 — Git Worktrees: Parallel Agent Development

Worktrees let multiple Claude Code instances work on different branches simultaneously without file conflicts. Each worktree is an isolated working directory sharing the same Git history.

**Worktrees are terminal-only.** Claude Code cannot create worktrees through the IDE; the operator must run the git commands first.

The setup. From the project root: `git worktree add ../project-feature-A feature-A`, `git worktree add ../project-feature-B feature-B`, etc. Each worktree gets its own folder. Each agent works only in its worktree.

The build prompt after worktrees exist: "Set up parallel development of [N features] using the worktrees I just created. Each agent works ONLY in its worktree — do NOT modify files in the main branch. When all features are done, merge back to main in this order: [dependency order]. Then run full integration tests."

Add to CLAUDE.md: "Git Worktrees — We use Git WorkTrees for parallel development. Every WorkTree is an isolated working directory sharing the same Git history. Workflow: 1) Create feature branch + worktree for each parallel task. 2) Each agent works only in its worktree folder. 3) When done, merge branches back to main. 4) Delete worktrees after successful merge."

The use case is wherever multiple independent features can be built simultaneously: parallel features for a single product; multi-agent pipelines where each agent is independently buildable; large refactors split across files; experiments where the operator wants to keep the main branch clean.

## §21 — Phase 6: Validation Workflow

No deployment until four validations pass.

**Validation 1 — Ground truth benchmark.** Run the system against a known-good dataset. For underwriting: a portfolio of historical decisions with known outcomes. For document generation: a set of human-reviewed reference outputs. Acceptance criterion: the system agrees with ground truth on at least 85% of cases. Disagreements must be defensible.

**Validation 2 — Accuracy benchmarking.** Quantitative metrics: mean absolute error on numerical outputs; section-level quality scores from a rubric-based evaluator agent; pipeline success rate above 95%.

**Validation 3 — User acceptance testing.** Run the system against the actual workflow with the actual users. Collect feedback. Fix issues before deploy.

**Validation 4 — Security audit.** Run the §12 audit. PASS on all six categories before deploy. Use a separate agent — do not let the builder audit itself.

## §22 — Phase 7: Skills Architecture

A skill is an organized collection of files that packages domain expertise — workflows, best practices, scripts — in a format agents can access on demand. Skills turn a capable generalist into a knowledgeable specialist. The analogy: a math genius versus an experienced tax professional. The tax pro wins not because they're smarter, but because they have the right expertise pre-loaded.

The Anthropic philosophy ("code is all you need"): code is not just a use case but a universal interface for agents to do almost any digital work. Claude Code is a coding agent and a general-purpose agent that works through code.

**Skill structure.** A skill is a folder containing `SKILL.md` (front matter plus instructions) and any supporting scripts. The `SKILL.md` front matter:

```yaml
---
name: skill-name
description: "What this skill does. Trigger phrases: phrase1, phrase2, phrase3."
---
```

Front matter loads at ~60 tokens per skill. The body loads only when the trigger phrase fires.

**Skill creation workflow.** 1) Do the task manually once with Claude, noting the steps. 2) Ask Claude to format it as a skill with scripts and YAML front matter. 3) Write evals: define test inputs and expected outputs. 4) Run benchmarks on a fresh instance. 5) Test on a fresh instance — important, no prior context bias. 6) Fix errors, update skill. 7) Run regression tests after model updates. 8) Optimize the skill description for trigger accuracy.

**Skill-Creator improvements (March 2026).** The skill-creator now includes evals (test cases verifying skills work), benchmarks (test suites measuring accuracy), regression testing (catching when model updates break existing skills), and description optimization (improving trigger accuracy). Available built into Claude.ai and Cowork; as a plugin for Claude Code at `github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator`; in the skills repo at `github.com/anthropics/skills/tree/main/skills/skill-creator`.

**MCP-to-skill conversion.** When an MCP is used more than 5× in a project, convert it to a skill. The conversion prompt: "The [tool] MCP worked well for [task]. Turn this into a skill instead because skills are much more token-efficient. Take what you just did via MCP, find the direct API endpoints, and build a skill with scripts that calls the API directly. Check my other skills for formatting examples."

**Available production skills from Anthropic.** `docx` (Word documents). `pdf` (PDF generation). `pdf-reading` (PDF extraction). `pptx` (PowerPoint). `xlsx` (Excel). `frontend-design` (polished UI generation). Install via `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills`.

Target accuracy on production skills: 95%+. Re-run regression tests after every model upgrade.

## §23 — Phase 8: Deployment

Map each component to its surface per §14B. The deployment checklist before any push: tests pass; security audit clean; environment variables set in every deployment surface; database migrations run on staging then production; webhooks verified; email domains verified; Managed Agents redeployed with the latest skills; smoke test running the full pipeline end-to-end on production.

The monitoring stack. Sentry on the free tier for application errors. A 15-minute Routine for uptime checks. A weekly Routine pulling Anthropic API costs and posting to Slack. HumbleLytics on marketing pages. Dashboard provider metrics on in-app funnels.

Standard alert thresholds. Pipeline success rate above 95% (alert below 90%). Average runtime under 10 minutes (alert above 15). QA pass rate on first try above 80% (alert below 70%). Cost per run under product-specific threshold (alert at 2× threshold). Customer-facing completion rate within funnel above 40% (alert below 30%).

## §24 — Phase 9: Auto-Research Framework (Karpathy)

Auto-research is the autonomous improvement loop drawn from Andrej Karpathy's framework at `github.com/karpathy/auto-research`. Clone it into a project to set up an iterative optimization loop.

The three requirements for auto-research are absolute. **(1) A metric to optimize.** Concrete, measurable, reproducible. Examples: rubric score from an evaluator agent; mean absolute error against ground truth; pipeline runtime; conversion rate; cost per output. **(2) A change method to influence the metric.** What the agent is allowed to modify — system prompts, few-shot examples, model parameters, code paths, hyperparameters, data sources. **(3) An assessment to measure results.** How outputs are evaluated each iteration — a fresh evaluator instance, a deterministic scoring function, an A/B comparison.

The loop runs autonomously: agent proposes a change, executes it, measures, logs, proposes the next change. The dashboard shows iteration count, current metric, change history.

**Reference auto-research configurations.**

For document quality: METRIC = rubric score (1–10) on generated sections rated by an evaluator agent against reference documents; CHANGE METHOD = system prompts and few-shot examples; ASSESSMENT = run generated output through an Opus evaluation prompt scoring against the rubric; TARGET = consistently scoring 8+ on the rubric.

For pipeline speed: METRIC = end-to-end runtime; CHANGE METHOD = backend modifications — caching, parallel section generation, output assembly optimization, image compression; ASSESSMENT = time the full pipeline; TARGET = under 30 seconds.

For underwriting accuracy: METRIC = mean absolute error between projected and actual outcomes; CHANGE METHOD = agent prompts, data source weights, financial model assumptions; ASSESSMENT = run pipeline against known properties and compare to actual performance; TARGET = MAE below 5%.

For trading parameters: METRIC = Sharpe ratio over trailing 12-month backtest; CHANGE METHOD = momentum lookback periods, rebalance frequency, volatility thresholds, asset universe; ASSESSMENT = backtest API capturing Sharpe, max drawdown, annual return; TARGET = Sharpe above 1.5 with max drawdown below 15%.

For prompt optimization: METRIC = human evaluation score (1–10) of narrative outputs on clarity, actionability, accuracy, tone, completeness; CHANGE METHOD = system prompts, few-shot examples, output format instructions, temperature; ASSESSMENT = generate 10 outputs across diverse inputs, have Opus rate each on the criteria, average the scores; TARGET = average score 8.5+ across all criteria.

The reference prompt: "Clone github.com/karpathy/auto-research into the [project] repo. Set up an auto-research loop to optimize [target]. METRIC: [definition]. CHANGE METHOD: [scope of allowed modifications]. ASSESSMENT: [evaluator definition]. Give me a live dashboard to watch iterations. Target: [specific number]."

Auto-research is the Phase 9 capstone — the loop that runs after deploy and continuously improves the system without manual intervention. It compounds with the §7 self-optimization meta-prompts: meta-prompts improve human-AI interaction; auto-research improves AI-AI internal loops.

## §25 — Voice Dump → Compress

A pattern for getting full requirements out of the operator's head efficiently. Long-form requirements are easier to dictate than to type. But raw transcripts are token-expensive and disorganized.

The workflow. Open a voice memo or transcription tool. Talk for 5–15 minutes about the requirements: what the system should do, who it's for, constraints, edge cases, examples, gotchas. Save the transcript. Feed it to a cheap model (Haiku or a free tier) with: "Compress this voice dump into structured requirements. Headings: Goal, Users, Inputs, Outputs, Constraints, Edge Cases, Open Questions. Cut all filler, all repetition, all 'um' and 'like.' Output should be ~25% the length of the input."

Feed the compressed output to the main session as the first prompt. Cuts 75% of input tokens; preserves all signal.

This pairs with the global CLAUDE.md rule: "Never paste raw voice transcripts directly — compress them through a cheaper model first."

## §26 — Implementation Checklist (4-Week Ramp)

**Week 1 — Foundational setup.** Install Claude Code per §1. Install Antigravity or VS Code with the Claude Code extension. Enable Bypass Permissions and `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Download the desktop app. Run `/init` in the workspace root to scaffold the global CLAUDE.md, then customize per §4 with profile, interaction rules, Opus 4.7 calibration, task specification discipline, token conservation, and self-annealing protocol. Run the §70 Fresh-Session Overhead Audit on every project — disable per-project MCPs that aren't needed, prune any CLAUDE.md exceeding 200 lines. Connect 2–3 personal-productivity connectors per §101.

**Week 2 — DOE structure and subagent baseline.** Create the workspace folder structure per §11. Build the `/shared/execution/` library per §11B. Create the three baseline subagents in `.claude/agents/` per §9. Configure the MCP baseline per §10. Evaluate Managed Agents migration per §102 — pilot one workload. Set up Vault for any OAuth credentials per §104.

**Week 3 — Phase-aligned project builds.** Pick a project. Run Phase 2 (research) per §16. Run Phase 3 (planning) per §17. Run Phase 4 (design) per §18. Establish ground-truth benchmarks per §21. Begin Phase 5 (build) per §19 with worktrees per §20 if parallel.

**Week 4 — Production deployment, marketing, distribution.** Run the §12 security audit on the project before any production push. Deploy per §14B. Set up the §14C webhook routines. Build the design system in Claude Design per §57B. Generate first marketing assets per §56B. Launch the marketing cadence per §60. Enable tool_search per §105 for any project running >3 MCPs. Audit pipelines for programmatic-tool-calling opportunities per §105 Pattern 2. Scope a Plugin per §106.

**Strategic, ongoing.** Run quarterly /insights across all projects and promote learnings to the global CLAUDE.md per §7. Run consensus debates per §85 on any decision above the project-specific dollar threshold. Track three independent Claude metering surfaces per §14E. Monitor the MCP skill-delivery extension per §107. Quarterly: re-check directory composition per §108 for defensibility versus crowding.

---

# PART 3 — ADVANCED RESEARCH PATTERNS

The four patterns for getting beyond what a single Claude turn can produce. Use them when problem complexity, decision value, or asymmetric downside justifies the token spend.

## §27 — Fan-Out / Fan-In Research

The simplest multi-agent pattern. N research subagents work independently on slices of a problem; one synthesizer combines their outputs.

The default configuration: 5+ Sonnet subagents researching, one Opus synthesizer. Sonnet's cost-per-token is roughly 5× cheaper than Opus, and synthesis is the only step where Opus's marginal capability matters.

**Reference prompt:** "Use a fan-out fan-in researchers/synthesizer approach to research [question]. Minimum 5 sub-agents. Use Sonnet for research, Opus for synthesis. Each sub-agent saves findings to `active/research/raw/[topic]-agent-[N].md`. Synthesizer saves to `active/research/[topic]-[date].md`."

Fan-out / fan-in works in both terminal and IDE. It is the most underused pattern in the toolkit because operators default to single-turn queries when they should be parallelizing.

The use cases. Competitor analysis (one agent per competitor). Data source survey (one agent per provider). Codebase optimization analysis (one agent per concern: frontend, backend, database, security). Market research across regions or segments. Literature review across papers.

The benchmark figure: in Anthropic's evaluations, fan-out / fan-in subagents outperform single-agent Opus by 90%+ on research-style tasks.

## §28 — Stochastic Multi-Agent Consensus

When the goal is exhaustive enumeration — "all possible X" — rather than one optimal answer.

The pattern: spawn N agents (default 10) with the same core prompt but different perspectives or temperatures. Each agent independently generates 10+ responses with no coordination. A synthesizer collects all outputs, deduplicates, counts frequency, identifies consensus (3+ agents converged) and outliers (1 agent), ranks by consensus strength.

**Skill definition for `.claude/skills/stochastic-consensus/SKILL.md`:**

```yaml
---
name: stochastic-consensus
description: "Spawns N agents independently, each generates 10+ responses, then synthesizes consensus and outliers. Trigger: stochastic consensus, multi-agent consensus, run consensus."
---

# Stochastic Consensus

## Process
1. Extract problem statement
2. Spawn N agents (default 10), each with SAME core prompt but DIFFERENT perspective
3. Each agent independently generates 10+ responses — no coordination
4. Synthesizer agent (Opus) collects all outputs, deduplicates, counts frequency, identifies consensus (3+ agents) and outliers (1 agent), ranks by consensus strength

## Output
- Synthesized report to `active/research/[topic]-consensus-[date].md`
- Raw per-agent outputs to `active/research/raw/`
- Consensus matrix

## Models
- Sub-agents: Sonnet
- Synthesizer: Opus
```

**Reference prompt:** "Use stochastic multi-agent consensus to determine all of the different ways that you could [achieve goal]. I want every agent to come up with at least 10 independent responses. Then have them synthesized and turned into just a giant list of all of the possible things you could do."

The 100-agent variant is for high-value game-theoretic decisions per §9E. Cost runs $100–$1,000 per run; reserve for decisions where expected-value swing exceeds 100× the token cost.

**Stochastic consensus is terminal-only.** Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Does not work in IDE environments.

## §29 — Model-Chat / Debate

When agents need to challenge each other, not just enumerate independently.

The pattern: N agents (default 10) in a shared debate across multiple rounds (default 3). Each round, agents see all prior responses and refine their positions.

**Round 1.** Each agent independently states a position with arguments. No agent sees others yet.

**Round 2.** Each agent reads all Round 1 responses. Each must state whether they changed position and why; challenge at least one other agent's argument by name; introduce any new arguments inspired by reading others.

**Round 3.** Each agent reads all Round 1 + Round 2 responses. Each states their final position; identifies the strongest argument they heard from another agent; identifies the weakest argument and explains why; states what they changed their mind about.

The synthesizer (Opus) produces: points of strong agreement; unresolved disagreements (genuine tradeoffs with no clear winner); the 3 strongest arguments from the debate; the 3 weakest arguments that got challenged; recommended decision with reasoning; confidence level.

**Skill definition for `.claude/skills/model-chat/SKILL.md`:**

```yaml
---
name: model-chat
description: "Spawns N agents in a shared debate across multiple rounds. Each round, agents see all prior responses. Trigger: model-chat, debate, have agents debate, run model-chat."
---

# Model-Chat / Debate

## Process
1. Extract topic, number of agents (default 10), rounds (default 3)
2. Round 1: independent positions
3. Round 2: agents read all Round 1, update positions, challenge weak arguments
4. Round 3: final positions, identify strongest/weakest from debate
5. Synthesizer produces agreement, disagreements, strongest/weakest arguments, recommendation

## Output
- Full transcript to `active/model-chat/[topic]-debate-[date].md`
- Per-round transcripts to `active/model-chat/raw/`
- Final recommendation to `active/model-chat/[topic]-recommendation-[date].md`

## Models
- Debate agents: Sonnet
- Synthesizer: Opus
```

**Reference prompt:** "Run model-chat with [N] agents debating [question]. [N/2] agents argue [position A], [N/2] agents argue [position B]. Three rounds: independent positions, mutual challenge, final positions. Synthesizer identifies strongest arguments and recommends a decision."

**Model-chat is terminal-only.** Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Does not work in IDE environments.

## §30 — Agent Teams + Consensus

The most aggressive pattern: stochastic consensus combined with agent teams to produce parallel optimization across many dimensions simultaneously.

**Reference prompt:** "I'd like you to optimize [system / codebase] and turn it into a full-fledged [target]. Rather than do this naively yourself, take advantage of stochastic multi-agent consensus. Take that skill and apply it using the agent teams feature. Orchestrate a team of agents that fan out across the optimization dimensions, run consensus within each dimension, and synthesize across all teams."

Use cases. Codebase optimization where each agent team focuses on a different concern (frontend performance, backend architecture, database, security) with consensus within each team. Pre-launch product audit where teams tackle UX, technical debt, marketing positioning, and pricing strategy simultaneously. Trading strategy review where teams analyze edge decay, alternative signals, risk management, and live-vs-backtest divergence.

This is the highest-token pattern in the toolkit. A 4-team consensus run with 5 agents per team plus a synthesizer can hit $200–$500 in a single execution. Reserve for strategic decisions where the expected-value math justifies the spend.

## §31 — Browser Automation Patterns

Browser automation extends Claude beyond text. Three integration paths: Chrome DevTools MCP, Puppeteer/Playwright via dedicated MCPs, and Claude in Chrome extension for live browser sessions.

**Market data scraping.** "Using Chrome DevTools MCP, go to [data sites] for the following markets: [list]. For each market, collect: [structured field list]. Save to `active/market-snapshots/[location]-[date].json`. Compile a summary comparison table across all markets."

**Comp scraping.** "Using Chrome DevTools MCP, pull [type] comps for [target]. Go to [3 sites]. For each platform: search within [radius/filter], capture [field list], screenshot each. Compile all results into a single JSON file with source attribution. Calculate aggregate statistics. Save to `active/comp-data/[target]-comps-[date].json`."

**Listing search and screening.** "Using Chrome DevTools MCP, search for [target] matching: [criteria]. Go to [sites]. For each listing, capture: [fields]. Save results to `active/deal-screening/[market]-listings-[date].json`. Flag any matching [screening rule]."

**Long-running interactive sessions** use the Claude in Chrome extension. Live tab connection lets Claude execute JavaScript in the browser, navigate paginated results, extract data progressively, and accumulate state across pages. The pattern is heavier than DevTools MCP but handles authenticated sessions and dynamic content.

## §32 — Skill Conversion After Validation

Once a browser automation pattern works reliably, convert it from MCP-driven to skill-driven for token efficiency. Reference prompt: "The [MCP] works for [task]. Convert this to a skill instead — find the direct API endpoints (or build a stable scraper script), and build a Python script that calls them without the MCP overhead. Add to `/shared/execution/scraping/`."

The conversion typically drops 1–5K tokens of MCP overhead per session and eliminates the dependency on a chatty MCP that loads always.

---

# PART 4 — PRODUCTION SURFACES

The deployment surfaces for AI workflows. Each maps a different operational shape — interactive tool, scheduled job, event-triggered automation, customer-facing API.

## §33 — Surface Selection Matrix

| Workflow Shape | Surface | Why |
|---|---|---|
| Interactive coding/research | Claude Code (CLI / IDE / Desktop) | Full agentic runtime, parallel sessions |
| Non-developer team workflows | Claude Cowork | GUI for skills, MCPs, Managed Agents |
| Scheduled background jobs | Routines | Built-in, no infra |
| API endpoint with LLM in loop | Managed Agents | Sandboxed, OAuth vaults, $0.08/session-hour |
| Pure deterministic execution | Modal | No LLM overhead, pennies/month |
| GitHub event-triggered automation | Routines (webhook mode) | Native integration |
| Long-running autonomous agents | Managed Agents | Persistent sessions |

## §34 — Anthropic Plugin Repositories

**anthropics/skills.** Anthropic's production skills. Install via `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills`. Top skills:

- `docx` — Word document generation (python-docx production patterns)
- `pdf` — PDF generation
- `pdf-reading` — PDF extraction (page rasterization, text extraction, embedded image and table extraction, form field handling)
- `pptx` — PowerPoint generation
- `xlsx` — Excel generation and modification
- `frontend-design` — Polished UI generation patterns
- `skill-creator` — Skill scaffolding with evals, benchmarks, regression tests
- `file-reading` — Router skill for choosing the right reader per file type

**anthropics/claude-plugins-official.** The official plugin marketplace. Install via `/plugin marketplace add anthropics/claude-plugins-official`:

- `github` — MCP server for managing PRs and issues
- `claude-code-setup` — Analyzes codebase and recommends hooks, skills, and CLAUDE.md config
- `pyright-lsp` — Python type checking (catches Pydantic validation issues before runtime)
- `code-review` — Multi-agent PR review starter
- `commit-commands` — Commit message generation

**Community plugins.** `oh-my-claudecode` (yeachan-heo) provides multi-AI orchestration across Claude, Gemini, and Codex with 19 specialized agents and execution modes (autopilot, ralph, ultrawork, deep-interview, team mode, planning mode), built-in MCP tools (LSP integration, AST-based code search, persistent Python REPL, session state and memory), and magic keywords (autopilot, ulw, etc.).

## §35 — Connector Directory as Distribution

The Claude directory at claude.ai/directory holds 200+ connectors. April 2026 saw the consumer expansion: travel (AllTrails, Booking.com, TripAdvisor, Viator, StubHub), commerce (Instacart, Uber, Uber Eats, Taskrabbit, Thumbtack, Resy), media (Audible, Spotify), finance (Intuit Credit Karma, Intuit TurboTax). MCP SDKs at ~300M monthly downloads, up from ~100M at start of 2026 — 3× growth in a single quarter.

The directory is the single highest-leverage distribution channel for AI products. Submission path: build a remote MCP server per §104 patterns; submit via claude.com/docs/connectors/overview; track listing impressions weekly via the publisher dashboard. The viral compound: every new connector trains users to expect Claude can reach their tools, raising the implicit expectation that any specialized AI workflow appears in the directory.

---

# PART 5 — SELLING AGENTIC WORKFLOWS

The agency motion for productizing AI workflows for enterprise clients. Drawn from Nick Saraf's Agentic Sells course; tested at scale (two AI agencies to $160K/month combined revenue).

## §36 — The Overhang Pitch

AI capabilities are far beyond what most businesses use them for. Most companies are "drinking the Pacific Ocean with a tiny straw" — they copy-paste from ChatGPT and never integrate AI into operations.

The gap between reality and perception is the **arbitrage window**. The window is closing as awareness spreads, but in 2026 it remains wide open.

The credibility stats for client conversations. Frontier models score ~80% on SWE-bench Verified (professional-grade software engineering). Sub-agents outperform single-agent Opus by 90%+ on research tasks. Agentic workflows turn 3–4 hours/day of manual work into 30–40 hours of equivalent output. Self-annealing workflows get stronger over time, unlike n8n / Zapier flows that break silently. Most businesses already have SOPs — they just need conversion to directives.

The framing line: "Capital flows to whoever provides value. For centuries that value came from human labor. Agentic workflows redirect that river. The people who understand this technology now capture the arbitrage before the window closes."

## §37 — The DOE Sales Process

The six-step process tested at scale.

**1.** Ask the client: "Do you have a knowledge base or SOPs?"

**2.** Feed the entire knowledge base into Claude Code in one dump.

**3.** Within 15 minutes, turn SOPs into DOE directives plus execution scripts.

**4.** Demo a working workflow in the meeting — lead scraping, proposal generation, report automation. Not a slide deck. A working system.

**5.** Client sees: 90% of economically valuable work → automated.

**6.** Close: "We can have this running in production within 2 weeks."

The reference deployment: a $2M/yr dental marketing company. The director sat down with the consultant. The team's full knowledge base was fed into Claude Code. Fifteen minutes later, agentic workflows existed for most business functions. The director and managers now run 90% of economically valuable work through the IDE. All directives are readable by non-technical staff.

Why it works. Directives are human-readable — clients can review and improve them. No black boxes — full interpretability. The demo is in the meeting, not in a follow-up call. SOPs already exist — the consultant is converting format, not inventing process.

## §38 — Service Tiers

Four tiers with structural rationale. **Tier 1 — Diagnostic** ($5K, 2 weeks). A paid audit. Interview the team, map workflows, identify the 10 highest-ROI automation candidates, deliver a 20-page roadmap. No implementation. Low-friction door — the client can hire anyone to execute.

**Tier 2 — Foundation Deploy** ($15K, 30 days). Foundational infrastructure: global CLAUDE.md, folder structure, DOE framework, 3–5 initial skills, 2–3 sub-agents, Claude Code for the team, basic MCP setup for internal tools. Deliverable: working environment, 2-hour training, 30-day support. The no-brainer entry tier for committed clients.

**Tier 3 — Production Workflows** ($40K, 60 days). Foundation plus 5–10 production directives, full skill library scoped to the client's domain, Routines for recurring automations, 1–2 Managed Agents in production, Cowork onboarding for non-technical staff. Deliverable: multiple live automations producing measurable time savings, plus 90-day support. The production workhorse.

**Tier 4 — Enterprise** (custom, 90+ days, typically $100K–$250K). Production plus custom skill development, multi-department rollout, advanced patterns (multi-agent coordination, stochastic consensus for strategic decisions), Auto Mode for autonomous operation, Code Review for PR quality gates, Opus 4.7 effort-level guidance for client-facing infrastructure. One year of support and quarterly business reviews. The deep enterprise engagement.

The 30-day Foundation arc. **Week 1.** Discovery and audit — interview each team member 30 minutes, shadow 1–2 team members for a half-day, map current workflows, identify quick wins under 1 week of effort. **Week 2.** Design — draft global CLAUDE.md from interviews, propose folder structure, design 3–5 initial skills, design 2–3 sub-agents, get client approval. **Week 3.** Build — set up repos and Claude Code access, implement skills, write directives for top-5 workflows, configure MCPs. **Week 4.** Rollout and training — 2-hour training, pair-work with 2 power users, document everything in a runbook, kick off 30-day support.

## §39 — Discovery Playbook

The 30-minute client interview is the most important hour of the engagement. The questions, asked of each team member individually:

- Walk me through your day yesterday chronologically.
- Which of those tasks did you find annoying or repetitive?
- If you had an intern who could do anything, what would you give them?
- Where do you currently lose context switching between tools?
- What information lives only in your head that slows down teammates?
- What reports or documents do you produce repeatedly?
- What meetings feel like they could be replaced by a document?
- Where do you currently use AI tools, and what do you wish they did?
- What are you afraid AI will mess up?
- If we delivered perfect AI automation in 30 days, what would change?

For each identified workflow, document: the workflow name; the current process (who, time per week, tools, frequency, steps); the potential automation (which DOE layer it belongs in — Skill / Directive / Agent / Routine / Managed Agent — plus dependencies on tool MCPs, build effort in hours, savings as hours-per-week × hourly-rate, what could go wrong); a priority score of impact × feasibility ÷ risk.

The Tier 1 Diagnostic Report is a 20-page roadmap covering team-by-team workflow inventory, top-10 automation candidates with priority scores, recommended deployment path, expected time-savings projection, and a no-pressure summary that lets the client take the roadmap to any vendor.

## §40 — Pricing Rationale and Margins

Margins are healthy. Tier 1 takes 2 weeks at one consultant lead with mostly Claude work — gross margin north of 70%. Tier 2 takes 30 days with similar leverage. Tier 3 and Tier 4 require more consultant time but command commensurate pricing.

Growth comes from Tier 1 → Tier 2 conversions (target above 50%); Tier 2 → Tier 3 expansion (target above 30%); Tier 4 reference accounts compounding through case-study content and warm referrals.

The Memory Design service offering layers on top of Tier 2+. Three sub-tiers. **Memory Design Sprint** at $3,500 flat per agent pipeline: design per-agent memory scope (what goes in, what expires, review cadence), set up org-wide versus per-user stores, write the initial memory hygiene directive. **Memory + Initial Seed** at $8,000 one-time plus $1,200/month for monitoring: above plus 30-day memory review, seed memories from existing client data, audit log dashboard setup. **Memory Operations Retainer** at $3,500/month after Tier 2: above plus weekly audit-log review, memory schema drift detection, quarterly re-scoping, redaction on request.

The offering works because memory is now explicit in the platform (scoped permissions, audit logs, rollback) — clients see the surface but don't know how to operate it. Rakuten's 97% fewer first-pass errors at 27% lower cost and 34% lower latency make the ROI argument trivial. The positioning line: "You bought Managed Agents. We make them remember the right things, forget the wrong things, and prove it in the audit log."


# PART 6 — AI-POWERED MARKETING

The marketing stack combines AI-native production tools with a content-engine approach to produce volume and quality at a fraction of historic cost. The full stack: Idea Browser (business context) → Claude Design (decks, wireframes, hi-fi) → Paper (in-IDE iteration) → TailArc (reference component blocks) → Claude Code (build and deploy) → Pomelli (social campaigns, photoshoot, animate) → Remotion (programmatic video) → HumbleLytics (analytics, AB testing, CRO) → distribution surfaces (Twitter/X, LinkedIn, YouTube, Instagram).

## §53 — Marketing Strategy Overview

The content mix for an AI-native business: 40% educational (industry insights, tutorials, technical posts), 30% product (demos, case studies, behind-the-scenes), 20% personal (the build journey, lessons learned, contrarian takes), 10% direct response (offers, lead magnets).

The cadence: daily on Twitter/X (1–3 posts), 3× weekly on LinkedIn (longer-form), 1× weekly on YouTube (long-form video), 2–3× weekly on Instagram (Reels), weekly newsletter.

The compounding mechanic: each long-form piece (newsletter, YouTube, podcast) gets repurposed into ~15 derivative formats per §62. One piece of authentic content produces a week of distribution surface across every channel.

## §54 — Claude Design

Claude Design is a separate Anthropic product with its own weekly usage allowance, metered independently from chat and Claude Code. It is Opus 4.7 with a design canvas, comment tools, sliders, layered iteration, and export paths to PPTX, PDF, HTML, Canva, or Claude Code handoff bundles.

Claude Design is not a better Figma. It is a different AI-native category. Treating it as a canvas tool produces frustration. It does not replace a tasteful designer; it replaces the "I don't have a designer" bottleneck. It is not a video tool — output is 5/10; use Remotion for video.

Output strength: decks excellent (investor decks, LP one-pagers, seed decks); wireframes and hi-fi mockups very good; video weak.

The token-conservation hierarchy is the most important rule. Order operations from cheap to expensive: long prompt fixes are token-wasteful. The hierarchy:

1. **Upfront design-system work** (runs once, multiplies everything downstream)
2. **Initial Opus 4.7 generation** (the one expensive prompt)
3. **Comment-tool edits** (surgical, point-and-click, cheap)
4. **Sliders** (spacing, density, warmth — cheap)
5. **Re-prompts** (avoid unless starting fresh)

Fighting a bad start with long prompts burns the weekly allowance in under an hour. Front-load with one hour of `DESIGN.md` work for forever savings.

## §55 — DESIGN.md and Banning the Generic SaaS Aesthetic

`DESIGN.md` is the design analog to `CLAUDE.md`: a single file referenced at the start of every design session that fixes the brand voice, typography, palette, components, and explicit bans.

The standard `DESIGN.md` skeleton:

```markdown
## Brand Voice
[1–3 sentences describing the voice. Adjectives are not enough — give an
example sentence in the brand voice and an example of what the brand
voice rejects.]

## Typography
- Primary: [font family] [allowed weights] [size scale]
- Secondary: [if any, with restrictions]
- Maximum 1–3 faces total

## Color Palette
- Primary: #[hex] [semantic role]
- Accent: #[hex] [semantic role]
- Muted: #[hex] [semantic role]
- Maximum 5–7 colors with semantic roles

## Component Patterns
[Cards, buttons, forms, navigation — describe the canonical version of
each. Reference an example screenshot if available.]

## Animation Guidelines
[One word: subtle. Specify max duration, max distance, easing curve.]

## Aesthetic Direction
[One paragraph describing the overall feel.]

## Explicit Bans
- No Inter, Roboto, or Arial as primary typeface
- No blue-to-purple gradients
- No generic rounded-corner cards with drop shadows as the primary
  container pattern
- No stock gradient backgrounds
- [Any other anti-patterns specific to this brand]
```

The four bans above are the most important sentence in the file. They produce more distinctive output than any other refinement. Without them, Claude Design's default is the "YC batch 2024 aesthetic" — Inter typography, blue-to-purple gradient hero, rounded cards with drop shadows, stock gradient background. Banning these explicitly forces the model to reach for distinctive choices.

## §56 — Asset vs Systems Design Tool Selection

The selection rule:

| Need | Tool | Rationale |
|------|------|-----------|
| Systems design (website, app, full deck with design system) | Claude Design | AI excels at consistency across many artifacts; design-system extraction is its strength |
| Asset design (single image, single social post, one-off graphic) | Canva | Template library and single-asset workflow more mature |
| Pro design handoff (designer → engineer with strict specs) | Figma | Standard for component libraries, design tokens at scale, team workflows |

The default for AI-native operators: decks, pitch materials, OMs, and landing pages through Claude Design; one-off social graphics through Canva; component library for code handoff goes Claude Design → export HTML → hand to Claude Code.

## §57 — Claude Design Operating Patterns

Six patterns refined across many sessions:

**Socratic onboarding.** Claude Design's onboarding offers multiple-choice thesis answers rather than blank questions. Use it as thinking scaffolding — when you don't have a strong prior, the options reveal what the model thinks the design space is, and you'll often find your actual preference in an option you wouldn't have articulated.

**The "let it decide" default.** For any onboarding question where you don't have a strong preference, use the "let Claude decide" option. The model has sampled orders of magnitude more design than you. Its default on a low-stakes axis is usually fine.

**Less-prescriptive second version.** If the first generation feels over-constrained or generic, generate a loose-direction second version with a one-line aesthetic brief — "1950s retrofuturism," "Bauhaus editorial," "mid-century Swiss." Less-prescriptive runs often produce the most distinctive output because the model executes confidently within a well-known aesthetic.

**Design extraction without DESIGN.md.** Claude Design can extract the visual language from an existing branded asset — a deck, a website screenshot, a Canva template — and maintain consistency across new artifacts from that single example. Use when you have a branded asset but no formal design system, when you want a one-off companion artifact, or when testing whether Claude Design can capture your brand before investing in DESIGN.md.

**Self-polishing second pass.** After initial generation, Claude Design continues iterating on its own — fixing text overflow, alignment inconsistencies, small polish issues without being asked. Wait 30–60 seconds after generation completes before commenting. The second pass often resolves 20–40% of the issues you would have flagged.

**Variation-set generation.** For any decision where you'll want a second look, generate 4–6 layout variations in a single session. The cost is roughly the same as iterating on one, and the variation set surfaces options you wouldn't have articulated. Pick on substance, not on the first plausible draft.

The export hierarchy: HTML preserves animations, hover states, and responsive behavior; PPTX preserves layout but loses interactive elements; PDF freezes everything; Canva is editable but limited. For website work, export HTML and hand to Claude Code for refinement. For client decks, PPTX is fine because the client expects to edit. For static deliverables, PDF is the final form.

The SVG and code imagery boundary: Claude Design generates SVG graphics and code-based imagery competently for charts, diagrams, and abstract visuals — but struggles with photorealistic imagery. Use real photography or Pomelli-generated imagery (§59) for product shots, lifestyle imagery, and anything requiring photorealism.

## §58 — Paper: In-IDE Design Iteration

Paper is a design tool connected to Claude Code via MCP. It fills the gap between Figma and code — iterate on designs visually inside the IDE, create variations, then port to code. Variations are fast (no rewriting). Components port to code when ready.

The Paper workflow integrates with the §18 Screenshot Design Loop: screenshot reference sites; drop into Claude Code; ask Claude to extrapolate design elements and create a design system; reference the design system in future sessions; use Paper MCP to iterate on layouts before committing to code; use TailArc components as polished reference blocks.

The critical refinement prompt — be specific about subtlety:

```
Refine the design. Make sure you have consistent layouts and themes and
keep it subtle enough to ensure cohesiveness across the entire page.
```

The word "subtle" constrains the agent's tendency to over-animate or over-design.

## §59 — Pomelli: AI Brand Marketing Automation

Google Pomelli launched October 2025 and expanded globally in March 2026. It is free during beta with no credit card. It scans a website URL, builds a "Business DNA" profile (brand colors, fonts, tone, imagery style), and auto-generates brand-consistent campaigns, ad creatives, product photography, and animated video.

The four primary features:

**Business DNA.** Paste a URL. Pomelli extracts brand colors, fonts, tone, and visual identity in minutes.

**Campaign Generation.** Describe the campaign in plain English. Pomelli returns multiple variations with images, captions, and platform-specific formats.

**Photoshoot** (released February 2026). Upload product screenshots. Pomelli returns studio-quality marketing images, powered by the Nano Banana model.

**Animate** (released January 2026). Turn any static visual into a branded Reel- or TikTok-ready animated video with one click, powered by Veo 3.1.

The standard Pomelli workflow:

1. Enter the website URL. Pomelli builds the Business DNA.
2. Generate per-campaign variants in plain English.
3. Download campaign assets (Instagram posts, LinkedIn banners, ad creatives).
4. Use Animate for short video versions of the static creatives.
5. Use Photoshoot for product mockups.
6. Post per the §61 content calendar.

Limitations: no direct posting or scheduling — download and upload manually (or via Buffer / Hootsuite); English only during beta; works best with clear brand elements; cannot replace long-form video or complex narratives (use Remotion for that).

## §60 — Remotion: Programmatic Video Creation

Remotion is a React framework for creating videos programmatically with TypeScript and JSX. Instead of editing in Premiere or After Effects, you write code that defines animations, text, transitions, and visual elements. Template once, generate variations at scale. Programmatic, brand-consistent, scalable, integrates with Claude Code, exports MP4 for every social surface.

The three-step setup:

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Install the Remotion skill: visit the Remotion website, copy the one-line install command, paste into Claude Code; the skill provisions the entire video editing environment automatically
3. Verify by asking Claude to create a simple test video; if the Remotion studio opens in the browser with a preview, you're ready

Remotion works for AI video because of the real-time feedback loop. Claude writes code, sees the result instantly via browser preview, and iterates until it looks right. Other one-shot generation tools lack this loop and produce lower-quality output.

The standard templates to build for any AI-native business:

**30-second product demo** at 1080×1920. Animated title card in brand colors; screen-recording mockup; key stats animated in; CTA; royalty-free music. Vertical for Twitter/X, Instagram Reels, TikTok.

**15-second stat-highlight** template. Takes (stat number, stat label, context sentence) and generates variations. Use for headline metrics, comparison stats, social proof.

**30-second feature-announcement** template. Title; 3-panel breakdown with icon animations; before/after comparison; CTA.

**60-second educational** template. 3-second hook; 3–5 key points with animated text reveals; data visualization via Recharts; closing CTA.

**30-second reel/short edit** template for repurposing long-form content into vertical clips.

The five copy-paste prompts (battle-tested):

**Product Demo (20s):**

```
Create a 20-second product demo video for [App Name]. Here's the product
overview document [attach doc] and the website [paste URL]. I need: a
hook scene with the problem statement, a brand reveal with the logo and
tagline, 3-4 feature scenes showing the app in action with animated phone
mockups, smooth transitions between scenes, and a CTA at the end. Use
the brand colors from the website. Add background music and sound
effects for transitions. Vertical format (1080x1920).
```

**App Walkthrough (30s):**

```
Create a 30-second app walkthrough video for [App Name]. Show: opening
the app, the main dashboard, performing the core action, viewing results,
and closing on a value proposition. Real screenshots animated inside an
iPhone mockup. Subtle background music. Vertical format (1080x1920).
```

**Social Media Ad (15s):**

```
Create a 15-second social media ad for [App Name]. Open with a strong
hook (problem statement), reveal the product as the solution, show one
key feature with motion graphics, end with CTA "Try [App Name] free."
Vertical format (1080x1920). Energy: high.
```

**YouTube Explainer (30s, horizontal):**

```
Create a 30-second YouTube explainer for [App Name]. Horizontal format
(1920x1080). Open with the headline question, walk through the 3-step
explanation with motion graphics, end with the answer + CTA. Background
music + voiceover script that I'll record separately.
```

**Reel/Short Edit (30s):**

```
Create a 30-second reel by editing this long-form clip [attach clip].
Pull the strongest 30 seconds. Add captions throughout. Add 2-3 motion
graphic emphasis moments on the key insights. Vertical format. Music
matching the original tone.
```

The tips for better output: give Claude reference documents (product overview, brand guidelines, website URL) — more context yields better output; share real screenshots and assets so Claude animates them inside device mockups; always ask for sound effects and background music; watch the real-time preview and give specific feedback ("scene 3 is too slow," "make the phone mockup bigger"); keep videos short — 15–20s for ads, 20–30s for demos, 30–60s for educational; shorter is easier for Claude to nail and performs better on social.

The batch generation pattern uses Remotion's data-driven rendering:

```typescript
const videoData = [
  { product: "[Product A]", stat: "30min", comparison: "vs 8 hours manual" },
  { product: "[Product B]", stat: "6 agents", comparison: "full pipeline" },
  { product: "[Product C]", stat: "30%", comparison: "avg annual returns" },
];
// Render all variations:
// npx remotion render src/index.tsx StatHighlight --props='{"data": ...}'
```

## §61 — HumbleLytics and the AB Testing Loop

HumbleLytics is a Claude Code-native analytics layer. It integrates directly with Claude Code so the AB testing and CRO optimization loops are agentic by default, not manual.

The standard deployment: HumbleLytics on every public-facing surface. A weekly Routine pulls traffic and conversion data, identifies underperforming pages, generates variant hypotheses, and ships variants for testing. The AB testing cadence: weekly variant generation, two-week test windows, statistical significance threshold of 95%, ship the winner.

The corollary rule: do not build landing pages in Webflow or other no-code tools — build them in Next.js so Claude Code can read the source, modify it, and ship variants without leaving the terminal. Custom code lets the agent be your CMS.

The standard CRO optimization prompt:

```
Pull this week's HumbleLytics data for [SITE]. Identify the 3 pages
with the worst conversion-to-target metric. For each, generate 3 variant
hypotheses based on common CRO patterns (above-fold clarity, social
proof placement, CTA contrast, friction reduction, trust signals).

Build the variants in Next.js. Set up AB tests at 50/50 traffic split.
Save the variants and hypotheses to active/cro/[date]/.
Schedule a follow-up routine in 2 weeks to evaluate results at 95%
significance threshold.
```

## §62 — The Content Repurposing Engine

Every long-form piece (newsletter article, YouTube video, podcast episode) gets repurposed into ~15 derivative formats:

- 1 Twitter/X thread
- 5–7 standalone Twitter/X posts pulled from key insights
- 2–3 LinkedIn posts in different angles (educational, contrarian, product-tied)
- 1 60-second YouTube Short pulling the strongest 60 seconds
- 2–3 30-second Remotion-rendered Reels for Instagram and TikTok
- 1 quote-graphic for Pinterest
- 1 audiogram for SoundCloud or Twitter audio
- 1 200-word email teaser
- 1 SEO-optimized blog post variant

The engine is a Claude Code Routine that takes the long-form input and a "platform-format library" and outputs all 15 variants in one pass.

The reference cost: ~$2 in tokens per long-form piece's repurposing. Time saved versus manual: 4–6 hours per piece.

The standard repurposing prompt:

```
Repurpose [LONG-FORM ASSET — newsletter / YouTube transcript / podcast
transcript] into the standard 15-format engine output:

1. Twitter/X thread (5-12 tweets, narrative arc)
2. 5-7 standalone Twitter/X posts (each a complete insight)
3. 2-3 LinkedIn posts (one educational, one contrarian, one product-tied)
4. 60-second YouTube Short transcript (strongest 60 seconds)
5. 2-3 30-second Remotion Reel scripts
6. 1 quote-graphic concept (text + visual direction)
7. 1 audiogram script (60-90 seconds)
8. 200-word email teaser
9. SEO-optimized blog post variant (1500 words, H2/H3 structure)

Save all outputs to active/repurposing/[asset-name]-[date]/.
Reference the platform-format library at .claude/skills/repurposing/.
Match the original voice exactly — do not introduce new claims or change
the tone.
```

## §63 — AI Content Authenticity (Anti-Slop)

The anti-slop rule: never publish AI-generated content that has not been read end-to-end by a human before posting.

Specific bans on AI-native marketing output:

- No em-dash hallmarks of AI prose pervasively (sparingly used is fine; pervasive is a tell)
- No "It's not just X — it's Y" rhetorical structures
- No "In today's fast-paced world..." opener variations
- No "delve / tapestry / seamlessly / robust / leverage" as crutch words
- No listicles where items are obviously LLM-padded to hit a count
- No pictures of obviously-AI faces (six fingers, asymmetric ears) on any branded surface

The positive rule: every published piece passes the test of "would the founder actually say this in conversation with a peer?" If not, rewrite. The voice North Star is whatever the brand voice is — institutional, casual, contrarian, technical — but never corporate, never hype-y, never vague.

The pre-publish prompt:

```
Read this piece [PASTE]. Run it through the anti-slop check:

1. Does it contain any of the banned phrases? [list]
2. Does the rhetorical structure feel AI-generated?
3. Are there any factual claims I cannot verify?
4. Does the voice match my established brand voice in [reference asset]?
5. Would I be embarrassed to attribute this to myself in a peer
   conversation?

Flag any issues. Rewrite the flagged sections in my voice. Do not
introduce new claims.
```


---

# PART 7 — DISTRIBUTION

Distribution determines whether an AI product reaches 10 paying customers or 10,000. The 2026 reality is that AI-native product distribution looks different from 2020 SaaS distribution: programmatic SEO at scale, MCP servers in the connector directory, free tools as top-of-funnel, viral artifacts that spread inside the product, and AI-aware repurposing engines.

## §64 — Distribution > Engineering: The Great Flip

In 2020, the bottleneck was usually engineering. Building the product was hard; distribution was relatively cheap if the product was good (SEO, content, organic Twitter all worked).

In 2026, the engineering bottleneck has collapsed. Claude Code makes building 10× faster. Distribution is harder: organic reach degraded across every platform, paid CAC higher, AI-generated content saturates every channel.

The flip means more time goes into distribution mechanics than into engineering once the product works. Once core product-market fit is in sight, time spent on distribution returns more than time spent on marginal product features.

The seven distribution strategies in the AI-native playbook:

1. **MCP servers in the connector directory** as a sales team (§65)
2. **Programmatic SEO at scale** — 10,000+ pages (§66)
3. **Free tool as top-of-funnel** (§67)
4. **Answer Engine Optimization (AEO)** — SEO for AI assistants (§68)
5. **Viral artifacts** — every product output is shareable (§69)
6. **Buying a niche newsletter** for instant audience (§70)
7. **AI content repurposing** — covered in §62 above

Each compounds differently. The decision matrix in §71 maps which strategy fits which audience and product.

## §65 — Strategy 1: MCP Servers as a Sales Team

Ship the product as a remote MCP server in the Anthropic directory (§42, §103). Every Claude.ai user discovers it in context — when a user asks Claude about the product's domain, the MCP surfaces. The directory is the closest thing to App Store distribution for AI-native products.

The implementation requirements:

- Build remote (§104 Pattern 1) — local-only stdio servers do not qualify for directory placement
- Group tools around intent, not endpoints (§104 Pattern 2)
- Ship MCP Apps for the primary output (§104 Pattern 4) — interactive cards, rich semantics
- Use CIMD for auth (§104 Pattern 5)
- Pair the server with a companion skill (§107)
- Submit to claude.com/docs/connectors/overview
- Track directory listing impressions weekly via the publisher dashboard

The strategic posture: Q2–Q3 2026 is the window. As more connectors land, niche category placement becomes harder. Move fast on the directory.

## §66 — Strategy 2: Programmatic SEO at Scale

Generate 10,000+ pages targeting long-tail queries in the product's domain. Each page is generated by a Routine that pulls live data, runs a lightweight version of the product on representative inputs for that page's topic, and publishes a short page with a CTA to the full product.

The reference economics for an analysis product:

- Cost per page on Sonnet 4.6: ~$0.10
- Cost for 10,000 pages: ~$1,000 one-time
- Monthly refresh of top 1,000 pages: ~$100/month
- Expected outcome: 10,000 pages indexed within 6 months
- Long-tail traffic: 100–500 organic visits per month per page (most pages get few; a small number drive most traffic)
- Conversion to free trial: 1–5%

The infrastructure: Next.js with ISR (incremental static regeneration); pages stored in Supabase; sitemap generation; Google and Bing search console verification.

The standard programmatic SEO routine prompt:

```
Build a programmatic SEO routine for [PRODUCT]:

Target queries: "[BRACKETED TEMPLATE]" — e.g., "[city] rental property
analysis", "[city] vacation rental investment outlook"

For each query in the target list (provided as CSV):
1. Pull live data for the [variable] (rent comps, vacancy rates,
   demographics, recent transactions)
2. Run a lightweight version of [PRODUCT'S CORE ANALYSIS] on a
   representative example for that [variable]
3. Publish a short page (800-1500 words) with:
   - The market summary
   - The example analysis
   - A CTA: "Run a full analysis with [PRODUCT]"
   - Schema.org structured data
4. Add to sitemap
5. Monitor index status

Pages stored in Supabase. Next.js ISR for serving. Refresh top 1000
cities monthly.

Estimate: 10,000 pages at $0.10 each = $1000 one-time. Refresh cost:
$100/month.
```

The targeting rule: programmatic SEO works when the audience is large enough to support 10,000+ city/category/keyword pages. For narrow audiences (e.g., regional CRE brokers), the page count is too small to support the strategy economically. Different mechanic for different audience size.

## §67 — Strategy 3: Free Tool as Top of Funnel

Build a stripped-down version of the product as a free tool. Users get one-shot value (single analysis, single document, single calculation) at high quality, with the CTA "Sign up to get the full report / unlimited use / advanced features."

The reference shape: a free tool produces a real result with the headline metrics. The full product produces the complete deliverable with depth (more comps, deeper analysis, portfolio view, API access, integrations).

Free tier limits: typically one use per IP per day, 10 per email per month — enough to demonstrate value, scarce enough to drive conversion. Expected conversion to paid: 5–10%.

The free tool also serves as the programmatic SEO endpoint (§66). Every city/category/keyword page links to "Run a free analysis on [example]" through the free tool. Two strategies, one CTA target.

The standard free tool architecture prompt:

```
Build a free-tool version of [PRODUCT]:

User flow:
1. User submits [INPUT] (no signup required)
2. System runs a lightweight version of [PRODUCT] producing [OUTPUT]
3. Output includes:
   - Headline metrics (3-5 numbers)
   - Top-line recommendation
   - Visual/chart
4. CTA below output: "Sign up to get [WHAT'S BEHIND THE PAYWALL]"
5. Email capture for users who want to save the result

Limits:
- 1 use per IP per day
- 10 uses per email per month
- Rate limiting on the API

Frontend: Next.js. Backend: Modal or Railway. Database: Supabase.
Tracking: HumbleLytics.

Goal: 5-10% conversion to paid. Track per-source CAC.
```

## §68 — Strategy 4: Answer Engine Optimization (AEO)

AEO is SEO for AI assistants. When users ask Claude, ChatGPT, Perplexity, or Gemini a question relevant to the product's domain, the AI assistants pull from indexed sources. The strategy is to ensure the brand's content appears in those answers.

The tactics:

- Publish long-form authoritative content covering high-intent queries (target ~50 articles in the first year)
- Structure content with clear H2/H3 hierarchy and explicit answer sentences (so AI assistants extract clean snippets)
- Include citations and primary sources (AI assistants prefer citable content)
- Submit to known AI training data sources (Common Crawl, public datasets)

The expected outcome: by month 12, the brand's content appears in AI assistant answers for 20+ high-intent queries. Slow-build channel that compounds.

The standard AEO content brief:

```
Write a [TOPIC] reference article optimized for AI Answer Engines.

Structure:
- H1: The headline question, phrased the way users ask AI assistants
- H2 #1: One-sentence answer to the question, then 2-3 paragraphs of
  supporting explanation
- H2 #2-N: Sub-questions and sub-answers, each in the same one-sentence-
  then-explain structure
- Each major claim has a citation to a primary source

Voice: authoritative, neutral, fact-dense. No hype. No filler.
Length: 1500-2500 words.
Output: Markdown with proper schema.org Article structured data.

Goal: this article gets cited when users ask any AI assistant about
[TOPIC]. Avoid fluff that AI assistants will skip.
```

## §69 — Strategy 5: Viral Artifacts

Make every product output shareable. Every generated artifact carries a "Made with [PRODUCT]" footer with a link. Users proud of their output share it. Shared outputs drive signups.

For a document-generation product: every generated document has a "Shared via [PRODUCT]" footer with a link to a free version of the tool.

For an analysis product: every output has a public-shareable URL with the headline result and reasoning (the full detail behind a paywall). Users share their analyses on Twitter, niche forums, Reddit. Shared analyses drive signups.

For a track-record product (trading, fitness, productivity): weekly performance reports posted to a public account become a leading-indicator marketing channel. The track record markets itself.

The viral coefficient target: 0.3–0.5 across most categories. Each customer generates 0.3–0.5 new customers through shared artifacts. Meaningful even without going viral; transformative if the product is naturally viral.

The implementation prompt:

```
Make every output of [PRODUCT] viral-by-default.

For each generated artifact, add:
1. A "Made with [PRODUCT]" footer
2. A public-shareable URL (e.g., share.product.com/[uuid])
3. Open Graph and Twitter Card metadata so links preview well
4. UTM parameters tracking the source artifact
5. A "Run your own analysis" CTA in the footer of the shared view

For analytics:
- Track viral coefficient (signups per shared artifact)
- Track sharing surface (which platforms drive signups)
- Track converting shares (which artifacts drive paid conversions)

Goal: 0.3-0.5 viral coefficient. Reduce CAC by [X]%.
```

## §70 — Strategy 6: Buy a Niche Newsletter

For each target audience, identify the 3 most-read niche newsletters (5K–50K subscribers). Either advertise in them, or buy the smaller ones outright.

Acquisition cost for a 5K–20K newsletter: roughly $50K–$250K. The newsletter becomes a permanent distribution surface and a brand-owned thought leadership platform.

This is typically a Year 2+ strategy once cash flow supports it, not a Year 1 strategy. The scouting work (identifying the target newsletters, building relationships) starts in Year 1.

The scouting prompt:

```
Identify the top 5 niche newsletters in the [INDUSTRY/AUDIENCE] category.
For each:
- Subscriber count (estimated if not public)
- Founder/operator background
- Content cadence and quality
- Existing monetization model (ads, sponsorships, paid tiers)
- Approximate acquisition price (10-20x annual revenue is the rough rule)
- Strategic fit: how would [PRODUCT] benefit from owning this?
- Risk factors: founder dependency, audience trust, platform risk

Output as a comparison table plus a one-paragraph recommendation per
newsletter.
```

## §71 — Distribution Strategy Decision Matrix

The selection rule by audience size and product type:

| Audience | LTV | Best Strategies |
|----------|-----|-----------------|
| Niche professional (5K–50K total addressable) | High | MCP directory (§65), AEO (§68), viral artifacts (§69), niche newsletter (§70) |
| Broad consumer/SMB (50K–5M total addressable) | Mid | Programmatic SEO (§66), free tool (§67), viral artifacts (§69), MCP directory (§65) |
| Enterprise (1K–10K decision-makers) | Very high | Warm referrals from completed engagements, targeted content, AEO on enterprise queries |
| Technical/developer | Variable | MCP directory (§65), AEO (§68), open-source presence, technical content |

The recommended starting pair for any AI product launching in 2026: **MCP directory placement + free tool as top-of-funnel**. The MCP gets discovery; the free tool gets conversion. Both compound. Both are zero-CAC.

For products with broad audiences, layer in **programmatic SEO** within 90 days of launch — it takes 6 months to compound but the cost is low.

For products targeting enterprise, lead with **case-study content + AEO**. Reference accounts at the enterprise tier compound through warm referrals more than any acquisition channel.

## §72 — Markets of One

A "market of one" is a niche so specific that one well-built solution captures it entirely — not a million customers, but 500 deeply paying ones.

The strategic insight: as AI commoditizes general products, the defensible plays shift toward niches where deep domain knowledge and integrated workflows create real barriers. The competitive moat is not the product; it is the operator's domain fluency translated into the product.

The pattern recognition for identifying markets of one:

- A profession with 1K–50K practitioners nationally
- A tooling gap that current SaaS does not address
- A workflow currently done in spreadsheets or by hand
- A buyer who is technical enough to recognize good software but not so technical they will build their own

Examples by category: regional CRE brokers, family offices managing 50–500 unit portfolios, indie game developers, niche academic research workflows, specialty medical practice management, regional law firm matter management, vertical-specific HR for specialized industries.

The pricing for markets of one: $200–$2,000/month per customer. 500 customers at $1,000/month is $6M ARR — a real business with no need for 10,000 customers.

## §73 — Solo vs Team

The April 2026 practitioner data: solo founders ship faster but plateau on quality; two-founder teams ship slightly slower but deliver 87% of the way to professional outcomes versus 51% for solo. Teams win on quality benchmarks; solos win on iteration speed.

The operational implication: assign work along the comparative-advantage axis when in a two-founder team. Plan the highest-collaboration work for windows when both founders are available. Pitch enterprise sales explicitly as a "two-founder team" rather than solo — the market's current reliability heuristic favors the team framing.

For solo operators, the compensation pattern: lean heavier on agent teams (§29, §33, §34) to simulate the second-pair-of-eyes that a co-founder would provide. Run code review through multi-agent teams. Run consensus on strategic decisions. Maintain a rigorous schedule of audit prompts and self-critique loops.


---

# THE COPY-PASTE PROMPT LIBRARY

The 30 most-used prompts from the playbook, indexed for quick reference. Copy-paste; replace bracketed placeholders.

## Setup

```
/init
```

```
/context
```

```
/usage
```

```
/insights
```

## Self-Optimization Meta-Prompts (§7)

**Add to every CLAUDE.md permanently:**

```
When you have made a mistake, update CLAUDE.md with a running log of
things not to try next time. Format as research notes for future Claude
instances. Add under "Lab Notes — What Not To Do" at the bottom of the
file.
```

**Run after any major task:**

```
How could you have arrived at these conclusions and done everything I
just asked you to do faster and for fewer tokens? Save your answer in
the local CLAUDE.md under "User Preferences."
```

**Run after `/insights`:**

```
This is my Claude insights file. Distill the obvious design patterns
and recurring miscommunications into a list of high-information-density
snippets for my global CLAUDE.md. Optimize for token economy and avoid
the most common Claude mistakes.
```

## Research (§16, §25–§27)

**Fan-out / fan-in:**

```
Use a fan-out fan-in researchers/synthesizer approach to research:
[QUESTION]. Minimum five sub-agents. Use Sonnet for research, Opus to
synthesize.

Save synthesized output to active/research/[topic]-[date].md.
Save raw per-agent findings to active/research/raw/[topic]-agent-[N].md.
```

**Stochastic consensus (terminal only):**

```
Use stochastic multi-agent consensus with 10 agents to determine
[QUESTION]. Each agent independently generates 10+ responses. Synthesizer
collects all outputs, deduplicates, identifies consensus (3+ agents) and
outliers (1 agent insight worth keeping). Sub-agents Sonnet, synthesizer
Opus.

Save to active/research/[topic]-consensus-[date].md.
```

**Model-chat / debate (terminal only):**

```
Run model-chat with 10 agents over 3 rounds debating: [QUESTION].
Round 1: independent positions. Round 2: read all R1, update or
challenge. Round 3: final position + strongest/weakest argument from
others. Synthesizer (Opus) produces agreement, disagreements, top 3
strongest/weakest arguments, and recommended decision.

Save to active/model-chat/[topic]-debate-[date].md.
```

## Voice-Dump → Compress (§28)

```
This is a voice transcript of me describing requirements for [PROJECT].
Verbose and unstructured. Compress into a structured spec:

## Goals
## Constraints
## Acceptance criteria
## Open questions
## Out of scope

Preserve every requirement. Do not interpret or extrapolate. Output
only the structured spec.

Transcript:
[PASTE]
```

## Plan Mode (§17)

```
[Switch to Plan Mode]
Read all research findings in active/research/ and all debates in
active/model-chat/. Use them to architect [SYSTEM]. Produce a detailed
plan covering: system architecture, component specs, data flow, schema,
API design, frontend layout, test strategy, deployment topology.

Save each major section as a separate file in active/plans/.
Do not build anything yet.
```

```
Save this plan to active/plans/[plan-name].md.
```

```
I want to change two things:
- [CHANGE 1]
- [CHANGE 2]
Update the plan and save it again.
```

## Screenshot Design Loop (§18)

```
Here is a screenshot of a reference site whose visual design I want to
emulate. Build an HTML mockup of [PAGE/COMPONENT] for my product,
matching this aesthetic. Take a screenshot when done so I can compare.
```

```
Extrapolate the key design elements from these reference pages and help
me create a design system. Output as design-system.md covering color
palette, typography, spacing, component patterns, animation guidelines
(subtle only), and aesthetic direction. Save to .claude/design-system.md.
```

```
Refine the design. Make sure you have consistent layouts and themes and
keep it subtle enough to ensure cohesiveness across the entire page.
```

## Build (§19)

```
I have reviewed all plans in active/plans/. Switch to bypass permissions.
Read all plans before starting. Build [COMPONENT] per the plan in
active/plans/[component]-plan.md.

After completing:
1. Run the code-reviewer subagent
2. Run the QA subagent and have it generate tests
3. Fix any issues either subagent finds
4. Report back with a summary and any deviations from the plan
```

## Validate (§20)

```
Run the full validation gauntlet for [SYSTEM]:
1. Integration tests against tests/fixtures/
2. Reference benchmark against tests/reference/, threshold [X%]
3. UAT with 5 representative scenarios, rate quality on [criteria]
4. Security audit per .claude/rules/security.md, PASS/FAIL per category

Do not deploy until all four pass.
```

## Auto-Research (§32)

```
Clone github.com/karpathy/auto-research into [project repo]. Set up an
auto-research loop to optimize [METRIC NAME].

- METRIC: [definition]
- CHANGE METHOD: [what the loop modifies]
- ASSESSMENT: [how iterations are scored]
- TARGET: [threshold defining "done"]
- BUDGET: [max iterations or tokens]

Live dashboard for iterations. Save to active/auto-research/[metric]-[date]/.
```

## Git Worktrees (§31)

```bash
# Terminal — create worktrees first
git worktree add ../project-feature-a feature/a
git worktree add ../project-feature-b feature/b
```

```
The worktrees are at ../project-feature-a and ../project-feature-b.
Spawn one agent per worktree. Each agent works ONLY in its assigned
worktree. When done, run code-reviewer and QA on each, then merge to
main in dependency order.
```

## Skills (§21)

```
Create a skill called [skill-name] in .claude/skills/[skill-name]/.

skill.md should have YAML front matter (name, description, trigger
phrases), specify trigger conditions, define the process step-by-step,
define output format, note model selection.

Reference my other skills for formatting examples.
After creating, write evals in evals/. Test on a fresh instance.
```

## Browser Automation (§30)

```
Using Chrome DevTools MCP, scrape [TARGET SITES] for the following
fields: [LIST]. Filter for [CRITERIA]. Rate limit 1 request/5 sec.
Save results to active/scraping/[site]-[date].json with source attribution.
Validate every record has all required fields.
```

## Distribution (§65–§67)

**MCP server submission:**

```
Build [PRODUCT] as a remote MCP server for the Anthropic directory.
Apply the five Pattern rules:
1. Remote transport (not stdio)
2. Intent-grouped tools (not endpoint mirror)
3. MCP App for primary output
4. CIMD auth
5. Companion skill at .claude/skills/[product-skill]/

Submit to claude.com/docs/connectors/overview.
```

**Programmatic SEO:**

```
Build a programmatic SEO routine. Target queries: "[BRACKETED TEMPLATE]".
For each query: pull live data, run lightweight version of [PRODUCT],
publish 800-1500 word page with CTA, schema.org structured data, sitemap.
10,000 pages at $0.10 each. Refresh top 1000 monthly at $100/month.
```

**Free tool:**

```
Build a free-tool version of [PRODUCT]:
- User submits [INPUT] (no signup)
- System runs lightweight [PRODUCT] producing [OUTPUT]
- Output: headline metrics + recommendation + visual
- CTA: "Sign up to get [WHAT'S BEHIND PAYWALL]"
- Email capture optional
- Limits: 1/IP/day, 10/email/month
```

## Anti-Slop (§63)

```
Read this piece. Run the anti-slop check:
1. Banned phrases? [list]
2. Rhetorical structure feel AI-generated?
3. Factual claims I cannot verify?
4. Voice match brand voice in [reference]?
5. Would I be embarrassed to attribute this to myself in peer conversation?

Flag issues. Rewrite flagged sections in my voice. Do not introduce
new claims.
```

---

# QUICK REFERENCE

## The Nine-Phase Workflow

Setup → Research → Plan → Design → Build → Validate → Skills → Deploy → Optimize

Skipping phases produces predictable failures. Each phase has explicit deliverables.

## The DOE Framework

**D**irectives (the WHAT — natural-language SOPs in `directives/`) → **O**rchestration (the WHO — the agent reading directives at runtime) → **E**xecution (the HOW — deterministic Python scripts in `execution/`).

Achieves 2–3% error rates on business functions versus ~20% unconstrained.

## The Five After-Turn Options

1. **Continue** — same task, default
2. **`/rewind`** (double-Esc) — drop a wrong path; preserves prior reads
3. **`/clear`** — fresh session for new task
4. **`/compact`** with hint — bloated mid-task
5. **Subagent** — when you need just the conclusion, not the tool noise

## Effort Levels (Opus 4.7)

`low` → cost-sensitive | `medium` → routine coding | `high` → concurrent sessions | `xhigh` (default) → most coding | `max` → eval-ceiling problems

## Permission Modes

Plan Mode (read-only) → Edit Automatically (default) → Auto Mode (classifier-gated) → Bypass Permissions (full autonomy) → Ask Before Edits (high-stakes)

## The Five Critical Numbers

- **120K tokens (12% of 1M)** — the voluntary reset threshold
- **40–60K tokens** — typical fresh-session overhead before first prompt
- **98.5%** — share of session tokens that are re-reads in long sessions
- **92% → 78%** — retrieval accuracy drop from 256K → 1M tokens
- **0.95^N** — reliability of N chained subagents at 95% individual reliability

## The Three Memory Layers

§102 Managed Agents Memory (production, audited, scoped) → §86 Shared MCP Memory (cross-tool dev sync) → §87 Carrier File (zero-dependency manual snapshot)

## Reference Repositories

- `github.com/anthropics/skills`
- `github.com/anthropics/claude-plugins-official`
- `github.com/modelcontextprotocol/servers`
- `github.com/modelcontextprotocol/experimental-ext-skills`
- `github.com/punkpeye/awesome-mcp-servers`
- `github.com/karpathy/auto-research`

## Reference Documentation

- platform.claude.com/docs (full platform documentation)
- platform.claude.com/docs/en/managed-agents/memory (Managed Agents Memory beta)
- claude.ai/directory (connector directory)
- claude.com/docs/connectors/overview (connector submission)
- claude.ai/code/routines (Routines management)

---

# PART 8 — ADDENDUM: HIGH-ROI ADDITIONS

The patterns below were identified in a comprehensive audit of the source corpus and represent the highest-ROI additions to the foundation playbook. They cover practitioner principles from Anthropic's own product team, native Claude Code features under-documented in the early sections, and operational hygiene that prevents the most common late-stage failure modes.

## §200 — Product Management on the AI Exponential

Anthropic's head of Claude Code product (April 2026 essay) codified four principles that change how AI products are built. They are habit-shifts, not toolkit additions.

**Prototype the spec, do not just write it.** After writing any spec or plan, immediately prototype it in Claude Code — even a rough prototype changes the conversation more than a polished doc. Stakeholders react to running software in ways they never react to written architecture. Reserve the polished doc for after the prototype validates the direction.

**Optimize capability first; cut cost later.** The most common mistake is cutting tokens too early and shipping a weak product. Get the system to high quality on whatever model and effort tier produces the best output. Then, only after capability is locked in, work backward through cheaper models, sub-agent routing, advisor pairings, prompt compression, and skill conversion. Capability is the moat; cost is an optimization.

**The simplest implementation wins.** Clever workarounds for current model limitations become unnecessary the moment the next model drops. Anthropic cut roughly 20% of their own system prompt with the Opus 4.6 release because old hacks were no longer needed. Build the simplest thing that works at the current capability frontier; expect the frontier to move.

**Revisit prompts and skills with each model release.** Re-run every skill without its instructions and see if the base model can now do it without scaffolding. Re-test every prompt hack against the new model — many will be obsolete. Bake this into the upgrade routine: every time a new Anthropic model lands, run the regression suite (§22), then run a "could this be simpler now" pass on the top-5 most-used skills.

The standard upgrade-day prompt:

```
A new Anthropic model has released: [MODEL NAME, DATE].

Run the regression pass:
1. Execute the full skill regression suite (.claude/skills/*/evals/) on
   the new model. Report PASS/FAIL/IMPROVED per skill.
2. For each PASS skill, attempt the same task with the skill's instructions
   stripped — does the base model now succeed unaided? Flag candidates
   for retirement.
3. Re-run the top-5 most-invoked production prompts. Compare quality.
   Identify any prompt-engineering hacks that are now redundant.
4. Re-run the §70 Fresh-Session Overhead Audit; the new model may have
   different baseline token usage.
5. Update CLAUDE.md with any rules that are now obsolete.

Save findings to active/upgrades/[model]-[date].md.
```

## §201 — Code Review as an Agent Team

The `claude code-review` command (Team and Enterprise plans) dispatches a multi-agent team on every PR rather than a single review pass. The reference benchmarks: roughly 84% of large PRs receive findings worth acting on; fewer than 1% of findings are flagged as incorrect by reviewers. Cost runs $15–25 per review.

The configuration: enable in admin settings. The team auto-includes a security reviewer, a test-coverage reviewer, an architectural reviewer, and a documentation reviewer. Output appears as inline GitHub PR comments and a top-level summary comment ranking findings by severity.

The integration pattern: wire `claude code-review` into a Routine (§40) on the GitHub PR-opened webhook. The agent team review fires before any human reviewer is requested, so human review starts with the issues already triaged.

The prompt to verify configuration:

```
Verify our claude code-review setup:

1. Confirm code-review is enabled at the org level (admin settings)
2. Confirm the GitHub webhook routine is firing on PR-opened events
3. Pull the last 10 reviews and report:
   - Average finding count per PR
   - Average severity distribution
   - Average reviewer agreement rate
   - Total spend
4. Flag any PRs where the team missed a real issue (false negative)
5. Recommend any tuning to the reviewer team composition

Save the audit to active/qa/code-review-audit-[date].md.
```

## §202 — Skill-Creator: Evals, Benchmarks, Regression

The Skill-Creator plugin gained four capabilities in March 2026 that promote skills from one-off scripts to versioned, testable artifacts: **evals** (test cases with inputs and expected outputs), **benchmarks** (running skills against test suites to measure accuracy), **regression testing** (catching when model updates break existing skills), and **description optimization** (improving trigger accuracy so skills activate when they should).

The Skill-Creator is available three ways: built into Claude.ai and Cowork; as a plugin for Claude Code at `github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator`; and in the skills repo at `github.com/anthropics/skills/tree/main/skills/skill-creator`.

The updated skill creation workflow:

1. Do the task manually once with Claude, noting the steps
2. Ask Claude to format it as a skill with scripts and YAML front matter
3. **Write evals: define test inputs and expected outputs** (the new step)
4. **Run benchmarks on a fresh instance** (the new step)
5. Test on a fresh instance (no prior context bias)
6. Fix errors, update skill
7. **Run regression tests after model updates** (the new step)
8. **Optimize the skill description for trigger accuracy** (the new step)
9. Save under `.claude/skills/[skill-name]/`

The standard skill-with-evals creation prompt (extends §21):

```
Create a skill called [skill-name] in .claude/skills/[skill-name]/.

skill.md has YAML front matter (name, description, trigger phrases),
specifies trigger conditions, defines the process step-by-step, defines
output format, and notes model selection.

evals/ subdirectory contains:
- test_cases.json with at least 5 (input, expected_output) pairs
- regression_baseline.md documenting current model + current pass rate
- description_test.md with 10 user prompts that should trigger this skill
  and 10 that should not, to verify the description's trigger accuracy

Run the evals on a fresh Claude instance. Report:
- Pass rate on test cases
- False positive rate on description test (skill triggered when it
  shouldn't)
- False negative rate on description test (skill didn't trigger when
  it should)

Iterate skill.md until pass rate ≥95% and trigger accuracy ≥95% on
both directions.
```

Target accuracy: 95%+ on the eval suite. Re-run after every model upgrade as part of the §74 upgrade-day pass.

## §203 — Notification Hooks

Claude Code's hooks system fires shell commands on events. The `Stop` event fires when a task completes. Wire it to play a sound when long-running tasks finish, freeing the operator to context-switch without missing completion.

The configuration lives at `~/.claude/settings.json`. It is shared across all Claude Code surfaces (CLI, Antigravity, VS Code, JetBrains) — configure once, works everywhere.

The cross-platform configurations:

**macOS:**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "afplay /System/Library/Sounds/Glass.aiff"
      }
    ]
  }
}
```

**Linux:**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "paplay /usr/share/sounds/freedesktop/stereo/complete.oga"
      }
    ]
  }
}
```

**Windows (PowerShell):**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "powershell -c \"(New-Object Media.SoundPlayer 'C:\\Windows\\Media\\notify.wav').PlaySync()\""
      }
    ]
  }
}
```

**Cross-platform terminal bell fallback:**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "printf '\\a'"
      }
    ]
  }
}
```

A simpler one-line config command exists: `claude config set --global preferredNotifChannel terminal_bell`.

For richer notifications on macOS, combine sound with a desktop banner:

```json
"command": "afplay /System/Library/Sounds/Glass.aiff && osascript -e 'display notification \"Task complete\" with title \"Claude Code\"'"
```

The hooks system supports more events: `PreToolUse` fires before any tool call (useful for guardrails); `PostToolUse` fires after a tool call completes (useful for logging or post-processing). Reserve hooks for events that genuinely should always fire — every hook adds latency and complicates debugging.

A useful pattern: have Claude create its own notification hook at the operator's request. Example: "Please play a sound when you're done with this task. Create whatever hook you need." Claude writes the appropriate `settings.json` modification, applies it, and confirms.

## §204 — Status Line Customization

The `/status line` slash command customizes the Claude Code terminal status bar. The high-ROI default adds three elements: a token-usage progress bar, the active model, and the current Git branch.

The standard setup prompt:

```
/status line
Update my status line so it includes:
- A loading bar showing tokens used out of total context
- The current model (Opus 4.7 / Sonnet 4.6 / Haiku 4.5)
- The current Git branch
- An indicator when in Plan Mode vs Edit Auto vs Bypass Permissions

Use compact formatting — total status line under 80 characters.
```

The token-usage bar is the highest-value addition. Operating without it means the operator only notices context bloat at autocompact, which is too late (§8). With the bar visible, the 120K threshold (§72) is enforceable in muscle memory rather than as a discipline.

## §205 — `/compact` with Priority Guidance

The `/compact` slash command is more powerful than the bare invocation suggests. It accepts a free-form steering hint that controls what survives the summarization pass.

The bare form: `/compact` (Claude decides what to keep, lossy)

The steered form: `/compact [INSTRUCTIONS]` (Claude prioritizes per the hint)

Reference invocations:

```
/compact preserve all API endpoints and Supabase schema details
```

```
/compact focus on the auth refactor; drop the test debugging tangent
```

```
/compact keep all decisions and rationale; drop the file-by-file
exploration; preserve the agent prompt iterations
```

```
/compact prioritize the in-progress feature; everything before the
current commit can be summarized aggressively
```

The principle: compaction is lossy by definition. The hint controls which losses are acceptable. Without a hint, Claude makes the call at its least intelligent point (high context rot at the end of session). With a hint, the operator chooses what matters before the summarizer runs.

## §206 — The Distillation Prompt

A specialized prompt for compressing many sources (playbook drafts, research outputs, blog summaries, transcripts) into a single high-density CLAUDE.md update. Not for everyday use; reserve for periodic consolidation, typically after a major reading session or quarterly review.

The full prompt:

```
I have multiple source files: a master playbook, project-specific
playbooks, course notes, blog post summaries, and podcast transcripts.

Distill ALL of these into a compressed, high-information-density update
for my CLAUDE.md. NOT the full content. Just the rules, principles, and
patterns that should change how you behave on every future task.

Rules for the compression:
- Maximum 200 lines total
- Bullet points only, no paragraphs
- Each bullet must be actionable — something you DO differently
- Group by category: Architecture, Agent Interaction, Token Management,
  Deployment, Self-Annealing, Tool Design, Security
- No context that's already obvious
- Prioritize rules that PREVENT mistakes over rules that explain concepts
- Include specific patterns: shared state, generator-verifier, advisor
  tool config, progressive disclosure
- Include deployment decisions: what goes on Managed Agents vs Modal
- Include the DOE framework rules that actually matter at execution time

Read these files:
- .claude/CLAUDE.md (current CLAUDE.md)
- .claude/rules/ (all rule files)
- active/research/ (all research outputs)
- active/model-chat/ (all debate outputs)
- active/plans/ (all plans)
- directives/ (all directives)

Then produce a compressed learnings section I can append to my CLAUDE.md.
Save it to active/compressed-learnings.md for my review before I add it.
```

The discipline: review the output before adding it to CLAUDE.md. Compounding AI compression errors degrade quality. Take the best 50–100 lines, cut anything that duplicates existing rules files, and keep CLAUDE.md under 500 lines total.

## §207 — Skepticism for Community Tools

Not every tool surfaced by community posts, AI-generated guides, or social-media threads exists. Among recently-circulated examples that were either fictional or unverifiable: "OneContext" claiming to be an `npm i -g onecontext-ai` package; "OpenClaw" claiming to be an Anthropic-adjacent framework; certain MCP server claims with eye-catching savings ("704K tokens → 2.6K tokens, 99.6% savings on Yahoo Finance"). Some of these resolve to no real package on npm, no real GitHub repository, or measured benchmarks that cannot be reproduced.

The verification protocol before installing any tool surfaced from a non-Anthropic, non-major-vendor source:

1. **Resolve the claim.** Search for the GitHub repository directly. Confirm the org or user exists and the repo is recent and active.
2. **Resolve the package.** Search npm or PyPI for the exact package name. Verify it has reasonable download numbers and a maintained changelog.
3. **Verify the benchmark.** If the tool claims a measured improvement, look for the methodology. Untraceable numbers are red flags.
4. **Sanity-check the model references.** If the tool references models like "claude-3-opus" when the current model is Opus 4.7, the source is stale or hallucinated.
5. **Run in an isolated environment.** Even after the above, install in a sandbox or container before integrating into a production workflow.

The fallback rule: when in doubt, the legitimate built-in techniques (skills, MCPs from the official directory, sub-agents, the §76 Format Conversion Economics, careful CLAUDE.md curation) cover the vast majority of optimization needs without external dependencies.

The gold-standard sources are:

- **Anthropic's official documentation** at platform.claude.com/docs and claude.com/docs
- **Anthropic's official GitHub orgs** at github.com/anthropics
- **The MCP standard's organization** at github.com/modelcontextprotocol
- **Verified practitioner sources** with measurable engagement (book authors, course publishers with revenue, podcast hosts with discoverable archives)

## §208 — The Anthropic API: Direct Use Patterns

Beyond Claude Code, the Anthropic API supports building agents directly. The reference patterns belong in the toolkit even for operators who primarily use Claude Code, because Managed Agents (§37), Routines (§40), and any custom MCP server (§44) ultimately call the API underneath.

The Python and Node SDKs follow the same shape: `client.messages.create(model=..., messages=[...], tools=[...])`.

The minimal agent loop:

```python
import anthropic

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY from env

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    tools=[
        {
            "name": "search_property",
            "description": "Search property records",
            "input_schema": {
                "type": "object",
                "properties": {
                    "address": {"type": "string"}
                },
                "required": ["address"]
            }
        }
    ],
    messages=[{"role": "user", "content": "Find 123 Main St"}]
)
```

The Advisor Tool (§9B) configuration:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",  # the executor
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-7",
            "max_uses": 3
        }
        # ... your other tools
    ],
    extra_headers={
        "anthropic-beta": "advisor-tool-2026-03-01"
    },
    messages=[{"role": "user", "content": "[TASK]"}]
)
```

The MCP-server-as-Python pattern:

```python
from mcp import Server

server = Server("my-server")

@server.tool()
async def my_tool(arg: str) -> dict:
    """Tool description"""
    return {"result": "..."}
```

For the most up-to-date patterns, the Anthropic documentation at platform.claude.com/docs is canonical. Patterns drift across SDK versions; pin a known-good version in production until validated.

## §209 — Diversification: Conductor and Codex MCP

Two specific tools support the §35 diversification posture beyond the conceptual pattern.

**Conductor** is a desktop platform that runs Claude Code and OpenAI Codex (and other agents) in parallel isolated workspaces. If Claude degrades or Anthropic experiences an outage, work shifts to Codex without context loss. The recommended split for most operators is roughly 70% Claude Code, 30% alternatives.

**Codex MCP server** lets Claude Code delegate tasks to OpenAI models from within a Claude Code session. Install with `npm i -g @openai/codex`, then add to Claude Code MCP config with the OpenAI API key. Useful for cross-model verification: have Claude write code, have Codex review it, have Claude review the review.

The standard cross-tool sync prompt:

```
Duplicate the workspace configuration. Take everything Claude-specific —
the CLAUDE.md, .claude/ folder structure, skill formats — and produce a
generic agent specification compatible with Codex CLI (and Cursor, and
Aider).

Save to:
- agents.md (in the repo root)
- .codex/ (mirror of .claude/ structure)
- .cursor/ (mirror of .claude/ structure)

Going forward, when CLAUDE.md is updated, mirror the change to all
parallel directories in the same commit. This is the backup system.
```

The CLAUDE.md addition that enforces the discipline:

```
When you update the local CLAUDE.md, also update agents.md with the
equivalent changes in a format compatible with non-Claude coding agents.
This is our backup system — we cannot afford downtime if Anthropic has
an outage.
```

## §210 — The Cleanup Cadence

The `active/` folder accumulates research outputs, plan files, design mockups, scraping results, model-chat transcripts, audit reports, and one-off experiments. Without periodic cleanup, the workspace becomes archaeological — every session reads or ignores stale content, both of which cost.

The standard cadence:

**Weekly:** delete merged Git branches; archive completed experiment folders to `archive/[year]/[month]/`; compact `active/research/raw/` (keep synthesized outputs, drop raw per-agent findings older than 30 days); delete obsolete plan files for shipped features.

**Monthly:** prune unused MCPs from the loadout; review the skill registry and disable any skill not invoked in 30 days; compress old conversation exports (one tarball per month under `archive/conversations/`); review CLAUDE.md and rules/ for accumulated cruft.

**Quarterly:** run `/insights` across all projects and feed the output into the §80 distillation pass; promote learnings to global CLAUDE.md; review the diversification mirror (agents.md, .codex/, .cursor/) for drift; run a §22 validation gauntlet on production systems.

**Per release:** run the §74 upgrade-day pass when any Anthropic model updates.

The standard weekly cleanup prompt:

```
Run the weekly active/ folder cleanup:

1. List all files in active/ older than 30 days, grouped by directory
2. For each, propose: KEEP, ARCHIVE, or DELETE
   - KEEP: actively referenced from CLAUDE.md, rules/, or current plans
   - ARCHIVE: completed work that may need future reference; move to
     archive/[year]/[month]/
   - DELETE: superseded versions, raw agent outputs older than 30 days,
     experimental dead ends
3. Show me the proposed actions before executing anything
4. After my approval, execute the moves and deletions
5. Report final counts: kept / archived / deleted, and the size reduction

Do not delete anything from .claude/, rules/, directives/, or execution/.
```

The discipline saves token cost (smaller search spaces in `active/`) and decision cost (fewer stale files to ignore in every fresh session).

---

# PART 9 — V1.2 ADDENDUM: PRODUCTION ENGINEERING PATTERNS

This addendum integrates eight Anthropic engineering posts published April 28–30, 2026, plus the `/ultrareview` research preview shipped in Claude Code v2.1.86 (escalating to v2.1.111 with branch and PR modes). The patterns are deliberately weighted toward production-grade reliability — context durability, prompt caching, verification pipelines, agent fleets — because the late-April 2026 release wave moves the frontier of what counts as a "production-ready" agent forward by a meaningful step. Sections continue from §210; cross-references to V1.1 sections use the existing §NN notation.

## §211 — The Context-as-Artifact Discipline

The thesis from Brendan MacLean's 17-year onboarding methodology applied to Claude Code: context is a project artifact like code or tests, not a session variable. Version it, grow it, maintain it. Skipping this is why most developer workflows plateau.

The Skyline reference deployment runs on a 700,000-line C# codebase maintained for 17 years through dozens of grad-student rotations. The pwiz-ai pattern is the operational unit: a separate repository — distinct from the code repo — holding all AI context. Separation matters because context grows at a different cadence than code, applies across all branches and time points, and survives any individual contributor leaving. The split is not the only valid choice; same-repo storage works if it is genuinely versioned and maintained. What is non-negotiable is that context lives somewhere it can be tracked, reviewed, and inherited.

The two-tier architecture: `CLAUDE.md` is the lay of the land — environment setup, repo structure, where the documentation lives, project-specific conventions. The expertise lives in skills under `.claude/skills/` , each one a focused encoding of a specific capability. CLAUDE.md is never a wiki; it is a router. The wiki is the linked documentation. The skills are the procedural know-how.

Operational rule: when the same explanation is needed in three or more sessions, it goes into a skill. When the same correction is needed in three or more sessions, it goes into CLAUDE.md. The cycle compounds — each skill reduces friction for every subsequent session.

The compounding payoff is concrete. Skyline's Files View panel, abandoned for a year after the owning developer left, shipped in two weeks with all final commits co-authored by Claude. The nightly test management module, untouched for three years after losing its maintainer, gained features in less than a day. The mobilogram pane — built by a developer who had been skeptical of agentic coding tools — shipped as a new plotting extension with explicit Claude Code credit.

## §212 — Reference-Don't-Embed Skill Architecture

The most important skill design rule observed in production: skills should reference a central knowledge base, not duplicate content. Each skill points into the documentation rather than embedding the documentation. Skills stay lightweight (faster to load, easier to update) and the knowledge base remains the single source of truth.

The pattern: a `skyline-development` skill that orients Claude to the project and points to the documentation directory, not a skill that contains the documentation. A `version-control` skill that encodes the project's commit and PR conventions and references the contributing guide, not a skill that copies the contributing guide. A `debugging` skill that defines the debugging methodology and references the architecture map, not a skill that includes the architecture map.

The benefit at scale: when documentation updates, all skills inherit the update for free. When a skill needs revision, the revision is small and localized. The anti-pattern (embedding) creates a silent drift between skill content and source-of-truth documentation, and skills bloat to the point that they consume meaningful context just to load.

The rule applies to the skill's body, not to its trigger description. Trigger descriptions should be specific and self-contained — the front-matter description is what determines whether the skill loads at all, and it has a roughly 60-token budget.

## §213 — The Debugging Skill: Anti-Guess-and-Test

Without a debugging skill, the model defaults to "guess and test" — modify code, run, observe, modify again. The pattern wastes time and corrupts the codebase with speculative changes. The fix is a debugging skill with an explicit always-load trigger: "ALWAYS load when investigating bugs, failures, or unexpected behavior."

The standard debugging skill body covers six steps. (1) Reproduce the failure deterministically before any code change. (2) Read the failing code path end-to-end before forming a hypothesis. (3) State the hypothesis explicitly — what is the model's current best guess for the root cause, with confidence. (4) Predict what the next observation should show if the hypothesis is correct. (5) Run the observation. If it disconfirms the hypothesis, return to step 2 with new information. (6) Only after the root cause is identified does code change.

The skill's value is not what it tells Claude to do; it is what it forbids. Without it, Claude rushes toward a fix. With it, Claude is structurally constrained toward investigation. Production teams report dramatic reductions in regression-introduction rates after installing a debugging skill of this shape.

Pair with §201 (Code Review as an Agent Team) for compounded effect: the debugger investigates root cause; the reviewer team verifies the fix does not introduce new defects.

## §214 — Prototype-the-Spec: PM Workflow on the Exponential

The product-management discipline shift, drawn from Anthropic's Managed Agents PM (April 29, 2026): API design used to live in documents and comment threads; in the agentic era, build with what you ship. A spec that reads elegantly in a doc can fall apart the first time you try to build against it.

The workflow split is concrete and replicable. Use Claude (chat) and Claude Cowork for open-ended research and discovery — the murky, early-stage exploration where ongoing conversation is the right mode. Once the job-to-be-done is sharp, switch to Claude Code to write and ship a custom agent for it, built atop Managed Agents. The two-pronged payoff: building against your own product raises the ceiling on what you can imagine shipping next, and the same development muscle automates the long tail of operational work that used to stall in your backlog.

The standard PM-day-one prompt sequence: chat to surface the shape of the problem; switch to Claude Code with the Managed Agents skill loaded; sketch the agent in plain English; let Claude scaffold it; iterate end-to-end before any spec is finalized. Multi-week doc reviews are replaced by an afternoon of running prototypes.

The unlock for non-engineering PMs: the latest Claude Code includes the built-in `claude-api skill`. Prompt with "start onboarding for managed agents in Claude API" and Claude walks the integration steps inline. No prior infrastructure familiarity required.

## §215 — Bespoke Agents Per Job-To-Be-Done

The new operational unit for any role-specific workflow is a bespoke Managed Agent — not a Zapier flow, not a one-off script, not a recurring meeting. Three reference patterns from the Managed Agents launch:

The Adoption Analytics agent has persistent access to internal databases plus skills for understanding the data schemas. It runs queries, surfaces interesting outliers and patterns, and uses memory of prior runs (§102) to build on previous findings. It compounds — each run is smarter than the last because it remembers what it has already investigated.

The Developer Sentiment Monitoring agent uses the pre-built web search tool plus guidance on focus areas to scan a specific list of domains for the latest user feedback. Because the volume of content is high, it fans out research to multiple agents in parallel (§9C Orchestrator-Subagent), waits for results, and synthesizes the findings into a single report.

The Demo Building agent has access to demo GitHub repos, branding assets, and an event deck. It turns prebuilt templates into a polished demo tailored to the audience for a specific conference or customer meeting. The same workflow that previously required 1–2 hours per event becomes a single prompt.

The pattern generalizes. Anywhere there is a recurring job that requires interpretation plus access to internal data plus a tailored output, a bespoke Managed Agent is the right shape. The build cost is roughly an afternoon. The runtime cost is fractions of a dollar per invocation. The operational cost is zero.

## §216 — The claude-api Skill and /claude-api Commands

The `claude-api` skill (introduced in Claude Code in March 2026, expanded April 29, 2026 to CodeRabbit, JetBrains, Junie, Resolve AI, and Warp) captures the details that make Claude API code work well: which agent pattern fits a given job, what parameters change between model generations, and when to apply prompt caching. It stays current as SDKs change. The result is fewer errors, better caching, cleaner agent patterns, and smoother model migrations.

Three high-leverage invocations work anywhere the skill is available:

"Improve my cache hit rate" → applies the prompt-caching rules in §217 that most developers miss.

"Add context compaction to my agent" → walks through the compaction primitives and the cache-safe forking pattern in §218.

"Upgrade me to the latest Claude model" → reviews code and updates model names, prompts, and effort settings for a new model. In Claude Code specifically, this is invocable directly as `/claude-api migrate`. The migration command updates model references, moves manual thinking settings to adaptive thinking (§8B), removes outdated parameters and beta headers, and suggests the right effort level inline.

"Build a deep research agent for my industry" → walks through configuring Managed Agents end-to-end. In Claude Code, invocable directly as `/claude-api managed-agents-onboard`.

The skill is open source at github.com/anthropics/skills/tree/main/skills/claude-api . Any Claude-powered coding tool can bundle it; setup is roughly 20 lines of CI. The migration on every model release is the biggest single workflow improvement: the §74 upgrade-day prompt becomes a single command.

## §217 — Prompt Caching Is Everything: The Cache-Prefix Discipline

The single highest-leverage technical pattern from the April 30, 2026 Claude Code engineering post: prompt caching is the foundation that makes long-running agentic products feasible. Reusing computation across roundtrips is what allows Claude Code's pricing and rate limits to make economic sense at scale. Anthropic runs alerts on cache hit rate and treats cache breaks as production incidents.

The mechanism: the API caches everything from the start of the request up to each `cache_control` breakpoint. Caching is prefix-match — any change anywhere in the prefix invalidates everything after it.

The four-layer prompt structure that maximizes hit rate, ordered most-stable to least-stable:

(1) Static system prompt and tool definitions — globally cached across all sessions.
(2) CLAUDE.md content — cached within a project.
(3) Session-specific context — cached within a single session.
(4) Conversation messages — only the new turn invalidates.

The fragility is real. Cache breaks observed in production at Anthropic include: putting an in-depth timestamp in the static system prompt; shuffling tool order non-deterministically across requests; updating tool parameters mid-session.

The five hard rules: (a) static content first, dynamic content last; (b) never change models mid-session — cache is unique to the model, so switching from Opus to Haiku at 100K tokens costs more than completing on Opus; (c) never add or remove tools mid-session — use tools to model state transitions instead (see §220); (d) for time updates or file changes, push them via a `<system-reminder>` tag in the next user message rather than editing the prompt; (e) monitor cache hit rate like uptime — a few percentage points of cache miss can dramatically affect cost and latency.

The implication for any agent built on the API: design the entire system around the prefix-match constraint from day one. Get the ordering right and most caching works for free.

## §218 — Cache-Safe Forking (Compaction Without Breaking Cache)

The naive compaction pattern — separate API call with "summarize this" system prompt and no tools — is exactly the trap. Caching only applies when the prefix matches byte-for-byte from the start. The summarization call's prefix diverges at the first token, so the entire conversation re-bills at the uncached input rate. The longer the conversation needing compaction, the more expensive the compaction itself.

The fix is cache-safe forking: when running compaction, use the exact same system prompt, user context, system context, and tool definitions as the parent conversation. Prepend the parent's conversation messages, then append the compaction prompt as a new user message at the end. From the API's perspective the request looks nearly identical to the parent's last request, so the cached prefix is reused. The only new tokens are the compaction prompt itself.

Reserve a "compaction buffer" of context window space — enough room for the compaction prompt and the summary output tokens. Without the buffer, compaction can trigger context-overflow errors at the wrong moment.

The same forking principle generalizes. Any side computation — skill execution, summarization, validation pass, side question — should reuse the parent's prefix where possible. Forking with identical cache-safe parameters means the side computation gets cache hits on the parent's prefix, and only the new instructions are billed at full rate.

This pattern is now built directly into the API as native compaction (`platform.claude.com/docs/en/build-with-claude/compaction`). For new agents, use the native primitive. For existing agents, port to it during the next refactor.

## §219 — Tool Search and defer_loading

Loading dozens of MCP tool definitions on every request consumes meaningful context budget. Removing tools mid-conversation breaks the cache (§217). The native solution: `defer_loading: true` on tool stubs.

The mechanism: send lightweight stubs (the tool name and a short description, marked `defer_loading: true`) instead of the full tool schemas. The model can "discover" tools via the tool search tool (§105) when needed. Full schemas load only when the model selects them. The cached prefix stays stable because the same stubs always appear in the same order.

The composed payoff: Anthropic's internal testing reports an 85%+ reduction in tool-definition tokens with high selection accuracy preserved (§105 Pattern 1), plus a roughly 37% reduction on multi-step workflows (§105 Pattern 2). The combination compounds across servers — leaner context, fewer round-trips, faster responses.

The integration cost is low. Existing MCP configurations gain `defer_loading: true` on individual tools. The agent's behavior is unchanged. The cache hit rate jumps. Run this audit on every project with five or more MCPs.

## §220 — Plan Mode Is a Tool, Not a Tool Swap

The instructive design lesson: when Claude Code's Plan Mode shipped, the obvious implementation was to swap out the tool set for read-only tools when entering Plan Mode. This would break the cache at every mode toggle.

The shipped solution keeps all tools in the request at all times and uses `EnterPlanMode` and `ExitPlanMode` as tools themselves. When the user toggles Plan Mode, the agent gets a system message explaining the mode and its constraints — explore the codebase, do not edit files, call `ExitPlanMode` when the plan is complete. Tool definitions never change. The cache survives every mode toggle.

A bonus: because `EnterPlanMode` is a tool the model can call autonomously, the agent can self-elect into Plan Mode when it detects a hard problem, without any cache break.

The general principle: model state transitions through tools, not through tool-set changes. Anywhere an agent has multiple modes — Plan vs Build, Read-Only vs Edit, Verbose vs Summary, Production vs Sandbox — the cache-preserving implementation is the same pattern. Add tools that gate behavior; never swap the toolset.

## §221 — Content Engineering vs Prompt Engineering (Kepler)

The Kepler Finance team's framing, drawn from their April 30, 2026 case study: "Prompt engineering optimizes a call. Content engineering optimizes the system around the call." For high-stakes domains, content engineering is the larger lever.

Kepler indexed 26M+ SEC filings, 50M+ public documents, 1M+ private documents, and 14,000+ companies across 27 global markets in under three months — and built infrastructure that validates every number to the exact filing, page, and line item. The breakthrough was not a better prompt. It was a deliberate split between deterministic infrastructure and LLM reasoning, with structured domain knowledge (proprietary ontology, definitions, and formulas) packaged around every Claude call.

The four content-engineering levers (apply to any verticalized AI product):

(1) Hand the model exactly what it needs to succeed at exactly its stage. Retrieval is a job for a query engine. Computation is a job for a formula engine. Claude is for interpretation, decomposition, and reasoning. Asking Claude to retrieve and compute and reason in one call leaves quality on the table — and creates verification gaps.

(2) Build a domain ontology. Map domain concepts to precise definitions and formulas. For finance: enterprise value, segment revenue, fiscal-period normalization. For healthcare: clinical-trial-data-to-treatment-protocol mapping. For legal: precedent traceability. The ontology is customizable per use case, but the spine is shared.

(3) Define hard boundaries between resolve-locally and escalate-to-human. Most models, given an ambiguous term, pick one meaning and continue. Claude in Kepler's setup stops and asks the analyst to decide. That behavior matters more than any benchmark score because one wrong assumption early in the analysis breaks everything downstream.

(4) Build idempotent skills around the most common workflows. Same input, same output, every time. Skills coordinate between deterministic and nondeterministic stages. Kepler built skills for enterprise-value calculations across complex capital structures (preferred shares, convertibles, minority interests) and segment-revenue waterfall reconciliation across reporting-period changes — both are exactly the right shape for skill encoding.

## §222 — Deterministic Infrastructure + LLM Reasoning Split

The Kepler architectural pattern that generalizes to any verifiable AI product: surround the model with deterministic execution environments, and reserve the model for the parts that require interpretation. Same input always generates same output for everything that needs to be provably correct.

The split:

| Stage | Engine | Why |
|---|---|---|
| Retrieval | Query engine (deterministic) | Same query → same documents |
| Computation | Formula engine (deterministic) | Same numbers in → same numbers out |
| Interpretation | Claude (Opus 4.7 for hard reasoning) | Decompose intent, resolve ambiguity, produce structured plans |
| High-throughput constrained tasks | Claude (Sonnet 4.6) | Where tasks are well-bounded |

The benefit at scale: a small team can build the equivalent of what would otherwise require many domain-specific NLP engineers. Kepler's claim is that new capabilities that would take a large team months ship in weeks because the architecture is modular. Reasoning improves at one stage without touching the rest of the pipeline.

The pattern applies wherever professionals need verifiable answers from large document collections — finance, healthcare, legal, compliance, regulatory. The architecture is domain-agnostic; the ontology is domain-specific.

## §223 — Model-Stage Matching for Multi-Stage Pipelines

Running a verticalized AI pipeline on a single model leaves either quality or cost on the table. The Kepler stage-matching policy makes the trade-offs explicit:

Opus 4.7 for complex reasoning — decomposing intent, resolving ambiguity, producing structured execution plans, navigating overloaded terminology, holding long multi-step plans together. The benchmark difference: on long, multi-step plans with interdependencies, all but Claude started taking shortcuts or losing track of constraints by the fourth or fifth step. Opus consistently held the plan together.

Sonnet 4.6 for high-throughput constrained stages — where the task is well-defined and the input space is bounded. Tasks that benefit from Opus's depth on edge cases but where most calls are routine.

Specialized models trained on the domain (some Claude-foundation, some proprietary) for narrow recall tasks. Kepler reports 94% accuracy on mapping financial statement labels to standardized taxonomy codes, versus 38–46% for off-the-shelf models. The lesson: for genuinely narrow, high-volume tasks, fine-tuned smaller models can outperform much larger general models.

The composition principle: each stage gets the smallest model that delivers the required quality. The synthesis point gets the strongest model. Cost compounds as the pipeline grows; quality compounds as the model fits.

The Advisor Tool (§9B) is the simplest expression of stage-matching for any team that does not need a custom pipeline. Sonnet 4.6 as executor with Opus 4.7 as advisor delivers +2.7% on SWE-bench Multilingual versus Sonnet alone, with 11.9% cost reduction per agentic task.

## §224 — Ground-Truth Evaluation Pipelines (The Pre-Production Gate)

The Kepler verification discipline is now the standard for any production AI deployment in a regulated or trust-critical domain: every prompt change, model upgrade, and context modification is tested against thousands of cases before production. Automated evaluation pipelines compare Claude's output against known-correct answers at every stage, checking both the structured plan and the final computed result.

When a test fails, the failure is traceable — the issue was in Claude's reasoning, the context provided, or the downstream execution, and the trace identifies which. When Anthropic ships a new model, Kepler benchmarks within hours and knows exactly which stages improve, which regress, and which need prompt adjustments.

The four operational rules:

(1) Test every stage independently. End-to-end tests catch nothing about which stage broke.

(2) Test the full pipeline end-to-end. Stage-level tests catch nothing about composition errors.

(3) In high-stakes domains, a silent regression is how you lose a client permanently. The cost of detection has to be lower than the cost of one missed regression.

(4) The evaluation pipeline is itself a project artifact. Version it. Update it. Treat regressions in the eval suite as production bugs.

This pattern extends §22 (Skill-Creator with evals) to the entire pipeline. The skill-creator workflow scales to per-skill evals; this scales to whole-system evals. Wire the eval suite into a Routine that fires nightly and on every model release.

## §225 — Provenance from Day One

Professionals in regulated industries (finance, legal, healthcare, compliance) are trained to verify everything. Every figure must trace to a source document. Provenance is not a feature added at the end — it has to shape the entire system.

The Kepler implementation: every figure pulled from verified SEC filings is tagged at ingest with the filing, page, and line item. Computation routes through deterministic infrastructure that preserves the lineage. The result is an Excel template where, with a single click, analysts trace each number back to its exact line item highlighted in the source document.

The four design rules: (a) tag every fact with its source at ingest, never retroactively; (b) preserve lineage through every computation — operations on facts produce new facts whose lineage references the inputs; (c) require source-of-truth resolution for every output, not just every input; (d) build the audit log as a first-class artifact that downstream compliance systems consume.

The compliance package required to even engage with regulated buyers: full audit logging, siloed customer environments, end-to-end provenance, SOC 2 Type II, ISO 27001 (or in progress). Build this from the start; retrofitting costs more and delays the first regulated-customer contract by quarters.

Kepler's architecture is domain-agnostic by design. The team started in finance deliberately — dense data, overloaded terminology, complex calculations, zero tolerance for error. The architecture built to survive that scrutiny applies wherever professionals need verifiable answers from large document collections.

## §226 — Cowork Five-Level Maturity Model

The April 29, 2026 Cowork enterprise deployment guide formalizes adoption maturity. Use it to diagnose where any team currently sits and what the next move is.

Level 1 — Chat Q&A. Individuals using Claude (chat) for drafting, summarization, research. Value is per-individual. No shared infrastructure. The default starting point for non-developer teams.

Level 2 — Connected Workflows. Cowork installed; users connect Slack, Google Drive, Gmail, the browser. Claude operates across local files plus connected apps. Value compounds within the individual's workflow. Skills are not yet shared.

Level 3 — Shared Skills. Skills built by power users are installed by the team. The accountant who built the variance-analysis skill makes it available to every analyst. Value compounds at the team level. The team's procedural knowledge becomes inheritable.

Level 4 — Shared Plugins. Plugins (skills + MCPs + hooks bundled per §106) deploy across departments. Finance gets the data plugin; legal gets the contract-review plugin; sales gets the deal-pipeline plugin. Value compounds at the department level. Each plugin is the encoded operating procedure of a function.

Level 5 — Department-Wide Plugins. Plugins are managed centrally — versioned, audited, governed. The shared firm infrastructure that the Cowork blog quotes Airtree describing. Skills built by one person are used by everyone, and the organization develops a portfolio of reusable AI capabilities.

The honest assessment: most enterprises in mid-2026 sit at Level 1 or 2. Level 3 requires deliberate investment in skill authorship. Level 4 requires plugin-development capacity. Level 5 requires governance, security, and analytics maturity. The right next move is always one level up — never skip levels because the operational discipline at each level is what makes the next level work.

## §227 — Cowork Six-Month Deployment Roadmap

The standard rollout cadence for moving from champion teams to organization-wide deployment:

Month 1 — Champion team selection. Identify 3–5 power users across distinct functions. Provide Cowork access plus skill-creator training. Collect baseline metrics (hours-per-week on rote tasks, deliverable cycle time).

Month 2 — First production skills. Each champion ships at least two domain-specific skills. Champions document the skill purpose, trigger conditions, and expected output. Internal blog post or all-hands demo.

Month 3 — Pilot expansion. Each champion onboards 5–10 colleagues. Skills move from individual to team. Build the first plugin (skills + MCPs + connectors bundled) for the strongest function.

Month 4 — Department rollout. The pilot department deploys Cowork plus plugins to every team member. Collect post-deployment metrics versus baseline. Identify the next two departments for rollout.

Month 5 — Cross-department pattern recognition. The plugins from one department are reviewed for cross-department applicability. Shared infrastructure (RBAC, group spend limits, OpenTelemetry pipelines) is configured per §10C.

Month 6 — Organization-wide. Cowork becomes the default surface for any non-developer workflow. Plugins are governed centrally. Analytics dashboards track usage and cost by team. The organization's procedural knowledge is encoded as inheritable infrastructure.

The customer references the Cowork blog highlights — Thomson Reuters, Zapier, Jamf — all describe this arc. The patterns are broadly applicable across industries and company sizes. The variable is not what to do; it is how fast each level can be sustained.

## §228 — Three Pillars of Enterprise AI Transformation

The April 30, 2026 enterprise-agents guide names three pillars that distinguish AI deployments that compound from those that plateau within a quarter:

Pillar 1 — Upskill employees with AI that reflects how the organization actually works. Generic Claude.ai usage is not transformation. Encoding the firm's voice, style, decision criteria, and approval workflows into skills and plugins is what produces durable productivity gains. Reference deployments (L'Oreal, Lyft, Rakuten) describe specific encoded workflows tied to specific business outcomes.

Pillar 2 — Compress information-dense processes without sacrificing human-in-the-loop judgment. The high-leverage targets are workflows where humans currently spend most of their time on retrieval, formatting, and synthesis — leaving little time for the judgment the firm actually pays them for. Compress retrieval/format/synthesis with Claude; reserve the human for the judgment. The Rakuten figure cited elsewhere (97% fewer first-pass errors at 27% lower cost and 34% lower latency on long-running learning agents — §102) is what this pillar achieves at scale.

Pillar 3 — Build new product capabilities that generate revenue, not just reduce cost. The cost-reduction story plateaus because cost cannot go below zero. The revenue-generation story compounds because each new capability creates a new market surface. Verticalized AI products that productize internal workflows for external customers are the high-multiplier path. Kepler is one such productization (§221–§225); it captures domain-specific infrastructure into a customer-facing platform.

The "agentic thinking divide" the guide calls out: organizations that view agents as tools-to-deploy plateau; organizations that view agents as employees-to-manage compound. The Digital Employee mental model (§83) is the operational form of this distinction. Wire it into every agent with named personas, written job descriptions, and tracked KPIs.

## §229 — Claude Security: Native Replacement for the §12 Audit

Claude Security (public beta as of April 30, 2026, formerly Claude Code Security) makes the §12 manual security audit largely obsolete for Enterprise customers. It uses Opus 4.7 to scan repositories for vulnerabilities and generate targeted patches, available directly from the Claude.ai sidebar or at claude.ai/security . Available now to Enterprise; Team and Max access coming.

The mechanism differs from pattern-matching scanners. Claude reasons about code as a security researcher would — understanding component interaction across files and modules, tracing data flows, reading the source. Each finding includes a confidence rating, severity, likely impact, and reproduction instructions. The multi-stage validation pipeline independently examines each finding before it reaches an analyst, keeping signal high.

The four production-tested capabilities, refined across hundreds of enterprise pilots:

(a) Confidence-rated findings with reproduction steps. The signal that reaches the team is worth acting on.
(b) Time-from-scan-to-fix as the metric that matters. Multiple teams report scan-to-applied-patch in a single sitting versus days of back-and-forth between security and engineering.
(c) Scheduled scans for ongoing coverage rather than one-off audits. Set a regular cadence around reviewing and acting on findings.
(d) Targeted scans (per directory or branch), dismissable findings with documented reasons (so future reviewers trust prior triage), CSV/Markdown export for audit systems, and Slack/Jira webhook integration.

The deployment options expanded to the broader ecosystem. Direct in Claude Security for Enterprise customers. Embedded in CrowdStrike Falcon, Microsoft Security, Palo Alto Networks, SentinelOne, TrendAI, and Wiz for organizations using those platforms. Through services partners (Accenture, BCG, Deloitte, Infosys, PwC) for organizations preferring a guided rollout.

The §12 audit prompt in V1.0 still has value for non-Enterprise teams and for in-CI lightweight scanning. The shift: for any Enterprise team, run Claude Security as the default audit and reserve the §12 prompt for ad-hoc spot checks during development. For non-Enterprise teams, keep the §12 prompt as the primary audit until Team-tier access opens.

The note on safeguards: Opus 4.7 includes cyber safeguards that automatically detect and block requests suggestive of prohibited or high-risk cybersecurity uses. Organizations doing legitimate security work that may trigger these safeguards can join the Cyber Verification Program — frontier capability access for verified defenders.

## §230 — `/ultrareview`: The Cloud Bug-Hunter Fleet

`/ultrareview` is a research-preview command shipped in Claude Code v2.1.86 (with branch and PR modes formalized in v2.1.111 on April 16, 2026). It launches a fleet of reviewer agents in a remote Anthropic sandbox to find bugs in your branch or pull request. Each finding is independently reproduced and verified before it is surfaced.

The mechanism, four stages in the cloud sandbox:

(1) Setup — Anthropic provisions remote infrastructure and spins up the agent fleet. Default fleet is 5 agents; configurations support up to roughly 20. Setup takes about 90 seconds.
(2) Find — Agents explore different execution paths through the changed code in parallel. Race conditions, logic errors, and cross-module type mismatches receive pressure from multiple angles at once.
(3) Verify — Separate agents independently reproduce each candidate finding. Anthropic's internal target is below 1% incorrect-finding rate. The verification stage is what differentiates this command from `/review`.
(4) Deduplicate — Multiple agents often surface the same issue from different angles. Dedup combines them into a single, enriched finding with multi-angle context.

A typical review takes 5–20 minutes depending on diff size. It runs as a background task — terminal stays usable, the session can close, and findings drop into Claude Code and Claude Desktop when ready. Track with `/tasks` ; stop with `/tasks` (stopping archives the session and returns no partial findings).

The two invocation modes:

`/ultrareview` (no arguments) — reviews the diff between the current branch and the default branch, including uncommitted and staged changes. Use when working locally on a manageable repo.

`/ultrareview <PR-number>` — clones directly from GitHub. Use when the repo is too large to bundle, or when reviewing a PR opened by a teammate. Push the branch, open a draft PR, then pass the number.

The CI variant: `claude ultrareview <args>` runs the same review headlessly. It launches the remote review, blocks until complete, prints findings to stdout, and exits 0 on success or 1 on failure. Wire into pre-merge CI for any branch where the diff justifies the cost.

Free runs: Pro and Max subscribers receive three free ultrareview runs to try the feature. **The runs are a one-time allotment per account, do not refresh, and expire May 5, 2026.** After the free allotment ends or expires, each review bills as extra usage at typically $5–$20 depending on diff size. Team and Enterprise plans pay per review from the start (no free tier).

Prerequisites: Claude Code v2.1.86 or later; authentication with a Claude.ai account (API-key-only auth does not qualify); extra usage enabled on the account (verify with `/extra-usage` ). The command blocks at launch if extra usage is off and cannot be enabled mid-flow.

## §231 — Spending the Three Free Runs Before May 5, 2026

The free allocation is small and expiring. Treat it as test capital, not as a routine review tool.

What to spend free runs on:
- Authentication and authorization changes (auth flows, session handling, RBAC additions, OAuth integrations) — the highest-cost-when-broken category.
- Schema migrations on production databases, especially anything that touches a 1M+ row table, modifies indexes, or alters constraints. The reviewers catch lock-duration risks that single-pass review misses.
- Refactors on shared components — anything imported by 10+ files where the blast radius of a regression is large.
- Payment, billing, or fiduciary code paths. The cost of a single production bug here easily justifies the run.
- Pre-launch reviews of any new product surface that will be exposed to customer traffic.

What to never spend free runs on:
- Typo fixes, dependency bumps, formatting-only PRs, single-file CRUD additions. The expected finding count is too low to justify the run.
- Repos with no diff against the default branch — the command returns "no commits or changes to review."
- Branches still mid-implementation. Run `/review` (local, fast, free) until the branch is genuinely merge-ready, then spend the ultrareview run on the final shape.
- PRs you have not yet read. The reviewers find bugs; the human reviewer judges whether the bugs matter for the product, the user, the roadmap. Reading the PR first is what makes the findings actionable.

The recommended allocation across the three free runs by May 5, 2026, for a typical operator: Run 1 — an authentication or authorization PR. Run 2 — a schema migration. Run 3 — a refactor on shared components. This spread covers the most expensive risk classes and produces a personal calibration of whether the post-trial pricing ($5–$20 per review) is worth it for the operator's specific risk profile.

The pre-flight checklist: confirm `/extra-usage` is on; commit (or at least stage) everything in the diff so the bundle is predictable; ensure CLAUDE.md is tight (the reviewers read it — non-obvious project rules belong there so the review enforces them); pair with `/security-review` for any security-sensitive subset of the change.

## §232 — `/ultrareview` vs `/review` vs Code Review (the Three-Tier Decision)

Three different review primitives exist. They target different stages and different cost profiles.

Tier 1 — `/review` (every PR). Fast, cheap, local. Single-pass scan inside the Claude Code session. The right tool for typo fixes, config edits, dependency bumps, single-file changes, and any branch you are still iterating on. Anthropic reports a 31% finding rate on small PRs, averaging 0.5 issues per scan. Use it freely.

Tier 2 — `/ultrareview` (substantial pre-merge changes). Cloud-based. Multi-agent fleet with independent verification. The right tool for auth, migrations, refactors, and any change where confidence matters before merging. Costs $5–$20 per run after the free allotment. Use it deliberately on the changes that would keep you up at night if something slipped through.

Tier 3 — Claude Code `code-review` (Team and Enterprise, multi-agent PR review on every PR). The agent-team pattern from §201. Wired to the GitHub webhook so it fires on PR-opened events and posts inline review comments before any human reviewer is requested. Roughly 84% of large PRs receive findings worth acting on; sub-1% of findings are flagged as incorrect by reviewers. Cost runs $15–$25 per review.

The honest production framework after a week of testing the three tiers:

| PR type | Primary tool | Why |
|---|---|---|
| Trivial (typo, dep bump, single-line) | `/review` | Fast, free, sufficient |
| Small feature (under 200 lines, low blast radius) | `/review` + `code-review` if Team/Enterprise | The webhook automation pays for itself |
| Substantial change (auth, migrations, refactors) | `/ultrareview` + human review | Verification is what justifies the cost |
| Security-sensitive subset | `/security-review` + Claude Security scan | Specialized tooling beats general tooling |
| Pre-launch feature surface | All three tiers + manual product-fit review | Last gate before customer traffic |

A team pushing 10 PRs/day running ultrareview on every PR is at $150–$250/day or roughly $3,000–$5,000/month for code review alone. That math is justified only if it catches at least one production bug per month that would have cost more to fix post-deployment. Most teams should run ultrareview on the substantial-change subset (typically 10–20% of PRs) and `/review` plus `code-review` on the rest.

What `/ultrareview` is not:
- Not a replacement for CI. Test suites, type checkers, and linters still run where they ran. Ultrareview adds a semantic layer on top; it does not replace the mechanical layer.
- Not a replacement for human review. The fleet catches a lot, but it does not know your product, users, roadmap, or why specific tradeoffs are right. Human reviewers still matter — ultrareview makes their time more valuable by handling what a machine can handle first.
- Not full-codebase audit. Scope is the diff vs. the default branch. A finished, fully committed codebase with no recent changes produces a near-empty result. Use Claude Security (§229) for whole-codebase audit.
- Not invokable from inside an agent or subagent. The command is user-triggered by design — an intentional human types it.

## §233 — The Trainee-Developer Mental Model

The MacCoss Lab framing is the operational mental model that ties §211–§232 together: treat Claude Code as a trainee developer being onboarded onto the codebase, not as a magic productivity multiplier.

What this changes in daily practice:

(1) You would not hand a new hire a 700,000-line codebase and expect day-one results. You would find them a contained project, walk them through it, and expand scope as understanding grew. Apply the same scope-management discipline to Claude — start with bounded tasks; expand as the context layer (§211) accumulates.

(2) You would document the codebase for the new hire. The CLAUDE.md plus skills layer is exactly that documentation, written for an agent. Keep it short, structured, and reference-don't-embed (§212).

(3) You would expect the new hire to ask questions and admit ignorance rather than guess. The debugging skill (§213) and the content-engineering escalation rule (§221, point 3) enforce the same discipline on the agent.

(4) You would track the new hire's performance and adjust. The §84 three-strike termination policy and the §224 ground-truth eval pipelines enforce the same discipline on the agent.

(5) You would expect mistakes early and steady improvement over weeks. The §7C self-annealing protocol and the §7 self-optimization meta-prompts encode the improvement loop.

The mental-model shift to internalize: "Claude can't truly learn about my large project" is the wrong frame. The right frame is "context is just another artifact to maintain and grow." Once enough context exists, an engineer can work across branches and time points — and so can Claude. The work of building and maintaining that context layer is what most developers skip, and it is why most developer success plateaus.

## §234 — Updated Cleanup Cadence (V1.2)

The §210 cleanup cadence still applies. V1.2 adds two recurring tasks tied to the new patterns:

Weekly: review cache hit rate metrics for any production agent built on the API. A multi-percentage-point drop is a cache break and should be triaged within 24 hours per §217. Add the metric to the same dashboard as uptime.

Per release: when any Anthropic model updates, run `/claude-api migrate` (§216) on every project on the API. The skill catches old parameter names, deprecated thinking budgets (§8B), outdated beta headers, and missing effort-level updates. Run before the §74 upgrade-day pass, since the migration informs which prompts need re-tuning.

Per significant PR: the three-tier review framework (§232) with explicit policy on which tier each PR class lands in. The policy belongs in CLAUDE.md or `.claude/rules/code-review.md` so reviewers and contributors share the same expectation.

Per quarter: re-run the §80 distillation prompt on the accumulated active/ folder, this time including any new skills built per §211–§213 and any new agents built per §215. Promote learnings into the global CLAUDE.md and into the canonical skill set.


# SOURCES

**Anthropic platform documentation and engineering blogs (April 2026):**
- "Multi-Agent Coordination Patterns" (Apr 10, 2026)
- "Seeing Like an Agent" (Apr 10, 2026)
- "The Advisor Strategy: Give Agents an Intelligence Boost" (Apr 9, 2026)
- "Building Agents with Skills: Equipping Agents for Specialized Work" (Jan 22, 2026)
- "The Complete Guide to Building Skills for Claude" (Jan 29, 2026)
- "Improving Skill-Creator: Test, Measure, and Refine" (Mar 3, 2026)
- "Code Review" (April 2026)
- "Auto Mode" (April 2026)
- "Product Management on the AI Exponential" (April 2026)
- "Introducing Routines in Claude Code" (Apr 14, 2026)
- "Redesigning Claude Code on Desktop for Parallel Agents" (Apr 14, 2026)
- "Claude Cowork" (October 2025 launch; Enterprise April 2026)
- "Claude Managed Agents" (Apr 8, 2026)
- "Built-in Memory for Claude Managed Agents" (Apr 23, 2026)
- "Building Agents That Reach Production Systems With MCP" (Apr 22, 2026)
- "New Connectors in Claude for Everyday Life" (Apr 23, 2026)

**Anthropic engineering blog posts (April 28–30, 2026):**
- "Onboarding Claude Code like a new developer: Lessons from 17 years of development" (Brendan MacLean / MacCoss Lab, Apr 28, 2026) — pwiz-ai context repository pattern, reference-don't-embed skills, debugging skill design.
- "Product development in the agentic era" (Jess Yan, Managed Agents PM, Apr 29, 2026) — prototype-the-spec workflow, Claude/Cowork-for-discovery plus Claude-Code-for-shipping split, bespoke Managed Agents per job-to-be-done.
- "Claude API skill now in CodeRabbit, JetBrains, Resolve AI, and Warp" (Apr 29, 2026) — `/claude-api migrate`, `/claude-api managed-agents-onboard`, model-migration as a guided IDE workflow.
- "Deploying Claude across the enterprise with Claude Cowork" (Apr 29, 2026) — five-level maturity model, six-month deployment roadmap, Thomson Reuters / Zapier / Jamf customer references.
- "How Kepler built verifiable AI for financial services with Claude" (Apr 30, 2026) — content engineering vs prompt engineering, deterministic-infrastructure-plus-LLM-reasoning split, model-stage matching, ground-truth evaluation, provenance from day one.
- "Lessons from building Claude Code: Prompt caching is everything" (Thariq Shihipar, Claude Code engineering, Apr 30, 2026) — cache-prefix discipline, cache-safe forking, tool search and `defer_loading`, Plan-Mode-as-tools.
- "Claude Security is now in public beta" (Apr 30, 2026) — Opus 4.7 vulnerability scanning, multi-stage validation pipeline, scheduled scans, partner integrations (CrowdStrike, Microsoft Security, Palo Alto, SentinelOne, TrendAI, Wiz).
- "Building AI agents for the enterprise" (Apr 30, 2026) — three pillars of enterprise AI transformation, agentic-thinking divide, L'Oreal / Lyft / Rakuten reference deployments.

**Practitioner sources:**
- Nick Saraf, "4-Hour Beginner Claude Code Course" (2025–2026)
- Nick Saraf, "Advanced Claude Code Course" (2026)
- Nick Saraf, "Agentic Sells Course" (2026) — DOE framework, self-annealing protocol, enterprise sales motion
- Nick Saraf, "Routines walkthrough" (April 2026)
- Stack Podcast (Nick Saraf and Jack Roberts, April 2026) — Managed Agents practitioner deep-dive, token economics, war on context, ecosystem strategy
- Nick Saraf with Amir on HumbleLytics, Paper, design refinement (April 2026)
- Nate Herk, "99% of Claude Code Users Don't Know This About Tokens" (YouTube, April 2026)
- AI Daily Brief — Claude Design hands-on review (April 2026)
- AI Daily Brief Operators Bonus — Agent Madness (April 2026)
- SF49 / Actionable AI Accelerator — Remotion exact prompts (2026)
- Greg Isenberg (Startup Ideas Podcast) — Distribution Strategy framework

**Tooling and frameworks:**
- Andrej Karpathy — auto-research framework (`github.com/karpathy/auto-research`)
- Google Labs / DeepMind — Pomelli (October 2025 launch; March 2026 global expansion)
- Remotion — programmatic video framework
- HumbleLytics — Claude Code-native analytics

**Claude Code documentation:**
- `/ultrareview` research preview (code.claude.com/docs/en/ultrareview) — cloud-hosted multi-agent code review, branch and PR modes, three-free-run allocation expiring May 5, 2026, post-trial pricing of $5–$20 per review.
- Claude Code v2.1.86 (initial `/ultrareview` ship); v2.1.111 on April 16, 2026 (formalized branch and PR modes alongside Opus 4.7 release and the xhigh effort level).
