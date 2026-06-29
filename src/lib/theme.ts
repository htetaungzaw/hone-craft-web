export type Mode = 'light' | 'dark'

export const COLOR_THEMES = [
  { key: 'caffeine', label: 'Caffeine' },
  { key: 'amethyst-haze', label: 'Amethyst Haze' },
  { key: 'bubblegum', label: 'Bubblegum' },
  { key: 'candyland', label: 'Candyland' },
  { key: 'claude', label: 'Claude' },
  { key: 'claymorphism', label: 'Claymorphism' },
] as const

export type ColorTheme = (typeof COLOR_THEMES)[number]['key']

const MODE_KEY = 'theme'
const COLOR_KEY = 'color-theme'
const DEFAULT_COLOR_THEME: ColorTheme = 'caffeine'

function isColorTheme(value: string | null): value is ColorTheme {
  return COLOR_THEMES.some((theme) => theme.key === value)
}

export function getStoredMode(): Mode | null {
  const value = localStorage.getItem(MODE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

export function getPreferredMode(): Mode {
  return getStoredMode() ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function getPreferredColorTheme(): ColorTheme {
  const stored = localStorage.getItem(COLOR_KEY)
  return isColorTheme(stored) ? stored : DEFAULT_COLOR_THEME
}

export function applyMode(mode: Mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export function applyColorTheme(theme: ColorTheme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function setMode(mode: Mode) {
  localStorage.setItem(MODE_KEY, mode)
  applyMode(mode)
}

export function setColorTheme(theme: ColorTheme) {
  localStorage.setItem(COLOR_KEY, theme)
  applyColorTheme(theme)
}

// Inlined into <head> as a blocking script so both the mode and color theme
// are set before first paint — avoids a flash of the wrong theme on load.
export const themeBootstrapScript = `
(function () {
  try {
    var storedMode = localStorage.getItem('${MODE_KEY}');
    var mode = storedMode === 'light' || storedMode === 'dark'
      ? storedMode
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', mode === 'dark');

    var validColorThemes = ${JSON.stringify(COLOR_THEMES.map((theme) => theme.key))};
    var storedColor = localStorage.getItem('${COLOR_KEY}');
    var color = validColorThemes.indexOf(storedColor) !== -1 ? storedColor : '${DEFAULT_COLOR_THEME}';
    document.documentElement.setAttribute('data-theme', color);
  } catch (e) {}
})();
`
