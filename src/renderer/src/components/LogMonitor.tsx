import type { Parsed } from "src/types"

interface LogMonitorProps {
  logs: Parsed[]
}

const LogMonitor = ({ logs }: LogMonitorProps) => {

  return (
    <div>
      {logs.map((log) => {
        return (
          <div key={log.id}>
            {log.message}
          </div>
        )
      })}
    </div>
  )
}

export default LogMonitor
