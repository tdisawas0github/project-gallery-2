import { Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CreateApiKeyModal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import type { ApiKey } from '../types'

const statusVariant = {
  active: 'success' as const,
  revoked: 'error' as const,
  expired: 'warning' as const,
}

export function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [showModal, setShowModal] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null)

  useEffect(() => {
    api.getApiKeys().then(setKeys)
  }, [])

  const handleCreate = useCallback(() => {
    setShowModal(false)
    setToast({
      type: 'success',
      title: 'API key created successfully',
      message: 'Your new key has been created.',
    })
  }, [])

  const maskKey = (key: string) => {
    if (key.length <= 16) return key
    return `${key.slice(0, 12)}...${key.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage API keys and their permissions
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Create API Key
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Key</th>
                <th className="text-left px-5 py-3 font-medium">Permissions</th>
                <th className="text-left px-5 py-3 font-medium">Expires</th>
                <th className="text-left px-5 py-3 font-medium">Last Used</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((apiKey) => (
                <tr
                  key={apiKey.id}
                  className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors"
                >
                  <td className="px-5 py-4 font-medium">{apiKey.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                      <span>
                        {revealed.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </span>
                      <button
                        onClick={() =>
                          setRevealed((prev) => {
                            const next = new Set(prev)
                            if (next.has(apiKey.id)) next.delete(apiKey.id)
                            else next.add(apiKey.id)
                            return next
                          })
                        }
                        className="text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        {revealed.has(apiKey.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(apiKey.key)}
                        className="text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {apiKey.permissions.map((p) => (
                        <Badge key={p} variant="info">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{apiKey.expiresAt}</td>
                  <td className="px-5 py-4 text-text-secondary">{apiKey.lastUsed}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[apiKey.status]}>{apiKey.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-1.5 rounded hover:bg-error/10 text-text-muted hover:text-error cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateApiKeyModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />

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