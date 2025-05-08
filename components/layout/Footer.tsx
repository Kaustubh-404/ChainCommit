import type React from "react"
import Link from "next/link"
import { Github, Twitter, MessageCircle } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
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
              <span className="text-xl font-bold">SafeStakes</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              A decentralized accountability platform built on Polkadot that empowers individuals and organizations to
              create commitment-driven agreements.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Create Commitment
                </Link>
              </li>
              <li>
                <Link
                  href="/commitments/join"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Join Commitment
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold">Connect</h3>
            <p className="mt-4 text-sm text-muted-foreground">Join our community and stay updated</p>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SafeStakes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
