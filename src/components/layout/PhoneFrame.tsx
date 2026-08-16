import type { ReactNode } from 'react'

/**
 * The reference is a phone app, so every screen is authored at a phone width.
 * On mobile this is simply the viewport. On tablet/desktop we centre that column
 * on a black field rather than stretching the layout — stretching a 4-step signup
 * across 1440px looks broken, and this keeps visual parity with the app.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-black">
      <div className="relative flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-black sm:my-0 sm:border-x sm:border-line">
        {children}
      </div>
    </div>
  )
}
