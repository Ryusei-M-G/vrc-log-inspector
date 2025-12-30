import { memo } from 'react'
import type { Parsed } from "src/types"

interface LogMonitorProps {
  logs: Parsed[]
}

const LogMonitor = memo(({ logs }: LogMonitorProps) => {
  const formatDateTime = (dateTime: Date | string | undefined) => {
    if (!dateTime) return ''
    const date = new Date(dateTime)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getLogLevelStyle = (level: string | null | undefined) => {
    const lowerLevel = (level || '').toLowerCase()
    switch (lowerLevel) {
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'warning':
      case 'warn':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'debug':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const getCategoryStyle = (_category: string | null | undefined) => {
    return 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50'
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        return (
          <div
            key={log.id}
            className="border border-zinc-700 rounded-lg p-3 bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
          >
            {/* Header: Timestamp + Level + Category */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs text-zinc-500 font-mono">
                {formatDateTime(log.timeStamp)}
              </span>
              {log.loglevel && (
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getLogLevelStyle(log.loglevel)}`}>
                  {log.loglevel.toUpperCase()}
                </span>
              )}
              {log.category && (
                <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryStyle(log.category)}`}>
                  {log.category}
                </span>
              )}
            </div>
            {/* Message */}
            {log.message && (
              <div className="text-sm text-zinc-200 leading-relaxed break-words whitespace-pre-wrap font-mono bg-zinc-800/50 rounded px-2 py-1.5">
                {log.message}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
})

LogMonitor.displayName = 'LogMonitor'

export default LogMonitor
