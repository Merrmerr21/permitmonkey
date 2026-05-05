/**
 * L3e MA Eligibility — Generator-Verifier Smoke Test
 *
 * Runs the MA Eligibility Agent end-to-end on a hardcoded Boston fixture.
 * Validates: generator writes verdict JSON with required keys; verifier
 * writes citation audit JSON + summary MD; >=1 citation present; audit
 * summary fields present.
 *
 * Models: Sonnet (generator), Opus (verifier). Estimated cost: $0.50–2.00.
 * Run: node --experimental-strip-types src/tests/test-l3e-ma-eligibility.ts
 */
import fs from 'fs';
import { runMAEligibility, type EligibilityInputs } from '../flows/ma-eligibility.ts';
import { createSession } from '../utils/session.ts';

const inputs: EligibilityInputs = {
  address: '123 Beacon St, Boston, MA 02116',
  city: 'Boston',
  lotSizeSqft: 5000,
  primaryDwellingSqft: 1800,
  zoningDistrict: 'Back Bay',
  proposedAduType: 'attached',
  proposedAduSqft: 800,
  withinHalfMileTransit: true,
};

const sessionDir = createSession('l3e-eligibility');
console.log('=== L3e: MA Eligibility Generator-Verifier Smoke Test ===\n');
console.log(`  Session: ${sessionDir}`);
console.log(`  City: ${inputs.city} | Lot: ${inputs.lotSizeSqft} sqft | Primary: ${inputs.primaryDwellingSqft} sqft\n`);

const start = Date.now();
let lastPhase = '';
let toolCalls = 0;

const result = await runMAEligibility({
  inputs,
  sessionDir,
  onProgress: (msg, phase) => {
    if (phase !== lastPhase) {
      console.log(`\n--- ${phase.toUpperCase()} START ---`);
      lastPhase = phase;
    }
    if (msg.type === 'assistant') {
      for (const block of msg.message.content ?? []) {
        if (block.type === 'tool_use') {
          toolCalls++;
          const sec = ((Date.now() - start) / 1000).toFixed(0);
          console.log(`  [${sec}s][${phase}] ${block.name}`);
        }
      }
    }
  },
});

let passed = result.success;

console.log('\n--- VERIFICATION ---');
const verdictExists = fs.existsSync(result.outputs.verdict);
console.log(verdictExists ? '✓ verdict JSON written' : '✗ verdict JSON missing');

if (verdictExists) {
  try {
    const v = JSON.parse(fs.readFileSync(result.outputs.verdict, 'utf-8'));
    const requiredKeys = ['verdict', 'max_adu_sqft', 'parking_required', 'city_gotchas', 'citations', 'disclaimer'];
    const missing = requiredKeys.filter(k => !(k in v));
    if (missing.length === 0) {
      console.log('  ✓ All required keys present');
    } else {
      console.log(`  ✗ Missing keys: ${missing.join(', ')}`);
      passed = false;
    }
    const citationCount = Array.isArray(v.citations) ? v.citations.length : 0;
    console.log(`  Citations: ${citationCount}`);
    if (citationCount === 0) {
      console.log('  ✗ No citations — every material claim must cite');
      passed = false;
    }
    console.log(`  Verdict: ${v.verdict}`);
    console.log(`  Max ADU: ${v.max_adu_sqft} sqft`);
    console.log(`  Parking required: ${v.parking_required}`);
  } catch (e) {
    console.log(`  ✗ JSON parse error: ${(e as Error).message}`);
    passed = false;
  }
}

if (result.outputs.verified && fs.existsSync(result.outputs.verified)) {
  console.log('✓ verified JSON written');
  try {
    const audit = JSON.parse(fs.readFileSync(result.outputs.verified, 'utf-8'));
    const sum = audit.summary ?? {};
    console.log(`  Citations: total=${sum.total} verified=${sum.verified} unverified=${sum.unverified} broken=${sum.broken}`);
    if ((sum.verified ?? 0) === 0) {
      console.log('  ⚠ No citations verified — may indicate skill paths drifted or fetcher blocked');
    }
  } catch (e) {
    console.log(`  ✗ Audit JSON parse error: ${(e as Error).message}`);
    passed = false;
  }
} else {
  console.log('✗ verified JSON missing');
  passed = false;
}

if (result.outputs.summary && fs.existsSync(result.outputs.summary)) {
  console.log('✓ summary MD written');
} else {
  console.log('✗ summary MD missing');
  passed = false;
}

console.log('\n--- COSTS ---');
console.log(`  Generator: $${result.generator.cost?.toFixed(4) ?? 'unknown'} | turns=${result.generator.turns ?? '?'} | ${result.generator.subtype}`);
if (result.verifier) {
  console.log(`  Verifier:  $${result.verifier.cost?.toFixed(4) ?? 'unknown'} | turns=${result.verifier.turns ?? '?'} | ${result.verifier.subtype}`);
}
const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`  Duration: ${elapsed}s | tool calls: ${toolCalls}`);

console.log(passed ? '\n✅ L3e MA ELIGIBILITY TEST PASSED' : '\n❌ L3e MA ELIGIBILITY TEST FAILED');
process.exit(passed ? 0 : 1);
