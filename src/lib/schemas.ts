import { z } from 'zod'
import { checkDob, DOB_MESSAGES } from './age'

export const NAME_MAX = 40

/**
 * Per-step schemas. Kept separate rather than as one big object so each step can
 * validate in isolation — the wizard must never block step 2 on a field that
 * lives in step 3.
 */

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    // Deliberately stricter than z.email(): requires a dotted TLD, so typos like
    // "asit@gmail" are caught here rather than by the simulated server.
    .regex(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, 'Enter a valid email address.'),
})

export const identitySchema = z.object({
  name: z
    .string()
    // Whitespace-only must fail, so trim before measuring.
    .trim()
    .min(2, 'Enter your name (at least 2 characters).')
    .max(NAME_MAX, `Keep it under ${NAME_MAX} characters.`)
    .regex(/^[\p{L}\p{M}'\-. ]+$/u, 'Letters, spaces, hyphens and apostrophes only.'),

  dob: z
    .string()
    .min(1, 'Date of birth is required.')
    .superRefine((value, ctx) => {
      const problem = checkDob(value)
      if (problem) {
        ctx.addIssue({ code: 'custom', message: DOB_MESSAGES[problem] })
      }
    }),

  pronouns: z.string().min(1, 'Pick your pronouns.'),
})

export const placeSchema = z.object({
  state: z.string().min(1, 'Select your state.'),
  city: z.string().min(1, 'Select your city.'),
  college: z.string().min(1, 'Select your college.'),
})

export type EmailValues = z.infer<typeof emailSchema>
export type IdentityValues = z.infer<typeof identitySchema>
export type PlaceValues = z.infer<typeof placeSchema>
