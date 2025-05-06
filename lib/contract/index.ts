import {
  Contract,
  type Provider,
  type Signer,
  parseEther,
  formatEther,
  type ContractTransactionReceipt,
  type Log,
  type EventLog,
} from "ethers"
import { CHAIN_COMMIT_ABI, CONTRACT_ADDRESS } from "./abi"
import type {
  CommitmentDetails,
  CommitmentCreatedResult,
  CommitmentJoinedResult,
  WithdrawalResult,
  CommitmentEvent,
} from "./types"

// Helper to safely access args from events
const getEventArgs = (log: Log | EventLog) => {
  if ("args" in log) {
    return (log as EventLog).args
  }
  return undefined
}

// Initialize contract with ethers
export const getContract = (providerOrSigner: Provider | Signer): Contract => {
  if (!providerOrSigner) {
    throw new Error("No provider or signer available")
  }

  return new Contract(CONTRACT_ADDRESS, CHAIN_COMMIT_ABI, providerOrSigner)
}

// Get all commitments for an address
export const getUserCommitments = async (provider: Provider, address: string): Promise<CommitmentDetails[]> => {
  if (!provider || !address) return []

  const contract = getContract(provider)

  try {
    // Get all events and filter them in memory
    const allCreatedEvents = await contract.queryFilter("CommitmentCreated")
    const allJoinedEvents = await contract.queryFilter("MemberJoined")

    // Filter events by address
    const createdEvents = allCreatedEvents.filter((event) => {
      const args = getEventArgs(event)
      return args && args[2]?.toLowerCase() === address.toLowerCase()
    })

    const joinedEvents = allJoinedEvents.filter((event) => {
      const args = getEventArgs(event)
      return args && args[1]?.toLowerCase() === address.toLowerCase()
    })

    // Get unique commitment IDs
    const commitmentIds = new Set<string>()

    createdEvents.forEach((event) => {
      const args = getEventArgs(event)
      if (args && args[0]) {
        commitmentIds.add(args[0])
      }
    })

    joinedEvents.forEach((event) => {
      const args = getEventArgs(event)
      if (args && args[0]) {
        commitmentIds.add(args[0])
      }
    })

    // Fetch details for each commitment
    const commitments = await Promise.all(
      Array.from(commitmentIds).map(async (id) => {
        try {
          const details = await getCommitmentDetails(provider, id)
          const members = await getCommitmentMembers(provider, id)

          return {
            id,
            ...details,
            members,
          }
        } catch (error) {
          console.error(`Error fetching commitment ${id}:`, error)
          return null
        }
      }),
    )

    // Filter out any failed fetches
    return commitments.filter(Boolean) as CommitmentDetails[]
  } catch (error) {
    console.error("Error fetching user commitments:", error)
    throw error
  }
}

// Contract interaction functions
export const createCommitment = async (
  signer: Signer,
  name: string,
  description: string,
  totalMembers: number,
  stakeAmount: number,
  durationInDays: number,
): Promise<CommitmentCreatedResult> => {
  if (!signer) throw new Error("No signer available")

  const contract = getContract(signer)
  const parsedStakeAmount = parseEther(stakeAmount.toString())

  try {
    const tx = await contract.createCommitment(name, description, totalMembers, parsedStakeAmount, durationInDays, {
      value: parsedStakeAmount,
    })

    const receipt = (await tx.wait()) as ContractTransactionReceipt

    // Find the CommitmentCreated event in the transaction logs
    const log = receipt.logs.find((log) => {
      try {
        return contract.interface.parseLog({ data: log.data, topics: log.topics })?.name === "CommitmentCreated"
      } catch (e) {
        return false
      }
    })

    if (!log) {
      throw new Error("Commitment creation failed - event not found")
    }

    const event = contract.interface.parseLog({ data: log.data, topics: log.topics })

    if (!event) {
      throw new Error("Failed to parse event")
    }

    return {
      commitmentId: event.args[0],
      joinCode: event.args[3],
      name: event.args[1],
      creator: event.args[2],
    }
  } catch (error) {
    console.error("Error creating commitment:", error)
    throw error
  }
}

export const joinCommitment = async (
  signer: Signer,
  joinCode: string,
  stakeAmount: string,
): Promise<CommitmentJoinedResult> => {
  if (!signer) throw new Error("No signer available")

  const contract = getContract(signer)
  const parsedStakeAmount = parseEther(stakeAmount.toString())

  try {
    const tx = await contract.joinCommitment(joinCode, { value: parsedStakeAmount })

    const receipt = (await tx.wait()) as ContractTransactionReceipt

    // Find the MemberJoined event
    const log = receipt.logs.find((log) => {
      try {
        return contract.interface.parseLog({ data: log.data, topics: log.topics })?.name === "MemberJoined"
      } catch (e) {
        return false
      }
    })

    if (!log) {
      throw new Error("Join operation failed - event not found")
    }

    const event = contract.interface.parseLog({ data: log.data, topics: log.topics })

    if (!event) {
      throw new Error("Failed to parse event")
    }

    return {
      commitmentId: event.args[0],
      member: event.args[1],
    }
  } catch (error) {
    console.error("Error joining commitment:", error)
    throw error
  }
}

