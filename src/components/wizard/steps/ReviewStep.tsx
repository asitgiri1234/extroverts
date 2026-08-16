import { useState } from 'react'
import { toast } from 'sonner'
import { StepHeader } from '@/components/ui/StepHeader'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ageOn } from '@/lib/age'
import { isApiError, submitProfile, TRIGGER_FAIL } from '@/lib/mockApi'
import { PRONOUN_CHOICES } from '@/data/pronouns'
import { TOTAL_STEPS, useSignupStore } from '@/store/signupStore'

/** ISO → the DD/MM/YYYY the user actually typed. */
function formatDob(iso: string): string {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${d}/${m}/${y}` : '—'
}

function pronounLabel(value: string): string {
  return PRONOUN_CHOICES.find((c) => c.value === value)?.label ?? value ?? '—'
}

interface Row {
  label: string
  value: string
}

function SummaryCard({
  title,
  rows,
  onEdit,
  note,
}: {
  title: string
  rows: Row[]
  onEdit: () => void
  note?: string
}) {
  return (
    <section className="rounded-[var(--radius-field)] border border-line bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-semibold tracking-[0.1em] text-fg-muted uppercase">
          {title}
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[14px] font-semibold text-white underline underline-offset-2 hover:opacity-80"
        >
          Edit
        </button>
      </div>

      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-[14px] text-fg-muted">{row.label}</dt>
            <dd className="min-w-0 truncate text-right text-[15px] font-medium text-white">
              {row.value || '—'}
            </dd>
          </div>
        ))}
      </dl>

      {note && <p className="mt-3 text-[12px] leading-snug text-fg-subtle">{note}</p>}
    </section>
  )
}

export function ReviewStep() {
  const profile = useSignupStore((s) => s.profile)
  const goToStep = useSignupStore((s) => s.goToStep)
  const back = useSignupStore((s) => s.back)
  const setOtpSent = useSignupStore((s) => s.setOtpSent)
  const markCompleted = useSignupStore((s) => s.markCompleted)

  const [submitting, setSubmitting] = useState(false)
  const [stepError, setStepError] = useState<string | null>(null)

  const age = profile.dob ? ageOn(profile.dob) : null

  /*
   * Editing the address invalidates the verification that was done against it —
   * so send the user back to the email pane rather than silently keeping a
   * "verified" flag that no longer refers to the address on file.
   */
  function editEmail() {
    setOtpSent(false)
    goToStep(1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setStepError(null)

    try {
      await submitProfile(profile)
      markCompleted()
      toast.success('Profile created')
    } catch (error) {
      if (!isApiError(error)) throw error
      setStepError(error.message)
      toast.error("Couldn't create your profile", { description: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <StepHeader
        step={4}
        total={TOTAL_STEPS}
        title="Check everything over"
        subtitle="Fix anything that looks wrong before you finish."
        onBack={back}
      />

      <div className="mt-8 flex-1 space-y-3">
        <SummaryCard
          title="Account"
          onEdit={editEmail}
          rows={[{ label: 'Email', value: profile.email }]}
          note="Changing your email means verifying it again."
        />

        <SummaryCard
          title="About you"
          onEdit={() => goToStep(2)}
          rows={[
            { label: 'Name', value: profile.name },
            {
              label: 'Date of birth',
              value: profile.dob ? `${formatDob(profile.dob)}${age !== null ? ` · ${age}` : ''}` : '',
            },
            { label: 'Pronouns', value: pronounLabel(profile.pronouns) },
          ]}
        />

        <SummaryCard
          title="Where you are"
          onEdit={() => goToStep(3)}
          rows={[
            { label: 'State', value: profile.state },
            { label: 'City', value: profile.city },
            { label: 'College', value: profile.college },
          ]}
        />

        {stepError && (
          <Alert
            action={
              <button
                type="button"
                onClick={handleSubmit}
                className="shrink-0 text-[14px] font-semibold text-white underline underline-offset-2"
              >
                Retry
              </button>
            }
          >
            {stepError}
          </Alert>
        )}

        <p className="px-1 pt-2 text-[12px] leading-snug text-fg-subtle">
          Use an address containing{' '}
          <span className="font-semibold text-fg-muted">{TRIGGER_FAIL}</span> to see the failure
          path here.
        </p>
      </div>

      <Button className="mt-4" onClick={handleSubmit} loading={submitting}>
        Create my account
      </Button>
    </div>
  )
}
