'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Welcome to BlogVerse</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6"
        >
          <span className="block text-foreground">Write, Share,</span>
          <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Earn Together</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Join a thriving community of creators. Share your stories, build your audience, and earn from your passion. No middleman, pure connection.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/write"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 active:scale-95"
          >
            Start Writing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/discover"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 font-bold text-lg hover:border-cyan-400 hover:bg-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
          >
            Discover Stories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-20 grid grid-cols-3 gap-8 text-center"
        >
          {[
            { number: '10K+', label: 'Stories' },
            { number: '50K+', label: 'Community' },
            { number: '$1M+', label: 'Earned' },
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-3xl font-black text-emerald-400 mb-2">{stat.number}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
