'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CATEGORY_CONFIG, safeImageUrl } from '@/lib/d1'
import { verifyEditKey, updatePostAction } from '@/app/actions'
import Editor from '@/components/Editor'
import toast from 'react-hot-toast'
import { Lock, ArrowLeft } from 'lucide-react'

export default function EditPostPage({ params }) {
  const router = useRouter()
  const [step, setStep] = useState('verify') // 'verify' | 'edit'
  const [editKey, setEditKey] = useState('')
  const [post, setPost] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [saving, setSaving] = useState(false)

  // Editable fields
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!editKey.trim()) return toast.error('Please enter your edit key')
    setVerifying(true)

    // slug comes from URL params – awaited in newer Next.js
    const slug = typeof params === 'object' && params.slug ? params.slug
      : window.location.pathname.split('/').pop()

    const { success, post: postData, error } = await verifyEditKey(slug, editKey.trim())

    if (!success) {
      toast.error(error || 'Invalid edit key')
      setVerifying(false)
      return
    }

    // Populate form with current values
    setPost(postData)
    setTitle(postData.title || '')
    setContent(postData.content || '')
    setExcerpt(postData.excerpt || '')
    setFeaturedImage(postData.featured_image_url || '')
    setAvatarUrl(postData.author_avatar_url || '')
    setCategory(postData.category || '')

    // Parse tags back to comma-separated string
    let tagsStr = ''
    try {
      const arr = JSON.parse(postData.tags || '[]')
      tagsStr = Array.isArray(arr) ? arr.join(', ') : ''
    } catch { tagsStr = postData.tags || '' }
    setTags(tagsStr)

    setStep('edit')
    setVerifying(false)
    toast.success('Edit key verified!')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!post) return
    if (!title.trim()) return toast.error('Title cannot be empty')
    if (!content || content === '<p></p>') return toast.error('Content cannot be empty')

    setSaving(true)
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5)

    const { success, error } = await updatePostAction({
      id: post.id,
      slug: post.slug,
      title: title.trim(),
      content,
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 150),
      featured_image_url: featuredImage || null,
      author_avatar_url: avatarUrl || null,
      category,
      tags: tagsArray,
    })

    if (!success) {
      toast.error(error || 'Failed to save changes')
    } else {
      toast.success('Post updated!')
      router.push(`/post/${post.slug}`)
    }
    setSaving(false)
  }

  // ── Step 1: Verify Edit Key ────────────────────────────────
  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-400 hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-6">
            <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Edit Your Post</h1>
          <p className="text-sm text-slate-400 text-center mb-8">
            Enter the edit key you received when you published this post.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Edit Key</label>
              <input
                type="text"
                value={editKey}
                onChange={e => setEditKey(e.target.value)}
                placeholder="Paste your edit key here"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                autoFocus
                id="edit-key-verify-input"
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {verifying ? 'Verifying…' : 'Verify & Edit Post'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Step 2: Edit Form ──────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
        <button onClick={() => router.push(`/post/${post.slug}`)} className="text-sm text-slate-400 hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-foreground"
          required
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
          >
            {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
              <option key={key} value={key}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. productivity, tips, beginners"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image URL</label>
          <input
            type="url"
            value={featuredImage}
            onChange={e => setFeaturedImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
          {featuredImage && (
            <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
              <Image src={featuredImage} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Avatar URL */}
        {post?.identity_mode !== 'anonymous' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
            {safeImageUrl(avatarUrl) && (
              <div className="flex items-center gap-3 mt-2">
                <Image
                  src={safeImageUrl(avatarUrl)}
                  alt="Avatar preview"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-border"
                />
                <span className="text-xs text-slate-400">Avatar preview</span>
              </div>
            )}
          </div>
        )}

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
          <Editor content={content} onUpdate={setContent} />
        </div>

        {/* Submit */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-border -mx-4 px-4 py-4 flex items-center justify-between gap-4">
          <span className="text-sm text-slate-400">
            ~{Math.max(1, Math.ceil((content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length) / 200))} min read
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
