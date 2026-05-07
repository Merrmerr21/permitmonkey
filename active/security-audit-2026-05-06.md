# Pre-deploy security audit — 2026-05-06

Run by Claude per master playbook §12 against `main` at commit `3411b38` (tag `v0.1.0-mvp`) plus the Phase 1A hardening branch additions. Audit performed before any production deploy to Vercel or Cloud Run. Six categories per the master playbook checklist.

## 1. Credentials — PASS

- Repository-wide grep for `sk-`, `sk_live`, `sk_test`, hardcoded API key strings: zero matches.
- `git ls-files` for `.env`, `.env.local`, `.env.production`, `credentials.json`: zero matches. Only `.env.example` files committed (intentional, no secrets inside).
- `.gitignore` correctly covers `.env`, `.env.local`, `.env.*.local`, `.env*.local` patterns.
- No environment variable values logged to stdout or response bodies.

**Status:** PASS. No remediation required.

## 2. Injection risks — PASS

- No raw SQL templating: grep for `.raw(`, `.unsafe(`, `sql${`, `executeRaw`, `queryRaw` returns zero matches. All Supabase queries flow through the typed client.
- No shell command interpolation in production paths.
- No `dangerouslySetInnerHTML`, `eval()`, or `new Function()` calls in frontend code.
- LLM prompt injection: the eligibility flow sanitizes user-supplied address strings via `evaluateEligibility` (deterministic, no LLM); the corrections flow uses zod schemas to validate every input shape before agent SDK invocation. Prompt-injection-hardening doc at [docs/prompt-injection-hardening.md](../docs/prompt-injection-hardening.md) governs the corrections agent.

**Status:** PASS. No remediation required.

## 3. Auth and authorization — PASS with notes

- Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is referenced only in [frontend/lib/api-auth.ts](../frontend/lib/api-auth.ts) (verified server-only — imports `next/server`, no `'use client'` directive). Confirmed via grep: 3 mentions across `CLAUDE.md`, `.env.example`, and `api-auth.ts` only.
- `frontend/CLAUDE.md` documents the rule: "never imported into a `'use client'` file."
- RLS migrations exist at `supabase/migrations/0002_rls_policies.sql` and govern all 5 tables (`projects`, `files`, `messages`, `outputs`, `contractor_answers`, `agent_runs`, `leads`). Verification of cross-user RLS enforcement requires a live Supabase project — **deferred to first staging deploy**, captured as a Phase 1 gate in the master execution plan.
- No JWTs in localStorage: grep returned zero matches.
- API key checks centralized in [frontend/lib/api-auth.ts](../frontend/lib/api-auth.ts) — not duplicated.

**Status:** PASS. **Note:** RLS enforcement test on a real Supabase project is the gate before public traffic. Cannot be performed offline.

## 4. Data exposure — PASS

