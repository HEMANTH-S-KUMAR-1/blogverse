// app/page.js
// PERF FIX: Replaced force-dynamic with ISR (revalidate every 60s)
// FEAT: Added "Load More" pagination

import { CATEGORY_CONFIG } from '@/lib/d1'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import PostCard from '@/components/PostCard'
import NewsletterForm from '@/components/NewsletterForm'
import AffiliateBanner from '@/components/AffiliateBanner'
import AdSenseSlot from '@/components/AdSenseSlot'
import Link from 'next/link'
import CategoryFilter from '@/components/CategoryFilter'
import LoadMorePosts from '@/components/LoadMorePosts'
import HeroSection from '@/components/HeroSection'
import FeatureGrid from '@/components/FeatureGrid'
import CtaSection from '@/components/CtaSection'
import TestimonialSection from '@/components/TestimonialSection'

// PERF FIX: ISR — revalidate every 60 seconds instead of force-dynamic
// New posts trigger revalidatePath('/') in createPost action
export const revalidate = 60

const PAGE_SIZE = 12

export default async function HomePage() {
  let allPosts = []
  let featured = null
  let totalPosts = 0

  try {
    const [{ data: posts, count }, { data: featuredData }] = await Promise.all([
      // PERF FIX: Select only needed columns instead of *
      supabase
        .from('posts')
        .select(
          'id, slug, title, excerpt, category, featured_image_url, author_display_name, published_at, views',
          { count: 'exact' }
        )
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(0, PAGE_SIZE - 1),

      // PERF FIX: Featured query also selects only needed columns
      supabase
        .from('posts')
        .select('id, slug, title, excerpt, featured_image_url, author_display_name, views, category')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(1),
    ])
    allPosts = posts || []
    featured = featuredData?.[0] || null
    totalPosts = count || 0
  } catch (e) {
    console.warn('DB not ready:', e.message)
  }

  const hasMore = totalPosts > PAGE_SIZE

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureGrid />

      {/* Testimonials Section */}
      <TestimonialSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Featured post */}
      {featured && (
        <section className="relative overflow-hidden rounded-3xl mt-6 lg:mt-8 bg-surface border border-border">
          <Link href={`/post/${featured.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    Featured Story
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {featured.title}
                </h1>
                {featured.excerpt && (
                  <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <div className="mt-8 flex items-center gap-6 text-sm font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-xs">
                      {featured.author_display_name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-foreground">{featured.author_display_name || 'Anonymous'}</span>
                  </div>
                  <span>{featured.views?.toLocaleString()} views</span>
                  <span className="px-3 py-1 rounded-full border border-border text-xs">
                    {CATEGORY_CONFIG[featured.category]?.label}
                  </span>
                </div>
              </div>
              {featured.featured_image_url && (
                <div className="order-1 lg:order-2 aspect-video lg:aspect-square xl:aspect-video rounded-2xl overflow-hidden shadow-2xl relative">
                  <Image
                    src={featured.featured_image_url}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
            </div>
          </Link>
        </section>
      )}

      <div className="py-8">
        <AdSenseSlot size="leaderboard" />
      </div>

      <div className="mb-8">
        <CategoryFilter />
      </div>

      <section className="pb-20">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Latest Stories</h2>
              <div className="h-px flex-1 bg-border mx-6 hidden sm:block" />
            </div>

            {allPosts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 gap-8" id="posts-grid">
                  {allPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* FEAT: Load More pagination */}
                {hasMore && (
                  <LoadMorePosts
                    initialPosts={allPosts}
                    pageSize={PAGE_SIZE}
                    totalPosts={totalPosts}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border-2 border-dashed border-border bg-surface/50 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                  <span className="text-4xl">✏️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No stories yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                  The world is waiting for your perspective. Start your blogging journey today.
                </p>
                <Link
                  href="/write"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:scale-105 transition-transform"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-10 lg:sticky lg:top-24 lg:self-start">
            <div className="p-1 rounded-3xl bg-surface border border-border shadow-sm">
              <NewsletterForm />
            </div>
            <div className="p-1 rounded-3xl bg-surface border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-background/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sponsored</span>
              </div>
              <AffiliateBanner category="tech" />
            </div>
            <AdSenseSlot size="rectangle" />
          </aside>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />
      </div>
    </div>
  )
}
