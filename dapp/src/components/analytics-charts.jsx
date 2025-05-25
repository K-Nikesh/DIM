"use client"
import { TrendingUp, TrendingDown } from "lucide-react"

// Simple chart components (using CSS for visualization)
export function LineChart({ data, title, color = "blue" }) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="relative h-40">
        <svg className="w-full h-full" viewBox="0 0 400 160">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              y1={20 + i * 30}
              x2="380"
              y2={20 + i * 30}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text key={i} x="35" y={25 + i * 30} fill="#9CA3AF" fontSize="10" textAnchor="end">
              {Math.round(maxValue - (i * range) / 4)}
            </text>
          ))}

          {/* Line path */}
          <path
            d={`M ${data
              .map((d, i) => `${40 + (i * 340) / (data.length - 1)},${140 - ((d.value - minValue) / range) * 120}`)
              .join(" L ")}`}
            fill="none"
            stroke={color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#F59E0B"}
            strokeWidth="2"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={40 + (i * 340) / (data.length - 1)}
              cy={140 - ((d.value - minValue) / range) * 120}
              r="3"
              fill={color === "blue" ? "#3B82F6" : color === "green" ? "#10B981" : "#F59E0B"}
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={40 + (i * 340) / (data.length - 1)}
              y="155"
              fill="#9CA3AF"
              fontSize="10"
              textAnchor="middle"
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

export function BarChart({ data, title, color = "blue" }) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-300 truncate">{item.label}</div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    color === "blue"
                      ? "bg-blue-500"
                      : color === "green"
                        ? "bg-green-500"
                        : color === "purple"
                          ? "bg-purple-500"
                          : color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                  }`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm text-gray-300 text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PieChartComponent({ data, title }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (item.value / total) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle

              const x1 = 80 + 60 * Math.cos(((startAngle - 90) * Math.PI) / 180)
              const y1 = 80 + 60 * Math.sin(((startAngle - 90) * Math.PI) / 180)
              const x2 = 80 + 60 * Math.cos(((endAngle - 90) * Math.PI) / 180)
              const y2 = 80 + 60 * Math.sin(((endAngle - 90) * Math.PI) / 180)

              const largeArcFlag = angle > 180 ? 1 : 0

              const pathData = [`M 80 80`, `L ${x1} ${y1}`, `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

              currentAngle += angle

              return (
                <path key={index} d={pathData} fill={colors[index % colors.length]} stroke="#1F2937" strokeWidth="2" />
              )
            })}
          </svg>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="text-gray-300">{item.label}</span>
              <span className="ml-auto text-gray-400">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MetricCard({ title, value, change, icon: Icon, color = "blue" }) {
  const isPositive = change > 0

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
            color === "blue"
              ? "from-blue-500 to-blue-700"
              : color === "green"
                ? "from-green-500 to-green-700"
                : color === "purple"
                  ? "from-purple-500 to-purple-700"
                  : color === "yellow"
                    ? "from-yellow-500 to-yellow-700"
                    : "from-blue-500 to-blue-700"
          } flex items-center justify-center`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className={`flex items-center text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  )
}
