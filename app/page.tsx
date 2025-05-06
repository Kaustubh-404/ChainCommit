"use client"
import Link from "next/link"
import useWallet from "../lib/hooks/useWallet"
import { Check, Wallet, Users, Trophy, ArrowUpRight } from "lucide-react"

export default function Home() {
  const { connectWallet, account, isWalletInstalled } = useWallet()

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span>Built on Polkadot</span>
              </div>
              <h1 className="heading-1">
                Achieve Your Goals with <span className="text-primary">ChainCommit</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                A decentralized accountability platform that helps you stay committed to your goals through smart
                contracts and financial incentives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/create" className="btn-primary">
                  Create Commitment
                </Link>
                <Link href="/commitments/join" className="btn-outline">
                  Join Commitment
                </Link>
              </div>
              <div className="flex items-center space-x-4 pt-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary"
                    >
                      <span className="text-xs font-medium">{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-medium">250+</span> users already committed
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/30 blur-xl"></div>
                <div className="card card-hover bg-card/80 backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="heading-3">Connect Your Wallet</h3>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Connect your wallet to create or join commitments on the Polkadot network.
                  </p>
                  <button
                    onClick={connectWallet}
                    disabled={!isWalletInstalled}
                    className={`btn-primary w-full ${!isWalletInstalled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {!isWalletInstalled ? "Install Wallet Extension" : account ? "Wallet Connected" : "Connect Wallet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              <span>How It Works</span>
            </div>
            <h2 className="heading-2 mt-6">Achieve More Through Accountability</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Create and join commitments with financial stakes to ensure accountability and results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card card-hover">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-4 mb-2">Create a Commitment</h3>
              <p className="text-muted-foreground">
                Define your goal, set a deadline, and stake DOT tokens as collateral. Invite others to join your
                commitment.
              </p>
            </div>

            <div className="card card-hover">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-4 mb-2">Join Forces</h3>
              <p className="text-muted-foreground">
                Join existing commitments by staking tokens. Everyone has skin in the game to ensure mutual
                accountability.
              </p>
            </div>

            <div className="card card-hover">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-4 mb-2">Complete & Claim</h3>
              <p className="text-muted-foreground">
                When everyone agrees the commitment is complete before the deadline, all participants get their stakes
                back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Chain Section */}
      <section className="section gradient-bg">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span>Cross-Chain Capability</span>
              </div>
              <h2 className="heading-2">Seamless Integration with Polkadot</h2>
              <p className="text-lg text-muted-foreground">
                ChainCommit leverages Polkadot's XCM protocol to enable cross-chain accountability networks and token
                staking from any parachain.
              </p>
              <ul className="space-y-4">
                {[
                  "Stake tokens from any Polkadot parachain",
                  "Create cross-chain accountability networks",
                  "Seamless integration with the entire Polkadot ecosystem",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/30 blur-xl"></div>
                <div className="card card-hover bg-card/80 backdrop-blur-sm">
                  <div className="mb-6 flex justify-between">
                    <span className="badge badge-secondary">Acala</span>
                    <span className="badge badge-secondary">Moonbeam</span>
                    <span className="badge badge-secondary">Astar</span>
                  </div>
                  <div className="mb-6 rounded-lg border bg-secondary/30 p-4">
                    <p className="mb-4 font-medium">Cross-Chain Commitment</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Staked</p>
                        <p className="font-medium">125 DOT</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Parachains</p>
                        <p className="font-medium">3</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className="badge badge-success">Active</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard" className="btn-secondary flex w-full items-center justify-center space-x-2">
                    <span>Explore Cross-Chain Features</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="rounded-2xl bg-primary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="heading-2 text-primary-foreground">Ready to Make Your Commitments Stick?</h2>
              <p className="mt-4 text-xl text-primary-foreground/90">
                Join ChainCommit today and leverage the power of smart contracts to achieve your goals with
                accountability.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/create" className="btn-secondary bg-white text-primary hover:bg-white/90">
                  Create Your First Commitment
                </Link>
                {!account && (
                  <button onClick={connectWallet} className="btn-outline border-white text-white hover:bg-white/10">
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
