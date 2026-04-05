'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">Ready to start?</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
            Join <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">thousands of creators</span>
          </h2>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Share your unique voice with the world. No experience needed, just passion and a story to tell.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/write"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all hover:scale-105 active:scale-95"
            >
              Start Writing Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/discover"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 font-bold text-lg hover:border-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              Explore Stories
            </Link>
          </div>

          {/* Trust badges */}
          <motion.div
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Publish instantly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>100% yours</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
