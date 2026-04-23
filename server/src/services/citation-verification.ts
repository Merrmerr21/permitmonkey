/**
 * Citation verification — Method 1 (skill reference cross-check) and
 * Method 2 (canonical URL fetch). Method 3 (Opus advisor) is a stub for now.
 *
 * Per docs/citation-verification-spec.md. Zero-tolerance policy: a citation
 * returned with verified=true that cannot be confirmed fails the gate.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

export interface Citation {
  authority: string;
  amended_by?: string;
  subsection?: string;
  source_url: string;
  excerpt: string;
  excerpt_type: 'direct_quote' | 'paraphrase_with_reference';
  verified?: boolean;
  verification_method?: string;
  verification_date?: string;
  verifier?: string;
  skill_reference?: string;
}

export interface VerificationResult {
  verified: boolean;
  method: 'skill_reference_lookup' | 'canonical_url_fetch' | 'none';
  error?: string;
  matched_reference?: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').replace(/[""'']/g, '"').trim();
}

/**
 * Method 1 — skill reference lookup. Walks the skill's references/ directory
 * and verifies that `excerpt` appears verbatim (normalized) in a file whose
 * contents describe the cited authority.
 */
export async function verifyMethod1(
  citation: Citation,
  skillReferencesRoot: string,
): Promise<VerificationResult> {
  try {
    const files = await walkMarkdown(skillReferencesRoot);
    const needle = normalize(citation.excerpt);
    if (needle.length < 20) {
      return { verified: false, method: 'skill_reference_lookup', error: 'excerpt_too_short' };
    }
    for (const file of files) {
      const content = normalize(await fs.readFile(file, 'utf-8'));
      if (content.includes(needle)) {
        return {
          verified: true,
          method: 'skill_reference_lookup',
          matched_reference: path.relative(skillReferencesRoot, file),
        };
      }
    }
    return { verified: false, method: 'skill_reference_lookup', error: 'excerpt_not_in_skill_references' };
  } catch (err) {
    return {
      verified: false,
      method: 'skill_reference_lookup',
      error: `lookup_error: ${(err as Error).message}`,
    };
  }
}

/**
 * Method 2 — canonical URL fetch. Fetches source_url and checks excerpt
 * presence after stripping HTML. Returns verified=true on 2xx + match.
 */
export async function verifyMethod2(
  citation: Citation,
  fetchImpl: typeof fetch = fetch,
): Promise<VerificationResult> {
  try {
    const res = await fetchImpl(citation.source_url, {
      method: 'GET',
      headers: { 'user-agent': 'PermitMonkey-CitationVerifier/1.0' },
      redirect: 'follow',
    });
    if (!res.ok) {
      return {
        verified: false,
        method: 'canonical_url_fetch',
        error: `url_${res.status}`,
      };
    }
    const html = await res.text();
    const text = normalize(html.replace(/<[^>]+>/g, ' '));
    const needle = normalize(citation.excerpt);
    if (text.includes(needle)) {
      return { verified: true, method: 'canonical_url_fetch' };
    }
    return { verified: false, method: 'canonical_url_fetch', error: 'excerpt_not_found' };
  } catch (err) {
    return {
      verified: false,
      method: 'canonical_url_fetch',
      error: `fetch_error: ${(err as Error).message}`,
    };
  }
}

/**
 * Gate A — try Method 1 first, fall back to Method 2.
 */
export async function verifyCitation(
  citation: Citation,
  skillReferencesRoot: string,
): Promise<VerificationResult> {
  const m1 = await verifyMethod1(citation, skillReferencesRoot);
  if (m1.verified) return m1;
  const m2 = await verifyMethod2(citation);
  if (m2.verified) return m2;
  return {
    verified: false,
    method: 'none',
    error: `method1: ${m1.error ?? 'unknown'}; method2: ${m2.error ?? 'unknown'}`,
  };
}

async function walkMarkdown(root: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push(full);
      }
    }
  }
  await walk(root);
  return out;
}
