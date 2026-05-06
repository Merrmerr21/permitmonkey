# Outage Runbook

_Last updated: 2026-05-05. SLA: 30 minutes from detection to user-visible
recovery, per `PLAYBOOK.md` Diversification track._

PermitMonkey depends on four external services that can each take the product
down without warning. This runbook lists the swap path for each.

## Detection

Symptoms that should page the operator:

| Symptom | Likely cause |
|---|---|
| `/eligibility` returns 5xx | Vercel function failure or Anthropic API outage |
| Cloud Run `/health` not 200 | GCR deploy issue or Cloud Run quota |
| Realtime status badge stuck "processing" >10 min | Vercel Sandbox timeout or Anthropic rate limit |
| `npm run evals --strict` fails on a previously-green fixture | Anthropic model regression or API outage |
| Cross-user RLS test passes data for another user | Supabase config drift — STOP traffic |

Check these first:

1. [`status.anthropic.com`](https://status.anthropic.com)
2. [`vercel-status.com`](https://www.vercel-status.com)
3. [`status.cloud.google.com`](https://status.cloud.google.com)
4. [`status.supabase.com`](https://status.supabase.com)

## Anthropic outage — 30-min SLA

**Symptom**: every agent run fails with 5xx from `api.anthropic.com`.

**Mitigation path** (in order):

1. **Wait 5 min.** Most Anthropic incidents resolve in <15 min; reflexively
   switching providers wastes more time than it saves.
2. **Retry with backoff.** The Agent SDK does this automatically; verify in
   `/metrics` that retry counts are climbing rather than failing instantly.
3. **Switch to alternative agent platform** — fall back to Cursor or Aider
   running locally against a different LLM provider. This is documented in
   the Diversification track of `PLAYBOOK.md`. Practical steps:
   - Open `AGENTS.md` (mirrors `.claude/CLAUDE.md` rules in non-Claude
     format) so the alternative agent has matching guardrails.
   - Configure the alternative with the same MGL/CMR/Bylaw skill content
     by pointing it at `server/skills/`.
   - Re-run the failing fixture against the alternative; if it passes
     manually, drop a banner on `/` indicating "AI assist temporarily
     downgraded — manual review may be slower."
4. **Communicate.** Post a banner on the landing page and email any
   in-flight users that their job is paused, ETA when recovered.
5. **Document** in CHANGELOG `Fixed` once recovered, plus a Lab Note in
   `.claude/CLAUDE.md` if any structural change came out of the incident.

## Vercel outage

**Symptom**: frontend returns 502/504 from Vercel edge or Sandbox creation
fails with auth errors.

1. **Check Vercel status.** Most Vercel incidents are partial (e.g., one
   region); rerouting via DNS is usually unnecessary.
2. **If it's the Sandbox specifically that's down** but the frontend itself
   is up, the orchestrator can still serve cached `/eligibility` results.
   Disable new corrections jobs via a feature flag (Phase 2 Step 49) until
   Sandbox recovers.
3. **Hard fallback**: deploy a static read-only mirror of the landing page
   to GitHub Pages or Netlify. The repo is small enough to clone and
   `next export` in <10 min.

## Cloud Run / GCP outage

**Symptom**: orchestrator unreachable; frontend's `/api/generate` returns 502.

1. **Check GCP status.**
2. **If region-scoped**: redeploy `permitmonkey-server` to a different region
   via `gcloud run deploy ... --region us-east1` (the `deploy-server.yml`
   workflow is region-parameterizable).
3. **If platform-scoped**: temporarily disable Flow 1 (corrections) in the
   frontend; the eligibility free tool still works because it runs in the
   Vercel function, not Cloud Run.

## Supabase outage

**Symptom**: every API route 500s with "fetch failed" or "JWT verification
failed".

1. **Check Supabase status.** Most outages are project-scoped; if your
   project is healthy and others aren't, you may be unaffected.
2. **Auth-only outage**: serve eligibility as a fully anonymous tool via
   the Edge function (no auth checks). Most of the user-visible product
   keeps working.
3. **DB-only outage**: cache the last-known-good eligibility skill content
   into Vercel KV or in-memory; degrade gracefully to "we can't save your
   project right now, but here's your verdict."
4. **Total outage**: the only durable mitigation is having the schema
   versioned (which we do, in `supabase/migrations/`). Stand up a fresh
   project, apply migrations, restore from latest backup, swap env vars.

## Roll-forward, not roll-back

**Do not** revert commits as an outage response unless you have evidence
that a specific commit caused the outage. Most outages are upstream
provider issues; reverting only adds release-management noise.

If a code change is genuinely the cause: revert via a fresh commit
(`git revert <sha>`), don't force-push history.

## Post-incident

1. Add a Lab Note to `.claude/CLAUDE.md` and mirror to `AGENTS.md`.
2. Add a CHANGELOG `Fixed` entry referencing the incident and the fix.
3. If structural: update `PLAYBOOK.md` or this runbook with the new path.
4. If the incident exposed a missing test: write the regression test before
   closing the loop.
