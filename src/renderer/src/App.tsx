import { useState } from 'react'
import { useTabs } from './hooks/useTabs'
import { Button, Input, Spinner } from './components/ui'
import { DateTimeRangeFilter, type DateTimeRange } from './components/DateTimeRangeFilter'
import { TabsBar } from './components/TabsBar'
import LogMonitor from './components/LogMonitor'
import type { Parsed } from '../../types'

const initialDateRange: DateTimeRange = {
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: ''
}

function App(): React.JSX.Element {
  const { tabs, activeTab, activeTabId, setActiveTabId, setMainTabLogs, createSearchTab, closeTab } =
    useTabs()
  const [isLoadingLogs, setLoadingLogs] = useState(false)
  const [isLoadingDb, setLoadingDb] = useState(false)
  const [dateRange, setDateRange] = useState<DateTimeRange>(initialDateRange)
  const [searchText, setSearchText] = useState('')
  const [scrollToId, setScrollToId] = useState<number | undefined>()
  const [smoothScroll, setSmoothScroll] = useState(true)

  const isAnyLoading = isLoadingLogs || isLoadingDb

  const handleTabSelect = (tabId: string): void => {
    setSmoothScroll(false)
    setActiveTabId(tabId)
  }

  const hasDateRange = dateRange.startDate && dateRange.endDate

  const buildSearchLabel = (): string => {
    const parts: string[] = []
    if (searchText) parts.push(searchText)
    if (hasDateRange) parts.push(`${dateRange.startDate}~${dateRange.endDate}`)
    return parts.join(' | ')
  }

  const getDateRangeDays = (): number => {
    if (!hasDateRange) return 0
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const handleSearch = async (): Promise<void> => {
    if (!hasDateRange) return

    const days = getDateRangeDays()
    if (days >= 3) {
      const confirmed = window.confirm(
        `指定された期間は${days}日間です。\n取得に時間がかかる可能性があります。続行しますか？`
      )
      if (!confirmed) return
    }

    setScrollToId(undefined)

    try {
      setLoadingLogs(true)

      const options = {
        searchText: searchText || undefined,
        startDate: `${dateRange.startDate}T${dateRange.startTime || '00:00:00'}`,
        endDate: `${dateRange.endDate}T${dateRange.endTime || '23:59:59'}`
      }
      const data = await window.api.searchLogs(options)

      if (searchText) {
        createSearchTab(buildSearchLabel(), data)
        setSearchText('')
      } else {
        // Date-only search: update main tab
        const dateLabel =
          dateRange.startDate === dateRange.endDate
            ? dateRange.startDate
            : `${dateRange.startDate}~${dateRange.endDate}`
        setMainTabLogs(dateLabel, data)
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

  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleLogClick = async (log: Parsed): Promise<void> => {
    if (!log.timeStamp || !log.id) return

    const date = new Date(log.timeStamp)
    const hour = date.getHours()
    const currentDateStr = formatLocalDate(date)

    // If hour is 0 (midnight), include previous day in range
    const isMidnight = hour === 0
    let startDateStr: string
    let endDateStr: string
    let tabLabel: string

    if (isMidnight) {
      const prevDate = new Date(date)
      prevDate.setDate(prevDate.getDate() - 1)
      startDateStr = formatLocalDate(prevDate)
      endDateStr = currentDateStr
      tabLabel = `${startDateStr}~${endDateStr}`
    } else {
      startDateStr = currentDateStr
      endDateStr = currentDateStr
      tabLabel = currentDateStr
    }

    // Update the date filter UI
    setDateRange({
      startDate: startDateStr,
      startTime: '',
      endDate: endDateStr,
      endTime: ''
    })
    setSearchText('')

    // Always fetch and update the main tab
    try {
      setLoadingLogs(true)
      const data = await window.api.searchLogs({
        startDate: `${startDateStr}T00:00:00`,
        endDate: `${endDateStr}T23:59:59`
      })
      setMainTabLogs(tabLabel, data)
      setSmoothScroll(true)
      setScrollToId(log.id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingLogs(false)
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-zinc-800 text-white">
      <header className="sticky top-0 z-20 flex flex-col gap-2 px-4 py-2 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-700/50">
        {/* Row 1: Date filters, Search, getLog, Sync */}
        <div className="flex items-center gap-2">
          <DateTimeRangeFilter value={dateRange} onChange={setDateRange} />
          <Input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            loading={isLoadingLogs}
            loadingText="Searching..."
            disabled={!hasDateRange}
            variant="primary"
          >
            Search
          </Button>
          <Button onClick={handleSaveToDb} loading={isLoadingDb} loadingText="Syncing...">
            sync
          </Button>
          {isAnyLoading && (
            <Spinner message={isLoadingLogs ? 'Loading logs...' : 'Syncing...'} />
          )}
        </div>

        {/* Row 2: Template buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSearchText('OnPlayerJoined OnPlayerLeft')}
            className="text-sm"
          >
            Join/Left
          </Button>
          <Button
            onClick={() => setSearchText('Joining OnLeftRoom')}
            className="text-sm"
          >
            Room
          </Button>
        </div>
      </header>

      <TabsBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={handleTabSelect}
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
            <LogMonitor
              logs={activeTab.logs}
              onLogClick={handleLogClick}
              scrollToId={activeTab.isMain ? scrollToId : undefined}
              smoothScroll={smoothScroll}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
