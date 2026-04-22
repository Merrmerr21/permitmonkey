# Agent Performance Tracker

Three-strike policy (see PLAYBOOK.md §17). Each row captures: agent name, run ID, date, strike type (hallucination / directive violation / failed handoff), description, resolution.

**Strike totals disable an agent until JD + skill are rebuilt.**

- **Strike 1**: warning, logged
- **Strike 2**: next run in sandbox — output compared against ground truth before acceptance
- **Strike 3**: agent disabled for the project

**Zero-tolerance agents** (one strike = immediate disable):
- `MALawLookup` — hallucinated statute/regulation citations are E&O liability

## Active Agents

| Agent | Model | Strikes | Last Incident | Status |
|-------|-------|---------|---------------|--------|
| Planner | Opus 4.7 xhigh | 0 | — | active |
| PlanReader | Opus 4.6 (vision) | 0 | — | active |
| CorrectionsParser | Sonnet 4.6 | 0 | — | active |
| MALawLookup | Sonnet 4.6 | 0 | — | active (ZERO-TOLERANCE) |
| CityCodeLookup | Sonnet 4.6 | 0 | — | active |
| ResponseWriter | Opus 4.7 xhigh | 0 | — | active |
| QAReviewer | Opus 4.7 xhigh | 0 | — | active |

## Strike Log

*No strikes logged yet. Template for entries:*

```
### [YYYY-MM-DD] — AgentName — Run ID: xxx
- **Type**: hallucination | directive violation | failed handoff
- **Description**: [what happened]
- **Ground truth**: [what should have happened]
- **Root cause**: [why it happened]
- **Fix**: [what we changed — link to commit]
- **Strike count after**: N/3
```

## Review Cadence

- Weekly (Monday 7am via Routine): pull last 7 days of runs, compute per-agent success rate, flag any agent trending toward a strike
- Monthly: zero-out strike counters for any agent with 30 days clean
- After any strike: review the agent's JD in `.claude/agents/<name>.md` and decide if the directive needs revision
