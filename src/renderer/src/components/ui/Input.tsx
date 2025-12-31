import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps): React.JSX.Element {
  return (
    <input
      className={`bg-zinc-800 rounded-md px-3 py-2 text-white border border-zinc-600 focus:outline-none focus:border-zinc-400 text-sm ${className}`}
      {...props}
    />
  )
}
