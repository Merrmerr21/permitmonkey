/**
 * Runner abstraction: produces a RunOutput for a given Fixture.
 *
 * MockRunner returns a canned response so the harness pipeline (discover →
 * run → score → report) can be exercised in CI without invoking the real
 * Agent SDK. Real evals use AgentRunner, which wraps query() from the
 * Agent SDK; that path is gated by ANTHROPIC_API_KEY and is not run in CI
 * by default.
 *
 * AgentRunner is a stub at skeleton stage — wire to runCorrectionsAnalysis()
 * (agents-permitmonkey/src/flows/corrections-analysis.ts) once a Boston
 * fixture is approved into test-assets/ma/boston/.
 */

import type { Fixture, RunOutput } from './types.ts';

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
    return {
      fixture_id: fixture.id,
      raw_markdown: '',
      duration_ms: Date.now() - start,
      cost_usd: null,
      turns: 0,
      agent_errors: [
        // Cross-package wiring (server/ → agents-permitmonkey/) needs an npm workspace
        // setup or a build-artifact bridge. Kind-routed dispatch landed in fixtures —
        // - eligibility-check → runMAEligibility
        // - corrections-letter → runCorrectionsAnalysis
        // - plan-review → runPlanReview
        // — but actual import remains pending the workspace decision.
        `AgentRunner not yet wired for kind=${fixture.kind}. Mock mode covers the scoring pipeline; agent mode lands when the cross-package import path is decided.`,
      ],
    };
  }
}

export function selectRunner(mode: 'mock' | 'agent', cannedMarkdown = ''): Runner {
  return mode === 'mock' ? new MockRunner(cannedMarkdown) : new AgentRunner();
}
