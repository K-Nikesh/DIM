"use client"

import { useState } from "react"
import { Shield, CheckCircle, AlertCircle, Loader, ExternalLink } from "lucide-react"
import { useContract } from "../context/ContractContext"
import { createAuthSession } from "../utils/auth-api"

// Embeddable authentication widget for other sites
export function DIMAuthWidget({
  onAuthSuccess,
  onAuthError,
  redirectUrl,
  requiredCredentials = [],
  siteName = "External Site",
}) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStatus, setAuthStatus] = useState("idle") // idle, connecting, authenticating, success, error
  const [error, setError] = useState("")
  const [authData, setAuthData] = useState(null)

  const { account, isRegistered, credentials, loading } = useContract()

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

      // Check if user has required credentials
      if (requiredCredentials.length > 0) {
        const validCredentials = credentials.filter((cred) => !cred.isRevoked)
        const hasRequiredCredentials = requiredCredentials.every((required) =>
          validCredentials.some((cred) => cred.credentialHash.includes(required)),
        )

        if (!hasRequiredCredentials) {
          throw new Error(`Missing required credentials: ${requiredCredentials.join(", ")}`)
        }
      }

      // Create authentication session
      const session = await createAuthSession(account)
      setAuthData(session)
      setAuthStatus("success")

      // Call success callback
      if (onAuthSuccess) {
        onAuthSuccess(session)
      }

      // Redirect if URL provided
      if (redirectUrl) {
        const url = new URL(redirectUrl)
        url.searchParams.set("dim_token", session.token)
        url.searchParams.set("dim_account", account)
        window.location.href = url.toString()
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border">
      <div className="flex items-center mb-4">
        <Shield className="h-8 w-8 text-blue-500 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">DIM Authentication</h3>
          <p className="text-sm text-gray-600">Authenticate with {siteName}</p>
        </div>
      </div>

      {!account ? (
        <div className="space-y-4">
          <p className="text-gray-600">Connect your wallet to authenticate with your decentralized identity.</p>
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
      ) : !isRegistered ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">Identity not registered</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">You need to register your identity in DIM first.</p>
          </div>
          <a
            href="/dashboard/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            Register Identity
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </div>
      ) : authStatus === "success" ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Authentication Successful</span>
            </div>
            <p className="text-green-700 text-sm mt-1">You are now authenticated with {siteName}</p>
          </div>

          {authData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Profile Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Account:</span> {authData.profile.account.slice(0, 6)}...
                  {authData.profile.account.slice(-4)}
                </p>
                <p>
                  <span className="font-medium">Credentials:</span> {authData.profile.credentialCount}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {authData.profile.profile.name || "Anonymous"}
                </p>
              </div>
            </div>
          )}
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

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Connected Account</h4>
            <p className="text-sm text-gray-600">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            <p className="text-sm text-gray-600">Credentials: {credentials.filter((c) => !c.isRevoked).length}</p>
          </div>

          {requiredCredentials.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Required Credentials</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {requiredCredentials.map((req, index) => (
                  <li key={index}>• {req}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleAuthenticate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <>
                <Loader className="inline h-4 w-4 animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              "Authenticate with DIM"
            )}
          </button>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Powered by Decentralized Identity Manager</p>
      </div>
    </div>
  )
}

export default DIMAuthWidget
