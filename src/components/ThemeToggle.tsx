import { useEffect, useState } from 'react'
import { applyTheme, getPreferredTheme, setTheme, type Theme } from '../lib/theme'

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null)

  useEffect(() => {
    const preferred = getPreferredTheme()
    applyTheme(preferred)
    setThemeState(preferred)
  }, [])

  if (!theme) {
    // Avoid rendering the wrong icon before we know the real theme client-side.
    return <div className="h-9 w-9" aria-hidden="true" />
  }

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(next)
        setThemeState(next)
      }}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
        </svg>
      )}
    </button>
  )
}
