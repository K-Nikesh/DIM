// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import {
//   getProviderAndSigner,
//   getContract,
//   checkIdentityStatus,
//   checkIssuerStatus,
//   getCredentials,
//   listenForEvents,
// } from "../utils/contract"

// // Create the context
// const ContractContext = createContext(null)

// // Custom hook to use the contract context
// export const useContract = () => {
//   const context = useContext(ContractContext)
//   if (!context) {
//     throw new Error("useContract must be used within a ContractProvider")
//   }
//   return context
// }

// // Provider component
// export const ContractProvider = ({ children }) => {
//   const [account, setAccount] = useState("")
//   const [contract, setContract] = useState(null)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [isIssuer, setIsIssuer] = useState(false)
//   const [isRegistered, setIsRegistered] = useState(false)
//   const [credentials, setCredentials] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Initialize the contract and account
//   useEffect(() => {
//     const init = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         // Check if MetaMask is installed
//         if (!window.ethereum) {
//           throw new Error("MetaMask is not installed")
//         }

//         // Get the provider and signer
//         const { provider, signer } = await getProviderAndSigner()

//         // Get the current account
//         const accounts = await provider.listAccounts()
//         if (accounts.length === 0) {
//           throw new Error("No accounts found. Please connect to MetaMask")
//         }

//         const currentAccount = accounts[0]
//         setAccount(currentAccount)

//         // Get the contract instance
//         const contractInstance = getContract(signer)
//         setContract(contractInstance)

//         // Check if the user is an admin (for demo purposes, we'll check if it's the contract deployer)
//         // In a real app, you would have a proper admin check in the contract
//         const adminAddress = "0xbC259400E046F6581439D028E81722736CC68f98" 
//         setIsAdmin(currentAccount.toLowerCase() === adminAddress.toLowerCase())

//         // Check if the user is an approved issuer
//         const issuerStatus = await checkIssuerStatus(currentAccount)
//         setIsIssuer(issuerStatus)

//         // Check if the user has a registered identity
//         const identity = await checkIdentityStatus(currentAccount)
//         setIsRegistered(identity.isRegistered)

//         // Get the user's credentials
//         const userCredentials = await getCredentials(currentAccount)
//         setCredentials(userCredentials)

//         // Set up event listeners
//         const cleanupEvents = listenForEvents(contractInstance, handleContractEvent)

//         setLoading(false)

//         // Clean up event listeners when component unmounts
//         return () => {
//           cleanupEvents()
//         }
//       } catch (err) {
//         console.error("Error initializing contract:", err)
//         setError(err.message)
//         setLoading(false)
//       }
//     }

//     init()

//     // Listen for account changes
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", (accounts) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0])
//           // Reinitialize when account changes
//           init()
//         } else {
//           setAccount("")
//           setIsAdmin(false)
//           setIsIssuer(false)
//           setIsRegistered(false)
//           setCredentials([])
//         }
//       })
//     }

//     return () => {
//       // Clean up listeners
//       if (window.ethereum) {
//         window.ethereum.removeAllListeners("accountsChanged")
//       }
//     }
//   }, [])

//   // Handle contract events
//   const handleContractEvent = async (event) => {
//     console.log("Contract event:", event)

//     // Refresh data based on event type
//     if (event.type === "IdentityRegistered" && event.user === account) {
//       setIsRegistered(true)
//     } else if (event.type === "IssuerApproved" && event.issuer === account) {
//       setIsIssuer(true)
//     } else if (event.type === "IssuerRevoked" && event.issuer === account) {
//       setIsIssuer(false)
//     } else if (event.type === "CredentialIssued" && event.user === account) {
//       // Refresh credentials
//       const userCredentials = await getCredentials(account)
//       setCredentials(userCredentials)
//     } else if (event.type === "CredentialRevoked" && event.user === account) {
//       // Refresh credentials
//       const userCredentials = await getCredentials(account)
//       setCredentials(userCredentials)
//     }
//   }

//   // Refresh user data
//   const refreshUserData = async () => {
//     try {
//       setLoading(true)

//       // Check if the user is an approved issuer
//       const issuerStatus = await checkIssuerStatus(account)
//       setIsIssuer(issuerStatus)

