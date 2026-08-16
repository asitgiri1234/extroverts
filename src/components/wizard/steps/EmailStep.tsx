import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { StepHeader } from '@/components/ui/StepHeader'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { DemoHint } from '@/components/wizard/DemoHint'
import { emailSchema, type EmailValues } from '@/lib/schemas'
import { isApiError, requestOtp, TRIGGER_FAIL, TRIGGER_TAKEN } from '@/lib/mockApi'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

export function EmailStep() {
  const profile = useSignupStore((s) => s.profile)
  const patchProfile = useSignupStore((s) => s.patchProfile)
  const setOtpSent = useSignupStore((s) => s.setOtpSent)

  /** Step-level failure (a dropped request), as opposed to a field error. */
  const [stepError, setStepError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: profile.email },
    // Validate on blur first, then live once a field has already been flagged —
    // so the user is not told they are wrong halfway through typing.
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const email = watch('email') ?? ''

  async function onSubmit(values: EmailValues) {
    setStepError(null)
    try {
      const result = await requestOtp(values.email)
      patchProfile({ email: result.email })
      setOtpSent(true)
      toast.success('Code sent', { description: `We sent a 6-digit code to ${result.email}.` })
    } catch (error) {
      if (!isApiError(error)) throw error

      if (error.field === 'email') {
        // Belongs beneath the input, where the user is already looking.
        setError('email', { type: 'server', message: error.message })
        return
      }

      setStepError(error.message)
      toast.error('Something went wrong', { description: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <StepHeader
        step={1}
        total={TOTAL_STEPS}
        title="What's your email?"
        subtitle="We'll send you a code to make sure it's really you."
        canGoBack={false}
      />

      <div className="mt-8 flex-1">
        <TextField
          {...register('email')}
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          autoFocus
          value={email}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        {stepError && (
          <div className="mt-2">
            <Alert
              action={
                <button
                  type="submit"
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

        <DemoHint
          className="mt-6"
          rows={[
            [`${TRIGGER_TAKEN}@example.com`, 'account already exists'],
            [`${TRIGGER_FAIL}@example.com`, 'network error'],
            ['anything else', 'proceeds to the code screen'],
          ]}
        />
      </div>

      <Button type="submit" loading={isSubmitting}>
        Continue
      </Button>
    </form>
  )
}
