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

// Plain ASCII sentinel that markdown / GFM / autolink won't tokenize.
// Avoids unicode invisible chars which some renderers strip.
const PLACEHOLDER_PREFIX = 'xCITxOPENx'
const PLACEHOLDER_SUFFIX = 'xCITxCLOSEx'
const PLACEHOLDER_RE = new RegExp(
  `${PLACEHOLDER_PREFIX}(\\d+)${PLACEHOLDER_SUFFIX}`,
  'g',
)

/**
 * Renders markdown with inline provenance tags substituted by <CitationPill>.
 *
 * Why pre-substitution: remark-gfm auto-links any bare URL it sees, including
 * the URL inside `[source: <URL> | retrieved: ... | citation: ...]`. That
 * fragmented the tag across text + <a> + text nodes, so the post-render
 * regex couldn't match the whole tag in a single text child. Instead we
 * replace each tag with an opaque placeholder BEFORE markdown sees it, then
 * post-render we walk text nodes and swap placeholders for pills.
 */
export function MarkdownWithCitations({
  children,
  citations,
  className,
}: MarkdownWithCitationsProps) {
  // Step 1 — replace every TAG_RE match in the source with a placeholder
  // and remember the mapping placeholder-index → citation.
  const byRaw = new Map<string, VerifiedCitation>()
  for (const c of citations) byRaw.set(c.raw_tag, c)

  const tagRe = new RegExp(TAG_RE.source, TAG_RE.flags)
  const byIndex: VerifiedCitation[] = []
  const transformed = children.replace(tagRe, (match) => {
    const c = byRaw.get(match)
    if (!c) return match
    const idx = byIndex.length
    byIndex.push(c)
    return `${PLACEHOLDER_PREFIX}${idx}${PLACEHOLDER_SUFFIX}`
  })

  // Step 2 — render the transformed markdown, then post-process every text
  // node to swap placeholders for <CitationPill>.
  const components: Components = {
    p: ({ children: kids }) => <p>{processChildren(kids, byIndex)}</p>,
    li: ({ children: kids, ...rest }) => <li {...rest}>{processChildren(kids, byIndex)}</li>,
    em: ({ children: kids }) => <em>{processChildren(kids, byIndex)}</em>,
    strong: ({ children: kids }) => <strong>{processChildren(kids, byIndex)}</strong>,
    blockquote: ({ children: kids }) => (
      <blockquote>{processChildren(kids, byIndex)}</blockquote>
    ),
    td: ({ children: kids, ...rest }) => <td {...rest}>{processChildren(kids, byIndex)}</td>,
    th: ({ children: kids, ...rest }) => <th {...rest}>{processChildren(kids, byIndex)}</th>,
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {transformed}
      </ReactMarkdown>
    </div>
  )
}

function processChildren(
  children: ReactNode,
  byIndex: VerifiedCitation[],
): ReactNode {
  return Children.map(children, (child, i) => {
    if (typeof child === 'string') {
      return splitTextWithPills(child, byIndex, `t${i}`)
    }
    if (isValidElement<{ children?: ReactNode }>(child)) {
      const props = child.props
      if (props && 'children' in props) {
        return {
          ...child,
          props: {
            ...props,
            children: processChildren(props.children, byIndex),
          },
        }
      }
    }
    return child
  })
}

function splitTextWithPills(
  text: string,
  byIndex: VerifiedCitation[],
  keyPrefix: string,
): ReactNode {
  const re = new RegExp(PLACEHOLDER_RE.source, PLACEHOLDER_RE.flags)
  const out: ReactNode[] = []
  let lastIdx = 0
  let m: RegExpExecArray | null
  let n = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) {
      out.push(text.slice(lastIdx, m.index))
    }
    const idx = parseInt(m[1], 10)
    const citation = byIndex[idx]
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
