import { memo, useCallback, useState } from 'react'
import type { Parsed } from '../../../types'
import { YouTubePreviewModal } from './YouTubePreviewModal'

const YOUTUBE_URL_REGEX = /'(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^']+)'/g

const extractYouTubeUrl = (message: string): string | null => {
  const match = message.match(/'(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^']+)'/)
  return match ? match[1] : null
}

const parseMessageWithUrls = (
  message: string,
  onUrlClick: (url: string) => void
): React.ReactNode[] => {
  const regex = new RegExp(YOUTUBE_URL_REGEX.source, 'g')
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index))
    }
    const url = match[1]
    parts.push(
      <button
        key={match.index}
        onClick={(e) => {
          e.stopPropagation()
          onUrlClick(url)
        }}
        className="text-cyan-400 hover:text-cyan-300 hover:underline"
      >
        '{url}'
      </button>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [message]
}

interface LogMonitorProps {
  logs: Parsed[]
  onLogClick?: (log: Parsed) => void
  scrollToId?: number
  smoothScroll?: boolean
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

const LogMonitor = memo(({ logs, onLogClick, scrollToId, smoothScroll = true }: LogMonitorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const scrollToElement = (el: HTMLDivElement | null): void => {
    if (el && scrollToId) {
      if (smoothScroll) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      } else {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'instant', block: 'center' })
        })
      }
    }
  }

  const handleUrlClick = useCallback((url: string) => {
    setPreviewUrl(url)
  }, [])

  return (
    <>
      <div className="space-y-2">
        {logs.map((log) => {
          const youtubeUrl = log.message ? extractYouTubeUrl(log.message) : null
          return (
            <div
              key={log.id}
              ref={log.id === scrollToId ? scrollToElement : undefined}
              className={`border border-zinc-700 rounded-lg p-3 bg-zinc-900 ${log.id === scrollToId ? 'ring-2 ring-cyan-500' : ''} ${youtubeUrl ? 'cursor-pointer hover:bg-zinc-800/80 transition-colors' : ''}`}
              onClick={() => youtubeUrl && handleUrlClick(youtubeUrl)}
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs text-zinc-500 font-mono">{formatDateTime(log.timeStamp)}</span>
                {log.loglevel && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded border font-medium ${getLogLevelStyle(log.loglevel)}`}
                  >
                    {log.loglevel.toUpperCase()}
                  </span>
                )}
                {log.category && (
                  <span className={`text-xs px-2 py-0.5 rounded border ${CATEGORY_STYLE}`}>
                    {log.category}
                  </span>
                )}
                {onLogClick && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLogClick(log)
                    }}
                    className="ml-auto text-xs px-2 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white transition-colors"
                  >
                    jump
                  </button>
                )}
              </div>
              {log.message && (
                <div className="text-sm text-zinc-200 leading-relaxed break-words whitespace-pre-wrap font-mono bg-zinc-800/50 rounded px-2 py-1.5">
                  {parseMessageWithUrls(log.message, handleUrlClick)}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <YouTubePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </>
  )
})

LogMonitor.displayName = 'LogMonitor'

export default LogMonitor
