import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-card border border-border rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-bg-elevated text-text-secondary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

interface CreateApiKeyModalProps {
  open: boolean
  onClose: () => void
  onCreate: () => void
}

export function CreateApiKeyModal({ open, onClose, onCreate }: CreateApiKeyModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create API Key"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create Key</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Key Name</label>
          <input
            type="text"
            defaultValue="Production Server Key"
            className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Permissions</label>
          <select className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent">
            <option>Read, Write</option>
            <option>Read Only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Expires</label>
          <select className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
            <option>Never</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}