import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, placeholder = 'Select…', id, disabled, ...props },
  ref
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`
  const invalid = Boolean(error)

  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-2 block text-[14px] font-medium tracking-wide text-white/85">
        {label}
      </label>

      <div
        className={cn(
          'relative rounded-[var(--radius-field)] border bg-card transition-colors duration-150',
          invalid ? 'border-danger' : 'border-line focus-within:border-line-strong',
          disabled && 'opacity-45'
        )}
      >
        <select
          {...props}
          id={fieldId}
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          className={cn(
            'h-14 w-full appearance-none bg-transparent px-4 pr-11 text-[16px] outline-none',
            'disabled:cursor-not-allowed',
            props.value ? 'text-white' : 'text-fg-subtle'
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            // Native options inherit the OS palette, so set them explicitly.
            <option key={o.value} value={o.value} style={{ background: '#151515', color: '#fff' }}>
              {o.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-white/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <div className="mt-1.5 min-h-[18px]">
        {invalid ? (
          <p id={errorId} role="alert" className="text-[13px] leading-tight text-danger">
            {error}
          </p>
        ) : hint ? (
          <p className="text-[13px] leading-tight text-fg-subtle">{hint}</p>
        ) : null}
      </div>
    </div>
  )
})
