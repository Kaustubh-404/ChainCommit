import type React from "react"
import Link from "next/link"
import type { CommitmentDetails } from "../../lib/contract/types"
import { formatTimeRemaining, getCommitmentStatus } from "../../lib/utils/formatters"
import { Calendar, Users, Coins, Clock, ArrowRight } from "lucide-react"

interface CommitmentCardProps {
  commitment: CommitmentDetails
  className?: string
}

const CommitmentCard: React.FC<CommitmentCardProps> = ({ commitment, className = "" }) => {
  // Format deadline
  const formatDeadline = (deadline: Date) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format DOT amount
  const formatDotAmount = (amount: string) => {
    return `${Number.parseFloat(amount).toFixed(3)} DOT`
  }

  // Get status badge class
  const getStatusBadgeClass = (commitment: CommitmentDetails) => {
    if (!commitment.isActive && commitment.isCompleted) {
      return "badge-success"
    } else if (!commitment.isActive && !commitment.isCompleted) {
      return "badge-destructive"
    } else if (new Date(commitment.deadline) < new Date()) {
      return "badge-warning"
    } else {
      return "badge-primary"
    }
  }

  return (
    <div className={`card card-hover ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="heading-4">{commitment.name}</h3>
        <span className={`badge ${getStatusBadgeClass(commitment)}`}>{getCommitmentStatus(commitment)}</span>
      </div>

      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{commitment.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Users className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="font-medium">
              {commitment.joinedMembers} / {commitment.totalMembers}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Coins className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Stake</p>
            <p className="font-medium">{formatDotAmount(commitment.stakeAmount)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="font-medium">{formatDeadline(commitment.deadline)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <p className="text-xs text-muted-foreground">Time Remaining</p>
            <p className="font-medium">{formatTimeRemaining(commitment.deadline)}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium">
            {Math.round((commitment.joinedMembers / commitment.totalMembers) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${(commitment.joinedMembers / commitment.totalMembers) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/commitments/${commitment.id}`}
        className="btn-outline flex w-full items-center justify-center space-x-2"
      >
        <span>View Details</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

export default CommitmentCard
