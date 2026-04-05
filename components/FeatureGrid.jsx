'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, TrendingUp, Zap, Shield, Globe } from 'lucide-react'
import GlassCard from './GlassCard'

const features = [
  {
    icon: BookOpen,
    title: 'Rich Editor',
    description: 'Powerful markdown editor with live preview. Format your thoughts beautifully.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Connect with thousands of creators. Build meaningful relationships.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Audience',
    description: 'Organic growth through discovery page. Reach readers who care.',
  },
  {
    icon: Zap,
    title: 'Instant Publishing',
    description: 'Publish instantly. No waiting, no approval process. Full control.',
  },
  {
    icon: Shield,
    title: 'Your Content, Your Rules',
    description: 'You own your stories. We just provide the platform.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Your words reach readers worldwide. No geographical limits.',
  },
]

export default function FeatureGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl sm:text-5xl font-black mb-4">
          Why Choose BlogVerse?
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Everything you need to succeed as a creator, all in one place.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <motion.div key={idx} variants={itemVariants}>
              <GlassCard className="h-full p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mb-4 text-white shadow-lg">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
