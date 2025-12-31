import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: 'default' | 'primary'
}

const VARIANT_STYLES = {
  default: 'bg-zinc-700 hover:bg-zinc-600',
  primary: 'bg-cyan-600 hover:bg-cyan-500'
}

export function Button({
  children,
  loading,
  loadingText,
  disabled,
  className = '',
  variant = 'default',
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      disabled={disabled || loading}
      className={`rounded-md px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {loading ? (loadingText ?? children) : children}
    </button>
  )
}
