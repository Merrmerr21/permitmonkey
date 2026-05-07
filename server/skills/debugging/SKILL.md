---
name: debugging
description: "ALWAYS load when investigating bugs, failures, regressions, unexpected behavior, eval-fixture failures, or pipeline crashes. Enforces a reproduce-first investigation loop instead of guess-and-test. Triggers on the words 'bug', 'broken', 'failing', 'fails', 'regression', 'crashed', 'unexpected', 'why is', 'doesn't work', 'isn't working', 'error', or any failed test output. Activate before forming any hypothesis or proposing any code change."
---

# Debugging — Reproduce-First Investigation

The default failure mode without this skill is "guess and test" — modify code, run, observe, modify again. The pattern wastes time, corrupts the codebase with speculative changes, and frequently masks the real defect by accident. This skill replaces it with a structured investigation loop drawn from master playbook §213.

**Core rule: do not change any code until the root cause is identified.** Code changes are the LAST step, not the first.

## The six-step loop

### Step 1 — Reproduce the failure deterministically

Before reading code, before forming a hypothesis, reproduce the failure on demand. If the failure is intermittent, identify the conditions that make it deterministic (clock skew, race window, cold cache, specific input). If you cannot reproduce, the next thing you change is just as likely to make the bug appear "fixed" by chance — that is not a fix.

For PermitMonkey:
- Eval fixture failures: re-run the single fixture in isolation, capture the AgentRunner output, save under `active/debugging/<fixture>-<date>/`
- API errors: capture the exact curl invocation that triggers the error, including headers
- Frontend crashes: get the stack trace from the browser console; do not rely on the visual symptom
- Production incidents: pull the request ID from `x-request-id` header and locate the structured log line in Cloud Logging

### Step 2 — Read the failing code path end-to-end

Read every file the code path touches from entry to failure. Do not skim. The defect is usually somewhere on this path; reading it cold is the cheapest way to find it. Note any place where assumptions are made implicitly (e.g., "this function never returns null") that the bug suggests are violated.

### Step 3 — State the hypothesis explicitly

Write the hypothesis as a single sentence: "The bug is caused by X." Include a confidence level (low / medium / high) and the reasoning. Vague hypotheses ("something with the auth") produce vague experiments. Sharp hypotheses ("the JWT decoder is rejecting tokens with a leading zero in the user_id claim") produce targeted, falsifiable experiments.

If multiple hypotheses are plausible, list them. Pick the cheapest to falsify first.

### Step 4 — Predict what the next observation should show

Before running any test, log read, or print statement, write down what the result should be IF the hypothesis is correct, and what it should be IF the hypothesis is wrong. This is the most important step — it forces honesty about whether the next observation is actually informative.

If you cannot predict the result either way, the experiment is not pinning down the hypothesis. Pick a different experiment.

### Step 5 — Run the observation

Add a print, query the log, run the targeted test, hit the endpoint with the failing input. Capture the actual result.

### Step 6 — Compare prediction to observation

If the result matches the "hypothesis correct" prediction → you have the root cause. Proceed to fix.

If the result matches the "hypothesis wrong" prediction → return to Step 2 with the new information. Do NOT propose a fix based on a falsified hypothesis. Do NOT propose a fix that "would also handle this case just in case."

## Forbidden patterns

These are the moves that look productive but corrupt the investigation:

- **Speculative fixes.** "Maybe wrap this in a try/catch and see if the error goes away." Suppressing a symptom without identifying the cause turns one visible bug into many silent ones.
- **Shotgun debugging.** Adding 20 print statements before forming any hypothesis. Read first, predict, then add the one print that distinguishes between hypotheses.
- **Reverting plus retrying.** Reverting changes one at a time hoping the bug disappears does not produce a root cause; it produces a working build with an unknown defect waiting to resurface.
- **Blame-the-environment without proof.** "Must be a node version issue" without a concrete test that pins it to node version. Most "environment bugs" are real bugs that happen to surface in one environment.
- **Adding error handling as a fix.** Wrapping the failing call in error handling does not fix the bug — it hides it. Only add error handling once the root cause is understood and you have a deliberate decision about what the system should do when that condition occurs.

## When to escalate

Stop investigating and ask the user when:

- After 90 minutes of structured investigation, no hypothesis has been falsified or confirmed.
- The code path crosses a boundary you cannot read (closed-source dependency, third-party API behavior, database internals).
- The bug requires production data or production access you do not have.
- The fix would require a decision the user owns (architecture change, breaking change, API redesign).

When escalating, post the full investigation log: reproduction steps, hypotheses tried, observations recorded, what is still unknown. The user should be able to pick up where you left off without re-deriving the state.

## Output contract

When this skill is active, the agent's report on a debugging session must include:

1. **Reproduction**: the exact steps that produce the failure deterministically.
2. **Path read**: the files in the code path, top to bottom.
3. **Hypotheses tried**: each with prediction → observation → conclusion.
4. **Root cause**: a single sentence naming the defect, with file:line reference.
5. **Fix**: the minimal change that addresses the root cause, with reasoning for why this is the right scope.
6. **Lab Note candidate** (optional): if the bug class is one a future session should avoid, draft the Lab Note entry per `.claude/CLAUDE.md` Self-Annealing Protocol.

## Integration with PermitMonkey self-annealing

The CLAUDE.md Self-Annealing Protocol says "DIAGNOSE → FIX → UPDATE → DOCUMENT" when an error fires during any workflow. This skill is the structural enforcement of that protocol's first step. Every investigation that ends with a Lab Note added to `.claude/CLAUDE.md` is the loop closing correctly.
