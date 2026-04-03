import { getDB, CATEGORY_CONFIG } from '@/lib/d1'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.pages.dev'
  const db = await getDB()
  
  // 1. Fetch all published posts
  let posts = []
  try {
    const result = await db.prepare(
      "SELECT slug, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC"
    ).all()
    posts = result.results || []
  } catch (e) {
    console.warn("Sitemap: DB not ready at build time:", e.message)
  }
  
  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/post/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // 2. Categories
  const categories = Object.keys(CATEGORY_CONFIG)
  const categoryUrls = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  // 3. Static Pages
  const staticPages = ['', '/jobs', '/products', '/courses', '/write', '/advertise', '/support'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '' ? 1.0 : 0.8,
  }))

  return [...staticPages, ...categoryUrls, ...postUrls]
}
