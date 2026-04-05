'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Edit2, Trash2, Eye, ArrowUpRight, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'

export default function CreatorProfilePage() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ totalViews: 0, totalPosts: 0, followers: 0 })
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('Anonymous')

  useEffect(() => {
    const loadCreatorData = async () => {
      try {
        // Get creator's posts
        const { data: postsData } = await supabase
          .from('posts')
          .select('id, title, slug, views, published_at, status')
          .order('published_at', { ascending: false })

        setPosts(postsData || [])

        if (postsData && postsData.length > 0) {
          const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0)
          setStats({
            totalViews,
            totalPosts: postsData.length,
            followers: Math.floor(totalViews / 100), // Mock calculation
          })
        }
      } catch (error) {
        console.error('Failed to load creator data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCreatorData()
  }, [])

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await supabase.from('posts').delete().eq('id', id)
        setPosts(posts.filter(p => p.id !== id))
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-2">Creator Dashboard</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">Welcome back, {displayName}! Manage your stories and track your growth.</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-12">
          <motion.div
            className="grid sm:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye },
              { label: 'Published Posts', value: stats.totalPosts, icon: ArrowUpRight },
              { label: 'Followers', value: stats.followers.toLocaleString(), icon: Users },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                        <p className="text-3xl font-black text-emerald-400">{stat.value}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Published Posts */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-foreground">Your Stories</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage and track your published posts</p>
              </div>
              <Link
                href="/write"
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all active:scale-95"
              >
                New Post
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-4">
                  <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-slate-500">Loading your posts...</p>
              </div>
            ) : posts.length > 0 ? (
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/post/${post.slug}`}
                        className="text-lg font-semibold text-foreground hover:text-emerald-500 transition-colors line-clamp-1 block"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views || 0} views
                        </span>
                        <span>{new Date(post.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/edit/${post.slug}`}
                        className="p-2 rounded-lg hover:bg-border transition-colors text-slate-400 hover:text-foreground"
                        title="Edit post"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-500"
                        title="Delete post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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
                  <span className="text-4xl">✍️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No posts yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                  You haven&apos;t published any posts yet. Start creating to grow your audience.
                </p>
                <Link
                  href="/write"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Create Your First Post
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
