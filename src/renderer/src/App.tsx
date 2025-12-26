import { useState } from 'react'
import type { Parsed } from '../../types'
import LogMonitor from './components/LogMonitor'

function App(): React.JSX.Element {
  const [logs, setLogs] = useState<Parsed[]>([]);
  const handleReadFile = async (): Promise<void> => {
    const data = await window.api.getLog()
    setLogs(data)
  }

  const handleDB = async () => {
    const result = await window.api.saveToDb()
  }

  const buttonStyle = 'bg-zinc-700 rounded-md px-4 py-2 text-white hover:bg-zinc-600'
  return (
    <div className="h-screen flex flex-col bg-zinc-800 text-white">
      <header className="h-14 shrink-0 flex items-center gap-2 px-4 bg-zinc-900 border-b border-zinc-700">
        <button onClick={handleReadFile} className={buttonStyle}>getLog</button>
        <button onClick={handleDB} className={buttonStyle}>db</button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Logs ({logs.length})</h2>
        </div>
        <LogMonitor logs={logs} />
      </main>
    </div>
  )
}

export default App
