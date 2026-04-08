'use client'

import { useState, useEffect, useRef } from 'react'
import { searchPostsAction } from '@/app/actions'
import PostCard from '@/components/PostCard'
import { Search, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { CATEGORY_CONFIG } from '@/lib/d1'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim() || query.trim().length < 2) {
      Promise.resolve().then(() => { setResults([]); setSearched(false); setLoading(false) })
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const { success, posts } = await searchPostsAction(query.trim())
      if (success) setResults(posts || [])
      setSearched(true)
      setLoading(false)
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSearched(false)
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-3">Search BlogVerse</h1>
        <p className="text-slate-500 dark:text-slate-400">Find stories across all categories</p>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for topics, titles, tags…"
          className="w-full pl-12 pr-12 py-4 text-lg rounded-2xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
          id="search-input"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <>
          <p className="text-sm text-slate-400 mb-6">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>

          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {results.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-foreground mb-2">No stories found</h2>
              <p className="text-slate-500 mb-8">Try a different search term or explore by category</p>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all hover:-translate-y-0.5 ${cat.borderClass}`}
                  >
                    {cat.emoji} {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state — before search */}
      {!loading && !searched && !query && (
        <div className="mt-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-5">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
              <Link
                key={key}
                href={`/category/${key}`}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${cat.bgClass} ${cat.borderClass}`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <p className="font-bold text-foreground text-sm">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
