import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

interface DateFieldProps {
  label: string
  /** ISO `YYYY-MM-DD`, or '' while incomplete. */
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  disabled?: boolean
}

interface Segment {
  key: 'day' | 'month' | 'year'
  placeholder: string
  length: number
  flex: string
}

const SEGMENTS: Segment[] = [
  { key: 'day', placeholder: 'DD', length: 2, flex: 'basis-[22%]' },
  { key: 'month', placeholder: 'MM', length: 2, flex: 'basis-[22%]' },
  { key: 'year', placeholder: 'YYYY', length: 4, flex: 'basis-[34%]' },
]

interface Parts {
  day: string
  month: string
  year: string
}

function split(value: string): Parts {
  const [year = '', month = '', day = ''] = value ? value.split('-') : []
  return { day, month, year }
}

/** '' while incomplete — a partial date is not a date. */
function toISO({ day, month, year }: Parts): string {
  if (!day || !month || year.length < 4) return ''
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/**
 * Date of birth as three numeric segments rather than a raw age number.
 *
 * The brief flags that the original never blocks under-18s. Capturing a birth
 * date lets us compute age exactly (accounting for whether the birthday has
 * passed this year) instead of trusting a self-reported number, and gives us a
 * natural place to demonstrate numeric-only input and per-segment length caps.
 */
export function DateField({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled,
}: DateFieldProps) {
  const refs = useRef<Record<string, HTMLInputElement | null>>({})
  const invalid = Boolean(error)

  /*
   * The segments are held locally rather than derived from `value`.
   *
   * `value` is an ISO date, which stays '' until all three parts are filled — so
   * deriving from it meant the first keystroke emitted '', the field re-rendered
   * from that empty value, and the digit was thrown away. The field could never
   * be typed into at all.
   */
  const [parts, setParts] = useState(() => split(value))

  // Re-sync only when a complete date arrives from outside (store rehydration,
  // or returning to this step). An empty `value` means "still incomplete", which
  // must not wipe what is being typed.
  useEffect(() => {
    if (!value) return
    if (value === toISO(parts)) return
    setParts(split(value))
    // `parts` is deliberately not a dependency — only an incoming value re-syncs.
  }, [value])

  function handleChange(segment: Segment, raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, segment.length)
    const next = { ...parts, [segment.key]: digits }
    setParts(next)
    onChange(toISO(next))

    // Advance once a segment is visibly full.
    if (digits.length === segment.length) {
      const i = SEGMENTS.findIndex((s) => s.key === segment.key)
      const following = SEGMENTS[i + 1]
      if (following) refs.current[following.key]?.focus()
    }
  }

  function handleKeyDown(segment: Segment, e: KeyboardEvent<HTMLInputElement>) {
    const current = parts[segment.key]
    if (e.key === 'Backspace' && !current) {
      const i = SEGMENTS.findIndex((s) => s.key === segment.key)
      const previous = SEGMENTS[i - 1]
      if (previous) {
        e.preventDefault()
        refs.current[previous.key]?.focus()
      }
    }
  }

  return (
    <div className="w-full">
      <span className="mb-2 block text-[14px] font-medium tracking-wide text-white/85">{label}</span>

      <div
        className={cn(
          'flex items-center gap-1 rounded-[var(--radius-field)] border bg-card px-3',
          'transition-colors duration-150',
          invalid ? 'border-danger' : 'border-line focus-within:border-line-strong',
          disabled && 'opacity-45'
        )}
      >
        {SEGMENTS.map((segment, i) => (
          <div key={segment.key} className={cn('flex items-center', segment.flex)}>
            <input
              ref={(el) => {
                refs.current[segment.key] = el
              }}
              value={parts[segment.key]}
              onChange={(e) => handleChange(segment, e.target.value)}
              onKeyDown={(e) => handleKeyDown(segment, e)}
              onBlur={onBlur}
              disabled={disabled}
              inputMode="numeric"
              pattern="\d*"
              maxLength={segment.length}
              placeholder={segment.placeholder}
              aria-label={`${label} ${segment.key}`}
              aria-invalid={invalid}
              className={cn(
                'h-14 w-full min-w-0 bg-transparent text-center text-[16px] tabular-nums',
                'text-white outline-none placeholder:text-fg-subtle',
                'disabled:cursor-not-allowed'
              )}
            />
            {i < SEGMENTS.length - 1 && <span className="text-fg-subtle select-none">/</span>}
          </div>
        ))}
      </div>

      <div className="mt-1.5 min-h-[18px]">
        {invalid ? (
          <p role="alert" className="text-[13px] leading-tight text-danger">
            {error}
          </p>
        ) : hint ? (
          <p className="text-[13px] leading-tight text-fg-subtle">{hint}</p>
        ) : null}
      </div>
    </div>
  )
}
