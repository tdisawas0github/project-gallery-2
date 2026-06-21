import {
  analyticsData,
  apiKeys,
  dashboardMetrics,
  logs,
  models,
  providers,
  routeConfig,
} from '../data/mock'

async function fetchOrFallback<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`/api${endpoint}`)
    if (!res.ok) throw new Error('API unavailable')
    return await res.json()
  } catch {
    return fallback
  }
}

async function sendJSON<T>(method: string, endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`/api${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  getDashboard: () => fetchOrFallback('/dashboard', dashboardMetrics),
  getModels: () => fetchOrFallback('/models', models),
  getApiKeys: () => fetchOrFallback('/api-keys', apiKeys),
  createApiKey: (name: string, permissions: string[], expiresAt: string) =>
    sendJSON<{ id: string }>('POST', '/api-keys', { name, permissions, expiresAt }),
  deleteApiKey: (id: string) =>
    sendJSON<{ status: string }>('DELETE', `/api-keys/${id}`, null),
  getProviders: () => fetchOrFallback('/providers', providers),
  updateProvider: (id: string, enabled?: boolean, weight?: number) =>
    sendJSON('PATCH', `/providers/${id}`, { enabled, weight }),
  addProvider: (name: string, logo: string, models: string[], weight: number) =>
    sendJSON('POST', '/providers', { name, logo, models, weight }),
  getRouteConfig: () => fetchOrFallback('/routes', routeConfig),
  updateRouteConfig: (config: { timeout: number; maxRetries: number; retryInterval: number; strategy: string; retryConditions: string[] }) =>
    sendJSON('PUT', '/routes', config),
  getLogs: () => fetchOrFallback('/logs', logs),
  getAnalytics: () => fetchOrFallback('/analytics', analyticsData),
  getSettings: () => fetchOrFallback('/settings', {
    gatewayName: 'LLM Gateway Pro',
    environment: 'Production',
    globalRPM: 10000,
    perKeyRPM: 1000,
    logRequests: true,
    logResponses: true,
    sanitizeFields: false,
  }),
  updateSettings: (settings: { gatewayName: string; environment: string; globalRPM: number; perKeyRPM: number; logRequests: boolean; logResponses: boolean; sanitizeFields: boolean }) =>
    sendJSON('PUT', '/settings', settings),
}
