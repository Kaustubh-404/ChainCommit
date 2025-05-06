"use client"

import { useState, useEffect, useCallback } from "react"
import type { Provider } from "ethers"
import { getUserCommitments, listenForCommitmentEvents } from "../contract"
import type { CommitmentDetails, CommitmentStats, CommitmentEvent } from "../contract/types"

interface UseCommitmentsReturnType {
  commitments: CommitmentDetails[]
  loading: boolean
  error: string | null
  stats: CommitmentStats
  filterCommitments: (status: string) => CommitmentDetails[]
  refreshCommitments: () => Promise<void>
}

const useCommitments = (provider: Provider | null, account: string | null): UseCommitmentsReturnType => {
  const [commitments, setCommitments] = useState<CommitmentDetails[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<CommitmentStats>({
    active: 0,
    completed: 0,
    failed: 0,
    totalStaked: 0,
  })

  const fetchCommitments = useCallback(async (): Promise<void> => {
    if (!provider || !account) {
      setCommitments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const userCommitments = await getUserCommitments(provider, account)
      setCommitments(userCommitments)

      // Calculate stats
      const active = userCommitments.filter((c) => c.isActive).length
      const completed = userCommitments.filter((c) => !c.isActive && c.isCompleted).length
      const failed = userCommitments.filter((c) => !c.isActive && !c.isCompleted).length

      const totalStaked = userCommitments.reduce((total, commitment) => {
        return total + (Number.parseFloat(commitment.stakeAmount) || 0)
      }, 0)

      setStats({
        active,
        completed,
        failed,
        totalStaked,
      })

      setError(null)
    } catch (err: any) {
      console.error("Error fetching commitments:", err)
      setError(err.message || "Failed to load commitments")
    } finally {
      setLoading(false)
    }
  }, [provider, account])

  // Initial fetch
  useEffect(() => {
    fetchCommitments()
  }, [fetchCommitments])

  // Setup event listeners
  useEffect(() => {
    if (!provider || !account) return

    const handleEvent = (event: CommitmentEvent) => {
      // Handle different event types
      if (
        (event.type === "CommitmentCreated" && event.creator?.toLowerCase() === account.toLowerCase()) ||
        (event.type === "MemberJoined" && event.member?.toLowerCase() === account.toLowerCase()) ||
        event.type === "CommitmentCompleted"
      ) {
        // Refresh commitments on relevant events
        fetchCommitments()
      }
    }

    // Setup event listener
    const cleanup = listenForCommitmentEvents(provider, handleEvent)

    return () => {
      cleanup()
    }
  }, [provider, account, fetchCommitments])

  // Filter commitments
  const filterCommitments = useCallback(
    (status: string): CommitmentDetails[] => {
      if (status === "active") {
        return commitments.filter((c) => c.isActive)
      } else if (status === "completed") {
        return commitments.filter((c) => !c.isActive && c.isCompleted)
      } else if (status === "failed") {
        return commitments.filter((c) => !c.isActive && !c.isCompleted)
      } else {
        // All commitments
        return commitments
      }
    },
    [commitments],
  )

  return {
    commitments,
    loading,
    error,
    stats,
    filterCommitments,
    refreshCommitments: fetchCommitments,
  }
}

export default useCommitments
