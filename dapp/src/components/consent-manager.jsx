"use client"

import { useState, useEffect } from "react"
import { Shield, Check, Eye, EyeOff, Clock, Trash2, AlertTriangle } from "lucide-react"
import { DATA_CATEGORIES, getLocalConsents, revokeConsent, createConsentRecord } from "../utils/selective-disclosure"
import { useContract } from "../context/ContractContext"

export function ConsentManager({ appDomain, appName, onConsentUpdate }) {
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [existingConsent, setExistingConsent] = useState(null)
  const [showDetails, setShowDetails] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)

  const { account } = useContract()

  useEffect(() => {
    if (account && appDomain) {
      const consents = getLocalConsents()
      const consentKey = `${account}-${appDomain}`
      const consent = consents[consentKey]

      if (consent) {
        setExistingConsent(consent)
        setSelectedPermissions(consent.permissions)
      } else {
        // Set default required permissions
        setSelectedPermissions([DATA_CATEGORIES.WALLET_ADDRESS.id])
      }
    }
  }, [account, appDomain])

  const handlePermissionToggle = (categoryId) => {
    const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === categoryId)

    // Don't allow removing required permissions
    if (category?.required && selectedPermissions.includes(categoryId)) {
      return
    }

    setSelectedPermissions((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSaveConsent = async () => {
    try {
      setIsUpdating(true)

      // Create consent signature
      const message = `DIM Consent for ${appName}\nDomain: ${appDomain}\nPermissions: ${selectedPermissions.join(", ")}\nTimestamp: ${Date.now()}`

      if (window.ethereum) {
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, account],
        })

        // Store consent record
        await createConsentRecord(account, appDomain, selectedPermissions, signature)

        // Update existing consent state
        setExistingConsent({
          userAccount: account,
          appDomain,
          permissions: selectedPermissions,
          timestamp: new Date().toISOString(),
          signature,
        })

        if (onConsentUpdate) {
          onConsentUpdate(selectedPermissions)
        }
      }
    } catch (error) {
      console.error("Error saving consent:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRevokeConsent = () => {
    revokeConsent(account, appDomain)
    setExistingConsent(null)
    setSelectedPermissions([DATA_CATEGORIES.WALLET_ADDRESS.id])

    if (onConsentUpdate) {
      onConsentUpdate([])
    }
  }

  const toggleDetails = (categoryId) => {
    setShowDetails((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-blue-500 mr-3" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Data Sharing Consent</h3>
          <p className="text-sm text-gray-600">{appName} is requesting access to your identity data</p>
        </div>
      </div>

      {existingConsent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Consent Previously Given</span>
            </div>
            <div className="flex items-center text-sm text-green-700">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(existingConsent.timestamp).toLocaleDateString()}
            </div>
          </div>
          <p className="text-green-700 text-sm mt-1">You can modify your permissions or revoke access at any time.</p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-900">Select what information to share:</h4>

        {Object.values(DATA_CATEGORIES).map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={category.id}
                  checked={selectedPermissions.includes(category.id)}
                  onChange={() => handlePermissionToggle(category.id)}
                  disabled={category.required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={category.id} className="ml-3 flex items-center">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  {category.required && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Required</span>
                  )}
                </label>
              </div>
              <button onClick={() => toggleDetails(category.id)} className="text-gray-400 hover:text-gray-600">
                {showDetails[category.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-1 ml-7">{category.description}</p>

            {showDetails[category.id] && (
              <div className="mt-3 ml-7 p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 mb-2">This includes the following data fields:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  {category.fields.map((field) => (
                    <li key={field} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-yellow-800">Self-Sovereign Identity Principles</h5>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• You control what data is shared</li>
              <li>• You can revoke access at any time</li>
              <li>• Only selected information is transmitted</li>
              <li>• Your consent is cryptographically signed</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {existingConsent ? (
          <button
            onClick={handleRevokeConsent}
            className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Revoke Access
          </button>
        ) : (
          <div></div>
        )}

        <button
          onClick={handleSaveConsent}
          disabled={isUpdating || selectedPermissions.length === 0}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              {existingConsent ? "Update Consent" : "Grant Consent"}
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Your consent is stored securely and can be verified cryptographically
      </div>
    </div>
  )
}

export default ConsentManager
