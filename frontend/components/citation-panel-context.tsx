'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { VerifiedCitation } from '@/lib/citations/types'

interface CitationPanelState {
  active: VerifiedCitation | null
  open: (citation: VerifiedCitation) => void
  close: () => void
}

const CitationPanelContext = createContext<CitationPanelState | null>(null)

export function CitationPanelProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<VerifiedCitation | null>(null)
  const open = useCallback((citation: VerifiedCitation) => setActive(citation), [])
  const close = useCallback(() => setActive(null), [])
  return (
    <CitationPanelContext.Provider value={{ active, open, close }}>
      {children}
    </CitationPanelContext.Provider>
  )
}

export function useCitationPanel(): CitationPanelState {
  const ctx = useContext(CitationPanelContext)
  if (!ctx) {
    throw new Error('useCitationPanel must be used inside <CitationPanelProvider>')
  }
  return ctx
}
