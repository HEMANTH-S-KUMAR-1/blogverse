'use server'

import { getRequestContext } from '@opennextjs/cloudflare'
import { getDB } from '@/lib/d1'
import { revalidatePath } from 'next/cache'

async function verifyTurnstile(token) {
  if (!token) return false
  const ctx = await getRequestContext()
  const secret = ctx?.env?.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // bypass if not configured during development

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
  })
  const data = await res.json()
  return data.success
}

export async function createPost(postData, turnstileToken) {
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  const db = await getDB()
  const editKey = crypto.randomUUID()
  
  try {
    const jsonTags = JSON.stringify(postData.tags || [])
    
    await db.prepare(`
      INSERT INTO posts (
        id, slug, title, excerpt, content, category, featured_image_url,
        author_display_name, author_bio, author_upi_id, author_kofi_link,
        identity_mode, author_avatar_url, tags, status, edit_key
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `).bind(
      crypto.randomUUID(), postData.slug, postData.title, postData.excerpt, postData.content, postData.category, postData.featured_image_url,
      postData.author_display_name, postData.author_bio, postData.author_upi_id, postData.author_kofi_link,
      postData.identity_mode, postData.author_avatar_url, jsonTags, 'published', editKey
    ).run()
    
    revalidatePath('/')
    
    return { success: true, edit_key: editKey, slug: postData.slug }
  } catch (error) {
    console.error('Failed to create post:', error)
    return { success: false, error: 'Database error' }
  }
}

export async function subscribeNewsletter(email) {
  const db = await getDB()
  try {
    await db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').bind(email).run()
    return { success: true }
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return { success: false, code: '23505' }
    }
    return { success: false, error: error.message }
  }
}

export async function submitReaction(postId, sessionId, type) {
  const db = await getDB()
  try {
    await db.prepare('INSERT INTO reactions (post_id, session_id, reaction_type) VALUES (?, ?, ?)')
      .bind(postId, sessionId, type)
      .run()
    revalidatePath(`/post/${postId}`)
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function loadReactions(postId, sessionId) {
  const db = await getDB()
  const { results: allReactions } = await db.prepare('SELECT reaction_type FROM reactions WHERE post_id = ?').bind(postId).all()
  const { results: userReaction } = await db.prepare('SELECT reaction_type FROM reactions WHERE post_id = ? AND session_id = ? LIMIT 1').bind(postId, sessionId).all()
  
  return {
    all: allReactions,
    user: userReaction
  }
}

export async function fetchCommentsAction(postId) {
  const db = await getDB()
  const { results } = await db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC LIMIT 100').bind(postId).all()
  return results
}

export async function submitCommentAction(postId, displayName, content, turnstileToken, parentId = null) {
  const isValid = await verifyTurnstile(turnstileToken)
  if (!isValid) return { success: false, error: 'Turnstile verification failed' }

  const db = await getDB()
  try {
    await db.prepare('INSERT INTO comments (post_id, display_name, content, parent_id) VALUES (?, ?, ?, ?)')
      .bind(postId, displayName, content, parentId)
      .run()
    revalidatePath(`/post/${postId}`)
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function verifyEditKey(slug, key) {
  const db = await getDB()
  const { results } = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).all()
  const post = results?.[0]
  
  if (!post) return { success: false, error: 'Post not found' }
  if (post.edit_key !== key) return { success: false, error: 'Wrong edit key' }
  
  return { success: true, post }
}

export async function updatePostAction(postData) {
  const db = await getDB()
  try {
    const jsonTags = JSON.stringify(postData.tags || [])
    await db.prepare(`
      UPDATE posts SET
        title = ?, content = ?, excerpt = ?, featured_image_url = ?,
        author_avatar_url = ?, category = ?, tags = ?
      WHERE id = ?
    `).bind(
      postData.title, postData.content, postData.excerpt, postData.featured_image_url,
      postData.author_avatar_url, postData.category, jsonTags, postData.id
    ).run()
    
    revalidatePath(`/post/${postData.slug}`)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function fetchJobsAction() {
  const db = await getDB()
  const { results } = await db.prepare('SELECT * FROM job_listings ORDER BY created_at DESC').all()
  return results
}

export async function addJobAction(jobData) {
  const db = await getDB()
  try {
    await db.prepare('INSERT INTO job_listings (id, title, company, description, category, url) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), jobData.title, jobData.company, jobData.description, jobData.category, jobData.url)
      .run()
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function deactivateJobAction(id) {
  const db = await getDB()
  try {
    await db.prepare('UPDATE job_listings SET is_active = FALSE WHERE id = ?').bind(id).run()
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function incrementViews(postId) {
  const db = await getDB()
  const ctx = await getRequestContext()
  
  try {
    // 1. Update D1
    await db.prepare('UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = ?').bind(postId).run()
    
    // 2. Write to Analytics Engine
    if (ctx?.env?.ANALYTICS) {
      ctx.env.ANALYTICS.writeDataPoint({
        blobs: ['pageview', postId, 'page_view'],
        doubles: [1],
        indexes: [postId]
      })
    }
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function trackAffiliateClick(name, postId, sessionId) {
  const db = await getDB()
  try {
    await db.prepare('INSERT INTO affiliate_clicks (affiliate_name, post_id, session_id) VALUES (?, ?, ?)')
      .bind(name, postId, sessionId)
      .run()
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
