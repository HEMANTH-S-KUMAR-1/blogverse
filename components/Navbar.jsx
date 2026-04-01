'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon, Plus, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Ensure hydration safety by only rendering theme-dependent parts on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-900 bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/25">
              B
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              BlogVerse
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/jobs" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Jobs
            </Link>
            <Link href="/products" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/courses" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Courses
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all active:scale-95 border border-transparent dark:border-zinc-800"
              aria-label="Toggle dark mode"
              id="theme-toggle"
            >
              {!mounted ? (
                <div className="w-5 h-5" />
              ) : isDark ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <Link
              href="/write"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 active:scale-95"
              id="write-post-btn"
            >
              <Plus className="w-4 h-4" />
              Write a Post
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            id="mobile-menu-btn"
          >
            {menuOpen ? <X className="w-6 h-6 text-gray-600 dark:text-zinc-400" /> : <Menu className="w-6 h-6 text-gray-600 dark:text-zinc-400" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-zinc-900 mt-2 pt-4 space-y-2">
            <Link href="/jobs" className="block px-3 py-2 rounded-lg text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900" onClick={() => setMenuOpen(false)}>Jobs</Link>
            <Link href="/products" className="block px-3 py-2 rounded-lg text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link href="/courses" className="block px-3 py-2 rounded-lg text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900" onClick={() => setMenuOpen(false)}>Courses</Link>
            
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-gray-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            
            <Link href="/write" className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20" onClick={() => setMenuOpen(false)}>
              <Plus className="w-5 h-5" />
              Write a Post
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
