'use client'

import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

export default function AnalyticsCard({ icon: Icon, title, value, trend, description, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`p-6 h-full ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            {Icon && <Icon className="w-6 h-6" />}
          </div>
          {trend && (
            <div className={`text-sm font-bold ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <h3 className="text-sm text-slate-400 mb-1">{title}</h3>
        <div className="text-3xl font-black text-emerald-400 mb-2">{value}</div>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </GlassCard>
    </motion.div>
  )
}
