-- 0003_storage_buckets.sql
--
-- Storage buckets for plan binders, corrections letters, and generated PDFs.
-- Per CLAUDE.md non-negotiable: uploaded plans may contain PII (owner names,
-- addresses, license numbers). Buckets are private; access is via signed URLs.

-- ---------------------------------------------------------------------------
-- Buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('plan-binders', 'plan-binders', false, 52428800,
    array['application/pdf']::text[]),
  ('corrections-letters', 'corrections-letters', false, 10485760,
    array['application/pdf']::text[]),
  ('agent-outputs', 'agent-outputs', false, 20971520,
    array['application/pdf', 'application/json', 'text/markdown']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Object policies: scope reads/writes to {auth.uid()}/{project_id}/* paths.
-- Path convention: <user_id>/<project_id>/<filename>.pdf
-- ---------------------------------------------------------------------------

-- plan-binders
drop policy if exists plan_binders_select_own on storage.objects;
create policy plan_binders_select_own on storage.objects
  for select using (
    bucket_id = 'plan-binders'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists plan_binders_insert_own on storage.objects;
create policy plan_binders_insert_own on storage.objects
  for insert with check (
    bucket_id = 'plan-binders'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists plan_binders_delete_own on storage.objects;
create policy plan_binders_delete_own on storage.objects
  for delete using (
    bucket_id = 'plan-binders'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- corrections-letters
drop policy if exists corrections_letters_select_own on storage.objects;
create policy corrections_letters_select_own on storage.objects
  for select using (
    bucket_id = 'corrections-letters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists corrections_letters_insert_own on storage.objects;
create policy corrections_letters_insert_own on storage.objects
  for insert with check (
    bucket_id = 'corrections-letters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists corrections_letters_delete_own on storage.objects;
create policy corrections_letters_delete_own on storage.objects
  for delete using (
    bucket_id = 'corrections-letters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- agent-outputs (read-only for owner; writes are service-role only)
drop policy if exists agent_outputs_select_own on storage.objects;
create policy agent_outputs_select_own on storage.objects
  for select using (
    bucket_id = 'agent-outputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
