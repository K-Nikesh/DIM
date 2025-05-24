"use client"

import { useState } from "react"
import DIMAuthWidget from "../components/auth-widget"

// Demo page showing how other sites can integrate DIM authentication
export function AuthDemoPage() {
  const [authResult, setAuthResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAuthSuccess = (session) => {
    console.log("Authentication successful:", session)
    setAuthResult(session)
    setError(null)
  }

  const handleAuthError = (error) => {
    console.error("Authentication failed:", error)
    setError(error.message)
    setAuthResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">DIM Authentication Integration Demo</h1>
          <p className="text-lg text-gray-600">This demonstrates how other websites can integrate DIM authentication</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Widget */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Authentication Widget</h2>
            <DIMAuthWidget
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
              siteName="Demo Application"
              requiredCredentials={[]} // Add specific credential requirements
            />
          </div>

          {/* Results Display */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Authentication Result</h2>
            <div className="bg-white rounded-lg shadow p-6">
              {authResult ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <h3 className="font-medium text-green-900">✅ Authentication Successful</h3>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Session Token:</h4>
                    <code className="block bg-gray-100 p-2 rounded text-xs break-all">{authResult.token}</code>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">User Profile:</h4>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                      {JSON.stringify(authResult.profile, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Session Info:</h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        <strong>Expires:</strong> {authResult.expiresAt}
                      </li>
                      <li>
                        <strong>Challenge:</strong> {authResult.challenge}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="font-medium text-red-900">❌ Authentication Failed</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">Complete authentication to see results</div>
              )}
            </div>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Integration Guide</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">1. Install the DIM Auth Widget</h3>
                <code className="block bg-gray-100 p-4 rounded">npm install @dim/auth-widget</code>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">2. Add to Your React App</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {`import DIMAuthWidget from '@dim/auth-widget'

function LoginPage() {
  const handleAuthSuccess = (session) => {
    // Store session token
    localStorage.setItem('dim_token', session.token)
    // Redirect to protected area
    window.location.href = '/dashboard'
  }

  return (
    <DIMAuthWidget
      onAuthSuccess={handleAuthSuccess}
      siteName="Your App Name"
      requiredCredentials={['identity-verification']}
    />
  )
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">3. Verify Authentication on Your Backend</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {`// Node.js/Express example
app.post('/api/verify-auth', async (req, res) => {
  const { token } = req.body
  
  try {
    const payload = verifyAuthToken(token)
    const profile = await getUserAuthProfile(payload.account)
    
    res.json({ success: true, user: profile })
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication' })
  }
})`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">4. Use URL Parameters (Alternative)</h3>
                <p className="text-gray-600 mb-2">You can also redirect users to DIM with a return URL:</p>
                <code className="block bg-gray-100 p-4 rounded">
                  https://your-dim-domain.com/auth?redirect=https://yoursite.com/callback&site=YourApp
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthDemoPage
