import type React from "react"
import { Inter } from "next/font/google"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import "./globals.css"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChainCommit - Cross-Chain Accountability Platform",
  description:
    "A decentralized accountability platform built on Polkadot that empowers individuals and organizations to create commitment-driven agreements.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
