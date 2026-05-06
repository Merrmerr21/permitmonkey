# Frontend rules (Next.js 16, React 19, Tailwind 4, Supabase SSR)

Inherits from root `CLAUDE.md`. These are scope-specific.

## Stack
- **Next.js 16** App Router. RSC by default; `'use client'` only when interactivity, hooks, or browser APIs are required.
- **React 19** — server components, server actions, `use()` hook for promises. No `useEffect` for data fetching in RSC paths.
- **Tailwind CSS 4** with `@tailwindcss/postcss`. No CSS-in-JS, no styled-components, no module CSS unless escaping a Tailwind limitation.
- **Supabase SSR** (`@supabase/ssr`) for cookie-based auth on server, `@supabase/supabase-js` for browser. Realtime channels for live status updates (no polling).
- **shadcn/ui + Radix** for primitives. **lucide-react** for icons. **react-markdown + remark-gfm** for output rendering.

## Conventions
- API routes live in `app/api/<resource>/route.ts`. Use `NextResponse` for responses. Never expose Supabase service-role key to the browser.
- Server actions for mutations from forms; route handlers for everything else.
- Path alias `@/*` maps to `./` (per tsconfig). Use it consistently.
- Public pages (no auth) under `app/(public)/`; authed under `app/(dashboard)/`.

## Realtime
- Subscribe via Supabase channels; clean up on unmount. Status flow is `ready → processing → completed`. Listen for the *transition*, not a specific terminal state, when polling for "is it running."
- See [`plan-supabase-realtime-fix.md`](../plan-supabase-realtime-fix.md) for the canonical pattern; do not reinvent.

## Safety
- Never hard-code anon/service keys. Read from `process.env.NEXT_PUBLIC_SUPABASE_*` (browser-safe) or `process.env.SUPABASE_SERVICE_ROLE_KEY` (server-only — never imported into a `'use client'` file).
- API key checks in `lib/api-auth.ts` — extend that, do not duplicate the comparison logic.
