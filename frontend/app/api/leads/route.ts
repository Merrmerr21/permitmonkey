import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'node:crypto'

const VALID_SOURCES = [
  'eligibility_checker',
  'pricing_page',
  'newsletter',
  'cold_outreach_response',
] as const
type LeadSource = (typeof VALID_SOURCES)[number]

const VALID_VERDICTS = ['likely_eligible', 'needs_review', 'not_eligible'] as const

interface LeadInput {
  email?: unknown
  source?: unknown
  city?: unknown
  verdict?: unknown
  utm_source?: unknown
  utm_medium?: unknown
  utm_campaign?: unknown
}

function isEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (value.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function pickString(value: unknown, max = 120): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > max) return null
  return trimmed
}

function hashIp(ip: string | null): string | null {
  if (!ip) return null
  // Hash with a per-deployment salt so the same IP across deployments doesn't
  // produce the same hash; falls back to a constant if SECRET is unset (dev).
  const salt = process.env.LEADS_IP_SALT ?? 'permitmonkey-dev-salt'
  return createHash('sha256').update(salt + ip).digest('hex').slice(0, 32)
}

export async function POST(req: NextRequest) {
  let body: LeadInput
  try {
    body = (await req.json()) as LeadInput
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!isEmail(body.email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const sourceRaw = typeof body.source === 'string' ? body.source : 'eligibility_checker'
  const source: LeadSource = (VALID_SOURCES as readonly string[]).includes(sourceRaw)
    ? (sourceRaw as LeadSource)
    : 'eligibility_checker'

  const verdictRaw = pickString(body.verdict, 32)
  const verdict =
    verdictRaw && (VALID_VERDICTS as readonly string[]).includes(verdictRaw) ? verdictRaw : null

  const ip =
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null

  const supabase = await createClient()

  // Use upsert behavior: if (lower(email), source) already exists, succeed
  // silently. Don't surface the dup to the client — looks like normal capture.
  const { error } = await supabase
    .schema('permitmonkey')
    .from('leads')
    .insert({
      email: body.email.toLowerCase(),
      source,
      city: pickString(body.city, 80),
      verdict,
      utm_source: pickString(body.utm_source, 80),
      utm_medium: pickString(body.utm_medium, 80),
      utm_campaign: pickString(body.utm_campaign, 80),
      ip_hash: hashIp(ip),
    })

  if (error) {
    // 23505 is unique_violation; swallow it — the lead is already captured.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, deduped: true })
    }
    console.error('lead capture failed:', error.message)
    return NextResponse.json({ error: 'capture_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
