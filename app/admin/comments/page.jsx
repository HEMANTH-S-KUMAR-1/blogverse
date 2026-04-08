'use client'

import { useState, useEffect } from 'react'
import { adminLoginAction, getAdminCommentsAction, hideCommentAction } from '@/app/actions'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Lock, LogIn, EyeOff, RefreshCw, ArrowLeft } from 'lucide-react'

export default function AdminCommentsPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [logging, setLogging] = useState(false)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  const loadComments = async () => {
    if (!authed) return
    setLoading(true)
    const result = await getAdminCommentsAction()
    if (result.success) setComments(result.comments)
    else toast.error(result.error || 'Failed to load comments')
    setLoading(false)
  }

  useEffect(() => { loadComments() }, [authed]) // eslint-disable-line

  const handleLogin = async (e) => {
    e.preventDefault()
    setLogging(true)
    const { success, error } = await adminLoginAction(password)
    if (success) { setAuthed(true); toast.success('Welcome back!') }
    else toast.error(error || 'Invalid password')
    setLogging(false)
  }

  const handleHide = async (id, content) => {
    if (!confirm(`Hide this comment?\n\n"${content.substring(0, 100)}…"`)) return
    const { success } = await hideCommentAction(id)
    if (success) { toast.success('Comment hidden'); loadComments() }
    else toast.error('Failed to hide comment')
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-6">
            <Lock className="w-7 h-7 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={logging}
              className="w-full py-3 rounded-xl bg-foreground text-background font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {logging ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const visible = filter === 'all' ? comments
    : filter === 'hidden' ? comments.filter(c => c.is_hidden)
    : comments.filter(c => !c.is_hidden)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 rounded-xl border border-border hover:bg-surface transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Comments</h1>
            <p className="text-slate-400 text-sm mt-1">{comments.length} total</p>
          </div>
        </div>
        <button
          onClick={loadComments}
          className="p-2 rounded-xl border border-border hover:bg-surface transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-emerald-500' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 border-b border-border pb-4">
        {['all', 'visible', 'hidden'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f ? 'bg-foreground text-background' : 'text-slate-400 hover:text-foreground hover:bg-surface'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(comment => (
            <div
              key={comment.id}
              className={`rounded-2xl border p-5 transition-all ${
                comment.is_hidden
                  ? 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/5 opacity-60'
                  : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {comment.display_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-sm text-foreground">{comment.display_name}</span>
                    {comment.parent_id && (
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">reply</span>
                    )}
                    {comment.is_hidden && (
                      <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-0.5 rounded">hidden</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {comment.post_title && (
                      <span className="truncate max-w-[200px]">on: <strong>{comment.post_title}</strong></span>
                    )}
                    <span>{new Date(comment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                {!comment.is_hidden && (
                  <button
                    onClick={() => handleHide(comment.id, comment.content)}
                    className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    title="Hide comment"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              No comments to show.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
