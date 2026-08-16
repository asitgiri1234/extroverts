export const MIN_AGE = 18

/** Oldest plausible birth date — anything earlier is a typo, not a person. */
export const MAX_AGE = 120

/**
 * Exact age in whole years, accounting for whether the birthday has already
 * happened this year. `new Date().getFullYear() - birthYear` is off by one for
 * roughly half the population, which is precisely the bug that lets a 17-year-old
 * through an age gate.
 */
export function ageOn(birthISO: string, today: Date = new Date()): number | null {
  const birth = parseISODate(birthISO)
  if (!birth) return null

  let age = today.getFullYear() - birth.getFullYear()
  const monthDelta = today.getMonth() - birth.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

/**
 * Strict `YYYY-MM-DD` parse. `new Date('2026-02-30')` silently rolls over to
 * 2 March, so round-trip the components and reject anything that shifted.
 */
export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [, y, m, d] = match
  const year = Number(y)
  const month = Number(m)
  const day = Number(d)

  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export type DobProblem = 'invalid' | 'future' | 'too-young' | 'implausible'

export function checkDob(value: string, today: Date = new Date()): DobProblem | null {
  const date = parseISODate(value)
  if (!date) return 'invalid'
  if (date.getTime() > today.getTime()) return 'future'

  const age = ageOn(value, today)
  if (age === null) return 'invalid'
  if (age > MAX_AGE) return 'implausible'
  if (age < MIN_AGE) return 'too-young'
  return null
}

export const DOB_MESSAGES: Record<DobProblem, string> = {
  invalid: 'Enter a valid date of birth.',
  future: "That date hasn't happened yet.",
  // Specific, not a generic required-field error — the brief calls this out.
  'too-young': `You must be ${MIN_AGE} or older to create an account.`,
  implausible: 'Check the year — that date looks unlikely.',
}
