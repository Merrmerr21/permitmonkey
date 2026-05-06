import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    // Dev convenience: when Supabase env isn't set, return a stub that throws
    // only on actual auth/DB calls. Lets pages render their JSX without
    // exploding at module-load time.
    const dev = process.env.NODE_ENV !== 'production'
    if (!dev) {
      throw new Error('Supabase env vars missing in production build')
    }
    return new Proxy({} as ReturnType<typeof createBrowserClient<Database>>, {
      get() {
        throw new Error(
          'Supabase client called but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. ' +
          'Set them in frontend/.env.local to use auth/DB features in dev.',
        )
      },
    })
  }
  return createBrowserClient<Database>(url, anonKey)
}
