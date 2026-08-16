import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { PhoneFrame } from '@/components/layout/PhoneFrame'
import { StepTransition } from '@/components/wizard/StepTransition'
import { StepHeader } from '@/components/ui/StepHeader'
import { Button } from '@/components/ui/Button'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

interface StepMeta {
  title: string
  subtitle: string
}

/** Copy for each step. The bodies land in the next pass. */
const STEPS: StepMeta[] = [
  { title: "What's your email?", subtitle: "We'll send a code to make sure it's really you." },
  { title: 'Tell us about you', subtitle: 'Just the basics — this is how others will see you.' },
  { title: 'Where are you?', subtitle: 'Helps us show you parties that are actually nearby.' },
  { title: 'Check everything over', subtitle: 'Fix anything that looks wrong before you finish.' },
]

export function Signup() {
  const step = useSignupStore((s) => s.step)
  const direction = useSignupStore((s) => s.direction)
  const termsAccepted = useSignupStore((s) => s.termsAccepted)
  const next = useSignupStore((s) => s.next)
  const back = useSignupStore((s) => s.back)

  const headingRef = useRef<HTMLDivElement>(null)

  // Move focus to the new step's heading so keyboard and screen-reader users are
  // not left at the bottom of the page after advancing.
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  // The wizard is only reachable once the terms gate has been passed.
  if (!termsAccepted) return <Navigate to="/terms" replace />

  const meta = STEPS[step - 1]

  return (
    <PhoneFrame>
      <div className="flex min-h-dvh flex-col px-6 pt-6 pb-8 sm:px-8">
        <StepHeader
          step={step}
          total={TOTAL_STEPS}
          title={meta.title}
          subtitle={meta.subtitle}
          canGoBack={step > 1}
          onBack={back}
        />

        <div
          ref={headingRef}
          tabIndex={-1}
          className="flex flex-1 flex-col outline-none"
          aria-live="polite"
        >
          <StepTransition stepKey={step} direction={direction}>
            <div className="py-10">
              <p className="rounded-[12px] border border-dashed border-line px-4 py-8 text-center text-[14px] text-fg-subtle">
                Step {step} fields land in the next pass.
                <br />
                Shell only — use Back and Continue to check navigation.
              </p>
            </div>
          </StepTransition>
        </div>

        <div className="space-y-3">
          <Button onClick={next} disabled={step >= TOTAL_STEPS}>
            {step >= TOTAL_STEPS ? 'Finish' : 'Continue'}
          </Button>

          {step > 1 && (
            <Button variant="ghost" onClick={back}>
              Back
            </Button>
          )}
        </div>
      </div>
    </PhoneFrame>
  )
}
