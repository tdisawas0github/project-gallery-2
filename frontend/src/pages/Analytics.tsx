import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../api/client'
import { Card } from '../components/ui/Card'
import type { AnalyticsData } from '../types'

const tooltipStyle = {
  background: '#1a1f2e',
  border: '1px solid #2a3144',
  borderRadius: '8px',
  fontSize: '12px',
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    api.getAnalytics().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Loading analytics...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1">
          Detailed request analysis and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Requests by Model</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.requestsByModel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3144" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Share']} />
                <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Errors by Type</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.errorsByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.errorsByType.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs">
              {data.errorsByType.map((e) => (
                <div key={e.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: e.color }} />
                  <span className="text-text-secondary">{e.name}</span>
                  <span className="font-medium">{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Latency Percentiles (ms)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.latencyOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3144" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="p50" stroke="#06b6d4" strokeWidth={2} dot={false} name="p50" />
                <Line type="monotone" dataKey="p95" stroke="#7c3aed" strokeWidth={2} dot={false} name="p95" />
                <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} name="p99" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Success Rate</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.successRateOverTime}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3144" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[98, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Rate']} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#successGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Cost by Model ($)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.costByModel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3144" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, 'Cost']} />
                <Bar dataKey="cost" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}