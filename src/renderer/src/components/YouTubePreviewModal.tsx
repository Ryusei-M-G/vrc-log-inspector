import { useEffect } from 'react'
import { extractVideoId } from '../utils/youtube'

interface YouTubePreviewModalProps {
  url: string | null
  onClose: () => void
}

export function YouTubePreviewModal({ url, onClose }: YouTubePreviewModalProps): React.JSX.Element | null {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!url) return null

  const videoId = extractVideoId(url)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 max-w-3xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white truncate flex-1 mr-4">{url}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl px-2"
          >
            ×
          </button>
        </div>

        {videoId ? (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-zinc-800 rounded flex items-center justify-center">
            <p className="text-zinc-400">プレビューを表示できません</p>
          </div>
        )}
      </div>
    </div>
  )
}
