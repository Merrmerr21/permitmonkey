# Terms of Service

_Last updated: 2026-05-05. This document is plain-English boilerplate authored
by the operator and has not been reviewed by counsel; if you operate a
production deployment, replace it with a counsel-reviewed version before
inviting paying users._

By using PermitMonkey ("the service"), you agree to these terms. If you do not
agree, do not use the service.

## What we are (and aren't)

PermitMonkey is an AI-assisted research and drafting tool for Massachusetts
ADU permits and related construction filings. We do not provide:

- **Legal advice.** No attorney-client relationship is created by your use
  of the service. PermitMonkey is not a law firm.
- **Engineering certification.** Generated documents are not stamped by a
  licensed engineer or architect. They are drafts to accelerate professional
  review.
- **Permit approval.** Only the relevant municipal authority (Inspectional
  Services Department, Building Commissioner, etc.) can approve a permit.

You remain responsible for verifying every citation, dimensional reference,
and code applicability before submission to a plan checker.

## Cite, then verify

The service tags every regulatory claim with a provenance pill of the form
`[source: URL | retrieved: DATE | citation: SECTION]`. You are expected to:

- Click through the source URL on any claim that affects design or scope.
- Cross-reference dimensional limits against the current edition of 780 CMR
  and your local zoning ordinance.
- Flag any output that conflicts with state law or your local bylaw to the
  operator (the service flags state-vs-local conflicts automatically; if you
  see one ignored, that is a bug we want to fix).

If a generated citation does not resolve, do not rely on it. Open an issue at
the public repository.

## License to use

We grant you a non-exclusive, non-transferable, revocable license to use the
service for your own permit-research purposes. You may not:

- Resell or rebrand the service without a written commercial agreement.
- Use the service to draft submissions for jurisdictions outside of
  Massachusetts. We do not represent that outputs are accurate elsewhere.
- Attempt to circumvent rate limits or paywalls.
- Probe the service for vulnerabilities outside of a coordinated disclosure
  process. Responsible reports go to the email in `package.json` `author`.

## Pricing

Free tier: limited eligibility checks and one corrections job per month with
watermark. Paid tiers (when launched) will be metered per-job or per-month and
disclosed at the time of subscription. Refunds for the most recent paid period
are available within 14 days for any reason; email the operator.

## Warranty disclaimer

THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE
WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT GENERATED OUTPUTS WILL BE ACCEPTED
BY ANY PERMITTING AUTHORITY.

This disclaimer is subject to applicable consumer-protection law in your
jurisdiction; some jurisdictions do not permit the exclusion of certain
implied warranties, in which case those exclusions do not apply to you.

## Limitation of liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR AGGREGATE LIABILITY ARISING OUT OF
OR RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF (A) THE FEES YOU PAID
TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) US$100. WE ARE NOT LIABLE
FOR INDIRECT, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS,
PERMIT REJECTIONS, OR PROJECT DELAYS.

This cap applies to all claims in aggregate and survives termination of these
terms.

## Indemnification

You agree to indemnify and hold harmless the operator from any claims arising
out of (a) your use of generated outputs in a permit submission without
verification, (b) your violation of these terms, or (c) your violation of any
applicable law.

## Termination

You may stop using the service at any time. We may suspend or terminate your
account for violation of these terms, abuse of the service, or non-payment of
fees, with notice where practicable.

## Governing law

These terms are governed by the laws of the Commonwealth of Massachusetts,
without regard to its conflict-of-laws principles. Disputes will be resolved
in the state or federal courts located in Suffolk County, Massachusetts. You
waive any objection to that venue.

## Changes to these terms

Material changes will be announced by email and via a prominent notice on the
landing page at least 14 days before they take effect. The full revision
history lives in the public git history of this file at
[`TERMS.md`](TERMS.md) on GitHub.

## Contact

Questions, refund requests, or account issues go to the email in
`package.json`'s `author` field.
