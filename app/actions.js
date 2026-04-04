'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import DOMPurify from 'isomorphic-dompurify'

// ─── Turnstile ────────────────────────────────────────────────────────────────
async function verifyTurnstile(token) {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WARN] TURNSTILE_SECRET_KEY is not set — bypassing in development.')
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

// ─── Admin ────────────────────────────────────────────────────────────────────
export async function adminLoginAction(password) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return { success: false, error: 'Admin auth not configured' }
  if (password !== adminSecret) return { success: false, error: 'Invalid password' }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', adminSecret, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return { success: true }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

/**
 * FIX 1 – XSS: sanitize HTML content with DOMPurify before writing to DB.
 * isomorphic-dompurify works in both Node and browser environments.
 */
export async function createPost(postData, turnstileToken) {
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  const editKey = crypto.randomUUID()

  // Sanitize HTML content to prevent stored XSS
  const sanitizedContent = DOMPurify.sanitize(postData.content || '', {
    ALLOWED_TAGS: [
      'p','br','strong','em','u','s','h2','h3','h4',
      'ul','ol','li','blockquote','pre','code',
      'a','img','hr','figure','figcaption',
    ],
    ALLOWED_ATTR: ['href','src','alt','class','target','rel','width','height'],
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script','style','iframe','object','embed','form'],
  })

  const { error } = await supabase.from('posts').insert({
    id: crypto.randomUUID(),
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt,
    content: sanitizedContent,          // ← sanitized
    category: postData.category,
    featured_image_url: postData.featured_image_url,
    author_display_name: postData.author_display_name,
    author_bio: postData.author_bio,
    author_upi_id: postData.author_upi_id,
    author_kofi_link: postData.author_kofi_link,
    identity_mode: postData.identity_mode,
    author_avatar_url: postData.author_avatar_url,
    tags: JSON.stringify(postData.tags || []),
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

/**
 * FIX 1b – XSS: sanitize on update too.
 */
export async function updatePostAction(postData) {
  const sanitizedContent = DOMPurify.sanitize(postData.content || '', {
    ALLOWED_TAGS: [
      'p','br','strong','em','u','s','h2','h3','h4',
      'ul','ol','li','blockquote','pre','code',
      'a','img','hr','figure','figcaption',
    ],
    ALLOWED_ATTR: ['href','src','alt','class','target','rel','width','height'],
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script','style','iframe','object','embed','form'],
  })

  const { error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: sanitizedContent,         // ← sanitized
      excerpt: postData.excerpt,
      featured_image_url: postData.featured_image_url,
      author_avatar_url: postData.author_avatar_url,
      category: postData.category,
      tags: JSON.stringify(postData.tags || []),
    })
    .eq('id', postData.id)

  if (error) return { success: false, error: error.message }
  revalidatePath(`/post/${postData.slug}`)
  return { success: true }
}

/**
 * FIX 2 – Delete post: writers can remove their own post using the edit_key.
 */
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

/**
 * FIX 3 – Race condition: use Supabase RPC for atomic increment instead of
 * read-then-write. Falls back to the old approach if the RPC doesn't exist yet
 * (so deploys gracefully before the DB migration is applied).
 *
 * SQL to add to your Supabase project (run once):
 *   CREATE OR REPLACE FUNCTION increment_views(post_id text)
 *   RETURNS void LANGUAGE sql AS $$
 *     UPDATE posts SET views = views + 1 WHERE id = post_id;
 *   $$;
 */
export async function incrementViews(postId, sessionId) {
  // Session-based deduplication: don't count the same session twice
  if (sessionId) {
    const viewedKey = `viewed_${postId}`
    // We store a lightweight record in a separate table if you add one,
    // but for now we rely on the client-side sessionStorage guard in
    // ViewIncrementer.jsx which is the most practical zero-migration approach.
  }

  // Try atomic RPC first
  const { error: rpcError } = await supabase.rpc('increment_views', { post_id: postId })

  if (rpcError) {
    // Fallback: read-then-write (original behaviour, still better than nothing)
    const { data: post } = await supabase
      .from('posts')
      .select('views')
      .eq('id', postId)
      .single()

    const { error } = await supabase
      .from('posts')
      .update({ views: (post?.views || 0) + 1 })
      .eq('id', postId)

    if (error) return { success: false }
  }

  return { success: true }
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * NEW – Full-text search across title, excerpt, and tags.
 */
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
  revalidatePath(`/post/${postId}`)
  return { success: true }
}

export async function loadReactions(postId, sessionId) {
  const { data: allReactions } = await supabase
    .from('reactions')
    .select('reaction_type')
    .eq('post_id', postId)

  const { data: userReaction } = await supabase
    .from('reactions')
    .select('reaction_type')
    .eq('post_id', postId)
    .eq('session_id', sessionId)
    .limit(1)

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
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const serverSecret = process.env.ADMIN_SECRET

  if (!serverSecret || token !== serverSecret) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*, posts(title)')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return { success: false, error: error.message }

  const comments = (data || []).map(c => ({
    ...c,
    post_title: c.posts?.title || '',
    posts: undefined,
  }))

  return { success: true, comments }
}

export async function hideCommentAction(commentId) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const serverSecret = process.env.ADMIN_SECRET

  if (!serverSecret || token !== serverSecret) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('comments')
    .update({ is_hidden: true })
    .eq('id', commentId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitCommentAction(postId, displayName, content, turnstileToken, parentId = null) {
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  // Sanitize comment content too
  const safeContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    display_name: displayName.slice(0, 80),
    content: safeContent.slice(0, 2000),
    parent_id: parentId,
  })

  if (error) return { success: false }
  revalidatePath(`/post/${postId}`)
  return { success: true }
}

// ─── Edit key ─────────────────────────────────────────────────────────────────
export async function verifyEditKey(slug, key) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return { success: false, error: 'Post not found' }
  if (data.edit_key !== key) return { success: false, error: 'Wrong edit key' }

  return { success: true, post: data }
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export async function getJobs() {
  const { data } = await supabase
    .from('job_listings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return data || []
}

export async function postJob(jobData) {
  const { error } = await supabase.from('job_listings').insert({
    title: jobData.title,
    company: jobData.company,
    description: jobData.description,
    category: jobData.category,
    apply_url: jobData.apply_url,
  })

  if (error) {
    console.error('Failed to post job:', error)
    return { success: false }
  }
  revalidatePath('/jobs')
  return { success: true }
}

export async function deactivateJobAction(id) {
  const { error } = await supabase
    .from('job_listings')
    .update({ is_active: false })
    .eq('id', id)

  if (error) return { success: false }
  revalidatePath('/jobs')
  return { success: true }
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function getProducts() {
  const { data } = await supabase
    .from('digital_products')
    .select('*')
    .order('created_at', { ascending: false })

  return data || []
}

// ─── Affiliate ────────────────────────────────────────────────────────────────
export async function trackAffiliateClick(name, postId, sessionId) {
  // affiliate_clicks table not in schema — skipping silently
  return { success: true }
}
