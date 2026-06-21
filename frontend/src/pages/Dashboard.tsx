import { Activity, Clock, DollarSign, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../api/client'
import { Card, MetricCard } from '../components/ui/Card'
import type { DashboardMetrics } from '../types'

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    api.getDashboard().then(setMetrics)
  }, [])

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Requests"
          value={metrics.totalRequests}
          change={metrics.totalRequestsChange}
          icon={<Activity size={20} />}
        />
        <MetricCard
          title="Avg Latency"
          value={metrics.avgLatency}
          change={metrics.avgLatencyChange}
          icon={<Clock size={20} />}
        />
        <MetricCard
          title="Success Rate"
          value={metrics.successRate}
          change={metrics.successRateChange}
          icon={<Shield size={20} className="text-teal" />}
        />
        <MetricCard
          title="Cost Today"
          value={metrics.costToday}
          change={metrics.costTodayChange}
          icon={<DollarSign size={20} />}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Request Volume (24h)</h2>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>
              Environment: <span className="text-teal font-medium">{metrics.environment}</span>
            </span>
            <span>
              Version: <span className="text-text-secondary">{metrics.version}</span>
            </span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.requestVolume}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3144" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f2e',
                  border: '1px solid #2a3144',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [Number(value).toLocaleString(), 'Requests']}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}