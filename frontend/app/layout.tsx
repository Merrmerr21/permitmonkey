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

export const metadata: Metadata = {
  title: "PermitMonkey | AI-Powered ADU Permit Review",
  description: "AI permit review assistant for Massachusetts ADUs (post-Chapter 150 of the Acts of 2024). Built with Claude Opus 4.6.",
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
