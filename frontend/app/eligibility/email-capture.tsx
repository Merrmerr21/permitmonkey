'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2Icon, MailIcon } from 'lucide-react'

interface EmailCaptureProps {
  city: string | null
  verdict: 'likely_eligible' | 'needs_review' | 'not_eligible'
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function EmailCapture({ city, verdict }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'eligibility_checker',
          city,
          verdict,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setError(data.error === 'invalid_email' ? 'That email looks invalid.' : 'Could not save your email. Try again?')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setError('Network error. Try again?')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="p-6 flex items-start gap-3">
          <CheckCircle2Icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-body font-semibold text-foreground">Got it. Check your inbox.</p>
            <p className="font-body text-sm text-muted-foreground mt-1">
              We will email you a PDF copy of this verdict and the supporting citations within a few minutes.
              No follow-up emails unless you opt in.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <MailIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="heading-card text-foreground">Email me a copy</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">
              We will send a PDF version of this verdict with all citations clickable. One email — we will not
              add you to a marketing list unless you ask.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="lead-email" className="sr-only">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              <Button type="submit" disabled={status === 'submitting' || !email}>
                {status === 'submitting' ? 'Sending…' : 'Email me'}
              </Button>
            </form>
            {error && <p className="text-red-600 text-sm font-body mt-2">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
