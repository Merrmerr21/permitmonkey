-- ============================================================================
-- PermitMonkey — Supabase Row-Level Security (RLS) Policies
-- ============================================================================
-- Authoritative policy file. Apply before MA production launch.
-- See docs/security-audit-2026-04-22.md §3 (Auth & Authorization) for context.
--
-- Principles:
--   1. Every user-data table has RLS enabled.
--   2. Users can only read/write their own rows (auth.uid() = user_id).
--   3. Service-role client (used by admin API routes) bypasses RLS.
--      Therefore, minimize use of service-role; prefer cookie-auth per-user
--      operations where possible.
--   4. Contractor A never sees contractor B's data.
--   5. Stored data associated with a job is scoped to the job's owner.
--
-- Generated: 2026-04-22
-- Apply via: Supabase SQL Editor or `supabase db push` after saving as migration
-- ============================================================================

-- ---------------------------------------------------------------------------
-- TABLE: projects
-- A "project" is one property under permit management.
-- ---------------------------------------------------------------------------

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_own"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- TABLE: jobs
-- A "job" is one invocation of a flow (corrections, checklist, eligibility, pre-screening).
-- Jobs inherit ownership from their parent project.
-- ---------------------------------------------------------------------------

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_own"
  ON public.jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = jobs.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "jobs_insert_own"
  ON public.jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = jobs.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "jobs_update_own"
  ON public.jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = jobs.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- No DELETE policy; jobs are immutable once created. Use a "deleted_at" soft-delete column if needed.

-- ---------------------------------------------------------------------------
-- TABLE: runs
-- A "run" is a single agent execution on a job (PlanReader, CorrectionsParser, etc).
-- Runs inherit ownership from their parent job → project.
-- ---------------------------------------------------------------------------

ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "runs_select_own"
  ON public.runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE jobs.id = runs.job_id
        AND projects.user_id = auth.uid()
    )
  );

-- INSERT/UPDATE/DELETE on runs: service role only (the orchestrator writes these).
-- No user-facing INSERT/UPDATE/DELETE policy. RLS denies by default when no policy matches.

-- ---------------------------------------------------------------------------
-- TABLE: artifacts
-- Files produced by runs (plans extractions, response packages, etc).
-- Scoped to job → project ownership.
-- ---------------------------------------------------------------------------

ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "artifacts_select_own"
  ON public.artifacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE jobs.id = artifacts.job_id
        AND projects.user_id = auth.uid()
    )
  );

-- INSERT/UPDATE/DELETE: service role only (orchestrator writes, user downloads only).

-- ---------------------------------------------------------------------------
-- TABLE: citations
-- Structured record of every statute/regulation/bylaw citation emitted by agents.
-- Indexed for retroactive verification (see docs/citation-verification-spec.md).
-- ---------------------------------------------------------------------------

ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "citations_select_own"
  ON public.citations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.runs
      JOIN public.jobs ON jobs.id = runs.job_id
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE runs.id = citations.run_id
        AND projects.user_id = auth.uid()
    )
  );

-- No INSERT/UPDATE/DELETE for users. Service role writes citations as agents emit them.

-- ---------------------------------------------------------------------------
-- TABLE: eligibility_checks (free-tool funnel)
-- Anonymous or email-only entries from the /eligibility landing page.
-- NOT scoped to auth.uid() because these may be anonymous.
-- ---------------------------------------------------------------------------

ALTER TABLE public.eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT their own eligibility check (the public endpoint).
-- Captures: anonymized inputs + email (if provided).
CREATE POLICY "eligibility_checks_public_insert"
  ON public.eligibility_checks FOR INSERT
  WITH CHECK (true);

-- Only the authenticated user matching the email can read their own check.
CREATE POLICY "eligibility_checks_select_own_email"
  ON public.eligibility_checks FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Admin access: service role only.

-- ---------------------------------------------------------------------------
-- TABLE: contractor_questions
-- Questions the agent generates for the contractor mid-pipeline (Step 5 of ma-corrections-interpreter).
-- ---------------------------------------------------------------------------

