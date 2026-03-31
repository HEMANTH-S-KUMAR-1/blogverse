'use client'

import { CATEGORY_CONFIG } from '@/lib/d1'
import Link from 'next/link'

export default function CategoryFilter() {
  const categories = Object.entries(CATEGORY_CONFIG)

  const buttonClasses = {
    health: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40',
    tech: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40',
    finance: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40',
    student: 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40',
    business: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40',
    eco: 'bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/40',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(([key, cat]) => (
          <Link
            key={key}
            href={`/category/${key}`}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all hover:scale-105 ${buttonClasses[key]}`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
