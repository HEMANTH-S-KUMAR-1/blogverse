import { supabase } from '@/lib/supabase'
import { CATEGORY_CONFIG } from '@/lib/d1'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import LoadMorePosts from '@/components/LoadMorePosts'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { name } = await params
  const cat = CATEGORY_CONFIG[name]
  if (!cat) return { title: 'Category Not Found' }
  return {
    title: `${cat.emoji} ${cat.label} – BlogVerse`,
    description: `Read the best ${cat.label} articles on BlogVerse. Free, community-written content for everyone.`,
  }
}

const PAGE_SIZE = 12

export default async function CategoryPage({ params }) {
  const { name } = await params
  const cat = CATEGORY_CONFIG[name]
  if (!cat) notFound()

  const { data: posts, count } = await supabase
    .from('posts')
    .select(
      'id, slug, title, excerpt, category, featured_image_url, author_display_name, published_at, views',
      { count: 'exact' }
    )
    .eq('status', 'published')
    .eq('category', name)
    .order('published_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  const allPosts = posts || []
  const totalPosts = count || 0
  const hasMore = totalPosts > PAGE_SIZE

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className={`rounded-3xl ${cat.bgClass} border ${cat.borderClass} p-8 lg:p-12 mb-12`}>
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300">{cat.label}</span>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{cat.emoji}</span>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">{cat.label}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {totalPosts} {totalPosts === 1 ? 'story' : 'stories'} published
            </p>
          </div>
        </div>
      </div>

      {/* Posts grid */}
      {allPosts.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {hasMore && (
            <LoadMorePosts
              initialPosts={allPosts}
              pageSize={PAGE_SIZE}
              totalPosts={totalPosts}
              category={name}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-border">
          <span className="text-6xl mb-4">{cat.emoji}</span>
          <h2 className="text-2xl font-bold text-foreground mb-2">No {cat.label} posts yet</h2>
          <p className="text-slate-500 mb-8">Be the first to write about {cat.label.toLowerCase()}!</p>
          <Link
            href="/write"
            className="px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:scale-105 transition-transform"
          >
            Write the First Post
          </Link>
        </div>
      )}

      {/* Other categories */}
      <div className="mt-16 pt-12 border-t border-border">
        <h2 className="text-xl font-black text-foreground mb-6">Explore Other Topics</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CATEGORY_CONFIG)
            .filter(([key]) => key !== name)
            .map(([key, c]) => (
              <Link
                key={key}
                href={`/category/${key}`}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all hover:-translate-y-1 ${c.borderClass} ${c.bgClass}`}
              >
                {c.emoji} {c.label}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
