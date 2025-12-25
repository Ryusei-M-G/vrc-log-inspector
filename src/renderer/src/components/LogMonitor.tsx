import type { Parsed } from "src/types"

interface LogMonitorProps {
  logs: Parsed[]
}

const LogMonitor = ({ logs }: LogMonitorProps) => {

  return (
    <div>
      {logs.map((log) => {
        return (
          <div key={log.id} className="border rounded">
            <div>loglevel:{log.loglevel}</div>
            <div>category:{log.category}</div>
            <div>logs:{log.message}</div>
          </div>
        )
      })}
    </div>
  )
}

export default LogMonitor
