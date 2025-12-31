import { useState } from 'react'
import { useTabs } from './hooks/useTabs'
import { Button, Input, Spinner } from './components/ui'
import { DateTimeRangeFilter, type DateTimeRange } from './components/DateTimeRangeFilter'
import { TabsBar } from './components/TabsBar'
import LogMonitor from './components/LogMonitor'

const initialDateRange: DateTimeRange = {
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: ''
}

function App(): React.JSX.Element {
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    updateMainTabLogs,
    createSearchTab,
    closeTab
  } = useTabs()
  const [isLoadingLogs, setLoadingLogs] = useState(false)
  const [isLoadingDb, setLoadingDb] = useState(false)
  const [dateRange, setDateRange] = useState<DateTimeRange>(initialDateRange)
  const [searchText, setSearchText] = useState('')

  const isAnyLoading = isLoadingLogs || isLoadingDb

  const handleSearch = async (): Promise<void> => {
    try {
      setLoadingLogs(true)

      if (searchText) {
        const data = await window.api.searchLogs(searchText)
        createSearchTab(searchText, data)
        setSearchText('')
      } else if (dateRange.startDate && dateRange.endDate) {
        const start = `${dateRange.startDate}T${dateRange.startTime || '00:00:00'}`
        const end = `${dateRange.endDate}T${dateRange.endTime || '23:59:59'}`
        const data = await window.api.getLogsByDate(start, end)
        updateMainTabLogs(data)
      } else {
        const data = await window.api.getLog()
        updateMainTabLogs(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingLogs(false)
    }
  }

  const handleSaveToDb = async (): Promise<void> => {
    try {
      setLoadingDb(true)
      await window.api.saveToDb()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingDb(false)
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-zinc-800 text-white">
      <header className="sticky top-0 z-20 h-14 flex items-center gap-2 px-4 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-700/50">
        <Button onClick={handleSaveToDb} loading={isLoadingDb} loadingText="Saving...">
          db
        </Button>

        {isAnyLoading && (
          <Spinner message={isLoadingLogs ? 'Loading logs...' : 'Saving to database...'} />
        )}

        <Input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
        />

        <div className="ml-auto flex items-center gap-2">
          <DateTimeRangeFilter value={dateRange} onChange={setDateRange} />
          <Button onClick={handleSearch} loading={isLoadingLogs} loadingText="Loading...">
            getLog
          </Button>
        </div>
      </header>

      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={closeTab}
      />

      <main className="min-h-screen p-4">
        {isLoadingLogs ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-lg text-zinc-400 mt-4">Loading logs...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">
                {activeTab.label} ({activeTab.logs.length})
              </h2>
            </div>
            <LogMonitor logs={activeTab.logs} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
