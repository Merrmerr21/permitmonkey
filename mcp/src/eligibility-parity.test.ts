/**
 * Parity test — asserts the MCP server's eligibility logic produces
 * byte-equivalent output to the frontend's authoritative copy at
 * frontend/lib/eligibility.ts. The duplication is deliberate (per
 * eligibility.ts header) but drift is a launch-blocker — a contractor
 * who runs the check via the claude.ai/directory MCP must see the same
 * verdict as one who hits the website.
 *
 * If this test fails, the two copies have drifted. Reconcile both before
 * shipping any change.
 *
 * Run: node --experimental-strip-types --test src/eligibility-parity.test.ts
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateEligibility, type EligibilityInput } from './eligibility.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ELIGIBILITY = path.resolve(HERE, '..', '..', 'frontend', 'lib', 'eligibility.ts');

// Dynamic import via file URL because the frontend uses TypeScript ESM.
async function loadFrontendImpl() {
  const mod = await import(`file://${FRONTEND_ELIGIBILITY.replace(/\\/g, '/')}`);
  return mod.evaluateEligibility as (input: EligibilityInput) => unknown;
}

const FIXTURES: EligibilityInput[] = [
  {
    address: '123 Main St, Boston, MA',
    lot_size_sqft: 5000,
    primary_dwelling_sqft: 1800,
    proposed_adu_type: 'detached',
    proposed_adu_sqft: 750,
    within_half_mile_transit: true,
  },
  {
    address: '456 Brattle St, Cambridge, MA 02138',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2400,
    proposed_adu_type: 'attached',
    within_half_mile_transit: false,
    in_historic_district: true,
  },
  {
    address: '789 Highland Ave, Somerville, MA',
    lot_size_sqft: 4200,
    primary_dwelling_sqft: 1500,
    within_half_mile_transit: true,
  },
  {
    address: '12 Centre St, Newton, MA',
    lot_size_sqft: 12000,
    primary_dwelling_sqft: 3200,
    proposed_adu_sqft: 950,  // exceeds 900 cap
  },
  {
    address: '88 Beacon St, Brookline, MA',
    lot_size_sqft: 2800,  // small lot
    primary_dwelling_sqft: 1200,
  },
  {
    address: '5 Worcester Ln, Worcester, MA',  // not-covered city
    lot_size_sqft: 6000,
    primary_dwelling_sqft: 2000,
  },
];

test('frontend eligibility module loads', async () => {
  const fn = await loadFrontendImpl();
  assert.equal(typeof fn, 'function');
});

for (const [i, fx] of FIXTURES.entries()) {
  test(`mcp output matches frontend output — fixture ${i + 1} (${fx.address})`, async () => {
    const frontendImpl = await loadFrontendImpl();
    const mcpOutput = evaluateEligibility(fx);
    const frontendOutput = frontendImpl(fx);
    assert.deepStrictEqual(mcpOutput, frontendOutput);
  });
}
