import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { PhoneFrame } from '@/components/layout/PhoneFrame'
import { StepTransition } from '@/components/wizard/StepTransition'
import { StepHeader } from '@/components/ui/StepHeader'
import { Button } from '@/components/ui/Button'
import { EmailStep } from '@/components/wizard/steps/EmailStep'
import { OtpStep } from '@/components/wizard/steps/OtpStep'
import { IdentityStep } from '@/components/wizard/steps/IdentityStep'
import { PlaceStep } from '@/components/wizard/steps/PlaceStep'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

/**
 * Placeholder for steps not yet built. Keeps navigation checkable end to end.
 */
function PendingStep({ step }: { step: number }) {
  const back = useSignupStore((s) => s.back)
  const next = useSignupStore((s) => s.next)

  return (
    <div className="flex flex-1 flex-col">
      <StepHeader
        step={step}
        total={TOTAL_STEPS}
        title="Coming next"
        subtitle="Shell only — use Back and Continue to check navigation."
        onBack={back}
      />
      <div className="flex-1 py-10">
        <p className="rounded-[12px] border border-dashed border-line px-4 py-8 text-center text-[14px] text-fg-subtle">
          Step {step} fields land in the next pass.
        </p>
      </div>
      <Button onClick={next} disabled={step >= TOTAL_STEPS}>
        {step >= TOTAL_STEPS ? 'Finish' : 'Continue'}
      </Button>
    </div>
  )
}

export function Signup() {
  const step = useSignupStore((s) => s.step)
  const direction = useSignupStore((s) => s.direction)
  const termsAccepted = useSignupStore((s) => s.termsAccepted)
  const otpSent = useSignupStore((s) => s.otpSent)
  const emailVerified = useSignupStore((s) => s.emailVerified)

  const paneRef = useRef<HTMLDivElement>(null)

  // Step 1 has two panes, so key the transition on the pane rather than the step.
  const paneKey = step === 1 ? (otpSent && !emailVerified ? '1-otp' : '1-email') : String(step)

  // Move focus into the new pane so keyboard and screen-reader users are not
  // stranded at the bottom of the page after advancing.
  useEffect(() => {
    paneRef.current?.focus()
  }, [paneKey])

  // The wizard is only reachable once the terms gate has been passed.
  if (!termsAccepted) return <Navigate to="/terms" replace />

  function renderStep() {
    if (step === 1) {
      return otpSent && !emailVerified ? <OtpStep /> : <EmailStep />
    }
    if (step === 2) return <IdentityStep />
    if (step === 3) return <PlaceStep />
    return <PendingStep step={step} />
  }

  return (
    <PhoneFrame>
      <div
        ref={paneRef}
        tabIndex={-1}
        className="flex min-h-dvh flex-col px-6 pt-6 pb-8 outline-none sm:px-8"
      >
        <StepTransition stepKey={paneKey} direction={direction}>
          <div className="flex min-h-[calc(100dvh-56px)] flex-col">{renderStep()}</div>
        </StepTransition>
      </div>
    </PhoneFrame>
  )
}
