import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { Screen, Container } from '@/components/layout/Screen'
import { useSignupStore } from '@/store/signupStore'

export function Terms() {
  const navigate = useNavigate()
  const acceptTerms = useSignupStore((s) => s.acceptTerms)

  function handleAccept() {
    acceptTerms()
    navigate('/signup')
  }

  return (
    <Screen>
      <Container size="md" className="flex min-h-dvh flex-col py-8 sm:py-12">
        <Logo className="text-[38px] text-white sm:text-[44px]" />

        <div className="flex flex-1 items-center py-10">
          {/* Copy is reproduced verbatim from the app's terms screen. */}
          <p className="text-[26px] leading-[1.22] font-extrabold tracking-[-0.005em] text-white uppercase sm:text-[32px] lg:text-[38px]">
            By using this app, you're agreeing to keep things fun, safe, and respectful… and also
            agreeing to our terms and conditions. Politeness is a must—treat others how you'd want
            to be treated. Everyone here is looking for reasons to{' '}
            <span className="text-accent">party</span>, so bring your best vibe and expect the same
            from others. Let's party responsibly and make every experience a great one!
          </p>
        </div>

        <div className="max-w-[440px]">
          <p className="text-[15px] text-fg-muted">
            To proceed, accept{' '}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-white underline-offset-2 hover:underline"
            >
              Terms and Conditions
            </a>
          </p>

          <Button className="mt-4" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </Container>
    </Screen>
  )
}
