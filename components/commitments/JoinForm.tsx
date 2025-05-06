"use client"

import type React from "react"
import { useState, type FormEvent, type ChangeEvent } from "react"
import { ZeroHash } from "ethers"
import useWallet from "../../lib/hooks/useWallet"
import { joinCommitment, getCommitmentIdFromJoinCode, getCommitmentDetails } from "../../lib/contract"
import type { CommitmentDetails } from "../../lib/contract/types"
import { AlertTriangle, Loader2, Search, Calendar, Users, Coins, Clock } from "lucide-react"

interface JoinFormProps {
  onSuccess: (commitmentId: string) => void
}

const JoinForm: React.FC<JoinFormProps> = ({ onSuccess }) => {
  const { signer, provider, account, isCorrectNetwork, switchToPolkadotNetwork } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState<string>("")
  const [commitment, setCommitment] = useState<CommitmentDetails | null>(null)
  const [lookupLoading, setLookupLoading] = useState<boolean>(false)

  // Handle join code change
  const handleJoinCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.target.value)
    setCommitment(null)
    setError(null)
  }

  // Look up commitment details
  const lookupCommitment = async () => {
    if (!provider || !joinCode) return

    if (!isCorrectNetwork) {
      setError("Please switch to the Polkadot network")
      return
    }

    try {
      setLookupLoading(true)
      setError(null)

      // Get commitment ID from join code
      const commitmentId = await getCommitmentIdFromJoinCode(provider, joinCode)

      if (ZeroHash === commitmentId) {
        throw new Error("Invalid join code")
      }

      // Get commitment details
      const details = await getCommitmentDetails(provider, commitmentId)

      setCommitment({
        ...details,
        id: commitmentId,
      })
    } catch (err: any) {
      console.error("Error looking up commitment:", err)
      setError(err.message || "Failed to look up commitment")
      setCommitment(null)
    } finally {
      setLookupLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!signer || !joinCode || !commitment) {
      return
    }

    if (!isCorrectNetwork) {
      setError("Please switch to the Polkadot network")
      return
    }

    try {
      setLoading(true)
      setError(null)

      await joinCommitment(signer, joinCode, commitment.stakeAmount)

      // Reset form
      setJoinCode("")
      setCommitment(null)

      // Call success callback
      if (onSuccess && commitment.id) {
        onSuccess(commitment.id)
      }
    } catch (err: any) {
      console.error("Error joining commitment:", err)
      setError(err.message || "Failed to join commitment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="heading-3 mb-6">Join a Commitment</h2>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
          {!isCorrectNetwork && (
            <div className="mt-2">
              <button onClick={switchToPolkadotNetwork} className="text-sm font-medium underline hover:no-underline">
                Switch to Polkadot Network
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="joinCode" className="text-sm font-medium">
            Join Code <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="joinCode"
              value={joinCode}
              onChange={handleJoinCodeChange}
              placeholder="Enter the commitment join code"
              required
              className="input-primary flex-1"
            />
            <button
              type="button"
              onClick={lookupCommitment}
              disabled={lookupLoading || !joinCode || !provider || !isCorrectNetwork}
              className={`btn-secondary flex items-center gap-2 ${
                lookupLoading || !joinCode || !provider || !isCorrectNetwork ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>{lookupLoading ? "Looking up..." : "Look up"}</span>
            </button>
          </div>
        </div>

        {commitment && (
          <div className="rounded-lg border bg-secondary/20 p-4">
            <h3 className="heading-4 mb-2">{commitment.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{commitment.description}</p>

            <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-xs text-muted-foreground">Stake Required</p>
                  <p className="font-medium">{commitment.stakeAmount} DOT</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="font-medium">{new Date(commitment.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {!commitment.isActive
                      ? "Inactive"
                      : new Date(commitment.deadline) < new Date()
                        ? "Expired"
                        : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            !signer ||
            !commitment ||
            !commitment.isActive ||
            commitment.joinedMembers >= commitment.totalMembers ||
            !isCorrectNetwork
          }
          className={`btn-primary w-full ${
            loading ||
            !signer ||
            !commitment ||
            !commitment.isActive ||
            commitment.joinedMembers >= commitment.totalMembers ||
            !isCorrectNetwork
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining...
            </span>
          ) : !commitment ? (
            "Enter Join Code First"
          ) : !commitment.isActive ? (
            "Commitment Inactive"
          ) : commitment.joinedMembers >= commitment.totalMembers ? (
            "Commitment Full"
          ) : (
            `Join & Stake ${commitment?.stakeAmount || 0} DOT`
          )}
        </button>
      </form>
    </div>
  )
}

export default JoinForm
