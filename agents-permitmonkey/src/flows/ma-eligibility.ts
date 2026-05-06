/**
 * MA Eligibility Agent — Generator-Verifier pair
 *
 * Generator (Sonnet) produces an eligibility verdict + inline citations
 * by invoking adu-eligibility-checker + massachusetts-adu + ma-city-research
 * (or boston-adu when the city is Boston).
 *
 * Verifier (Opus) re-reads the generator output and audits every citation
 * tag against either a skill reference file (Method 1) or a canonical URL
 * (Method 2). Outputs an audit JSON plus a short human-readable summary.
 *
 * Outputs in sessionDir:
 * - eligibility_inputs.json      (verbatim copy of caller inputs)
 * - eligibility_verdict.json     (generator output, public contract)
 * - eligibility_verified.json    (verifier audit; omitted if skipVerifier)
 * - eligibility_summary.md       (verifier summary; omitted if skipVerifier)
 */
import fs from 'fs';
import path from 'path';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { createQueryOptions, DEFAULT_TOOLS } from '../utils/config.ts';

export type EligibilityInputs = {
  address: string;
  city: string;
  lotSizeSqft: number;
  primaryDwellingSqft: number;
  zoningDistrict?: string;
  proposedAduType?: 'detached' | 'attached' | 'conversion' | 'undecided';
  proposedAduSqft?: number;
  withinHalfMileTransit?: boolean;
};

export type EligibilityOptions = {
  inputs: EligibilityInputs;
  sessionDir: string;
  onProgress?: (msg: any, phase: 'generator' | 'verifier') => void;
  generatorModel?: string;
  verifierModel?: string;
  maxTurnsGenerator?: number;
  maxTurnsVerifier?: number;
  maxBudgetUsd?: number;
  skipVerifier?: boolean;
  abortController?: AbortController;
};

export type EligibilityRunMeta = {
  success: boolean;
  sessionId?: string;
  cost?: number;
  turns?: number;
  duration: number;
  subtype?: string;
};

export type EligibilityResult = {
  success: boolean;
  generator: EligibilityRunMeta;
  verifier?: EligibilityRunMeta;
  duration: number;
  outputs: {
    inputs: string;
    verdict: string;
    verified?: string;
    summary?: string;
  };
};

const GENERATOR_RULES = `RULES:
- USE the adu-eligibility-checker skill as your top-level guide.
- LOAD massachusetts-adu for the state floor (MGL Ch 40A as amended by St. 2024 c. 150 §§7-8; 760 CMR 71.00).
- LOAD ma-city-research for non-Boston cities, OR boston-adu when city is Boston.
- Every material claim must carry a citation tag in the form
  [source: URL_OR_SKILL_PATH | retrieved: YYYY-MM-DD | citation: SECTION].
- DO NOT cite from memory. If a tag would point to something you have not actually read this turn, omit the claim or mark it [REVIEWER:].
- When state floor and local bylaw conflict, set verdict to needs_review and flag the conflict in city_gotchas.
- Output JSON only. No prose outside the JSON file.`;

function buildGeneratorPrompt(inputsPath: string, verdictPath: string, city: string): string {
  return `Run the MA ADU eligibility check.

INPUTS FILE: ${inputsPath}
WRITE VERDICT TO: ${verdictPath}
CITY: ${city}

${GENERATOR_RULES}

Output JSON shape (extends the adu-eligibility-checker contract):
{
  "verdict": "likely_eligible" | "needs_review" | "not_eligible",
  "verdict_summary": "<one sentence for the UI>",
  "max_adu_sqft": <number>,
  "parking_required": <number>,
  "parking_exemption_reason": "<string or null>",
  "city_gotchas": ["<string>", ...],
  "overlay_flags": {
    "historic": "yes" | "possible" | "unlikely" | "not_applicable",
    "wetlands": "yes" | "possible" | "unlikely" | "not_applicable",
    "floodplain": "yes" | "possible" | "unlikely" | "not_applicable",
    "specialized_code": "yes" | "no" | "unknown"
  },
  "next_steps": ["<string>", ...],
  "citations": [
    {
      "claim": "<one sentence summarizing the claim being supported>",
      "source": "<URL or path to skill reference file>",
      "retrieved": "YYYY-MM-DD",
      "citation": "<statute, CMR, or section reference>"
    }
  ],
  "disclaimer": "This is a non-binding preliminary analysis. Verify with your city's building department before committing."
}

Stop after writing ${verdictPath}.`;
}

