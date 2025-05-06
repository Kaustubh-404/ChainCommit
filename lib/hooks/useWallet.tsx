// Modified useWallet.tsx hook to prevent event filter errors
"use client"

import { useState, useEffect, useCallback } from "react"
import { BrowserProvider, type JsonRpcSigner, formatEther } from "ethers"

interface UseWalletReturnType {
  account: string | null
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  chainId: number | null
  isCorrectNetwork: boolean
  loading: boolean
  error: string | null
  balance: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchToPolkadotNetwork: () => Promise<void>
  updateBalance: () => Promise<void>
  isWalletInstalled: boolean
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, callback: (...args: any[]) => void) => void
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void
    }
  }
}

const POLKADOT_CHAIN_ID = "0x190f1b45" // 354 in decimal

const useWallet = (): UseWalletReturnType => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)
  const [balanceUpdateRequested, setBalanceUpdateRequested] = useState<boolean>(false)

  // Check if MetaMask is installed
  const checkIfWalletIsInstalled = useCallback((): boolean => {
    if (typeof window === "undefined") return false
    return Boolean(window.ethereum)
  }, [])

  // Initialize wallet connection
  const initializeWallet = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined") return

    try {
      if (!checkIfWalletIsInstalled() || !window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      setLoading(true)

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found")
      }
      
      const account = accounts[0]

      // Initialize provider 
      const provider = new BrowserProvider(window.ethereum)
      
      // Get network with error handling
      let network;
      try {
        network = await provider.getNetwork()
      } catch (err) {
        console.error("Network detection error:", err)
        // Continue with a default network state
        network = { chainId: BigInt(0), name: "unknown" }
      }

      // Check if on correct network
      const networkChainId = network.chainId
      const isCorrect = networkChainId === BigInt(354) || "0x" + networkChainId.toString(16) === POLKADOT_CHAIN_ID

      // Get signer after network check
      let currentSigner = null;
      try {
        currentSigner = await provider.getSigner()
      } catch (err) {
        console.error("Failed to get signer:", err)
        // Continue without signer
      }

      // Get account balance with error handling
      let balanceValue = "0";
      try {
        // Simple direct RPC call instead of using provider.getBalance
        const balanceHex = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"]
        });
        
        // Convert hex to decimal and then to ETH units
        if (balanceHex && typeof balanceHex === 'string') {
          const balanceWei = BigInt(balanceHex);
          balanceValue = formatEther(balanceWei);
        }
      } catch (err) {
        console.error("Error fetching balance:", err)
        // Use default balance
      }

      setAccount(account)
      setProvider(provider)
      setSigner(currentSigner)
      setChainId(Number(networkChainId))
      setIsCorrectNetwork(isCorrect)
      setBalance(balanceValue)
      setError(null)
    } catch (error: any) {
      console.error("Failed to initialize wallet", error)
      setError(error.message || "Failed to connect wallet")
      setAccount(null)
      setSigner(null)
      setChainId(null)
      setIsCorrectNetwork(false)
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }, [checkIfWalletIsInstalled])

  // Disconnect wallet
  const disconnectWallet = useCallback((): void => {
    if (typeof window === "undefined") return
    
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setIsCorrectNetwork(false)
    setBalance(null)
    
    // Only try to access localStorage on client
    if (typeof window !== "undefined") {
      localStorage.removeItem("walletConnected")
    }
  }, [])

  // Handle account change
  const handleAccountsChanged = useCallback(
    async (accounts: string[]): Promise<void> => {
      if (accounts.length === 0) {
        // User has disconnected all accounts
        disconnectWallet()
      } else {
        const newAccount = accounts[0]
        setAccount(newAccount)
        setBalanceUpdateRequested(true)
      }
    },
    [disconnectWallet]
  )

  // Handle chain change
  const handleChainChanged = useCallback(
    async (newChainId: string): Promise<void> => {
      try {
        setChainId(Number.parseInt(newChainId, 16))

        // Check if on correct network
        const isCorrect = Number.parseInt(newChainId, 16) === 354 || newChainId === POLKADOT_CHAIN_ID
        setIsCorrectNetwork(isCorrect)

        // Re-initialize provider and signer
        if (typeof window !== "undefined" && window.ethereum && account) {
          try {
            const provider = new BrowserProvider(window.ethereum)
            setProvider(provider)
            
            try {
              const signer = await provider.getSigner()
              setSigner(signer)
            } catch (err) {
              console.error("Error getting signer after chain change:", err)
              setSigner(null)
            }
            
            // Request a balance update
            setBalanceUpdateRequested(true)
          } catch (err) {
            console.error("Error setting up provider after chain change:", err)
          }
        }
      } catch (err) {
        console.error("Error handling chain change:", err)
      }
    },
    [account]
  )

  // Update balance - safer implementation that doesn't use eth_newFilter
  const updateBalance = useCallback(async (): Promise<void> => {
    if (!account || typeof window === "undefined" || !window.ethereum) return

    try {
      // Use direct RPC call instead of provider.getBalance to avoid filter issues
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"]
      });
      
      // Convert hex to decimal and then to ETH units
      if (balanceHex && typeof balanceHex === 'string') {
        const balanceWei = BigInt(balanceHex);
        setBalance(formatEther(balanceWei));
      }
      
      // Reset the update request flag
      setBalanceUpdateRequested(false)
    } catch (error) {
      console.error("Error updating balance:", error)
      // Don't update the state in case of error to avoid UI disruption
    }
  }, [account])

  // Setup event listeners
  useEffect(() => {
    setMounted(true)
    
    const cleanup = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
    
    if (typeof window !== "undefined") {
      if (checkIfWalletIsInstalled() && window.ethereum) {
        // Check if we should initialize wallet automatically
        if (localStorage.getItem("walletConnected") === "true") {
          initializeWallet().catch(err => {
            console.error("Auto-connect error:", err)
            localStorage.removeItem("walletConnected")
          })
        } else {
          setLoading(false)
        }

        // Setup event listeners
        window.ethereum.on("accountsChanged", handleAccountsChanged)
        window.ethereum.on("chainChanged", handleChainChanged)

        return cleanup
      } else {
        setLoading(false)
      }
    }
    
    return cleanup
  }, [checkIfWalletIsInstalled, handleAccountsChanged, handleChainChanged, initializeWallet])

  // Handle balance updates when requested
  useEffect(() => {
    if (mounted && balanceUpdateRequested) {
      updateBalance().catch(err => {
        console.error("Balance update error:", err)
      })
    }
  }, [mounted, balanceUpdateRequested, updateBalance])

  // Connect wallet function
  const connectWallet = async (): Promise<void> => {
    try {
      await initializeWallet()
      if (typeof window !== "undefined") {
        localStorage.setItem("walletConnected", "true")
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      setError(error.message || "Failed to connect wallet")
    }
  }

  // Switch to Polkadot network
  const switchToPolkadotNetwork = async (): Promise<void> => {
    if (typeof window === "undefined" || !window.ethereum) 
      throw new Error("No crypto wallet found")

    try {
      // Try to switch to Polkadot Asset Hub
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: POLKADOT_CHAIN_ID }],
      })
    } catch (err: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await addPolkadotNetwork()
      } else {
        throw err
      }
    }
  }

  // Add Polkadot network to MetaMask
  const addPolkadotNetwork = async (): Promise<void> => {
    try {
      if (typeof window === "undefined" || !window.ethereum) 
        throw new Error("No crypto wallet found")

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: POLKADOT_CHAIN_ID,
            chainName: "Westend Asset Hub",
            nativeCurrency: {
             name: "WND",
             symbol: "WND",
             decimals: 18,
            },
            rpcUrls: ["https://westend-asset-hub-eth-rpc.polkadot.io"],
            blockExplorerUrls: ["https://blockscout-asset-hub.parity-chains-swc.parity.io"],
          },
        ],
      })
    } catch (error) {
      console.error("Error adding Polkadot network:", error)
      throw error
    }
  }

  return {
    account,
    provider,
    signer,
    chainId,
    isCorrectNetwork,
    loading,
    error,
    balance,
    connectWallet,
    disconnectWallet,
    switchToPolkadotNetwork,
    updateBalance,
    isWalletInstalled: mounted ? checkIfWalletIsInstalled() : false,
  }
}

export default useWallet

