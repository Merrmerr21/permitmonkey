'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon, CheckCircle2Icon, AlertTriangleIcon, XCircleIcon, Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRetrieved, formatStatusLabel } from '@/lib/citations/format'
import type { CitationStatus } from '@/lib/citations/types'
import { useCitationPanel } from './citation-panel-context'

const STATUS_BADGE_CLASS: Record<CitationStatus, string> = {
  'verified-skill': 'bg-success/15 text-success border-success/30',
  'verified-url': 'bg-success/15 text-success border-success/30',
  unverified: 'bg-warning/15 text-warning-foreground border-warning/30',
  broken: 'bg-destructive/15 text-destructive border-destructive/30',
  pending: 'bg-muted text-muted-foreground border-border',
}

function StatusBadgeIcon({ status }: { status: CitationStatus }) {
  if (status === 'verified-skill' || status === 'verified-url')
    return <CheckCircle2Icon size={12} />
  if (status === 'broken') return <XCircleIcon size={12} />
  if (status === 'unverified') return <AlertTriangleIcon size={12} />
  return <Loader2Icon size={12} className="animate-spin" />
}

export function CitationPanel() {
  const { active, close } = useCitationPanel()
  const open = active !== null

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) close() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0 bg-card"
      >
        {active ? <CitationPanelBody /> : null}
      </SheetContent>
    </Sheet>
  )
}

function CitationPanelBody() {
  const { active } = useCitationPanel()
  if (!active) return null
  const { authority, source_url, retrieved, verification } = active
  const status = verification.status

  return (
    <>
      <SheetHeader className="p-6 pb-4 gap-3 border-b border-border/50">
        <Badge
          variant="outline"
          className={cn(
            'self-start gap-1 rounded-full px-2.5 h-6 border',
            STATUS_BADGE_CLASS[status],
          )}
        >
          <StatusBadgeIcon status={status} />
          {formatStatusLabel(status)}
        </Badge>
        <SheetTitle
          className={cn(
            'font-display text-2xl font-bold tracking-tight text-card-foreground',
            'leading-tight',
          )}
        >
          {authority}
        </SheetTitle>
        <SheetDescription className="font-body text-sm text-muted-foreground">
          Retrieved {formatRetrieved(retrieved)}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <VerificationSourceLine />
        <VerifiedExcerpt />
        <UnverifiedHelp />
      </div>

      <SheetFooter className="p-6 pt-4 border-t border-border/50 flex-row gap-2">
        <Button asChild variant="default" className="rounded-full">
          <a href={source_url} target="_blank" rel="noopener noreferrer">
            View source <ExternalLinkIcon size={14} className="ml-1" />
          </a>
        </Button>
        <CopyCitationButton />
      </SheetFooter>
    </>
  )
}

function VerificationSourceLine() {
  const { active } = useCitationPanel()
  if (!active) return null
  const { verification, retrieved } = active

  if (verification.status === 'verified-skill') {
    return (
      <p className="font-body text-xs text-muted-foreground">
        Verified against skill reference:{' '}
        <code className="px-1 py-0.5 rounded bg-muted text-foreground/80">
          {verification.matched_reference ?? 'unknown'}
        </code>
      </p>
    )
  }
  if (verification.status === 'verified-url') {
    return (
      <p className="font-body text-xs text-muted-foreground">
        Verified via canonical source fetch on {formatRetrieved(retrieved)}.
      </p>
    )
  }
  if (verification.status === 'unverified') {
    return (
      <p className="font-body text-xs text-muted-foreground">
        Could not verify against skill references or canonical source. See details below.
      </p>
    )
  }
  if (verification.status === 'broken') {
    return (
      <p className="font-body text-xs text-muted-foreground">
        Canonical source returned an error. The cited rule may have moved or been amended.
      </p>
    )
  }
  return null
}

function VerifiedExcerpt() {
  const { active } = useCitationPanel()
  if (!active) return null
  const text = active.verification.verified_excerpt ?? active.context_excerpt
  if (!text) return null
  return (
    <blockquote
      className={cn(
        'border-l-4 border-primary pl-4 py-2 my-2',
        'font-body italic text-card-foreground text-base leading-relaxed',
      )}
    >
      {text}
    </blockquote>
  )
}

function UnverifiedHelp() {
  const { active } = useCitationPanel()
  if (!active) return null
  const { verification } = active
  if (verification.status !== 'unverified' && verification.status !== 'broken') return null
  return (
    <div
      className={cn(
        'rounded-md border p-3 text-sm font-body',
        verification.status === 'broken'
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-warning/30 bg-warning/10 text-warning-foreground',
      )}
    >
      <p className="font-semibold mb-1">
        {verification.status === 'broken'
          ? 'Source unreachable'
          : 'Citation could not be verified'}
      </p>
      <p className="opacity-90">
        {verification.error
          ? `Verifier returned: ${verification.error}.`
          : 'The agent emitted this citation but verifyCitation() failed.'}{' '}
        Inspect the source manually before relying on this in a contractor response.
      </p>
    </div>
  )
}

function CopyCitationButton() {
  const { active } = useCitationPanel()
  if (!active) return null
  const onCopy = () => {
    const cite = `${active.authority} (retrieved ${formatRetrieved(active.retrieved)}). ${active.source_url}`
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cite).catch(() => undefined)
    }
  }
  return (
    <Button variant="outline" className="rounded-full" onClick={onCopy}>
      Copy citation
    </Button>
  )
}
