import clsx from 'clsx'
import { CheckCircle, X, XCircle } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  type: 'success' | 'error'
  title: string
  message: string
  onClose: () => void
}

export function Toast({ type, title, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl border shadow-2xl max-w-sm animate-in',
        type === 'success'
          ? 'bg-success/10 border-success/30'
          : 'bg-error/10 border-error/30',
      )}
    >
      {type === 'success' ? (
        <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
      ) : (
        <XCircle size={20} className="text-error shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-text-muted hover:text-text-primary cursor-pointer">
        <X size={16} />
      </button>
    </div>
  )
}