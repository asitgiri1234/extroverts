import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { StepHeader } from '@/components/ui/StepHeader'
import { OtpInput } from '@/components/ui/OtpInput'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useCountdown } from '@/hooks/useCountdown'
import {
  DEMO_OTP,
  isApiError,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  resendOtp,
  verifyOtp,
} from '@/lib/mockApi'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

export function OtpStep() {
  const email = useSignupStore((s) => s.profile.email)
  const setOtpSent = useSignupStore((s) => s.setOtpSent)
  const markEmailVerified = useSignupStore((s) => s.markEmailVerified)
  const next = useSignupStore((s) => s.next)

  const [code, setCode] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [locked, setLocked] = useState(false)

  const { remaining, start, isRunning } = useCountdown(RESEND_COOLDOWN_SECONDS)

  /** Guards against the auto-submit and a manual click both firing. */
  const inFlight = useRef(false)

  async function submit(value: string) {
    if (inFlight.current || value.length !== OTP_LENGTH) return
    inFlight.current = true
    setVerifying(true)
    setFieldError(null)
    setStepError(null)

    try {
      await verifyOtp(email, value)
      markEmailVerified()
      toast.success('Email verified')
      next()
    } catch (error) {
      if (!isApiError(error)) throw error

      if (error.code === 'NETWORK_ERROR') {
        setStepError(error.message)
        toast.error('Verification failed', { description: error.message })
      } else {
        // Wrong or expired code: message under the boxes, shake, then clear.
        setFieldError(error.message)
        setCode('')
        if (error.code === 'TOO_MANY_ATTEMPTS') setLocked(true)
      }
    } finally {
      setVerifying(false)
      inFlight.current = false
    }
  }

  async function handleResend() {
    if (isRunning || resending) return
    setResending(true)
    setFieldError(null)
    setStepError(null)

    try {
      await resendOtp(email)
      setCode('')
      setLocked(false)
      start(RESEND_COOLDOWN_SECONDS)
      toast.success('New code sent')
    } catch (error) {
      if (!isApiError(error)) throw error
      setStepError(error.message)
      toast.error("Couldn't resend", { description: error.message })
    } finally {
      setResending(false)
    }
  }

  /** Clear a stale error as soon as the user starts a fresh attempt. */
  function handleCodeChange(value: string) {
    setCode(value)
    if (value.length > 0 && fieldError) setFieldError(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <StepHeader
        step={1}
        total={TOTAL_STEPS}
        title="Enter your code"
        subtitle={`We sent a ${OTP_LENGTH}-digit code to ${email}.`}
        canGoBack
        onBack={() => setOtpSent(false)}
      />

      <div className="mt-8 flex-1">
        <OtpInput
          value={code}
          onChange={handleCodeChange}
          onComplete={submit}
          error={fieldError ?? undefined}
          disabled={verifying || locked}
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOtpSent(false)}
            className="text-[14px] text-fg-muted underline underline-offset-2 hover:text-white"
          >
            Change email
          </button>

          {isRunning ? (
            <span className="text-[14px] text-fg-subtle tabular-nums">
              Resend in {remaining}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[14px] font-semibold text-white underline underline-offset-2 disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </div>

        {stepError && (
          <div className="mt-4">
            <Alert
              action={
                <button
                  type="button"
                  onClick={() => submit(code)}
                  className="shrink-0 text-[14px] font-semibold text-white underline underline-offset-2"
                >
                  Retry
                </button>
              }
            >
              {stepError}
            </Alert>
          </div>
        )}

        {locked && (
          <div className="mt-4">
            <Alert tone="info">Too many attempts. Request a new code to try again.</Alert>
          </div>
        )}

        <p className="mt-6 rounded-[12px] border border-line bg-surface-2 px-4 py-3 text-[13px] text-fg-subtle">
          <span className="font-semibold tracking-[0.1em] text-fg-muted uppercase">Demo mode</span>
          <br />
          Use <span className="font-semibold text-white">{DEMO_OTP}</span> — any other code is
          rejected. Nothing is actually sent.
        </p>
      </div>

      <Button
        onClick={() => submit(code)}
        loading={verifying}
        disabled={code.length !== OTP_LENGTH || locked}
      >
        Verify
      </Button>
    </div>
  )
}
