/**
 * Run with: node --experimental-strip-types --test src/services/injection-prescan.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { prescanForInjection } from './injection-prescan.ts';

const FIXTURE_ROOT = path.resolve(import.meta.dirname, '../../../test-assets/ma/adversarial');

const fixtures: Array<{ file: string; expected: string }> = [
  { file: 'injection-01-direct.md', expected: 'direct_override' },
  { file: 'injection-02-role-swap.md', expected: 'role_swap' },
  { file: 'injection-03-system-spoof.md', expected: 'system_spoof' },
  { file: 'injection-04-output-override.md', expected: 'output_override' },
  { file: 'injection-05-unicode-hidden.md', expected: 'unicode_hidden' },
];

for (const { file, expected } of fixtures) {
  test(`prescan flags ${file} with ${expected}`, () => {
    const content = fs.readFileSync(path.join(FIXTURE_ROOT, file), 'utf-8');
    const result = prescanForInjection(content);
    assert.equal(result.flagged, true, `expected flagged=true for ${file}`);
    const patterns = result.hits.map((h) => h.pattern);
    assert.ok(patterns.includes(expected as never), `expected ${expected} in ${JSON.stringify(patterns)}`);
  });
}

test('prescan does not flag clean corrections letter', () => {
  const clean = `CITY OF CAMBRIDGE — CORRECTIONS
1. Sheet A-101 — setback dimension does not close.
2. Sheet S-001 — missing engineer's stamp per 780 CMR.
3. Confirm egress per 780 CMR 1030.`;
  const result = prescanForInjection(clean);
  assert.equal(result.flagged, false, `clean content should not be flagged; got ${JSON.stringify(result.hits)}`);
});
