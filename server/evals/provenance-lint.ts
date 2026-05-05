/**
 * Provenance lint — scans skill `references/` markdown for sentences that
 * look like cited factual claims and warns when no inline provenance tag
 * is nearby.
 *
 * Detected patterns: MGL chapter references, CMR references, Chapter N of
 * the Acts of YYYY citations, statutory section symbols (§), Boston Zoning
 * Code Article numbers, IRC/IBC sections.
 *
 * For each match, the lint searches +/- 250 characters for an inline tag
 * `[source: URL | retrieved: YYYY-MM-DD | citation: SECTION]`. If no tag
 * is found in the window, the sentence is reported as a violation.
 *
 * Exemptions:
 * - Sentences inside YAML frontmatter (between leading --- markers)
 * - Sentences inside fenced code blocks (```...```)
 * - Sentences whose surrounding paragraph contains "TBD" or
 *   "verification pending" (explicit unverified flag — already honest)
 * - Sentences inside `## See Also`, `## Source Maintenance`, or
 *   `## Reference File Catalog` sections (cross-references, not claims)
 *
 * Usage:
 *   npm run lint:provenance                  # scan default tree
 *   npm run lint:provenance -- --strict      # exit 1 on any violation
 *   npm run lint:provenance -- --path=<dir>  # alternate scan root
 *
 * Skeleton stage: prints violations to stdout. CI integration via the
 * existing .github/workflows/evals.yml.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_SCAN_ROOT = path.resolve(HERE, '..', 'skills')

const TAG_RE =
  /\[\s*source:\s*[^|\]]+?\s*\|\s*retrieved:\s*[^|\]]+?\s*\|\s*citation:\s*[^\]]+?\s*\]/g

const CITABLE_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'MGL chapter', regex: /\bMGL\s+Ch\s+\d+[A-Z]?\b/g },
  { name: 'CMR reference', regex: /\b\d{3}\s+CMR\s+\d+(\.\d+)?/g },
  { name: 'Acts of YYYY', regex: /\bChapter\s+\d+\s+of\s+the\s+Acts\s+of\s+\d{4}\b/g },
  { name: 'St. YYYY, c. N', regex: /\bSt\.\s*\d{4},\s*c\.\s*\d+(,\s*§+\s*\d+)?/g },
  { name: 'Boston Article', regex: /\bArticle\s+\d+[A-Z]?\b/g },
  { name: 'IRC section', regex: /\bIRC\s+[A-Z]?\d+(\.\d+)?(\(\d+\))?/g },
  { name: 'IBC section', regex: /\bIBC\s+[A-Z]?\d+(\.\d+)?/g },
  { name: 'NEC section', regex: /\bNEC\s+\d+(\.\d+)?/g },
  { name: 'Section symbol', regex: /§§?\s*\d+(\.\d+)?(-\d+)?/g },
]

const TAG_WINDOW = 250

interface Violation {
  file: string
  line: number
  column: number
  match: string
  pattern: string
  context: string
}

interface Options {
  strict: boolean
  scanRoot: string
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2))
  const files = await walkMarkdown(opts.scanRoot)
  console.log(`[provenance-lint] scanning ${files.length} markdown files under ${path.relative(process.cwd(), opts.scanRoot)}`)

  const allViolations: Violation[] = []
  for (const file of files) {
    const violations = await lintFile(file)
    allViolations.push(...violations)
  }

  for (const v of allViolations) {
    const rel = path.relative(process.cwd(), v.file)
    console.log(`${rel}:${v.line}:${v.column}: ${v.pattern} match "${v.match}" — no nearby provenance tag`)
    console.log(`    ${v.context}`)
  }

  console.log(
    `\n[provenance-lint] ${allViolations.length} violation${allViolations.length === 1 ? '' : 's'} across ${files.length} files`,
  )

  if (opts.strict && allViolations.length > 0) {
    process.exit(1)
  }
}

async function lintFile(file: string): Promise<Violation[]> {
  const content = await fs.readFile(file, 'utf-8')
  const exemptRanges = computeExemptRanges(content)
  const violations: Violation[] = []

  for (const pattern of CITABLE_PATTERNS) {
    const re = new RegExp(pattern.regex.source, pattern.regex.flags)
    let match: RegExpExecArray | null
    while ((match = re.exec(content)) !== null) {
      if (isExempt(match.index, match[0].length, exemptRanges)) continue
      if (hasNearbyTag(content, match.index, match[0].length)) continue

      const { line, column } = indexToLineColumn(content, match.index)
      violations.push({
        file,
        line,
        column,
        match: match[0],
        pattern: pattern.name,
        context: extractContext(content, match.index, match[0].length),
      })
    }
  }

  return dedupeNearbyViolations(violations)
}

function hasNearbyTag(content: string, idx: number, len: number): boolean {
  const start = Math.max(0, idx - TAG_WINDOW)
  const end = Math.min(content.length, idx + len + TAG_WINDOW)
  const window = content.slice(start, end)
  TAG_RE.lastIndex = 0
  return TAG_RE.test(window)
}

function dedupeNearbyViolations(violations: Violation[]): Violation[] {
  // Within ~80 chars on the same line, collapse multiple violations into
  // one (a single sentence often triggers multiple patterns; report once).
  const out: Violation[] = []
  for (const v of violations) {
    const last = out[out.length - 1]
    if (last && last.file === v.file && last.line === v.line && Math.abs(v.column - last.column) < 80) {
      continue
    }
    out.push(v)
  }
  return out
}

interface ExemptRange {
  start: number
  end: number
  reason: string
}

function computeExemptRanges(content: string): ExemptRange[] {
  const ranges: ExemptRange[] = []

  // YAML frontmatter
  if (content.startsWith('---')) {
    const closeIdx = content.indexOf('\n---', 3)
    if (closeIdx > 0) {
      ranges.push({ start: 0, end: closeIdx + 4, reason: 'frontmatter' })
    }
  }

  // Fenced code blocks
  const codeFenceRe = /```[\s\S]*?```/g
  let m: RegExpExecArray | null
  while ((m = codeFenceRe.exec(content)) !== null) {
    ranges.push({ start: m.index, end: m.index + m[0].length, reason: 'code-fence' })
  }

  // TBD paragraphs — collapse the paragraph containing "TBD" or
  // "verification pending"
  const lines = content.split('\n')
  let cursor = 0
  let paragraphStart = 0
  let paragraphHasTbd = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/\bTBD\b|verification pending/i.test(line)) paragraphHasTbd = true
    const isBlank = line.trim() === ''
    if (isBlank) {
      if (paragraphHasTbd) {
        ranges.push({ start: paragraphStart, end: cursor, reason: 'tbd' })
      }
      paragraphStart = cursor + line.length + 1
      paragraphHasTbd = false
    }
    cursor += line.length + 1
  }
  if (paragraphHasTbd) {
    ranges.push({ start: paragraphStart, end: content.length, reason: 'tbd' })
  }

  // ## See Also / ## Source Maintenance / ## Reference File Catalog
  const exemptHeadings = [
    /^##\s+See Also\b/im,
    /^##\s+Source Maintenance\b/im,
    /^##\s+Reference File Catalog\b/im,
    /^##\s+Open Items?\b/im,
  ]
  for (const heading of exemptHeadings) {
    const match = heading.exec(content)
    if (!match || match.index === undefined) continue
    const start = match.index
    const after = content.slice(start + match[0].length)
    const nextHeading = /\n##\s+/.exec(after)
    const end = nextHeading ? start + match[0].length + nextHeading.index : content.length
    ranges.push({ start, end, reason: 'see-also' })
  }

  return ranges
}

function isExempt(idx: number, len: number, ranges: ExemptRange[]): boolean {
  return ranges.some((r) => idx >= r.start && idx + len <= r.end)
}

function indexToLineColumn(content: string, idx: number): { line: number; column: number } {
  let line = 1
  let lineStart = 0
  for (let i = 0; i < idx; i++) {
    if (content[i] === '\n') {
      line++
      lineStart = i + 1
    }
  }
  return { line, column: idx - lineStart + 1 }
}

function extractContext(content: string, idx: number, len: number): string {
  const lineStart = content.lastIndexOf('\n', idx) + 1
  const lineEnd = content.indexOf('\n', idx + len)
  const line = content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd).trim()
  return line.length > 140 ? line.slice(0, 137) + '…' : line
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
        if (entry.name === 'references' || entry.name === 'decision-tree' || entry.name === 'decision-trees') {
          await walk(full)
        } else if (full === dir + path.sep + entry.name) {
          await walk(full)
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Only lint files inside a references/ or decision-tree(s)/ subdir
        if (/[\\/]references[\\/]|[\\/]decision-trees?[\\/]/.test(full)) {
          out.push(full)
        }
      }
    }
  }
  await walk(root)
  return out
}

function parseArgs(argv: string[]): Options {
  const opts: Options = { strict: false, scanRoot: DEFAULT_SCAN_ROOT }
  for (const arg of argv) {
    if (arg === '--strict') opts.strict = true
    else if (arg.startsWith('--path=')) {
      opts.scanRoot = path.resolve(arg.slice('--path='.length))
    }
  }
  return opts
}

main().catch((err) => {
  console.error('[provenance-lint] fatal:', err)
  process.exit(1)
})
