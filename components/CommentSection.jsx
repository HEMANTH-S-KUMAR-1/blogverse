'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000)
  if (seconds < 60) return 'just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function CommentItem({ comment, onReply, replies }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyName, setReplyName] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyName.trim() || !replyContent.trim()) return
    setSubmitting(true)
    await onReply(comment.id, replyName.trim(), replyContent.trim())
    setReplyName('')
    setReplyContent('')
    setShowReplyForm(false)
    setSubmitting(false)
  }

  return (
    <div className="group">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {comment.display_name[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.display_name}</span>
            <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Reply
          </button>

          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3 space-y-2">
              <input
                type="text"
                value={replyName}
                onChange={e => setReplyName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                required
              />
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                required
              />
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50">
                  {submitting ? 'Posting...' : 'Reply'}
                </button>
                <button type="button" onClick={() => setShowReplyForm(false)} className="px-3 py-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Nested replies */}
          {replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-4">
              {replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} replies={[]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (data) setComments(data)
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return
    setSubmitting(true)

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      display_name: name.trim(),
      content: content.trim(),
    })

    if (error) {
      toast.error('Failed to post comment')
    } else {
      toast.success('Comment posted!')
      setContent('')
      fetchComments()
    }
    setSubmitting(false)
  }

  const handleReply = async (parentId, replyName, replyContent) => {
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      display_name: replyName,
      content: replyContent,
      parent_id: parentId,
    })

    if (error) {
      toast.error('Failed to post reply')
    } else {
      toast.success('Reply posted!')
      fetchComments()
    }
  }

  // Build the comment tree once per comments update instead of filtering on every render
  const { topLevel, repliesMap } = useMemo(() => {
    const top = []
    const map = {}
    for (const c of comments) {
      if (!c.parent_id) {
        top.push(c)
      } else {
        if (!map[c.parent_id]) map[c.parent_id] = []
        map[c.parent_id].push(c)
      }
    }
    return { topLevel: top, repliesMap: map }
  }, [comments])
  const getReplies = (parentId) => repliesMap[parentId] || []

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your display name"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm mb-3"
          required
          id="comment-name-input"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none mb-3"
          required
          id="comment-content-input"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          id="post-comment-btn"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {topLevel.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            replies={getReplies(comment.id)}
          />
        ))}
        {topLevel.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  )
}
