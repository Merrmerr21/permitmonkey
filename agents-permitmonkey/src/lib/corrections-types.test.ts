/**
 * Run with: node --experimental-strip-types --test src/lib/corrections-types.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isTerminal,
  canTransition,
  TERMINAL_PHASES,
  type CorrectionsState,
} from './corrections-types.ts';

test('TERMINAL_PHASES includes delivered and failed', () => {
  assert.ok(TERMINAL_PHASES.includes('delivered'));
  assert.ok(TERMINAL_PHASES.includes('failed'));
  assert.equal(TERMINAL_PHASES.length, 2);
});

test('isTerminal returns true for delivered state', () => {
  const state: CorrectionsState = {
    phase: 'delivered',
    deliveredAt: '2026-05-05T10:00:00Z',
    signedUrl: 'https://example.com/x',
  };
  assert.equal(isTerminal(state), true);
});

test('isTerminal returns true for failed state', () => {
  const state: CorrectionsState = {
    phase: 'failed',
    failedAt: '2026-05-05T10:00:00Z',
    reason: 'vision extraction returned no items',
    recoverable: false,
  };
  assert.equal(isTerminal(state), true);
});

test('isTerminal returns false for in-flight states', () => {
  const inFlight: CorrectionsState[] = [
    { phase: 'intake', receivedAt: '2026-05-05T10:00:00Z' },
    { phase: 'vision_extraction', startedAt: '2026-05-05T10:01:00Z' },
    { phase: 'triage', startedAt: '2026-05-05T10:02:00Z' },
    {
      phase: 'awaiting_contractor_answers',
      questionCount: 3,
      sentAt: '2026-05-05T10:03:00Z',
    },
    {
      phase: 'response_generation',
      startedAt: '2026-05-05T10:10:00Z',
      answersReceivedAt: '2026-05-05T10:09:00Z',
    },
    { phase: 'packaging', startedAt: '2026-05-05T10:15:00Z' },
  ];
  for (const state of inFlight) {
    assert.equal(isTerminal(state), false, `expected ${state.phase} to be non-terminal`);
  }
});

test('canTransition allows the happy path', () => {
  assert.equal(canTransition('intake', 'vision_extraction'), true);
  assert.equal(canTransition('vision_extraction', 'triage'), true);
  assert.equal(canTransition('triage', 'awaiting_contractor_answers'), true);
  assert.equal(canTransition('awaiting_contractor_answers', 'response_generation'), true);
  assert.equal(canTransition('response_generation', 'packaging'), true);
  assert.equal(canTransition('packaging', 'delivered'), true);
});

test('canTransition allows triage to skip questions when none are needed', () => {
  // If every correction item is accept_and_respond, no contractor input required.
  assert.equal(canTransition('triage', 'response_generation'), true);
});

test('canTransition allows failure from any non-terminal phase', () => {
  const nonTerminalPhases: CorrectionsState['phase'][] = [
    'intake',
    'vision_extraction',
    'triage',
    'awaiting_contractor_answers',
    'response_generation',
    'packaging',
  ];
  for (const phase of nonTerminalPhases) {
    assert.equal(canTransition(phase, 'failed'), true, `${phase} → failed should be allowed`);
  }
});

test('canTransition rejects terminal-state exits', () => {
  // Once delivered or failed, the job is done. No transitions out.
  assert.equal(canTransition('delivered', 'response_generation'), false);
  assert.equal(canTransition('delivered', 'failed'), false);
  assert.equal(canTransition('failed', 'response_generation'), false);
  assert.equal(canTransition('failed', 'delivered'), false);
});

test('canTransition rejects out-of-order transitions', () => {
  // Cannot skip vision_extraction.
  assert.equal(canTransition('intake', 'triage'), false);
  // Cannot go backwards.
  assert.equal(canTransition('triage', 'intake'), false);
  assert.equal(canTransition('packaging', 'response_generation'), false);
  // Cannot deliver without packaging.
  assert.equal(canTransition('response_generation', 'delivered'), false);
});

test('canTransition rejects skipping packaging', () => {
  // The watermark + signed URL only exist after packaging; jumping to delivered
  // would mean shipping a package that was never actually compiled.
  assert.equal(canTransition('response_generation', 'delivered'), false);
});