export const agreeToComplete = async (signer: Signer, commitmentId: string): Promise<ContractTransactionReceipt> => {
  if (!signer) throw new Error("No signer available")

  const contract = getContract(signer)

  try {
    const tx = await contract.agreeToComplete(commitmentId)
    const receipt = (await tx.wait()) as ContractTransactionReceipt

    return receipt
  } catch (error) {
    console.error("Error agreeing to complete:", error)
    throw error
  }
}

export const getCommitmentDetails = async (provider: Provider, commitmentId: string): Promise<CommitmentDetails> => {
  if (!provider || !commitmentId) {
    throw new Error("Provider and commitment ID are required")
  }

  const contract = getContract(provider)

  try {
    const details = await contract.getCommitmentDetails(commitmentId)

    return {
      name: details[0],
      description: details[1],
      totalMembers: Number(details[2]),
      joinedMembers: Number(details[3]),
      stakeAmount: formatEther(details[4]),
      deadline: new Date(Number(details[5]) * 1000),
      isActive: details[6],
      isCompleted: details[7],
    }
  } catch (error) {
    console.error("Error fetching commitment details:", error)
    throw error
  }
}

export const getCommitmentMembers = async (provider: Provider, commitmentId: string): Promise<string[]> => {
  if (!provider || !commitmentId) {
    throw new Error("Provider and commitment ID are required")
  }

  const contract = getContract(provider)

  try {
    const members = await contract.getCommitmentMembers(commitmentId)
    return members
  } catch (error) {
    console.error("Error fetching commitment members:", error)
    throw error
  }
}

export const hasMemberAgreed = async (
  provider: Provider,
  commitmentId: string,
  memberAddress: string,
): Promise<boolean> => {
  if (!provider || !commitmentId || !memberAddress) {
    throw new Error("Provider, commitment ID, and member address are required")
  }

  const contract = getContract(provider)

  try {
    const hasAgreed = await contract.hasMemberAgreed(commitmentId, memberAddress)
    return hasAgreed
  } catch (error) {
    console.error("Error checking if member agreed:", error)
    throw error
  }
}

export const getCommitmentIdFromJoinCode = async (provider: Provider, joinCode: string): Promise<string> => {
  if (!provider || !joinCode) {
    throw new Error("Provider and join code are required")
  }

  const contract = getContract(provider)

  try {
    const commitmentId = await contract.codeToCommitmentId(joinCode)
    return commitmentId
  } catch (error) {
    console.error("Error getting commitment ID from join code:", error)
    throw error
  }
}

export const getPendingWithdrawal = async (provider: Provider, accountAddress: string): Promise<string> => {
  if (!provider || !accountAddress) {
    throw new Error("Provider and account address are required")
  }

  const contract = getContract(provider)

  try {
    const amount = await contract.getPendingWithdrawal(accountAddress)
    return formatEther(amount)
  } catch (error) {
    console.error("Error getting pending withdrawal:", error)
    throw error
  }
}

export const withdraw = async (signer: Signer): Promise<WithdrawalResult> => {
  if (!signer) throw new Error("No signer available")

  const contract = getContract(signer)

  try {
    const tx = await contract.withdraw()
    const receipt = (await tx.wait()) as ContractTransactionReceipt

    // Find the WithdrawalReady event
    const log = receipt.logs.find((log) => {
      try {
        return contract.interface.parseLog({ data: log.data, topics: log.topics })?.name === "WithdrawalReady"
      } catch (e) {
        return false
      }
    })

    if (!log) {
      throw new Error("Withdrawal failed - event not found")
    }

    const event = contract.interface.parseLog({ data: log.data, topics: log.topics })

    if (!event) {
      throw new Error("Failed to parse event")
    }

    return {
      account: event.args[0],
      amount: formatEther(event.args[1]),
    }
  } catch (error) {
    console.error("Error withdrawing funds:", error)
    throw error
  }
}

// Listen for events
export const listenForCommitmentEvents = (
  provider: Provider,
  callback: (event: CommitmentEvent) => void,
): (() => void) => {
  if (!provider || !callback) {
    throw new Error("Provider and callback are required")
  }

  try {
    const contract = getContract(provider)

    // Listen for CommitmentCreated events
    const createdListener = (commitmentId: string, name: string, creator: string, joinCode: string) => {
      callback({
        type: "CommitmentCreated",
        commitmentId,
        name,
        creator,
        joinCode,
        timestamp: new Date(),
      })
    }

    // Listen for MemberJoined events
    const joinedListener = (commitmentId: string, member: string) => {
      callback({
        type: "MemberJoined",
        commitmentId,
        member,
        timestamp: new Date(),
      })
    }

    // Listen for CommitmentCompleted events
    const completedListener = (commitmentId: string, successful: boolean) => {
      callback({
        type: "CommitmentCompleted",
        commitmentId,
        successful,
        timestamp: new Date(),
      })
    }

    // Listen for WithdrawalReady events
    const withdrawalListener = (account: string, amount: bigint) => {
      callback({
        type: "WithdrawalReady",
        account,
        amount: formatEther(amount),
        timestamp: new Date(),
      })
    }

    // Set up listeners
    contract.on("CommitmentCreated", createdListener)
    contract.on("MemberJoined", joinedListener)
    contract.on("CommitmentCompleted", completedListener)
    contract.on("WithdrawalReady", withdrawalListener)

    // Return cleanup function
    return () => {
      contract.off("CommitmentCreated", createdListener)
      contract.off("MemberJoined", joinedListener)
      contract.off("CommitmentCompleted", completedListener)
      contract.off("WithdrawalReady", withdrawalListener)
    }
  } catch (error) {
    console.error("Error setting up event listeners:", error)
    throw error
  }
}

