/**
 * Cost telemetry write helper.
 *
 * Each agent run (eligibility, corrections-analysis, corrections-response,
 * plan-review) calls `recordAgentRun` with its outcome and token counts.
 * Reads roll up via the `agent_runs_weekly` view (migration 0004) which
 * powers the §80 cost-monitoring routine and the §217 cache-hit-rate
 * discipline.
 *
 * Failures are logged but never thrown — telemetry should not crash the
 * primary agent flow if Supabase is briefly unreachable.
 */
import { supabase } from './supabase.js';
import {
  agentRunCounter,
  agentRunDuration,
  agentTokenCounter,
} from './metrics-store.js';
export { estimateCostUsd } from './cost-pricing.js';

export type AgentRunOutcome = 'completed' | 'failed' | 'timeout';

export interface AgentRunRecord {
  projectId?: string;            // null for free-tool runs (eligibility checker)
  flowType: string;              // 'eligibility-check' | 'corrections-analysis' | ...
  outcome: AgentRunOutcome;
  modelUsed: string;             // e.g. 'claude-opus-4-7' or 'claude-sonnet-4-6'
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  costUsd?: number;
  errorMessage?: string;
}

export async function recordAgentRun(record: AgentRunRecord): Promise<void> {
  // Fire the in-process Prometheus counters first so /metrics reflects the
  // run even if the Supabase write fails.
  agentRunCounter.inc({
    flow_type: record.flowType,
    outcome: record.outcome,
    model: record.modelUsed,
  });
  agentRunDuration.observe(record.durationMs, {
    flow_type: record.flowType,
    model: record.modelUsed,
  });
  if (record.inputTokens) {
    agentTokenCounter.inc(
      { flow_type: record.flowType, kind: 'input' },
      record.inputTokens,
    );
  }
  if (record.outputTokens) {
    agentTokenCounter.inc(
      { flow_type: record.flowType, kind: 'output' },
      record.outputTokens,
    );
  }
  if (record.cacheReadTokens) {
    agentTokenCounter.inc(
      { flow_type: record.flowType, kind: 'cache_read' },
      record.cacheReadTokens,
    );
  }
  if (record.cacheWriteTokens) {
    agentTokenCounter.inc(
      { flow_type: record.flowType, kind: 'cache_write' },
      record.cacheWriteTokens,
    );
  }

  // Then write the durable row to Supabase. Service-role client; bypasses
  // RLS by design (the table is owner-readable but service-role-write only).
  try {
    const { error } = await supabase
      .schema('permitmonkey')
      .from('agent_runs')
      .insert({
        project_id: record.projectId ?? null,
        flow_type: record.flowType,
        outcome: record.outcome,
        model_used: record.modelUsed,
        duration_ms: record.durationMs,
        input_tokens: record.inputTokens ?? 0,
        output_tokens: record.outputTokens ?? 0,
        cache_read_tokens: record.cacheReadTokens ?? 0,
        cache_write_tokens: record.cacheWriteTokens ?? 0,
        cost_usd: record.costUsd ?? 0,
        error_message: record.errorMessage ?? null,
      });

    if (error) {
      // Don't throw — telemetry must not block the primary flow.
      process.stdout.write(
        JSON.stringify({
          severity: 'WARNING',
          message: 'agent_runs insert failed',
          error: error.message,
          flow_type: record.flowType,
        }) + '\n',
      );
    }
  } catch (err) {
    process.stdout.write(
      JSON.stringify({
        severity: 'WARNING',
        message: 'agent_runs insert threw',
        error: err instanceof Error ? err.message : String(err),
        flow_type: record.flowType,
      }) + '\n',
    );
  }
}

