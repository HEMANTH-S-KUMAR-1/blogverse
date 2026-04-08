'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminLoginAction, getAdminPostsAction, hidePostAction, restorePostAction, adminDeletePostAction } from '@/app/actions'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Eye, EyeOff, Trash2, Lock, LogIn, RefreshCw } from 'lucide-react'

export default function AdminPostsPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [logging, setLogging] = useState(false)
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all') // 'all' | 'published' | 'hidden'
  const LIMIT = 20

  const loadPosts = useCallback(async () => {
    if (!authed) return
    setLoading(true)
    const result = await getAdminPostsAction({ page, limit: LIMIT })
    if (result.success) {
      setPosts(result.posts)
      setTotal(result.total)
    }
    setLoading(false)
  }, [authed, page])

  useEffect(() => { loadPosts() }, [authed, page]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e) => {
    e.preventDefault()
    setLogging(true)
    const { success, error } = await adminLoginAction(password)
    if (success) { setAuthed(true); toast.success('Welcome back!') }
    else toast.error(error || 'Invalid password')
    setLogging(false)
  }

  const handleHide = async (id, title) => {
    if (!confirm(`Hide "${title}"?`)) return
    const { success } = await hidePostAction(id)
    if (success) { toast.success('Post hidden'); loadPosts() }
    else toast.error('Failed to hide post')
  }

  const handleRestore = async (id, title) => {
    if (!confirm(`Restore "${title}"?`)) return
    const { success } = await restorePostAction(id)
    if (success) { toast.success('Post restored'); loadPosts() }
    else toast.error('Failed to restore post')
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return
    const { success } = await adminDeletePostAction(id)
    if (success) { toast.success('Post deleted'); loadPosts() }
    else toast.error('Failed to delete post')
  }

  // ── Login screen ────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-6">
            <Lock className="w-7 h-7 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Admin Access</h1>
          <p className="text-sm text-center text-slate-400 mb-8">BlogVerse admin panel</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              autoFocus
              id="admin-password-input"
            />
            <button
              type="submit"
              disabled={logging}
              className="w-full py-3 rounded-xl bg-foreground text-background font-bold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {logging ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Filter posts client-side ────────────────────────────────
  const filteredPosts = filter === 'all' ? posts
    : posts.filter(p => p.status === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-slate-400 text-sm mt-1">{total} total posts</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/comments" className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-surface transition-colors">
            Comments
          </Link>
          <button
            onClick={loadPosts}
            className="p-2 rounded-xl border border-border hover:bg-surface transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-emerald-500' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-border pb-4">
        {['all', 'published', 'hidden'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-foreground text-background'
                : 'text-slate-400 hover:text-foreground hover:bg-surface'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 text-xs opacity-60">
              {f === 'all' ? posts.length : posts.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Posts table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 hidden sm:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/post/${post.slug}`}
                      target="_blank"
                      className="font-medium text-foreground hover:text-emerald-500 transition-colors line-clamp-1 max-w-[200px] block"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">
                    {post.author_display_name || 'Anonymous'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs capitalize">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                    {post.views?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                    {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {post.status === 'published' ? (
                        <button
                          onClick={() => handleHide(post.id, post.title)}
                          className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/20 text-slate-400 hover:text-amber-600 transition-colors"
                          title="Hide post"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(post.id, post.title)}
                          className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Restore post"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-400">
            Page {page} of {Math.ceil(total / LIMIT)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-surface transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / LIMIT)}
              className="px-4 py-2 rounded-xl border border-border text-sm disabled:opacity-40 hover:bg-surface transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
