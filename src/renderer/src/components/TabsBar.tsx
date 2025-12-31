import type { Tab } from '../../../types'

interface TabsBarProps {
  tabs: Tab[]
  activeTabId: string
  onTabSelect: (id: string) => void
  onTabClose: (id: string) => void
}

const getTabStyle = (tab: Tab, isActive: boolean): string => {
  if (tab.isMain) {
    // Main tab: cyan theme
    return isActive
      ? 'bg-cyan-600 text-white'
      : 'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/50 hover:text-cyan-200'
  }
  // Search tabs: gray theme
  return isActive
    ? 'bg-zinc-700 text-white'
    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-300'
}

export function TabsBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose
}: TabsBarProps): React.JSX.Element {
  return (
    <div className="sticky top-[140px] z-10 flex items-center gap-1 px-2 py-1 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-700/50 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-t-md cursor-pointer text-sm transition-colors ${getTabStyle(tab, activeTabId === tab.id)}`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="max-w-32 truncate">{tab.label}</span>
          <span className={`text-xs ${tab.isMain ? 'text-cyan-300/70' : 'text-zinc-500'}`}>
            ({tab.logs.length})
          </span>
          {!tab.isMain && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.id)
              }}
              className="ml-1 text-zinc-500 hover:text-white hover:bg-zinc-600 rounded px-1"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
