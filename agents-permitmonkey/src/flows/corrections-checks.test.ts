/**
 * Run with: node --experimental-strip-types --test src/flows/corrections-checks.test.ts
 *
 * Tests the pure deterministic checks in the Phase 2 corrections flow:
 *   - assertConflictsFlagged (from ma-corrections-triage.ts)
 *   - assertEntryCitations  (from ma-corrections-response.ts)
 *
 * These functions enforce the CLAUDE.md non-negotiables (state-vs-local
 * conflict flagging, audit-grade citations) deterministically — they run
 * after the LLM emits structured output and gate downstream steps.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertConflictsFlagged } from './ma-corrections-triage.ts';
import { assertEntryCitations } from './ma-corrections-response.ts';
import type {
  CorrectionItem,
  ResponseEntry,
} from '../lib/corrections-types.ts';

function item(overrides: Partial<CorrectionItem> = {}): CorrectionItem {
  return {
    id: 'item-1',
    raw_text: 'Provide one off-street parking space for the new ADU.',
    category: 'zoning',
    severity: 'major',
    triage_outcome: { kind: 'accept_and_respond' },
    state_vs_local_conflict: false,
    ...overrides,
  };
}

test('assertConflictsFlagged passes when no preemption topics appear', () => {
  const items: CorrectionItem[] = [
    item({ raw_text: 'Side setback shown as 4 feet; minimum is 5 feet.' }),
    item({ id: 'item-2', raw_text: 'Provide foundation drawings for ADU.' }),
  ];
  const result = assertConflictsFlagged(items);
  assert.equal(result.ok, true);
  assert.equal(result.unflagged.length, 0);
});

test('assertConflictsFlagged passes when preempted items are correctly flagged', () => {
  const items: CorrectionItem[] = [
    item({
      raw_text: 'Owner-occupancy required for ADU permit.',
      state_vs_local_conflict: true,
    }),
    item({
      id: 'item-2',
      raw_text: 'Special permit required from Zoning Board.',
      state_vs_local_conflict: true,
    }),
  ];
  const result = assertConflictsFlagged(items);
  assert.equal(result.ok, true);
  assert.equal(result.unflagged.length, 0);
});

test('assertConflictsFlagged catches an unflagged owner-occupancy item', () => {
  const items: CorrectionItem[] = [
    item({
      raw_text: 'Owner occupancy required for ADU permit.',
      state_vs_local_conflict: false,
    }),
  ];
  const result = assertConflictsFlagged(items);
  assert.equal(result.ok, false);
  assert.equal(result.unflagged.length, 1);
  assert.equal(result.unflagged[0].id, 'item-1');
});

test('assertConflictsFlagged catches an unflagged family-only restriction', () => {
  const items: CorrectionItem[] = [
    item({
      raw_text: 'ADU may only be occupied by family-only members.',
      state_vs_local_conflict: false,
    }),
  ];
  const result = assertConflictsFlagged(items);
  assert.equal(result.ok, false);
  assert.equal(result.unflagged.length, 1);
});

test('assertConflictsFlagged is case-insensitive', () => {
  const items: CorrectionItem[] = [
    item({
      raw_text: 'OWNER OCCUPANCY required.',
      state_vs_local_conflict: false,
    }),
  ];
  const result = assertConflictsFlagged(items);
  assert.equal(result.ok, false);
});

function entry(overrides: Partial<ResponseEntry> = {}): ResponseEntry {
  return {
    correction_item_id: 'item-1',
    response_markdown: 'Plans revised to comply with the requested setback.',
    citations: [
      {
        source_url: 'https://example.com/code',
        retrieved: '2026-05-05',
        citation: 'Local Code §10',
        raw_tag: '[source: ... | retrieved: ... | citation: ...]',
        method1_verified: true,
        method2_verified: false,
      },
    ],
    generator_model: 'claude-sonnet-4-6',
    verifier_model: 'claude-opus-4-7',
    verifier_passed: true,
    ...overrides,
  };
}

test('assertEntryCitations passes a clean entry', () => {
  const result = assertEntryCitations([entry()]);
  assert.equal(result.ok, true);
  assert.equal(result.failures.length, 0);
});

test('assertEntryCitations fails an entry with no citations', () => {
  const result = assertEntryCitations([entry({ citations: [] })]);
  assert.equal(result.ok, false);
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0].reason, /no citations/);
});

test('assertEntryCitations fails an entry whose citations didnt verify', () => {
  const result = assertEntryCitations([
    entry({
      citations: [
        {
          source_url: 'https://example.com/code',
          retrieved: '2026-05-05',
          citation: 'Local Code §10',
          raw_tag: '[source: ... | retrieved: ... | citation: ...]',
          method1_verified: false,
          method2_verified: false,
        },
      ],
    }),
  ]);
  assert.equal(result.ok, false);
  assert.match(result.failures[0].reason, /no citation passed/);
});

test('assertEntryCitations fails an entry where verifier_passed is false', () => {
  const result = assertEntryCitations([entry({ verifier_passed: false })]);
  assert.equal(result.ok, false);
  assert.match(result.failures.find((f) => f.reason.includes('verifier_passed'))!.reason, /verifier_passed/);
});

test('assertEntryCitations fails preemption-claiming entries that lack state authority', () => {
  const result = assertEntryCitations([
    entry({
      response_markdown:
        'This requirement is preempted by Chapter 150 of the Acts of 2024.',
      citations: [
        {
          source_url: 'https://example.com/random',
          retrieved: '2026-05-05',
          citation: 'Some Local Bylaw §3',
          raw_tag: '[source: ... | retrieved: ... | citation: ...]',
          method1_verified: true,
          method2_verified: false,
        },
      ],
    }),
  ]);
  assert.equal(result.ok, false);
  assert.match(
    result.failures.find((f) => f.reason.includes('preemption'))!.reason,
    /no state authority/,
  );
});

test('assertEntryCitations passes preemption-claiming entries that cite MGL Ch 40A', () => {
  const result = assertEntryCitations([
    entry({
      response_markdown:
        'This requirement is preempted by Chapter 150 of the Acts of 2024.',
      citations: [
        {
          source_url: 'https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150',
          retrieved: '2026-05-05',
          citation: 'St. 2024, c. 150, §7 amending MGL Ch 40A §3',
          raw_tag: '[source: ... | retrieved: ... | citation: ...]',
          method1_verified: true,
          method2_verified: true,
        },
      ],
    }),
  ]);
  assert.equal(result.ok, true);
});

test('assertEntryCitations recognizes 760 CMR 71 as state authority', () => {
  const result = assertEntryCitations([
    entry({
      response_markdown:
        'Under 760 CMR 71.04, this provision is preempted.',
      citations: [
        {
          source_url: 'https://www.mass.gov/regulations/760-CMR-7100',
          retrieved: '2026-05-05',
          citation: '760 CMR 71.04',
          raw_tag: '[source: ... | retrieved: ... | citation: ...]',
          method1_verified: true,
          method2_verified: false,
        },
      ],
    }),
  ]);
  assert.equal(result.ok, true);
});
