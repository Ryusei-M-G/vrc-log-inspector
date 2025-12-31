import { memo, useCallback, useState } from 'react'
import type { Parsed } from '../../../types'
import { LogItem } from './LogItem'
import { YouTubePreviewModal } from './YouTubePreviewModal'

interface LogMonitorProps {
  logs: Parsed[]
  onLogClick?: (log: Parsed) => void
  scrollToId?: number
  smoothScroll?: boolean
}

const LogMonitor = memo(function LogMonitor({
  logs,
  onLogClick,
  scrollToId,
  smoothScroll = true
}: LogMonitorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const createScrollRef = useCallback(
    (logId: number | undefined) => {
      if (logId !== scrollToId) return undefined

      return (el: HTMLDivElement | null): void => {
        if (!el) return

        const scrollOptions = { behavior: smoothScroll ? 'smooth' : 'instant', block: 'center' } as const

        if (smoothScroll) {
          setTimeout(() => el.scrollIntoView(scrollOptions), 100)
        } else {
          requestAnimationFrame(() => el.scrollIntoView(scrollOptions))
        }
      }
    },
    [scrollToId, smoothScroll]
  )

  return (
    <>
      <div className="space-y-2">
        {logs.map((log) => (
          <LogItem
            key={log.id}
            log={log}
            isHighlighted={log.id === scrollToId}
            onJumpClick={onLogClick ? () => onLogClick(log) : undefined}
            onYouTubeClick={setPreviewUrl}
            scrollRef={createScrollRef(log.id)}
          />
        ))}
      </div>
      <YouTubePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </>
  )
})

export default LogMonitor
