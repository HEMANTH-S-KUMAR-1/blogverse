'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { searchPostsAction } from '@/app/actions'
import { CATEGORY_CONFIG } from '@/lib/d1'
import { Search, Loader2, X } from 'lucide-react'

function SearchResult({ post }) {
  const cat = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.tech
  const date = new Date(post.published_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="flex gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300">
        {post.featured_image_url && (
          <div className="relative w-24 h-20 shrink-0 rounded-xl overflow-hidden bg-background">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="96px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cat.badgeClass}`}>
              {cat.emoji} {cat.label}
            </span>
          </div>
          <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span>{post.author_display_name || 'Anonymous'}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>{post.views || 0} views</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSearch = useCallback((q) => {
    if (!q || q.trim().length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    startTransition(async () => {
      const { posts } = await searchPostsAction(q)
      setResults(posts || [])
      setSearched(true)
    })
  }, [])

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    // Debounce: search after user stops typing for 300ms
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => handleSearch(val), 300)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setSearched(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-foreground mb-3">Search Stories</h1>
        <p className="text-slate-500 dark:text-slate-400">Find articles by title, topic, or keyword</p>
      </div>

      {/* Search box */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={handleInput}
          placeholder="Search articles..."
          autoFocus
          className="w-full pl-12 pr-12 py-4 rounded-2xl border border-border bg-surface text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg shadow-sm"
          id="search-input"
        />
        {isPending ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 animate-spin" />
        ) : query ? (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* Results */}
      {searched && !isPending && (
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map(post => <SearchResult key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No stories found</p>
              <p className="text-sm mt-1">Try a different keyword or browse by category</p>
              <Link href="/" className="inline-block mt-6 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors">
                Browse All Stories
              </Link>
            </div>
          )}
        </div>
      )}

      {!searched && !isPending && (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Start typing to search across all stories</p>
        </div>
      )}
    </div>
  )
}
