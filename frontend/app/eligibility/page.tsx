'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2Icon, AlertTriangleIcon, XCircleIcon } from 'lucide-react';

type Verdict = 'likely_eligible' | 'needs_review' | 'not_eligible';

interface Result {
  verdict: Verdict;
  verdict_summary: string;
  max_adu_sqft: number;
  parking_required: number;
  parking_exemption_reason: string | null;
  city: string | null;
  city_covered: boolean;
  city_gotchas: string[];
  next_steps: string[];
  citations: Array<{ authority: string; source_url: string; relevance: string }>;
  upgrade_cta: string;
  disclaimer: string;
}

const VERDICT_META: Record<Verdict, { icon: typeof CheckCircle2Icon; color: string; label: string }> = {
  likely_eligible: { icon: CheckCircle2Icon, color: 'text-green-600', label: 'Likely Eligible' },
  needs_review: { icon: AlertTriangleIcon, color: 'text-amber-600', label: 'Needs Review' },
  not_eligible: { icon: XCircleIcon, color: 'text-red-600', label: 'Not Eligible' },
};

export default function EligibilityPage() {
  const [address, setAddress] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [primarySize, setPrimarySize] = useState('');
  const [proposedSize, setProposedSize] = useState('');
  const [nearTransit, setNearTransit] = useState(false);
  const [historic, setHistoric] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          lot_size_sqft: Number(lotSize),
          primary_dwelling_sqft: Number(primarySize),
          proposed_adu_sqft: proposedSize ? Number(proposedSize) : undefined,
          within_half_mile_transit: nearTransit,
          in_historic_district: historic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setResult(data as Result);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const VerdictIcon = result ? VERDICT_META[result.verdict].icon : null;

  return (
    <div className="bg-topo-lines min-h-screen">
      <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="heading-card text-primary">PermitMonkey</span>
          <Badge variant="outline" className="text-[10px] tracking-wide">Massachusetts</Badge>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="py-10">
          <h1 className="heading-display text-4xl md:text-5xl text-foreground">
            Is your MA lot ADU-eligible?
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-2xl">
            Free 10-second check based on Chapter 150 of the Acts of 2024 and 760 CMR 71.00.
            Non-binding preliminary analysis — verify with your city before committing.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="address">Property address (city, MA required)</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Cambridge, MA 02138"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lot">Lot size (sqft)</Label>
                  <Input
                    id="lot"
                    type="number"
                    min={1}
                    value={lotSize}
                    onChange={(e) => setLotSize(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary">Primary dwelling size (sqft)</Label>
                  <Input
                    id="primary"
                    type="number"
                    min={1}
                    value={primarySize}
                    onChange={(e) => setPrimarySize(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="proposed">Proposed ADU size (optional)</Label>
                <Input
                  id="proposed"
                  type="number"
                  min={0}
                  value={proposedSize}
                  onChange={(e) => setProposedSize(e.target.value)}
                  placeholder="e.g. 800"
                />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-body">
                  <input
                    type="checkbox"
                    checked={nearTransit}
                    onChange={(e) => setNearTransit(e.target.checked)}
                  />
                  Within 0.5 mi of commuter rail, subway, ferry, or bus station (waives parking)
                </label>
                <label className="flex items-center gap-2 text-sm font-body">
                  <input
                    type="checkbox"
                    checked={historic}
                    onChange={(e) => setHistoric(e.target.checked)}
                  />
                  Property is in a local historic district
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Checking…' : 'Check Eligibility'}
              </Button>
              {error && <p className="text-red-600 text-sm font-body">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {result && VerdictIcon && (
          <div className="mt-8 space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Max ADU size</div>
                    <div className="heading-display text-2xl text-foreground">{result.max_adu_sqft} sqft</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      State cap: lesser of 900 sqft or 50% of primary dwelling
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Parking required</div>
                    <div className="heading-display text-2xl text-foreground">{result.parking_required}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.parking_exemption_reason ?? 'Up to 1 space allowed under 760 CMR 71.00.'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="heading-card text-foreground mb-3">City-specific gotchas</h3>
                <ul className="space-y-2 font-body text-sm text-muted-foreground list-disc pl-5">
                  {result.city_gotchas.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="heading-card text-foreground mb-3">Next steps</h3>
                <ul className="space-y-2 font-body text-sm text-muted-foreground list-disc pl-5">
                  {result.next_steps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="heading-card text-foreground mb-3">Citations</h3>
                <ul className="space-y-2 font-body text-sm list-disc pl-5">
                  {result.citations.map((c, i) => (
                    <li key={i}>
                      <a href={c.source_url} target="_blank" rel="noreferrer" className="text-primary underline">
                        {c.authority}
                      </a>
                      <span className="text-muted-foreground"> — {c.relevance}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/40 bg-primary/5">
              <CardContent className="p-6">
                <p className="font-body text-foreground">{result.upgrade_cta}</p>
                <Link href="/projects">
                  <Button className="mt-3">Start a corrections analysis</Button>
                </Link>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground font-body italic">{result.disclaimer}</p>
          </div>
        )}
      </main>
    </div>
  );
}
