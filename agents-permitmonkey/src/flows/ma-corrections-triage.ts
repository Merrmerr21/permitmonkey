/**
 * Corrections Triage — Step 4 of the Phase 2 corrections flow.
 *
 * Consumes vision-extraction output (a list of raw correction items from the
 * plan-checker letter) and assigns each item a triage outcome:
 * `accept_and_respond` | `flag_conflict` | `request_clarification`.
 *
 * The CLAUDE.md non-negotiable says state-vs-local conflicts must be flagged
 * EXPLICITLY, not just identified by the model in prose. We enforce this by
 * having the triage subagent emit a typed `state_vs_local_conflict` boolean
 * per item; downstream the response generator gates on this flag.
 *
 * Status: skeleton. The actual agent invocation lands when test assets
 * unblock per the CLAUDE.md non-negotiable on `test-assets/`. Until then,
 * `runMaCorrectionsTriage` returns a structured not-implemented error that
 * the eval harness can read.
 */
import type {
  CorrectionItem,
  ContractorQuestion,
  CorrectionsState,
} from '../lib/corrections-types.ts';

export interface TriageInputs {
  /** Path to the corrections-letter PDF or extracted JSON. */
  correctionsLetterPath: string;
  /** Path to the plan binder PDF. */
  planBinderPath: string;
  /** City name. The triage prompt selects the right city skill from this. */
  city: string;
  /** Where to write artifacts (corrections_categorized.json, contractor_questions.json). */
  sessionDir: string;
}

export interface TriageOutput {
  state: CorrectionsState;
  items: CorrectionItem[];
  outstanding_questions: ContractorQuestion[];
  state_vs_local_conflicts: number; // count, for monitoring
}

export interface TriageOptions {
  /** Override the model; defaults to Sonnet for cost. */
  model?: string;
  /** Used by the eval harness for deterministic re-runs. */
  abortController?: AbortController;
  onProgress?: (msg: unknown) => void;
}

/**
 * Run the triage subagent. Status: skeleton — returns a `failed` state with
 * a structured reason until test assets unblock.
 */
export async function runMaCorrectionsTriage(
  inputs: TriageInputs,
  _options: TriageOptions = {},
): Promise<TriageOutput> {
  // The actual agent run requires:
  //   - ANTHROPIC_API_KEY in the environment
  //   - A real corrections-letter PDF at inputs.correctionsLetterPath
  //   - A real plan-binder PDF at inputs.planBinderPath
  //   - The adu-corrections-flow skill loaded
  //
  // Until the user approves test-assets/ population (CLAUDE.md
  // non-negotiable), we return a structured not-implemented state so the
  // eval harness can score the failure cleanly rather than on a thrown
  // error.
  void inputs;

  return {
    state: {
      phase: 'failed',
      failedAt: new Date().toISOString(),
      reason:
        'corrections-triage agent not yet wired — pending test-assets/ approval per .claude/CLAUDE.md non-negotiable. Skeleton in place; types end-to-end.',
      recoverable: true,
    },
    items: [],
    outstanding_questions: [],
    state_vs_local_conflicts: 0,
  };
}

/**
 * Deterministic check that the CLAUDE.md non-negotiable is upheld: every
 * item that touches a USE-vs-FORM state-preemption topic must have
 * `state_vs_local_conflict = true`. This runs after the triage agent emits
 * its structured output, before the response generator runs.
 *
 * Pure function for unit testing — no SDK calls.
 */
export function assertConflictsFlagged(items: CorrectionItem[]): {
  ok: boolean;
  unflagged: CorrectionItem[];
} {
  const PREEMPTION_TOPICS = [
    'owner-occupancy',
    'owner occupancy',
    'special permit',
    'family-only',
    'family only',
    'parking near MBTA',
    'parking near transit',
  ];

  const unflagged: CorrectionItem[] = [];
  for (const item of items) {
    const text = item.raw_text.toLowerCase();
    const looksPreempted = PREEMPTION_TOPICS.some((t) => text.includes(t.toLowerCase()));
    if (looksPreempted && !item.state_vs_local_conflict) {
      unflagged.push(item);
    }
  }

  return { ok: unflagged.length === 0, unflagged };
}
