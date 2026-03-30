'use client'

import toast from 'react-hot-toast'
import Link from 'next/link'

export default function TipButton({ authorName, upiId, kofiLink }) {
  const copyUpi = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId)
      toast.success('UPI ID copied!')
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
          {(authorName || 'A')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Support {authorName || 'this writer'}</p>
          <p className="text-xs text-gray-500">Your support helps them keep writing</p>
        </div>
      </div>

      <div className="space-y-3">
        {kofiLink && (
          <a
            href={kofiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-medium transition-colors"
          >
            ☕ Support on Ko-fi
          </a>
        )}

        {upiId && (
          <button
            onClick={copyUpi}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
          >
            <span className="text-gray-500">UPI:</span>
            <span className="font-mono text-gray-900 dark:text-white">{upiId}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </button>
        )}

        <Link
          href="/support"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        >
          💚 Support BlogVerse
        </Link>
      </div>
    </div>
  )
}
