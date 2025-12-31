import { useState, useCallback, useMemo } from 'react'
import type { Parsed, Tab } from '../../../types'

const MAIN_TAB_ID = 'main'

const initialTabs: Tab[] = [{ id: MAIN_TAB_ID, label: 'All Logs', logs: [], isMain: true }]

interface UseTabsReturn {
  tabs: Tab[]
  activeTab: Tab
  activeTabId: string
  setActiveTabId: (id: string) => void
  updateMainTabLogs: (logs: Parsed[]) => void
  createSearchTab: (searchQuery: string, logs: Parsed[]) => void
  closeTab: (tabId: string) => void
}

export function useTabs(): UseTabsReturn {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs)
  const [activeTabId, setActiveTabId] = useState<string>(MAIN_TAB_ID)

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  )

  const updateMainTabLogs = useCallback((logs: Parsed[]) => {
    setTabs((prev) => prev.map((tab) => (tab.id === MAIN_TAB_ID ? { ...tab, logs } : tab)))
    setActiveTabId(MAIN_TAB_ID)
  }, [])

  const createSearchTab = useCallback((searchQuery: string, logs: Parsed[]) => {
    const newTabId = `search-${Date.now()}`
    setTabs((prev) => [...prev, { id: newTabId, label: searchQuery, logs }])
    setActiveTabId(newTabId)
  }, [])

  const closeTab = useCallback((tabId: string) => {
    if (tabId === MAIN_TAB_ID) return
    setTabs((prev) => prev.filter((tab) => tab.id !== tabId))
    setActiveTabId((prev) => (prev === tabId ? MAIN_TAB_ID : prev))
  }, [])

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    updateMainTabLogs,
    createSearchTab,
    closeTab
  }
}
