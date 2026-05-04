'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TAG_RE } from '@/lib/citations/extract'
import type { VerifiedCitation } from '@/lib/citations/types'
import { CitationPill } from './citation-pill'

interface MarkdownWithCitationsProps {
  children: string
  citations: VerifiedCitation[]
  className?: string
}

/**
 * Renders markdown with inline provenance tags substituted by <CitationPill>.
 *
 * Phase A approach: pre-extract is done by the caller (route handler /
 * server action), which produces VerifiedCitation[]. This component renders
 * the markdown via react-markdown, then walks each text-bearing element's
 * children and replaces tag matches with pills.
 *
 * Limitation: nested formatting around a tag (e.g. **bold [tag] text**) is
 * still rendered correctly because we walk the rendered children tree, not
 * the raw markdown. The tag MUST be in a single text node — markdown that
 * splits a tag across emphasis boundaries (e.g. "[source: *italic url*]")
 * will not be parsed. The tag format spec forbids this, and the eval
 * harness's extractor enforces it identically.
 */
export function MarkdownWithCitations({
  children,
  citations,
  className,
}: MarkdownWithCitationsProps) {
  const byRaw = new Map<string, VerifiedCitation>()
  for (const c of citations) byRaw.set(c.raw_tag, c)

  const components: Components = {
    p: ({ children: kids }) => <p>{processChildren(kids, byRaw)}</p>,
    li: ({ children: kids, ...rest }) => <li {...rest}>{processChildren(kids, byRaw)}</li>,
    em: ({ children: kids }) => <em>{processChildren(kids, byRaw)}</em>,
    strong: ({ children: kids }) => <strong>{processChildren(kids, byRaw)}</strong>,
    blockquote: ({ children: kids }) => (
      <blockquote>{processChildren(kids, byRaw)}</blockquote>
    ),
    td: ({ children: kids, ...rest }) => <td {...rest}>{processChildren(kids, byRaw)}</td>,
    th: ({ children: kids, ...rest }) => <th {...rest}>{processChildren(kids, byRaw)}</th>,
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

function processChildren(
  children: ReactNode,
  byRaw: Map<string, VerifiedCitation>,
): ReactNode {
  return Children.map(children, (child, i) => {
    if (typeof child === 'string') {
      return splitTextWithPills(child, byRaw, `t${i}`)
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      const props = child.props
      if (props && 'children' in props) {
        return {
          ...child,
          props: {
            ...props,
            children: processChildren(props.children, byRaw),
          },
        }
      }
    }
    return child
  })
}

function splitTextWithPills(
  text: string,
  byRaw: Map<string, VerifiedCitation>,
  keyPrefix: string,
): ReactNode {
  // Make sure we don't share the regex's lastIndex across calls.
  const re = new RegExp(TAG_RE.source, TAG_RE.flags)
  const out: ReactNode[] = []
  let lastIdx = 0
  let m: RegExpExecArray | null
  let n = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) {
      out.push(text.slice(lastIdx, m.index))
    }
    const citation = byRaw.get(m[0])
    if (citation) {
      out.push(<CitationPill key={`${keyPrefix}-pill-${n++}`} citation={citation} />)
    } else {
      out.push(m[0])
    }
    lastIdx = m.index + m[0].length
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx))
  return out.length === 1 ? out[0] : out
}
