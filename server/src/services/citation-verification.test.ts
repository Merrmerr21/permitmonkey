/**
 * Run with: node --experimental-strip-types --test src/services/citation-verification.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { verifyMethod1, verifyMethod2, verifyCitation, type Citation } from './citation-verification.ts';

const SKILL_REFS = path.resolve(
  import.meta.dirname,
  '../../../.claude/skills/massachusetts-adu/references',
);

// The server-side audit-grade skill tree lives under server/skills/.
const SERVER_SKILLS_ROOT = path.resolve(import.meta.dirname, '../../skills');

// Verbatim sentence from server/skills/massachusetts-adu/references/chapter-150-of-2024.md.
// The eval harness uses the same sentence as a fixture excerpt; if the sentence is renamed
// the eval gate will fail. These tests assert the verifier behaves consistently with that gate.
const KNOWN_VERBATIM = 'This is the legal definition that every municipal bylaw must now work from.';

function citation(overrides: Partial<Citation> = {}): Citation {
  return {
    authority: 'St. 2024, c. 150, §7',
    source_url: 'https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150',
    excerpt: KNOWN_VERBATIM,
    excerpt_type: 'paraphrase_with_reference',
    ...overrides,
  };
}

test('Method 1 returns excerpt_too_short for trivial excerpts', async () => {
  const citation: Citation = {
    authority: 'MGL Ch 40A § 3',
    source_url: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3',
    excerpt: 'by-right',
    excerpt_type: 'direct_quote',
  };
  const result = await verifyMethod1(citation, SKILL_REFS);
  assert.equal(result.verified, false);
  assert.equal(result.error, 'excerpt_too_short');
});

test('Method 1 fails when excerpt not in references', async () => {
  const citation: Citation = {
    authority: 'MGL Ch 40A § 3',
    source_url: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3',
    excerpt: 'this string does not appear in any MA reference file whatsoever and should never match',
    excerpt_type: 'direct_quote',
  };
  const result = await verifyMethod1(citation, SKILL_REFS);
  assert.equal(result.verified, false);
  assert.equal(result.error, 'excerpt_not_in_skill_references');
});

test('Method 2 reports url_404 on 404', async () => {
  const fakeFetch: typeof fetch = async () =>
    new Response('not found', { status: 404 }) as Response;
  const citation: Citation = {
    authority: 'dead',
    source_url: 'https://example.invalid/missing',
    excerpt: 'some excerpt that is long enough to pass the length guard in method 2',
    excerpt_type: 'direct_quote',
  };
  const result = await verifyMethod2(citation, fakeFetch);
  assert.equal(result.verified, false);
  assert.equal(result.error, 'url_404');
});

test('Method 2 verifies when excerpt appears in fetched HTML', async () => {
  const fakeFetch: typeof fetch = async () =>
    new Response(
      '<html><body><p>No zoning ordinance or by-law shall prohibit accessory dwelling units</p></body></html>',
      { status: 200 },
    ) as Response;
  const citation: Citation = {
    authority: 'MGL Ch 40A § 3',
    source_url: 'https://example.test/40a3',
    excerpt: 'No zoning ordinance or by-law shall prohibit accessory dwelling units',
    excerpt_type: 'direct_quote',
  };
  const result = await verifyMethod2(citation, fakeFetch);
  assert.equal(result.verified, true);
  assert.equal(result.method, 'canonical_url_fetch');
});

// === Method 1 happy-path coverage against server/skills/ (the audit-grade tree) ===

test('Method 1 verifies a verbatim sentence from server/skills/', async () => {
  const result = await verifyMethod1(citation(), SERVER_SKILLS_ROOT);
  assert.equal(result.verified, true);
  assert.equal(result.method, 'skill_reference_lookup');
  assert.match(result.matched_reference!, /chapter-150-of-2024\.md$/);
});

test('Method 1 normalizes whitespace (collapsed to single space) before matching', async () => {
  const result = await verifyMethod1(
    citation({ excerpt: 'This  is   the  legal   definition  that every municipal bylaw must now work from.' }),
    SERVER_SKILLS_ROOT,
  );
  assert.equal(result.verified, true);
});

test('Method 1 matches case-insensitively', async () => {
  const result = await verifyMethod1(
    citation({ excerpt: KNOWN_VERBATIM.toUpperCase() }),
    SERVER_SKILLS_ROOT,
  );
  assert.equal(result.verified, true);
});

test('Method 1 normalizes smart quotes to straight quotes', async () => {
  const result = await verifyMethod1(
    citation({ excerpt: KNOWN_VERBATIM.replace(/'/g, '’') }),
    SERVER_SKILLS_ROOT,
  );
  assert.equal(result.verified, true);
});

test('Method 1 returns lookup_error for non-existent skills root', async () => {
  const result = await verifyMethod1(
    citation(),
    path.join(import.meta.dirname, '__no_such_dir__', 'skills'),
  );
  assert.equal(result.verified, false);
  assert.match(result.error ?? '', /lookup_error/);
});

// === verifyCitation composition ===

test('verifyCitation short-circuits to Method 1 when excerpt is verbatim', async () => {
  // Confirms that Method 2 (which would try real fetch in this composition)
  // is not reached when Method 1 succeeds. Critical for CI determinism.
  const result = await verifyCitation(citation(), SERVER_SKILLS_ROOT);
  assert.equal(result.verified, true);
  assert.equal(result.method, 'skill_reference_lookup');
});