ALTER TABLE public.contractor_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contractor_questions_select_own"
  ON public.contractor_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE jobs.id = contractor_questions.job_id
        AND projects.user_id = auth.uid()
    )
  );

-- Contractor can update answers (set answer field), not the question field.
CREATE POLICY "contractor_questions_answer_own"
  ON public.contractor_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE jobs.id = contractor_questions.job_id
        AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE jobs.id = contractor_questions.job_id
        AND projects.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- TABLE: job_metrics
-- Metrics emitted at end of each job (duration, tokens, cost, citation count, etc.)
-- User can view their own job's metrics for transparency.
-- ---------------------------------------------------------------------------

ALTER TABLE public.job_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_metrics_select_own"
  ON public.job_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      JOIN public.projects ON projects.id = jobs.project_id
      WHERE jobs.id = job_metrics.job_id
        AND projects.user_id = auth.uid()
    )
  );

-- INSERT: service role only.

-- ---------------------------------------------------------------------------
-- TABLE: agent_strikes
-- Three-strike tracking per .claude/agent-performance.md (PLAYBOOK §17).
-- Admin-only visibility. NOT exposed to contractors.
-- ---------------------------------------------------------------------------

ALTER TABLE public.agent_strikes ENABLE ROW LEVEL SECURITY;

-- No user-facing policies. Only service role reads/writes.
-- The table is not exposed via the user-facing Supabase client.

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Apply via Supabase Storage dashboard or storage.policies SQL.
-- ============================================================================

-- BUCKET: plans
-- Private bucket. Signed URLs only.
-- Expected path structure: plans/{user_id}/{project_id}/{job_id}/plans.pdf
-- Retention: indefinite (part of job record).

-- POLICY: Users can upload plans to their own project path.
CREATE POLICY "plans_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'plans'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- POLICY: Users can read plans from their own project path.
CREATE POLICY "plans_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'plans'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- POLICY: Users can delete their own plans (with caution).
CREATE POLICY "plans_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'plans'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- BUCKET: corrections
-- Same pattern as plans. Private, signed URLs, user-scoped path.
CREATE POLICY "corrections_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'corrections'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "corrections_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'corrections'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- BUCKET: response-packages
-- Final deliverables. Read-only for users (orchestrator writes, user downloads).
-- Signed URLs expire at 15 min max.
CREATE POLICY "response_packages_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'response-packages'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- SERVICE ROLE NOTES
-- ============================================================================
-- The SUPABASE_SERVICE_ROLE_KEY bypasses RLS.
-- Usage patterns (frontend/lib/api-auth.ts):
--   - Bearer API key auth → service-role client (admin ops only)
--   - Cookie auth → per-user client (standard flows)
--
-- Minimize service-role usage. The orchestrator runs under service role (required
-- for cross-user operations), but every frontend API route should default to
-- cookie auth.
--
-- Scope the PERMITMONKEY_API_KEY carefully — it grants full admin access.
-- Rotate annually. See docs/security-audit-2026-04-22.md §1.
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- After applying, run these to verify RLS is enforced.
-- Expected: 0 rows returned for a user querying another user's data.
-- ============================================================================

-- Test 1: As user A, try to read user B's projects.
-- SET request.jwt.claim.sub = 'USER_A_UUID';
-- SELECT * FROM projects WHERE user_id = 'USER_B_UUID';
-- Expected: 0 rows.

-- Test 2: As anonymous, try to read any authenticated table.
-- SET request.jwt.claim.sub = NULL;
-- SELECT * FROM jobs;
-- Expected: 0 rows.

-- Test 3: Service role should bypass (for orchestrator sanity check).
-- Use the service-role connection and verify all rows are readable.

-- ============================================================================
-- REVIEW CADENCE
-- ============================================================================
-- Quarterly: re-verify policies against latest threat model.
-- Every new table: add explicit RLS policies before exposing.
-- Every new role: document scope in docs/security-audit-<date>.md.
