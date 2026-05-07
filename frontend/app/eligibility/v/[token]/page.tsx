import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, AlertTriangleIcon, XCircleIcon, ShieldCheckIcon } from 'lucide-react';
import { decodeVerdictToken } from '@/lib/verdict-token';
import { evaluateEligibility } from '@/lib/eligibility';
import { verifyCitation } from '@/lib/citations/verify';
import type { CitationVerification } from '@/lib/citations/types';

const SKILL_REFERENCES_ROOT = path.resolve(process.cwd(), '..', 'server', 'skills');

const VERDICT_META = {
  likely_eligible: { icon: CheckCircle2Icon, color: 'text-green-600', label: 'Likely Eligible' },
  needs_review: { icon: AlertTriangleIcon, color: 'text-amber-600', label: 'Needs Review' },
  not_eligible: { icon: XCircleIcon, color: 'text-red-600', label: 'Not Eligible' },
} as const;

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const inputs = decodeVerdictToken(token);
  if (!inputs) {
    return { title: 'Verdict not found — PermitMonkey' };
  }
  const result = evaluateEligibility(inputs);
  const verdictLabel = VERDICT_META[result.verdict].label;
  const title = `${verdictLabel} — ${inputs.address} · PermitMonkey`;
  const description = result.verdict_summary;
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/eligibility/v/${token}`,
      siteName: 'PermitMonkey',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: false,  // Don't index per-verdict pages — they aren't canonical content.
      follow: true,
    },
  };
}

export default async function VerdictViewPage({ params }: PageProps) {
  const { token } = await params;
  const inputs = decodeVerdictToken(token);
  if (!inputs) notFound();

  const result = evaluateEligibility(inputs);

  // Same verifier wiring as the live API. Verifier failures degrade
  // gracefully — the page still renders.
  const verifications: CitationVerification[] = await Promise.all(
    result.citations.map(async (c) => {
      try {
        return await verifyCitation(
          { source_url: c.source_url, excerpt: c.excerpt },
          SKILL_REFERENCES_ROOT,
        );
      } catch {
        return { status: 'unverified' };
      }
    }),
  );

  const VerdictIcon = VERDICT_META[result.verdict].icon;

  return (
    <div className="bg-topo-lines min-h-screen">
      <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="heading-card text-primary">PermitMonkey</span>
          <Badge variant="outline" className="text-[10px] tracking-wide">Massachusetts</Badge>
        </Link>
        <div className="flex items-center gap-2 text-sm font-body">
          <Link href="/eligibility" className="px-3 py-1.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/50 transition">Run your own check</Link>
          <Link href="/" className="hidden sm:inline-block px-3 py-1.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/50 transition">Home</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="py-8">
          <Badge variant="outline" className="mb-3 text-[10px] tracking-wide">
            <ShieldCheckIcon className="h-3 w-3 mr-1" />
            Verified by PermitMonkey
          </Badge>
          <h1 className="heading-display text-3xl md:text-4xl text-foreground">
            ADU eligibility — {inputs.address}
          </h1>
          <p className="font-body text-muted-foreground mt-2 max-w-2xl text-sm">
            Public read-only snapshot. Verdict computed deterministically from the inputs encoded in this URL — no Supabase round-trip, no account.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <VerdictIcon className={`h-10 w-10 ${VERDICT_META[result.verdict].color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="heading-card text-xl text-foreground">
                    {VERDICT_META[result.verdict].label}
                  </h2>
                  {result.city && (
                    <Badge variant="outline">
                      {result.city}
                      {!result.city_covered ? ' (state law only)' : ''}
                    </Badge>
                  )}
                </div>
                <p className="font-body text-muted-foreground mt-1">{result.verdict_summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Lot size</div>
                <div className="heading-display text-2xl text-foreground">{inputs.lot_size_sqft.toLocaleString()} sqft</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Max ADU size</div>
                <div className="heading-display text-2xl text-foreground">{result.max_adu_sqft} sqft</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Parking required</div>
                <div className="heading-display text-2xl text-foreground">{result.parking_required}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {result.city_gotchas.length > 0 && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="heading-card text-foreground mb-3">City-specific gotchas</h3>
              <ul className="space-y-2 font-body text-sm text-muted-foreground list-disc pl-5">
                {result.city_gotchas.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card className="mt-4">
          <CardContent className="p-6">
            <h3 className="heading-card text-foreground mb-3">Citations</h3>
            <ul className="space-y-3 font-body text-sm">
              {result.citations.map((c, i) => {
                const v = verifications[i];
                const badge = v?.status === 'verified-skill' || v?.status === 'verified-url'
                  ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">verified</span>
                  : v?.status === 'broken'
                    ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">broken</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">unverified</span>;
                return (
                  <li key={i} className="border-l-2 border-primary/20 pl-3">
                    <div className="flex items-start gap-2 flex-wrap">
                      <a href={c.source_url} target="_blank" rel="noreferrer" className="text-primary underline font-medium">
                        {c.authority}
                      </a>
                      {badge}
                    </div>
                    <p className="text-muted-foreground mt-1">{c.relevance}</p>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 border-primary/40 bg-primary/5">
          <CardContent className="p-6">
            <p className="font-body text-foreground">{result.upgrade_cta}</p>
            <Link href="/eligibility">
              <Button className="mt-3">Run your own check</Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground font-body italic mt-6">{result.disclaimer}</p>
      </main>

      <footer className="border-t border-border/40 mt-8 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 PermitMonkey · Verified by PermitMonkey</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
