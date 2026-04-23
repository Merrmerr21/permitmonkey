/**
 * Layer 3 pre-scan for prompt-injection patterns in uploaded corrections letters.
 *
 * Per docs/prompt-injection-hardening.md. Runs before the main pipeline; output
 * informs the Planner whether to halt with injection_attempt_detected=true or
 * proceed with heightened system-prompt discipline.
 *
 * This is a regex-first deterministic pass. A Haiku LLM pass may be added later
 * for ambiguous cases, but regex catches >95% of known patterns cheaply.
 */

export type InjectionPattern =
  | 'direct_override'
  | 'role_swap'
  | 'system_spoof'
  | 'output_override'
  | 'unicode_hidden';

export interface InjectionHit {
  pattern: InjectionPattern;
  evidence: string;
}

export interface PrescanResult {
  flagged: boolean;
  hits: InjectionHit[];
}

const PATTERNS: Array<{ pattern: InjectionPattern; rx: RegExp }> = [
  { pattern: 'direct_override', rx: /\b(ignore|disregard)\s+(the\s+)?(previous|prior|above|all)\s+(instructions?|directives?|content|items)\b/i },
  { pattern: 'direct_override', rx: /\bdisregard\s+items?\s+above\b/i },
  { pattern: 'role_swap', rx: /\byou\s+are\s+now\s+(an?\s+)?(approval|admin|system|new)\b/i },
  { pattern: 'role_swap', rx: /\byour\s+new\s+role\s+is\b/i },
  { pattern: 'system_spoof', rx: /\[\s*\/?\s*system\s*\]/i },
  { pattern: 'system_spoof', rx: /^\s*system\s*:/im },
  { pattern: 'system_spoof', rx: /\bnew\s+directive\s*:/i },
  { pattern: 'output_override', rx: /\boutput\s+['"`][A-Z ]+['"`]\s+(regardless|no matter|anyway)/i },
  { pattern: 'output_override', rx: /\bstop\s+processing\b/i },
  { pattern: 'output_override', rx: /\b(approve|mark)\s+.{0,40}\s+(without|no)\s+(further\s+)?(review|analysis)\b/i },
  { pattern: 'unicode_hidden', rx: /[‪-‮⁦-⁩]/ },
];

export function prescanForInjection(content: string): PrescanResult {
  const hits: InjectionHit[] = [];
  for (const { pattern, rx } of PATTERNS) {
    const match = content.match(rx);
    if (match) {
      hits.push({
        pattern,
        evidence: (match[0] ?? '').slice(0, 120),
      });
    }
  }
  return { flagged: hits.length > 0, hits };
}
