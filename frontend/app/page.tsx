import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AduMiniature } from '@/components/adu-miniature'
import { LandingProvenanceDemo } from '@/components/landing-provenance-demo'
import {
  CheckCircle2Icon,
  FileTextIcon,
  CheckSquareIcon,
  LayersIcon,
  PlayIcon,
  ArrowRightIcon,
} from 'lucide-react'

// MA-pivoted landing page. Replaces the prior CA-era version
// (28 CA refs / 480 cities / Hackathon 2026 badge).
// See docs/design/landing-stripe-synthesis-rationale.md.

export default function LandingPage() {
  return (
    <div className="bg-permitmonkey-gradient">
      <Nav />
      <Hero />
      <DemoVideoSection />
      <CityCoverageStrip />
      <StatsStrip />
      <ThreeFlowsSection />
      <ProvenanceSection />
      <MaDifferentiationSection />
      <PricingSection />
      <FreeToolCta />
      <SiteFooter />
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/65 border-b border-primary/10">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground text-sm font-bold">
              P
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              PermitMonkey
            </span>
            <span className="hidden md:inline-flex landing-pill" style={{ fontSize: '0.6875rem', padding: '0.05rem 0.4rem' }}>
              MA
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-7 text-sm font-body font-semibold text-foreground/80">
            <a href="#flows" className="hover:text-primary transition-colors">Product</a>
            <a href="#provenance" className="hover:text-primary transition-colors">Citations</a>
            <a href="#cities" className="hover:text-primary transition-colors">Cities</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#free-tools" className="hover:text-primary transition-colors">Free tools</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden sm:inline-block text-sm font-body font-semibold text-foreground/80 hover:text-primary transition-colors">
            Sign in
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-full px-5 font-body font-bold text-sm">
              Get started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-mesh" />
      <div className="absolute inset-0 topo-dots opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-12 lg:pb-20 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6 animate-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <span className="landing-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built for Massachusetts. Specifically.
            </span>
            <span className="hidden sm:inline-flex landing-pill landing-pill-coral">
              Ch 150 of 2024 · effective Feb 2, 2025
            </span>
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl xl:text-7xl leading-[1.02] tracking-[-0.025em] text-foreground">
            Permit responses<br />
            with <span className="gradient-text italic">sources you can verify.</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/75 max-w-xl leading-relaxed font-body">
            PermitMonkey reads your plans and the city&apos;s corrections letter, then writes
            back a professional response package. Every claim cited to the exact statute,
            regulation, or city bylaw. No hallucinated citations. Click any pill to see
            the source.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-7 py-5 font-body font-bold text-base">
                Start a corrections review
              </Button>
            </Link>
            <a href="#provenance">
              <Button variant="outline" size="lg" className="rounded-full px-7 py-5 font-body font-bold text-base border-primary/30">
                See how citations work
              </Button>
            </a>
          </div>
          <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm text-foreground/70 font-body">
            <div className="flex items-center gap-1.5">
              <CheckCircle2Icon className="w-4 h-4 text-primary" />
              MGL Ch 40A §3 cited by section
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2Icon className="w-4 h-4 text-primary" />
              760 CMR 71.00 verified
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2Icon className="w-4 h-4 text-primary" />
              MBTA proximity, deterministic
            </div>
          </dl>
        </div>
        <div className="lg:col-span-5 relative animate-fade-up stagger-1">
          <div className="relative max-w-[520px] mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 blur-3xl opacity-60" />
            <div className="relative">
              <AduMiniature variant="hero" />
            </div>
          </div>
          <div className="absolute top-6 -right-2 lg:right-4 card-float rounded-2xl p-3 max-w-[260px] hidden md:block">
            <p className="text-xs font-semibold text-primary mb-1">Citation verified</p>
            <p className="text-sm font-body text-foreground leading-snug">
              <span className="landing-pill align-baseline">MGL Ch 40A §3 ↗</span>
              {' '}points to{' '}
              <span className="font-mono text-xs">malegislature.gov/…/Chapter150</span>
            </p>
          </div>
          <div className="absolute -bottom-2 -left-2 lg:left-6 card-float rounded-2xl p-3 max-w-[240px] hidden md:block">
            <p className="text-xs text-foreground/60 font-body mb-1">Boston Mattapan parcel</p>
            <p className="text-sm font-body text-foreground leading-snug">
              0.34 mi to <span className="font-semibold">Forest Hills Station</span> ·{' '}
              <span className="text-primary font-semibold">0 parking required</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function DemoVideoSection() {
  return (
    <section id="demo" className="relative max-w-5xl mx-auto px-6 lg:px-10 py-12 animate-fade-up stagger-2">
      <div className="text-center mb-6">
        <p className="eyebrow mb-2">Watch it run</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
          Corrections analysis, end to end.
        </h2>
        <p className="text-sm md:text-base text-foreground/65 font-body mt-3 max-w-2xl mx-auto">
          A real Massachusetts ADU permit corrections letter, parsed and responded to in
          under fifteen minutes. The same skill stack that ships with every Pro plan.
        </p>
      </div>
      <div className="aspect-video rounded-2xl overflow-hidden card-float">
        <iframe
          src="https://www.youtube.com/embed/jHwBkFSvyk0"
          title="PermitMonkey demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="flex justify-center gap-3 mt-4 text-xs font-body text-foreground/60">
        <span className="inline-flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1">
          <PlayIcon className="w-3 h-3" /> ~15 min
        </span>
        <span className="inline-flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1">
          ~50 agent turns
        </span>
        <span className="inline-flex items-center gap-1.5 bg-muted/40 rounded-full px-3 py-1">
          ~$3 per run
        </span>
      </div>
    </section>
  )
}

function CityCoverageStrip() {
  const cities = ['Boston', 'Cambridge', 'Somerville', 'Newton', 'Brookline']
  return (
    <section id="cities" className="border-y border-primary/10 bg-background/55 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <p className="text-center eyebrow mb-5">
          Deep MA city coverage · reference files in production
        </p>
        <div className="marquee-mask flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-display text-2xl md:text-3xl text-foreground/80">
          {cities.map((city, i) => (
            <span key={city} className={i === 0 ? 'opacity-90' : 'opacity-50'}>
              {city}
              {i < cities.length - 1 && (
                <span className="mx-5 opacity-40">·</span>
              )}
            </span>
          ))}
          <span className="opacity-50 italic"> + statewide floor</span>
        </div>
      </div>
    </section>
  )
}

function StatsStrip() {
  const stats = [
    { num: '9 / 12', label: 'Boston deep-skill reference files filled, with inline provenance tags on every material claim.' },
    { num: '100%', label: 'Of cited claims are programmatically verified against either skill references or the canonical source URL.' },
    { num: '<15min', label: 'Typical end-to-end response generation, from upload to draft response letter.' },
    { num: '3', label: 'Production flows: corrections interpreter, permit checklist, city pre-screening.' },
  ]
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-primary/15 bg-gradient-to-br from-background/80 to-background/40">
        {stats.map((s) => (
          <div key={s.num} className="p-8 bg-background/70 backdrop-blur-sm">
            <p className="stat-num text-4xl md:text-5xl">{s.num}</p>
            <p className="mt-3 text-sm font-body text-foreground/70 leading-relaxed">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ThreeFlowsSection() {
  const flows = [
    {
      icon: <FileTextIcon className="w-5 h-5 text-primary-foreground" />,
      iconBg: 'bg-primary',
      title: 'Corrections Interpreter',
      body: 'Upload plans + the city’s corrections letter. Get back a response letter, professional scope, corrections report, and per-sheet annotations — with citations on every claim.',
      tag: 'Primary · production',
      tagClass: 'text-primary',
    },
    {
      icon: <CheckSquareIcon className="w-5 h-5 text-secondary-foreground" />,
      iconBg: 'bg-secondary',
      title: 'Permit Checklist',
      body: 'Address, project basics, and PermitMonkey produces a pre-submission checklist with the city-specific gotchas baked in. Avoid the corrections letter in the first place.',
      tag: 'Pre-submission',
      tagClass: 'text-secondary',
    },
    {
      icon: <LayersIcon className="w-5 h-5 text-accent-foreground" />,
      iconBg: 'bg-accent',
      title: 'City Pre-Screening',
      body: 'Plan checkers feed inbound submissions to PermitMonkey for a first-pass triage. Obvious errors caught before human review. Audit-grade decision log on every output.',
      tag: 'Roadmap',
      tagClass: 'text-accent',
    },
  ]
  return (
    <section id="flows" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="max-w-2xl mb-12">
        <p className="eyebrow">Three flows</p>
        <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mt-3">
          The whole permit loop, on rails.
        </h2>
        <p className="mt-4 text-lg text-foreground/70 leading-relaxed">
          One contractor, one architect, one homeowner, or a city plan checker triaging
          the queue. PermitMonkey runs the same skill stack across all four roles.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {flows.map((f) => (
          <Card key={f.title} className="card-float rounded-2xl p-6 group hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-0">
              <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-xl tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{f.body}</p>
              <p className={`mt-5 text-sm font-body font-semibold ${f.tagClass} inline-flex items-center gap-1`}>
                {f.tag} <ArrowRightIcon className="w-3.5 h-3.5" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function ProvenanceSection() {
  return (
    <section id="provenance" className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/45 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <p className="eyebrow">The moat</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mt-3">
            Every claim is verifiable. <span className="italic gradient-text">In one click.</span>
          </h2>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
            Other AI permit tools assert. PermitMonkey cites &mdash; with the exact
            statute section, the retrieval date, and a clickable source. The verifier
            runs Method&nbsp;1 (skill reference cross-check) and Method&nbsp;2 (canonical
            source fetch) before the contractor sees a single pill.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-body">
            <li className="flex items-start gap-3">
              <span className="landing-pill" style={{ fontSize: '0.6875rem' }}>verified</span>
              <span className="text-foreground/80">
                Moss green pill = verifier confirmed the citation. Click to view the verbatim source.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="landing-pill landing-pill-amber" style={{ fontSize: '0.6875rem' }}>unverified</span>
              <span className="text-foreground/80">
                Amber = agent emitted a citation we couldn&apos;t auto-verify; the source URL still opens.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="landing-pill landing-pill-coral" style={{ fontSize: '0.6875rem' }}>broken</span>
              <span className="text-foreground/80">
                Coral = canonical URL has moved. The cited rule may have been amended.
              </span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-7">
          <LandingProvenanceDemo />
        </div>
      </div>
    </section>
  )
}

function MaDifferentiationSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="eyebrow">Built for Massachusetts</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground">
            We didn&apos;t port <span className="italic">a California tool to Boston.</span>
            <br />
            We rebuilt the knowledge base.
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl">
            Massachusetts ADU law isn&apos;t a copy-paste of California&apos;s. Boston operates
            under a special-act zoning framework. PermitMonkey teaches its agent the
            actual structure: per-neighborhood implementation, the open preemption
            questions, the MBTA proximity rule, the Specialized Opt-In Energy Code.
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-body text-foreground/80 max-w-2xl">
            {[
              'Ch. 150 of 2024 & 760 CMR 71.00, by section',
              '780 CMR 10th Edition, current as of Oct 2023',
              'All 11 Boston Landmarks districts mapped',
              'Mattapan adopted Feb 2024 · Roslindale, West Roxbury, Hyde Park drafts in progress',
              'MBTA GTFS feed for 0.5-mile parking exemption',
              'Specialized Opt-In Energy Code (HERS 45-55)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          <pre className="code-block-moss whitespace-pre-wrap">{`# server/skills/boston-adu/references/transit-parking.md

State law: 1 space max; 0 within 0.5 mi of MBTA service.
The walking distance measurement is documented in
Attachment B (Google Maps walking directions).
[source:
  malegislature.gov/…/Chapter150
  | retrieved: 2026-04-22
  | citation: St. 2024, c. 150 §8]

# Workflow (post-Phase-2):
# 1. Geocode parcel → lat/lon
# 2. mbta-proximity.checkExemption({lat, lon})
# 3. Claude *interprets*; never *computes*`}</pre>
          <p className="mt-3 text-xs font-mono text-foreground/50 text-center">
            9 of 12 boston-adu reference files in production
          </p>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="text-center mb-12">
        <p className="eyebrow">Pricing</p>
        <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-foreground mt-3">
          Three tiers. No surprise add-ons.
        </h2>
        <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
          Every plan includes the verifier, the eval harness scoring, and the Boston
          knowledge base. Higher tiers add audit-grade exports and multi-project firm tooling.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-float rounded-2xl p-7">
          <CardContent className="p-0">
            <p className="font-body text-sm font-semibold uppercase tracking-widest text-foreground/60">Free</p>
            <p className="font-display font-black text-4xl tracking-tight text-foreground mt-3">$0</p>
            <p className="text-sm text-foreground/70 mt-1">forever</p>
            <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
              ADU eligibility checker. Massachusetts address in, verdict out, one click to email yourself the report.
            </p>
            <Link href="/eligibility" className="block mt-6">
              <Button variant="outline" className="w-full rounded-full">Try the checker</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="card-float rounded-2xl p-7 ring-2 ring-primary">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <p className="font-body text-sm font-semibold uppercase tracking-widest text-primary">Pro</p>
              <span className="landing-pill" style={{ fontSize: '0.6875rem' }}>Recommended</span>
            </div>
            <p className="font-display font-black text-4xl tracking-tight text-foreground mt-3">
              $99<span className="text-lg text-foreground/60">/mo</span>
            </p>
            <p className="text-sm text-foreground/70 mt-1">solo contractor or architect</p>
            <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
              Corrections interpreter and permit checklist. Unlimited projects. Verified citations on every output.
            </p>
            <Link href="/dashboard" className="block mt-6">
              <Button className="w-full rounded-full">Start free trial</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="card-float rounded-2xl p-7">
          <CardContent className="p-0">
            <p className="font-body text-sm font-semibold uppercase tracking-widest text-foreground/60">Firm</p>
            <p className="font-display font-black text-4xl tracking-tight text-foreground mt-3">
              $499<span className="text-lg text-foreground/60">/mo</span>
            </p>
            <p className="text-sm text-foreground/70 mt-1">design-build firms</p>
            <p className="mt-5 text-sm text-foreground/80 leading-relaxed">
              Multi-project workspace, audit log export, custom plan-sheet annotation styles. SLA on response time.
            </p>
            <a href="mailto:hello@permitmonkey.com" className="block mt-6">
              <Button variant="outline" className="w-full rounded-full">Talk to founder</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function FreeToolCta() {
  return (
    <section
      id="free-tools"
      className="relative overflow-hidden bg-gradient-to-b from-primary to-primary/90"
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(900px 400px at 20% 0%, rgba(242, 139, 110, 0.30), transparent 60%), radial-gradient(700px 400px at 80% 100%, rgba(217, 189, 137, 0.30), transparent 60%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-primary-foreground tracking-tight">
          Is your lot ADU-eligible?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/85 max-w-xl mx-auto leading-relaxed">
          Type a Massachusetts address. Get a verdict in under ten seconds. State law floor +
          your city&apos;s local rules. Free.
        </p>
        <form className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch">
          <input
            type="text"
            placeholder="14 Maple Street, Boston, MA 02126"
            className="flex-1 rounded-full px-6 py-3.5 bg-background/95 border border-background/20 text-foreground placeholder:text-foreground/40 font-body focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button
            type="submit"
            className="rounded-full px-7 py-3.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold transition-colors"
          >
            Check eligibility
          </button>
        </form>
        <p className="mt-4 text-xs font-body text-primary-foreground/60">
          No login required · we email the report when you want it
        </p>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground text-sm font-bold">
              P
            </span>
            <span className="font-display text-xl font-bold tracking-tight">PermitMonkey</span>
          </div>
          <p className="text-sm text-background/60 max-w-sm leading-relaxed">
            AI permit assistant for Massachusetts ADUs. Defensible response packages,
            citations you can verify yourself.
          </p>
          <p className="text-xs text-background/40 pt-2">
            Boston, MA · pivoted from a CA hackathon project (cc-crossbeam by @breezwoods)
          </p>
        </div>
        <FooterCol title="Product" items={[
          { label: 'Corrections', href: '#flows' },
          { label: 'Checklist', href: '#flows' },
          { label: 'City pre-screen', href: '#flows' },
          { label: 'Eligibility checker', href: '/eligibility' },
        ]} />
        <FooterCol title="Cities" items={[
          { label: 'Boston', href: '#cities' },
          { label: 'Cambridge', href: '#cities' },
          { label: 'Somerville', href: '#cities' },
          { label: 'Newton', href: '#cities' },
          { label: 'Brookline', href: '#cities' },
        ]} />
        <FooterCol title="Trust" items={[
          { label: 'Provenance UI', href: '#provenance' },
          { label: 'Eval benchmark', href: '#' },
          { label: 'Citation methodology', href: '#' },
          { label: 'Lab notes', href: '#' },
        ]} />
      </div>
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/40">
          <p>
            © 2026 PermitMonkey. Citations to MGL, CMR, and EOHLC are the work of the
            Massachusetts state government.
          </p>
          <p className="font-mono">built on Claude Opus 4.7 · Agent SDK</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold text-background/40 mb-3">{title}</p>
      <ul className="space-y-2 text-sm text-background/80">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="hover:text-background transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
