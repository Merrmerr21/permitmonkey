import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'node:crypto'
import {
  isEmail,
  pickString,
  normalizeSource,
  normalizeVerdict,
} from '@/lib/leads-validation'

interface LeadInput {
  email?: unknown
  source?: unknown
  city?: unknown
  verdict?: unknown
  utm_source?: unknown
  utm_medium?: unknown
  utm_campaign?: unknown
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

  const source = normalizeSource(body.source)
  const verdict = normalizeVerdict(body.verdict)

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
