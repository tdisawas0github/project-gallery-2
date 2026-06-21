import { Activity, Plus, Settings } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Toggle } from '../components/ui/Toggle'
import { Toast } from '../components/ui/Toast'
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
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState<Provider | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<HTMLInputElement>(null)
  const weightRef = useRef<HTMLInputElement>(null)

  const loadProviders = useCallback(() => {
    api.getProviders().then(setProviders)
  }, [])

  useEffect(() => {
    loadProviders()
  }, [loadProviders])

  const toggleProvider = (id: string, enabled: boolean) => {
    api.updateProvider(id, enabled)
      .then(() => {
        loadProviders()
      })
      .catch((err) => {
        setToast({ type: 'error', title: 'Update failed', message: err.message })
      })
  }

  const handleAdd = () => {
    const name = nameRef.current?.value || 'New Provider'
    const model = modelRef.current?.value || 'gpt-4o'
    const weight = parseInt(weightRef.current?.value || '10', 10)
    api.addProvider(name, 'default', model.split(',').map((s) => s.trim()), weight)
      .then(() => {
        setShowAddModal(false)
        setToast({ type: 'success', title: 'Provider added', message: `${name} has been added.` })
        loadProviders()
      })
      .catch((err) => {
        setToast({ type: 'error', title: 'Failed to add provider', message: err.message })
      })
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
        <Button onClick={() => setShowAddModal(true)}>
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
                onChange={(checked) => toggleProvider(provider.id, checked)}
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
              <button
                onClick={() => setShowSettings(provider)}
                className="p-1.5 rounded hover:bg-bg-elevated text-text-muted cursor-pointer"
              >
                <Settings size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Provider"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Provider</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Provider Name</label>
            <input
              ref={nameRef}
              type="text"
              defaultValue="Cohere"
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Models (comma-separated)</label>
            <input
              ref={modelRef}
              type="text"
              defaultValue="command-r,command-r-plus"
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Weight</label>
            <input
              ref={weightRef}
              type="number"
              defaultValue={10}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!showSettings}
        onClose={() => setShowSettings(null)}
        title={`Settings: ${showSettings?.name || ''}`}
        footer={
          <Button onClick={() => setShowSettings(null)}>Close</Button>
        }
      >
        {showSettings && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Enabled</span>
              <Toggle
                checked={showSettings.enabled}
                onChange={(checked) => {
                  toggleProvider(showSettings.id, checked)
                  setShowSettings({ ...showSettings, enabled: checked })
                }}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Weight</label>
              <input
                type="number"
                value={showSettings.weight}
                onChange={(e) => setShowSettings({ ...showSettings, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Status</label>
              <select
                value={showSettings.status}
                onChange={(e) => setShowSettings({ ...showSettings, status: e.target.value as 'healthy' | 'degraded' | 'down' })}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              >
                <option value="healthy">Healthy</option>
                <option value="degraded">Degraded</option>
                <option value="down">Down</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
