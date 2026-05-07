/**
 * Cache-prefix invariants per master playbook §217.
 *
 * The Anthropic API caches tokens from the start of the request up to each
 * cache_control breakpoint. Any byte-level change in the prefix invalidates
 * everything after it. For PermitMonkey's agent runs, three things must be
 * stable across runs of the same input:
 *
 * 1. The static system prompt (no Date.now(), no env interpolation, no
 *    random seeds).
 * 2. The DEFAULT_TOOLS list in deterministic order.
 * 3. The createQueryOptions output for a given FlowConfig — same model,
 *    same tools, same systemPromptAppend → same options object.
 *
 * Run with:
 *   node --experimental-strip-types --test src/utils/config.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createQueryOptions, DEFAULT_TOOLS } from './config.ts';

test('DEFAULT_TOOLS order is deterministic', () => {
  const expected = [
    'Skill', 'Task', 'Read', 'Write', 'Edit',
    'Bash', 'Glob', 'Grep', 'WebSearch', 'WebFetch',
  ];
  assert.deepEqual(DEFAULT_TOOLS, expected);
});

test('createQueryOptions produces identical systemPrompt across calls', () => {
  const a = createQueryOptions({ model: 'claude-sonnet-4-6' });
  const b = createQueryOptions({ model: 'claude-sonnet-4-6' });
  assert.deepEqual(a.systemPrompt, b.systemPrompt);
});

test('createQueryOptions produces identical allowedTools across calls', () => {
  const a = createQueryOptions({ model: 'claude-sonnet-4-6' });
  const b = createQueryOptions({ model: 'claude-sonnet-4-6' });
  assert.deepEqual(a.allowedTools, b.allowedTools);
});

test('system prompt contains no Date.now() interpolation', () => {
  const opts = createQueryOptions();
  const append = opts.systemPrompt.append;
  assert.equal(typeof append, 'string');
  // No four-digit year that drifts (we hardcode "2024" once for Ch 150).
  // No millisecond-precision timestamps.
  assert.equal(/\b\d{13}\b/.test(append), false, 'no ms timestamps');
  assert.equal(/T\d{2}:\d{2}:\d{2}/.test(append), false, 'no ISO timestamps');
});

test('system prompt does not embed process.env values', () => {
  const opts = createQueryOptions();
  const append = opts.systemPrompt.append;
  // Common env-var leaks that would break cache across deployments.
  assert.equal(append.includes(process.cwd()), false);
  if (process.env.USER) {
    assert.equal(append.includes(process.env.USER), false);
  }
});

test('createQueryOptions returns same model when not overridden', () => {
  const a = createQueryOptions({});
  const b = createQueryOptions({});
  assert.equal(a.model, b.model);
});

test('preset references match for tools and systemPrompt', () => {
  const opts = createQueryOptions();
  assert.equal(opts.tools.type, 'preset');
  assert.equal(opts.tools.preset, 'claude_code');
  assert.equal(opts.systemPrompt.type, 'preset');
  assert.equal(opts.systemPrompt.preset, 'claude_code');
});
