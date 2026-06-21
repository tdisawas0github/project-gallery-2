import clsx from 'clsx'
import {
  Activity,
  BarChart3,
  Box,
  FileText,
  GitBranch,
  Hexagon,
  Key,
  LayoutDashboard,
  Server,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/models', icon: Box, label: 'Models' },
  { to: '/api-keys', icon: Key, label: 'API Keys' },
  { to: '/routes', icon: GitBranch, label: 'Routes' },
  { to: '/logs', icon: FileText, label: 'Logs' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/providers', icon: Server, label: 'Providers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-bg-secondary border-r border-border flex flex-col h-screen">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Hexagon size={28} className="text-accent fill-accent/20" />
          <div>
            <p className="font-bold text-sm tracking-wide">LLM GATEWAY</p>
            <p className="text-[10px] text-text-muted tracking-widest">PRO</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-success font-medium">All Systems Operational</span>
        </div>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Activity size={12} />
            Production
          </span>
          <span>v2.4.1</span>
        </div>
      </div>
    </aside>
  )
}