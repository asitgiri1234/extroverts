import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepHeader } from '@/components/ui/StepHeader'
import { TextField } from '@/components/ui/TextField'
import { DateField } from '@/components/ui/DateField'
import { ChoiceGroup } from '@/components/ui/ChoiceGroup'
import { Button } from '@/components/ui/Button'
import { identitySchema, NAME_MAX, type IdentityValues } from '@/lib/schemas'
import { ageOn, MIN_AGE } from '@/lib/age'
import { PRONOUN_CHOICES } from '@/data/pronouns'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

export function IdentityStep() {
  const profile = useSignupStore((s) => s.profile)
  const patchProfile = useSignupStore((s) => s.patchProfile)
  const next = useSignupStore((s) => s.next)
  const back = useSignupStore((s) => s.back)

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IdentityValues>({
    resolver: zodResolver(identitySchema),
    // Rehydrated from the store, so coming back here keeps what was typed.
    defaultValues: {
      name: profile.name,
      dob: profile.dob,
      pronouns: profile.pronouns,
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const name = watch('name') ?? ''
  const dob = watch('dob') ?? ''
  const age = dob ? ageOn(dob) : null

  function onSubmit(values: IdentityValues) {
    patchProfile({
      name: values.name.trim(),
      dob: values.dob,
      pronouns: values.pronouns,
    })
    next()
  }

  /** Going back should not discard a half-filled step. */
  function handleBack() {
    const current = getValues()
    patchProfile({
      name: current.name ?? '',
      dob: current.dob ?? '',
      pronouns: current.pronouns ?? '',
    })
    back()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <StepHeader
        step={2}
        total={TOTAL_STEPS}
        title="Tell us about you"
        subtitle="Just the basics — this is how others will see you."
        onBack={handleBack}
      />

      <div className="mt-8 flex-1 space-y-5 pb-8">
        <TextField
          {...register('name')}
          label="Your name"
          autoComplete="name"
          placeholder="Asit Giri"
          maxLength={NAME_MAX}
          showCount
          autoFocus
          value={name}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

        <Controller
          control={control}
          name="dob"
          render={({ field }) => (
            <DateField
              label="Date of birth"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.dob?.message}
              hint={
                // Confirm the computed age so the gate never feels arbitrary.
                age !== null && age >= MIN_AGE
                  ? `You're ${age}.`
                  : `You must be ${MIN_AGE} or older to join.`
              }
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          control={control}
          name="pronouns"
          render={({ field }) => (
            <ChoiceGroup
              name="pronouns"
              label="Pronouns"
              choices={PRONOUN_CHOICES}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.pronouns?.message}
            />
          )}
        />
      </div>

      <Button type="submit" loading={isSubmitting}>
        Continue
      </Button>
    </form>
  )
}
