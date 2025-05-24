"use client"

import { useState, useEffect } from "react"
import { Shield, Trash2, Eye, Clock, Globe, CheckCircle } from "lucide-react"
import { getLocalConsents, revokeConsent, DATA_CATEGORIES } from "../utils/selective-disclosure"
import { useContract } from "../context/ContractContext"

export function ConsentDashboard() {
  const [consents, setConsents] = useState({})
  const [selectedConsent, setSelectedConsent] = useState(null)
  const { account } = useContract()

  useEffect(() => {
    if (account) {
      const userConsents = getLocalConsents()
      // Filter consents for current user
      const filteredConsents = Object.entries(userConsents)
        .filter(([key]) => key.startsWith(account))
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
      setConsents(filteredConsents)
    }
  }, [account])

  const handleRevokeConsent = (consentKey) => {
    const [userAccount, appDomain] = consentKey.split("-")
    revokeConsent(userAccount, appDomain)

    // Update local state
    const updatedConsents = { ...consents }
    delete updatedConsents[consentKey]
    setConsents(updatedConsents)
    setSelectedConsent(null)
  }

  const getPermissionDetails = (permissions) => {
    return permissions.map((permissionId) => {
      const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permissionId)
      return category || { id: permissionId, name: permissionId, description: "Unknown permission" }
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-blue-500 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consent Management Dashboard</h1>
          <p className="text-gray-600">Manage your data sharing permissions across applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consent List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Active Consents</h2>

            {Object.keys(consents).length === 0 ? (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Consents</h3>
                <p className="text-gray-600">You haven't granted data sharing permissions to any applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(consents).map(([key, consent]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedConsent === key ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedConsent(key)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{consent.appDomain}</h3>
                        <p className="text-sm text-gray-600">
                          {consent.permissions.length} permission{consent.permissions.length !== 1 ? "s" : ""} granted
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(consent.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {getPermissionDetails(consent.permissions)
                        .slice(0, 3)
                        .map((permission) => (
                          <span key={permission.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {permission.name}
                          </span>
                        ))}
                      {consent.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{consent.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Consent Details */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Consent Details</h2>

            {selectedConsent && consents[selectedConsent] ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Application</h3>
                  <p className="text-gray-600">{consents[selectedConsent].appDomain}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Granted Permissions</h3>
                  <div className="space-y-2">
                    {getPermissionDetails(consents[selectedConsent].permissions).map((permission) => (
                      <div key={permission.id} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                          <p className="text-xs text-gray-600">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Consent Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Granted:</strong> {new Date(consents[selectedConsent].timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Version:</strong> {consents[selectedConsent].version || "1.0"}
                    </p>
                    <p>
                      <strong>Signature:</strong>
                      <span className="font-mono text-xs block mt-1 break-all">
                        {consents[selectedConsent].signature?.slice(0, 20)}...
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleRevokeConsent(selectedConsent)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revoke Consent
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Select a consent to view details</p>
              </div>
            )}
          </div>

          {/* Self-Sovereign Principles */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-blue-900 mb-2">Self-Sovereign Principles</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ You own your identity data</li>
              <li>✓ Minimal disclosure of information</li>
              <li>✓ Consent is cryptographically verifiable</li>
              <li>✓ Permissions can be revoked anytime</li>
              <li>✓ No central authority controls your data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsentDashboard
