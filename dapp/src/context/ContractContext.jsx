
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

// const ContractContext = createContext(null)

// export const useContract = () => {
//   const context = useContext(ContractContext)
//   if (!context) {
//     throw new Error("useContract must be used within a ContractProvider")
//   }
//   return context
// }

// export const ContractProvider = ({ children }) => {
//   const [account, setAccount] = useState("")
//   const [contract, setContract] = useState(null)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [isIssuer, setIsIssuer] = useState(false)
//   const [isRegistered, setIsRegistered] = useState(false)
//   const [credentials, setCredentials] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const adminAddress = "0xbC259400E046F6581439D028E81722736CC68f98"

//   const safeCall = async (fn, fallback = null) => {
//     try {
//       return await fn()
//     } catch (err) {
//       if (err.code === "CALL_EXCEPTION") {
//         console.warn("SafeCall Revert (likely function missing):", err)
//         return fallback
//       }
//       throw err
//     }
//   }

//   const init = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       if (!window.ethereum) {
//         throw new Error("MetaMask is not installed")
//       }

//       const { provider, signer } = await getProviderAndSigner()
//       const accounts = await provider.listAccounts()
//       if (accounts.length === 0) throw new Error("Please connect to MetaMask")

//       const currentAccount = accounts[0]
//       setAccount(currentAccount)

//       const contractInstance = getContract(signer)
//       setContract(contractInstance)

//       setIsAdmin(currentAccount.toLowerCase() === adminAddress.toLowerCase())

//       const issuerStatus = await safeCall(() => checkIssuerStatus(currentAccount), false)
//       setIsIssuer(issuerStatus)

//       const identity = await safeCall(() => checkIdentityStatus(currentAccount), { isRegistered: false })
//       setIsRegistered(identity.isRegistered)

//       const userCredentials = await safeCall(() => getCredentials(currentAccount), [])
//       setCredentials(userCredentials)

//       const cleanupEvents = listenForEvents(contractInstance, handleContractEvent)
//       setLoading(false)

//       return () => cleanupEvents()
//     } catch (err) {
//       console.error("Error initializing contract:", err)
//       setError(err.message || "Unknown error")
//       setLoading(false)
//     }
//   }

//   const refreshUserData = async () => {
//     try {
//       setLoading(true)

//       const issuerStatus = await safeCall(() => checkIssuerStatus(account), false)
//       setIsIssuer(issuerStatus)

//       const identity = await safeCall(() => checkIdentityStatus(account), { isRegistered: false })
//       setIsRegistered(identity.isRegistered)

//       const userCredentials = await safeCall(() => getCredentials(account), [])
//       setCredentials(userCredentials)

//       setLoading(false)
//     } catch (err) {
//       console.error("Error refreshing user data:", err)
//       setError(err.message)
//       setLoading(false)
//     }
//   }

//   const handleContractEvent = async (event) => {
//     console.log("Contract event:", event)

//     try {
//       if (event.type === "IdentityRegistered" && event.user === account) {
//         setIsRegistered(true)
//       } else if (event.type === "IssuerApproved" && event.issuer === account) {
//         setIsIssuer(true)
//       } else if (event.type === "IssuerRevoked" && event.issuer === account) {
//         setIsIssuer(false)
//       } else if (
//         (event.type === "CredentialIssued" || event.type === "CredentialRevoked") &&
//         event.user === account
//       ) {
//         const userCredentials = await safeCall(() => getCredentials(account), [])
//         setCredentials(userCredentials)
//       }
//     } catch (err) {
//       console.error("Error handling event update:", err)
//     }
//   }

//   useEffect(() => {
//     init()

//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", (accounts) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0])
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
//       if (window.ethereum) {
//         window.ethereum.removeAllListeners("accountsChanged")
//       }
//     }
//   }, [])

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
  getCredentialRequests,
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
  const [credentialRequests, setCredentialRequests] = useState([])
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

      // If user is an issuer, get credential requests
      if (issuerStatus) {
        const requests = await safeCall(() => getCredentialRequests(currentAccount), [])
        setCredentialRequests(requests)
      }

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

      // If user is an issuer, refresh credential requests
      if (issuerStatus) {
        const requests = await safeCall(() => getCredentialRequests(account), [])
        setCredentialRequests(requests)
      }

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
        // Get credential requests for the newly approved issuer
        const requests = await safeCall(() => getCredentialRequests(account), [])
        setCredentialRequests(requests)
      } else if (event.type === "IssuerRevoked" && event.issuer === account) {
        setIsIssuer(false)
        setCredentialRequests([])
      } else if ((event.type === "CredentialIssued" || event.type === "CredentialRevoked") && event.user === account) {
        const userCredentials = await safeCall(() => getCredentials(account), [])
        setCredentials(userCredentials)
      } else if (event.type === "CredentialRequested" && event.issuer === account) {
        // Refresh credential requests for the issuer
        const requests = await safeCall(() => getCredentialRequests(account), [])
        setCredentialRequests(requests)
      } else if (event.type === "CredentialRequestReviewed" && event.issuer === account) {
        // Refresh credential requests for the issuer
        const requests = await safeCall(() => getCredentialRequests(account), [])
        setCredentialRequests(requests)
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
          setCredentialRequests([])
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
    credentialRequests,
    loading,
    error,
    refreshUserData,
  }

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>
}
