-- 0005_leads.sql
--
-- Email capture funnel from the eligibility checker free tool.
-- The Phase 4 drip sequence reads from this table; CCPA/GDPR deletion
-- requests delete from here.

create table if not exists permitmonkey.leads (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  source          text not null default 'eligibility_checker'
                  check (source in (
                    'eligibility_checker',
                    'pricing_page',
                    'newsletter',
                    'cold_outreach_response'
                  )),
  city            text,                   -- captured from the eligibility check, if any
  verdict         text,                   -- 'likely_eligible' | 'needs_review' | 'not_eligible'
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  ip_hash         text,                   -- hashed IP for abuse-rate-limiting; raw IP not stored
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now()
);

-- Email is the natural key for dedup, but the source matters — the same
-- person hitting the eligibility tool twice shouldn't double-count.
create unique index if not exists leads_email_source_idx
  on permitmonkey.leads (lower(email), source);

create index if not exists leads_created_at_idx on permitmonkey.leads (created_at);
create index if not exists leads_unsubscribed_idx
  on permitmonkey.leads (unsubscribed_at) where unsubscribed_at is not null;

-- RLS: anonymous inserts allowed (the funnel is public). Reads are
-- service-role only — no end-user should be able to enumerate leads.
alter table permitmonkey.leads enable row level security;

drop policy if exists leads_insert_anon on permitmonkey.leads;
create policy leads_insert_anon on permitmonkey.leads
  for insert to anon, authenticated
  with check (true);

-- Deliberately no select / update / delete policies for non-service-role.

grant insert on permitmonkey.leads to anon, authenticated;
