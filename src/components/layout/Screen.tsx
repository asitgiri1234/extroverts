import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Full-bleed page shell. This is a web app, so screens occupy the whole
 * viewport rather than being letterboxed into a phone-width column; the
 * per-screen layouts below reflow at breakpoints instead of scaling.
 */
export function Screen({
  children,
  className,
  background = 'ink',
}: {
  children: ReactNode
  className?: string
  background?: 'ink' | 'app'
}) {
  return (
    <div
      className={cn(
        'min-h-dvh w-full',
        background === 'app' ? 'bg-app' : 'bg-ink',
        className
      )}
    >
      {children}
    </div>
  )
}

/** Centres content at a readable measure without capping the page itself. */
export function Container({
  children,
  className,
  size = 'lg',
}: {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const widths = {
    sm: 'max-w-[440px]',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
  } as const

  return <div className={cn('mx-auto w-full px-5 sm:px-8', widths[size], className)}>{children}</div>
}
