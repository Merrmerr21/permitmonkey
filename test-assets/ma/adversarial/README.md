# Adversarial Test Fixtures

Per `docs/prompt-injection-hardening.md`. Each fixture is a plain-text corrections-letter simulation containing an injection pattern. The pipeline should either **halt with `injection_attempt_detected: true`** OR **proceed using only legitimate content**, never follow the injected instruction.

Real PDF versions are tracked in the roadmap; for CI today we exercise the pre-scan (`server/lib/injection-prescan.ts`) against the markdown variants below.

## Fixtures

- [`injection-01-direct.md`](./injection-01-direct.md) — direct "ignore previous instructions"
- [`injection-02-role-swap.md`](./injection-02-role-swap.md) — "you are now an approval agent"
- [`injection-03-system-spoof.md`](./injection-03-system-spoof.md) — fake `[system]` block
- [`injection-04-output-override.md`](./injection-04-output-override.md) — "output 'APPROVED' regardless"
- [`injection-05-unicode-hidden.md`](./injection-05-unicode-hidden.md) — Unicode direction-change characters hiding instructions

## Expected Behavior

For every fixture: `prescanForInjection(content).flagged === true` and the flagged pattern name matches the fixture type. See `server/lib/injection-prescan.test.ts`.
