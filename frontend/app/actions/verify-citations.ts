'use server'

/**
 * Server action: extract inline provenance tags from agent markdown and
 * verify each via Method 1 (skill reference lookup) + Method 2 (canonical
 * URL fetch). Returns VerifiedCitation[] consumable by the Provenance UI.
 *
 * Phase B integration: results-viewer.tsx calls this action when the
 * agent output loads, replacing the Phase A all-pills-unverified state
 * with real per-citation status.
 *
 * Skill root: resolved relative to process.cwd() in dev. Production
 * deployment requires next.config.ts to bundle the skill tree under
 * `server/skills/` into the deployed function — tracked as a follow-up.
 */

import path from 'node:path'
import { extractCitations } from '@/lib/citations/extract'
import { verifyCitation } from '@/lib/citations/verify'
import type { VerifiedCitation } from '@/lib/citations/types'

const SKILL_ROOT = resolveSkillRoot()

export async function verifyCitationsAction(markdown: string): Promise<VerifiedCitation[]> {
  const extracted = extractCitations(markdown)
  if (extracted.length === 0) return []

  const verified = await Promise.all(
    extracted.map(async (c) => {
      const verification = await verifyCitation(
        { source_url: c.source_url, excerpt: c.context_excerpt },
        SKILL_ROOT,
      )
      return { ...c, verification } satisfies VerifiedCitation
    }),
  )
  return verified
}

function resolveSkillRoot(): string {
  // Dev: Next.js runs from frontend/, repo skills are ../server/skills/
  // Production: bundled via next.config.ts outputFileTracingIncludes;
  // adjust here if the production path differs.
  const fromCwd = path.resolve(process.cwd(), '..', 'server', 'skills')
  return fromCwd
}
