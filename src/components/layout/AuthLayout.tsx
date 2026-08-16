import type { ReactNode } from 'react'
import { MeshGradient } from '@/components/backgrounds/MeshGradient'
import { Logo } from '@/components/brand/Logo'

/**
 * Two-pane layout for the wizard.
 *
 * A signup form stretched across 1440px is unreadable, but a narrow column
 * floating in a black void looks unfinished. So the form keeps its comfortable
 * measure on the right while a brand panel fills the remaining width on large
 * screens. Below `lg` the panel drops away and the form takes the full page.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh w-full lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.25fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <MeshGradient />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Logo className="text-[44px] text-white" />

          <div className="max-w-[460px]">
            <p className="text-[15px] font-bold tracking-[0.08em] text-white/90 uppercase">
              An app only for
            </p>
            <p className="mt-1 text-[56px] leading-[1.02] font-extrabold text-white uppercase xl:text-[68px]">
              Extroverts
            </p>
            <p className="mt-5 text-[16px] leading-snug text-white/85">
              Warning: entering may lead to spontaneous dancing and unsolicited high-fives.
            </p>
          </div>

          <p className="text-[13px] text-white/55">Extroverts 2026 · v1.8.5</p>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-col bg-ink">
        {/* Logo only shows here when the brand panel is hidden. */}
        <div className="px-5 pt-6 sm:px-8 lg:hidden">
          <Logo className="text-[34px] text-white" />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </main>
    </div>
  )
}
