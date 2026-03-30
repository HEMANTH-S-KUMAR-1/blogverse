import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/lib/supabase'

export default function PostCard({ post }) {
  const cat = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.tech
  const date = new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const categoryColorClasses = {
    health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    student: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    business: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    eco: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
        {!post.featured_image_url && (
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <span className="text-4xl">{cat.emoji}</span>
          </div>
        )}

        <div className="p-5">
          {/* Category Badge */}
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColorClasses[post.category] || categoryColorClasses.tech}`}>
            {cat.label}
          </span>

          {/* Title */}
          <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                {(post.author_display_name || 'A')[0].toUpperCase()}
              </div>
              <span>{post.author_display_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{date}</span>
              <span>·</span>
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
