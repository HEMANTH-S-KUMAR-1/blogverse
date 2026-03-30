'use client'

import { useEffect, useState, createContext, useContext } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  resolvedTheme: 'light',
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children, attribute = 'class', defaultTheme = 'system', enableSystem = true }) {
  const [theme, setThemeState] = useState(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      setThemeState(stored)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let resolved = theme
    if (theme === 'system' && enableSystem) {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    setResolvedTheme(resolved)

    const root = document.documentElement
    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    } else {
      root.setAttribute(attribute, resolved)
    }

    localStorage.setItem('theme', theme)
  }, [theme, mounted, attribute, enableSystem])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      const root = document.documentElement
      if (attribute === 'class') {
        root.classList.remove('light', 'dark')
        root.classList.add(resolved)
      }
    }

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, attribute, enableSystem])

  const setTheme = (t) => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
