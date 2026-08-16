import { cn } from '@/lib/cn'

/**
 * The "E•" wordmark from the app: a heavy high-contrast serif E with a raised dot.
 * Rendered as type rather than an SVG trace so it stays sharp at every size.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-start leading-none select-none', className)}
      aria-label="Extroverts"
      role="img"
    >
      <span
        className="font-black leading-[0.8] tracking-tight"
        style={{ fontFamily: "'Didot', 'Bodoni MT', 'Playfair Display', Georgia, serif" }}
      >
        E
      </span>
      <span
        className="ml-[0.06em] aspect-square rounded-full bg-current"
        style={{ width: '0.16em', marginTop: '0.08em' }}
      />
    </span>
  )
}
