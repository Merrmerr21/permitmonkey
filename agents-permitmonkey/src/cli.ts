/**
 * Agent CLI bridge for the eval harness.
 *
 * The eval harness lives in server/ and the agent flows live here. We don't
 * want to install @anthropic-ai/claude-agent-sdk in server/, and we don't
 * want to convert the repo to npm workspaces just for this one bridge. So
 * server's AgentRunner spawns this CLI as a subprocess.
 *
 * Usage:
 *   node --experimental-strip-types src/cli.ts \
 *     --fixture <path/to/fixture.json> \
 *     --session-dir <path/to/agents-permitmonkey/sessions/...>
 *
 * Reads the fixture JSON, dispatches by kind, runs the flow, prints a
 * single line of JSON to stdout: { ok, agent_output_path, error? }.
 *
 * Each flow writes its own output files under sessionDir; the CLI tells the
 * caller which file contains the canonical agent markdown. The caller reads
 * that file and uses its contents as RunOutput.raw_markdown.
 */
import fs from 'node:fs';
import path from 'node:path';
import { runMAEligibility, type EligibilityInputs } from './flows/ma-eligibility.ts';

interface FixtureFile {
  id: string;
  kind: 'eligibility-check' | 'corrections-letter' | 'plan-review';
  input: {
    prompt: string;
    plans_path?: string;
    correction_letter_path?: string;
    eligibility?: EligibilityInputs & { lot_size_sqft?: number; primary_dwelling_sqft?: number };
  };
}

interface CliResult {
  ok: boolean;
  fixture_id: string;
  agent_output_path?: string;
  error?: string;
}

async function main(): Promise<CliResult> {
  const args = parseArgs(process.argv.slice(2));
  const fixtureRaw = await fs.promises.readFile(args.fixture, 'utf-8');
  const fixture = JSON.parse(fixtureRaw) as FixtureFile;
  await fs.promises.mkdir(args.sessionDir, { recursive: true });

  switch (fixture.kind) {
    case 'eligibility-check':
      return runEligibility(fixture, args.sessionDir);
    case 'corrections-letter':
      return notImplemented(fixture.id, 'corrections-letter');
    case 'plan-review':
      return notImplemented(fixture.id, 'plan-review');
    default:
      return {
        ok: false,
        fixture_id: fixture.id,
        error: `unknown kind: ${(fixture as { kind: string }).kind}`,
      };
  }
}

async function runEligibility(fixture: FixtureFile, sessionDir: string): Promise<CliResult> {
  const e = fixture.input.eligibility;
  if (!e) {
    return { ok: false, fixture_id: fixture.id, error: 'fixture.input.eligibility is missing' };
  }

  const inputs: EligibilityInputs = {
    address: e.address,
    city: e.city,
    lotSizeSqft: e.lotSizeSqft ?? e.lot_size_sqft ?? 0,
    primaryDwellingSqft: e.primaryDwellingSqft ?? e.primary_dwelling_sqft ?? 0,
    zoningDistrict: e.zoningDistrict ?? (e as { zoning_district?: string }).zoning_district,
    proposedAduType: e.proposedAduType ?? (e as { proposed_adu_type?: EligibilityInputs['proposedAduType'] }).proposed_adu_type,
    proposedAduSqft: e.proposedAduSqft ?? (e as { proposed_adu_sqft?: number }).proposed_adu_sqft,
    withinHalfMileTransit: e.withinHalfMileTransit ?? (e as { within_half_mile_transit?: boolean }).within_half_mile_transit,
  };

  const result = await runMAEligibility({ inputs, sessionDir });
  if (!result.success) {
    return {
      ok: false,
      fixture_id: fixture.id,
      error: `runMAEligibility failed; generator subtype=${result.generator.subtype}, verifier subtype=${result.verifier?.subtype ?? 'n/a'}`,
    };
  }
  return {
    ok: true,
    fixture_id: fixture.id,
    agent_output_path: result.outputs.summary ?? result.outputs.verdict,
  };
}

function notImplemented(fixtureId: string, kind: string): CliResult {
  return {
    ok: false,
    fixture_id: fixtureId,
    error: `agent CLI dispatch for kind=${kind} is not yet wired (needs PDF test assets); use --mode=mock for this fixture`,
  };
}

function parseArgs(argv: string[]): { fixture: string; sessionDir: string } {
  let fixture: string | undefined;
  let sessionDir: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--fixture') fixture = argv[++i];
    else if (argv[i] === '--session-dir') sessionDir = argv[++i];
  }
  if (!fixture) throw new Error('--fixture <path> is required');
  if (!sessionDir) throw new Error('--session-dir <path> is required');
  return { fixture: path.resolve(fixture), sessionDir: path.resolve(sessionDir) };
}

main()
  .then((res) => {
    process.stdout.write(JSON.stringify(res) + '\n');
    process.exit(res.ok ? 0 : 1);
  })
  .catch((err) => {
    process.stdout.write(
      JSON.stringify({ ok: false, fixture_id: 'unknown', error: (err as Error).message }) + '\n',
    );
    process.exit(1);
  });
