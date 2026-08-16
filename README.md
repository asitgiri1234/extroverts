# Extroverts — Signup Wizard (web replication)

A front-end replication of the signup flow from the **Extroverts** Android app
([Play Store](https://play.google.com/store/apps/details?id=com.pro.nubpack)), built as a
responsive web app.

Front-end only — there is no backend. Network calls are simulated by a mock API layer.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Forms + validation | react-hook-form + zod |
| Wizard state | zustand, persisted to `sessionStorage` |
| Toasts | sonner |
| Transitions | framer-motion |
| Type | Poppins, self-hosted via `@fontsource/poppins` |

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
```

## Design tokens

Colours were sampled from the reference screenshots rather than eyeballed — the raw pixel
values are in `src/index.css` under `@theme`:

| Token | Value | How it was derived |
| --- | --- | --- |
| Background | `#000000` | Uniform across the terms screen |
| Accent (`PARTY` violet) | `#A84EFD` | Most-saturated glyph pixels in the terms screenshot |
| Danger (`Warning:` red) | `#E5484D` | Sampled at `#E67A80`; JPEG chroma subsampling desaturates small text, so the design value is used |

## Status

- [x] Project scaffold, design tokens, `Button` / `Spinner` primitives
- [x] Landing screen — CSS mesh gradient, no bitmap
- [x] Terms screen — copy reproduced verbatim, accept-gated
- [x] Wizard store — step guard, back navigation, `sessionStorage` persistence
- [ ] Mock API layer
- [ ] Step 1 — email + OTP
- [ ] Steps 2–4 — name / DOB / pronouns, state → city → college cascade
- [ ] Success + permissions screens

## Deliberate failure triggers

Once the mock API lands, these inputs will force specific failure paths so error handling can be
demonstrated. **They are intentional, not bugs.**

| Input | Result |
| --- | --- |
| OTP other than `123456` | Invalid code — field shakes and clears |
| Email containing `taken` | "An account with this email already exists" |
| Email containing `fail` | Simulated network error + retry affordance |

## Improvements over the original

The brief asks for more than a literal copy. Planned deviations, each deliberate:

- **OTP screen** — six discrete inputs with auto-advance, backspace-to-previous, full paste
  support, `autocomplete="one-time-code"`, a resend countdown, and auto-submit on the sixth digit.
  The original is a single plain field.
- **Age gate** — collects date of birth and computes age client-side, blocking under-18 with a
  specific message rather than a generic required-field error.
- **Back navigation** — entered values survive going backward, and forward jumps into steps the
  user has not unlocked are clamped.

## Layout note

The reference is a phone app. Rather than stretching a 4-step signup across a desktop viewport,
screens are authored at phone width and centred on a black field above the `sm` breakpoint. This
keeps visual parity with the app while staying fully functional on every viewport.
