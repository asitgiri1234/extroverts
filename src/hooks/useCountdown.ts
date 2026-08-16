import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Counts down in whole seconds from a deadline rather than by decrementing on a
 * tick — an interval that gets throttled in a background tab would otherwise
 * drift, and the resend link would unlock late.
 */
export function useCountdown(initialSeconds = 0) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const deadline = useRef<number | null>(
    initialSeconds > 0 ? Date.now() + initialSeconds * 1000 : null
  )

  const start = useCallback((seconds: number) => {
    deadline.current = Date.now() + seconds * 1000
    setRemaining(seconds)
  }, [])

  const clear = useCallback(() => {
    deadline.current = null
    setRemaining(0)
  }, [])

  useEffect(() => {
    if (remaining <= 0) return

    const id = setInterval(() => {
      if (deadline.current === null) return
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) deadline.current = null
    }, 250)

    return () => clearInterval(id)
  }, [remaining])

  return { remaining, start, clear, isRunning: remaining > 0 }
}
