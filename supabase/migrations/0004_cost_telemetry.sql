-- 0004_cost_telemetry.sql
--
-- Per-agent-run cost telemetry. The orchestrator inserts one row per agent
-- run on completion (success or failure); the weekly cost-audit routine
-- aggregates from this table.
--
-- Mirrors master playbook §80 (cost monitoring) and §217 (cache hit rate
-- discipline). Columns capture both spend and cache effectiveness so the
-- two routines read from one source.

create table if not exists permitmonkey.agent_runs (
  id                 uuid primary key default gen_random_uuid(),
  project_id         uuid references permitmonkey.projects(id) on delete set null,
  flow_type          text not null,
  outcome            text not null check (outcome in ('completed', 'failed', 'timeout')),
  model_used         text not null,           -- e.g. 'claude-opus-4-7'
  duration_ms        bigint not null,
  input_tokens       integer not null default 0,
  output_tokens      integer not null default 0,
  cache_read_tokens  integer not null default 0,
  cache_write_tokens integer not null default 0,
  cost_usd           numeric(10, 4) not null default 0,
  error_message      text,
  created_at         timestamptz not null default now()
);

create index if not exists agent_runs_project_id_idx on permitmonkey.agent_runs (project_id);
create index if not exists agent_runs_created_at_idx on permitmonkey.agent_runs (created_at);
create index if not exists agent_runs_flow_type_outcome_idx
  on permitmonkey.agent_runs (flow_type, outcome);

-- Service-role writes only; users may read their own runs (RLS).
alter table permitmonkey.agent_runs enable row level security;

drop policy if exists agent_runs_select_via_project on permitmonkey.agent_runs;
create policy agent_runs_select_via_project on permitmonkey.agent_runs
  for select using (
    project_id is not null
    and exists (
      select 1 from permitmonkey.projects p
      where p.id = agent_runs.project_id
        and (p.user_id = auth.uid() or p.is_demo = true)
    )
  );

-- ---------------------------------------------------------------------------
-- Weekly cost-rollup view; the cost-audit routine reads from here.
-- ---------------------------------------------------------------------------
create or replace view permitmonkey.agent_runs_weekly as
select
  date_trunc('week', created_at) as week_start,
  flow_type,
  model_used,
  count(*) filter (where outcome = 'completed') as runs_completed,
  count(*) filter (where outcome = 'failed') as runs_failed,
  count(*) filter (where outcome = 'timeout') as runs_timeout,
  sum(cost_usd)                                 as cost_usd_total,
  avg(cost_usd)                                 as cost_usd_avg,
  sum(input_tokens)                             as input_tokens_total,
  sum(output_tokens)                            as output_tokens_total,
  sum(cache_read_tokens)                        as cache_read_tokens_total,
  sum(cache_write_tokens)                       as cache_write_tokens_total,
  -- Cache hit rate = cache_read / (cache_read + cache_write + input_tokens).
  -- Higher is better; master §217 expects ≥ 80% on stable system prompts.
  case when sum(cache_read_tokens + cache_write_tokens + input_tokens) > 0
       then sum(cache_read_tokens)::numeric
            / sum(cache_read_tokens + cache_write_tokens + input_tokens)::numeric
       else 0
  end as cache_hit_rate,
  avg(duration_ms)                              as duration_ms_avg
from permitmonkey.agent_runs
group by date_trunc('week', created_at), flow_type, model_used
order by week_start desc, flow_type;

grant select on permitmonkey.agent_runs to authenticated;
grant select on permitmonkey.agent_runs_weekly to authenticated;
