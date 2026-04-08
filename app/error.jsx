'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('BlogVerse error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h2 className="text-2xl font-extrabold text-foreground mb-3">Something went wrong</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10">
        An unexpected error occurred. You can try again or go back to the homepage.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-500/20"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 rounded-2xl border border-border bg-surface font-bold hover:border-emerald-400 transition-colors"
        >
          ← Back Home
        </Link>
      </div>
    </div>
  )
}
