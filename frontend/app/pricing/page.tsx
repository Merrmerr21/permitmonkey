import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Pricing — PermitMonkey',
  description:
    'Three tiers for Massachusetts ADU permit work: Free eligibility checker, Pro for solo contractors, Firm for multi-project shops.',
}

// Dollar amounts mirror the landing-page PricingSection. Final amounts are
// gated on the Phase 2 willingness-to-pay decision; treat these as
// placeholders subject to change before the first paying contractor.
const TIERS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    audience: 'Curious property owners and contractors scoping a job',
    cta: { label: 'Try the checker', href: '/eligibility', variant: 'outline' as const },
    included: [
      'Unlimited Massachusetts ADU eligibility checks',
      'State-law verdict (MGL Ch 40A §3 + 760 CMR 71.00)',
      'City-level overlay for Boston, Cambridge, Somerville, Newton, Brookline',
      'Verified inline citations on every claim',
      'Email yourself the verdict report (PDF)',
    ],
    notIncluded: [
      'Plan upload',
      'Corrections-letter interpretation',
      'Saved projects',
    ],
  },
  {
    name: 'Pro',
    price: '$99',
    cadence: '/month',
    audience: 'Solo general contractors and small architecture practices',
    recommended: true,
    cta: { label: 'Start free trial', href: '/dashboard', variant: 'default' as const },
    included: [
      'Everything in Free',
      'Corrections Letter Interpreter (Flow 1) — 5 jobs/month',
      'Permit Checklist Generator (Flow 2)',
      'Plan upload up to 50 MB per project',
      'Audit-grade response packages (no watermark)',
      'Realtime project status with Supabase Realtime',
      'Email notifications when jobs complete',
      'Citation verification (Method 1 + Method 2) on every output',
    ],
    notIncluded: [
      'Multi-project workspace',
      'Custom annotation styles',
      'SLA on response time',
    ],
  },
  {
    name: 'Firm',
    price: '$499',
    cadence: '/month',
    audience: 'Design-build firms running multiple ADUs in parallel',
    cta: { label: 'Talk to founder', href: 'mailto:hello@permitmonkey.com', variant: 'outline' as const },
    included: [
      'Everything in Pro',
      'Unlimited corrections jobs',
      'Multi-project workspace with role-based access',
      'Audit log export (CSV / JSON)',
      'Custom plan-sheet annotation styles',
      'Priority queue (sub-3-min agent run start)',
      'Standard SLA on response time',
      'Quarterly skill review with the founder',
    ],
    notIncluded: [
      'White-label distribution (contact for enterprise)',
    ],
  },
]

const FAQS = [
  {
    q: 'Do you offer a free trial of Pro?',
    a: 'Yes — the first 14 days are free with full Pro access. No credit card required to start.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'You can export every project as JSON or download the response packages as PDFs before cancellation. After cancellation we retain account data for 30 days, then it is purged.',
  },
  {
    q: 'Are the citations actually verified?',
    a: 'Yes. Every claim our agent makes carries an inline tag of the form [source: URL | retrieved: DATE | citation: SECTION]. We verify each tag two ways — Method 1 walks our skill reference files; Method 2 fetches the canonical source URL. The eval harness fails CI on any drift.',
  },
  {
    q: 'Can I use this outside Massachusetts?',
    a: 'Not today. The state law (Ch 150 of 2024) and the city skills are MA-specific. We are watching New York and Connecticut for a 2027 expansion window.',
  },
  {
    q: 'What if a plan checker rejects an output you generated?',
    a: 'Open a ticket via the in-app feedback flow. If the rejection traces to a citation error on our side, we credit the run and add a regression test to the eval harness so it cannot recur. PermitMonkey does not provide legal or engineering certification — every output remains the contractor\'s professional responsibility.',
  },
  {
    q: 'Is my data sent to Anthropic?',
    a: 'Yes — agent runs use the Claude API. Anthropic\'s commercial terms apply zero data retention by default for our usage tier; prompts and completions are not retained beyond the inference call. Full detail in our Privacy Policy.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← PermitMonkey
          </Link>
          <div className="flex gap-5 text-sm">
            <Link href="/eligibility" className="text-muted-foreground hover:text-foreground">Free tool</Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Pricing</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mt-3">
            Built for Massachusetts ADU work.
          </h1>
          <p className="mt-4 text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Free for the eligibility check. Paid when you upload plans and want a corrections
            response that holds up to a Boston ISD reviewer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={`rounded-2xl p-7 flex flex-col ${
                tier.recommended ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <p className={`font-body text-sm font-semibold uppercase tracking-widest ${
                    tier.recommended ? 'text-primary' : 'text-foreground/60'
                  }`}>
                    {tier.name}
                  </p>
                  {tier.recommended && (
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="font-display font-black text-4xl tracking-tight text-foreground mt-3">
                  {tier.price}
                  <span className="text-lg text-foreground/60">{tier.cadence}</span>
                </p>
                <p className="text-sm text-foreground/70 mt-1">{tier.audience}</p>

                <div className="mt-6 space-y-2 flex-1">
                  {tier.included.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold mt-0.5 shrink-0">+</span>
                      <span className="text-foreground/85">{item}</span>
                    </div>
                  ))}
                </div>

                {tier.notIncluded.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-2">
                    {tier.notIncluded.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-foreground/50">
                        <span className="mt-0.5 shrink-0">—</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Link href={tier.cta.href} className="block mt-6">
                  <Button variant={tier.cta.variant} className="w-full rounded-full">
                    {tier.cta.label}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-3xl tracking-tight text-foreground text-center mb-10">
            Common questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-foreground text-base mb-2">{faq.q}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 max-w-3xl mx-auto p-8 rounded-2xl bg-foreground/5 border border-border/40 text-center">
          <h2 className="font-display font-bold text-2xl text-foreground">
            Still deciding?
          </h2>
          <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
            Run the free eligibility checker on a real Massachusetts address. The verdict and
            citations come back in under ten seconds. No email required.
          </p>
          <Link href="/eligibility" className="inline-block mt-5">
            <Button className="rounded-full px-7">Try the free checker</Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 PermitMonkey</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
