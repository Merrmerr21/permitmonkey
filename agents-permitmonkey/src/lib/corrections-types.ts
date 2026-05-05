/**
 * Corrections Letter Interpreter — shared type substrate.
 *
 * The end-to-end flow runs as a state machine:
 *
 *   intake → vision_extraction → triage → response_generation → packaging → delivery
 *
 * Each phase is gated on the previous one's success; a state transition that
 * fails surfaces a structured error rather than silently dropping the job.
 *
 * `flows/corrections-analysis.ts` covers `intake → triage` (it produces
 * categorized items + contractor questions). `flows/corrections-response.ts`
 * covers `response_generation → packaging`. `cli.ts` is the dispatcher.
 *
 * This file is the single source of truth for the schemas crossing between
 * those flow files and the eval harness; do not redeclare these shapes.
 */

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

export type CorrectionsState =
  | { phase: 'intake'; receivedAt: string }
  | { phase: 'vision_extraction'; startedAt: string }
  | { phase: 'triage'; startedAt: string }
  | { phase: 'awaiting_contractor_answers'; questionCount: number; sentAt: string }
  | { phase: 'response_generation'; startedAt: string; answersReceivedAt: string }
  | { phase: 'packaging'; startedAt: string }
  | { phase: 'delivered'; deliveredAt: string; signedUrl: string }
  | { phase: 'failed'; failedAt: string; reason: string; recoverable: boolean };

export type CorrectionsPhase = CorrectionsState['phase'];

export const TERMINAL_PHASES: ReadonlyArray<CorrectionsPhase> = ['delivered', 'failed'] as const;

export function isTerminal(state: CorrectionsState): boolean {
  return TERMINAL_PHASES.includes(state.phase);
}

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

/** One row from the plan checker's corrections letter, after triage. */
export interface CorrectionItem {
  id: string;                     // stable id assigned during triage
  raw_text: string;               // verbatim from the corrections letter
  category: CorrectionCategory;
  severity: 'info' | 'minor' | 'major' | 'blocker';
  referenced_sheet?: string;      // e.g. 'A-101', 'S-201'
  triage_outcome: TriageOutcome;
  state_vs_local_conflict: boolean; // CLAUDE.md non-negotiable: must be flagged explicitly
}

export type CorrectionCategory =
  | 'zoning'
  | 'dimensional'
  | 'structural'
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'energy'
  | 'fire'
  | 'accessibility'
  | 'fee'
  | 'documentation'
  | 'other';

export type TriageOutcome =
  | { kind: 'accept_and_respond' }
  | { kind: 'flag_conflict'; explanation: string; state_authority: string; local_authority: string }
  | { kind: 'request_clarification'; questions: ContractorQuestion[] };

/** A clarifying question posed back to the contractor before response generation. */
export interface ContractorQuestion {
  question_key: string;           // stable key for re-association after answer
  question_text: string;
  question_type: 'text' | 'number' | 'choice' | 'measurement';
  options?: string[];             // only for question_type === 'choice'
  context?: string;               // why we're asking, for the contractor
  correction_item_id: string;     // back-reference to CorrectionItem.id
}

/** A response paragraph generated for a single CorrectionItem. */
export interface ResponseEntry {
  correction_item_id: string;
  response_markdown: string;
  citations: ResponseCitation[];
  generator_model: string;        // e.g. 'claude-sonnet-4-6'
  verifier_model: string;         // e.g. 'claude-opus-4-7'
  verifier_passed: boolean;       // false ⇒ entry must be regenerated or escalated
}

/** A single citation inside a ResponseEntry, in the canonical inline-tag format. */
export interface ResponseCitation {
  source_url: string;
  retrieved: string;              // ISO date 'YYYY-MM-DD'
  citation: string;               // e.g. 'MGL Ch 40A §3', '760 CMR 71.04(2)(b)'
  raw_tag: string;                // verbatim '[source: ... | retrieved: ... | citation: ...]'
  method1_verified: boolean;      // skill reference walk
  method2_verified: boolean;      // canonical URL fetch
}

// ---------------------------------------------------------------------------
// Flow inputs and outputs
// ---------------------------------------------------------------------------

/** Inputs for the full corrections flow (Phase 2 of the master plan). */
export interface CorrectionsFlowInputs {
  projectId: string;
  userId: string;
  city: string;
  planBinderPath: string;         // local sandbox path or signed URL
  correctionsLetterPath: string;
}

/** Outputs from the analysis phase, before contractor answers are collected. */
export interface CorrectionsAnalysisOutput {
  state: CorrectionsState;
  items: CorrectionItem[];
  outstanding_questions: ContractorQuestion[];
  artifacts: {
    corrections_parsed_path: string;
    sheet_manifest_path: string;
    state_law_findings_path: string;
    city_research_findings_path: string;
    sheet_observations_path: string;
    corrections_categorized_path: string;
    contractor_questions_path: string;
  };
}

/** Outputs from the response phase, after contractor answers are folded in. */
export interface CorrectionsResponseOutput {
  state: CorrectionsState;
  entries: ResponseEntry[];
  package_pdf_path: string;
  watermark_tier: 'free' | 'paid';
  delivery_signed_url?: string;
  cost_usd: number;
  duration_ms: number;
}

// ---------------------------------------------------------------------------
// Phase transition guard
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<CorrectionsPhase, CorrectionsPhase[]> = {
  intake: ['vision_extraction', 'failed'],
  vision_extraction: ['triage', 'failed'],
  triage: ['awaiting_contractor_answers', 'response_generation', 'failed'],
  awaiting_contractor_answers: ['response_generation', 'failed'],
  response_generation: ['packaging', 'failed'],
  packaging: ['delivered', 'failed'],
  delivered: [],
  failed: [],
};

export function canTransition(from: CorrectionsPhase, to: CorrectionsPhase): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}
