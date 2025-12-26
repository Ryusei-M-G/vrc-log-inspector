import type { Parsed } from "src/types"

interface LogMonitorProps {
  logs: Parsed[]
}

const LogMonitor = ({ logs }: LogMonitorProps) => {
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

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        return (
          <div key={log.id} className="border border-zinc-700 rounded p-3 bg-zinc-900">
            <div className="text-xs text-zinc-400 mb-1">{formatDateTime(log.timeStamp)}</div>
            <div className="text-sm"><span className="text-zinc-500">Level:</span> {log.loglevel}</div>
            <div className="text-sm"><span className="text-zinc-500">Category:</span> {log.category}</div>
            <div className="text-sm"><span className="text-zinc-500">Message:</span> {log.message}</div>
          </div>
        )
      })}
    </div>
  )
}

export default LogMonitor
