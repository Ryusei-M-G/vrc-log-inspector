import { memo } from 'react'
import type { Parsed } from '../../../types'
import { extractYouTubeUrl, parseYouTubeUrls } from '../utils/youtube'

interface LogItemProps {
  log: Parsed
  isHighlighted: boolean
  onJumpClick?: () => void
  onYouTubeClick: (url: string) => void
  scrollRef?: (el: HTMLDivElement | null) => void
}

const LOG_LEVEL_STYLES: Record<string, string> = {
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  warn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  debug: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
}

const DEFAULT_LEVEL_STYLE = 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
const CATEGORY_STYLE = 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50'

const formatDateTime = (dateTime: Date | string | undefined): string => {
  if (!dateTime) return ''
  return new Date(dateTime).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getLogLevelStyle = (level: string | null | undefined): string =>
  LOG_LEVEL_STYLES[level?.toLowerCase() ?? ''] ?? DEFAULT_LEVEL_STYLE

export const LogItem = memo(function LogItem({
  log,
  isHighlighted,
  onJumpClick,
  onYouTubeClick,
  scrollRef
}: LogItemProps) {
  const youtubeUrl = log.message ? extractYouTubeUrl(log.message) : null
  const isClickable = !!youtubeUrl

  const renderYouTubeLink = (url: string, key: number): React.ReactNode => (
    <button
      key={key}
      onClick={(e) => {
        e.stopPropagation()
        onYouTubeClick(url)
      }}
      className="text-cyan-400 hover:text-cyan-300 hover:underline"
    >
      '{url}'
    </button>
  )

  return (
    <div
      ref={scrollRef}
      className={`border border-zinc-700 rounded-lg p-3 bg-zinc-900 ${isHighlighted ? 'ring-2 ring-cyan-500' : ''} ${isClickable ? 'cursor-pointer hover:bg-zinc-800/80 transition-colors' : ''}`}
      onClick={() => youtubeUrl && onYouTubeClick(youtubeUrl)}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs text-zinc-500 font-mono">
          {formatDateTime(log.timeStamp)}
        </span>
        {log.loglevel && (
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getLogLevelStyle(log.loglevel)}`}>
            {log.loglevel.toUpperCase()}
          </span>
        )}
        {log.category && (
          <span className={`text-xs px-2 py-0.5 rounded border ${CATEGORY_STYLE}`}>
            {log.category}
          </span>
        )}
        {onJumpClick && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onJumpClick()
            }}
            className="ml-auto text-xs px-2 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white transition-colors"
          >
            jump
          </button>
        )}
      </div>
      {log.message && (
        <div className="text-sm text-zinc-200 leading-relaxed break-words whitespace-pre-wrap font-mono bg-zinc-800/50 rounded px-2 py-1.5">
          {parseYouTubeUrls(log.message, renderYouTubeLink)}
        </div>
      )}
    </div>
  )
})
