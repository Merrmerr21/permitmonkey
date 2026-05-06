'use client'

import { AlertTriangleIcon, ExternalLinkIcon, Loader2Icon, XCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatAuthorityShort, formatRetrieved } from '@/lib/citations/format'
import type { CitationStatus, VerifiedCitation } from '@/lib/citations/types'
import { useCitationPanel } from './citation-panel-context'

interface CitationPillProps {
  citation: VerifiedCitation
  className?: string
}

const STATUS_CLASSES: Record<CitationStatus, string> = {
  'verified-skill':
    'bg-success/10 text-success border-success/30 hover:bg-success/20',
  'verified-url':
    'bg-success/10 text-success border-success/30 hover:bg-success/20',
  unverified:
    'bg-warning/10 text-warning-foreground border-warning/30 hover:bg-warning/20',
  broken:
    'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20',
  pending:
    'bg-muted text-muted-foreground border-border animate-pulse',
}

function StatusIcon({ status }: { status: CitationStatus }) {
  if (status === 'pending') return <Loader2Icon size={12} className="animate-spin opacity-70" />
  if (status === 'broken') return <XCircleIcon size={12} />
  if (status === 'unverified') return <AlertTriangleIcon size={12} />
  return <ExternalLinkIcon size={12} className="opacity-60" />
}

export function CitationPill({ citation, className }: CitationPillProps) {
  const { open } = useCitationPanel()
  const { verification } = citation
  const short = formatAuthorityShort(citation.authority)
  const ariaLabel = `View citation: ${short}, ${verification.status}`
  const tooltip = `Retrieved ${formatRetrieved(citation.retrieved)} — click to verify source`

  return (
    <button
      type="button"
      onClick={() => open(citation)}
      title={tooltip}
      aria-label={ariaLabel}
      data-citation-status={verification.status}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 align-baseline',
        'rounded-full text-xs font-body font-semibold',
        'border transition-colors duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        STATUS_CLASSES[verification.status],
        className,
      )}
    >
      <span className="leading-none">{short}</span>
      <StatusIcon status={verification.status} />
    </button>
  )
}
