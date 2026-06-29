import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { applyMode, getPreferredMode, setMode, type Mode } from '../lib/theme'
import { Button } from './ui/button'

export function ThemeToggle() {
  const [mode, setModeState] = useState<Mode | null>(null)

  useEffect(() => {
    const preferred = getPreferredMode()
    applyMode(preferred)
    setModeState(preferred)
  }, [])

  if (!mode) {
    // Avoid rendering the wrong icon before we know the real mode client-side.
    return <div className="size-9" aria-hidden="true" />
  }

  const next = mode === 'dark' ? 'light' : 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        setMode(next)
        setModeState(next)
      }}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="rounded-full"
    >
      {mode === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
