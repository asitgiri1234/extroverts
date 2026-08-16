import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'error' | 'info' | 'success'

const tones: Record<Tone, string> = {
  error: 'border-danger/45 bg-danger/12 text-danger-soft',
  info: 'border-line bg-surface-2 text-white/80',
  success: 'border-success/45 bg-success/12 text-success',
}

interface AlertProps {
  tone?: Tone
  children: ReactNode
  action?: ReactNode
}

/**
 * Inline banner for failures that belong to the step as a whole rather than to
 * one field — a dropped request, say. Field-level messages stay under the field.
 */
export function Alert({ tone = 'error', children, action }: AlertProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-[12px] border px-4 py-3 text-[14px] leading-snug',
        tones[tone]
      )}
    >
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}
