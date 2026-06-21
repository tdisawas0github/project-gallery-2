import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glass?: boolean
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border',
        glass ? 'glass-card' : 'bg-bg-card',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change?: number
  icon?: ReactNode
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <Card glass className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {change !== undefined && (
            <p
              className={clsx(
                'text-xs mt-1 font-medium',
                change >= 0 ? 'text-success' : 'text-error',
              )}
            >
              {change >= 0 ? '+' : ''}
              {change}% vs yesterday
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-accent/10 text-accent">{icon}</div>
        )}
      </div>
    </Card>
  )
}