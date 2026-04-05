'use client'

import { useState, useMemo } from 'react'
import { CATEGORY_CONFIG } from '@/lib/d1'
import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DiscoverPage() {
  const [allPosts, setAllPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  // Load posts on mount
  useState(() => {
    const loadPosts = async () => {
      try {
        const { data } = await supabase
          .from('posts')
          .select('id, slug, title, excerpt, category, featured_image_url, author_display_name, published_at, views')
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        setAllPosts(data || [])
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allPosts, searchTerm, selectedCategory])

  const categories = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
    emoji: config.emoji,
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Discover Stories</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Explore a curated collection of blogs from our community. Find inspiration, knowledge, and new perspectives.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative flex items-center bg-card border border-border rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/50">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search stories, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder-slate-400 text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 hover:bg-border rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-sm border-b border-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                !selectedCategory
                  ? 'bg-emerald-500 text-white'
                  : 'bg-card border border-border text-foreground hover:border-emerald-500/50'
              }`}
            >
              All Stories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-500 text-white'
                    : 'bg-card border border-border text-foreground hover:border-emerald-500/50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-4">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
              </div>
              <p className="text-slate-500">Loading stories...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20 px-6 rounded-3xl border-2 border-dashed border-border bg-card/50"
            >
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No stories found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
