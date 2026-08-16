import { cn } from '@/lib/cn'

export interface Choice {
  value: string
  label: string
}

interface ChoiceGroupProps {
  label: string
  choices: Choice[]
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  name: string
}

/**
 * Chip-style radio group. Used for pronouns — a short, known option set reads
 * better as tappable chips than as a dropdown, and needs no open/close.
 */
export function ChoiceGroup({
  label,
  choices,
  value,
  onChange,
  error,
  hint,
  name,
}: ChoiceGroupProps) {
  return (
    <fieldset className="w-full">
      <legend className="mb-2 text-[14px] font-medium tracking-wide text-white/85">{label}</legend>

      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => {
          const selected = value === choice.value
          return (
            <label
              key={choice.value}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-2.5 text-[15px] transition-colors',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent',
                selected
                  ? 'border-white bg-white font-semibold text-black'
                  : 'border-line text-white/85 hover:border-line-strong'
              )}
            >
              <input
                type="radio"
                name={name}
                value={choice.value}
                checked={selected}
                onChange={() => onChange(choice.value)}
                className="sr-only"
              />
              {choice.label}
            </label>
          )
        })}
      </div>

      <div className="mt-1.5 min-h-[18px]">
        {error ? (
          <p role="alert" className="text-[13px] leading-tight text-danger">
            {error}
          </p>
        ) : hint ? (
          <p className="text-[13px] leading-tight text-fg-subtle">{hint}</p>
        ) : null}
      </div>
    </fieldset>
  )
}
