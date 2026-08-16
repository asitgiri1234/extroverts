import type { Choice } from '@/components/ui/ChoiceGroup'

/**
 * Short, known option set — chips rather than a dropdown, so it needs no
 * open/close and every option is visible at once.
 */
export const PRONOUN_CHOICES: Choice[] = [
  { value: 'she/her', label: 'She / Her' },
  { value: 'he/him', label: 'He / Him' },
  { value: 'they/them', label: 'They / Them' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]
