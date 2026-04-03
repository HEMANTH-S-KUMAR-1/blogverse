import Link from 'next/link'
import Image from 'next/image'
import { CATEGORY_CONFIG } from '@/lib/d1'

export default function PostCard({ post }) {
  const cat = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.tech
  const date = new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <Link href={`/post/${post.slug}`} className="group block h-full">
      <article className="flex flex-col h-full rounded-3xl border border-border bg-surface overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black transition-all duration-500 hover:-translate-y-1">
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden bg-background">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
              <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{cat.emoji}</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-background/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest ${cat?.borderClass || ''}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {cat.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col p-6 flex-1">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-[10px] font-black">
                {(post.author_display_name || 'A')[0].toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {post.author_display_name || 'Anonymous'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
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
