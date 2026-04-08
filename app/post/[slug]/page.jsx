import { supabase } from '@/lib/supabase'
import { CATEGORY_CONFIG } from '@/lib/d1'
import { parseTags } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReadingProgress from '@/components/ReadingProgress'
import BackToTop from '@/components/BackToTop'
import TableOfContents from '@/components/TableOfContents'
import ViewIncrementer from '@/components/ViewIncrementer'
import ShareButtons from '@/components/ShareButtons'
import CommentSection from '@/components/CommentSection'
import ReactionBar from '@/components/ReactionBar'
import TipButton from '@/components/TipButton'
import DeletePostButton from '@/components/DeletePostButton'
import AffiliateBanner from '@/components/AffiliateBanner'
import AdSenseSlot from '@/components/AdSenseSlot'
import PostCard from '@/components/PostCard'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, featured_image_url, author_display_name, category')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.vercel.app'
  const ogImage = post.featured_image_url || `${siteUrl}/og-default.png`

  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on BlogVerse`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on BlogVerse`,
      type: 'article',
      url: `${siteUrl}/post/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on BlogVerse`,
      images: [ogImage],
    },
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) notFound()

  const cat = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.tech
  const tags = parseTags(post.tags)
  const date = new Date(post.published_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const wordCount = post.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0
  const readMins = Math.max(1, Math.ceil(wordCount / 200))

  // Related posts
  const { data: relatedPosts } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, category, featured_image_url, author_display_name, published_at, views')
    .eq('status', 'published')
    .eq('category', post.category)
    .neq('id', post.id)
    .order('views', { ascending: false })
    .limit(3)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.vercel.app'

  return (
    <>
      <ReadingProgress />
      <ViewIncrementer postId={post.id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Main Content ─────────────────────────────────────── */}
          <main className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/category/${post.category}`} className="hover:text-emerald-500 transition-colors capitalize">
                {cat.emoji} {cat.label}
              </Link>
              <span>/</span>
              <span className="text-slate-500 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Category badge */}
            <div className="mb-4">
              <Link
                href={`/category/${post.category}`}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${cat.borderClass}`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
              {/* Author */}
              <div className="flex items-center gap-3">
                {post.author_avatar_url ? (
                  <Image
                    src={post.author_avatar_url}
                    alt={post.author_display_name || 'Author'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {(post.author_display_name || 'A')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author_display_name || 'Anonymous'}</p>
                  {post.author_bio && (
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">{post.author_bio}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400 ml-auto">
                <span>{date}</span>
                <span>·</span>
                <span>{readMins} min read</span>
                <span>·</span>
                <span>{post.views?.toLocaleString()} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            )}

            {/* Article Content */}
            <article
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:font-extrabold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-5
                prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50 dark:prose-blockquote:bg-emerald-900/10 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-xl
                prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:rounded-2xl prose-pre:relative
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                prose-li:text-slate-600 dark:prose-li:text-slate-300
                prose-strong:text-foreground prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="mt-10 p-6 rounded-2xl border border-border bg-surface">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">What did you think?</h3>
              <ReactionBar postId={post.id} />
            </div>

            {/* Share */}
            <div className="mt-6 p-6 rounded-2xl border border-border bg-surface">
              <ShareButtons title={post.title} slug={slug} />
            </div>

            {/* Delete post (for authors with edit key) */}
            <div className="mt-4">
              <DeletePostButton slug={slug} />
            </div>

            {/* Edit post link */}
            <div className="mt-2">
              <Link
                href={`/edit/${slug}`}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-500 transition-colors w-fit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit this post
              </Link>
            </div>

            {/* AdSense */}
            <div className="mt-8">
              <AdSenseSlot size="article" />
            </div>

            {/* Comments */}
            <div className="mt-12 pt-8 border-t border-border">
              <CommentSection postId={post.id} />
            </div>
          </main>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Table of Contents */}
            <TableOfContents content={post.content} />

            {/* Author card */}
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-3 mb-3">
                {post.author_avatar_url ? (
                  <Image
                    src={post.author_avatar_url}
                    alt={post.author_display_name || 'Author'}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    {(post.author_display_name || 'A')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-foreground text-sm">{post.author_display_name || 'Anonymous'}</p>
                  <p className="text-xs text-slate-400 capitalize">{post.identity_mode || 'anonymous'} author</p>
                </div>
              </div>
              {post.author_bio && (
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{post.author_bio}</p>
              )}
            </div>

            {/* Tip button */}
            {(post.author_upi_id || post.author_kofi_link) && (
              <TipButton
                authorName={post.author_display_name}
                upiId={post.author_upi_id}
                kofiLink={post.author_kofi_link}
              />
            )}

            {/* Affiliate Banner */}
            <AffiliateBanner category={post.category} postId={post.id} />

            {/* AdSense */}
            <AdSenseSlot size="rectangle" />
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-black text-foreground mb-8">More in {cat.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <BackToTop />
    </>
  )
}
