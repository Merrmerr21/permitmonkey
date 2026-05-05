/**
 * Parses inline provenance tags of the form
 *   [source: <URL> | retrieved: <YYYY-MM-DD> | citation: <statute>]
 * out of agent markdown output. Each match becomes a Citation suitable for
 * the existing verifyCitation() service.
 *
 * Convention established 2026-05-03 in server/skills/boston-adu/SKILL.md.
 * Legacy CA references in _legacy/ do not use this format and are out of
 * scope for this extractor.
 */

import type { Citation } from '../src/services/citation-verification.ts';

const TAG_RE =
  /\[\s*source:\s*([^|\]]+?)\s*\|\s*retrieved:\s*([^|\]]+?)\s*\|\s*citation:\s*([^\]]+?)\s*\]/g;

export interface ExtractedCitation {
  source_url: string;
  retrieved: string;
  authority: string;
  context_excerpt: string;
  match_index: number;
  raw_tag: string;
}

export function extractCitations(markdown: string): ExtractedCitation[] {
  const out: ExtractedCitation[] = [];
  for (const match of markdown.matchAll(TAG_RE)) {
    const [raw, sourceUrl, retrieved, authority] = match;
    if (match.index === undefined) continue;
    out.push({
      source_url: sourceUrl.trim(),
      retrieved: retrieved.trim(),
      authority: authority.trim(),
      context_excerpt: precedingSentence(markdown, match.index),
      match_index: match.index,
      raw_tag: raw,
    });
  }
  return out;
}

export function toCitation(extracted: ExtractedCitation): Citation {
  return {
    authority: extracted.authority,
    source_url: extracted.source_url,
    excerpt: extracted.context_excerpt,
    excerpt_type: 'paraphrase_with_reference',
    verification_date: extracted.retrieved,
  };
}

/**
 * Returns the sentence the tag is supporting — the most recent complete
 * sentence ending at or before the tag. Handles both "Claim. [tag]" (period
 * before tag) and "Claim [tag]" (tag inside the sentence). Treats "." as a
 * sentence terminator only when followed by whitespace, so numeric values
 * like "0.5 mi" are not treated as sentence ends.
 */
function precedingSentence(text: string, idx: number): string {
  let end = idx;
  for (let i = idx - 1; i >= 0; i--) {
    if (isSentenceEnd(text, i)) {
      end = i + 1;
      break;
    }
  }
  if (end === idx) {
    return text.slice(0, idx).trim();
  }
  let start = 0;
  for (let i = end - 2; i >= 0; i--) {
    if (isSentenceEnd(text, i) || text[i] === '\n') {
      start = i + 1;
      break;
    }
  }
  while (start < end && /\s/.test(text[start])) start++;
  return text.slice(start, end).trim();
}

function isSentenceEnd(text: string, i: number): boolean {
  const ch = text[i];
  if (ch !== '.' && ch !== '!' && ch !== '?') return false;
  const next = text[i + 1];
  return next === undefined || /\s/.test(next);
}
