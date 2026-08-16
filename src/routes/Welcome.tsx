import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PhoneFrame } from '@/components/layout/PhoneFrame'
import { MeshGradient } from '@/components/backgrounds/MeshGradient'
import { Button } from '@/components/ui/Button'
import { useSignupStore } from '@/store/signupStore'

function CheckBurst() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      className="grid h-24 w-24 place-items-center rounded-full bg-white"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-12 w-12 text-black"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="m5 13 4.5 4.5L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.div>
  )
}

export function Welcome() {
  const navigate = useNavigate()
  const completed = useSignupStore((s) => s.completed)
  const name = useSignupStore((s) => s.profile.name)
  const reset = useSignupStore((s) => s.reset)

  const [leaving, setLeaving] = useState(false)

  // Announce arrival for screen readers, which will not notice the animation.
  useEffect(() => {
    document.title = 'Welcome to Extroverts'
    return () => {
      document.title = 'Extroverts'
    }
  }, [])

  // Reachable only by actually finishing the wizard. `leaving` exempts the one
  // render between clearing the draft and the navigation landing — without it,
  // reset() would trip this guard and bounce the user back into the wizard.
  if (!completed && !leaving) return <Navigate to="/signup" replace />

  const firstName = name.trim().split(/\s+/)[0]

  function enterApp() {
    setLeaving(true)
    // The draft has served its purpose — clear it so a refresh does not drop the
    // user back into a completed wizard.
    reset()
    navigate('/dashboard', { replace: true })
  }

  return (
    <PhoneFrame>
      <div className="relative flex min-h-dvh flex-col">
        <MeshGradient />

        <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
          <CheckBurst />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <p className="mt-8 text-[15px] font-bold tracking-[0.06em] text-white uppercase">
              You're in
            </p>
            <h1 className="mt-2 text-[40px] leading-[1.05] font-extrabold text-white uppercase">
              Welcome{firstName ? `, ${firstName}` : ''}
            </h1>
            <p className="mt-4 text-[15px] leading-snug text-white/85" role="status">
              Your profile is ready. Time to find people worth partying with.
            </p>
          </motion.div>
        </div>

        <div className="relative px-6 pb-10 sm:px-8">
          <Button onClick={enterApp} loading={leaving}>
            Start exploring
          </Button>
        </div>
      </div>
    </PhoneFrame>
  )
}
