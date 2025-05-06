"use client"

import type React from "react"
import { useState, type FormEvent, type ChangeEvent } from "react"
import useWallet from "../../lib/hooks/useWallet"
import { createCommitment } from "../../lib/contract"
import type { CommitmentCreatedResult } from "../../lib/contract/types"
import { AlertTriangle, Loader2 } from "lucide-react"

interface CommitmentFormProps {
  onSuccess: (result: CommitmentCreatedResult) => void
}

interface FormData {
  name: string
  description: string
  totalMembers: number
  stakeAmount: number
  durationInDays: number
}

interface ValidationErrors {
  name?: string
  description?: string
  totalMembers?: string
  stakeAmount?: string
  durationInDays?: string
}

const CommitmentForm: React.FC<CommitmentFormProps> = ({ onSuccess }) => {
  const { signer, account, isCorrectNetwork, switchToPolkadotNetwork } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    totalMembers: 2,
    stakeAmount: 0.1,
    durationInDays: 30,
  })

  // Form validation
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear validation error for this field
    if (validationErrors[id as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (formData.totalMembers < 1) {
      errors.totalMembers = "At least 1 member is required"
    }

    if (formData.stakeAmount <= 0) {
      errors.stakeAmount = "Stake amount must be greater than 0"
    }

    if (formData.durationInDays < 1) {
      errors.durationInDays = "Duration must be at least 1 day"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!signer) {
      setError("Please connect your wallet first")
      return
    }

    if (!isCorrectNetwork) {
      setError("Please switch to the Polkadot network")
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await createCommitment(
        signer,
        formData.name,
        formData.description,
        Number(formData.totalMembers),
        Number(formData.stakeAmount),
        Number(formData.durationInDays),
      )

      // Reset form
      setFormData({
        name: "",
        description: "",
        totalMembers: 2,
        stakeAmount: 0.1,
        durationInDays: 30,
      })

      // Call success callback with result
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err: any) {
      console.error("Error creating commitment:", err)
      setError(err.message || "Failed to create commitment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="heading-3 mb-6">Create a New Commitment</h2>

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
          <label htmlFor="name" className="text-sm font-medium">
            Commitment Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter commitment name"
            required
            className={`input-primary ${validationErrors.name ? "border-destructive" : ""}`}
          />
          {validationErrors.name && <p className="text-xs text-destructive">{validationErrors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter commitment description"
            required
            rows={3}
            className={`input-primary min-h-[100px] resize-y ${validationErrors.description ? "border-destructive" : ""}`}
          />
          {validationErrors.description && <p className="text-xs text-destructive">{validationErrors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="totalMembers" className="text-sm font-medium">
              Total Members <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              id="totalMembers"
              value={formData.totalMembers}
              onChange={handleChange}
              min={1}
              required
              className={`input-primary ${validationErrors.totalMembers ? "border-destructive" : ""}`}
            />
            {validationErrors.totalMembers && (
              <p className="text-xs text-destructive">{validationErrors.totalMembers}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="stakeAmount" className="text-sm font-medium">
              Stake Amount (DOT) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              id="stakeAmount"
              value={formData.stakeAmount}
              onChange={handleChange}
              step={0.01}
              min={0.01}
              required
              className={`input-primary ${validationErrors.stakeAmount ? "border-destructive" : ""}`}
            />
            {validationErrors.stakeAmount && <p className="text-xs text-destructive">{validationErrors.stakeAmount}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="durationInDays" className="text-sm font-medium">
              Duration (Days) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              id="durationInDays"
              value={formData.durationInDays}
              onChange={handleChange}
              min={1}
              required
              className={`input-primary ${validationErrors.durationInDays ? "border-destructive" : ""}`}
            />
            {validationErrors.durationInDays && (
              <p className="text-xs text-destructive">{validationErrors.durationInDays}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !signer || !isCorrectNetwork}
          className={`btn-primary w-full ${
            loading || !signer || !isCorrectNetwork ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </span>
          ) : (
            "Create Commitment"
          )}
        </button>
      </form>
    </div>
  )
}

export default CommitmentForm
