import { useState } from 'react'
import type { Parsed } from '../../types'
import LogMonitor from './components/LogMonitor'

function App(): React.JSX.Element {
  const [logs, setLogs] = useState<Parsed[]>([]);
  const [isLoading, setLoading] = useState(false);
  const handleReadFile = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await window.api.getLog()
      setLogs(data)
    } catch (err) {
      //wip
    } finally {
      setLoading(false)
    }
  }

  const handleDB = async () => {
    const result = await window.api.saveToDb()
  }

  const buttonStyle = 'bg-zinc-700 rounded-md px-4 py-2 text-white hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed'
  return (
    <div className="h-screen flex flex-col bg-zinc-800 text-white">
      <header className="h-14 shrink-0 flex items-center gap-2 px-4 bg-zinc-900 border-b border-zinc-700">
        <button onClick={handleReadFile} className={buttonStyle} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'getLog'}
        </button>
        <button onClick={handleDB} className={buttonStyle} disabled={isLoading}>db</button>
        {isLoading && (
          <div className="flex items-center gap-2 ml-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm text-zinc-400">Loading logs...</span>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg text-zinc-400">Loading logs...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Logs ({logs.length})</h2>
            </div>
            <LogMonitor logs={logs} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
