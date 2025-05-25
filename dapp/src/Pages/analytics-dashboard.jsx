"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Shield, Eye, Globe, Download, Calendar } from "lucide-react"
import { LineChart, BarChart, PieChartComponent, MetricCard } from "../components/analytics-charts"
import { getLocalConsents, DATA_CATEGORIES } from "../utils/selective-disclosure"

export function AnalyticsDashboard({ account, credentials }) {
  const [timeRange, setTimeRange] = useState("7d")
  const [consents, setConsents] = useState({})
  const [analyticsData, setAnalyticsData] = useState({
    consentTrends: [],
    appUsage: [],
    categoryUsage: [],
    privacyScore: [],
    monthlyActivity: [],
    totalConsents: 0,
    activeApps: 0,
    dataCategories: 0,
  })

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
      generateAnalyticsData(filteredConsents)
    }
  }, [account])

  const generateAnalyticsData = (consentsData) => {
    const consentEntries = Object.values(consentsData)
    console.log("Processing consent data:", consentEntries) // Debug log

    // Generate consent trends based on actual consent timestamps
    const consentTrends = generateConsentTrends(consentEntries, timeRange)

    // Generate app usage data from actual consents
    const appUsage = generateAppUsageData(consentEntries)

    // Generate category usage from actual permissions
    const categoryUsage = generateCategoryUsageData(consentEntries)

    // Generate privacy score based on actual data sharing patterns
    const privacyScore = generatePrivacyScore(consentEntries)

    // Generate monthly activity
    const monthlyActivity = generateMonthlyActivity(consentEntries)

    // Calculate summary stats
    const totalConsents = consentEntries.length
    const activeApps = new Set(consentEntries.map((consent) => consent.appDomain)).size
    const allCategories = new Set()
    consentEntries.forEach((consent) => {
      if (consent.permissions && Array.isArray(consent.permissions)) {
        consent.permissions.forEach((permission) => allCategories.add(permission))
      }
    })
    const dataCategories = allCategories.size

    console.log("Generated analytics:", {
      consentTrends,
      appUsage,
      categoryUsage,
      totalConsents,
      activeApps,
      dataCategories,
    }) // Debug log

    setAnalyticsData({
      consentTrends,
      appUsage,
      categoryUsage,
      privacyScore,
      monthlyActivity,
      totalConsents,
      activeApps,
      dataCategories,
    })
  }

  const generateConsentTrends = (consents, range) => {
    console.log("Generating consent trends for range:", range, "with consents:", consents)

    const now = new Date()
    const trends = {}

    if (range === "7d") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dayKey = date.toLocaleDateString("en", { weekday: "short" })
        trends[dayKey] = 0
      }

      consents.forEach((consent) => {
        const consentDate = new Date(consent.timestamp)
        const daysDiff = Math.floor((now - consentDate) / (24 * 60 * 60 * 1000))
        if (daysDiff >= 0 && daysDiff < 7) {
          const dayKey = consentDate.toLocaleDateString("en", { weekday: "short" })
          if (trends.hasOwnProperty(dayKey)) {
            trends[dayKey] = trends[dayKey] + 1
          }
        }
      })
    } else if (range === "30d") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        trends[`Week ${4 - i}`] = 0
      }

      consents.forEach((consent) => {
        const consentDate = new Date(consent.timestamp)
        const daysDiff = Math.floor((now - consentDate) / (24 * 60 * 60 * 1000))
        if (daysDiff >= 0 && daysDiff < 30) {
          const weekIndex = Math.floor(daysDiff / 7)
          if (weekIndex < 4) {
            const weekKey = `Week ${4 - weekIndex}`
            trends[weekKey] = trends[weekKey] + 1
          }
        }
      })
    } else {
      // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = monthDate.toLocaleDateString("en", { month: "short" })
        trends[monthKey] = 0
      }

      consents.forEach((consent) => {
        const consentDate = new Date(consent.timestamp)
        const monthsDiff =
          (now.getFullYear() - consentDate.getFullYear()) * 12 + (now.getMonth() - consentDate.getMonth())
        if (monthsDiff >= 0 && monthsDiff < 3) {
          const monthKey = consentDate.toLocaleDateString("en", { month: "short" })
          if (trends.hasOwnProperty(monthKey)) {
            trends[monthKey] = trends[monthKey] + 1
          }
        }
      })
    }

    const result = Object.entries(trends).map(([label, value]) => ({ label, value }))
    console.log("Consent trends result:", result)
    return result
  }

  const generateAppUsageData = (consents) => {
    console.log("Generating app usage data from consents:", consents)

    if (consents.length === 0) {
      return [{ label: "No apps connected", value: 0 }]
    }

    const appCounts = {}
    consents.forEach((consent) => {
      const domain = consent.appDomain || "Unknown App"
      appCounts[domain] = (appCounts[domain] || 0) + 1
    })

    const result = Object.entries(appCounts)
      .map(([domain, count]) => ({
        label: domain.replace(/^https?:\/\//, "").replace(/^www\./, ""),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 apps

    console.log("App usage result:", result)
    return result
  }

  const generateCategoryUsageData = (consents) => {
    console.log("Generating category usage data from consents:", consents)

    if (consents.length === 0) {
      return [{ label: "No data shared", value: 0 }]
    }

    const categoryCounts = {}
    consents.forEach((consent) => {
      if (consent.permissions && Array.isArray(consent.permissions)) {
        consent.permissions.forEach((permission) => {
          const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permission)
          const categoryName = category ? category.name : permission
          categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
        })
      }
    })

    const result = Object.entries(categoryCounts)
      .map(([category, count]) => ({ label: category, value: count }))
      .sort((a, b) => b.value - a.value)

    console.log("Category usage result:", result)
    return result
  }

  const generatePrivacyScore = (consents) => {
    if (consents.length === 0) {
      return [{ label: "Excellent", value: 100 }]
    }

    // Calculate privacy score based on data sharing patterns
    let totalPermissions = 0
    let requiredPermissions = 0

    consents.forEach((consent) => {
      if (consent.permissions && Array.isArray(consent.permissions)) {
        consent.permissions.forEach((permission) => {
          totalPermissions++
          const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permission)
          if (category && category.required) {
            requiredPermissions++
          }
        })
      }
    })

    if (totalPermissions === 0) {
      return [{ label: "Excellent", value: 100 }]
    }

    // Calculate privacy score based on minimal data sharing
    const optionalPermissions = totalPermissions - requiredPermissions
    const optionalRatio = optionalPermissions / totalPermissions

    // Better privacy score for less optional data sharing
    let excellentScore = Math.max(20, 100 - optionalRatio * 80)
    let goodScore = Math.min(30, optionalRatio * 50)
    let fairScore = Math.min(25, optionalRatio > 0.5 ? 25 : 0)
    let poorScore = Math.max(0, optionalRatio > 0.7 ? 25 : 0)

    // Normalize to 100%
    const total = excellentScore + goodScore + fairScore + poorScore
    excellentScore = (excellentScore / total) * 100
    goodScore = (goodScore / total) * 100
    fairScore = (fairScore / total) * 100
    poorScore = (poorScore / total) * 100

    return [
      { label: "Excellent", value: Math.round(excellentScore) },
      { label: "Good", value: Math.round(goodScore) },
      { label: "Fair", value: Math.round(fairScore) },
      { label: "Poor", value: Math.round(poorScore) },
    ].filter((item) => item.value > 0)
  }

  const generateMonthlyActivity = (consents) => {
    const now = new Date()
    const monthlyData = {}

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString("en", { month: "short" })
      monthlyData[monthKey] = 0
    }

    consents.forEach((consent) => {
      const consentDate = new Date(consent.timestamp)
      const monthsDiff =
        (now.getFullYear() - consentDate.getFullYear()) * 12 + (now.getMonth() - consentDate.getMonth())
      if (monthsDiff >= 0 && monthsDiff < 6) {
        const monthKey = consentDate.toLocaleDateString("en", { month: "short" })
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey] = monthlyData[monthKey] + 1
        }
      }
    })

    return Object.entries(monthlyData).map(([label, value]) => ({ label, value }))
  }

  const calculatePrivacyScorePercentage = () => {
    if (analyticsData.privacyScore.length === 0) return 0

    const excellent = analyticsData.privacyScore.find((item) => item.label === "Excellent")?.value || 0
    const good = analyticsData.privacyScore.find((item) => item.label === "Good")?.value || 0

    return Math.round(excellent + good * 0.7)
  }

  const getConsentGrowth = () => {
    if (analyticsData.consentTrends.length < 2) return 0

    const recent = analyticsData.consentTrends.slice(-2)
    if (recent[0].value === 0) return recent[1].value > 0 ? 100 : 0

    return Math.round(((recent[1].value - recent[0].value) / recent[0].value) * 100)
  }

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      account,
      summary: {
        totalConsents: analyticsData.totalConsents,
        activeApps: analyticsData.activeApps,
        dataCategories: analyticsData.dataCategories,
        privacyScore: calculatePrivacyScorePercentage(),
      },
      consents: Object.values(consents),
      analytics: analyticsData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dim-privacy-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Data Sharing Analytics</h1>
            <p className="text-gray-400">Real-time insights from your consent data</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => {
              const newTimeRange = e.target.value
              setTimeRange(newTimeRange)
              // Regenerate analytics with new time range
              if (account) {
                const userConsents = getLocalConsents()
                const filteredConsents = Object.entries(userConsents)
                  .filter(([key]) => key.startsWith(account))
                  .reduce((acc, [key, value]) => {
                    acc[key] = value
                    return acc
                  }, {})
                generateAnalyticsData(filteredConsents)
              }
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Consents"
          value={analyticsData.totalConsents}
          change={getConsentGrowth()}
          icon={Shield}
          color="blue"
        />
        <MetricCard
          title="Connected Apps"
          value={analyticsData.activeApps}
          change={analyticsData.activeApps > 0 ? 5.2 : 0}
          icon={Globe}
          color="green"
        />
        <MetricCard
          title="Data Categories"
          value={analyticsData.dataCategories}
          change={analyticsData.dataCategories > 2 ? -2.1 : 0}
          icon={Eye}
          color="purple"
        />
        <MetricCard
          title="Privacy Score"
          value={`${calculatePrivacyScorePercentage()}%`}
          change={calculatePrivacyScorePercentage() > 80 ? 5.2 : -3.1}
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart data={analyticsData.consentTrends} title={`Consent Activity (${timeRange})`} color="blue" />
        <LineChart data={analyticsData.monthlyActivity} title="Monthly Consent History" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart data={analyticsData.appUsage} title="Application Usage" color="purple" />
        <BarChart data={analyticsData.categoryUsage} title="Data Category Usage" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PieChartComponent data={analyticsData.privacyScore} title="Privacy Score Distribution" />
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium mb-4">Real-time Insights</h3>
          <div className="space-y-4">
            {analyticsData.totalConsents === 0 ? (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="font-medium text-blue-400">Getting Started</p>
                  <p className="text-sm text-gray-400">
                    No consent data yet. Start by connecting to applications to see analytics.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-green-400">
                      {calculatePrivacyScorePercentage() > 80
                        ? "Excellent"
                        : calculatePrivacyScorePercentage() > 60
                          ? "Good"
                          : "Fair"}{" "}
                      Privacy Control
                    </p>
                    <p className="text-sm text-gray-400">
                      You have {analyticsData.totalConsents} active consent
                      {analyticsData.totalConsents !== 1 ? "s" : ""} with {calculatePrivacyScorePercentage()}% privacy
                      score.
                    </p>
                  </div>
                </div>

                {analyticsData.activeApps > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-400">App Connections</p>
                      <p className="text-sm text-gray-400">
                        Connected to {analyticsData.activeApps} application{analyticsData.activeApps !== 1 ? "s" : ""}.
                        {analyticsData.appUsage.length > 0 && ` Most active: ${analyticsData.appUsage[0].label}`}
                      </p>
                    </div>
                  </div>
                )}

                {analyticsData.dataCategories > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-yellow-400">Data Sharing</p>
                      <p className="text-sm text-gray-400">
                        Sharing {analyticsData.dataCategories} data categor
                        {analyticsData.dataCategories !== 1 ? "ies" : "y"}.
                        {analyticsData.categoryUsage.length > 0 &&
                          ` Most shared: ${analyticsData.categoryUsage[0].label}`}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium mb-4">Consent History Details</h3>
        {Object.keys(consents).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">Application</th>
                  <th className="pb-3 font-medium">Data Categories</th>
                  <th className="pb-3 font-medium">Consent Date</th>
                  <th className="pb-3 font-medium">Permissions</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {Object.values(consents).map((consent, index) => (
                  <tr key={index} className="hover:bg-gray-700/50">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {consent.appDomain.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                          </p>
                          <p className="text-sm text-gray-400">{consent.appDomain}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {consent.permissions.slice(0, 2).map((permission) => {
                          const category = Object.values(DATA_CATEGORIES).find((cat) => cat.id === permission)
                          return (
                            <span key={permission} className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded">
                              {category ? category.name : permission}
                            </span>
                          )
                        })}
                        {consent.permissions.length > 2 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            +{consent.permissions.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{new Date(consent.timestamp).toLocaleDateString()}</td>
                    <td className="py-4 text-gray-300">{consent.permissions.length}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Consent Data</h3>
            <p className="text-gray-400">
              Start using the consent manager to grant permissions to applications and see analytics here.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Recommendations */}
      <div className="mt-8 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-800">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-indigo-400" />
          Privacy Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-2">✅ Current Status</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              {analyticsData.totalConsents === 0 ? (
                <li>• No data sharing yet - perfect privacy!</li>
              ) : (
                <>
                  <li>
                    • {analyticsData.totalConsents} active consent{analyticsData.totalConsents !== 1 ? "s" : ""}
                  </li>
                  <li>
                    • {analyticsData.activeApps} connected app{analyticsData.activeApps !== 1 ? "s" : ""}
                  </li>
                  <li>• {calculatePrivacyScorePercentage()}% privacy score</li>
                </>
              )}
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-400 mb-2">💡 Recommendations</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              {analyticsData.totalConsents === 0 ? (
                <>
                  <li>• Try the SSI demo to see how it works</li>
                  <li>• Connect to trusted applications</li>
                  <li>• Review data categories before sharing</li>
                </>
              ) : (
                <>
                  <li>• Review consents monthly</li>
                  <li>• Revoke unused app permissions</li>
                  <li>• Monitor data access patterns</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
