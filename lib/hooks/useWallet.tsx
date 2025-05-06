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

const POLKADOT_CHAIN_ID = "0x162" // 354 in decimal

const useWallet = (): UseWalletReturnType => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  // Check if MetaMask is installed
  const checkIfWalletIsInstalled = useCallback((): boolean => {
    return typeof window !== "undefined" && Boolean(window.ethereum)
  }, [])

  // Initialize wallet connection
  const initializeWallet = useCallback(async (): Promise<void> => {
    try {
      if (!checkIfWalletIsInstalled() || !window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      setLoading(true)

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const account = accounts[0]

      // Initialize provider and signer
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      // Check if on correct network
      const networkChainId = network.chainId
      const isCorrect = networkChainId === BigInt(354) || "0x" + networkChainId.toString(16) === POLKADOT_CHAIN_ID

      // Get account balance
      const balance = await provider.getBalance(account)

      setAccount(account)
      setProvider(provider)
      setSigner(signer)
      setChainId(Number(networkChainId))
      setIsCorrectNetwork(isCorrect)
      setBalance(formatEther(balance))
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
    setAccount(null)
    setSigner(null)
    setChainId(null)
    setIsCorrectNetwork(false)
    setBalance(null)
    localStorage.removeItem("walletConnected")
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

        if (provider && newAccount) {
          // Update balance for new account
          try {
            const balance = await provider.getBalance(newAccount)
            setBalance(formatEther(balance))
          } catch (error) {
            console.error("Error fetching balance:", error)
          }
        }
      }
    },
    [disconnectWallet, provider],
  )

  // Handle chain change
  const handleChainChanged = useCallback(
    async (newChainId: string): Promise<void> => {
      setChainId(Number.parseInt(newChainId, 16))

      // Check if on correct network
      const isCorrect = Number.parseInt(newChainId, 16) === 354 || newChainId === POLKADOT_CHAIN_ID
      setIsCorrectNetwork(isCorrect)

      // Re-initialize everything with the new chain
      if (window.ethereum && account) {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        setProvider(provider)
        setSigner(signer)

        try {
          const balance = await provider.getBalance(account)
          setBalance(formatEther(balance))
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    },
    [account],
  )

  // Update balance
  const updateBalance = useCallback(async (): Promise<void> => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account)
        setBalance(formatEther(balance))
      } catch (error) {
        console.error("Error updating balance:", error)
      }
    }
  }, [provider, account])

  // Setup event listeners
  useEffect(() => {
    if (checkIfWalletIsInstalled() && window.ethereum) {
      // Check if we should initialize wallet automatically
      if (localStorage.getItem("walletConnected") === "true") {
        initializeWallet()
      } else {
        setLoading(false)
      }

      // Setup event listeners
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Cleanup
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    } else {
      setLoading(false)
      setError("MetaMask is not installed")
    }
  }, [checkIfWalletIsInstalled, handleAccountsChanged, handleChainChanged, initializeWallet])

  // Periodically update balance
  useEffect(() => {
    if (account && provider) {
      const interval = setInterval(updateBalance, 30000) // Update every 30 seconds

      // Initial update
      updateBalance()

      return () => clearInterval(interval)
    }
  }, [account, provider, updateBalance])

  // Connect wallet function
  const connectWallet = async (): Promise<void> => {
    try {
      await initializeWallet()
      localStorage.setItem("walletConnected", "true")
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      setError(error.message || "Failed to connect wallet")
    }
  }

  // Switch to Polkadot network
  const switchToPolkadotNetwork = async (): Promise<void> => {
    if (!window.ethereum) throw new Error("No crypto wallet found")

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
      if (!window.ethereum) throw new Error("No crypto wallet found")

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: POLKADOT_CHAIN_ID,
            chainName: "Polkadot Asset Hub",
            nativeCurrency: {
              name: "DOT",
              symbol: "DOT",
              decimals: 18,
            },
            rpcUrls: ["https://polkadot-asset-hub-rpc.polkadot.io"],
            blockExplorerUrls: ["https://assethub.polkadot.subscan.io/"],
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
    isWalletInstalled: checkIfWalletIsInstalled(),
  }
}

export default useWallet
