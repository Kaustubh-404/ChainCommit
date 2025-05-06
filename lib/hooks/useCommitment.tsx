"use client"

import { useState, useEffect, useCallback } from "react"
import {
  type Provider,
  ZeroHash, // Replacement for ethers.constants.HashZero
} from "ethers"
import {
  getCommitmentDetails,
  getCommitmentMembers,
  hasMemberAgreed,
  getCommitmentEventHistory,
  listenForCommitmentEvents,
} from "../contract"
import type { CommitmentDetails, CommitmentEvent, CompletionStatus } from "../contract/types"

interface UseCommitmentReturnType {
  loading: boolean
  error: string | null
  commitment: CommitmentDetails | null
  members: string[]
  memberAgreements: Record<string, boolean>
  eventHistory: CommitmentEvent[]
  refreshData: () => void
  progressPercentage: number
  timeRemaining: number
  formatTimeRemaining: () => string
  completionStatus: CompletionStatus
}

const useCommitment = (provider: Provider | null, commitmentId: string | null): UseCommitmentReturnType => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [commitment, setCommitment] = useState<CommitmentDetails | null>(null)
  const [members, setMembers] = useState<string[]>([])
  const [memberAgreements, setMemberAgreements] = useState<Record<string, boolean>>({})
  const [eventHistory, setEventHistory] = useState<CommitmentEvent[]>([])
  const [liveEvents, setLiveEvents] = useState<CommitmentEvent[]>([])
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({
    agreementsCount: 0,
    requiredCount: 0,
    percentage: 0,
  })

  // Fetch commitment details
  const fetchCommitmentDetails = useCallback(async (): Promise<void> => {
    if (!provider || !commitmentId || ZeroHash === commitmentId) {
      return
    }

    try {
      setLoading(true)

      // Get commitment details
      const details = await getCommitmentDetails(provider, commitmentId)
      setCommitment(details)

      // Get commitment members
      const memberAddresses = await getCommitmentMembers(provider, commitmentId)
      setMembers(memberAddresses)

      // Get member agreements
      const agreements: Record<string, boolean> = {}
      let agreementsCount = 0

      await Promise.all(
        memberAddresses.map(async (address) => {
          const hasAgreed = await hasMemberAgreed(provider, commitmentId, address)
          agreements[address.toLowerCase()] = hasAgreed

          if (hasAgreed) {
            agreementsCount++
          }
        }),
      )

      setMemberAgreements(agreements)

      // Set completion status
      setCompletionStatus({
        agreementsCount,
        requiredCount: memberAddresses.length,
        percentage: memberAddresses.length > 0 ? Math.round((agreementsCount / memberAddresses.length) * 100) : 0,
      })

      // Get event history
      const history = await getCommitmentEventHistory(provider, commitmentId)
      setEventHistory(history)

      setError(null)
    } catch (err: any) {
      console.error("Error fetching commitment details:", err)
      setError(err.message || "Failed to load commitment details")
    } finally {
      setLoading(false)
    }
  }, [provider, commitmentId])

  // Listen for events
  useEffect(() => {
    if (!provider || !commitmentId || ZeroHash === commitmentId) {
      return
    }

    let cleanup: (() => void) | undefined

    try {
      const handleEvent = (event: CommitmentEvent) => {
        // Only add events related to this commitment
        if (event.commitmentId && event.commitmentId.toLowerCase() === commitmentId.toLowerCase()) {
          // Add the new event
          setLiveEvents((prev) => [...prev, event])

          // Refresh commitment details
          fetchCommitmentDetails()
        }
      }

      // Setup event listener
      cleanup = listenForCommitmentEvents(provider, handleEvent)
    } catch (error) {
      console.error("Error setting up event listeners:", error)
    }

    // Initial fetch
    fetchCommitmentDetails()

    return () => {
      if (cleanup) cleanup()
    }
  }, [provider, commitmentId, fetchCommitmentDetails])

  // Refresh data function
  const refreshData = useCallback(() => {
    fetchCommitmentDetails()
  }, [fetchCommitmentDetails])

  // Calculate progress percentage
  const progressPercentage = commitment ? Math.round((commitment.joinedMembers / commitment.totalMembers) * 100) : 0

  // Calculate time remaining
  const timeRemaining = commitment ? Math.max(0, commitment.deadline.getTime() - Date.now()) : 0

  // Format time remaining
  const formatTimeRemaining = (): string => {
    if (!commitment) return ""

    const totalSeconds = Math.floor(timeRemaining / 1000)

    if (totalSeconds <= 0) {
      return "Deadline passed"
    }

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Get all events combined
  const allEvents = [...eventHistory, ...liveEvents].sort((a, b) => {
    const timeA = a.timestamp ? a.timestamp.getTime() : 0
    const timeB = b.timestamp ? b.timestamp.getTime() : 0
    return timeB - timeA // Show newest first
  })

  return {
    loading,
    error,
    commitment,
    members,
    memberAgreements,
    eventHistory: allEvents,
    refreshData,
    progressPercentage,
    timeRemaining,
    formatTimeRemaining,
    completionStatus,
  }
}

export default useCommitment
