"use client"

import { useState } from "react"
import Link from "next/link"
import useWallet from "../../lib/hooks/useWallet"
import useCommitments from "../../lib/hooks/useCommitments"
import CommitmentCard from "../../components/commitments/CommitmentCard"
import type { CommitmentDetails } from "../../lib/contract/types"
import { Plus, ArrowRight, Wallet, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { account, provider, connectWallet } = useWallet()
  const { commitments, loading, error, stats, filterCommitments } = useCommitments(provider, account)
  const [activeTab, setActiveTab] = useState<string>("active")

  // Get filtered commitments based on active tab
  const filteredCommitments = filterCommitments(activeTab)

  if (!account) {
    return (
      <div className="container-custom pt-32 pb-16">
        <div className="mx-auto max-w-md">
          <h1 className="heading-2 mb-6 text-center">My Dashboard</h1>

          <div className="card text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="heading-3 mb-4">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">You need to connect your wallet to view your commitments.</p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom pt-32 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="heading-2">My Dashboard</h1>

        <div className="flex flex-wrap gap-3">
          <Link href="/create" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Commitment</span>
          </Link>
          <Link href="/commitments/join" className="btn-outline flex items-center space-x-2">
            <ArrowRight className="h-4 w-4" />
            <span>Join Commitment</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Active</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <div className="h-5 w-5 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>

        <div className="card bg-success/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <div className="h-5 w-5 rounded-full bg-success"></div>
            </div>
          </div>
        </div>

        <div className="card bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Failed</p>
              <p className="text-3xl font-bold">{stats.failed}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <div className="h-5 w-5 rounded-full bg-destructive"></div>
            </div>
          </div>
        </div>

        <div className="card bg-warning/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning">Total Staked</p>
              <p className="text-3xl font-bold">{stats.totalStaked.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">DOT</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
              <div className="h-5 w-5 rounded-full bg-warning"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-8">
        <div className="flex flex-wrap -mb-px">
          {["active", "completed", "failed", "all"].map((tab) => (
            <button
              key={tab}
              className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Commitments */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="card bg-destructive/10 text-destructive p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : filteredCommitments.length === 0 ? (
        <div className="card text-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
            <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground"></div>
          </div>
          <h3 className="heading-3 mb-4">No Commitments Found</h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === "active"
              ? "You have no active commitments."
              : activeTab === "completed"
                ? "You have no completed commitments."
                : activeTab === "failed"
                  ? "You have no failed commitments."
                  : "You have no commitments yet."}
          </p>
          <Link href="/create" className="btn-outline inline-flex">
            Create a Commitment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommitments.map((commitment: CommitmentDetails) => (
            <CommitmentCard key={commitment.id} commitment={commitment} />
          ))}
        </div>
      )}
    </div>
  )
}
