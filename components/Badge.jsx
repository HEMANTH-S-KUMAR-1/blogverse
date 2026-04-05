'use client'

export default function Badge({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    glass: 'bg-white/10 text-white border border-white/20',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
