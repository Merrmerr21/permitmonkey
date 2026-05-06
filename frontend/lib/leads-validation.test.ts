/**
 * Run with: node --experimental-strip-types --test lib/leads-validation.test.ts
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isEmail,
  pickString,
  normalizeSource,
  normalizeVerdict,
  VALID_SOURCES,
} from './leads-validation.ts'

test('isEmail accepts standard addresses', () => {
  assert.equal(isEmail('user@example.com'), true)
  assert.equal(isEmail('a.b+tag@sub.example.co.uk'), true)
  assert.equal(isEmail('person_123@domain.io'), true)
})

test('isEmail rejects obvious garbage', () => {
  assert.equal(isEmail(''), false)
  assert.equal(isEmail('not-an-email'), false)
  assert.equal(isEmail('@example.com'), false)
  assert.equal(isEmail('user@'), false)
  assert.equal(isEmail('user@nodot'), false)
  assert.equal(isEmail('user space@example.com'), false)
  assert.equal(isEmail('user@@example.com'), false)
})

test('isEmail rejects non-strings', () => {
  assert.equal(isEmail(undefined), false)
  assert.equal(isEmail(null), false)
  assert.equal(isEmail(42), false)
  assert.equal(isEmail({}), false)
})

test('isEmail rejects oversized addresses', () => {
  // RFC 5321 caps at 254; we accept ≤254.
  const local = 'a'.repeat(64)
  const domain = 'b'.repeat(60) + '.com'
  const hugeLocal = 'a'.repeat(300) + '@example.com'
  assert.equal(isEmail(`${local}@${domain}`), true)
  assert.equal(isEmail(hugeLocal), false)
})

test('pickString trims and returns string when valid', () => {
  assert.equal(pickString('  hello  '), 'hello')
  assert.equal(pickString('Boston'), 'Boston')
})

test('pickString returns null for empty, whitespace, or oversized', () => {
  assert.equal(pickString(''), null)
  assert.equal(pickString('   '), null)
  assert.equal(pickString('a'.repeat(121)), null)
})

test('pickString returns null for non-strings', () => {
  assert.equal(pickString(undefined), null)
  assert.equal(pickString(null), null)
  assert.equal(pickString(42), null)
  assert.equal(pickString({}), null)
})

test('pickString respects custom max length', () => {
  assert.equal(pickString('hello world', 5), null)
  assert.equal(pickString('hello', 5), 'hello')
})

test('normalizeSource returns the value when valid', () => {
  for (const source of VALID_SOURCES) {
    assert.equal(normalizeSource(source), source)
  }
})

test('normalizeSource defaults to eligibility_checker on invalid input', () => {
  assert.equal(normalizeSource('marketing_site'), 'eligibility_checker')
  assert.equal(normalizeSource(''), 'eligibility_checker')
  assert.equal(normalizeSource(undefined), 'eligibility_checker')
  assert.equal(normalizeSource(42), 'eligibility_checker')
})

test('normalizeVerdict returns the verdict when valid', () => {
  assert.equal(normalizeVerdict('likely_eligible'), 'likely_eligible')
  assert.equal(normalizeVerdict('needs_review'), 'needs_review')
  assert.equal(normalizeVerdict('not_eligible'), 'not_eligible')
})

test('normalizeVerdict returns null for unrecognized values', () => {
  assert.equal(normalizeVerdict('eligible'), null)
  assert.equal(normalizeVerdict('approved'), null)
  assert.equal(normalizeVerdict(undefined), null)
  assert.equal(normalizeVerdict(''), null)
})
