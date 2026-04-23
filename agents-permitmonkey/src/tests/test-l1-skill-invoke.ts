/**
 * L1 Skill Invocation Test — massachusetts-adu Skill
 *
 * Validates: Skill tool works in SDK context, massachusetts-adu reference files
 * load, agent writes output to session directory.
 *
 * Model: Haiku (testing wiring, not quality)
 * Expected duration: < 3 minutes
 * Expected cost: < $1.00
 */
import fs from 'fs';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { createQueryOptions } from '../utils/config.ts';
import { createSession } from '../utils/session.ts';

console.log('=== L1 Skill Invocation Test: massachusetts-adu ===\n');

const startTime = Date.now();
const sessionDir = createSession('l1');
console.log(`  Session: ${sessionDir}\n`);

const q = query({
  prompt: `Use the massachusetts-adu skill to answer this question:
Under 760 CMR 71.00 (MA Protected Use ADU regulation), what is the maximum size of a protected-use ADU, and what is the maximum parking requirement a municipality may impose?

Write your answer as JSON to: ${sessionDir}/test-state-law.json

Format: { "max_size_sqft": number, "max_size_pct_of_primary": number, "max_parking_spaces": number, "parking_waiver_transit_distance_mi": number, "source": "string" }`,
  options: {
    ...createQueryOptions({
      model: 'claude-haiku-4-5-20251001',
      maxTurns: 15,
      maxBudgetUsd: 1.00,
    }),
  },
});

let passed = true;

for await (const msg of q) {
  if (msg.type === 'system') {
    console.log('✓ SDK initialized');
  }

  if (msg.type === 'assistant' && msg.message?.content) {
    for (const block of msg.message.content) {
      if (block.type === 'tool_use') {
        console.log(`  → Tool: ${block.name}${block.name === 'Skill' ? ` (${JSON.stringify(block.input?.skill ?? '')})` : ''}`);
      }
    }
  }

  if (msg.type === 'result') {
    console.log('\n--- Checking outputs ---');

    const filePath = `${sessionDir}/test-state-law.json`;
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      console.log('✓ File written');
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log(`  Max size: ${data.max_size_sqft} sqft / ${data.max_size_pct_of_primary}% of primary`);
        console.log(`  Max parking: ${data.max_parking_spaces} (waived within ${data.parking_waiver_transit_distance_mi} mi of transit)`);
        console.log(`  Source: ${data.source}`);

        // Per Ch 150 of 2024 + 760 CMR 71.00: 900 sqft or 50%, 1 space max, 0.5 mi transit waiver
        const correct =
          data.max_size_sqft === 900 &&
          data.max_size_pct_of_primary === 50 &&
          data.max_parking_spaces === 1 &&
          data.parking_waiver_transit_distance_mi === 0.5;
        if (correct) {
          console.log('✓ Values correct (900 sqft / 50% / 1 space / 0.5 mi transit)');
        } else {
          console.log('✗ Values WRONG — expected 900 sqft, 50%, 1 space, 0.5 mi');
          passed = false;
        }
      } catch (e) {
        console.log('✗ JSON parse error:', (e as Error).message);
        passed = false;
      }
    } else {
      console.log('✗ File NOT written');
      passed = false;
    }

    console.log(`\n  Cost: $${msg.total_cost_usd?.toFixed(4) ?? 'unknown'}`);
    console.log(`  Subtype: ${msg.subtype ?? 'unknown'}`);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n  Duration: ${elapsed}s`);
console.log(passed ? '\n✅ L1 SKILL INVOCATION TEST PASSED' : '\n❌ L1 SKILL INVOCATION TEST FAILED');
process.exit(passed ? 0 : 1);
