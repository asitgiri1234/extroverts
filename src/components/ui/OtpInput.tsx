import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import { OTP_LENGTH } from '@/lib/mockApi'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  /** Fired once the last digit lands, so the caller can auto-submit. */
  onComplete?: (value: string) => void
  error?: string
  disabled?: boolean
  length?: number
  autoFocus?: boolean
}

const DIGITS = /\d/g

/**
 * Six discrete boxes rather than the single plain field the original app uses.
 * Deliberate improvement — the brief calls this screen out by name.
 *
 * Handles auto-advance, backspace-to-previous, arrow navigation, paste of a
 * whole code from anywhere in the row, numeric soft keyboards, SMS/email
 * autofill via one-time-code, auto-submit on the final digit, and a shake+clear
 * when the code is rejected.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  error,
  disabled,
  length = OTP_LENGTH,
  autoFocus = true,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const [shaking, setShaking] = useState(false)
  const cells = Array.from({ length }, (_, i) => value[i] ?? '')

  // Shake on rejection, then hand focus back to the first box for a fresh try.
  useEffect(() => {
    if (!error) return
    setShaking(true)
    const t = setTimeout(() => {
      setShaking(false)
      refs.current[0]?.focus()
    }, 450)
    return () => clearTimeout(t)
  }, [error])

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  function focusAt(index: number) {
    refs.current[Math.min(Math.max(index, 0), length - 1)]?.focus()
  }

  function commit(next: string) {
    const trimmed = next.slice(0, length)
    onChange(trimmed)
    if (trimmed.length === length) onComplete?.(trimmed)
  }

  function handleChange(index: number, raw: string) {
    const digits = raw.match(DIGITS)?.join('') ?? ''
    if (!digits) return

    // Typing over a filled box replaces it; a multi-char burst fills forward.
    const chars = cells.slice()
    let cursor = index
    for (const d of digits) {
      if (cursor >= length) break
      chars[cursor] = d
      cursor += 1
    }

    commit(chars.join('').slice(0, length))
    focusAt(cursor)
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const chars = cells.slice()

      if (chars[index]) {
        // Clear the current box and stay put.
        chars[index] = ''
      } else if (index > 0) {
        // Already empty — step back and clear that one instead.
        chars[index - 1] = ''
        focusAt(index - 1)
      }

      onChange(chars.join('').replace(/\s/g, ''))
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').match(DIGITS)?.join('') ?? ''
    if (!digits) return

    commit(digits.slice(0, length))
    focusAt(Math.min(digits.length, length - 1))
  }

  return (
    <div>
      <div
        className={cn('flex justify-between gap-2 sm:gap-3', shaking && 'animate-shake')}
        role="group"
        aria-label="One-time code"
      >
        {cells.map((cell, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            value={cell}
            disabled={disabled}
            // inputMode gives mobile a numeric pad; one-time-code enables autofill.
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            pattern="\d*"
            maxLength={1}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={Boolean(error)}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              'h-[58px] w-full min-w-0 rounded-[12px] border bg-card text-center',
              'text-[24px] font-semibold text-white tabular-nums outline-none',
              'transition-colors duration-150',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-danger'
                : cell
                  ? 'border-line-strong'
                  : 'border-line focus:border-white'
            )}
          />
        ))}
      </div>

      <div className="mt-2 min-h-[18px]">
        {error && (
          <p role="alert" className="text-center text-[13px] text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
