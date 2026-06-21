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

export const api = {
  getDashboard: () => fetchOrFallback('/dashboard', dashboardMetrics),
  getModels: () => fetchOrFallback('/models', models),
  getApiKeys: () => fetchOrFallback('/api-keys', apiKeys),
  getProviders: () => fetchOrFallback('/providers', providers),
  getRouteConfig: () => fetchOrFallback('/routes', routeConfig),
  getLogs: () => fetchOrFallback('/logs', logs),
  getAnalytics: () => fetchOrFallback('/analytics', analyticsData),
}