'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePostAction } from '@/app/actions'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

/**
 * Shows a "Delete this post" link. When clicked, asks for the edit key.
 * If the key matches, deletes the post and redirects home.
 * This component is always rendered but stays hidden until the user
 * explicitly clicks it — no edit key is leaked in the UI.
 */
export default function DeletePostButton({ slug }) {
  const router = useRouter()
  const [showPrompt, setShowPrompt] = useState(false)
  const [editKey, setEditKey] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!editKey.trim()) return toast.error('Please enter your edit key')
    if (!confirm('Are you sure? This cannot be undone.')) return

    setDeleting(true)
    const { success, error } = await deletePostAction(slug, editKey.trim())

    if (!success) {
      toast.error(error || 'Failed to delete post')
      setDeleting(false)
    } else {
      toast.success('Post deleted')
      router.push('/')
    }
  }

  if (!showPrompt) {
    return (
      <button
        onClick={() => setShowPrompt(true)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mt-2"
        id="delete-post-btn"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete this post
      </button>
    )
  }

  return (
    <div className="mt-2 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
      <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-3">Enter your edit key to delete this post:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={editKey}
          onChange={e => setEditKey(e.target.value)}
          placeholder="Paste your edit key here"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          autoFocus
          id="delete-edit-key-input"
        />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
        <button
          onClick={() => { setShowPrompt(false); setEditKey('') }}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-slate-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
