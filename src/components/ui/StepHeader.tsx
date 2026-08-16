import { cn } from '@/lib/cn'

interface StepHeaderProps {
  step: number
  total: number
  title: string
  subtitle?: string
  onBack?: () => void
  /** Hides the back control on the first step, where there is nowhere to go. */
  canGoBack?: boolean
}

export function StepHeader({
  step,
  total,
  title,
  subtitle,
  onBack,
  canGoBack = true,
}: StepHeaderProps) {
  return (
    <header className="pt-2">
      <div className="flex items-center gap-3">
        {canGoBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back to the previous step"
            className="-ml-2 rounded-full p-2 text-white transition-opacity hover:opacity-70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
        ) : (
          <span className="h-10 w-2" />
        )}

        <span className="ml-auto text-[13px] font-medium tracking-[0.08em] text-fg-muted uppercase">
          Step {step} of {total}
        </span>
      </div>

      {/* Segmented progress — clearer than a single bar about how far is left. */}
      <div className="mt-3 flex gap-1.5" role="presentation">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < step ? 'bg-white' : 'bg-white/18'
            )}
          />
        ))}
      </div>

      <h1 className="mt-6 text-[30px] leading-tight font-extrabold text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] leading-snug text-fg-muted">{subtitle}</p>}
    </header>
  )
}
