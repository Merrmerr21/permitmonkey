# Privacy Policy

_Last updated: 2026-05-05. This document is plain-English boilerplate authored
by the operator and has not been reviewed by counsel; if you operate a
production deployment, replace it with a counsel-reviewed version before
inviting paying users._

PermitMonkey ("we," "the service") helps Massachusetts construction
professionals research zoning, generate permit checklists, and draft responses
to plan-check corrections. This policy explains what data we handle, why, and
how long we keep it.

## What we collect

**Account data.** When you sign up, Supabase (our auth and database provider)
stores your email, hashed password, and a generated user ID.

**Project uploads.** When you start a corrections job or eligibility check, you
may upload:

- Architectural plan binders (PDF) — may contain owner names, property
  addresses, contractor license numbers, and engineer stamps.
- Plan-check corrections letters (PDF) — issued by municipal plan checkers,
  may reference the same identifying information.
- Free-form text (project address, contractor notes).

**Generated outputs.** Agent-produced response letters, checklists, and
citation reports tied to your project ID.

**Operational telemetry.** Request timestamps, latencies, error codes, and
agent run metadata (token counts, model used, duration). We do not log raw
plan bytes or corrections-letter contents in our application logs.

We do not collect device identifiers, GPS, or marketing identifiers.

## How we use it

- **Primary use.** Run the agents that produce your eligibility verdicts,
  checklists, and corrections responses.
- **Service improvement.** Aggregated, non-identifying telemetry (latency,
  error rate, citation precision) shapes the eval harness and cost monitoring.
  We never train models on your uploads.
- **Security.** Detect abuse and rate-limit anonymous traffic.

## Where it goes

- **Supabase.** Database rows, auth, and Storage buckets. RLS isolates each
  user's rows; service-role writes are limited to the orchestrator.
- **Anthropic.** Plan content and prompts are sent to the Claude API for agent
  inference. Anthropic's commercial terms apply zero data retention by default
  for our usage tier — meaning Anthropic does not retain prompts or completions
  beyond the inference call.
- **Vercel.** Hosts the frontend and the ephemeral Vercel Sandbox in which
  agent runs execute. Sandbox filesystems are destroyed at end of run.
- **Google Cloud Run.** Hosts the Express orchestrator. Standard Cloud Run
  request logs (URL, status, latency) retained per Google's defaults.

We do not sell your data to third parties. We do not share your data with
advertisers. We do not have any current third-party data-processing
relationships beyond the four above.

## Retention

- **Project uploads** are retained as long as the project exists in your
  account. Delete the project to delete the uploads.
- **Generated outputs** follow the same lifecycle as their parent project.
- **Telemetry** is retained 90 days, then aggregated.
- **Account data** is retained until you request deletion (see below).

## Your rights

You may at any time:

- Export your data in JSON via the project detail page.
- Delete a project (purges plans, corrections, outputs).
- Request full account deletion by emailing the operator at the address in the
  repository's `package.json` `author` field. We will fulfill the request
  within 30 days.

If you are a California resident, the CCPA/CPRA give you these same rights
plus the right to know what we have collected about you. Submit those
requests to the same email address.

If you are an EEA/UK resident, the GDPR/UK-GDPR give you the same rights plus
the right to object to processing. Same email address.

## Security baseline

- All traffic is HTTPS.
- Row-Level Security policies prevent cross-account reads on every database
  table.
- Storage buckets are private; access is via short-lived signed URLs.
- We do not store payment card data; payments (when launched) will be
  processed by a PCI-DSS-compliant provider.
- We do not log raw plan or corrections-letter contents in application logs.

We do not currently undergo SOC 2 audit. Enterprise customers requiring formal
attestation should contact the operator before signing up.

## Breach notification

In the event of a data breach affecting your information, we will notify you
via email within 72 hours of confirmation, in line with GDPR Article 33
timelines.

## Changes to this policy

Material changes will be announced by email and via a prominent notice on the
landing page at least 14 days before they take effect. The full revision
history lives in the public git history of this file at
[`PRIVACY.md`](PRIVACY.md) on GitHub.

## Contact

Questions, deletion requests, or breach reports go to the email in
`package.json`'s `author` field, or to an issue at
[the public repository](https://github.com/Merrmerr21/permitmonkey/issues).
