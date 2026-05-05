# Server rules (Cloud Run orchestrator, Vercel Sandbox, Supabase service-role)

Inherits from root `CLAUDE.md`. These are scope-specific.

## Stack
- **Node 22 + TypeScript 5.7**, ESM (`"type": "module"`). Imports must include the `.ts`/`.js` extension.
- **Express 5** for HTTP. Validate every request body with **zod** schemas; never trust `req.body` shape.
- **`@vercel/sandbox`** to spin up isolated execution environments for Agent SDK runs. Sandbox lifecycle: create → attach files → run agent → collect outputs → destroy. Always destroy on both success and error paths.
- **Supabase service-role** client for server-side writes. Never expose this key beyond the server process.

## Conventions
- Source under `src/`. Skills under `skills/<skill-name>/SKILL.md` + `references/`.
- Long-running orchestration runs through Cloud Run (60-min timeout); short reads through Next.js API routes that proxy here.
- Heavy file work (PDF extraction, image conversion) happens here, not in the Vercel Sandbox (4GB ceiling).
- Build with `npm run build` (tsc) before container build. CI is wired to `npm run build` in [`.github/workflows/deploy-server.yml`](../.github/workflows/deploy-server.yml).

## Agent reliability
- Sub-agent chains: keep ≤ 2 agents on any quality-critical path (Generator-Verifier). 3 agents at 95% each = 85.7% e2e.
- Cite-check every legal/regulatory output: the verifier must re-read the cited statute file and confirm the citation resolves. No hallucinated citations may reach the user.
- Tag every fact with provenance at ingest: `[source: URL | retrieved: YYYY-MM-DD | citation: <statute>§]`. Lint rule will enforce this in `references/` directories starting Week 4.

## Cache discipline
- Stable system prompt → root `CLAUDE.md` → this file → session → messages. Do not change models, tools, or tool order mid-session — it breaks the cache.
- Push time-sensitive context via `<system-reminder>` blocks, not by editing the system prompt.

## Don't
- Don't catch-and-swallow errors from the Agent SDK or Vercel Sandbox — surface them with the run's `job_id` so they show up in Supabase audit logs.
- Don't mock Supabase in integration tests — point at a real test project. Mocks have hidden divergences from prod.
