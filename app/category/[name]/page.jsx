import { supabase, CATEGORY_CONFIG, CATEGORIES } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import PostCard from '@/components/PostCard'
import NewsletterForm from '@/components/NewsletterForm'
import AffiliateBanner from '@/components/AffiliateBanner'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { name } = await params
  const cat = CATEGORY_CONFIG[name]
  if (!cat) return { title: 'Category Not Found' }
  return {
    title: `${cat.label} — BlogVerse`,
    description: `Explore ${cat.label} posts on BlogVerse.`,
  }
}

export default async function CategoryPage({ params }) {
  const { name } = await params

  if (!CATEGORIES.includes(name)) redirect('/')

  const cat = CATEGORY_CONFIG[name]

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', name)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const categoryBgClasses = {
    health: 'from-emerald-500 to-emerald-700',
    tech: 'from-blue-500 to-blue-700',
    finance: 'from-amber-500 to-amber-700',
    student: 'from-violet-500 to-violet-700',
    business: 'from-red-500 to-red-700',
    eco: 'from-teal-500 to-teal-700',
  }

  return (
    <div>
      {/* Category Header */}
      <section className={`bg-linear-to-r ${categoryBgClasses[name]}  py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl mb-4 block">{cat.emoji}</span>
          <h1 className="text-4xl font-bold text-white mb-2">{cat.label}</h1>
          <p className="text-white/80 text-lg">
            {posts?.length || 0} {(posts?.length || 0) === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {posts && posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-400 text-lg">No posts in this category yet.</p>
              </div>
            )}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <AffiliateBanner category={name} />
            <NewsletterForm />
          </aside>
        </div>
      </section>
    </div>
  )
}
