import { CATEGORY_CONFIG } from '@/lib/d1'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.vercel.app'

  let posts = []
  try {
    const { data } = await supabase
      .from('posts')
      .select('slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    posts = data || []
  } catch (e) {
    console.warn('Sitemap: DB error:', e.message)
  }

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/post/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const categoryUrls = Object.keys(CATEGORY_CONFIG).map((cat) => ({
    url: `${siteUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const staticPages = ['', '/jobs', '/products', '/courses', '/write', '/advertise', '/support'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '' ? 1.0 : 0.8,
  }))

  return [...staticPages, ...categoryUrls, ...postUrls]
}