// Get event history for a commitment
// Fixed getCommitmentEventHistory function for contract/index.ts
export const getCommitmentEventHistory = async (
  provider: Provider,
  commitmentId: string,
): Promise<CommitmentEvent[]> => {
  if (!provider || !commitmentId) {
    throw new Error("Provider and commitment ID are required")
  }

  try {
    const contract = getContract(provider)
    const events: CommitmentEvent[] = []

    // Use a safer approach with better error handling
    // Start with a more recent block number to avoid timeouts
    let startBlock: number
    try {
      const latestBlock = await provider.getBlockNumber()
      // Go back only 10000 blocks or to block 0, whichever is greater
      startBlock = Math.max(0, latestBlock - 10000)
    } catch (err) {
      console.error("Error getting latest block:", err)
      // Default to block 0 if we can't get the latest
      startBlock = 0
    }

    const latestBlock = await provider.getBlockNumber()

    // Handling each event type separately to prevent one failure from breaking everything
    let createdEvents: Array<any> = []
    let joinedEvents: Array<any> = []
    let completedEvents: Array<any> = []

    try {
      // Get CommitmentCreated events
      createdEvents = await contract.queryFilter("CommitmentCreated", startBlock, latestBlock)
    } catch (err) {
      console.error("Error fetching CommitmentCreated events:", err)
    }

    try {
      // Get MemberJoined events
      joinedEvents = await contract.queryFilter("MemberJoined", startBlock, latestBlock)
    } catch (err) {
      console.error("Error fetching MemberJoined events:", err)
    }

    try {
      // Get CommitmentCompleted events
      completedEvents = await contract.queryFilter("CommitmentCompleted", startBlock, latestBlock)
    } catch (err) {
      console.error("Error fetching CommitmentCompleted events:", err)
    }

    // Helper for safely accessing event args
    const getEventArgs = (log: any) => {
      try {
        if ("args" in log) {
          return log.args
        }
        return undefined
      } catch (err) {
        console.error("Error getting event args:", err)
        return undefined
      }
    }

    // Filter events for this specific commitment
    try {
      const filteredCreatedEvents = createdEvents.filter((event) => {
        const args = getEventArgs(event)
        return args && args[0] === commitmentId
      })

      const filteredJoinedEvents = joinedEvents.filter((event) => {
        const args = getEventArgs(event)
        return args && args[0] === commitmentId
      })

      const filteredCompletedEvents = completedEvents.filter((event) => {
        const args = getEventArgs(event)
        return args && args[0] === commitmentId
      })

      // Process CommitmentCreated events
      filteredCreatedEvents.forEach((event) => {
        const args = getEventArgs(event)
        if (args) {
          events.push({
            type: "CommitmentCreated",
            commitmentId: args[0],
            name: args[1],
            creator: args[2],
            joinCode: args[3],
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            timestamp: new Date(),
          })
        }
      })

      // Process MemberJoined events
      filteredJoinedEvents.forEach((event) => {
        const args = getEventArgs(event)
        if (args) {
          events.push({
            type: "MemberJoined",
            commitmentId: args[0],
            member: args[1],
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            timestamp: new Date(),
          })
        }
      })

      // Process CommitmentCompleted events
      filteredCompletedEvents.forEach((event) => {
        const args = getEventArgs(event)
        if (args) {
          events.push({
            type: "CommitmentCompleted",
            commitmentId: args[0],
            successful: args[1],
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            timestamp: new Date(),
          })
        }
      })
    } catch (err) {
      console.error("Error processing events:", err)
      // Return an empty array rather than failing
      return []
    }

    // Try to get timestamps for events, but handle failures gracefully
    for (let i = 0; i < events.length; i++) {
      if (events[i].blockNumber !== undefined) {
        try {
          const block = await provider.getBlock(Number(events[i].blockNumber))
          if (block && block.timestamp) {
            events[i].timestamp = new Date(Number(block.timestamp) * 1000)
          }
        } catch (err) {
          console.error(`Error getting timestamp for event ${i}:`, err)
          // Keep the default timestamp
        }
      }
    }

    // Sort events by timestamp
    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    return events
  } catch (error) {
    console.error("Error fetching commitment event history:", error)
    // Return empty array instead of throwing
    return []
  }
}
