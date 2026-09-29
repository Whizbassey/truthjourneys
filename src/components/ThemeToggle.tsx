'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function storedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem('logos-theme')
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

export function ThemeToggle() {
  // Render nothing theme-specific until mounted: the server cannot know which
  // theme the browser resolved, and guessing produces a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(storedTheme() ?? systemTheme())
  }, [])

  // Keep following the OS while the reader has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      if (!storedTheme()) setTheme(media.matches ? 'light' : 'dark')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('logos-theme', next)
    } catch {
      /* Nothing to do — the choice just will not survive a reload. */
    }
  }

  const label = theme === 'light' ? 'Lamplight' : 'Parchment'

  return (
    <button
      type="button"
      className="masthead__toggle"
      onClick={toggle}
      aria-label={
        theme === null
          ? 'Switch theme'
          : `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`
      }
      title="Switch theme"
    >
      <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
      <span>{theme === null ? '' : label}</span>
    </button>
  )
}
