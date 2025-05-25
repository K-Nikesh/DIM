"use client"

import { useState } from "react"
import SelectiveAuthWidget from "../components/selective-auth-widget"
import { DATA_CATEGORIES } from "../utils/selective-disclosure"

export function SSIDemoPage() {
  const [authResult, setAuthResult] = useState(null)
  const [selectedApp, setSelectedApp] = useState("banking")

  const demoApps = {
    banking: {
      name: "SecureBank App",
      domain: "securebank.example.com",
      permissions: [DATA_CATEGORIES.BASIC_IDENTITY.id, DATA_CATEGORIES.CREDENTIALS_COUNT.id],
      description: "A banking application that needs to verify your identity",
    },
    social: {
      name: "SocialConnect",
      domain: "socialconnect.example.com",
      permissions: [DATA_CATEGORIES.BASIC_IDENTITY.id],
      description: "A social platform that only needs basic profile information",
    },
    enterprise: {
      name: "CorporatePortal",
      domain: "corp.example.com",
      permissions: [
        DATA_CATEGORIES.BASIC_IDENTITY.id,
        DATA_CATEGORIES.SPECIFIC_CREDENTIALS.id,
        DATA_CATEGORIES.ISSUER_INFORMATION.id,
      ],
      description: "An enterprise portal requiring full credential verification",
    },
  }

  const handleAuthSuccess = (result) => {
    setAuthResult(result)
  }

  const handleAuthError = (error) => {
    console.error("Auth error:", error)
    setAuthResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Self-Sovereign Identity Demo</h1>
          <p className="text-xl text-gray-600">Experience selective disclosure and consent management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* App Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select Demo Application</h2>
            <div className="space-y-3">
              {Object.entries(demoApps).map(([key, app]) => (
                <button
                  key={key}
                  onClick={() => setSelectedApp(key)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedApp === key ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{app.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-blue-600">
                      Requests {app.permissions.length} permission{app.permissions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Authentication Widget */}
          <div>
            <SelectiveAuthWidget
              appDomain={demoApps[selectedApp].domain}
              appName={demoApps[selectedApp].name}
              requestedPermissions={demoApps[selectedApp].permissions}
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
            />
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Result</h2>

            {authResult ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="font-medium text-green-900">✅ Authentication Successful</h3>
                  <p className="text-sm text-green-700 mt-1">Selective disclosure completed with user consent</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-black">Shared Data</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40 text-green-900">
                    {JSON.stringify(authResult.sharedData, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-black">Cryptographic Proof</h4>
                  <div className="bg-gray-100 p-3 rounded text-xs text-green-900">
                    <p>
                      <strong>Data Hash:</strong> {authResult.proof.dataHash.slice(0, 20)}...
                    </p>
                    <p>
                      <strong>Signature:</strong> {authResult.proof.signature.slice(0, 20)}...
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {authResult.proof.timestamp}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h4 className="font-medium text-blue-900 mb-2">SSI Principles Demonstrated</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ User controlled data sharing</li>
                    <li>✓ Minimal disclosure principle</li>
                    <li>✓ Cryptographic proof of consent</li>
                    <li>✓ Verifiable selective disclosure</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Complete authentication to see results</div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Self-Sovereign Identity Implementation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="font-medium mb-2">User Control</h3>
              <p className="text-sm text-gray-600">Users decide what data to share with each application</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-medium mb-2">Minimal Disclosure</h3>
              <p className="text-sm text-gray-600">Only necessary information is shared, nothing more</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-medium mb-2">Cryptographic Consent</h3>
              <p className="text-sm text-gray-600">Consent is signed and verifiable on the blockchain</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-medium mb-2">Revocable Access</h3>
              <p className="text-sm text-gray-600">Users can revoke permissions at any time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SSIDemoPage
