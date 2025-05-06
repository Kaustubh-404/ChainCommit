"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useWallet from "../../../lib/hooks/useWallet"
import CommitmentDetails from "../../../components/commitments/CommitmentDetails"
import { ArrowLeft, Wallet, AlertTriangle } from "lucide-react"

export default function CommitmentPage() {
  const params = useParams()
  const router = useRouter()
  const { account, provider, connectWallet } = useWallet()
  const [commitmentId, setCommitmentId] = useState<string | null>(null)

  useEffect(() => {
    if (params?.id) {
      setCommitmentId(params.id as string)
    }
  }, [params])

  if (!account) {
    return (
      <div className="container-custom pt-32 pb-16">
        <div className="mx-auto max-w-md">
          <h1 className="heading-2 mb-6 text-center">Commitment Details</h1>

          <div className="card text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="heading-3 mb-4">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">You need to connect your wallet to view this commitment.</p>
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center">
          <button onClick={() => router.push("/dashboard")} className="mr-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="heading-2">Commitment Details</h1>
        </div>

        {commitmentId ? (
          <CommitmentDetails commitmentId={commitmentId} />
        ) : (
          <div className="card text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="heading-3 mb-4">Invalid Commitment ID</h3>
            <p className="text-muted-foreground mb-6">The specified commitment ID is not valid.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
