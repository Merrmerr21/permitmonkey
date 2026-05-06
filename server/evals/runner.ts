/**
 * Runner abstraction: produces a RunOutput for a given Fixture.
 *
 * MockRunner returns canned markdown (per-fixture or constructor-default) so
 * the harness pipeline (discover → run → score → report) can be exercised
 * in CI without invoking the Agent SDK.
 *
 * AgentRunner spawns agents-permitmonkey/src/cli.ts as a subprocess. The
 * subprocess imports the relevant flow (runMAEligibility, etc.) and writes
 * the agent's canonical output file under a session directory; AgentRunner
 * reads that file back as RunOutput.raw_markdown. This bridge avoids
 * installing @anthropic-ai/claude-agent-sdk in server/ or converting the
 * repo to npm workspaces. Requires ANTHROPIC_API_KEY in env, and
 * `npm install` having been run in agents-permitmonkey/.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Fixture, RunOutput } from './types.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..');
const AGENT_CLI = path.join(REPO_ROOT, 'agents-permitmonkey', 'src', 'cli.ts');
const AGENT_SESSIONS = path.join(REPO_ROOT, 'agents-permitmonkey', 'sessions');

export interface Runner {
  run(fixture: Fixture): Promise<RunOutput>;
}

export class MockRunner implements Runner {
  readonly cannedMarkdown: string;

  constructor(cannedMarkdown: string) {
    this.cannedMarkdown = cannedMarkdown;
  }

  async run(fixture: Fixture): Promise<RunOutput> {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 5));
    return {
      fixture_id: fixture.id,
      raw_markdown: fixture.mock_output ?? this.cannedMarkdown,
      duration_ms: Date.now() - start,
      cost_usd: 0,
      turns: 1,
      agent_errors: [],
    };
  }
}

export class AgentRunner implements Runner {
  async run(fixture: Fixture): Promise<RunOutput> {
    const start = Date.now();
    const errors: string[] = [];

    const fixturePath = await materializeFixtureFile(fixture);
    const sessionDir = path.join(
      AGENT_SESSIONS,
      `eval-${fixture.id}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`,
    );

    let stdout = '';
    let stderr = '';
    let exitCode: number | null = null;

    try {
      ({ stdout, stderr, exitCode } = await spawnCli([
        '--experimental-strip-types',
        AGENT_CLI,
        '--fixture',
        fixturePath,
        '--session-dir',
        sessionDir,
      ]));
    } catch (err) {
      errors.push(`spawn failed: ${(err as Error).message}`);
      return makeFailure(fixture, start, errors);
    }

    const lastLine = stdout.trim().split('\n').pop() ?? '';
    let parsed: { ok: boolean; agent_output_path?: string; error?: string } | null = null;
    try {
      parsed = JSON.parse(lastLine);
    } catch {
      errors.push(`agent CLI did not emit JSON; last stdout line: ${lastLine.slice(0, 200)}`);
    }
    if (stderr.trim()) errors.push(`agent CLI stderr: ${stderr.trim().slice(0, 500)}`);

    if (!parsed || !parsed.ok || !parsed.agent_output_path) {
      errors.push(parsed?.error ?? `agent CLI exit code ${exitCode}`);
      return makeFailure(fixture, start, errors);
    }

    let raw_markdown = '';
    try {
      raw_markdown = await fsp.readFile(parsed.agent_output_path, 'utf-8');
    } catch (err) {
      errors.push(`could not read agent output ${parsed.agent_output_path}: ${(err as Error).message}`);
      return makeFailure(fixture, start, errors);
    }

    return {
      fixture_id: fixture.id,
      raw_markdown,
      duration_ms: Date.now() - start,
      cost_usd: null,
      turns: 0,
      agent_errors: errors,
    };
  }
}

async function materializeFixtureFile(fixture: Fixture): Promise<string> {
  // The fixture object on disk is already at server/evals/fixtures/<id>/fixture.json,
  // but discoverFixtures() loaded only the parsed JSON, not the path. Round-trip
  // through a temp file so the CLI gets a stable path regardless of source.
  const tmpDir = path.join(REPO_ROOT, 'server', 'evals', 'reports');
  await fsp.mkdir(tmpDir, { recursive: true });
  const tmpFile = path.join(tmpDir, `_agent-fixture-${fixture.id}.json`);
  await fsp.writeFile(tmpFile, JSON.stringify(fixture), 'utf-8');
  return tmpFile;
}

function makeFailure(fixture: Fixture, start: number, errors: string[]): RunOutput {
  return {
    fixture_id: fixture.id,
    raw_markdown: '',
    duration_ms: Date.now() - start,
    cost_usd: null,
    turns: 0,
    agent_errors: errors.length ? errors : ['agent run produced no output'],
  };
}

interface SpawnResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

function spawnCli(args: string[]): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(AGENT_CLI)) {
      reject(new Error(`agent CLI not found at ${AGENT_CLI}`));
      return;
    }
    const child = spawn('node', args, {
      cwd: path.dirname(path.dirname(AGENT_CLI)),
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (b: Buffer) => { stdout += b.toString('utf-8'); });
    child.stderr.on('data', (b: Buffer) => { stderr += b.toString('utf-8'); });
    child.on('error', reject);
    child.on('close', (code) => resolve({ stdout, stderr, exitCode: code }));
  });
}

export function selectRunner(mode: 'mock' | 'agent', cannedMarkdown = ''): Runner {
  return mode === 'mock' ? new MockRunner(cannedMarkdown) : new AgentRunner();
}
