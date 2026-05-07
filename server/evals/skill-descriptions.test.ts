/**
 * Skill description-trigger tests (master playbook §202).
 *
 * Each active skill under `server/skills/<skill>/` may carry an
 * `evals/description-test.json` describing prompts that should and should
 * not trigger that skill. The JSON files serve two purposes:
 *
 * 1. Documentation: future readers (and future Claude sessions) can see
 *    exactly what calibration the skill aimed for.
 * 2. Upgrade-day grounding: per master playbook §74, on every Anthropic
 *    model release, an operator runs the should_trigger / should_not_trigger
 *    examples through the new model in a fresh session and checks that
 *    activation behavior still matches the rationale. If it drifts, update
 *    either the SKILL.md description or the test file.
 *
 * This automated test suite enforces only the structural invariants that
 * can be checked without running an LLM:
 *
 * - The JSON schema (skill name, two arrays, rationale string).
 * - The skill name in the JSON matches the directory name and the
 *   SKILL.md frontmatter name.
 * - Both arrays are non-empty.
 * - Rationale is non-empty.
 *
 * It deliberately does NOT enforce keyword overlap between the
 * description and the examples — descriptions summarize the skill's
 * purpose at a higher abstraction level than the examples, and Claude's
 * trigger behavior depends on semantic match, not lexical overlap.
 *
 * Skills without a description-test.json are reported as a non-fatal
 * warning. We add description tests incrementally; missing files surface
 * the gap without blocking CI.
 *
 * Run with: npm run eval:test
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SKILLS_ROOT = path.resolve(import.meta.dirname, '..', 'skills');

interface DescriptionTest {
  skill: string;
  should_trigger: string[];
  should_not_trigger: string[];
  rationale: string;
}

interface SkillEntry {
  name: string;
  skillMdPath: string;
  testPath: string | null;
}

function listSkills(): SkillEntry[] {
  const entries: SkillEntry[] = [];
  if (!fs.existsSync(SKILLS_ROOT)) return entries;
  for (const entry of fs.readdirSync(SKILLS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMdPath = path.join(SKILLS_ROOT, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) continue;
    const testPath = path.join(SKILLS_ROOT, entry.name, 'evals', 'description-test.json');
    entries.push({
      name: entry.name,
      skillMdPath,
      testPath: fs.existsSync(testPath) ? testPath : null,
    });
  }
  return entries;
}

function readSkillDescription(skillMdPath: string): { name: string; description: string } | null {
  const raw = fs.readFileSync(skillMdPath, 'utf-8').replace(/\r\n/g, '\n');
  if (!raw.startsWith('---')) return null;
  const close = raw.indexOf('\n---', 3);
  if (close < 0) return null;
  const fm = raw.slice(3, close);
  // Cheap YAML: name and description are top-level scalar keys. Description
  // can be a quoted multi-line string; we accept the entire value up to the
  // next top-level key or end of frontmatter.
  const lines = fm.split('\n');
  let name = '';
  let description = '';
  let inDesc = false;
  for (const line of lines) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (m && !line.startsWith(' ') && !line.startsWith('\t')) {
      inDesc = false;
      const key = m[1];
      const value = m[2].trim();
      if (key === 'name') name = value.replace(/^['"]|['"]$/g, '');
      if (key === 'description') {
        description = value.replace(/^['"]|['"]$/g, '');
        inDesc = true;
      }
    } else if (inDesc) {
      description += ' ' + line.trim().replace(/^['"]|['"]$/g, '');
    }
  }
  if (!name) return null;
  return { name, description };
}

function loadDescriptionTest(testPath: string): DescriptionTest {
  const raw = fs.readFileSync(testPath, 'utf-8');
  return JSON.parse(raw) as DescriptionTest;
}

const skills = listSkills();

describe('skill descriptions', () => {
  it('every skill directory carries a SKILL.md with a parseable name', () => {
    assert.ok(skills.length > 0, 'expected at least one skill under server/skills/');
    for (const s of skills) {
      const meta = readSkillDescription(s.skillMdPath);
      assert.ok(meta, `${s.name}: SKILL.md frontmatter unparseable or missing name`);
      assert.equal(meta.name, s.name, `${s.name}: directory name does not match frontmatter name`);
    }
  });

  for (const s of skills) {
    if (!s.testPath) continue;

    describe(s.name, () => {
      const test = loadDescriptionTest(s.testPath!);
      const meta = readSkillDescription(s.skillMdPath)!;

      it('has valid description-test.json schema', () => {
        assert.equal(typeof test.skill, 'string');
        assert.equal(test.skill, s.name, 'skill field must match directory name');
        assert.equal(test.skill, meta.name, 'skill field must match SKILL.md frontmatter name');
        assert.ok(Array.isArray(test.should_trigger));
        assert.ok(Array.isArray(test.should_not_trigger));
        assert.ok(test.should_trigger.length > 0, 'should_trigger must have at least one example');
        assert.ok(test.should_not_trigger.length > 0, 'should_not_trigger must have at least one example');
        assert.equal(typeof test.rationale, 'string');
        assert.ok(test.rationale.length > 0, 'rationale must be non-empty');
      });

      it('every example is a non-empty string', () => {
        for (const example of test.should_trigger) {
          assert.equal(typeof example, 'string');
          assert.ok(example.length > 0, `should_trigger example must be non-empty`);
        }
        for (const example of test.should_not_trigger) {
          assert.equal(typeof example, 'string');
          assert.ok(example.length > 0, `should_not_trigger example must be non-empty`);
        }
      });
    });
  }

  it('reports skills missing a description-test.json (non-fatal warning)', () => {
    const missing = skills.filter((s) => !s.testPath).map((s) => s.name);
    if (missing.length > 0) {
      // Print a warning but do not fail. We add description tests
      // incrementally; this surfaces the gap without blocking CI.
      console.log(
        `[skill-descriptions] WARN: ${missing.length} skill(s) lack evals/description-test.json: ${missing.join(', ')}`,
      );
    }
    // Always passes — the assertion is informational.
    assert.ok(true);
  });
});
