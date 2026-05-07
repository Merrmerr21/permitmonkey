import { ImageResponse } from 'next/og';
import { decodeVerdictToken } from '@/lib/verdict-token';
import { evaluateEligibility } from '@/lib/eligibility';

// Per-verdict OpenGraph card. Renders the verdict label, address, and
// numbers on the brand moss-green gradient — turns every shared verdict
// link into a visible PermitMonkey-branded social card (master playbook
// §69 viral artifacts).

export const alt = 'PermitMonkey ADU eligibility verdict';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const VERDICT_LABEL = {
  likely_eligible: 'Likely Eligible',
  needs_review: 'Needs Review',
  not_eligible: 'Not Eligible',
};

export default async function VerdictOpenGraphImage({
  params,
}: {
  params: { token: string };
}) {
  const inputs = decodeVerdictToken(params.token);

  const result = inputs ? evaluateEligibility(inputs) : null;
  const label = result ? VERDICT_LABEL[result.verdict] : 'PermitMonkey';
  const address = inputs?.address ?? 'ADU eligibility check';
  const maxSqft = result?.max_adu_sqft ?? null;
  const parking = result?.parking_required ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)',
          color: '#F0FFF4',
          padding: '72px 80px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: '#F0FFF4',
              color: '#2D6A4F',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            P
          </div>
          PermitMonkey
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            marginTop: 36,
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.7,
              fontWeight: 600,
            }}
          >
            MA ADU eligibility · Verified citations
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginTop: 16,
              display: 'flex',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.85,
              marginTop: 16,
              maxWidth: 1040,
              display: 'flex',
            }}
          >
            {address}
          </div>

          {maxSqft !== null && parking !== null && (
            <div style={{ display: 'flex', gap: 36, marginTop: 28, fontSize: 24, opacity: 0.85 }}>
              <span>Max ADU: <strong>{maxSqft} sqft</strong></span>
              <span>Parking: <strong>{parking}</strong></span>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            opacity: 0.75,
            borderTop: '1px solid rgba(240, 255, 244, 0.2)',
            paddingTop: 20,
          }}
        >
          <span>MGL Ch 40A · 760 CMR 71.00 · 780 CMR · St. 2024 c. 150</span>
          <span>permitmonkey.com</span>
        </div>
      </div>
    ),
    size,
  );
}
