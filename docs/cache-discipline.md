# Cache discipline (production cost invariant)

Per master playbook §217 — "Prompt caching is everything." The Anthropic API caches the request prefix up to each `cache_control` breakpoint. Any byte-level change in the prefix invalidates everything after. A few percentage points of cache miss can dramatically affect cost and latency, and Anthropic treats cache breaks as production incidents.

PermitMonkey runs Generator-Verifier flows (Sonnet generator → Opus verifier) where each agent run can consume 25–30 turns. Cache breaks compound across that run — one bad turn re-bills the whole prefix on every subsequent turn.

## The four invariants

These are enforced by [config.test.ts](../agents-permitmonkey/src/utils/config.test.ts) and CI:

1. **Static system prompt is byte-stable.** [PERMITMONKEY_PROMPT in config.ts:7-10](../agents-permitmonkey/src/utils/config.ts#L7-L10) is a const string. No `Date.now()`, no `process.env` interpolation, no random seeds. Time-sensitive context flows in via prompt content (next user turn), not the system prompt.

2. **Tool order is deterministic.** [DEFAULT_TOOLS in config.ts:12-15](../agents-permitmonkey/src/utils/config.ts#L12-L15) is a frozen const array. Adding or removing tools mid-session breaks the cache; re-ordering does too.

3. **No mid-session model swap.** Each `runQuery` call in [ma-eligibility.ts](../agents-permitmonkey/src/flows/ma-eligibility.ts) is its own session — generator on `claude-sonnet-4-6`, verifier on `claude-opus-4-7`. Cache is unique per model, so the verifier starts fresh by design (it should not reuse generator's prefix). Within a single agent's session, the model never changes.

4. **No mid-session tool addition or removal.** `allowedTools` is set once in `createQueryOptions` and never mutated. Plan-mode-style state transitions, when added to corrections-flow, must use *tools* to gate behavior (per master playbook §220), never tool-set swaps.

## Anti-patterns to reject in PR review

- `systemPromptAppend` containing `${Date.now()}` or `${new Date().toISOString()}`.
- A flow that constructs `allowedTools` by spreading from a runtime-mutable source (e.g., a `Set` or a sorted-by-mtime list).
- A subagent flow that adds tools dynamically based on prior turn output. State transitions must go through new tool *invocations*, not tool *registration* changes.
- Pulling the current date into the system prompt to anchor "today's research." Use `<system-reminder>` blocks in the next user message instead.

## When time-sensitive context is required

Push it via the user message, not the system prompt:

```
const userMessage = `Today is ${todayISO}. ${rest}`;
```

The system prompt prefix stays cached; only the user-message tokens are billed at full rate.

## Operator monitoring

Per master playbook §234 (V1.2 cleanup cadence): review cache hit rate weekly for any production agent built on the API. A multi-percentage-point drop is a cache break and must be triaged within 24 hours.

The Anthropic SDK exposes `cache_creation_input_tokens` and `cache_read_input_tokens` per turn. Once production traffic is live, surface the ratio in the `/metrics` endpoint at [server/src/routes/metrics.ts](../server/src/routes/metrics.ts) and add a Cloud Monitoring alert at <95% read ratio over a rolling 1-hour window.

## Compaction (§218)

Cache-safe forking applies whenever an agent run hits the context budget. The naive `summarize-this` call with a different system prompt invalidates the entire prefix. The fix is to reuse the parent's system prompt, tools, and any prior context, then append the compaction prompt as the next user message — the cached prefix is reused; only the new instructions are billed.

This pattern is built into the Anthropic API as native compaction (`platform.claude.com/docs/en/build-with-claude/compaction`). When the corrections flow lands its long-running variants, port to the native primitive directly.
