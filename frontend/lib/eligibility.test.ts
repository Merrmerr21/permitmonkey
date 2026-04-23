/**
 * Run with: node --experimental-strip-types --test lib/eligibility.test.ts
 * (from the frontend/ directory)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEligibility } from './eligibility.ts';

test('state cap clamps to 900 for large primary', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 3000,
  });
  assert.equal(r.max_adu_sqft, 900);
  assert.equal(r.city, 'Cambridge');
  assert.equal(r.city_covered, true);
});

test('state cap clamps to 50% for small primary', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 1400,
  });
  assert.equal(r.max_adu_sqft, 700);
});

test('transit flag zeroes parking', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
    within_half_mile_transit: true,
  });
  assert.equal(r.parking_required, 0);
  assert.ok(r.parking_exemption_reason);
});

test('uncovered city downgrades to needs_review', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Amherst, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  assert.equal(r.city_covered, false);
  assert.equal(r.verdict, 'needs_review');
});

test('oversized proposed ADU is not_eligible', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Boston, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 1600,
    proposed_adu_sqft: 900,
  });
  assert.equal(r.verdict, 'not_eligible');
});
