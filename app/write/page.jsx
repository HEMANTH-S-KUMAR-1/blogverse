'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_CONFIG, safeImageUrl } from '@/lib/d1'
import { createPost } from '@/app/actions'
import Editor from '@/components/Editor'
import EditKeyModal from '@/components/EditKeyModal'
import { Turnstile } from '@marsidev/react-turnstile'
import toast from 'react-hot-toast'
import slugify from 'slugify'

export default function WritePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [identityMode, setIdentityMode] = useState('anonymous')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [upiId, setUpiId] = useState('')
  const [kofiLink, setKofiLink] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editKey, setEditKey] = useState(null)
  const [postSlug, setPostSlug] = useState(null)
  const [turnstileToken, setTurnstileToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Please enter a title')
    if (!category) return toast.error('Please select a category')
    if (!content || content === '<p></p>') return toast.error('Please write some content')
    
    // In dev, we might not have a token. Production requires it.
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      return toast.error('Please complete the security check')
    }

    setSubmitting(true)

    const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString(36)
    const plainText = content.replace(/<[^>]*>/g, '')
    const excerpt = plainText.substring(0, 150).trim()
    const authorName = identityMode === 'anonymous' ? 'Anonymous'
      : identityMode === 'pseudonym' ? (displayName || 'Anonymous')
      : (displayName || 'Anonymous')

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5)

    const postData = {
      title: title.trim(),
      slug,
      content,
      excerpt,
      featured_image_url: featuredImage || null,
      author_display_name: authorName,
      author_bio: bio || null,
      author_upi_id: upiId || null,
      author_kofi_link: kofiLink || null,
      identity_mode: identityMode,
      author_avatar_url: identityMode !== 'anonymous' ? (avatarUrl || null) : null,
      category,
      tags: tagsArray,
    }

    const { success, error, edit_key, slug: returnedSlug } = await createPost(postData, turnstileToken)

    if (!success) {
      toast.error('Failed to publish post. Please try again.')
      console.error(error)
    } else {
      setEditKey(edit_key)
      setPostSlug(returnedSlug)
      toast.success('Post published! 🎉')
    }
    setSubmitting(false)
  }

  const handleModalClose = () => {
    setEditKey(null)
    if (postSlug) router.push(`/post/${postSlug}`)
  }

  const identityCards = [
    { mode: 'anonymous', icon: '👤', label: 'Anonymous', desc: 'Post without any name' },
    { mode: 'pseudonym', icon: '✍️', label: 'Pseudonym', desc: 'Use a pen name' },
    { mode: 'public', icon: '🌐', label: 'Public', desc: 'Show your real identity' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Write a Post</h1>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Your post title..."
          className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-white"
          required
          id="post-title-input"
        />

        {/* Identity Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">How would you like to appear?</label>
          <div className="grid grid-cols-3 gap-3">
            {identityCards.map(card => (
              <button
                key={card.mode}
                type="button"
                onClick={() => setIdentityMode(card.mode)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  identityMode === card.mode
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-2xl block mb-1">{card.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{card.label}</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">{card.desc}</span>
              </button>
            ))}
          </div>

          {/* Conditional fields */}
          {identityMode !== 'anonymous' && (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={identityMode === 'pseudonym' ? 'Your pen name' : 'Your real name'}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                id="display-name-input"
              />
              <input
                type="url"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="Avatar image URL (optional)"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                id="avatar-url-input"
              />
              {safeImageUrl(avatarUrl) && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={safeImageUrl(avatarUrl)} alt="Avatar preview" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                  <span className="text-xs text-gray-400">Avatar preview</span>
                </div>
              )}
              {identityMode === 'public' && (
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="A short bio about yourself"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none"
                  id="bio-input"
                />
              )}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            required
            id="category-select"
          >
            <option value="">Select a category</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
              <option key={key} value={key}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated, max 5)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. productivity, tips, beginners"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            id="tags-input"
          />
        </div>

        {/* Author monetization fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UPI ID (optional, for tips)</label>
            <input
              type="text"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ko-fi Link (optional)</label>
            <input
              type="text"
              value={kofiLink}
              onChange={e => setKofiLink(e.target.value)}
              placeholder="https://ko-fi.com/yourname"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image URL</label>
          <input
            type="url"
            value={featuredImage}
            onChange={e => setFeaturedImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            id="featured-image-input"
          />
          {featuredImage && (
            <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
          <Editor content={content} onUpdate={setContent} />
        </div>

        {/* Submit */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 -mx-4 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              ~{Math.max(1, Math.ceil((content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length) / 200))} min read
            </span>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
            id="publish-post-btn"
          >
            {submitting ? 'Publishing...' : '🚀 Publish Post'}
          </button>
        </div>
      </form>

      {/* Edit Key Modal */}
      {editKey && <EditKeyModal editKey={editKey} onClose={handleModalClose} />}
    </div>
  )
}
