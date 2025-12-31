interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4'
}

export function Spinner({ size = 'sm', message }: SpinnerProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`animate-spin ${sizeClasses[size]} border-white border-t-transparent rounded-full`}
      />
      {message && <span className="text-sm text-zinc-400">{message}</span>}
    </div>
  )
}
