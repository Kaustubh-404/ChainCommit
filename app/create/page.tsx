"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import useWallet from "../../lib/hooks/useWallet"
import CommitmentForm from "../../components/commitments/CommitmentForm"
import type { CommitmentCreatedResult } from "../../lib/contract/types"
import { ArrowLeft, CheckCircle2, Copy, ArrowRight, Wallet, Plus } from "lucide-react"

// Create a separate component for template handling that uses useSearchParams
function TemplateHandler({ onTemplateChange }: { onTemplateChange: (template: string | null) => void }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Parse the URL parameters on the client side instead
    const params = new URLSearchParams(window.location.search);
    const template = params.get('template');
    if (template) {
      onTemplateChange(template);
    }
  }, [onTemplateChange]);

  return null; // This component doesn't render anything
}

export default function CreatePage() {
  const router = useRouter()
  const { account, connectWallet } = useWallet()
  const [successModal, setSuccessModal] = useState<boolean>(false)
  const [createdCommitment, setCreatedCommitment] = useState<CommitmentCreatedResult | null>(null)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [templateType, setTemplateType] = useState<string | null>(null)

  // Handle successful commitment creation
  const handleSuccess = (result: CommitmentCreatedResult) => {
    setCreatedCommitment(result)
    setSuccessModal(true)
  }

  // Handle view commitment
  const handleViewCommitment = () => {
    setSuccessModal(false)
    if (createdCommitment?.commitmentId) {
      router.push(`/commitments/${createdCommitment.commitmentId}`)
    }
  }

  // Handle copy join code
  const handleCopyJoinCode = () => {
    if (createdCommitment?.joinCode) {
      navigator.clipboard.writeText(createdCommitment.joinCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  if (!account) {
    return (
      <div className="container-custom pt-32 pb-16">
        <div className="mx-auto max-w-md">
          <h1 className="heading-2 mb-6 text-center">Create a New Contract</h1>

          <div className="card text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="heading-3 mb-4">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">You need to connect your wallet to create a new contract.</p>
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
          <h1 className="heading-2">
            {templateType ? `Create ${formatTemplateName(templateType)} Contract` : "Create a New Contract"}
          </h1>
        </div>

        {/* We now use the component approach to handle URL parameters safely */}
        <Suspense fallback={null}>
          <TemplateHandler onTemplateChange={setTemplateType} />
        </Suspense>

        <CommitmentForm 
          onSuccess={handleSuccess} 
          templateType={templateType}
        />
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="heading-4">Contract Created Successfully!</h3>
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

                <h3 className="heading-4 mb-2">{createdCommitment?.name}</h3>

                <p className="text-muted-foreground mb-6">
                  Your contract has been created successfully. Share the join code with others to invite them to participate.
                </p>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Join Code:</p>
                  <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                    <code className="text-sm font-mono">{createdCommitment?.joinCode}</code>
                    <button
                      onClick={handleCopyJoinCode}
                      className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      {copySuccess ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => setSuccessModal(false)}
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Another</span>
                  </button>
                  <button onClick={handleViewCommitment} className="btn-primary flex items-center justify-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span>View Contract</span>
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

// Helper function to format template names for display
function formatTemplateName(templateType: string): string {
  switch (templateType) {
    case 'freelance':
      return 'Freelance Agreement';
    case 'partnership':
      return 'Partnership';
    case 'supply':
      return 'Supply Chain';
    case 'cross-chain':
      return 'Cross-Chain';
    default:
      return templateType.charAt(0).toUpperCase() + templateType.slice(1);
  }
}






// "use client"

// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import useWallet from "../../lib/hooks/useWallet"
// import CommitmentForm from "../../components/commitments/CommitmentForm"
// import type { CommitmentCreatedResult } from "../../lib/contract/types"
// import { ArrowLeft, CheckCircle2, Copy, ArrowRight, Wallet, Plus } from "lucide-react"

// export default function CreatePage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const { account, connectWallet } = useWallet()
//   const [successModal, setSuccessModal] = useState<boolean>(false)
//   const [createdCommitment, setCreatedCommitment] = useState<CommitmentCreatedResult | null>(null)
//   const [copySuccess, setCopySuccess] = useState<boolean>(false)
//   const [templateType, setTemplateType] = useState<string | null>(null)

//   // Check for template parameter
//   useEffect(() => {
//     const template = searchParams.get('template')
//     if (template) {
//       setTemplateType(template)
//     }
//   }, [searchParams])

//   // Handle successful commitment creation
//   const handleSuccess = (result: CommitmentCreatedResult) => {
//     setCreatedCommitment(result)
//     setSuccessModal(true)
//   }

//   // Handle view commitment
//   const handleViewCommitment = () => {
//     setSuccessModal(false)
//     if (createdCommitment?.commitmentId) {
//       router.push(`/commitments/${createdCommitment.commitmentId}`)
//     }
//   }

//   // Handle copy join code
//   const handleCopyJoinCode = () => {
//     if (createdCommitment?.joinCode) {
//       navigator.clipboard.writeText(createdCommitment.joinCode)
//       setCopySuccess(true)
//       setTimeout(() => setCopySuccess(false), 2000)
//     }
//   }

//   if (!account) {
//     return (
//       <div className="container-custom pt-32 pb-16">
//         <div className="mx-auto max-w-md">
//           <h1 className="heading-2 mb-6 text-center">Create a New Contract</h1>

//           <div className="card text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
//               <Wallet className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="heading-3 mb-4">Connect Your Wallet</h3>
//             <p className="text-muted-foreground mb-6">You need to connect your wallet to create a new contract.</p>
//             <button onClick={connectWallet} className="btn-primary">
//               Connect Wallet
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container-custom pt-32 pb-16">
//       <div className="mx-auto max-w-2xl">
//         <div className="mb-6 flex items-center">
//           <button onClick={() => router.push("/dashboard")} className="mr-4 text-muted-foreground hover:text-primary">
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h1 className="heading-2">
//             {templateType ? `Create ${formatTemplateName(templateType)} Contract` : "Create a New Contract"}
//           </h1>
//         </div>

//         <CommitmentForm 
//           onSuccess={handleSuccess} 
//           templateType={templateType}
//         />
//       </div>

//       {/* Success Modal */}
//       {successModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-lg border bg-card shadow-lg">
//             <div className="flex items-center justify-between border-b p-4">
//               <h3 className="heading-4">Contract Created Successfully!</h3>
//               <button
//                 onClick={() => setSuccessModal(false)}
//                 className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="text-center">
//                 <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
//                   <CheckCircle2 className="h-8 w-8 text-success" />
//                 </div>

//                 <h3 className="heading-4 mb-2">{createdCommitment?.name}</h3>

//                 <p className="text-muted-foreground mb-6">
//                   Your contract has been created successfully. Share the join code with others to invite them to participate.
//                 </p>

//                 <div className="mb-6">
//                   <p className="text-sm text-muted-foreground mb-2">Join Code:</p>
//                   <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
//                     <code className="text-sm font-mono">{createdCommitment?.joinCode}</code>
//                     <button
//                       onClick={handleCopyJoinCode}
//                       className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
//                     >
//                       {copySuccess ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row justify-center gap-3">
//                   <button
//                     onClick={() => setSuccessModal(false)}
//                     className="btn-outline flex items-center justify-center gap-2"
//                   >
//                     <Plus className="h-4 w-4" />
//                     <span>Create Another</span>
//                   </button>
//                   <button onClick={handleViewCommitment} className="btn-primary flex items-center justify-center gap-2">
//                     <ArrowRight className="h-4 w-4" />
//                     <span>View Contract</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Helper function to format template names for display
// function formatTemplateName(templateType: string): string {
//   switch (templateType) {
//     case 'freelance':
//       return 'Freelance Agreement';
//     case 'partnership':
//       return 'Partnership';
//     case 'supply':
//       return 'Supply Chain';
//     case 'cross-chain':
//       return 'Cross-Chain';
//     default:
//       return templateType.charAt(0).toUpperCase() + templateType.slice(1);
//   }
// }





