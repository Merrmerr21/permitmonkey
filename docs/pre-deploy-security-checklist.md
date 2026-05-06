# Pre-Deploy Security Checklist

_Required before any production deployment that allows public traffic. The
operator runs this checklist on the merge commit before pushing the deploy
button. Per `PLAYBOOK.md` reliability track and `.claude/CLAUDE.md`
non-negotiables._

## Why this exists

PermitMonkey handles three kinds of sensitive data:

1. **Account credentials** — Supabase auth tokens, session cookies.
2. **PII in plan uploads** — owner names, addresses, contractor license
   numbers, engineer stamps.
3. **API secrets** — Anthropic API key, Vercel Sandbox token, Supabase
   service-role key, GCP service account.

A single mistake in any of these (service-role key in a `'use client'` file,
RLS policy gap, signed URL with a 100-year expiry) can leak data across
users or expose admin-level access. This checklist is the single gate
between "we think it's safe" and "we ship to public traffic."

## Operator pre-flight (15 minutes)

### Secrets hygiene

- [ ] `git grep -i "ANTHROPIC_API_KEY\|SUPABASE_SERVICE_ROLE_KEY\|VERCEL_TOKEN" -- ':!*.example' ':!docs/' ':!.github/workflows/'` returns zero matches in source code (workflows reference secrets via `${{ secrets.X }}` syntax which is fine).
- [ ] `git grep "sk-ant-\|pk_live_\|service_role"` returns zero matches.
- [ ] No `.env`, `.env.local`, or `.env.production` files are tracked. Verify with `git ls-files | grep -E '\.env(\.|$)'` returning zero.
- [ ] All deployed environments load secrets from GCP Secret Manager (Cloud Run) and Vercel project settings (frontend) — never from a file in the deploy package.

### Frontend isolation

- [ ] No `'use client'` file imports `process.env.SUPABASE_SERVICE_ROLE_KEY`. Verify: `grep -r "SUPABASE_SERVICE_ROLE_KEY" frontend/components/ frontend/app/**/page.tsx` returns matches only in `.test.ts` or in server components / route handlers, not client components.
- [ ] `lib/api-auth.ts` is the single source of API-key comparison logic. No other file performs `apiKey === process.env.X`.
- [ ] Source maps are enabled in development, disabled or stripped of secrets in production.

### RLS verification

- [ ] All five (or six, including `agent_runs`) tables in schema `permitmonkey` have `enable row level security`. Verify with: `select tablename from pg_tables where schemaname='permitmonkey'` and `select tablename, rowsecurity from pg_tables where schemaname='permitmonkey'` showing `rowsecurity = true` for every row.
- [ ] Cross-user smoke test (see `supabase/README.md`): log in as user A, attempt to query user B's project rows — receive 0 rows. If any row leaks, **STOP THE DEPLOY**.
- [ ] Storage bucket policies require `(storage.foldername(name))[1] = auth.uid()::text`. Anonymous access blocked.

### Anthropic API safety

- [ ] Anthropic key is on a usage tier with zero data retention enabled.
- [ ] No prompt logging with raw plan or corrections-letter content reaches third-party log aggregators (Sentry, Datadog, etc.). Only metadata.
- [ ] Per CLAUDE.md non-negotiable: `git grep "console.log.*plan\|console.log.*corrections"` returns zero matches in `agents-permitmonkey/src/` and `server/src/routes/`.

### HTTPS and headers

- [ ] All Vercel deploys serve HTTPS with valid certs.
- [ ] `frontend/next.config.ts` `headers()` function present with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` denying camera / microphone / geolocation / FLoC.
- [ ] Cloud Run service is invocable via HTTPS only; insecure HTTP endpoints disabled.

### Rate limiting

- [ ] `/api/leads`, `/api/eligibility`, `/api/extract`, `/api/generate` are behind a rate limit. (Phase 1 ships without this; **add before Phase 4 traffic.** Cloudflare or Vercel Edge Middleware are the cheap options.)
- [ ] Anonymous IP-based rate limit on the eligibility free tool to prevent abuse.

### Signed URL hygiene

- [ ] All Supabase Storage downloads use signed URLs with TTL ≤ 7 days (CLAUDE.md ops).
- [ ] No bucket is set to `public = true`. Verify: `select id, public from storage.buckets where public = true` returns zero.

### Dependency vulnerabilities

- [ ] `cd frontend && npm audit` and `cd server && npm audit` — no CRITICAL findings. HIGH findings reviewed; if accepted, document in `docs/security-exceptions.md` with rationale.
- [ ] No suspicious lockfile churn since the last release (verify `git log --oneline -- frontend/package-lock.json server/package-lock.json` is sane).

### CSP and content boundaries

- [ ] `react-markdown` with no `dangerouslySetInnerHTML` and no untrusted HTML allowed in renderer config. (The current `MarkdownWithCitations` component does not pass `rehype-raw`; verify nothing has changed.)
- [ ] User-supplied filenames in upload paths are sanitized (no path traversal `..`, no leading `/`).

### Logging discipline

- [ ] Server logs to stdout JSON (Cloud Logging picks up natively). Logs include `requestId`, `path`, `status`, `latencyMs`, `userId` when authenticated, but **never** raw request bodies for routes that accept plan content.
- [ ] Sentry (or alternative) is configured to scrub PII fields before transport. Verify the integration's `beforeSend` hook.

### Test coverage of security paths

- [ ] At least one test asserts that a misconfigured Supabase client (missing env vars) does NOT crash the entire app at module-load time. (Existing `frontend/lib/supabase/client.ts` uses a Proxy stub; verify the test still passes.)
- [ ] At least one test asserts that the API-key check rejects empty / wrong keys.
- [ ] Eval harness `--strict` gate is green on the merge commit.

## Incident response

If any item above fails after deploy:

1. **Revert** by deploying the previous green tag (`gcloud run deploy ... --image gcr.io/$PROJECT/permitmonkey-server:<previous-sha>`). Don't `git revert` and redeploy from scratch — the rollback path should be image-based for speed.
2. **Communicate** via the in-app banner if any user-visible data may have been exposed.
3. **Lab Note** added to `.claude/CLAUDE.md` and mirrored to `AGENTS.md` documenting the failure and the new check that should have caught it.
4. **Add the missing check** to this file before re-deploying.

## When this becomes obsolete

Phase 1 of the master plan ships before Anthropic Claude Security
(master §229) is available on our tier. When Team-tier access opens, wire
the formal Claude Security pre-deploy gate as a CI step and let it own
items in the **Frontend isolation**, **RLS verification**, **Logging
discipline**, and **CSP and content boundaries** sections. This document
remains as the operator-readable explanation of *why* each check exists.
