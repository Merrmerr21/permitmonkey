/**
 * Eval harness types — describe fixtures, run results, and reports.
 *
 * Skeleton stage: the runner has Mock and Agent implementations sharing this
 * interface. Real fixtures land under server/evals/fixtures/<id>/fixture.json
 * once test-asset approval is granted.
 */

export type FixtureKind = 'corrections-letter' | 'eligibility-check' | 'plan-review';

export interface Fixture {
  id: string;
  kind: FixtureKind;
  description: string;
  input: {
    prompt: string;
    plans_path?: string;
    correction_letter_path?: string;
    eligibility?: EligibilityFixtureInput;
  };
  ground_truth: {
    expected_verdict?: 'approved' | 'corrections' | 'denied';
    expected_citations: ExpectedCitation[];
    expected_response_topics?: string[];
  };
  /** Per-fixture canned markdown for mock-mode runs. Falls back to the runner's default when absent. */
  mock_output?: string;
  metadata: {
    created: string;
    last_verified: string;
    domain: string;
  };
}

export interface EligibilityFixtureInput {
  address: string;
  city: string;
  lot_size_sqft: number;
  primary_dwelling_sqft: number;
  zoning_district?: string;
  proposed_adu_type?: 'detached' | 'attached' | 'conversion' | 'undecided';
  proposed_adu_sqft?: number;
  within_half_mile_transit?: boolean;
  in_historic_district?: boolean;
}

export interface ExpectedCitation {
  authority: string;
  source_url: string;
  must_appear: boolean;
}

export interface RunOutput {
  fixture_id: string;
  raw_markdown: string;
  duration_ms: number;
  cost_usd: number | null;
  turns: number;
  agent_errors: string[];
}

export interface CitationVerificationOutcome {
  authority: string;
  source_url: string;
  verified: boolean;
  method: 'skill_reference_lookup' | 'canonical_url_fetch' | 'none';
  error?: string;
}

export interface FixtureScore {
  fixture_id: string;
  duration_ms: number;
  cost_usd: number | null;
  citation_precision: { verified: number; total: number; ratio: number };
  citation_recall: { found: number; expected: number; ratio: number };
  verdict_match: boolean | null;
  agent_errors: string[];
  citation_outcomes: CitationVerificationOutcome[];
}

export interface RunReport {
  timestamp: string;
  git_sha: string;
  mode: 'mock' | 'agent';
  fixtures_total: number;
  fixtures_run: number;
  citation_precision_p50: number;
  citation_recall_p50: number;
  verdict_accuracy: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
  total_cost_usd: number;
  scores: FixtureScore[];
}
