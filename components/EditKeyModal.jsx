'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function EditKeyModal({ editKey, onClose }) {
  const [copied, setCopied] = useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(editKey)
    setCopied(true)
    toast.success('Edit key copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Edit Key</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Save this key to edit or delete your post later.
          </p>
        </div>

        {/* Key Display */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
          <code className="block text-center text-lg font-mono text-gray-900 dark:text-white break-all select-all">
            {editKey}
          </code>
        </div>

        {/* Copy Button */}
        <button
          onClick={copyKey}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          id="copy-edit-key-btn"
        >
          {copied ? '✓ Copied!' : '📋 Copy Edit Key'}
        </button>

        {/* Warning */}
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400 text-center leading-relaxed">
            ⚠️ <strong>Save this key now.</strong> You cannot edit or delete your post without it. We do not store this key anywhere. This is the only time it will be shown.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          id="close-edit-key-modal"
        >
          I&apos;ve saved my key — Close
        </button>
      </div>
    </div>
  )
}
