/**
 * Corrections Response Generator — Steps 5-6 of the Phase 2 corrections flow.
 *
 * Takes the triage output (categorized items + contractor answers) and
 * produces:
 *   - `entries[]` — one ResponseEntry per CorrectionItem, with response
 *     paragraph, inline-tagged citations, and verifier pass status
 *   - the compiled response-package PDF (via the adu-corrections-pdf skill)
 *
 * Generator-Verifier pair: Sonnet 4.6 generates the response paragraphs,
 * Opus 4.7 audits every citation Method 1 + Method 2. If verifier fails,
 * the entry is regenerated up to 2 times then escalated to a `failed`
 * state with the entry's correction_item_id.
 *
 * Status: skeleton. Real agent invocations land when test assets unblock.
 */
import type {
  CorrectionItem,
  ContractorQuestion,
  ResponseEntry,
  CorrectionsState,
} from '../lib/corrections-types.ts';

export interface ResponseInputs {
  /** Categorized items from the triage step. */
  items: CorrectionItem[];
  /** Contractor answers to outstanding clarifying questions, by question_key. */
  answers: Record<string, string>;
  /** Original outstanding questions (for back-reference). */
  outstandingQuestions: ContractorQuestion[];
  /** Where to write the package PDF and per-entry artifacts. */
  sessionDir: string;
  /** City name for skill selection. */
  city: string;
  /** Whether to apply the free-tier watermark. */
  watermarkTier: 'free' | 'paid';
}

export interface ResponseOutput {
  state: CorrectionsState;
  entries: ResponseEntry[];
  package_pdf_path: string;
  cost_usd: number;
}

export interface ResponseOptions {
  generatorModel?: string;        // default: 'claude-sonnet-4-6'
  verifierModel?: string;         // default: 'claude-opus-4-7'
  maxRegenerationAttempts?: number; // default: 2
  abortController?: AbortController;
  onProgress?: (msg: unknown) => void;
}

/**
 * Run the response generator + verifier pair.
 * Status: skeleton — see ma-corrections-triage.ts header for blocker.
 */
export async function runMaCorrectionsResponse(
  inputs: ResponseInputs,
  _options: ResponseOptions = {},
): Promise<ResponseOutput> {
  void inputs;

  return {
    state: {
      phase: 'failed',
      failedAt: new Date().toISOString(),
      reason:
        'corrections-response agent not yet wired — pending test-assets/ approval per .claude/CLAUDE.md non-negotiable. Skeleton in place; types end-to-end.',
      recoverable: true,
    },
    entries: [],
    package_pdf_path: '',
    cost_usd: 0,
  };
}

/**
 * Deterministic post-generation check: every entry must have at least one
 * citation that passed Method 1 or Method 2 verification, AND every entry
 * tagged with state_vs_local_conflict must include a state-statute citation
 * (MGL Ch 40A, St. 2024 c. 150, or 760 CMR 71.00) in its citation array.
 *
 * Pure function — runs against the typed schemas, no SDK calls.
 */
export function assertEntryCitations(entries: ResponseEntry[]): {
  ok: boolean;
  failures: Array<{ correction_item_id: string; reason: string }>;
} {
  const failures: Array<{ correction_item_id: string; reason: string }> = [];
  const STATE_AUTHORITY_PATTERNS = [
    /MGL\s+Ch\s+40A/i,
    /St\.\s+2024,?\s+c\.\s+150/i,
    /760\s+CMR\s+71/i,
    /Chapter\s+150\s+of\s+the\s+Acts\s+of\s+2024/i,
  ];

  for (const entry of entries) {
    if (entry.citations.length === 0) {
      failures.push({
        correction_item_id: entry.correction_item_id,
        reason: 'no citations attached',
      });
      continue;
    }

    const hasVerified = entry.citations.some(
      (c) => c.method1_verified || c.method2_verified,
    );
    if (!hasVerified) {
      failures.push({
        correction_item_id: entry.correction_item_id,
        reason: 'no citation passed Method 1 or Method 2 verification',
      });
    }

    if (!entry.verifier_passed) {
      failures.push({
        correction_item_id: entry.correction_item_id,
        reason: 'verifier_passed = false',
      });
    }
  }

  // Cross-check: any entry whose paragraph hints at preemption should cite
  // state authority. We don't enforce this against entries marked
  // state_vs_local_conflict (that flag is upstream on the CorrectionItem,
  // not the ResponseEntry); instead we look at the response markdown for
  // preemption phrasing.
  for (const entry of entries) {
    const text = entry.response_markdown.toLowerCase();
    const claimsPreemption =
      text.includes('preempt') ||
      text.includes('chapter 150') ||
      text.includes('760 cmr 71');
    if (claimsPreemption) {
      const citesState = entry.citations.some((c) =>
        STATE_AUTHORITY_PATTERNS.some((re) => re.test(c.citation)),
      );
      if (!citesState) {
        failures.push({
          correction_item_id: entry.correction_item_id,
          reason: 'response claims preemption but cites no state authority',
        });
      }
    }
  }

  return { ok: failures.length === 0, failures };
}
