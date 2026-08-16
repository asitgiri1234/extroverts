import { useState } from 'react'
import { cn } from '@/lib/cn'
import { CloseIcon } from '@/components/icons'

interface DemoHintProps {
  /** `[input, what it triggers]` pairs. */
  rows: Array<[string, string]>
  className?: string
}

/**
 * Surfaces the simulated failure triggers in the UI.
 *
 * Without this, a reviewer opening the deployed link has no way to discover that
 * error handling exists — and no way past the OTP screen at all, since the
 * accepted code cannot be guessed. Error handling nobody can reach reads as
 * error handling that was never built.
 */
export function DemoHint({ rows, className }: DemoHintProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <aside
      className={cn('rounded-[12px] border border-line bg-surface-2 px-4 py-3', className)}
      aria-label="Demo mode hints"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold tracking-[0.1em] text-fg-muted uppercase">
          Demo mode
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Hide demo hints"
          className="-mt-1 -mr-1 shrink-0 text-fg-muted transition-opacity hover:opacity-70"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <dl className="mt-2 space-y-1">
        {rows.map(([input, effect]) => (
          <div key={input} className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
            <dt className="font-semibold text-white/90">{input}</dt>
            <dd className="text-fg-subtle">— {effect}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
