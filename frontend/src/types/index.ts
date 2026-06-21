export interface DashboardMetrics {
  totalRequests: string
  totalRequestsChange: number
  avgLatency: string
  avgLatencyChange: number
  successRate: string
  successRateChange: number
  costToday: string
  costTodayChange: number
  requestVolume: { time: string; requests: number }[]
  environment: string
  version: string
}

export interface Model {
  id: string
  name: string
  provider: string
  capabilities: string[]
  status: 'active' | 'deprecated' | 'beta'
  contextWindow: number
  pricing: { input: number; output: number }
}

export interface ApiKey {
  id: string
  name: string
  key: string
  permissions: ('read' | 'write')[]
  expiresAt: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'revoked' | 'expired'
}

export interface Provider {
  id: string
  name: string
  logo: string
  status: 'healthy' | 'degraded' | 'down'
  models: string[]
  latency: number
  enabled: boolean
  weight: number
}

export interface RouteConfig {
  strategy: string
  sessionAffinity: string
  healthChecks: boolean
  providers: Provider[]
  fallbackChain: string[]
  timeout: number
  maxRetries: number
  retryInterval: number
  retryConditions: string[]
}

export interface LogEntry {
  id: string
  timestamp: string
  model: string
  provider: string
  tokensIn: number
  tokensOut: number
  latency: number
  statusCode: number
  method: string
  path: string
  apiKey: string
  application: string
  ip: string
  request: object
  response: object
}

export interface AnalyticsData {
  requestsByModel: { name: string; value: number }[]
  requestsByProvider: { name: string; value: number }[]
  latencyOverTime: { time: string; p50: number; p95: number; p99: number }[]
  errorsByType: { name: string; value: number; color: string }[]
  costByModel: { name: string; cost: number }[]
  successRateOverTime: { time: string; rate: number }[]
}