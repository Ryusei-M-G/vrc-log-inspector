import type { Parsed } from "src/types"

interface LogMonitorProps {
  logs: Parsed[]
}

const LogMonitor = ({ logs }: LogMonitorProps) => {

  return (
    <div>
      <ul>
        {logs.map((log) => {
          return (
            <li key={log.id}>
              {log.message}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LogMonitor
