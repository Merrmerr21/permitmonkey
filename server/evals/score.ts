/**
 * Scoring functions: citation precision, citation recall, verdict match.
 *
 * Precision uses the existing verifyCitation() service — every extracted
 * inline tag is verified against either skill references (Method 1) or
 * the canonical URL (Method 2). A tag that fails both is unverified.
 *
 * Recall checks whether every fixture-declared expected citation
 * (must_appear=true) was emitted by the agent.
 *
 * Verdict match is a string equality on a verdict-shaped output. Skipped
 * for fixtures without an expected_verdict.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyCitation } from '../src/services/citation-verification.ts';
import { extractCitations, toCitation } from './citation-extractor.ts';
import type {
  CitationVerificationOutcome,
  ExpectedCitation,
  Fixture,
  FixtureScore,
  RunOutput,
} from './types.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = path.resolve(HERE, '..', 'skills');

export async function scoreRun(fixture: Fixture, output: RunOutput): Promise<FixtureScore> {
  const extracted = extractCitations(output.raw_markdown);
  const outcomes: CitationVerificationOutcome[] = [];

  for (const ex of extracted) {
    const result = await verifyCitation(toCitation(ex), SKILLS_ROOT);
    outcomes.push({
      authority: ex.authority,
      source_url: ex.source_url,
      verified: result.verified,
      method: result.method,
      error: result.error,
    });
  }

  const total = outcomes.length;
  const verified = outcomes.filter((o) => o.verified).length;
  const precision = {
    verified,
    total,
    ratio: total === 0 ? 0 : verified / total,
  };

  const recall = scoreRecall(fixture.ground_truth.expected_citations, outcomes);

  const verdict_match = inferVerdictMatch(fixture, output);

  return {
    fixture_id: fixture.id,
    duration_ms: output.duration_ms,
    cost_usd: output.cost_usd,
    citation_precision: precision,
    citation_recall: recall,
    verdict_match,
    agent_errors: output.agent_errors,
    citation_outcomes: outcomes,
  };
}

function scoreRecall(
  expected: ExpectedCitation[],
  outcomes: CitationVerificationOutcome[],
): FixtureScore['citation_recall'] {
  const required = expected.filter((e) => e.must_appear);
  if (required.length === 0) {
    return { found: 0, expected: 0, ratio: 1 };
  }
  const present = required.filter((req) =>
    outcomes.some(
      (o) =>
        normalizeAuthority(o.authority) === normalizeAuthority(req.authority) ||
        o.source_url === req.source_url,
    ),
  ).length;
  return {
    found: present,
    expected: required.length,
    ratio: present / required.length,
  };
}

function inferVerdictMatch(fixture: Fixture, output: RunOutput): boolean | null {
  const expected = fixture.ground_truth.expected_verdict;
  if (!expected) return null;
  const md = output.raw_markdown.toLowerCase();
  if (expected === 'approved' && /\b(approved|by-?right|eligible)\b/.test(md)) return true;
  if (expected === 'corrections' && /\bcorrection(s)?\b/.test(md)) return true;
  if (expected === 'denied' && /\b(denied|ineligible|not eligible)\b/.test(md)) return true;
  return false;
}

function normalizeAuthority(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}
