import clsx from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-10 h-5 rounded-full transition-colors cursor-pointer',
          checked ? 'bg-accent' : 'bg-bg-elevated',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  )
}