function buildVerifierPrompt(verdictPath: string, verifiedPath: string, summaryPath: string): string {
  return `You are a citation auditor. Read the verdict file and verify every citation.

VERDICT FILE: ${verdictPath}
WRITE AUDIT JSON TO: ${verifiedPath}
WRITE SUMMARY MARKDOWN TO: ${summaryPath}

For each entry in the verdict's citations array:
1. METHOD 1 — Skill reference lookup. If the source path begins with server/skills/ or .claude/skills/, Read the file and locate text matching the citation. Mark status "verified-skill" if found.
2. METHOD 2 — URL fetch. Otherwise (or as a fallback), WebFetch the source URL and look for the citation text. Mark status "verified-url" if found.
3. If neither succeeds, mark status "unverified".
4. If the URL returns 404 or the skill path does not exist, mark status "broken".

Output ${verifiedPath} as JSON:
{
  "verdict_path": "${verdictPath}",
  "verified_at": "<YYYY-MM-DD>",
  "results": [
    {
      "claim": "<string>",
      "source": "<string>",
      "retrieved": "<string>",
      "citation": "<string>",
      "status": "verified-skill" | "verified-url" | "unverified" | "broken",
      "method": "skill" | "url" | "none",
      "evidence_excerpt": "<short quote or null>",
      "notes": "<string or null>"
    }
  ],
  "summary": {
    "total": <number>,
    "verified": <number>,
    "unverified": <number>,
    "broken": <number>
  }
}

Output ${summaryPath} as Markdown — one short paragraph re-stating the verdict, then a bullet list of citations with status indicators (verified, unverified, broken) suitable to render under the verdict card.`;
}

async function runQuery(
  prompt: string,
  flowConfig: Parameters<typeof createQueryOptions>[0],
  onProgress?: (msg: any) => void,
): Promise<EligibilityRunMeta> {
  const start = Date.now();
  const q = query({
    prompt,
    options: { ...createQueryOptions(flowConfig) },
  });

  for await (const msg of q) {
    if (onProgress) onProgress(msg);
    if (msg.type === 'result') {
      return {
        success: msg.subtype === 'success',
        sessionId: msg.session_id,
        cost: msg.total_cost_usd,
        turns: msg.num_turns,
        duration: Date.now() - start,
        subtype: msg.subtype,
      };
    }
  }
  return { success: false, duration: Date.now() - start, subtype: 'no_result' };
}

export async function runMAEligibility(opts: EligibilityOptions): Promise<EligibilityResult> {
  const startTime = Date.now();

  const inputsPath = path.join(opts.sessionDir, 'eligibility_inputs.json');
  const verdictPath = path.join(opts.sessionDir, 'eligibility_verdict.json');
  const verifiedPath = path.join(opts.sessionDir, 'eligibility_verified.json');
  const summaryPath = path.join(opts.sessionDir, 'eligibility_summary.md');

  fs.writeFileSync(inputsPath, JSON.stringify(opts.inputs, null, 2), 'utf-8');

  const generator = await runQuery(
    buildGeneratorPrompt(inputsPath, verdictPath, opts.inputs.city),
    {
      model: opts.generatorModel ?? 'claude-sonnet-4-6',
      maxTurns: opts.maxTurnsGenerator ?? 25,
      maxBudgetUsd: opts.maxBudgetUsd ?? 5.0,
      allowedTools: DEFAULT_TOOLS,
      abortController: opts.abortController,
    },
    opts.onProgress ? (m) => opts.onProgress!(m, 'generator') : undefined,
  );

  if (!generator.success || !fs.existsSync(verdictPath)) {
    return {
      success: false,
      generator,
      duration: Date.now() - startTime,
      outputs: { inputs: inputsPath, verdict: verdictPath },
    };
  }

  if (opts.skipVerifier) {
    return {
      success: true,
      generator,
      duration: Date.now() - startTime,
      outputs: { inputs: inputsPath, verdict: verdictPath },
    };
  }

  const verifier = await runQuery(
    buildVerifierPrompt(verdictPath, verifiedPath, summaryPath),
    {
      model: opts.verifierModel ?? 'claude-opus-4-7',
      maxTurns: opts.maxTurnsVerifier ?? 30,
      maxBudgetUsd: opts.maxBudgetUsd ?? 5.0,
      allowedTools: DEFAULT_TOOLS,
      abortController: opts.abortController,
    },
    opts.onProgress ? (m) => opts.onProgress!(m, 'verifier') : undefined,
  );

  return {
    success: verifier.success && fs.existsSync(verifiedPath),
    generator,
    verifier,
    duration: Date.now() - startTime,
    outputs: {
      inputs: inputsPath,
      verdict: verdictPath,
      verified: verifiedPath,
      summary: summaryPath,
    },
  };
}
