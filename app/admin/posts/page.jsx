'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAdminPostsAction, hidePostAction, restorePostAction, adminDeletePostAction, adminLoginAction } from '@/app/actions'
import { CATEGORY_CONFIG } from '@/lib/d1'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Eye, EyeOff, Trash2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 20

export default function AdminPostsPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  // useCallback so it's stable for useEffect deps
  const loadPosts = useCallback(async (p) => {
    setLoading(true)
    const { success, posts: data, total: t } = await getAdminPostsAction({ page: p, limit: PAGE_SIZE })
    if (success) { setPosts(data); setTotal(t) }
    setLoading(false)
  }, [])

  const login = async (e) => {
    e.preventDefault()
    const { success } = await adminLoginAction(password)
    if (success) { setAuthed(true) }
    else toast.error('Wrong password')
  }

  // Load posts when authed or page changes
  useEffect(() => {
    if (!authed) return
    const fetchPosts = async () => {
      await loadPosts(page)
    }
    fetchPosts()
  }, [authed, page, loadPosts])

  const handleHide = async (id) => {
    if (!confirm('Hide this post from public view?')) return
    const { success } = await hidePostAction(id)
    if (success) { toast.success('Post hidden'); loadPosts(page) }
    else toast.error('Failed')
  }

  const handleRestore = async (id) => {
    const { success } = await restorePostAction(id)
    if (success) { toast.success('Post restored'); loadPosts(page) }
    else toast.error('Failed')
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return
    const { success } = await adminDeletePostAction(id)
    if (success) { toast.success('Post deleted'); loadPosts(page) }
    else toast.error('Failed')
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const catColors = {
    health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    student: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    business: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    eco: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">B</div>
            <h1 className="text-2xl font-bold text-foreground">Admin — Posts</h1>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:ring-2 focus:ring-emerald-500 outline-none"
              autoFocus
            />
            <button type="submit" className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors">
              Sign In
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            <Link href="/admin/comments" className="text-emerald-500 hover:underline">← Comments panel</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{total} total posts</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/comments" className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-surface transition-colors">
            Comments
          </Link>
          <Link href="/admin/add-job" className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-surface transition-colors">
            Add Job
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'published', 'hidden'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-emerald-500 text-white'
                : 'border border-border hover:bg-surface text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Title</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden sm:table-cell">Author</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500 hidden sm:table-cell">Views</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(post => (
                <tr key={post.id} className={`hover:bg-surface/50 transition-colors ${post.status === 'hidden' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground line-clamp-1 max-w-[280px]">{post.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${catColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {CATEGORY_CONFIG[post.category]?.label || post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-500">{post.author_display_name || 'Anonymous'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-right text-slate-500">{(post.views || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-surface text-slate-400 hover:text-foreground transition-colors"
                        title="View post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {post.status === 'published' ? (
                        <button
                          onClick={() => handleHide(post.id)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 text-slate-400 hover:text-amber-600 transition-colors"
                          title="Hide post"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(post.id)}
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 text-slate-400 hover:text-green-600 transition-colors"
                          title="Restore post"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No posts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-surface transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-surface transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

