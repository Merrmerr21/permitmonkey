/**
 * Shared types for the Provenance UI.
 *
 * The inline tag format established 2026-05-03 in
 * server/skills/boston-adu/SKILL.md:
 *   [source: <URL> | retrieved: <YYYY-MM-DD> | citation: <statute or section>]
 *
 * Each tag becomes an ExtractedCitation. After the route handler runs
 * verifyCitation() on each, it attaches a CitationVerification, producing
 * a VerifiedCitation that the client renders.
 */

export type CitationStatus =
  | 'verified-skill'
  | 'verified-url'
  | 'unverified'
  | 'broken'
  | 'pending'

export interface ExtractedCitation {
  source_url: string
  retrieved: string
  authority: string
  context_excerpt: string
  match_index: number
  raw_tag: string
}

export interface CitationVerification {
  status: CitationStatus
  matched_reference?: string
  verified_excerpt?: string
  error?: string
}

export interface VerifiedCitation extends ExtractedCitation {
  verification: CitationVerification
}
