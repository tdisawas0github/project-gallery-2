import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'
import { api } from '../api/client'

export function Settings() {
  const [gatewayName, setGatewayName] = useState('LLM Gateway Pro')
  const [environment, setEnvironment] = useState('Production')
  const [globalRPM, setGlobalRPM] = useState(10000)
  const [perKeyRPM, setPerKeyRPM] = useState(1000)
  const [logRequests, setLogRequests] = useState(true)
  const [logResponses, setLogResponses] = useState(true)
  const [sanitizeFields, setSanitizeFields] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null)

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) {
        setGatewayName(s.gatewayName || 'LLM Gateway Pro')
        setEnvironment(s.environment || 'Production')
        setGlobalRPM(s.globalRPM || 10000)
        setPerKeyRPM(s.perKeyRPM || 1000)
        setLogRequests(s.logRequests ?? true)
        setLogResponses(s.logResponses ?? true)
        setSanitizeFields(s.sanitizeFields ?? false)
      }
    })
  }, [])

  const handleSave = () => {
    api.updateSettings({
      gatewayName,
      environment,
      globalRPM,
      perKeyRPM,
      logRequests,
      logResponses,
      sanitizeFields,
    })
      .then(() => {
        setToast({ type: 'success', title: 'Settings saved', message: 'Your settings have been updated.' })
      })
      .catch((err) => {
        setToast({ type: 'error', title: 'Failed to save', message: err.message })
      })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Gateway configuration and preferences</p>
      </div>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Gateway Name</label>
            <input
              type="text"
              value={gatewayName}
              onChange={(e) => setGatewayName(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Default Environment</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            >
              <option>Production</option>
              <option>Staging</option>
              <option>Development</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold">Rate Limiting</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Global RPM</label>
            <input
              type="number"
              value={globalRPM}
              onChange={(e) => setGlobalRPM(Number(e.target.value))}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Per-Key RPM</label>
            <input
              type="number"
              value={perKeyRPM}
              onChange={(e) => setPerKeyRPM(Number(e.target.value))}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold">Logging</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={logRequests}
              onChange={(e) => setLogRequests(e.target.checked)}
              className="accent-accent"
            />
            <span className="text-sm">Log request payloads</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={logResponses}
              onChange={(e) => setLogResponses(e.target.checked)}
              className="accent-accent"
            />
            <span className="text-sm">Log response payloads</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sanitizeFields}
              onChange={(e) => setSanitizeFields(e.target.checked)}
              className="accent-accent"
            />
            <span className="text-sm">Sanitize sensitive fields</span>
          </label>
        </div>
      </Card>

      <Button onClick={handleSave}>Save Settings</Button>

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
