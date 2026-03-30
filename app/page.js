import { supabase, CATEGORY_CONFIG } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import NewsletterForm from '@/components/NewsletterForm'
import AffiliateBanner from '@/components/AffiliateBanner'
import AdSenseSlot from '@/components/AdSenseSlot'
import Link from 'next/link'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 60

export default async function HomePage() {
  const [{ data: posts }, { data: featuredPosts }] = await Promise.all([
    supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(12),
    supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(1),
  ])

  const featured = featuredPosts?.[0]
  const allPosts = posts || []

  return (
    <div>
      {/* Hero Section */}
      {featured && (
        <section className="relative overflow-hidden bg-linear-to-br from-gray-50 to-emerald-50/50 dark:from-gray-900 dark:to-emerald-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <Link href={`/post/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
                    🔥 Most Viewed
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {featured.title}
                  </h1>
                  {featured.excerpt && (
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                    <span>{featured.author_display_name || 'Anonymous'}</span>
                    <span>·</span>
                    <span>{featured.views} views</span>
                    <span>·</span>
                    <span>{CATEGORY_CONFIG[featured.category]?.label}</span>
                  </div>
                </div>
                {featured.featured_image_url && (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50 dark:shadow-gray-900/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured.featured_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* AdSense Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdSenseSlot size="leaderboard" />
      </div>

      {/* Category Filters */}
      <CategoryFilter />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Posts Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Posts</h2>
            {allPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6" id="posts-grid">
                {allPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-400 text-lg mb-4">No posts yet. Be the first to write!</p>
                <Link href="/write" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors">
                  ✍️ Write a Post
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <NewsletterForm />
            <AffiliateBanner category="tech" />
            <AdSenseSlot size="rectangle" />
            <AffiliateBanner category="health" />
          </aside>
        </div>
      </section>
    </div>
  )
}