//       // Check if the user has a registered identity
//       const identity = await checkIdentityStatus(account)
//       setIsRegistered(identity.isRegistered)

//       // Get the user's credentials
//       const userCredentials = await getCredentials(account)
//       setCredentials(userCredentials)

//       setLoading(false)
//     } catch (err) {
//       console.error("Error refreshing user data:", err)
//       setError(err.message)
//       setLoading(false)
//     }
//   }

//   // Context value
//   const value = {
//     account,
//     contract,
//     isAdmin,
//     isIssuer,
//     isRegistered,
//     credentials,
//     loading,
//     error,
//     refreshUserData,
//   }

//   return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>
// }



"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  getProviderAndSigner,
  getContract,
  checkIdentityStatus,
  checkIssuerStatus,
  getCredentials,
  listenForEvents,
} from "../utils/contract"

const ContractContext = createContext(null)

export const useContract = () => {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider")
  }
  return context
}

export const ContractProvider = ({ children }) => {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isIssuer, setIsIssuer] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const adminAddress = "0xbC259400E046F6581439D028E81722736CC68f98"

  const safeCall = async (fn, fallback = null) => {
    try {
      return await fn()
    } catch (err) {
      if (err.code === "CALL_EXCEPTION") {
        console.warn("SafeCall Revert (likely function missing):", err)
        return fallback
      }
      throw err
    }
  }

  const init = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      const { provider, signer } = await getProviderAndSigner()
      const accounts = await provider.listAccounts()
      if (accounts.length === 0) throw new Error("Please connect to MetaMask")

      const currentAccount = accounts[0]
      setAccount(currentAccount)

      const contractInstance = getContract(signer)
      setContract(contractInstance)

      setIsAdmin(currentAccount.toLowerCase() === adminAddress.toLowerCase())

      const issuerStatus = await safeCall(() => checkIssuerStatus(currentAccount), false)
      setIsIssuer(issuerStatus)

      const identity = await safeCall(() => checkIdentityStatus(currentAccount), { isRegistered: false })
      setIsRegistered(identity.isRegistered)

      const userCredentials = await safeCall(() => getCredentials(currentAccount), [])
      setCredentials(userCredentials)

      const cleanupEvents = listenForEvents(contractInstance, handleContractEvent)
      setLoading(false)

      return () => cleanupEvents()
    } catch (err) {
      console.error("Error initializing contract:", err)
      setError(err.message || "Unknown error")
      setLoading(false)
    }
  }

  const refreshUserData = async () => {
    try {
      setLoading(true)

      const issuerStatus = await safeCall(() => checkIssuerStatus(account), false)
      setIsIssuer(issuerStatus)

      const identity = await safeCall(() => checkIdentityStatus(account), { isRegistered: false })
      setIsRegistered(identity.isRegistered)

      const userCredentials = await safeCall(() => getCredentials(account), [])
      setCredentials(userCredentials)

      setLoading(false)
    } catch (err) {
      console.error("Error refreshing user data:", err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleContractEvent = async (event) => {
    console.log("Contract event:", event)

    try {
      if (event.type === "IdentityRegistered" && event.user === account) {
        setIsRegistered(true)
      } else if (event.type === "IssuerApproved" && event.issuer === account) {
        setIsIssuer(true)
      } else if (event.type === "IssuerRevoked" && event.issuer === account) {
        setIsIssuer(false)
      } else if (
        (event.type === "CredentialIssued" || event.type === "CredentialRevoked") &&
        event.user === account
      ) {
        const userCredentials = await safeCall(() => getCredentials(account), [])
        setCredentials(userCredentials)
      }
    } catch (err) {
      console.error("Error handling event update:", err)
    }
  }

  useEffect(() => {
    init()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          init()
        } else {
          setAccount("")
          setIsAdmin(false)
          setIsIssuer(false)
          setIsRegistered(false)
          setCredentials([])
        }
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  const value = {
    account,
    contract,
    isAdmin,
    isIssuer,
    isRegistered,
    credentials,
    loading,
    error,
    refreshUserData,
  }

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>
}
