import path from 'path';

// Resolve project roots from this file's location (src/utils/)
export const AGENTS_ROOT = path.resolve(import.meta.dirname, '../..');  // agents-permitmonkey/
export const PROJECT_ROOT = path.resolve(AGENTS_ROOT, '..');            // permitmonkey/

const PERMITMONKEY_PROMPT = `You are working on PermitMonkey, an ADU permit assistant for Massachusetts.
Massachusetts law (Chapter 150 of the Acts of 2024, amending MGL Ch 40A §§1A and 3) and 760 CMR 71.00 govern by-right ADUs statewide. Local bylaws retain authority over FORM (dimensional, setback, height, site plan review) within reasonableness limits; STATE preempts on USE (prohibition, special permit, owner-occupancy, parking).
Use available skills to research codes, analyze plans, and generate professional output. Every statute citation must resolve to a canonical source — never cite from memory.
Always write output files to the session directory provided in the prompt.`;

export const DEFAULT_TOOLS = [
  'Skill', 'Task', 'Read', 'Write', 'Edit',
  'Bash', 'Glob', 'Grep', 'WebSearch', 'WebFetch',
];

export type FlowConfig = {
  model?: string;
  maxTurns?: number;
  maxBudgetUsd?: number;
  allowedTools?: string[];
  systemPromptAppend?: string;
  abortController?: AbortController;
};

export function createQueryOptions(flow: FlowConfig = {}) {
  const systemAppend = flow.systemPromptAppend
    ? `${PERMITMONKEY_PROMPT}\n\n${flow.systemPromptAppend}`
    : PERMITMONKEY_PROMPT;

  return {
    tools: { type: 'preset' as const, preset: 'claude_code' as const },
    systemPrompt: {
      type: 'preset' as const,
      preset: 'claude_code' as const,
      append: systemAppend,
    },
    cwd: AGENTS_ROOT,
    settingSources: ['project' as const],
    permissionMode: 'bypassPermissions' as const,
    allowDangerouslySkipPermissions: true,
    allowedTools: flow.allowedTools ?? DEFAULT_TOOLS,
    additionalDirectories: [PROJECT_ROOT],
    maxTurns: flow.maxTurns ?? 80,
    maxBudgetUsd: flow.maxBudgetUsd ?? 15.00,
    model: flow.model ?? 'claude-opus-4-6',
    includePartialMessages: true,
    abortController: flow.abortController ?? new AbortController(),
  };
}
