export interface CommitmentDetails {
  name: string
  description: string
  totalMembers: number
  joinedMembers: number
  stakeAmount: string
  deadline: Date
  isActive: boolean
  isCompleted: boolean
  id?: string
}

export interface CommitmentCreatedResult {
  commitmentId: string
  joinCode: string
  name: string
  creator: string
}

export interface CommitmentJoinedResult {
  commitmentId: string
  member: string
}

export interface WithdrawalResult {
  account: string
  amount: string
}

export interface CommitmentEvent {
  type: "CommitmentCreated" | "MemberJoined" | "CommitmentCompleted" | "WithdrawalReady"
  commitmentId?: string
  name?: string
  creator?: string
  joinCode?: string
  member?: string
  successful?: boolean
  account?: string
  amount?: string
  timestamp: Date
  blockNumber?: number
  transactionHash?: string
}

export interface CommitmentStats {
  active: number
  completed: number
  failed: number
  totalStaked: number
}

export interface CompletionStatus {
  agreementsCount: number
  requiredCount: number
  percentage: number
}
