import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  error?: string
  hint?: ReactNode
  /** Renders a live "12/40" counter. Also sets maxLength when not already given. */
  showCount?: boolean
  adornment?: ReactNode
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, showCount, adornment, maxLength, value, id, ...props },
  ref
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const length = typeof value === 'string' ? value.length : 0
  const invalid = Boolean(error)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={fieldId} className="text-[14px] font-medium tracking-wide text-white/85">
          {label}
        </label>
        {showCount && maxLength != null && (
          <span
            className={cn(
              'text-[13px] tabular-nums',
              length >= maxLength ? 'text-danger' : 'text-fg-subtle'
            )}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>

      <div
        className={cn(
          'flex items-center gap-2 rounded-[var(--radius-field)] border bg-card px-4',
          'transition-colors duration-150',
          invalid ? 'border-danger' : 'border-line focus-within:border-line-strong'
        )}
      >
        <input
          {...props}
          id={fieldId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-invalid={invalid}
          aria-describedby={cn(invalid && errorId, Boolean(hint) && hintId) || undefined}
          className={cn(
            'h-14 w-full bg-transparent text-[16px] text-white outline-none',
            'placeholder:text-fg-subtle',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
        {adornment}
      </div>

      {/*
       * Reserve the message row so validating a field never shifts the layout
       * beneath it — the classic cause of mis-taps on mobile.
       */}
      <div className="mt-1.5 min-h-[18px]">
        {invalid ? (
          <p id={errorId} role="alert" className="text-[13px] leading-tight text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-[13px] leading-tight text-fg-subtle">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  )
})
