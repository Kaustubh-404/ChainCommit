"use client"
import Link from "next/link"
import React from "react"
import useWallet from "../lib/hooks/useWallet"
import { Check, Shield, FileText, Users, Wallet, ArrowUpRight, Clock, Lock, Globe, BarChart3, Rocket, Target, Sparkles, Handshake, Award } from "lucide-react"

export default function Home() {
  const { connectWallet, account, isWalletInstalled } = useWallet()

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span>Built on Polkadot</span>
              </div>
              <h1 className="heading-1">
                Achieve Goals with <span className="text-primary">SafeStakes</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                A decentralized accountability platform that helps you stay committed to personal goals, team projects, and business agreements through blockchain-powered incentives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/create" className="btn-primary flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Create Commitment</span>
                </Link>
                <Link href="/commitments/join" className="btn-outline flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Join Commitment</span>
                </Link>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-secondary shadow-sm"
                    >
                      <span className="text-xs font-medium">{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  {/* <span className="text-lg font-medium">1000+ users</span> */}
                  <span className="text-sm text-muted-foreground">achieve goals with SafeStakes</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-primary/30 blur-xl"></div>
                <div className="card card-hover bg-card/80 backdrop-blur-sm relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="heading-3">Secure Your Commitments</h3>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Connect your wallet to create or join commitments with built-in accountability and financial incentives.
                  </p>
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Stake-Based Motivation</p>
                        <p className="text-sm text-muted-foreground">Put your tokens on the line for extra motivation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Group Accountability</p>
                        <p className="text-sm text-muted-foreground">Create or join team challenges for mutual success</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Business Contracts</p>
                        <p className="text-sm text-muted-foreground">Create enforceable digital agreements between parties</p>
                      </div>
                    </div>
                  </div>
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

      {/* Use Cases Section */}
      <section className="section bg-background py-20">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              <span>Versatile Platform</span>
            </div>
            <h2 className="heading-2 mt-6">One Platform, Many Applications</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              From personal fitness goals to complex business agreements, SafeStakes helps you follow through with what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card card-hover bg-gradient-to-br from-primary/5 to-background">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="heading-4 mb-3">Personal Goals</h3>
              <p className="text-muted-foreground mb-6">
                Create stakes for your personal habits and goals with financial incentives that keep you accountable to yourself.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Popular for:</span>
                <div className="flex space-x-2">
                  <span className="badge badge-secondary">Fitness</span>
                  <span className="badge badge-secondary">Learning</span>
                </div>
              </div>
            </div>

            <div className="card card-hover bg-gradient-to-br from-primary/5 to-background">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="heading-4 mb-3">Team Challenges</h3>
              <p className="text-muted-foreground mb-6">
                Set up group commitments where everyone contributes and stays accountable to achieve collective goals together.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Popular for:</span>
                <div className="flex space-x-2">
                  <span className="badge badge-secondary">Projects</span>
                  <span className="badge badge-secondary">Challenges</span>
                </div>
              </div>
            </div>

            <div className="card card-hover bg-gradient-to-br from-primary/5 to-background">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Handshake className="h-7 w-7 text-primary" />
              </div>
              <h3 className="heading-4 mb-3">Business Agreements</h3>
              <p className="text-muted-foreground mb-6">
                Create binding contracts between parties with automated milestone payments and verification processes.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Popular for:</span>
                <div className="flex space-x-2">
                  <span className="badge badge-secondary">Freelance</span>
                  <span className="badge badge-secondary">Supply Chain</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/dashboard" className="btn-outline inline-flex items-center gap-2">
              <span>Explore All Use Cases</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section gradient-bg py-24">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span>Simple Process</span>
            </div>
            <h2 className="heading-2 mt-6">How SafeStakes Works</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Create, fund, and complete commitments with blockchain-enforced accountability in just a few steps.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-16 left-1/2 h-0.5 bg-primary/20 w-[80%] -translate-x-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="card card-hover bg-card/80 backdrop-blur-sm text-center relative z-10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="heading-4 mb-3">Create Commitment</h3>
                <p className="text-muted-foreground">
                  Define your goal, set a deadline, and invite participants if it's a group challenge.
                </p>
              </div>

              <div className="card card-hover bg-card/80 backdrop-blur-sm text-center relative z-10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h3 className="heading-4 mb-3">Stake Tokens</h3>
                <p className="text-muted-foreground">
                  Add real commitment by staking DOT tokens that you'll get back upon completion.
                </p>
              </div>

              <div className="card card-hover bg-card/80 backdrop-blur-sm text-center relative z-10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h3 className="heading-4 mb-3">Complete Goal</h3>
                <p className="text-muted-foreground">
                  Work on your commitment and track progress until the defined deadline.
                </p>
              </div>

              <div className="card card-hover bg-card/80 backdrop-blur-sm text-center relative z-10">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <h3 className="heading-4 mb-3">Verify & Claim</h3>
                <p className="text-muted-foreground">
                  Verify completion and get your stake back, plus any incentives from the pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Commitments */}
      <section className="section bg-background py-20">
        <div className="container-custom">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              <span>Example Commitments</span>
            </div>
            <h2 className="heading-2 mt-6">See It In Action</h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Explore how different people and organizations use SafeStakes to achieve their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="heading-4">Daily Exercise</h3>
                  <p className="text-sm text-muted-foreground">Personal Goal</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "I committed to 30 minutes of exercise daily for 60 days. Staking 2 DOT motivated me to never miss a day!"
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-muted-foreground">Duration: </span>
                  <span className="text-sm font-medium">60 days</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Stake: </span>
                  <span className="text-sm font-medium">2 DOT</span>
                </div>
                <div>
                  <span className="badge badge-success">Completed</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="heading-4">Group Study Challenge</h3>
                  <p className="text-sm text-muted-foreground">Team Commitment</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Our study group created a commitment to complete 5 weekly sessions for 3 months. The shared accountability was fantastic!"
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-muted-foreground">Duration: </span>
                  <span className="text-sm font-medium">90 days</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Members: </span>
                  <span className="text-sm font-medium">5</span>
                </div>
                <div>
                  <span className="badge badge-primary">Active</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="heading-4">Web Development Project</h3>
                  <p className="text-sm text-muted-foreground">Business Agreement</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "As a freelancer, I use SafeStakes for client projects. Milestone payments are released automatically when work is approved."
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-muted-foreground">Duration: </span>
                  <span className="text-sm font-medium">45 days</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Stake: </span>
                  <span className="text-sm font-medium">8 DOT</span>
                </div>
                <div>
                  <span className="badge badge-success">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Chain Section */}
      <section className="section gradient-bg">
        <div className="container-custom py-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span>Cross-Chain Capability</span>
              </div>
              <h2 className="heading-2">Powered by Polkadot</h2>
              <p className="text-lg text-muted-foreground">
                SafeStakes leverages Polkadot's XCM protocol to enable cross-chain accountability networks and token staking from any parachain.
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
      <section className="section bg-background py-12 mb-12">
        <div className="container-custom">
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-primary p-10 md:p-16 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="mx-auto max-w-3xl text-center relative z-10">
                <h2 className="heading-2 text-primary-foreground mb-6">Ready to Achieve Your Goals?</h2>
                <p className="text-xl text-primary-foreground/90 mb-8">
                  Join SafeStakes today and leverage the power of blockchain accountability to turn your commitments into achievements.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/create" className="btn-secondary bg-white text-primary hover:bg-white/90 flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    <span>Get Started Now</span>
                  </Link>
                  {!account && (
                    <button onClick={connectWallet} className="btn-outline border-white text-white hover:bg-white/10 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>Connect Wallet</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}










