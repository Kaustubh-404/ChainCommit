"use client"

import type React from "react"
import { useState } from "react"
import useWallet from "../../lib/hooks/useWallet"
import useCommitment from "../../lib/hooks/useCommitment"
import { agreeToComplete } from "../../lib/contract"
import { formatAddress } from "../../lib/utils/formatters"
import { AlertTriangle, Loader2, Users, Calendar, Clock, Coins, CheckCircle2, XCircle, Activity } from "lucide-react"

interface CommitmentDetailsProps {
  commitmentId: string
}

const CommitmentDetails: React.FC<CommitmentDetailsProps> = ({ commitmentId }) => {
  const { provider, signer, account, isCorrectNetwork, switchToPolkadotNetwork } = useWallet()
  const {
    loading,
    error,
    commitment,
    members,
    memberAgreements,
    refreshData,
    eventHistory,
    progressPercentage,
    formatTimeRemaining,
    completionStatus,
  } = useCommitment(provider, commitmentId)

  const [agreeLoading, setAgreeLoading] = useState<boolean>(false)
  const [agreeError, setAgreeError] = useState<string | null>(null)
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false)
  const [showEventsModal, setShowEventsModal] = useState<boolean>(false)

  // Check if user is a member
  const isMember = account && members.map((addr) => addr.toLowerCase()).includes(account.toLowerCase())

  // Check if user has already agreed
  const hasAgreed = account && memberAgreements[account.toLowerCase()]

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  // Handle agree to complete
  const handleAgreeToComplete = async () => {
    if (!signer) return

    if (!isCorrectNetwork) {
      setAgreeError("Please switch to the Polkadot network")
      return
    }

    try {
      setAgreeLoading(true)
      setAgreeError(null)

      await agreeToComplete(signer, commitmentId)

      // Refresh data
      refreshData()
    } catch (err: any) {
      console.error("Error agreeing to complete:", err)
      setAgreeError(err.message || "Failed to agree to complete")
    } finally {
      setAgreeLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="card flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading commitment details...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !commitment) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="heading-3 mb-2">Error Loading Commitment</h3>
          <p className="text-muted-foreground">{error || "Commitment not found"}</p>
        </div>
      </div>
    )
  }

  // Get status badge class
  const getStatusBadgeClass = () => {
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

  // Get status text
  const getStatusText = () => {
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

  return (
    <>
      <div className="card">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="heading-3">{commitment.name}</h2>
          <span className={`badge ${getStatusBadgeClass()}`}>{getStatusText()}</span>
        </div>

        <p className="text-muted-foreground mb-8">{commitment.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <h3 className="heading-4">Commitment Details</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Members</span>
                </div>
                <span className="font-medium">
                  {commitment.joinedMembers} / {commitment.totalMembers}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Stake Amount</span>
                </div>
                <span className="font-medium">{commitment.stakeAmount} DOT</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Total Staked</span>
                </div>
                <span className="font-medium">
                  {Number.parseFloat(commitment.stakeAmount) * commitment.joinedMembers} DOT
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Deadline</span>
                </div>
                <span className="font-medium">{new Date(commitment.deadline).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Time Remaining</span>
                </div>
                <span className="font-medium">{formatTimeRemaining()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="heading-4">Member Progress</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Members Joined</span>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-secondary">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Completion Agreements</span>
                  <span className="text-sm font-medium">
                    {completionStatus.agreementsCount} / {completionStatus.requiredCount}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-2.5 rounded-full bg-success"
                    style={{
                      width: `${completionStatus.percentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => setShowMembersModal(true)}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span>View Members</span>
                </button>

                <button
                  onClick={() => setShowEventsModal(true)}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  <span>View Activity</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {commitment.isActive && isMember && (
          <div className="border-t border-border pt-6">
            <h3 className="heading-4 mb-4">Your Actions</h3>

            {agreeError && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium">{agreeError}</p>
                </div>
                {!isCorrectNetwork && (
                  <div className="mt-2">
                    <button
                      onClick={switchToPolkadotNetwork}
                      className="text-sm font-medium underline hover:no-underline"
                    >
                      Switch to Polkadot Network
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-grow">
                <p className="text-muted-foreground">
                  {hasAgreed
                    ? "You have agreed that this commitment is complete."
                    : "Once you have fulfilled your part of the commitment, click the button to agree to completion."}
                </p>
              </div>

              <button
                className={`${
                  hasAgreed ? "btn-secondary bg-success text-success-foreground hover:bg-success/90" : "btn-primary"
                } flex items-center gap-2 ${
                  hasAgreed || agreeLoading || !commitment.isActive || !isCorrectNetwork
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={hasAgreed || agreeLoading || !commitment.isActive || !isCorrectNetwork}
                onClick={handleAgreeToComplete}
              >
                {agreeLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : hasAgreed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Agreed</span>
                  </>
                ) : (
                  "Agree to Complete"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[80vh] flex flex-col rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="heading-4">Commitment Members</h3>
              <button
                onClick={() => setShowMembersModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-grow">
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={member} className="flex justify-between items-center rounded-lg border bg-secondary/20 p-3">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mr-3">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <span>{formatAddress(member)}</span>
                      {member.toLowerCase() === account?.toLowerCase() && (
                        <span className="ml-2 badge badge-secondary text-xs">You</span>
                      )}
                    </div>

                    <div>
                      {memberAgreements[member.toLowerCase()] ? (
                        <span className="badge badge-success">Agreed</span>
                      ) : (
                        <span className="badge badge-outline">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Modal */}
      {showEventsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md max-h-[80vh] flex flex-col rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="heading-4">Commitment Activity</h3>
              <button
                onClick={() => setShowEventsModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-grow">
              {eventHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {eventHistory.map((event, index) => (
                    <div key={index} className="relative pl-6 pb-4">
                      <div
                        className={`absolute left-0 top-1 h-4 w-4 rounded-full ${
                          event.type === "CommitmentCreated"
                            ? "bg-primary"
                            : event.type === "MemberJoined"
                              ? "bg-primary"
                              : event.type === "CommitmentCompleted" && event.successful
                                ? "bg-success"
                                : "bg-destructive"
                        }`}
                      ></div>
                      {index < eventHistory.length - 1 && (
                        <div className="absolute left-2 top-5 h-full w-0.5 -ml-px bg-border"></div>
                      )}
                      <div className="rounded-lg border bg-secondary/20 p-3">
                        <p className="text-sm font-medium">
                          {event.type === "CommitmentCreated"
                            ? `Commitment created by ${formatAddress(event.creator)}`
                            : event.type === "MemberJoined"
                              ? `${formatAddress(event.member)} joined the commitment`
                              : event.type === "CommitmentCompleted" && event.successful
                                ? "Commitment completed successfully"
                                : "Commitment failed"}
                        </p>
                        {event.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(event.timestamp)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CommitmentDetails
