import clsx from 'clsx'
import { Bell, ChevronDown, Hexagon, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  title?: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [env, setEnv] = useState<'production' | 'staging'>('production')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/logs?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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

      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search endpoints, models, keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg-primary border border-border rounded-lg text-sm focus:outline-none focus:border-accent placeholder:text-text-muted"
          />
        </div>
      </form>

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

        <button className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-teal flex items-center justify-center text-xs font-bold">
              JD
            </div>
            <ChevronDown size={14} className={clsx('text-text-muted transition-transform', showUserMenu && 'rotate-180')} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-xl z-50 py-1">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-text-muted">john@example.com</p>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-elevated cursor-pointer">
                <User size={14} />
                Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-elevated cursor-pointer">
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
