import clsx from 'clsx'
import { Bell, ChevronDown, Hexagon, Search } from 'lucide-react'
import { useState } from 'react'

interface TopbarProps {
  title?: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [env, setEnv] = useState<'production' | 'staging'>('production')

  return (
    <header className="h-16 border-b border-border bg-bg-secondary/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {title ? (
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 lg:hidden">
            <Hexagon size={24} className="text-accent fill-accent/20" />
            <span className="font-bold">LLM Gateway</span>
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search endpoints, models, keys..."
            className="w-full pl-9 pr-4 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-bg-primary rounded-lg p-0.5 border border-border">
          {(['production', 'staging'] as const).map((e) => (
            <button
              key={e}
              onClick={() => setEnv(e)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer',
                env === e
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {e}
            </button>
          ))}
        </div>

        <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary cursor-pointer">
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-teal flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <ChevronDown size={14} className="text-text-muted" />
        </button>
      </div>
    </header>
  )
}