import clsx from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-success/20 text-success': variant === 'success',
          'bg-warning/20 text-warning': variant === 'warning',
          'bg-error/20 text-error': variant === 'error',
          'bg-accent/20 text-accent': variant === 'info',
          'bg-bg-elevated text-text-secondary': variant === 'neutral',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}