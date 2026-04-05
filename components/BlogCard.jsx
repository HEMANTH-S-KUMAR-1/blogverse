'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, Calendar } from 'lucide-react'
import { CATEGORY_CONFIG } from '@/lib/d1'

export default function BlogCard({ post, featured = false }) {
  const cat = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.tech
  const date = new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/post/${post.slug}`} className="group block h-full">
        <article className={`flex flex-col h-full rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 ${featured ? 'lg:grid lg:grid-cols-2 lg:gap-6' : ''}`}>
          {/* Image Section */}
          {post.featured_image_url ? (
            <div className={`relative bg-background overflow-hidden ${featured ? 'lg:order-2' : 'aspect-video'}`}>
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill={!featured}
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes={featured ? '50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              />
            </div>
          ) : (
            <div className={`flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800 ${featured ? 'lg:order-2' : 'aspect-video'}`}>
              <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{cat.emoji}</span>
            </div>
          )}

          {/* Content Section */}
          <div className={`flex flex-col p-6 flex-1 ${featured ? 'lg:order-1 lg:flex lg:flex-col lg:justify-center' : ''}`}>
            {/* Category Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-emerald-400`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {cat.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors mb-3">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-1 mb-4">
                {post.excerpt}
              </p>
            )}

            {/* Meta Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                  {(post.author_display_name || 'A')[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {post.author_display_name || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views || 0}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {date}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
