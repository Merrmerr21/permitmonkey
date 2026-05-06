/**
 * Display helpers for the Provenance UI. Per design spec at
 * docs/design/provenance-ui.md.
 */

import type { CitationStatus } from './types'

export function formatAuthorityShort(authority: string): string {
  const cleaned = authority.split(' as amended by ')[0].trim()
  if (cleaned.length <= 28) return cleaned
  return cleaned.slice(0, 27) + '…'
}

export function formatStatusLabel(status: CitationStatus): string {
  switch (status) {
    case 'verified-skill':
      return 'Verified via skill reference'
    case 'verified-url':
      return 'Verified via canonical source'
    case 'unverified':
      return 'Unverified'
    case 'broken':
      return 'Source unreachable'
    case 'pending':
      return 'Verifying…'
  }
}

export function formatRetrieved(retrieved: string): string {
  // Accepts YYYY-MM-DD; passes through other shapes unchanged.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(retrieved)) return retrieved
  const [y, m, d] = retrieved.split('-')
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`
}
