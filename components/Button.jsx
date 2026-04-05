'use client'

import { forwardRef } from 'react'

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
      ghost: 'bg-transparent border border-border hover:bg-border',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
