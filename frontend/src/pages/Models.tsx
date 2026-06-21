import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import type { Model } from '../types'

const statusVariant = {
  active: 'success' as const,
  beta: 'info' as const,
  deprecated: 'warning' as const,
}

export function Models() {
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    api.getModels().then(setModels)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Models</h1>
        <p className="text-sm text-text-secondary mt-1">
          Available LLM models configured in the gateway
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="p-5 hover:border-accent/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-primary">{model.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{model.provider}</p>
              </div>
              <Badge variant={statusVariant[model.status]}>{model.status}</Badge>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {model.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 text-[10px] rounded bg-bg-elevated text-text-secondary"
                >
                  {cap}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-text-muted">Context Window</p>
                <p className="font-medium mt-0.5">
                  {(model.contextWindow / 1000).toFixed(0)}K tokens
                </p>
              </div>
              <div>
                <p className="text-text-muted">Pricing (per 1M)</p>
                <p className="font-medium mt-0.5">
                  ${model.pricing.input} / ${model.pricing.output}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}