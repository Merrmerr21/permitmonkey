import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { evaluateEligibility, type EligibilityInput } from '@/lib/eligibility';
import { verifyCitation } from '@/lib/citations/verify';
import type { CitationVerification } from '@/lib/citations/types';

const SKILL_REFERENCES_ROOT = path.resolve(process.cwd(), '..', 'server', 'skills');

const RATE_LIMIT_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;
const ipHits = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= RATE_LIMIT_PER_HOUR) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in an hour.' },
        { status: 429 },
      );
    }

    const body = (await request.json()) as Partial<EligibilityInput>;

    if (!body.address || typeof body.address !== 'string') {
      return NextResponse.json({ error: 'address is required' }, { status: 400 });
    }
    if (!body.lot_size_sqft || typeof body.lot_size_sqft !== 'number' || body.lot_size_sqft <= 0) {
      return NextResponse.json({ error: 'lot_size_sqft must be a positive number' }, { status: 400 });
    }
    if (
      !body.primary_dwelling_sqft ||
      typeof body.primary_dwelling_sqft !== 'number' ||
      body.primary_dwelling_sqft <= 0
    ) {
      return NextResponse.json(
        { error: 'primary_dwelling_sqft must be a positive number' },
        { status: 400 },
      );
    }

    const normalized = body.address.toLowerCase();
    if (!/\bma\b|massachusetts/.test(normalized)) {
      return NextResponse.json(
        { error: 'This tool currently supports Massachusetts addresses only.' },
        { status: 400 },
      );
    }

    const result = evaluateEligibility(body as EligibilityInput);

    // Run each cited authority through the same verifier the corrections
    // viewer + articles use. Method 1 walks server/skills/ for a substring
    // match against the excerpt; Method 2 falls back to a canonical URL
    // fetch. Failures degrade gracefully — citation still renders, just
    // with the unverified status.
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

    const citationsWithVerification = result.citations.map((c, i) => ({
      ...c,
      verification: verifications[i],
    }));

    return NextResponse.json({ ...result, citations: citationsWithVerification });
  } catch (err) {
    console.error('eligibility route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
