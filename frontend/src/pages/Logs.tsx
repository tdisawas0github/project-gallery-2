import clsx from 'clsx'
import { Copy, Download, Filter, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import type { LogEntry } from '../types'

function statusVariant(code: number) {
  if (code >= 200 && code < 300) return 'success' as const
  if (code === 429) return 'warning' as const
  return 'error' as const
}

function JsonBlock({ data, label }: { data: object; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">{label}</p>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary cursor-pointer"
        >
          <Copy size={12} />
          Copy
        </button>
      </div>
      <pre className="p-4 rounded-lg bg-bg-primary border border-border text-xs font-mono overflow-x-auto leading-relaxed">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

function timeAgo(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp.replace(' ', 'T') + 'Z').getTime()
  if (isNaN(then)) return 'unknown'
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selected, setSelected] = useState<LogEntry | null>(null)
  const [tab, setTab] = useState<'request' | 'response'>('request')
  const [modelFilter, setModelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [searchParams])

  useEffect(() => {
    api.getLogs().then((data) => {
      setLogs(data)
      setSelected(data[0] ?? null)
    })
  }, [])

  const models = useMemo(() => {
    const set = new Set(logs.map((l) => l.model))
    return ['all', ...Array.from(set)]
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (modelFilter !== 'all' && log.model !== modelFilter) return false
      if (statusFilter === 'success' && (log.statusCode < 200 || log.statusCode >= 300)) return false
      if (statusFilter === 'error' && log.statusCode < 400) return false
      if (statusFilter === 'rate_limit' && log.statusCode !== 429) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          log.model.toLowerCase().includes(q) ||
          log.provider.toLowerCase().includes(q) ||
          log.application.toLowerCase().includes(q) ||
          log.apiKey.toLowerCase().includes(q) ||
          log.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [logs, modelFilter, statusFilter, searchQuery])

  const handleExport = () => {
    const csv = [
      'Timestamp,Model,Provider,TokensIn,TokensOut,Latency,StatusCode,Method,Path,Application,IP',
      ...filteredLogs.map((l) =>
        `${l.timestamp},${l.model},${l.provider},${l.tokensIn},${l.tokensOut},${l.latency},${l.statusCode},${l.method},${l.path},${l.application},${l.ip}`
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logs</h1>
          <p className="text-sm text-text-secondary mt-1">Request and response logs</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download size={16} />
          Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 bg-bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent w-48"
        />
        <select
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
          className="px-3 py-2 bg-bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        >
          {models.map((m) => (
            <option key={m} value={m}>{m === 'all' ? 'All Models' : m}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        >
          <option value="all">All Status</option>
          <option value="success">Success (2xx)</option>
          <option value="rate_limit">Rate Limited (429)</option>
          <option value="error">Error (4xx/5xx)</option>
        </select>
        <Button size="sm" onClick={() => { setModelFilter('all'); setStatusFilter('all'); setSearchQuery('') }}>
          <Filter size={14} />
          Clear Filters
        </Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-280px)]">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Recent API Calls</h2>
            <p className="text-xs text-text-muted mt-0.5">{filteredLogs.length.toLocaleString()} requests</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-bg-card">
                <tr className="text-[10px] uppercase tracking-wider text-text-muted border-b border-border">
                  <th className="text-left px-4 py-2 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-2 font-medium">Model</th>
                  <th className="text-left px-4 py-2 font-medium">Tokens In/Out</th>
                  <th className="text-left px-4 py-2 font-medium">Latency (ms)</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className={clsx(
                      'border-b border-border-subtle cursor-pointer transition-colors',
                      selected?.id === log.id
                        ? 'bg-accent/10'
                        : 'hover:bg-bg-elevated/50',
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono">{log.timestamp}</p>
                      <p className="text-[10px] text-text-muted">{timeAgo(log.timestamp)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={clsx('text-sm', selected?.id === log.id && 'text-accent')}>
                        {log.model}
                      </p>
                      <p className="text-[10px] text-text-muted">{log.provider}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">
                      {log.tokensIn.toLocaleString()} / {log.tokensOut.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono">{log.latency.toLocaleString()}</p>
                      <div className="w-20 h-1 rounded-full bg-bg-elevated mt-1">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min((log.latency / 2500) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(log.statusCode)}>
                        {log.statusCode}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {selected && (
          <Card className="w-96 shrink-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Request Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded hover:bg-bg-elevated text-text-muted cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-border space-y-1 text-xs text-text-muted">
              <p>
                ID:{' '}
                <span className="font-mono text-text-secondary">{selected.id.slice(0, 24)}...</span>
              </p>
              <p>IP: {selected.ip}</p>
              <p>API Key: {selected.apiKey}</p>
              <p>Application: {selected.application}</p>
            </div>

            <div className="flex border-b border-border">
              {(['request', 'response'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={clsx(
                    'flex-1 py-2.5 text-sm font-medium capitalize transition-colors cursor-pointer',
                    tab === t
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-text-muted hover:text-text-secondary',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {tab === 'request' ? (
                <JsonBlock data={selected.request} label="Request Preview" />
              ) : (
                <JsonBlock data={selected.response} label="Response Snippet" />
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
