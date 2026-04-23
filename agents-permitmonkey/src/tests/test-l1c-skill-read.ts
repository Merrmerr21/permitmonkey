/**
 * L1c Skill Read + Checklist Access + Subagent File Access
 *
 * CRITICAL GATE — Tests whether:
 * 1. Main agent can read adu-plan-review skill and its checklist references
 * 2. Main agent can read ma-city-research skill and list its city reference files
 * 3. Task subagent can read checklist files via absolute path
 *
 * Model: Haiku (testing wiring, not output quality)
 */
import fs from 'fs';
import path from 'path';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { createQueryOptions, PROJECT_ROOT } from '../utils/config.ts';
import { createSession } from '../utils/session.ts';

const sessionDir = createSession('l1c');
const checklistPath = `${PROJECT_ROOT}/server/skills/adu-plan-review/references/checklist-cover.md`;

console.log('=== L1c: Skill Read + Checklist Access + Subagent File Access ===\n');
console.log(`  Session: ${sessionDir}`);
console.log(`  Checklist: ${checklistPath}`);
console.log(`  Checklist exists: ${fs.existsSync(checklistPath)}\n`);

const startTime = Date.now();

const q = query({
  prompt: `Do FOUR things:

1. Read the adu-plan-review skill and tell me how many phases it has.
2. Read the checklist reference file at:
   ${checklistPath}
   Count how many major check categories exist (numbered sections like "1. Professional Stamps", "2. Governing Codes", etc.)
3. Read the ma-city-research skill and list the city reference files it contains (e.g. boston.md, cambridge.md, ...).
4. **CRITICAL TEST:** Spawn a Task subagent. The subagent must:
   a. Read the file at: ${checklistPath}
   b. Count the number of major categories
   c. Write its count to: ${sessionDir}/subagent-check.json
   Format: { "categories_found": number, "first_category": "string" }
   The subagent should have access to Read and Write tools.

Write YOUR findings (steps 1-3) as JSON to: ${sessionDir}/skill-check.json

Format:
{
  "plan_review_phases": number,
  "checklist_categories": number,
  "ma_city_reference_files": string[]
}

Wait for the subagent to complete before finishing.`,
  options: {
    ...createQueryOptions({
      model: 'claude-haiku-4-5-20251001',
      maxTurns: 20,
      maxBudgetUsd: 1.00,
    }),
  },
});

let passed = true;

for await (const msg of q) {
  if (msg.type === 'assistant') {
    for (const block of msg.message.content) {
      if (block.type === 'tool_use') {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        console.log(`  [${elapsed}s] ${block.name}${block.name === 'Task' ? ' (subagent spawn)' : ''}`);
      }
    }
  }

  if (msg.type === 'result') {
    await new Promise(r => setTimeout(r, 2000));

    const filePath = path.join(sessionDir, 'skill-check.json');
    const fileExists = fs.existsSync(filePath);
    console.log(fileExists ? '\n✓ skill-check.json written' : '\n✗ skill-check.json NOT written');

    if (fileExists) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log(`  Plan review phases: ${data.plan_review_phases} (expected: 5)`);
        console.log(`  Checklist categories: ${data.checklist_categories} (expected: ~7)`);
        console.log(`  MA city references: ${data.ma_city_reference_files?.length} files (expected: 5)`);

        const phasesOk = data.plan_review_phases === 5;
        const checklistOk = data.checklist_categories >= 5;
        const cityOk = data.ma_city_reference_files?.length >= 5;

        if (phasesOk && checklistOk && cityOk) {
          console.log('  ✓ Main agent checks PASSED');
        } else {
          if (!phasesOk) console.log('  ✗ Phase count wrong');
          if (!checklistOk) console.log('  ✗ Checklist categories too few');
          if (!cityOk) console.log('  ✗ MA city references too few');
          passed = false;
        }
      } catch (e) {
        console.log(`  ✗ JSON parse error: ${(e as Error).message}`);
        passed = false;
      }
    } else {
      passed = false;
    }

    const subagentPath = path.join(sessionDir, 'subagent-check.json');
    const subagentExists = fs.existsSync(subagentPath);
    console.log(`\n${subagentExists ? '✓' : '✗'} subagent-check.json ${subagentExists ? 'written' : 'NOT written — SUBAGENT FILE ACCESS FAILED'}`);

    if (subagentExists) {
      try {
        const subData = JSON.parse(fs.readFileSync(subagentPath, 'utf-8'));
        console.log(`  Subagent found ${subData.categories_found} categories`);
        console.log(`  First category: ${subData.first_category}`);
        console.log('\n✓ SUBAGENT CAN READ CHECKLIST FILES — Phase 2 approach confirmed');
      } catch (e) {
        console.log(`  ✗ JSON parse error: ${(e as Error).message}`);
        passed = false;
      }
    } else {
      console.log('\n✗ SUBAGENT CANNOT READ CHECKLIST FILES');
      passed = false;
    }

    console.log(`\n  Cost: $${msg.total_cost_usd?.toFixed(4) ?? 'unknown'}`);
    console.log(`  Subtype: ${msg.subtype ?? 'unknown'}`);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n  Duration: ${elapsed}s`);
console.log(passed ? '\n✅ L1c SKILL READ TEST PASSED' : '\n❌ L1c SKILL READ TEST FAILED');
process.exit(passed ? 0 : 1);