- Server error handler at [server/src/index.ts:34-46](../server/src/index.ts#L34-L46) logs the stack trace to stdout (Cloud Logging) but returns only `{ error: 'Internal server error' }` to the client. Stack traces never reach the user-facing response body.
- No internal database row IDs exposed: tables use UUID primary keys per the migrations.
- PII handling: per `.claude/CLAUDE.md` non-negotiable, no logs/debug prints with raw plan bytes. The eligibility verifier returns address strings in the verdict but never logs them outside the request-scoped log line.
- CORS: not yet configured at the server. **Note:** when Cloud Run goes live, set `Access-Control-Allow-Origin` to the Vercel deployment URL only — captured in [docs/security-audit-2026-04-22.md](../docs/security-audit-2026-04-22.md). Not a launch blocker for the Next.js API routes (same-origin), but is for the Cloud Run orchestrator path once that endpoint accepts cross-origin traffic.

**Status:** PASS. **Note:** CORS to be configured at Cloud Run deploy time.

## 5. Dependency risks — PASS pending review

- Frontend `package.json`: 13 prod dependencies, all from known publishers (Vercel, Supabase, Radix, lucide-react, etc.). No typosquatted candidates visible.
- Server `package.json`: 5 prod dependencies — `@supabase/supabase-js`, `@vercel/sandbox`, `express@^5.0.1`, `ms`, `zod`. All from official publishers.
- Agents `package.json`: single dep `@anthropic-ai/claude-agent-sdk` (latest).
- **Note:** `npm audit` should be run during the Vercel deploy preview build. Vercel's build pipeline reports vulnerabilities. If a CVE is flagged on a transitive dep, address before promoting to production.

**Status:** PASS. **Note:** Re-run `npm audit` post-`npm install` on staging.

## 6. Infrastructure — PASS

- No service-role key in any frontend file marked `'use client'` (confirmed via grep).
- No production secrets in non-production builds: secrets come from Vercel project env vars and Cloud Run env vars at runtime; never bundled into the frontend build.
- Rate limiting: in-memory per-IP throttle at [frontend/app/api/eligibility/route.ts:9-29](../frontend/app/api/eligibility/route.ts#L9-L29) — 5 requests per IP per hour. **Note:** the in-memory map does not survive process restarts and is per-Vercel-function-instance (not global). For the eligibility free-tool funnel this is acceptable as best-effort; for any future endpoint that must enforce hard caps, move to Redis or Upstash.
- Conversation history in `~/.claude/*.jsonl`: outside the repository scope; operator hygiene (master playbook §70).

**Status:** PASS. **Note:** Document the rate-limit ceiling honestly — best-effort, not strictly enforced across instances.

## Phase 1A additions reviewed

- **Cache-prefix discipline test** ([agents-permitmonkey/src/utils/config.test.ts](../agents-permitmonkey/src/utils/config.test.ts)) — verifies the system prompt is byte-stable, no `Date.now()` or `process.env` interpolation. Adds production cost-discipline assertion at the unit-test level.
- **Verdict token** ([frontend/lib/verdict-token.ts](../frontend/lib/verdict-token.ts)) — base64url(JSON(input)) with SHA-256 prefix. **Tampering analysis:** the hash prefix is *not* a signature; any client can forge a valid token with arbitrary inputs. Acceptable because: (a) the verdict viewer page is read-only, (b) inputs are user-supplied at the API anyway, (c) no Supabase write happens on viewer-page render. The page's `robots: noindex` directive prevents search-index pollution from forged tokens.
- **Per-article OG cards + per-verdict OG cards** — render server-side via `next/og`. No user content reaches the renderer that isn't already passed through the verdict-token decoder or the markdown frontmatter parser. No XSS surface.
- **Provenance lint --strict gate** — runs in CI per [.github/workflows/evals.yml](../.github/workflows/evals.yml). Blocks merge of any skill reference file change that drops a citation.
- **Debugging skill** — markdown-only, no executable surface.

## Items deferred to first staging deploy

These cannot be verified offline. They are gating items for the Phase 1 deploy plan (master execution plan, Phase 1 Gate):

1. RLS enforcement: log in as user A, attempt cross-user query of user B's row. Expected: empty result or 403.
2. CORS configured on Cloud Run to permit only the Vercel production domain.
3. `npm audit` clean on production install.
4. Storage bucket signed URL TTL ≤ 7 days for download links.
5. Sentry / Cloud Logging integration verified by triggering a synthetic 500 and confirming the error reaches the dashboard.

## Items deferred to legal counsel

Per the master execution plan Decision Gate 2 (Phase 1 → 2):

- `PRIVACY.md` and `TERMS.md` must be reviewed by Massachusetts business counsel before any paid traffic. Drafts at repo root flag this gap explicitly.

## Verdict

**Audit result: PASS.** No launch blockers in the six §12 categories. Five items deferred to staging and one to legal counsel; all five staging items are pre-launch gates documented in the master execution plan Phase 1 Gate, not retrofits.

The branch is cleared for Vercel deploy import once the operator completes the Phase 1 user-action items (Vercel project import, env vars, domain DNS, Supabase migrations applied to a real project).
