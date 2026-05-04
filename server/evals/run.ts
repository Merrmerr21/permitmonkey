/**
 * Eval harness entry point.
 *
 * Discovers fixtures under server/evals/fixtures/, runs each through the
 * selected Runner (mock by default, agent when --mode=agent), scores each
 * output, and writes a JSON report to server/evals/reports/<timestamp>.json.
 *
 * Usage:
 *   npm run eval                    # mock mode, default
 *   npm run eval -- --mode=agent    # real Agent SDK invocation (requires creds)
 *   npm run eval -- --filter=<id>   # run a single fixture by id
 *
 * The harness always exits 0 unless invoked with --strict, in which case
 * citation_precision_p50 < 0.95 OR verdict_accuracy < 0.9 fails the run.
 * --strict is intended for the CI gate once fixtures exist.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import type { Fixture, FixtureScore, RunReport } from './types.ts';
import { scoreRun, percentile } from './score.ts';
import { selectRunner } from './runner.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(HERE, 'fixtures');
const REPORTS_DIR = path.join(HERE, 'reports');

interface CliOptions {
  mode: 'mock' | 'agent';
  filter?: string;
  strict: boolean;
  cannedMarkdown: string;
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const fixtures = await discoverFixtures();
  const filtered = opts.filter ? fixtures.filter((f) => f.id === opts.filter) : fixtures;

  console.log(
    `[evals] mode=${opts.mode} fixtures_found=${fixtures.length} fixtures_run=${filtered.length}`,
  );

  const runner = selectRunner(opts.mode, opts.cannedMarkdown);
  const scores: FixtureScore[] = [];
  for (const fx of filtered) {
    const output = await runner.run(fx);
    const score = await scoreRun(fx, output);
    scores.push(score);
    console.log(
      `[evals] ${fx.id} precision=${score.citation_precision.ratio.toFixed(2)} ` +
        `recall=${score.citation_recall.ratio.toFixed(2)} ` +
        `verdict=${score.verdict_match} ` +
        `duration_ms=${score.duration_ms}`,
    );
  }

  const report = buildReport(opts.mode, fixtures.length, scores);
  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const reportPath = path.join(REPORTS_DIR, `${report.timestamp}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`[evals] report written: ${path.relative(process.cwd(), reportPath)}`);

  if (opts.strict) {
    const failed = report.citation_precision_p50 < 0.95 || report.verdict_accuracy < 0.9;
    if (failed) {
      console.error(
        `[evals] STRICT FAIL: precision_p50=${report.citation_precision_p50} verdict_accuracy=${report.verdict_accuracy}`,
      );
      process.exit(1);
    }
  }
}

async function discoverFixtures(): Promise<Fixture[]> {
  const out: Fixture[] = [];
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(FIXTURES_DIR, { withFileTypes: true });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return [];
    throw err;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fixturePath = path.join(FIXTURES_DIR, entry.name, 'fixture.json');
    try {
      const raw = await fs.readFile(fixturePath, 'utf-8');
      out.push(JSON.parse(raw) as Fixture);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        console.warn(`[evals] could not load ${fixturePath}: ${(err as Error).message}`);
      }
    }
  }
  return out;
}

function buildReport(
  mode: 'mock' | 'agent',
  total: number,
  scores: FixtureScore[],
): RunReport {
  const precisions = scores.map((s) => s.citation_precision.ratio);
  const recalls = scores.map((s) => s.citation_recall.ratio);
  const latencies = scores.map((s) => s.duration_ms);
  const verdictMatches = scores.filter((s) => s.verdict_match !== null);
  const verdictAccuracy =
    verdictMatches.length === 0
      ? 1
      : verdictMatches.filter((s) => s.verdict_match === true).length / verdictMatches.length;
  const totalCost = scores.reduce((sum, s) => sum + (s.cost_usd ?? 0), 0);

  return {
    timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
    git_sha: gitSha(),
    mode,
    fixtures_total: total,
    fixtures_run: scores.length,
    citation_precision_p50: percentile(precisions, 50),
    citation_recall_p50: percentile(recalls, 50),
    verdict_accuracy: verdictAccuracy,
    latency_p50_ms: percentile(latencies, 50),
    latency_p95_ms: percentile(latencies, 95),
    total_cost_usd: totalCost,
    scores,
  };
}

function gitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { mode: 'mock', strict: false, cannedMarkdown: defaultCannedMarkdown() };
  for (const arg of argv) {
    if (arg === '--strict') opts.strict = true;
    else if (arg.startsWith('--mode=')) {
      const value = arg.slice('--mode='.length);
      if (value !== 'mock' && value !== 'agent') {
        throw new Error(`invalid --mode=${value}; expected mock|agent`);
      }
      opts.mode = value;
    } else if (arg.startsWith('--filter=')) {
      opts.filter = arg.slice('--filter='.length);
    } else if (arg.startsWith('--canned=')) {
      opts.cannedMarkdown = arg.slice('--canned='.length);
    }
  }
  return opts;
}

function defaultCannedMarkdown(): string {
  // Excerpt is verbatim from server/skills/massachusetts-adu/references/chapter-150-of-2024.md
  // so Method 1 (skill reference lookup) verifies in mock mode without network access.
  return (
    'The proposed ADU is by-right under Massachusetts state law. ' +
    'This is the legal definition that every municipal bylaw must now work from. ' +
    '[source: https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150 | retrieved: 2026-04-22 | citation: St. 2024, c. 150, §8]'
  );
}

main().catch((err) => {
  console.error('[evals] fatal:', err);
  process.exit(1);
});
