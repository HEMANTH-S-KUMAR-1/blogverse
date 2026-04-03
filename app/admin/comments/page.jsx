'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAdminCommentsAction, hideCommentAction } from '@/app/actions'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadComments = useCallback(async () => {
    setLoading(true)
    const res = await getAdminCommentsAction()
    if (res.success) {
      setComments(res.comments)
    } else {
      toast.error(res.error || 'Failed to load comments')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => loadComments())
    return () => cancelAnimationFrame(frame)
  }, [loadComments])

  async function handleHide(id) {
    const res = await hideCommentAction(id)
    if (res.success) {
      toast.success('Comment hidden')
      setComments(comments.map(c => c.id === id ? { ...c, is_hidden: 1 } : c))
    } else {
      toast.error(res.error || 'Failed to hide comment')
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading comments...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comment Moderation</h1>
        <button 
          onClick={loadComments}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Post</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Author</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Comment</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">{comment.post_title}</p>
                    <p className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{comment.display_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 max-w-md">{comment.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    {comment.is_hidden ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-tight">
                        Hidden
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-tight">
                        Visible
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!comment.is_hidden && (
                      <button
                        onClick={() => handleHide(comment.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Hide
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comments.length === 0 && (
            <div className="p-12 text-center text-gray-400">No comments found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
