import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}

export function Button({
  children,
  loading,
  loadingText,
  disabled,
  className = '',
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      disabled={disabled || loading}
      className={`bg-zinc-700 rounded-md px-4 py-2 text-white hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (loadingText ?? children) : children}
    </button>
  )
}
