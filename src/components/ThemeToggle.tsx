import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { applyTheme, getPreferredTheme, setTheme, type Theme } from '../lib/theme'
import { Button } from './ui/button'

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null)

  useEffect(() => {
    const preferred = getPreferredTheme()
    applyTheme(preferred)
    setThemeState(preferred)
  }, [])

  if (!theme) {
    // Avoid rendering the wrong icon before we know the real theme client-side.
    return <div className="size-9" aria-hidden="true" />
  }

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        setTheme(next)
        setThemeState(next)
      }}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="rounded-full"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
