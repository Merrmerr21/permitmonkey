-- 0001_initial_schema.sql
--
-- Captures the production `permitmonkey` schema as of v0.1.0-mvp.
-- Mirrors the TypeScript types in frontend/types/database.ts; if those drift,
-- this file is wrong and must be updated.
--
-- Apply with: supabase db push (or psql against the project's connection string).

create schema if not exists permitmonkey;

-- ---------------------------------------------------------------------------
-- projects: one row per contractor permit job
-- ---------------------------------------------------------------------------
create table if not exists permitmonkey.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  flow_type       text not null
                  check (flow_type in ('city-review', 'corrections-analysis')),
  project_name    text not null,
  project_address text,
  city            text,
  status          text not null default 'ready'
                  check (status in (
                    'ready', 'uploading', 'processing',
                    'processing-phase1', 'awaiting-answers', 'processing-phase2',
                    'completed', 'failed'
                  )),
  error_message   text,
  applicant_name  text,
  is_demo         boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_user_id_idx on permitmonkey.projects (user_id);
create index if not exists projects_status_idx on permitmonkey.projects (status);

-- ---------------------------------------------------------------------------
-- files: uploaded plan binders, corrections letters, and intermediate artifacts
-- ---------------------------------------------------------------------------
create table if not exists permitmonkey.files (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references permitmonkey.projects(id) on delete cascade,
  file_type     text not null
                check (file_type in ('plan-binder', 'corrections-letter', 'other')),
  filename      text not null,
  storage_path  text not null,
  mime_type     text,
  size_bytes    bigint,
  created_at    timestamptz not null default now()
);

create index if not exists files_project_id_idx on permitmonkey.files (project_id);

-- ---------------------------------------------------------------------------
-- messages: per-project agent stream log
-- (id is bigserial — agent runs can append thousands of rows; uuid is overkill)
-- ---------------------------------------------------------------------------
create table if not exists permitmonkey.messages (
  id          bigserial primary key,
  project_id  uuid not null references permitmonkey.projects(id) on delete cascade,
  role        text not null check (role in ('system', 'assistant', 'tool')),
  content     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists messages_project_id_created_at_idx
  on permitmonkey.messages (project_id, created_at);

-- ---------------------------------------------------------------------------
-- outputs: agent run results, one row per phase
-- ---------------------------------------------------------------------------
create table if not exists permitmonkey.outputs (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references permitmonkey.projects(id) on delete cascade,
  flow_phase  text not null check (flow_phase in ('analysis', 'response', 'review')),
  version     integer not null default 1,

  -- City Review outputs
  corrections_letter_md       text,
  corrections_letter_pdf_path text,
  review_checklist_json       jsonb,

  -- Contractor Phase 1 outputs
  corrections_analysis_json   jsonb,
  contractor_questions_json   jsonb,

  -- Contractor Phase 2 outputs
  response_letter_md          text,
  response_letter_pdf_path    text,
  professional_scope_md       text,
  corrections_report_md       text,

  -- Catch-all for anything not yet promoted to a typed column
  raw_artifacts               jsonb,

  -- Agent run metadata
  agent_cost_usd      numeric(10, 4),
  agent_turns         integer,
  agent_duration_ms   bigint,

  created_at  timestamptz not null default now()
);

create index if not exists outputs_project_id_phase_idx
  on permitmonkey.outputs (project_id, flow_phase, created_at desc);

-- ---------------------------------------------------------------------------
-- contractor_answers: clarifying questions the agent surfaces between Phase 1
-- and Phase 2 of the corrections flow
-- ---------------------------------------------------------------------------
create table if not exists permitmonkey.contractor_answers (
  id                  uuid primary key default gen_random_uuid(),
  project_id          uuid not null references permitmonkey.projects(id) on delete cascade,
  question_key        text not null,
  question_text       text not null,
  question_type       text not null
                      check (question_type in ('text', 'number', 'choice', 'measurement')),
  options             jsonb,
  context             text,
  correction_item_id  text,
  answer_text         text,
  is_answered         boolean not null default false,
  output_id           uuid references permitmonkey.outputs(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists contractor_answers_project_id_idx
  on permitmonkey.contractor_answers (project_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function permitmonkey.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on permitmonkey.projects;
create trigger projects_set_updated_at
  before update on permitmonkey.projects
  for each row execute function permitmonkey.tg_set_updated_at();

drop trigger if exists contractor_answers_set_updated_at on permitmonkey.contractor_answers;
create trigger contractor_answers_set_updated_at
  before update on permitmonkey.contractor_answers
  for each row execute function permitmonkey.tg_set_updated_at();
