/**
 * Run: node --experimental-strip-types --test lib/verdict-token.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeVerdictToken, decodeVerdictToken } from './verdict-token.ts';
import type { EligibilityInput } from './eligibility.ts';

const sample: EligibilityInput = {
  address: '123 Main St, Boston, MA',
  lot_size_sqft: 5000,
  primary_dwelling_sqft: 1800,
  zoning_district: 'R1',
  proposed_adu_type: 'detached',
  proposed_adu_sqft: 750,
  within_half_mile_transit: true,
};

test('encode then decode round-trips inputs', () => {
  const token = encodeVerdictToken(sample);
  const decoded = decodeVerdictToken(token);
  assert.notEqual(decoded, null);
  assert.equal(decoded!.address, sample.address);
  assert.equal(decoded!.lot_size_sqft, sample.lot_size_sqft);
  assert.equal(decoded!.primary_dwelling_sqft, sample.primary_dwelling_sqft);
  assert.equal(decoded!.proposed_adu_type, sample.proposed_adu_type);
});

test('encode is deterministic for identical inputs', () => {
  assert.equal(encodeVerdictToken(sample), encodeVerdictToken(sample));
});

test('decode rejects tampered token', () => {
  const token = encodeVerdictToken(sample);
  // Flip a character in the payload portion.
  const [hash, payload] = token.split('.');
  const tampered = `${hash}.${payload.slice(0, -1)}A`;
  assert.equal(decodeVerdictToken(tampered), null);
});

test('decode rejects malformed token', () => {
  assert.equal(decodeVerdictToken('not-a-token'), null);
  assert.equal(decodeVerdictToken(''), null);
  assert.equal(decodeVerdictToken('only.one.part.too.many'), null);
});

test('decode rejects token missing required fields', () => {
  // Build a payload without the address field.
  const bad = encodeVerdictToken({
    address: '',
    lot_size_sqft: 5000,
    primary_dwelling_sqft: 1800,
  } as EligibilityInput);
  assert.equal(decodeVerdictToken(bad), null);
});

test('decode rejects token with non-positive lot size', () => {
  const bad = encodeVerdictToken({
    address: '123 Main St, Boston, MA',
    lot_size_sqft: 0,
    primary_dwelling_sqft: 1800,
  });
  assert.equal(decodeVerdictToken(bad), null);
});
