/**
 * Verdict token — a deterministic, URL-safe encoding of eligibility inputs
 * that lets us serve a shareable read-only verdict page without persisting
 * anything to Supabase. The token is base64url(JSON(input)) so the verdict
 * is recomputable server-side on every share-link visit (master playbook
 * §69 — viral artifacts: every output shareable, no infra cost).
 *
 * The token is the SHA-256 of the input plus the base64url payload, joined
 * by a dot. The hash prefix lets the route reject tampered tokens cheaply
 * (mismatched payload would fail), but does not constitute a signature —
 * any client can produce a valid token. That is fine: the page is
 * read-only and the inputs are user-provided in any case.
 */

import crypto from 'node:crypto';
import type { EligibilityInput } from './eligibility';

function base64urlEncode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  return Buffer.from(padded, 'base64');
}

export function encodeVerdictToken(input: EligibilityInput): string {
  // Stable JSON: sort keys so the hash is deterministic across calls.
  const stable = JSON.stringify(input, Object.keys(input).sort());
  const payload = base64urlEncode(Buffer.from(stable, 'utf-8'));
  const hash = crypto
    .createHash('sha256')
    .update(stable)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
    .slice(0, 12);
  return `${hash}.${payload}`;
}

export function decodeVerdictToken(token: string): EligibilityInput | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [hashPart, payload] = parts;
  let json: string;
  try {
    json = base64urlDecode(payload).toString('utf-8');
  } catch {
    return null;
  }
  const expectedHash = crypto
    .createHash('sha256')
    .update(json)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
    .slice(0, 12);
  if (expectedHash !== hashPart) return null;
  try {
    const obj = JSON.parse(json) as Partial<EligibilityInput>;
    // Validate required fields.
    if (typeof obj.address !== 'string' || obj.address.length === 0) return null;
    if (typeof obj.lot_size_sqft !== 'number' || obj.lot_size_sqft <= 0) return null;
    if (
      typeof obj.primary_dwelling_sqft !== 'number' ||
      obj.primary_dwelling_sqft <= 0
    ) {
      return null;
    }
    return obj as EligibilityInput;
  } catch {
    return null;
  }
}
