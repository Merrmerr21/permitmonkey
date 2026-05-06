'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AduMiniature } from '@/components/adu-miniature'
import { ArrowLeftIcon, Loader2Icon, LogInIcon } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-topo-lines">
      <div className="relative z-10 w-full max-w-md space-y-3 animate-fade-up">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <Card className="shadow-[0_8px_32px_rgba(28,25,23,0.08)] border-border/50">
          <CardContent className="pt-8 pb-6 px-8 text-center space-y-6">
            <div className="flex justify-center">
              <AduMiniature variant="accent" />
            </div>

            <div className="space-y-1">
              <h1 className="heading-display text-foreground">PermitMonkey</h1>
              <p className="text-sm text-muted-foreground font-body">
                AI-powered permit review for Massachusetts ADUs
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-left">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-body"
                autoComplete="email"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-body"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full font-bold font-body
                           hover:shadow-[0_0_24px_rgba(45,106,79,0.3)] hover:brightness-110"
              >
                {loading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <LogInIcon className="w-4 h-4" />
                )}
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="flex flex-col gap-1 text-xs font-body text-muted-foreground">
              <p>
                <Link href="/forgot-password" className="hover:text-foreground transition underline-offset-2 hover:underline">
                  Forgot password?
                </Link>
              </p>
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive font-body">{error}</p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs font-body text-muted-foreground">
          New here? Try the free{' '}
          <Link href="/eligibility" className="text-primary font-semibold hover:underline">
            eligibility checker
          </Link>{' '}
          first — no account required.
        </p>
      </div>
    </div>
  )
}
