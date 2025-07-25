import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Rajdhani, Exo } from "next/font/google"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

const exo = Exo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-exo",
})

export const metadata: Metadata = {
  title: "Alex Chen - Developer & Content Editor",
  description: "Portfolio of Alex Chen - Full Stack Developer and Content Editor",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${exo.variable}`}>
      <body>{children}</body>
    </html>
  )
}
