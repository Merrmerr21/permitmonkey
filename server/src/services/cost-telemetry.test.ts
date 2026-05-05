/**
 * Run with: node --experimental-strip-types --test src/services/cost-telemetry.test.ts
 *
 * Tests target the pure pricing helper in cost-pricing.ts so we don't have
 * to resolve Supabase imports under --experimental-strip-types.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateCostUsd } from './cost-pricing.ts';

test('estimateCostUsd Opus pricing', () => {
  // 1M input + 1M output Opus = $15 + $75 = $90.
  const cost = estimateCostUsd({
    modelUsed: 'claude-opus-4-7',
    inputTokens: 1_000_000,
    outputTokens: 1_000_000,
  });
  assert.equal(cost, 90);
});

test('estimateCostUsd Sonnet pricing', () => {
  // 1M input + 1M output Sonnet = $3 + $15 = $18.
  const cost = estimateCostUsd({
    modelUsed: 'claude-sonnet-4-6',
    inputTokens: 1_000_000,
    outputTokens: 1_000_000,
  });
  assert.equal(cost, 18);
});

test('estimateCostUsd Haiku pricing', () => {
  // 1M input + 1M output Haiku = $1 + $5 = $6.
  const cost = estimateCostUsd({
    modelUsed: 'claude-haiku-4-5',
    inputTokens: 1_000_000,
    outputTokens: 1_000_000,
  });
  assert.equal(cost, 6);
});

test('estimateCostUsd cache reads are discounted', () => {
  // 1M cache read Opus = $1.50 (10x discount vs fresh input at $15).
  const cost = estimateCostUsd({
    modelUsed: 'claude-opus-4-7',
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 1_000_000,
  });
  assert.equal(cost, 1.5);
});

test('estimateCostUsd cache writes are premium-priced', () => {
  // 1M cache write Opus = $18.75 (1.25x of fresh input).
  const cost = estimateCostUsd({
    modelUsed: 'claude-opus-4-7',
    inputTokens: 0,
    outputTokens: 0,
    cacheWriteTokens: 1_000_000,
  });
  assert.equal(cost, 18.75);
});

test('estimateCostUsd unknown model falls back to Sonnet rates', () => {
  // Forward-compatibility: a future model id should not throw.
  const cost = estimateCostUsd({
    modelUsed: 'claude-some-future-model',
    inputTokens: 1_000_000,
    outputTokens: 0,
  });
  // Sonnet input rate = $3 per 1M tokens.
  assert.equal(cost, 3);
});

test('estimateCostUsd realistic eligibility-check run', () => {
  // ~5K input (skill content) + 800 output (verdict + citations) on Sonnet.
  const cost = estimateCostUsd({
    modelUsed: 'claude-sonnet-4-6',
    inputTokens: 5_000,
    outputTokens: 800,
  });
  // 5000 * 3 / 1M + 800 * 15 / 1M = 0.015 + 0.012 = $0.027
  assert.equal(cost, 0.027);
});

test('estimateCostUsd realistic Generator-Verifier eligibility run', () => {
  // Sonnet generator: ~5K input + 800 output. Opus verifier: ~6K input + 400 output.
  // Combined cost in one estimate (caller would record two rows in practice).
  const sonnetCost = estimateCostUsd({
    modelUsed: 'claude-sonnet-4-6',
    inputTokens: 5_000,
    outputTokens: 800,
  });
  const opusCost = estimateCostUsd({
    modelUsed: 'claude-opus-4-7',
    inputTokens: 6_000,
    outputTokens: 400,
  });
  // Sonnet: 0.027. Opus: 6000*15/1M + 400*75/1M = 0.090 + 0.030 = 0.12.
  assert.equal(sonnetCost, 0.027);
  assert.equal(opusCost, 0.12);
  // Combined $0.147 — well below the $0.50-2.00 budget per the eligibility
  // smoke-test header.
});

test('estimateCostUsd zero tokens returns zero', () => {
  const cost = estimateCostUsd({
    modelUsed: 'claude-opus-4-7',
    inputTokens: 0,
    outputTokens: 0,
  });
  assert.equal(cost, 0);
});

test('estimateCostUsd rounds to 4 decimal places', () => {
  // Construct an input that would otherwise produce more decimals.
  const cost = estimateCostUsd({
    modelUsed: 'claude-haiku-4-5',
    inputTokens: 333,
    outputTokens: 0,
  });
  // 333 * 1 / 1M = 0.000333. Rounded to 4 decimals = 0.0003.
  assert.equal(cost, 0.0003);
});
