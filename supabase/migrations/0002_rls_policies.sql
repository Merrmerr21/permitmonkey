-- 0002_rls_policies.sql
--
-- Row-Level Security policies for the `permitmonkey` schema.
--
-- Threat model: anon-key clients can hit any row they're not explicitly
-- denied. Without RLS, contractor A could read contractor B's plans by
-- iterating UUIDs. Service-role bypasses RLS by design — the Cloud Run
-- orchestrator uses service-role to write agent outputs on behalf of users.

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
alter table permitmonkey.projects enable row level security;

drop policy if exists projects_select_own on permitmonkey.projects;
create policy projects_select_own on permitmonkey.projects
  for select using (auth.uid() = user_id or is_demo = true);

drop policy if exists projects_insert_own on permitmonkey.projects;
create policy projects_insert_own on permitmonkey.projects
  for insert with check (auth.uid() = user_id);

drop policy if exists projects_update_own on permitmonkey.projects;
create policy projects_update_own on permitmonkey.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists projects_delete_own on permitmonkey.projects;
create policy projects_delete_own on permitmonkey.projects
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- files: visibility derives from parent project
-- ---------------------------------------------------------------------------
alter table permitmonkey.files enable row level security;

drop policy if exists files_select_via_project on permitmonkey.files;
create policy files_select_via_project on permitmonkey.files
  for select using (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = files.project_id
        and (p.user_id = auth.uid() or p.is_demo = true)
    )
  );

drop policy if exists files_insert_via_project on permitmonkey.files;
create policy files_insert_via_project on permitmonkey.files
  for insert with check (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = files.project_id
        and p.user_id = auth.uid()
    )
  );

drop policy if exists files_delete_via_project on permitmonkey.files;
create policy files_delete_via_project on permitmonkey.files
  for delete using (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = files.project_id
        and p.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- messages: read-only for the owner; writes are service-role only (agent stream)
-- ---------------------------------------------------------------------------
alter table permitmonkey.messages enable row level security;

drop policy if exists messages_select_via_project on permitmonkey.messages;
create policy messages_select_via_project on permitmonkey.messages
  for select using (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = messages.project_id
        and (p.user_id = auth.uid() or p.is_demo = true)
    )
  );

-- ---------------------------------------------------------------------------
-- outputs: read-only for the owner; writes are service-role only (agent results)
-- ---------------------------------------------------------------------------
alter table permitmonkey.outputs enable row level security;

drop policy if exists outputs_select_via_project on permitmonkey.outputs;
create policy outputs_select_via_project on permitmonkey.outputs
  for select using (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = outputs.project_id
        and (p.user_id = auth.uid() or p.is_demo = true)
    )
  );

-- ---------------------------------------------------------------------------
-- contractor_answers: owner reads all, updates own answers
-- ---------------------------------------------------------------------------
alter table permitmonkey.contractor_answers enable row level security;

drop policy if exists contractor_answers_select_via_project on permitmonkey.contractor_answers;
create policy contractor_answers_select_via_project on permitmonkey.contractor_answers
  for select using (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = contractor_answers.project_id
        and (p.user_id = auth.uid() or p.is_demo = true)
    )
  );

drop policy if exists contractor_answers_update_via_project on permitmonkey.contractor_answers;
create policy contractor_answers_update_via_project on permitmonkey.contractor_answers
  for update using (
    exists (
      select 1 from permitmonkey.projects p
      where p.id = contractor_answers.project_id
        and p.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Grant schema usage to anon and authenticated (RLS still enforces row access)
-- ---------------------------------------------------------------------------
grant usage on schema permitmonkey to anon, authenticated;
grant select, insert, update, delete on all tables in schema permitmonkey to authenticated;
grant select on all tables in schema permitmonkey to anon;
grant usage, select on all sequences in schema permitmonkey to authenticated;

alter default privileges in schema permitmonkey
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema permitmonkey
  grant select on tables to anon;
alter default privileges in schema permitmonkey
  grant usage, select on sequences to authenticated;
