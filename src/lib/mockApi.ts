import type { ProfileDraft } from '@/store/signupStore'

/**
 * Simulated network layer.
 *
 * This is a front-end-only exercise, so nothing here talks to a server: no mail
 * is sent, no code is generated, no session is issued. Each function resolves or
 * rejects after a realistic delay so the UI can exercise every state the brief
 * asks for — pending spinners, field-level errors, global alerts and retries.
 *
 * The triggers below are DELIBERATE. They exist so failure paths can be
 * demonstrated on demand; they are documented in the README and surfaced in the
 * UI as demo hints so a reviewer can reach them without guessing.
 */

/** The one OTP that verifies. Exported so hint copy can never drift from the logic. */
export const DEMO_OTP = '123456'

/** Substring in an email that forces "account already exists". */
export const TRIGGER_TAKEN = 'taken'

/** Substring in an email that forces a network failure. */
export const TRIGGER_FAIL = 'fail'

export const OTP_LENGTH = 6
export const RESEND_COOLDOWN_SECONDS = 30
export const MAX_OTP_ATTEMPTS = 5

export type ApiErrorCode =
  | 'EMAIL_TAKEN'
  | 'INVALID_CODE'
  | 'TOO_MANY_ATTEMPTS'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  /** True when retrying the same input could plausibly succeed. */
  readonly retryable: boolean
  /** Field to attach the message to, when it belongs beneath an input. */
  readonly field?: keyof ProfileDraft | 'otp'

  constructor(
    code: ApiErrorCode,
    message: string,
    options: { retryable?: boolean; field?: keyof ProfileDraft | 'otp' } = {}
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.retryable = options.retryable ?? false
    this.field = options.field
  }
}

/** Realistic, slightly variable latency — a fixed delay reads as fake. */
function latency(min = 800, max = 1500): Promise<void> {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalise(email: string): string {
  return email.trim().toLowerCase()
}

function assertReachable(email: string): void {
  if (normalise(email).includes(TRIGGER_FAIL)) {
    throw new ApiError('NETWORK_ERROR', "Couldn't reach the server. Check your connection.", {
      retryable: true,
    })
  }
}

/** Wrong-code attempts per email, so the lockout survives re-renders. */
const attempts = new Map<string, number>()

export interface OtpRequestResult {
  email: string
  resendAfterSeconds: number
  /** Present only in demo builds — the UI shows it so the flow is reachable. */
  demoCode: string
}

/**
 * Step 1 submit: checks whether the address is free, then "sends" a code.
 * Modelled as one call because that is what the UI needs; a real backend would
 * likely do the same to avoid leaking which addresses are registered.
 */
export async function requestOtp(email: string): Promise<OtpRequestResult> {
  await latency()
  assertReachable(email)

  if (normalise(email).includes(TRIGGER_TAKEN)) {
    throw new ApiError('EMAIL_TAKEN', 'An account with this email already exists.', {
      field: 'email',
    })
  }

  attempts.delete(normalise(email))

  return {
    email: normalise(email),
    resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
    demoCode: DEMO_OTP,
  }
}

export async function resendOtp(email: string): Promise<OtpRequestResult> {
  await latency(600, 1100)
  assertReachable(email)

  // Resending clears the attempt counter, matching how most providers behave.
  attempts.delete(normalise(email))

  return {
    email: normalise(email),
    resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
    demoCode: DEMO_OTP,
  }
}

export interface VerifyResult {
  email: string
  verifiedAt: number
}

export async function verifyOtp(email: string, code: string): Promise<VerifyResult> {
  await latency(700, 1300)
  assertReachable(email)

  const key = normalise(email)
  const used = attempts.get(key) ?? 0

  if (used >= MAX_OTP_ATTEMPTS) {
    throw new ApiError('TOO_MANY_ATTEMPTS', 'Too many incorrect attempts. Request a new code.', {
      field: 'otp',
    })
  }

  if (code.trim() !== DEMO_OTP) {
    const next = used + 1
    attempts.set(key, next)
    const left = MAX_OTP_ATTEMPTS - next

    throw new ApiError(
      'INVALID_CODE',
      left > 0
        ? `That code isn't right. ${left} attempt${left === 1 ? '' : 's'} left.`
        : 'Too many incorrect attempts. Request a new code.',
      { field: 'otp' }
    )
  }

  attempts.delete(key)
  return { email: key, verifiedAt: Date.now() }
}

export interface SubmitResult {
  userId: string
  memberSince: string
}

export async function submitProfile(profile: ProfileDraft): Promise<SubmitResult> {
  await latency(1000, 1800)
  assertReachable(profile.email)

  return {
    userId: `usr_${Math.random().toString(36).slice(2, 10)}`,
    memberSince: new Date().toISOString(),
  }
}

/** Narrowing helper so callers can separate expected failures from real bugs. */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
