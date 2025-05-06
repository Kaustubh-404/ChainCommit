"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useWallet from "../../../lib/hooks/useWallet"
import JoinForm from "../../../components/commitments/JoinForm"
import { ArrowLeft, CheckCircle2, ArrowRight, Wallet } from "lucide-react"

export default function JoinPage() {
  const router = useRouter()
  const { account, connectWallet } = useWallet()
  const [successModal, setSuccessModal] = useState<boolean>(false)
  const [joinedCommitmentId, setJoinedCommitmentId] = useState<string | null>(null)

  // Handle successful commitment join
  const handleSuccess = (commitmentId: string) => {
    setJoinedCommitmentId(commitmentId)
    setSuccessModal(true)
  }

  // Handle view commitment
  const handleViewCommitment = () => {
    setSuccessModal(false)
    if (joinedCommitmentId) {
      router.push(`/commitments/${joinedCommitmentId}`)
    }
  }

  if (!account) {
    return (
      <div className="container-custom pt-32 pb-16">
        <div className="mx-auto max-w-md">
          <h1 className="heading-2 mb-6 text-center">Join a Commitment</h1>

          <div className="card text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="heading-3 mb-4">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">You need to connect your wallet to join a commitment.</p>
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center">
          <button onClick={() => router.push("/dashboard")} className="mr-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="heading-2">Join a Commitment</h1>
        </div>

        <JoinForm onSuccess={handleSuccess} />
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="heading-4">Successfully Joined Commitment!</h3>
              <button
                onClick={() => setSuccessModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>

                <p className="text-muted-foreground mb-6">
                  You have successfully joined the commitment. You can now view its details and track progress.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => setSuccessModal(false)}
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>Join Another</span>
                  </button>
                  <button onClick={handleViewCommitment} className="btn-primary flex items-center justify-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>View Commitment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
