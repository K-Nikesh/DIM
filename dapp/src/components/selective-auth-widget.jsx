"use client"

import { useState, useEffect } from "react"
import { Shield, CheckCircle, AlertCircle, Loader, Settings, Eye } from "lucide-react"
import { useContract } from "../context/ContractContext"
import { ConsentManager } from "./consent-manager"
import {
  filterDataByConsent,
  generateSelectiveDisclosureProof,
  hasConsent,
  DATA_CATEGORIES,
} from "../utils/selective-disclosure"

export function SelectiveAuthWidget({
  onAuthSuccess,
  onAuthError,
  appDomain,
  appName = "External Application",
  requestedPermissions = [],
  showConsentManager = false,
}) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStatus, setAuthStatus] = useState("idle")
  const [error, setError] = useState("")
  const [showConsent, setShowConsent] = useState(showConsentManager)
  const [userConsents, setUserConsents] = useState([])
  const [sharedData, setSharedData] = useState(null)

  const { account, isRegistered, credentials, loading } = useContract()

  useEffect(() => {
    if (account && appDomain) {
      // Check existing consents
      const consents = requestedPermissions.map((permission) => hasConsent(account, appDomain, permission))
      setUserConsents(consents)
    }
  }, [account, appDomain, requestedPermissions])

  const handleAuthenticate = async () => {
    try {
      setIsAuthenticating(true)
      setAuthStatus("authenticating")
      setError("")

      if (!account) {
        throw new Error("Please connect your wallet first")
      }

      if (!isRegistered) {
        throw new Error("Please register your identity in DIM first")
      }

      // Prepare user data
      const userData = {
        account,
        name: "User Name", // This would come from identity metadata
        credentialCount: credentials.filter((c) => !c.isRevoked).length,
        credentials: credentials.filter((c) => !c.isRevoked),
        registrationDate: new Date().toISOString(), // This would come from blockchain
        issuerDetails: credentials.map((c) => ({ issuer: c.issuer, type: "verified" })),
      }

      // Filter data based on user consent
      const filteredData = filterDataByConsent(userData, account, appDomain, requestedPermissions)

      if (!filteredData.consentGiven && requestedPermissions.length > 0) {
        // Show consent manager if no consent given
        setShowConsent(true)
        setAuthStatus("consent_required")
        return
      }

      // Generate selective disclosure proof
      const allowedFields = []
      Object.values(DATA_CATEGORIES).forEach((category) => {
        if (hasConsent(account, appDomain, category.id)) {
          allowedFields.push(...category.fields)
        }
      })

      const proof = await generateSelectiveDisclosureProof(userData, allowedFields, account)

      const authResult = {
        account,
        sharedData: filteredData,
        proof,
        timestamp: new Date().toISOString(),
        appDomain,
      }

      setSharedData(filteredData)
      setAuthStatus("success")

      if (onAuthSuccess) {
        onAuthSuccess(authResult)
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError(error.message)
      setAuthStatus("error")

      if (onAuthError) {
        onAuthError(error)
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleConsentUpdate = (permissions) => {
    setUserConsents(permissions)
    setShowConsent(false)

    // Retry authentication with new permissions
    if (permissions.length > 0) {
      handleAuthenticate()
    }
  }

  const connectWallet = async () => {
    try {
      setAuthStatus("connecting")
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
      } else {
        throw new Error("MetaMask not installed")
      }
    } catch (error) {
      setError("Failed to connect wallet")
      setAuthStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading DIM...</span>
        </div>
      </div>
    )
  }

  if (showConsent) {
    return <ConsentManager appDomain={appDomain} appName={appName} onConsentUpdate={handleConsentUpdate} />
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border">
      <div className="flex items-center mb-4">
        <Shield className="h-8 w-8 text-blue-500 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Self-Sovereign Authentication</h3>
          <p className="text-sm text-gray-600">Authenticate with {appName}</p>
        </div>
      </div>

      {!account ? (
        <div className="space-y-4">
          <p className="text-gray-600">Connect your wallet to authenticate with selective data sharing.</p>
          <button
            onClick={connectWallet}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={authStatus === "connecting"}
          >
            {authStatus === "connecting" ? (
              <>
                <Loader className="inline h-4 w-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      ) : authStatus === "success" ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Authentication Successful</span>
            </div>
            <p className="text-green-700 text-sm mt-1">Selective data sharing completed</p>
          </div>

          {sharedData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Shared Information
              </h4>
              <div className="space-y-2 text-sm">
                {sharedData.account && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Address:</span>
                    <span className="font-mono text-xs">
                      {sharedData.account.slice(0, 6)}...{sharedData.account.slice(-4)}
                    </span>
                  </div>
                )}
                {sharedData.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{sharedData.name}</span>
                  </div>
                )}
                {sharedData.credentialCount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credentials:</span>
                    <span>{sharedData.credentialCount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Shared categories: {sharedData.sharedCategories?.join(", ") || "Basic only"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowConsent(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Data Sharing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Self-Sovereign Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ You control what data is shared</li>
              <li>✓ Minimal disclosure principle</li>
              <li>✓ Cryptographic proof of consent</li>
              <li>✓ Revocable permissions</li>
            </ul>
          </div>

          {requestedPermissions.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Requested Information</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {requestedPermissions.map((permission) => {
                  const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permission)
                  return <li key={permission}>• {category?.name || permission}</li>
                })}
              </ul>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => setShowConsent(true)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Manage Consent
            </button>
            <button
              onClick={handleAuthenticate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <Loader className="inline h-4 w-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                "Authenticate"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Self-Sovereign Identity • You control your data</p>
      </div>
    </div>
  )
}

export default SelectiveAuthWidget
