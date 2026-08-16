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

  /** Travel direction of the last move, so transitions slide the right way. */
  direction: number
  /** Set once submitProfile resolves; gates the success screen. */
  completed: boolean

  acceptTerms: () => void
  markEmailVerified: () => void
  markCompleted: () => void
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
      direction: 1,
      completed: false,
      profile: emptyProfile,

      acceptTerms: () => set({ termsAccepted: true }),
      markEmailVerified: () => set({ emailVerified: true }),
      markCompleted: () => set({ completed: true }),

      patchProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      // Forward jumps are clamped to what the user has actually unlocked, so a
      // pasted URL or a stale history entry cannot skip validation.
      goToStep: (step) =>
        set((s) => {
          const target = Math.min(Math.max(step, 1), Math.min(s.maxStepReached, TOTAL_STEPS))
          return { step: target, direction: target >= s.step ? 1 : -1 }
        }),

      next: () =>
        set((s) => {
          const step = Math.min(s.step + 1, TOTAL_STEPS)
          return { step, maxStepReached: Math.max(s.maxStepReached, step), direction: 1 }
        }),

      back: () => set((s) => ({ step: Math.max(s.step - 1, 1), direction: -1 })),

      reset: () =>
        set({
          termsAccepted: false,
          emailVerified: false,
          maxStepReached: 1,
          step: 1,
          direction: 1,
          completed: false,
          profile: emptyProfile,
        }),
    }),
    {
      name: 'extroverts-signup',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
