# Supabase migrations

Schema-as-code for the `permitmonkey` Postgres schema and storage buckets.

## Files

- `migrations/0001_initial_schema.sql` — `permitmonkey` schema, 5 tables (`projects`, `files`, `messages`, `outputs`, `contractor_answers`), indexes, `updated_at` triggers
- `migrations/0002_rls_policies.sql` — Row-Level Security policies; service-role bypasses RLS for server-side writes
- `migrations/0003_storage_buckets.sql` — three private buckets (`plan-binders`, `corrections-letters`, `agent-outputs`) plus per-user object policies

## Applying

The repo does not currently include a `supabase/config.toml` or use the
Supabase CLI in CI. The migrations are idempotent (`if not exists`,
`drop policy if exists`, `on conflict do update`) so they can be applied via:

1. **Supabase CLI** — `supabase db push` from this directory
2. **psql** — `psql "$SUPABASE_DB_URL" -f migrations/0001_initial_schema.sql && ...`
3. **Supabase Studio SQL editor** — paste each file in order

Production already has a schema; the first apply will be a no-op for tables
that exist and an additive change for missing constraints (e.g., RLS policies
that were created manually but never versioned).

## Source of truth

The TypeScript types in [`frontend/types/database.ts`](../frontend/types/database.ts)
are the runtime contract. If those drift from these migrations, the migrations
are wrong. After any schema change:

1. Update the migration file (or add a new `0004_*.sql`)
2. Update `frontend/types/database.ts` to match
3. Update `server/src/services/supabase.ts` if the new column is used server-side
4. Append a CHANGELOG entry under `Changed`

## RLS verification

After applying, sanity-check from psql with two non-service-role JWTs:

```sql
set role authenticated;
set request.jwt.claim.sub = '<user-A-uuid>';
select count(*) from permitmonkey.projects;  -- only A's rows + demos

set request.jwt.claim.sub = '<user-B-uuid>';
select count(*) from permitmonkey.projects;  -- only B's rows + demos
```

If either query returns the other user's rows, RLS is broken.
