import { useState } from 'react'
import type { Parsed, Tab } from '../../types'
import LogMonitor from './components/LogMonitor'

const MAIN_TAB_ID = 'main'

function App(): React.JSX.Element {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: MAIN_TAB_ID, label: 'All Logs', logs: [], isMain: true }
  ])
  const [activeTabId, setActiveTabId] = useState<string>(MAIN_TAB_ID)
  const [isLoadingLogs, setLoadingLogs] = useState(false);
  const [isLoadingDb, setLoadingDb] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

  const updateTabLogs = (tabId: string, logs: Parsed[]) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, logs } : tab
    ))
  }

  const createSearchTab = (searchQuery: string, logs: Parsed[]) => {
    const newTabId = `search-${Date.now()}`
    const newTab: Tab = {
      id: newTabId,
      label: searchQuery,
      logs
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
  }

  const closeTab = (tabId: string) => {
    if (tabId === MAIN_TAB_ID) return
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTabId === tabId) {
      setActiveTabId(MAIN_TAB_ID)
    }
  }

  const handleReadFile = async (): Promise<void> => {
    try {
      setLoadingLogs(true)

      if (searchText) {
        const data = await window.api.searchLogs(searchText)
        createSearchTab(searchText, data)
        setSearchText('')
      } else if (startDate && endDate) {
        const start = `${startDate}T${startTime || '00:00:00'}`
        const end = `${endDate}T${endTime || '23:59:59'}`
        const data = await window.api.getLogsByDate(start, end)
        updateTabLogs(MAIN_TAB_ID, data)
        setActiveTabId(MAIN_TAB_ID)
      } else {
        const data = await window.api.getLog()
        updateTabLogs(MAIN_TAB_ID, data)
        setActiveTabId(MAIN_TAB_ID)
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
  const inputStyle = 'bg-zinc-800 rounded-md px-3 py-2 text-white border border-zinc-600 focus:outline-none focus:border-zinc-400 text-sm'
  const isAnyLoading = isLoadingLogs || isLoadingDb

  return (
    <div className="h-screen overflow-y-auto bg-zinc-800 text-white">
      <header className="sticky top-0 z-20 h-14 flex items-center gap-2 px-4 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-700/50">
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
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
          className={inputStyle}
        />
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

      {/* Tabs Bar */}
      <div className="sticky top-14 z-10 flex items-center gap-1 px-2 py-1 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-700/50 overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-t-md cursor-pointer text-sm transition-colors ${
              activeTabId === tab.id
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="max-w-32 truncate">{tab.label}</span>
            <span className="text-xs text-zinc-500">({tab.logs.length})</span>
            {!tab.isMain && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="ml-1 text-zinc-500 hover:text-white hover:bg-zinc-600 rounded px-1"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <main className="min-h-screen p-4">
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
              <h2 className="text-lg font-bold">{activeTab.label} ({activeTab.logs.length})</h2>
            </div>
            <LogMonitor logs={activeTab.logs} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
