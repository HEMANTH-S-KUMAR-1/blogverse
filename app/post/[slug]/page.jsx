import { CATEGORY_CONFIG, safeImageUrl, getDB } from '@/lib/d1'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactionBar from '@/components/ReactionBar'
import ShareButtons from '@/components/ShareButtons'
import TipButton from '@/components/TipButton'
import CommentSection from '@/components/CommentSection'
import NewsletterForm from '@/components/NewsletterForm'
import AffiliateBanner from '@/components/AffiliateBanner'
import AdSenseSlot from '@/components/AdSenseSlot'
import PostCard from '@/components/PostCard'
import ViewIncrementer from '@/components/ViewIncrementer'

export const revalidate = 60
export const runtime = 'edge'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const db = await getDB()
  const { results } = await db.prepare("SELECT title, excerpt, category, author_display_name, published_at, featured_image_url FROM posts WHERE slug = ?").bind(slug).all()
  const post = results?.[0]

  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — BlogVerse`,
    description: post.excerpt || 'Read this post on BlogVerse',
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params

  const db = await getDB()
  const { results: postResults } = await db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").bind(slug).all()
  const post = postResults?.[0]

  if (!post) notFound()

  // tags are JSON stringified in SQLite
  try {
    post.tags = JSON.parse(post.tags)
  } catch(e) {
    post.tags = []
  }

  // Get related posts
  const { results: relatedPosts } = await db.prepare("SELECT * FROM posts WHERE category = ? AND status = 'published' AND id != ? ORDER BY published_at DESC LIMIT 3").bind(post.category, post.id).all()

  const cat = CATEGORY_CONFIG[post.category]
  const date = new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const wordCount = post.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const categoryBadgeClasses = {
    health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    student: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    business: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    eco: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }

  // Split content for injecting ads
  const contentParts = post.content?.split('</p>') || []
  let renderedContent = ''
  contentParts.forEach((part, i) => {
    renderedContent += part + (i < contentParts.length - 1 ? '</p>' : '')
    if (i === 2) {
      renderedContent += '<div id="inline-affiliate-slot"></div>'
    }
    if (i === 5) {
      renderedContent += '<div id="inline-adsense-slot"></div>'
    }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.featured_image_url || undefined,
        datePublished: post.published_at,
        dateModified: post.published_at,
        author: {
          '@type': 'Person',
          name: post.author_display_name || 'Anonymous'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blogverse.com/' },
          { '@type': 'ListItem', position: 2, name: cat?.label || 'Blog', item: `https://blogverse.com/category/${post.category}` },
          { '@type': 'ListItem', position: 3, name: post.title }
        ]
      }
    ]
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewIncrementer postId={post.id} />

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="w-full max-h-[500px] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Sponsored label */}
            {post.is_sponsored && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 mb-4">
                Sponsored
              </span>
            )}

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link href={`/category/${post.category}`}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryBadgeClasses[post.category]}`}>
                  {cat?.label}
                </span>
              </Link>
              <span className="text-sm text-gray-400">{date}</span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-400">{readTime} min read</span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-400">{post.views} views</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              {safeImageUrl(post.author_avatar_url) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={safeImageUrl(post.author_avatar_url)} alt={post.author_display_name || 'Author'} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {(post.author_display_name || 'A')[0].toUpperCase()}
                </div>
              )}
              <div>
                {post.identity_mode !== 'anonymous' ? (
                  <Link href={`/writer/${encodeURIComponent(post.author_display_name)}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-emerald-500">
                    {post.author_display_name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{post.author_display_name}</span>
                )}
                {post.author_bio && <p className="text-xs text-gray-400">{post.author_bio}</p>}
              </div>
            </div>

            {/* Post Content */}
            <div className="prose-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />

            {/* Inline Affiliate (after content) */}
            <div className="my-8">
              <AffiliateBanner category={post.category} postId={post.id} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 my-8">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="my-8 py-8 border-t border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How did you find this post?</h3>
              <ReactionBar postId={post.id} />
            </div>

            {/* Share */}
            <div className="my-8">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>

            {/* Tip */}
            {(post.author_upi_id || post.author_kofi_link) && (
              <div className="my-8">
                <TipButton
                  authorName={post.author_display_name}
                  upiId={post.author_upi_id}
                  kofiLink={post.author_kofi_link}
                />
              </div>
            )}

            {/* Newsletter */}
            <div className="my-8">
              <NewsletterForm />
            </div>

            {/* Comments */}
            <div className="my-8">
              <CommentSection postId={post.id} />
            </div>

            {/* Edit link */}
            <div className="mt-8 text-center">
              <Link href={`/edit/${post.slug}`} className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">
                ✏️ Edit this post (requires edit key)
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <AdSenseSlot size="rectangle" />
            <AffiliateBanner category={post.category} postId={post.id} />
            <NewsletterForm />
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
