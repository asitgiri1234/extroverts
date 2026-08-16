import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepHeader } from '@/components/ui/StepHeader'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { placeSchema, type PlaceValues } from '@/lib/schemas'
import { citiesIn, collegesIn, stateOptions } from '@/data/locations'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

export function PlaceStep() {
  const profile = useSignupStore((s) => s.profile)
  const patchProfile = useSignupStore((s) => s.patchProfile)
  const next = useSignupStore((s) => s.next)
  const back = useSignupStore((s) => s.back)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PlaceValues>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      state: profile.state,
      city: profile.city,
      college: profile.college,
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const state = watch('state') ?? ''
  const city = watch('city') ?? ''

  const cities = citiesIn(state)
  const colleges = collegesIn(state, city)

  /*
   * Changing a parent clears its dependents. Leaving a stale city selected under
   * a new state is the classic cascade bug — the value looks valid, reads fine
   * to the user, and submits nonsense.
   */
  function handleStateChange(value: string, onChange: (v: string) => void) {
    onChange(value)
    setValue('city', '', { shouldValidate: false })
    setValue('college', '', { shouldValidate: false })
  }

  function handleCityChange(value: string, onChange: (v: string) => void) {
    onChange(value)
    setValue('college', '', { shouldValidate: false })
  }

  function onSubmit(values: PlaceValues) {
    patchProfile(values)
    next()
  }

  function handleBack() {
    patchProfile(getValues())
    back()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col">
      <StepHeader
        step={3}
        total={TOTAL_STEPS}
        title="Where are you?"
        subtitle="Helps us show you parties that are actually nearby."
        onBack={handleBack}
      />

      <div className="mt-8 flex-1 space-y-5">
        <Controller
          control={control}
          name="state"
          render={({ field }) => (
            <Select
              label="State"
              options={stateOptions}
              placeholder="Select your state"
              value={field.value ?? ''}
              onChange={(e) => handleStateChange(e.target.value, field.onChange)}
              onBlur={field.onBlur}
              error={errors.state?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <Select
              label="City"
              options={cities}
              placeholder={state ? 'Select your city' : 'Pick a state first'}
              value={field.value ?? ''}
              onChange={(e) => handleCityChange(e.target.value, field.onChange)}
              onBlur={field.onBlur}
              error={errors.city?.message}
              // Disabled rather than empty, so the dependency is visible.
              disabled={!state || isSubmitting}
              hint={state ? undefined : 'Choose a state to load its cities.'}
            />
          )}
        />

        <Controller
          control={control}
          name="college"
          render={({ field }) => (
            <Select
              label="College"
              options={colleges}
              placeholder={city ? 'Select your college' : 'Pick a city first'}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.college?.message}
              disabled={!city || isSubmitting}
              hint={city ? undefined : 'Choose a city to load its colleges.'}
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
