// Fix for Header.tsx
"use client"
import { useState, useEffect } from "react"
import type React from "react"
import Link from "next/link"
import useWallet from "../../lib/hooks/useWallet"
import { formatAddress } from "../../lib/utils/formatters"
import { Menu, X, ChevronDown, Wallet, AlertTriangle } from "lucide-react"

const Header: React.FC = () => {
  const {
    account,
    connectWallet,
    disconnectWallet,
    isWalletInstalled,
    isCorrectNetwork,
    switchToPolkadotNetwork,
    balance,
  } = useWallet()

  const [scrolled, setScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false)
  // Add a mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState<boolean>(false)

  // Handle scroll effect
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only render the full component after mounting on client
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 7 17l-5-5" />
                  <path d="m22 10-7.5 7.5L13 16" />
                </svg>
              </div>
              <span className="text-xl font-bold">ChainCommit</span>
            </div>
            <div>{/* Placeholder for buttons */}</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Rest of your component remains the same */}
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 6 7 17l-5-5" />
                <path d="m22 10-7.5 7.5L13 16" />
              </svg>
            </div>
            <span className="text-xl font-bold">ChainCommit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Create Commitment
            </Link>
            <Link
              href="/commitments/join"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Join Commitment
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {!account ? (
              <button
                onClick={connectWallet}
                disabled={!isWalletInstalled}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isWalletInstalled ? "Connect Wallet" : "Install Wallet"}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center space-x-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80"
                >
                  <span>{formatAddress(account)}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-card shadow-lg">
                    <div className="p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Balance</span>
                        <span className="text-sm font-medium">
                          {balance ? Number.parseFloat(balance).toFixed(4) : "0.0000"} DOT
                        </span>
                      </div>

                      {!isCorrectNetwork && (
                        <button
                          onClick={switchToPolkadotNetwork}
                          className="mb-2 flex w-full items-center justify-between rounded-md bg-warning/10 px-3 py-2 text-xs text-warning-foreground"
                        >
                          <span className="flex items-center">
                            <AlertTriangle className="mr-1.5 h-3 w-3" />
                            Wrong Network
                          </span>
                          <span className="font-medium">Switch</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          disconnectWallet()
                          setAccountMenuOpen(false)
                        }}
                        className="w-full rounded-md border border-input px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/50"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="flex md:hidden items-center justify-center rounded-md p-2 text-foreground/80 hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Commitment
              </Link>
              <Link
                href="/commitments/join"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Commitment
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header




