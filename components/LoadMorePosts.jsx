'use client'

import { useState } from 'react'
import { getPostsPage } from '@/app/actions'
import PostCard from '@/components/PostCard'
import { Loader2 } from 'lucide-react'

export default function LoadMorePosts({ initialPosts, pageSize, totalPosts }) {
  const [posts, setPosts] = useState(initialPosts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(posts.length < totalPosts)

  const loadMore = async () => {
    setLoading(true)
    const nextPage = page + 1
    const { posts: newPosts, hasMore: more } = await getPostsPage({ page: nextPage, limit: pageSize })
    setPosts(prev => {
      const ids = new Set(prev.map(p => p.id))
      const unique = newPosts.filter(p => !ids.has(p.id))
      return [...prev, ...unique]
    })
    setPage(nextPage)
    setHasMore(more)
    setLoading(false)
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-8 mt-8" id="more-posts-grid">
        {posts.slice(pageSize).map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border border-border bg-surface hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 text-sm font-bold text-foreground transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Stories
                <span className="text-xs text-slate-400">({totalPosts - posts.length} remaining)</span>
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && posts.length > pageSize && (
        <p className="text-center text-sm text-slate-400 mt-8">
          You&apos;ve read all {posts.length} stories
        </p>
      )}
    </>
  )
}
