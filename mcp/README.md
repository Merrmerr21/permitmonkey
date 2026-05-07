# PermitMonkey MCP server

Remote MCP server exposing PermitMonkey's MA ADU eligibility checker. Designed for the [Anthropic connector directory](https://claude.ai/directory) per master playbook §65, §103, §104.

## What this server does

One tool: `check_ma_adu_eligibility(address, lot_size_sqft, primary_dwelling_sqft, ...)`. Returns a verdict (`likely_eligible` / `needs_review` / `not_eligible`) plus the maximum permitted ADU size, parking requirement, city-specific gotchas, next steps, and verifiable citations to MGL Ch 40A § 3 (as amended by St. 2024 c. 150 § 8) and 760 CMR 71.00.

Covered cities with full local-rule research: **Boston, Cambridge, Somerville, Newton, Brookline.** Other MA municipalities receive state-law-only analysis with a `needs_review` flag.

Deterministic — no LLM call inside. Runs under 100ms. Suitable for real-time conversational use.

## Design principles applied

| Principle | Source | Implementation |
|-----------|--------|----------------|
| Remote, not stdio | Master playbook §104 Pattern 1 | `StreamableHTTPServerTransport` over Express on `POST /mcp` |
| Intent-grouped tools | Master playbook §104 Pattern 2 | One tool, not an endpoint mirror |
| Companion skill | Master playbook §107 | `server/skills/permitmonkey-ma-eligibility/SKILL.md` ships alongside |
| Logic parity with website | This package's parity test | `eligibility-parity.test.ts` asserts byte-equivalent output to `frontend/lib/eligibility.ts` |

Deferred to v0.2:
- **Pattern 4 (MCP App)** — interactive verdict card. v0.1 ships a structured JSON payload that any MCP client renders natively.
- **Pattern 5 (CIMD auth)** — added when the corrections-flow paid tier lands. Eligibility is read-only and public.

## Local development

```bash
cd mcp
npm install
npm run dev          # Hot-reload server on PORT=8787
npm test             # Parity test against frontend/lib/eligibility.ts
npm run inspector    # Open the MCP inspector against the local server
```

Health check:
```bash
curl http://localhost:8787/health
# {"status":"ok","server":"permitmonkey-ma-eligibility","version":"0.1.0"}
```

Test the tool from a remote MCP client (or the MCP inspector). With the inspector pointed at `http://localhost:8787/mcp`:

```json
{
  "name": "check_ma_adu_eligibility",
  "arguments": {
    "address": "123 Main St, Boston, MA",
    "lot_size_sqft": 5000,
    "primary_dwelling_sqft": 1800,
    "within_half_mile_transit": true
  }
}
```

Returns a `likely_eligible` verdict capped at 900 sqft (state floor: lesser of 900 or 50% of primary).

## Deployment

```bash
docker build -t permitmonkey-mcp .
docker run -p 8787:8787 permitmonkey-mcp
```

Recommended host: Cloud Run alongside the existing PermitMonkey orchestrator. Add the Cloud Run URL to the directory submission at [claude.com/docs/connectors/overview](https://claude.com/docs/connectors/overview).

## Cache discipline

The MCP server is stateless — each tool call is a deterministic function with no side effects. Master playbook §217 cache-prefix invariants apply to LLM calls, not to this surface. They will apply if v0.2 introduces an LLM-backed tool (e.g., a free-form "explain my Boston ADU corrections letter" tool). Until then, cache discipline is documented at `docs/cache-discipline.md` for the agent SDK paths.

## Parity with the website

The eligibility logic in `src/eligibility.ts` is a self-contained copy of `frontend/lib/eligibility.ts`. The duplication is deliberate: the MCP server runs in its own deployment surface and cannot import from the frontend package without forcing a monorepo build.

`eligibility-parity.test.ts` asserts byte-equivalent output across 6 fixtures spanning all 5 covered cities plus an uncovered city. Any divergence fails CI. The parity rule: **a contractor running the check via claude.ai/directory must see the same verdict as one who hits the website.**

When changing eligibility logic, update both copies in the same commit and re-run `npm test` here.

## Companion skill

[`server/skills/permitmonkey-ma-eligibility/SKILL.md`](../server/skills/permitmonkey-ma-eligibility/SKILL.md) is the methodology layer — when an agent uses the MCP tool, the skill teaches it how to phrase results, when to escalate to human review, and how to map verdicts to next steps. Per master playbook §107, future versions migrate to server-delivered skills via the [experimental MCP skill extension](https://github.com/modelcontextprotocol/experimental-ext-skills) once it stabilizes.

## Submission to the directory

1. Build and deploy the container to Cloud Run (or another remote host).
2. Confirm `/health` responds and the MCP inspector can list and call the tool.
3. Submit at [claude.com/docs/connectors/overview](https://claude.com/docs/connectors/overview) with:
   - Server URL: `https://<host>/mcp`
   - Display name: PermitMonkey — MA ADU Eligibility
   - Description: from `TOOL_DESCRIPTION` in `src/index.ts`
   - Companion skill: link to `server/skills/permitmonkey-ma-eligibility/`
4. Track listing impressions weekly via the publisher dashboard.

## Roadmap

- **v0.1** (this release): one read-only public tool, Streamable HTTP transport, parity test, Dockerfile.
- **v0.2**: MCP App for the verdict card (interactive citation-pill rendering inline in the chat surface).
- **v0.3**: corrections-flow tool gated by CIMD auth — paid tier integration.
