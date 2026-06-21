import { ArrowRight, Brain, Box, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Toggle } from '../components/ui/Toggle'
import type { Provider, RouteConfig } from '../types'

function ProviderLogo({ logo }: { logo: string }) {
  const styles: Record<string, string> = {
    openai: 'bg-emerald-500/20 text-emerald-400',
    anthropic: 'bg-orange-500/20 text-orange-400',
    xai: 'bg-gray-500/20 text-gray-300',
  }
  const labels: Record<string, string> = {
    openai: 'O',
    anthropic: 'A',
    xai: 'x',
  }
  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${styles[logo] || 'bg-bg-elevated'}`}
    >
      {labels[logo] || '?'}
    </div>
  )
}

export function Routes() {
  const [config, setConfig] = useState<RouteConfig | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    api.getRouteConfig().then((c) => {
      setConfig(c)
      setProviders(c.providers)
    })
  }, [])

  const totalWeight = providers.reduce((sum, p) => sum + (p.enabled ? p.weight : 0), 0)

  const updateWeight = (id: string, weight: number) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, weight } : p)),
    )
  }

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary">
        Loading routing configuration...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Model Routing Configuration</h1>
          <p className="text-sm text-text-secondary mt-1">
            Define how incoming requests are routed to LLM providers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">Active</Badge>
          <Button>
            <Save size={16} />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 min-w-[200px]">
                <Box size={24} className="text-accent" />
                <div>
                  <p className="font-semibold text-sm">Client Request</p>
                  <p className="text-xs text-text-muted mt-0.5">POST /v1/chat/completions</p>
                  <p className="text-xs text-accent mt-0.5">model: gpt-4o</p>
                </div>
              </div>

              <ArrowRight size={20} className="text-teal shrink-0" />

              <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-elevated border border-border min-w-[220px]">
                <Brain size={24} className="text-teal" />
                <div>
                  <p className="font-semibold text-sm">Gateway Load Balancer</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Strategy: {config.strategy}
                  </p>
                  <p className="text-xs text-text-muted">
                    Session Affinity: {config.sessionAffinity}
                  </p>
                  <p className="text-xs text-success mt-0.5">
                    Health Checks: {config.healthChecks ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-bg-elevated border border-border"
                >
                  <ProviderLogo logo={provider.logo} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{provider.name}</p>
                      <Badge variant="success">Healthy</Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      model: {provider.models[0]}
                    </p>
                  </div>
                  <Toggle
                    checked={provider.enabled}
                    onChange={() => toggleProvider(provider.id)}
                  />
                  <div className="w-32">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted">Weight</span>
                      <span className="font-medium text-accent">{provider.weight}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={provider.weight}
                      onChange={(e) => updateWeight(provider.id, Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-text-muted mt-4 text-center">
              Total weight: {totalWeight}% • Weights are normalized if the sum is not equal to
              100%
            </p>
          </Card>
        </div>

        <div>
          <Card className="p-5 space-y-5">
            <h3 className="font-semibold">Routing Settings</h3>

            <div>
              <p className="text-sm font-medium mb-1">Fallback Chain</p>
              <p className="text-xs text-text-muted mb-3">
                Secondary providers to try if primary fails
              </p>
              <div className="space-y-2">
                {config.fallbackChain.map((name) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Timeout</p>
              <p className="text-xs text-text-muted mb-2">
                Maximum time to wait for the response
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={config.timeout}
                  className="w-20 px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
                <span className="text-sm text-text-muted">s</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Retry Policy</p>
              <p className="text-xs text-text-muted mb-3">Configure automatic retries</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-xs text-text-muted">Max Retries</label>
                  <input
                    type="number"
                    defaultValue={config.maxRetries}
                    className="w-full mt-1 px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Retry Interval</label>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      defaultValue={config.retryInterval}
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                    <span className="text-xs text-text-muted">ms</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {config.retryConditions.map((cond) => (
                  <Badge key={cond} variant="neutral">
                    {cond}
                  </Badge>
                ))}
                <button className="text-xs text-accent hover:underline cursor-pointer">
                  + Add
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">Save Configuration</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}