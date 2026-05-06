import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractCitations, toCitation } from './citation-extractor.ts';

describe('extractCitations', () => {
  it('parses a single inline tag', () => {
    const md =
      'The ADU parking floor is one space, zero within 0.5 mi of MBTA service. ' +
      '[source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §8]';
    const result = extractCitations(md);
    assert.equal(result.length, 1);
    assert.equal(result[0].source_url, 'https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150');
    assert.equal(result[0].retrieved, '2026-04-22');
    assert.equal(result[0].authority, 'St. 2024, c. 150, §8');
  });

  it('captures the surrounding sentence as excerpt context', () => {
    const md =
      'Boston has adopted the Specialized Opt-In Code. [source: https://example.gov/specialized | retrieved: 2026-05-03 | citation: 225 CMR 22 Appendix RC]';
    const [extracted] = extractCitations(md);
    assert.match(extracted.context_excerpt, /Specialized Opt-In/);
  });

  it('extracts multiple tags from one document', () => {
    const md =
      'Rule one. [source: https://a.example | retrieved: 2026-05-01 | citation: A §1] ' +
      'Rule two. [source: https://b.example | retrieved: 2026-05-02 | citation: B §2]';
    const result = extractCitations(md);
    assert.equal(result.length, 2);
    assert.equal(result[0].authority, 'A §1');
    assert.equal(result[1].authority, 'B §2');
  });

  it('tolerates whitespace variation in the tag', () => {
    const md = '[source:https://x.example|retrieved:2026-05-03|citation:X §3]';
    const [extracted] = extractCitations(md);
    assert.equal(extracted.source_url, 'https://x.example');
    assert.equal(extracted.authority, 'X §3');
  });

  it('returns empty array when no tags present', () => {
    assert.deepEqual(extractCitations('plain prose with no tags'), []);
  });

  it('does not match malformed tags', () => {
    const md =
      '[source: https://x.example | retrieved: 2026-05-03] ' +
      '[citation: missing pipe] ' +
      '[source: only]';
    assert.deepEqual(extractCitations(md), []);
  });
});

describe('toCitation', () => {
  it('maps an extracted tag to a verifyCitation-shaped Citation', () => {
    const md =
      'The state code is 780 CMR 10th Edition. ' +
      '[source: https://www.mass.gov/state-building-code | retrieved: 2026-04-22 | citation: 780 CMR (10th Edition)]';
    const [extracted] = extractCitations(md);
    const citation = toCitation(extracted);
    assert.equal(citation.authority, '780 CMR (10th Edition)');
    assert.equal(citation.source_url, 'https://www.mass.gov/state-building-code');
    assert.equal(citation.verification_date, '2026-04-22');
    assert.equal(citation.excerpt_type, 'paraphrase_with_reference');
    assert.match(citation.excerpt, /780 CMR/);
  });
});
