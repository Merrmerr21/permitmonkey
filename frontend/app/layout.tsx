import type { Metadata } from "next"
import { Playfair_Display, Nunito } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "900"],
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
  display: "swap",
})

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL)
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`)
  return new URL('http://localhost:3000')
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "PermitMonkey | AI-Powered ADU Permit Review",
  description: "AI permit review assistant for Massachusetts ADUs (post-Chapter 150 of the Acts of 2024). Built with Claude Opus 4.7.",
  openGraph: {
    type: 'website',
    siteName: 'PermitMonkey',
    title: 'PermitMonkey | AI-Powered ADU Permit Review',
    description: 'AI permit review assistant for Massachusetts ADUs.',
  },
  twitter: {
    card: 'summary',
    title: 'PermitMonkey | AI-Powered ADU Permit Review',
    description: 'AI permit review assistant for Massachusetts ADUs.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${nunito.variable}`}>
      <body className="antialiased bg-permitmonkey-gradient">
        {children}
      </body>
    </html>
  )
}
