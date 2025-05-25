"use client"

import { useState, useEffect } from "react"
import { Shield, Eye, Globe, Lock, CheckCircle, AlertTriangle, Settings, BarChart3 } from "lucide-react"
import { getLocalConsents, DATA_CATEGORIES, filterDataByConsent } from "../utils/selective-disclosure"
import SelectiveAuthWidget from "../components/selective-auth-widget"
import { AnalyticsDashboard } from "../Pages/analytics-dashboard"

// Data Sharing Management Page - integrated into the main dashboard
export function DataSharingPage({ account, credentials, refreshData }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [consents, setConsents] = useState({})
  const [mockApps] = useState([
    {
      id: "university-portal",
      name: "University Portal",
      domain: "university.edu",
      status: "connected",
      permissions: ["basic_identity", "specific_credentials"],
      lastAccess: "2024-01-15",
      description: "Academic credential verification system",
    },
    {
      id: "job-platform",
      name: "JobConnect Pro",
      domain: "jobconnect.com",
      status: "pending",
      permissions: ["basic_identity", "credentials_count"],
      lastAccess: null,
      description: "Professional networking and job search platform",
    },
    {
      id: "bank-app",
      name: "SecureBank",
      domain: "securebank.com",
      status: "connected",
      permissions: ["basic_identity", "wallet_address"],
      lastAccess: "2024-01-14",
      description: "Digital banking and financial services",
    },
  ])

  useEffect(() => {
    if (account) {
      const userConsents = getLocalConsents()
      const filteredConsents = Object.entries(userConsents)
        .filter(([key]) => key.startsWith(account))
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
      setConsents(filteredConsents)
    }
  }, [account])

  const getSharedDataPreview = (permissions) => {
    const mockUserData = {
      account,
      name: "John Doe",
      credentialCount: credentials.filter((c) => !c.isRevoked).length,
      credentials: credentials.filter((c) => !c.isRevoked),
      registrationDate: "2024-01-01",
    }

    return filterDataByConsent(mockUserData, account, "demo.com", permissions)
  }

  const getPermissionName = (permissionId) => {
    const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permissionId)
    return category?.name || permissionId
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Self-Sovereign Data Sharing</h1>
            <p className="text-gray-400">Control your identity data with granular permissions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-medium">SSI Enabled</div>
          <div className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-400 text-xs font-medium">
            {Object.keys(consents).length} Active Consents
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "applications" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Connected Apps
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "permissions" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Data Categories
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "analytics" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          <BarChart3 className="h-4 w-4 mr-2 inline" />
          Analytics
        </button>
        {/* <button
          onClick={() => setActiveTab("demo")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "demo" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Live Demo
        </button> */}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Globe className="h-6 w-6" />
                </div>
                <span className="text-3xl font-bold">
                  {mockApps.filter((app) => app.status === "connected").length}
                </span>
              </div>
              <h3 className="text-gray-400">Connected Apps</h3>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <span className="text-3xl font-bold">{Object.keys(consents).length}</span>
              </div>
              <h3 className="text-gray-400">Active Consents</h3>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <span className="text-3xl font-bold">
                  {Object.values(DATA_CATEGORIES).filter((cat) => !cat.required).length}
                </span>
              </div>
              <h3 className="text-gray-400">Data Categories</h3>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                  <Lock className="h-6 w-6" />
                </div>
                <span className="text-3xl font-bold">100%</span>
              </div>
              <h3 className="text-gray-400">User Control</h3>
            </div>
          </div>

          {/* SSI Principles */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Self-Sovereign Identity Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">User Control</h3>
                  <p className="text-sm text-gray-400">You decide what data to share with each application</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Minimal Disclosure</h3>
                  <p className="text-sm text-gray-400">Only necessary information is shared, nothing more</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Cryptographic Consent</h3>
                  <p className="text-sm text-gray-400">All permissions are cryptographically signed</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Revocable Access</h3>
                  <p className="text-sm text-gray-400">Withdraw permissions at any time</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No Central Authority</h3>
                  <p className="text-sm text-gray-400">Decentralized identity management</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Verifiable Proofs</h3>
                  <p className="text-sm text-gray-400">Cryptographic proofs of shared data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Recent Data Sharing Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center mr-4">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Consent granted to University Portal</p>
                  <p className="text-sm text-gray-400">Shared: Basic Identity, Specific Credentials</p>
                </div>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </div>

              <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center mr-4">
                  <Eye className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Data accessed by SecureBank</p>
                  <p className="text-sm text-gray-400">Accessed: Basic Identity, Wallet Address</p>
                </div>
                <span className="text-sm text-gray-400">1 day ago</span>
              </div>

              <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center mr-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Consent request from JobConnect Pro</p>
                  <p className="text-sm text-gray-400">Requesting: Basic Identity, Credential Count</p>
                </div>
                <span className="text-sm text-gray-400">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Connected Applications</h2>
            <div className="space-y-4">
              {mockApps.map((app) => (
                <div key={app.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{app.name}</h3>
                        <p className="text-sm text-gray-400">{app.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          app.status === "connected"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-yellow-900/50 text-yellow-400"
                        }`}
                      >
                        {app.status}
                      </span>
                      <button className="text-gray-400 hover:text-white">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">{app.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1">Shared Data Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {app.permissions.map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded">
                            {getPermissionName(permission)}
                          </span>
                        ))}
                      </div>
                    </div>
                    {app.lastAccess && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Last Access</p>
                        <p className="text-sm">{app.lastAccess}</p>
                      </div>
                    )}
                  </div>

                  {app.status === "connected" && (
                    <div className="mt-4 p-3 bg-gray-700/50 rounded">
                      <h4 className="text-sm font-medium mb-2">Currently Shared Data:</h4>
                      <pre className="text-xs text-gray-300 overflow-auto">
                        {JSON.stringify(getSharedDataPreview(app.permissions), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Categories Tab */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Available Data Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(DATA_CATEGORIES).map((category) => (
                <div key={category.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    {category.required && (
                      <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{category.description}</p>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Includes fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.fields.map((field) => (
                        <span key={field} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Demo Tab */}
      {activeTab === "demo" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Live SSI Authentication Demo</h2>
            <p className="text-gray-400 mb-6">
              Experience how external applications would request access to your identity data with selective disclosure.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Demo Application</h3>
                <SelectiveAuthWidget
                  appDomain="demo.university.edu"
                  appName="University Credential Verifier"
                  requestedPermissions={["basic_identity", "specific_credentials", "issuer_information"]}
                  onAuthSuccess={(result) => {
                    console.log("Demo auth success:", result)
                  }}
                  onAuthError={(error) => {
                    console.error("Demo auth error:", error)
                  }}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">How It Works</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Application Requests Data</h4>
                      <p className="text-sm text-gray-400">External app specifies what data categories it needs</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">User Reviews & Consents</h4>
                      <p className="text-sm text-gray-400">You see exactly what will be shared and approve it</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Selective Disclosure</h4>
                      <p className="text-sm text-gray-400">Only approved data is shared with cryptographic proof</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Ongoing Control</h4>
                      <p className="text-sm text-gray-400">You can revoke access or modify permissions anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800">
            <h3 className="text-lg font-bold mb-2">🎓 Perfect for College Demo</h3>
            <p className="text-gray-300">
              This demonstrates true self-sovereign identity where users maintain complete control over their personal
              data. Unlike traditional systems where companies own your data, here YOU decide what to share, when to
              share it, and can revoke access at any time.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataSharingPage
