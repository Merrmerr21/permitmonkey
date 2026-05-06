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

test('primary below 400 sqft is not_eligible', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 350,
  });
  assert.equal(r.verdict, 'not_eligible');
});

test('lot below 3000 sqft downgrades a covered-city result to needs_review', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 2500,
    primary_dwelling_sqft: 1800,
  });
  assert.equal(r.verdict, 'needs_review');
});

test('historic district flag downgrades when city has historic overlay', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Boston, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
    in_historic_district: true,
  });
  assert.equal(r.verdict, 'needs_review');
  assert.equal(r.overlay_flags.historic, 'yes');
});

test('overlay_flags.historic is "possible" for covered city without explicit flag', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Newton, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  assert.equal(r.overlay_flags.historic, 'possible');
});

test('parking_exemption_reason is null when not within transit radius', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Boston, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  assert.equal(r.parking_required, 1);
  assert.equal(r.parking_exemption_reason, null);
});

test('all five covered city profiles resolve correctly', () => {
  const cases: Array<[string, string]> = [
    ['10 Main St, Boston, MA', 'Boston'],
    ['10 Main St, Cambridge, MA', 'Cambridge'],
    ['10 Main St, Somerville, MA', 'Somerville'],
    ['10 Main St, Newton, MA', 'Newton'],
    ['10 Main St, Brookline, MA', 'Brookline'],
  ];
  for (const [address, expected] of cases) {
    const r = evaluateEligibility({
      address,
      lot_size_sqft: 8000,
      primary_dwelling_sqft: 2000,
    });
    assert.equal(r.city, expected, `expected city ${expected} for ${address}`);
    assert.equal(r.city_covered, true);
    assert.equal(r.overlay_flags.specialized_code, 'yes');
    assert.ok(r.city_gotchas.length >= 3, `${expected} should expose >=3 gotchas`);
  }
});

test('citations always include MGL Ch 40A §3 and 760 CMR 71.00', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  const authorities = r.citations.map((c) => c.authority);
  assert.ok(authorities.some((a) => a.includes('MGL Ch 40A')));
  assert.ok(authorities.some((a) => a.includes('760 CMR 71.00')));
  for (const c of r.citations) {
    assert.ok(c.source_url.startsWith('https://'), `${c.authority} must have https source`);
  }
});

test('verdict_summary references max_adu_sqft on likely_eligible path', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Cambridge, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  assert.equal(r.verdict, 'likely_eligible');
  assert.match(r.verdict_summary, new RegExp(String(r.max_adu_sqft)));
});

test('uncovered city falls back to generic gotcha and unknown specialized code', () => {
  const r = evaluateEligibility({
    address: '10 Main St, Amherst, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  assert.equal(r.city_covered, false);
  assert.equal(r.overlay_flags.specialized_code, 'unknown');
  assert.equal(r.city_gotchas.length, 1);
  assert.match(r.city_gotchas[0], /not fully researched/);
});

test('case-insensitive city parsing', () => {
  const r = evaluateEligibility({
    address: '10 MAIN ST, BOSTON, MA',
    lot_size_sqft: 8000,
    primary_dwelling_sqft: 2000,
  });
  assert.equal(r.city, 'Boston');
  assert.equal(r.city_covered, true);
});
