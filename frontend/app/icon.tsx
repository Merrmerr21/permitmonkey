import { ImageResponse } from 'next/og'

// Next.js 16 file-based icon convention. Renders the PermitMonkey "P" mark
// at 32×32 (standard favicon size) using the same moss-green primary that
// the in-page brand mark uses. Replaces the default Next.js favicon.

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#2D6A4F',
          color: '#F0FFF4',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontFamily: 'serif',
          borderRadius: 6,
        }}
      >
        P
      </div>
    ),
    size,
  )
}
