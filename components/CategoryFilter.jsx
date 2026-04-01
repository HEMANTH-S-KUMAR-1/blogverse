'use client'

import { CATEGORY_CONFIG } from '@/lib/d1'
import Link from 'next/link'

export default function CategoryFilter() {
  const categories = Object.entries(CATEGORY_CONFIG)

  const borderClasses = {
    health: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/10',
    tech: 'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/10',
    finance: 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/10',
    student: 'border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/10',
    business: 'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/10',
    eco: 'border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-900/10',
  }

  const dotClasses = {
    health: 'bg-emerald-500',
    tech: 'bg-blue-500',
    finance: 'bg-amber-500',
    student: 'bg-violet-500',
    business: 'bg-red-500',
    eco: 'bg-teal-500',
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map(([key, cat]) => (
        <Link
          key={key}
          href={`/category/${key}`}
          className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all hover:-translate-y-1 hover:shadow-lg ${borderClasses[key] || 'border-border'}`}
        >
          <span className={`w-2 h-2 rounded-full ${dotClasses[key] || 'bg-slate-400'}`} />
          {cat.label}
        </Link>
      ))}
    </div>
  )
}
