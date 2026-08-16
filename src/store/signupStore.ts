import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Wizard state lives here rather than in the form so that going backward keeps
 * every value the user already entered, and a refresh mid-signup does not wipe
 * the flow. Persisted to sessionStorage — deliberately not localStorage, so the
 * data dies with the tab.
 */

export interface ProfileDraft {
  email: string
  name: string
  dob: string
  pronouns: string
  state: string
  city: string
  college: string
}

export const emptyProfile: ProfileDraft = {
  email: '',
  name: '',
  dob: '',
  pronouns: '',
  state: '',
  city: '',
  college: '',
}

interface SignupState {
  termsAccepted: boolean
  emailVerified: boolean
  /** Highest step the user has legitimately unlocked. Guards deep links. */
  maxStepReached: number
  step: number
  profile: ProfileDraft

  acceptTerms: () => void
  markEmailVerified: () => void
  patchProfile: (patch: Partial<ProfileDraft>) => void
  goToStep: (step: number) => void
  next: () => void
  back: () => void
  reset: () => void
}

export const TOTAL_STEPS = 4

export const useSignupStore = create<SignupState>()(
  persist(
    (set) => ({
      termsAccepted: false,
      emailVerified: false,
      maxStepReached: 1,
      step: 1,
      profile: emptyProfile,

      acceptTerms: () => set({ termsAccepted: true }),
      markEmailVerified: () => set({ emailVerified: true }),

      patchProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      // Forward jumps are clamped to what the user has actually unlocked.
      goToStep: (step) =>
        set((s) => ({ step: Math.min(Math.max(step, 1), Math.min(s.maxStepReached, TOTAL_STEPS)) })),

      next: () =>
        set((s) => {
          const step = Math.min(s.step + 1, TOTAL_STEPS)
          return { step, maxStepReached: Math.max(s.maxStepReached, step) }
        }),

      back: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

      reset: () =>
        set({
          termsAccepted: false,
          emailVerified: false,
          maxStepReached: 1,
          step: 1,
          profile: emptyProfile,
        }),
    }),
    {
      name: 'extroverts-signup',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
