/**
 * Run with: node --experimental-strip-types --test src/services/citation-verification.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { verifyMethod1, verifyMethod2, type Citation } from './citation-verification.ts';

const SKILL_REFS = path.resolve(
  import.meta.dirname,
  '../../../.claude/skills/massachusetts-adu/references',
);

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
