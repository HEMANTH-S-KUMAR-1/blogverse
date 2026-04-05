'use client'

import { motion } from 'framer-motion'
import GlassCard from './GlassCard'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Travel Blogger',
    avatar: '👩‍🌻',
    content: 'BlogVerse gave me a platform to share my stories without compromises. The community is supportive and the monetization options are game-changing.',
    rating: 5,
  },
  {
    name: 'Alex Kumar',
    role: 'Tech Writer',
    avatar: '👨‍💻',
    content: 'Finally, a blogging platform that respects creators. No algorithms limiting my reach, just pure connection with readers who care.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'Wellness Coach',
    avatar: '👩‍🏫',
    content: 'The editor is intuitive, the community is amazing, and I actually earn from my passion. What more could I ask for?',
    rating: 5,
  },
]

export default function TestimonialSection() {
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Loved by creators worldwide
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands of writers, creators, and storytellers who are building their audience on BlogVerse.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <GlassCard className="p-8 h-full flex flex-col">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 flex-1 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
