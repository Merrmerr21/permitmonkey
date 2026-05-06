/**
 * Pure pricing helper for agent runs. No external dependencies — separated
 * from cost-telemetry.ts (which imports Supabase) so unit tests can run
 * under `node --experimental-strip-types --test` without resolving the
 * runtime `.js` paths.
 *
 * Pricing as of 2026-05-05; update when Anthropic publishes new rates.
 */

interface ModelRates {
  /** USD per 1M input tokens (fresh, not cache-read). */
  input: number;
  /** USD per 1M output tokens. */
  output: number;
  /** USD per 1M cache-read tokens; typically a heavy discount on `input`. */
  cacheRead: number;
  /** USD per 1M cache-write tokens; typically 1.25× of `input`. */
  cacheWrite: number;
}

const RATES_PER_M: Record<string, ModelRates> = {
  'claude-opus-4-7': { input: 15, output: 75, cacheRead: 1.5, cacheWrite: 18.75 },
  'claude-sonnet-4-6': { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  'claude-haiku-4-5': { input: 1, output: 5, cacheRead: 0.1, cacheWrite: 1.25 },
};

interface EstimateInputs {
  modelUsed: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
}

/**
 * Estimate USD cost from token counts. Falls back to Sonnet rates for
 * unknown model strings — close enough for trend monitoring and
 * forward-compatible with new model ids.
 */
export function estimateCostUsd(args: EstimateInputs): number {
  const rates = RATES_PER_M[args.modelUsed] ?? RATES_PER_M['claude-sonnet-4-6'];

  const cost =
    (args.inputTokens * rates.input) / 1_000_000 +
    (args.outputTokens * rates.output) / 1_000_000 +
    ((args.cacheReadTokens ?? 0) * rates.cacheRead) / 1_000_000 +
    ((args.cacheWriteTokens ?? 0) * rates.cacheWrite) / 1_000_000;

  // Round to 4 decimal places to match the numeric(10, 4) column in
  // permitmonkey.agent_runs.cost_usd.
  return Math.round(cost * 10_000) / 10_000;
}
