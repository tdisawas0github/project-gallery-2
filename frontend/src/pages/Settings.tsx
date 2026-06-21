import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function Settings() {
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
              defaultValue="LLM Gateway Pro"
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Default Environment</label>
            <select className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent">
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
              defaultValue={10000}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Per-Key RPM</label>
            <input
              type="number"
              defaultValue={1000}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold">Logging</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-accent" />
            <span className="text-sm">Log request payloads</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-accent" />
            <span className="text-sm">Log response payloads</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-accent" />
            <span className="text-sm">Sanitize sensitive fields</span>
          </label>
        </div>
      </Card>

      <Button>Save Settings</Button>
    </div>
  )
}