import { useNavigate } from 'react-router-dom'
import { MeshGradient } from '@/components/backgrounds/MeshGradient'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-ink">
      <MeshGradient />

      {/* Logo sits above the optical centre, as in the app. */}
      <div className="relative flex flex-1 items-center justify-center pt-20 pb-8">
        <Logo className="text-[72px] text-white sm:text-[96px] lg:text-[120px]" />
      </div>

      <div className="relative px-5 pb-12 sm:px-8 lg:pb-20">
        <div className="mx-auto w-full max-w-[640px] text-center">
          <p className="text-[15px] font-bold tracking-[0.08em] text-white uppercase sm:text-[17px]">
            An app only for
          </p>
          <h1 className="mt-1 text-[48px] leading-[1.03] font-extrabold tracking-[-0.01em] text-white uppercase sm:text-[68px] lg:text-[84px]">
            Extroverts
          </h1>

          <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-snug text-white/90 sm:text-[17px]">
            <span className="font-semibold text-danger">Warning:</span> Entering may lead to
            spontaneous dancing and unsolicited high-fives!
          </p>

          {/* The CTA keeps a tappable measure rather than stretching to the page. */}
          <div className="mx-auto mt-7 max-w-[440px]">
            <Button onClick={() => navigate('/terms')}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
