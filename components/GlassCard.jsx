'use client'

export default function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`
        relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
        shadow-lg hover:shadow-xl hover:border-cyan-400/30 transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  )
}
