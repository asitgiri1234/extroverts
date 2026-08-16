import { useNavigate } from 'react-router-dom'
import { MeshGradient } from '@/components/backgrounds/MeshGradient'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { PhoneFrame } from '@/components/layout/PhoneFrame'

export function Landing() {
  const navigate = useNavigate()

  return (
    <PhoneFrame>
      <div className="relative flex min-h-full flex-col">
        <MeshGradient />

        {/* Logo sits just above the optical centre, as in the app. */}
        <div className="relative flex flex-1 items-center justify-center pt-16">
          <Logo className="text-[64px] text-white sm:text-[76px]" />
        </div>

        <div className="relative px-6 pb-10 sm:px-8">
          <p className="text-center text-[15px] font-bold tracking-[0.06em] text-white uppercase sm:text-base">
            An app only for
          </p>
          <h1 className="mt-1 text-center text-[44px] leading-[1.05] font-extrabold tracking-[-0.01em] text-white uppercase sm:text-[54px]">
            Extroverts
          </h1>

          <p className="mt-5 text-center text-[15px] leading-snug text-white/90">
            <span className="font-semibold text-danger">Warning:</span> Entering may lead to
            spontaneous dancing and unsolicited high-fives!
          </p>

          <Button className="mt-5" onClick={() => navigate('/terms')}>
            Continue
          </Button>
        </div>
      </div>
    </PhoneFrame>
  )
}
