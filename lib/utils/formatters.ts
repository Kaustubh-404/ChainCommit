/**
 * Utility functions for formatting data
 */

// Format address for display
export const formatAddress = (address: string | null | undefined): string => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Format DOT amount
export const formatDOT = (amount: string | number | null | undefined, decimals = 4): string => {
  if (!amount) return "0 DOT"
  return `${Number.parseFloat(amount.toString()).toFixed(decimals)} DOT`
}

// Format date
export const formatDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format date and time
export const formatDateTime = (date: Date | string | number | null | undefined): string => {
  if (!date) return ""
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format time remaining
export const formatTimeRemaining = (deadline: Date | string | number | null | undefined): string => {
  if (!deadline) return "No deadline"

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const timeDiff = deadlineDate.getTime() - now.getTime()

  if (timeDiff <= 0) {
    return "Expired"
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// Get status text based on commitment state
export const getCommitmentStatus = (commitment: any): string => {
  if (!commitment) return ""

  if (!commitment.isActive && commitment.isCompleted) {
    return "Completed"
  } else if (!commitment.isActive && !commitment.isCompleted) {
    return "Failed"
  } else if (new Date(commitment.deadline) < new Date()) {
    return "Expired"
  } else {
    return "Active"
  }
}

// Get status color based on commitment state
export const getStatusColor = (commitment: any): string => {
  if (!commitment) return ""

  if (!commitment.isActive && commitment.isCompleted) {
    return "bg-green-100 text-green-800" // Completed
  } else if (!commitment.isActive && !commitment.isCompleted) {
    return "bg-red-100 text-red-800" // Failed
  } else if (new Date(commitment.deadline) < new Date()) {
    return "bg-yellow-100 text-yellow-800" // Expired but still active
  } else {
    return "bg-blue-100 text-blue-800" // Active
  }
}

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ""
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength) + "..."
}

// Format transaction hash
export const formatTransactionHash = (hash: string | null | undefined): string => {
  if (!hash) return ""
  return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`
}

// Format event type for display
export const formatEventType = (eventType: string): string => {
  switch (eventType) {
    case "CommitmentCreated":
      return "Commitment Created"
    case "MemberJoined":
      return "Member Joined"
    case "CommitmentCompleted":
      return "Commitment Completed"
    case "WithdrawalReady":
      return "Withdrawal Ready"
    default:
      return eventType
  }
}
