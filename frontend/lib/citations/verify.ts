/**
 * Frontend verification port of server/src/services/citation-verification.ts.
 *
 * Same two-method shape: Method 1 walks skill `references/` markdown files
 * and matches the citation excerpt as a normalized substring; Method 2
 * fetches the canonical URL and checks the excerpt against the stripped
 * HTML body. The methods, error codes, and verification semantics match
 * the server implementation so eval-harness scoring and UI verification
 * agree.
 *
 * Environment: this file imports node:fs/promises and node:path, so it
 * must only be called from server-side code (Server Components, route
 * handlers, server actions). Importing it from a 'use client' file will
 * fail at build time.
 *
 * Skill root resolution: from a Next.js dev server started in `frontend/`,
 * process.cwd() resolves to the frontend directory; the repo's
 * server/skills/ tree lives at `../server/skills/` from there.
 * Production deployment requires next.config.ts outputFileTracingIncludes
 * to bundle the skill tree — tracked as a Phase B-of-B follow-up.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import type { CitationVerification } from './types'

const FETCH_TIMEOUT_MS = 5000
const MIN_EXCERPT_LENGTH = 20

export interface VerifyInput {
  source_url: string
  excerpt: string
}

export async function verifyCitation(
  input: VerifyInput,
  skillReferencesRoot: string,
): Promise<CitationVerification> {
  const m1 = await verifyMethod1(input, skillReferencesRoot)
  if (m1.status === 'verified-skill') return m1

  const m2 = await verifyMethod2(input)
  if (m2.status === 'verified-url') return m2
  if (m2.status === 'broken') return m2

  return {
    status: 'unverified',
    error: `method1: ${m1.error ?? 'unknown'}; method2: ${m2.error ?? 'unknown'}`,
  }
}

export async function verifyMethod1(
  input: VerifyInput,
  skillReferencesRoot: string,
): Promise<CitationVerification> {
  try {
    const needle = normalize(input.excerpt)
    if (needle.length < MIN_EXCERPT_LENGTH) {
      return { status: 'unverified', error: 'excerpt_too_short' }
    }
    const files = await walkMarkdown(skillReferencesRoot)
    for (const file of files) {
      const content = normalize(await fs.readFile(file, 'utf-8'))
      if (content.includes(needle)) {
        return {
          status: 'verified-skill',
          matched_reference: path.relative(skillReferencesRoot, file).replace(/\\/g, '/'),
          verified_excerpt: input.excerpt,
        }
      }
    }
    return { status: 'unverified', error: 'excerpt_not_in_skill_references' }
  } catch (err) {
    return {
      status: 'unverified',
      error: `lookup_error: ${(err as Error).message}`,
    }
  }
}

export async function verifyMethod2(input: VerifyInput): Promise<CitationVerification> {
  try {
    const res = await fetch(input.source_url, {
      method: 'GET',
      headers: { 'user-agent': 'PermitMonkey-CitationVerifier/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!res.ok) {
      return { status: 'broken', error: `url_${res.status}` }
    }
    const html = await res.text()
    const text = normalize(html.replace(/<[^>]+>/g, ' '))
    const needle = normalize(input.excerpt)
    if (needle.length < MIN_EXCERPT_LENGTH) {
      return { status: 'unverified', error: 'excerpt_too_short' }
    }
    if (text.includes(needle)) {
      return { status: 'verified-url', verified_excerpt: input.excerpt }
    }
    return { status: 'unverified', error: 'excerpt_not_found' }
  } catch (err) {
    const msg = (err as Error).message
    if (msg.includes('aborted') || msg.includes('TimeoutError')) {
      return { status: 'broken', error: 'fetch_timeout' }
    }
    return { status: 'broken', error: `fetch_error: ${msg}` }
  }
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').replace(/[""'']/g, '"').trim()
}

async function walkMarkdown(root: string): Promise<string[]> {
  const out: string[] = []
  async function walk(dir: string) {
    let entries: import('node:fs').Dirent[]
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code
      if (code === 'ENOENT') return
      throw err
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(full)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        out.push(full)
      }
    }
  }
  await walk(root)
  return out
}
