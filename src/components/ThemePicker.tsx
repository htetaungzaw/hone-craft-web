import { Palette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  applyColorTheme,
  COLOR_THEMES,
  getPreferredColorTheme,
  getPreferredMode,
  setColorTheme,
  type ColorTheme,
} from '../lib/theme'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

export function ThemePicker() {
  const [theme, setThemeState] = useState<ColorTheme | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preferred = getPreferredColorTheme()
    applyColorTheme(preferred)
    setThemeState(preferred)
    setIsDark(getPreferredMode() === 'dark')
  }, [])

  useEffect(() => {
    if (!open) return
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!theme) {
    // Avoid rendering before we know the real theme client-side.
    return <div className="size-9" aria-hidden="true" />
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen((value) => !value)}
        aria-label="Choose color theme"
        title="Choose color theme"
        aria-expanded={open}
        className="rounded-full"
      >
        <Palette />
      </Button>

      {open && (
        <div className="bg-popover text-popover-foreground border-border absolute right-0 mt-2 w-48 rounded-xl border p-1.5 shadow-lg">
          {COLOR_THEMES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setColorTheme(key)
                setThemeState(key)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition',
                key === theme ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60',
              )}
            >
              <span
                aria-hidden="true"
                data-theme={key}
                className={cn('grid grid-cols-2 gap-0.5 shrink-0', isDark && 'dark')}
              >
                <span className="bg-primary size-1.5 rounded-[2px]" />
                <span className="bg-secondary size-1.5 rounded-[2px]" />
                <span className="bg-accent size-1.5 rounded-[2px]" />
                <span className="bg-border size-1.5 rounded-[2px]" />
              </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
