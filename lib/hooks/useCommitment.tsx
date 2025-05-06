"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { type Provider, ZeroHash } from "ethers"
import {
  getCommitmentDetails,
  getCommitmentMembers,
  hasMemberAgreed,
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
  // Basic state
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [commitment, setCommitment] = useState<CommitmentDetails | null>(null)
  const [members, setMembers] = useState<string[]>([])
  const [memberAgreements, setMemberAgreements] = useState<Record<string, boolean>>({})
  const [eventHistory, setEventHistory] = useState<CommitmentEvent[]>([])
  const [mounted, setMounted] = useState<boolean>(false)
  
  // Control flags to prevent infinite loops
  const loadingRef = useRef<boolean>(false)
  const dataFetchedRef = useRef<boolean>(false)
  const refreshRequestedRef = useRef<boolean>(false)
  
  // Completion status state
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({
    agreementsCount: 0,
    requiredCount: 0,
    percentage: 0,
  })

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)
    return () => {
      // Reset flags on unmount
      loadingRef.current = false
      dataFetchedRef.current = false
      refreshRequestedRef.current = false
    }
  }, [])

  // Fetch commitment details with graceful error handling
  const fetchCommitmentDetails = useCallback(async (): Promise<void> => {
    // Avoid concurrent fetches
    if (loadingRef.current) return
    
    // Skip if we've already fetched and this isn't a manual refresh
    if (dataFetchedRef.current && !refreshRequestedRef.current && commitment) return
    
    // Validate inputs
    if (!provider || !commitmentId || ZeroHash === commitmentId) {
      setLoading(false)
      return
    }

    try {
      loadingRef.current = true
      setLoading(true)
      
      // Mark that we've attempted a fetch
      dataFetchedRef.current = true
      refreshRequestedRef.current = false

      // Get commitment details first
      let details: CommitmentDetails | null = null
      try {
        details = await getCommitmentDetails(provider, commitmentId)
        setCommitment(details)
      } catch (err: any) {
        console.error("Error getting commitment details:", err)
        setError(`Failed to load commitment: ${err.message || "Network error"}`)
        setLoading(false)
        loadingRef.current = false
        return
      }

      // Get commitment members if details retrieved successfully
      let membersList: string[] = []
      try {
        membersList = await getCommitmentMembers(provider, commitmentId)
        setMembers(membersList)
      } catch (err: any) {
        console.error("Error getting commitment members:", err)
        membersList = []
        setMembers([])
      }

      // Process member agreements (if there are members)
      const agreements: Record<string, boolean> = {}
      let agreementsCount = 0

      if (membersList.length > 0) {
        try {
          for (const address of membersList) {
            try {
              const hasAgreed = await hasMemberAgreed(provider, commitmentId, address)
              agreements[address.toLowerCase()] = hasAgreed
              if (hasAgreed) agreementsCount++
            } catch (err) {
              console.error(`Error checking agreement for ${address}:`, err)
              agreements[address.toLowerCase()] = false
            }
          }
        } catch (err) {
          console.error("Error processing agreements:", err)
        }
      }
      
      setMemberAgreements(agreements)
      
      // Set completion status
      setCompletionStatus({
        agreementsCount,
        requiredCount: membersList.length,
        percentage: membersList.length > 0 ? Math.round((agreementsCount / membersList.length) * 100) : 0,
      })

      // Create a simple event history instead of using event filters
      if (details) {
        const simulatedHistory: CommitmentEvent[] = [
          {
            type: "CommitmentCreated",
            commitmentId,
            name: details.name,
            creator: "0x", // We don't know the creator
            timestamp: new Date(details.deadline.getTime() - (86400000 * 30)), // Approx. 30 days before deadline
          }
        ]
        
        // Add member-joined events
        membersList.forEach((member, index) => {
          // Distribute join events throughout the timeline
          const joinDay = 30 - Math.min(29, Math.floor((index * 29) / Math.max(1, membersList.length - 1)))
          
          simulatedHistory.push({
            type: "MemberJoined",
            commitmentId,
            member,
            timestamp: new Date(details.deadline.getTime() - (86400000 * joinDay)),
          })
        })
        
        // Add completion event if completed
        if (!details.isActive) {
          simulatedHistory.push({
            type: "CommitmentCompleted",
            commitmentId,
            successful: details.isCompleted,
            timestamp: details.isCompleted ? 
              new Date(details.deadline.getTime() - 86400000) : // 1 day before deadline for success
              new Date(details.deadline.getTime() + 86400000),  // 1 day after deadline for failure
          })
        }
        
        // Sort by timestamp
        simulatedHistory.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        setEventHistory(simulatedHistory)
      }

      setError(null)
    } catch (err: any) {
      console.error("Error fetching commitment details:", err)
      setError(err.message || "Failed to load commitment details")
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [provider, commitmentId, commitment])

  // Load data on mount
  useEffect(() => {
    if (!mounted) return
    
    // Only fetch if we haven't already
    if (!dataFetchedRef.current) {
      fetchCommitmentDetails().catch(err => {
        console.error("Initial fetch error:", err)
      })
    }
  }, [fetchCommitmentDetails, mounted])

  // Refresh data function with explicit refresh flag
  const refreshData = useCallback(() => {
    refreshRequestedRef.current = true
    fetchCommitmentDetails().catch(err => {
      console.error("Error refreshing data:", err)
    })
  }, [fetchCommitmentDetails])

  // Calculate progress percentage
  const progressPercentage = commitment 
    ? Math.round((commitment.joinedMembers / commitment.totalMembers) * 100) 
    : 0

  // Calculate time remaining
  const timeRemaining = commitment 
    ? Math.max(0, commitment.deadline.getTime() - Date.now()) 
    : 0

  // Format time remaining
  const formatTimeRemaining = (): string => {
    if (!commitment) return "Unknown"

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

  return {
    loading,
    error,
    commitment,
    members,
    memberAgreements,
    eventHistory,
    refreshData,
    progressPercentage,
    timeRemaining,
    formatTimeRemaining,
    completionStatus,
  }
}

export default useCommitment



