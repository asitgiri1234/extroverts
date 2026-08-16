import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  // The app's signature CTA: full-bleed white pill, black uppercase label.
  primary: 'bg-white text-black hover:bg-white/90 active:bg-white/80',
  secondary: 'bg-surface-2 text-white border border-line hover:bg-surface-3',
  ghost: 'bg-transparent text-fg-muted hover:text-white',
}

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  // Loading implies disabled — this is what stops duplicate submissions.
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'h-14 rounded-[var(--radius-field)] px-6',
        'text-[15px] font-semibold tracking-[0.08em] uppercase',
        'transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-45',
        fullWidth && 'w-full',
        variants[variant],
        className
      )}
    >
      {/* Keep the label mounted while loading so the button never changes width. */}
      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner className={variant === 'primary' ? 'text-black' : 'text-white'} />
        </span>
      )}
    </button>
  )
}
