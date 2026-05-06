/**
 * Frontend port of server/evals/citation-extractor.ts. The regex must stay
 * identical to the server extractor so the harness's grading matches what
 * the UI surfaces. If you change one, change both.
 */

import type { ExtractedCitation } from './types'

export const TAG_RE =
  /\[\s*source:\s*([^|\]]+?)\s*\|\s*retrieved:\s*([^|\]]+?)\s*\|\s*citation:\s*([^\]]+?)\s*\]/g

export function extractCitations(markdown: string): ExtractedCitation[] {
  const out: ExtractedCitation[] = []
  for (const match of markdown.matchAll(TAG_RE)) {
    const [raw, sourceUrl, retrieved, authority] = match
    if (match.index === undefined) continue
    out.push({
      source_url: sourceUrl.trim(),
      retrieved: retrieved.trim(),
      authority: authority.trim(),
      context_excerpt: precedingSentence(markdown, match.index),
      match_index: match.index,
      raw_tag: raw,
    })
  }
  return out
}

function precedingSentence(text: string, idx: number): string {
  let end = idx
  for (let i = idx - 1; i >= 0; i--) {
    if (isSentenceEnd(text, i)) {
      end = i + 1
      break
    }
  }
  if (end === idx) {
    return text.slice(0, idx).trim()
  }
  let start = 0
  for (let i = end - 2; i >= 0; i--) {
    if (isSentenceEnd(text, i) || text[i] === '\n') {
      start = i + 1
      break
    }
  }
  while (start < end && /\s/.test(text[start])) start++
  return text.slice(start, end).trim()
}

function isSentenceEnd(text: string, i: number): boolean {
  const ch = text[i]
  if (ch !== '.' && ch !== '!' && ch !== '?') return false
  const next = text[i + 1]
  return next === undefined || /\s/.test(next)
}
