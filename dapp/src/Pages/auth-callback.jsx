"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { verifyAuthToken, getUserAuthProfile } from "../utils/auth-api"

// Callback page for handling authentication redirects
export function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState("verifying") // verifying, success, error
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        const { dim_token, dim_account } = router.query

        if (!dim_token || !dim_account) {
          throw new Error("Missing authentication parameters")
        }

        // Verify the token
        const payload = verifyAuthToken(dim_token)
        if (!payload) {
          throw new Error("Invalid or expired token")
        }

        // Get user profile
        const profile = await getUserAuthProfile(dim_account)

        // Store authentication data
        localStorage.setItem("dim_token", dim_token)
        localStorage.setItem("dim_account", dim_account)
        localStorage.setItem("dim_profile", JSON.stringify(profile))

        setUser(profile)
        setStatus("success")

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Authentication verification failed:", error)
        setError(error.message)
        setStatus("error")
      }
    }

    if (router.isReady) {
      verifyAuthentication()
    }
  }, [router.isReady, router.query])

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Authentication</h2>
          <p className="text-gray-600">Please wait while we verify your DIM credentials...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold mb-2 text-green-600">Authentication Successful</h2>
        <p className="text-gray-600 mb-4">Welcome, {user?.profile?.name || "User"}! You will be redirected shortly.</p>

        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h3 className="font-medium mb-2">Account Information</h3>
          <p className="text-sm text-gray-600">
            <strong>Address:</strong> {user?.account?.slice(0, 6)}...{user?.account?.slice(-4)}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Credentials:</strong> {user?.credentialCount || 0}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthCallbackPage
