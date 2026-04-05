'use server'

const rateLimitMap = new Map()
function rateLimit(key, maxRequests = 5, windowMs = 60000) {
  const now = Date.now()
  const entry = rateLimitMap.get(key) || { count: 0, start: now }
  if (now - entry.start > windowMs) { entry.count = 0; entry.start = now }
  entry.count++
  rateLimitMap.set(key, entry)
  return entry.count > maxRequests
}

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import DOMPurify from 'isomorphic-dompurify'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function verifyTurnstile(token) {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WARN] TURNSTILE_SECRET_KEY not set — bypassing in development.')
      return true
    }
    throw new Error('TURNSTILE_SECRET_KEY is not configured.')
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
  })
  const data = await res.json()
  return data.success
}

// FIX: Parse tags safely from either JSON string or plain array
function parseTags(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string') {
    try { return JSON.parse(raw).filter(Boolean) } catch { return [] }
  }
  return []
}

const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    'p','br','strong','em','u','s','h2','h3','h4',
    'ul','ol','li','blockquote','pre','code',
    'a','img','hr','figure','figcaption',
  ],
  ALLOWED_ATTR: ['href','src','alt','class','target','rel','width','height'],
  FORBID_SCRIPT: true,
  FORBID_TAGS: ['script','style','iframe','object','embed','form'],
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function adminLoginAction(password) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return { success: false, error: 'Admin auth not configured' }
  if (password !== adminSecret) return { success: false, error: 'Invalid password' }

  const cookieStore = await cookies()
  const crypto2 = await import('node:crypto')
  const hashedSecret = crypto2.createHash('sha256').update(adminSecret).digest('hex')
  cookieStore.set('admin_token', hashedSecret, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return { success: true }
}

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const serverSecret = process.env.ADMIN_SECRET
  if (!serverSecret || !token) return false
  const crypto2 = await import('node:crypto')
  const hashedSecret = crypto2.createHash('sha256').update(serverSecret).digest('hex')
  if (token !== hashedSecret) return false
  return true
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function createPost(postData, turnstileToken) {
  if (rateLimit('createPost:' + (postData.author_display_name || 'anon'), 3, 60000)) return { success: false, error: 'Too many posts. Please wait.' }
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  // Input validation
  if (!postData.title || postData.title.trim().length < 5) return { success: false, error: 'Title must be at least 5 characters' }
  if (postData.title.length > 200) return { success: false, error: 'Title too long (max 200 chars)' }
  if (!postData.slug || !/^[a-z0-9-]+$/.test(postData.slug)) return { success: false, error: 'Invalid slug format' }
  if (postData.slug.length > 200) return { success: false, error: 'Slug too long (max 200 chars)' }
  if (!postData.content || postData.content.length < 50) return { success: false, error: 'Content too short (min 50 chars)' }
  if (!postData.category || !['health','tech','finance','student','business','eco'].includes(postData.category)) return { success: false, error: 'Invalid category' }
  if (!postData.author_display_name || postData.author_display_name.trim().length < 2) return { success: false, error: 'Author name too short' }
  if (postData.author_display_name.length > 80) return { success: false, error: 'Author name too long (max 80 chars)' }
  if (postData.excerpt && postData.excerpt.length > 500) return { success: false, error: 'Excerpt too long (max 500 chars)' }

  const editKey = crypto.randomUUID()
  const sanitizedContent = DOMPurify.sanitize(postData.content || '', SANITIZE_OPTIONS)

  // FIX: Store tags as proper JSON array string (consistent format)
  const tagsArray = Array.isArray(postData.tags) ? postData.tags : []

  const { error } = await supabase.from('posts').insert({
    id: crypto.randomUUID(),
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt,
    content: sanitizedContent,
    category: postData.category,
    featured_image_url: postData.featured_image_url,
    author_display_name: postData.author_display_name,
    author_bio: postData.author_bio,
    author_upi_id: postData.author_upi_id,
    author_kofi_link: postData.author_kofi_link,
    identity_mode: postData.identity_mode,
    author_avatar_url: postData.author_avatar_url,
    tags: JSON.stringify(tagsArray),
    status: 'published',
    edit_key: editKey,
  })

  if (error) {
    console.error('Failed to create post:', error)
    return { success: false, error: 'Database error' }
  }

  revalidatePath('/')
  return { success: true, edit_key: editKey, slug: postData.slug }
}

export async function updatePostAction(postData) {
  const sanitizedContent = DOMPurify.sanitize(postData.content || '', SANITIZE_OPTIONS)
  const tagsArray = Array.isArray(postData.tags) ? postData.tags : parseTags(postData.tags)

  const { error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: sanitizedContent,
      excerpt: postData.excerpt,
      featured_image_url: postData.featured_image_url,
      author_avatar_url: postData.author_avatar_url,
      category: postData.category,
      tags: JSON.stringify(tagsArray),
    })
    .eq('id', postData.id)

  if (error) return { success: false, error: error.message }
  revalidatePath(`/post/${postData.slug}`)
  return { success: true }
}

export async function deletePostAction(slug, editKey) {
  const { data, error: findError } = await supabase
    .from('posts')
    .select('id, edit_key')
    .eq('slug', slug)
    .single()

  if (findError || !data) return { success: false, error: 'Post not found' }
  if (data.edit_key !== editKey) return { success: false, error: 'Wrong edit key' }

  const { error } = await supabase.from('posts').delete().eq('id', data.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true }
}

// ─── Views ────────────────────────────────────────────────────────────────────

export async function incrementViews(postId) {
  if (!postId) return { success: false }
  const { error: rpcError } = await supabase.rpc('increment_views', { post_id: postId })
  if (rpcError) {
    await supabase.rpc('increment_views_fallback', { post_id: postId }).catch(async () => {
      await supabase.from('posts').update({ views: supabase.raw('views + 1') }).eq('id', postId)
    })
  }
  return { success: true }
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchPostsAction(query) {
  if (!query || query.trim().length < 2) return { success: true, posts: [] }
  const q = query.trim()

  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, category, author_display_name, published_at, views, featured_image_url, tags')
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,tags.ilike.%${q}%`)
    .order('views', { ascending: false })
    .limit(20)

  if (error) return { success: false, error: error.message }
  return { success: true, posts: data || [] }
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  if (rateLimit('newsletter:' + email, 2, 3600000)) return { success: false, error: 'Too many attempts.' }
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })
  if (error) {
    if (error.code === '23505') return { success: false, code: '23505' }
    return { success: false, error: error.message }
  }
  return { success: true }
}

// ─── Reactions ────────────────────────────────────────────────────────────────

export async function submitReaction(postId, sessionId, type) {
  const { error } = await supabase.from('reactions').insert({
    post_id: postId,
    session_id: sessionId,
    reaction_type: type,
  })
  if (error) return { success: false }
  const { data: post } = await supabase.from('posts').select('slug').eq('id', postId).single()
  if (post?.slug) revalidatePath('/post/' + post.slug)
  return { success: true }
}

export async function loadReactions(postId, sessionId) {
  const { data: allReactions } = await supabase
    .from('reactions').select('reaction_type').eq('post_id', postId)

  const { data: userReaction } = await supabase
    .from('reactions').select('reaction_type')
    .eq('post_id', postId).eq('session_id', sessionId).limit(1)

  return { all: allReactions || [], user: userReaction || [] }
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function fetchCommentsAction(postId) {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .or('is_hidden.is.null,is_hidden.eq.false')
    .order('created_at', { ascending: true })
    .limit(100)
  return data || []
}

export async function getAdminCommentsAction() {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('comments')
    .select('*, posts(title)')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return { success: false, error: error.message }
  const comments = (data || []).map(c => ({ ...c, post_title: c.posts?.title || '', posts: undefined }))
  return { success: true, comments }
}

export async function hideCommentAction(commentId) {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }
  const { error } = await supabase.from('comments').update({ is_hidden: true }).eq('id', commentId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitCommentAction(postId, displayName, content, turnstileToken, parentId = null) {
  if (rateLimit('comment:' + postId, 5, 60000)) return { success: false, error: 'Too many comments. Please wait.' }
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  const safeContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    display_name: displayName.slice(0, 80),
    content: safeContent.slice(0, 2000),
    parent_id: parentId,
  })

  if (error) return { success: false }
  const { data: post } = await supabase.from('posts').select('slug').eq('id', postId).single()
  if (post?.slug) revalidatePath('/post/' + post.slug)
  return { success: true }
}

// ─── Edit key ─────────────────────────────────────────────────────────────────

export async function verifyEditKey(slug, key) {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single()
  if (error || !data) return { success: false, error: 'Post not found' }
  if (data.edit_key !== key) return { success: false, error: 'Wrong edit key' }
  return { success: true, post: data }
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function getJobs() {
  const { data } = await supabase
    .from('job_listings').select('*').eq('is_active', true)
    .order('created_at', { ascending: false })
  return data || []
}

export async function postJob(jobData) {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }
  const { error } = await supabase.from('job_listings').insert({
    title: jobData.title,
    company: jobData.company,
    description: jobData.description,
    category: jobData.category,
    apply_url: jobData.apply_url,
  })
  if (error) return { success: false }
  revalidatePath('/jobs')
  return { success: true }
}

export async function deactivateJobAction(id) {
  const { error } = await supabase.from('job_listings').update({ is_active: false }).eq('id', id)
  if (error) return { success: false }
  revalidatePath('/jobs')
  return { success: true }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  const { data } = await supabase.from('digital_products').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function trackAffiliateClick(name, postId, sessionId) {
  if (!name) return { success: false }
  const { error } = await supabase.from('affiliate_clicks').insert({
    name: name.slice(0, 100),
    post_id: postId || null,
    session_id: sessionId || null,
  })
  if (error) return { success: false }
  return { success: true }
}

// ─── Admin: Posts management ──────────────────────────────────────────────────

export async function getAdminPostsAction({ page = 1, limit = 20 } = {}) {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('posts')
    .select('id, slug, title, category, status, views, published_at, author_display_name', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) return { success: false, error: error.message }
  return { success: true, posts: data || [], total: count || 0 }
}

export async function hidePostAction(id) {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }
  const { error } = await supabase.from('posts').update({ status: 'hidden' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function restorePostAction(id) {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }
  const { error } = await supabase.from('posts').update({ status: 'published' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function adminDeletePostAction(id) {
  if (!await requireAdmin()) return { success: false, error: 'Unauthorized' }
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export async function getPostsPage({ page = 1, limit = 12, category = null } = {}) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('posts')
    .select('id, slug, title, excerpt, category, featured_image_url, author_display_name, published_at, views, tags', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (category) query = query.eq('category', category)

  const { data, error, count } = await query
  if (error) return { success: false, posts: [], total: 0 }
  return { success: true, posts: data || [], total: count || 0, hasMore: to < (count || 0) - 1 }
}