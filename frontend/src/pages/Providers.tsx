import { Activity, Plus, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Toggle } from '../components/ui/Toggle'
import type { Provider } from '../types'

const statusVariant = {
  healthy: 'success' as const,
  degraded: 'warning' as const,
  down: 'error' as const,
}

const logoStyles: Record<string, string> = {
  openai: 'bg-emerald-500/20 text-emerald-400',
  anthropic: 'bg-orange-500/20 text-orange-400',
  xai: 'bg-gray-500/20 text-gray-300',
}

const logoLabels: Record<string, string> = {
  openai: 'O',
  anthropic: 'A',
  xai: 'x',
}

export function Providers() {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    api.getProviders().then(setProviders)
  }, [])

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Providers</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage LLM provider connections and health
          </p>
        </div>
        <Button>
          <Plus size={16} />
          Add Provider
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${logoStyles[provider.logo] || 'bg-bg-elevated'}`}
                >
                  {logoLabels[provider.logo] || '?'}
                </div>
                <div>
                  <h3 className="font-semibold">{provider.name}</h3>
                  <Badge variant={statusVariant[provider.status]} className="mt-1">
                    {provider.status}
                  </Badge>
                </div>
              </div>
              <Toggle
                checked={provider.enabled}
                onChange={() => toggleProvider(provider.id)}
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Avg Latency</span>
                <span className="font-mono font-medium">{provider.latency}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Weight</span>
                <span className="font-medium text-accent">{provider.weight}%</span>
              </div>
              <div>
                <span className="text-text-muted text-xs">Models</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {provider.models.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 text-[10px] rounded bg-bg-elevated text-text-secondary font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <Activity size={14} className="text-success" />
              <span className="text-xs text-success">Operational</span>
              <div className="flex-1" />
              <button className="p-1.5 rounded hover:bg-bg-elevated text-text-muted cursor-pointer">
                <Settings size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}