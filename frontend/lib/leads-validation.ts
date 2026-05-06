/**
 * Validation helpers for /api/leads.
 * Extracted from the route so they can be unit-tested without the Next.js
 * request/response shell.
 */

export const VALID_SOURCES = [
  'eligibility_checker',
  'pricing_page',
  'newsletter',
  'cold_outreach_response',
] as const

export type LeadSource = (typeof VALID_SOURCES)[number]

export const VALID_VERDICTS = ['likely_eligible', 'needs_review', 'not_eligible'] as const

export function isEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (value.length > 254) return false
  // Pragmatic regex — not RFC-strict, but rejects obvious garbage.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function pickString(value: unknown, max = 120): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > max) return null
  return trimmed
}

export function normalizeSource(value: unknown): LeadSource {
  if (typeof value !== 'string') return 'eligibility_checker'
  return (VALID_SOURCES as readonly string[]).includes(value)
    ? (value as LeadSource)
    : 'eligibility_checker'
}

export function normalizeVerdict(value: unknown): string | null {
  const s = pickString(value, 32)
  if (!s) return null
  return (VALID_VERDICTS as readonly string[]).includes(s) ? s : null
}
