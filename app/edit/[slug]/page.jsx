'use client'

export const runtime = 'edge'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, CATEGORY_CONFIG } from '@/lib/supabase'
import Editor from '@/components/Editor'
import toast from 'react-hot-toast'

export default function EditPage({ params }) {
  const router = useRouter()
  const [key, setKey] = useState('')
  const [verified, setVerified] = useState(false)
  const [post, setPost] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [slug, setSlug] = useState('')

  // Unwrap params
  useState(() => {
    params.then(p => setSlug(p.slug))
  })

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!key.trim() || !slug) return
    setVerifying(true)

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      toast.error('Post not found')
    } else if (data.edit_key !== key.trim()) {
      toast.error('Wrong edit key. Please try again.')
    } else {
      setPost(data)
      setTitle(data.title)
      setContent(data.content || '')
      setCategory(data.category)
      setTags((data.tags || []).join(', '))
      setFeaturedImage(data.featured_image_url || '')
      setVerified(true)
      toast.success('Access granted!')
    }
    setVerifying(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!title.trim() || !category) return
    setSubmitting(true)

    const plainText = content.replace(/<[^>]*>/g, '')
    const excerpt = plainText.substring(0, 150).trim()
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5)

    const { error } = await supabase.from('posts').update({
      title: title.trim(),
      content,
      excerpt,
      featured_image_url: featuredImage || null,
      category,
      tags: tagsArray,
    }).eq('id', post.id)

    if (error) {
      toast.error('Failed to update post')
    } else {
      toast.success('Post updated! 🎉')
      router.push(`/post/${slug}`)
    }
    setSubmitting(false)
  }

  if (!verified) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Edit Post</h2>
          <p className="text-sm text-gray-500 mb-1 font-mono">{slug}</p>
          <p className="text-sm text-gray-400 mb-6">Enter your secret edit key to access the editor.</p>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Paste your edit key here"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none mb-4"
              required
              id="edit-key-input"
            />
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
              id="verify-key-btn"
            >
              {verifying ? 'Verifying...' : '🔓 Verify Key'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-8">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white"
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
          required
        >
          {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
            <option key={key} value={key}>{cat.emoji} {cat.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        />
        <input
          type="url"
          value={featuredImage}
          onChange={e => setFeaturedImage(e.target.value)}
          placeholder="Featured image URL"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        />
        <Editor content={content} onUpdate={setContent} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            id="update-post-btn"
          >
            {submitting ? 'Updating...' : '✅ Update Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
