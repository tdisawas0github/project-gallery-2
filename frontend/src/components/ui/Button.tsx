import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-accent hover:bg-accent-hover text-white': variant === 'primary',
          'border border-border bg-bg-elevated hover:bg-bg-card text-text-primary':
            variant === 'secondary',
          'hover:bg-bg-elevated text-text-secondary hover:text-text-primary':
            variant === 'ghost',
          'bg-error/20 hover:bg-error/30 text-error': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}