const YOUTUBE_URL_PATTERN = /'(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^']+)'/

export const extractYouTubeUrl = (message: string): string | null => {
  const match = message.match(YOUTUBE_URL_PATTERN)
  return match ? match[1] : null
}

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export const parseYouTubeUrls = (
  message: string,
  renderLink: (url: string, key: number) => React.ReactNode
): React.ReactNode[] => {
  const regex = new RegExp(YOUTUBE_URL_PATTERN.source, 'g')
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index))
    }
    parts.push(renderLink(match[1], match.index))
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [message]
}
