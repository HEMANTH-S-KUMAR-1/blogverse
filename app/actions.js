'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

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

export async function createPost(postData, turnstileToken) {
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  const editKey = crypto.randomUUID()

  const { error } = await supabase.from('posts').insert({
    id: crypto.randomUUID(),
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt,
    content: postData.content,
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

export async function subscribeNewsletter(email) {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })

  if (error) {
    if (error.code === '23505') return { success: false, code: '23505' }
    return { success: false, error: error.message }
  }
  return { success: true }
}

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

  // Flatten post_title like the original query returned
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

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    display_name: displayName,
    content,
    parent_id: parentId,
  })

  if (error) return { success: false }
  revalidatePath(`/post/${postId}`)
  return { success: true }
}

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

export async function updatePostAction(postData) {
  const { error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: postData.content,
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

export async function getProducts() {
  const { data } = await supabase
    .from('digital_products')
    .select('*')
    .order('created_at', { ascending: false })

  return data || []
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

export async function incrementViews(postId) {
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
  return { success: true }
}

export async function trackAffiliateClick(name, postId, sessionId) {
  // affiliate_clicks table not in schema — skipping silently
  return { success: true }
}