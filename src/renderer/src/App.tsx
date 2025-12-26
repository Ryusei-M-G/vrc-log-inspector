import { useState } from 'react'
import type { Parsed } from '../../types'
import LogMonitor from './components/LogMonitor'

function App(): React.JSX.Element {
  const [logs, setLogs] = useState<Parsed[]>([]);
  const [isLoadingLogs, setLoadingLogs] = useState(false);
  const [isLoadingDb, setLoadingDb] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const handleReadFile = async (): Promise<void> => {
    try {
      setLoadingLogs(true)

      if (startDate && endDate) {
        const start = `${startDate}T${startTime || '00:00:00'}`
        const end = `${endDate}T${endTime || '23:59:59'}`
        const data = await window.api.getLogsByDate(start, end)
        setLogs(data)
      } else {
        const data = await window.api.getLog()
        setLogs(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingLogs(false)
    }
  }

  const handleDB = async () => {
    try {
      setLoadingDb(true)
      await window.api.saveToDb()
    } catch (err) {
      //wip
    } finally {
      setLoadingDb(false)
    }
  }

  const buttonStyle = 'bg-zinc-700 rounded-md px-4 py-2 text-white hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed'
  const inputStyle = 'bg-blue-900 rounded-md px-3 py-2 text-white border border-blue-700 focus:outline-none focus:border-blue-500 text-sm'
  const isAnyLoading = isLoadingLogs || isLoadingDb

  return (
    <div className="h-screen flex flex-col bg-zinc-800 text-white">
      <header className="h-14 shrink-0 flex items-center gap-2 px-4 bg-zinc-900 border-b border-zinc-700">
        <button onClick={handleDB} className={buttonStyle} disabled={isLoadingDb}>
          {isLoadingDb ? 'Saving...' : 'db'}
        </button>
        {isAnyLoading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm text-zinc-400">
              {isLoadingLogs && 'Loading logs...'}
              {isLoadingDb && 'Saving to database...'}
            </span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setEndDate(e.target.value)
              }}
              className={inputStyle}
              placeholder="Start Date"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputStyle}
              placeholder="Start Time"
            />
          </div>
          <span className="text-zinc-500">-</span>
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputStyle}
              placeholder="End Date"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputStyle}
              placeholder="End Time"
            />
          </div>
          <button onClick={handleReadFile} className={buttonStyle} disabled={isLoadingLogs}>
            {isLoadingLogs ? 'Loading...' : 'getLog'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {isLoadingLogs ? (
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
