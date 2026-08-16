import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StepTransitionProps {
  /** Changing this key drives the swap. */
  stepKey: number | string
  /** 1 = moving forward, -1 = moving back. Slide follows travel direction. */
  direction: number
  children: ReactNode
}

export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  return (
    // `mode="popLayout"` keeps the outgoing step out of flow, so the incoming one
    // does not get pushed down the page mid-transition.
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
        transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
