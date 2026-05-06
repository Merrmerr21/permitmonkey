import { ImageResponse } from 'next/og'

// Site-wide default OpenGraph image. Renders at 1200×630 (standard
// social-card size) and is automatically picked up by Next.js for any
// route that doesn't define its own opengraph-image. Article pages
// inherit this until per-article images are authored.

export const alt = 'PermitMonkey · AI permit assistant for Massachusetts ADUs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
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
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: '#F0FFF4',
              color: '#2D6A4F',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
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
            marginTop: 60,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: 900,
            }}
          >
            Permit responses with sources you can verify.
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 32,
              opacity: 0.85,
              fontWeight: 400,
              maxWidth: 900,
            }}
          >
            AI permit assistant for Massachusetts ADUs. Every claim cited
            to the exact statute, regulation, or city bylaw.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 20,
            opacity: 0.7,
            fontFamily: 'monospace',
          }}
        >
          <span>permitmonkey.com</span>
          <span>Ch 150 of 2024 · 760 CMR 71.00</span>
        </div>
      </div>
    ),
    size,
  )
}
