'use client'

import { supabase, getSessionId, CATEGORY_CONFIG } from '@/lib/supabase'

export default function AffiliateBanner({ category, postId }) {
  const cat = CATEGORY_CONFIG[category]
  if (!cat || !cat.affiliate) return null

  const { name, url, desc } = cat.affiliate

  const categoryBorderClasses = {
    health: 'border-emerald-200 dark:border-emerald-800',
    tech: 'border-blue-200 dark:border-blue-800',
    finance: 'border-amber-200 dark:border-amber-800',
    student: 'border-violet-200 dark:border-violet-800',
    business: 'border-red-200 dark:border-red-800',
    eco: 'border-teal-200 dark:border-teal-800',
  }

  const categoryBgClasses = {
    health: 'bg-emerald-50 dark:bg-emerald-900/10',
    tech: 'bg-blue-50 dark:bg-blue-900/10',
    finance: 'bg-amber-50 dark:bg-amber-900/10',
    student: 'bg-violet-50 dark:bg-violet-900/10',
    business: 'bg-red-50 dark:bg-red-900/10',
    eco: 'bg-teal-50 dark:bg-teal-900/10',
  }

  const categoryBtnClasses = {
    health: 'bg-emerald-500 hover:bg-emerald-600',
    tech: 'bg-blue-500 hover:bg-blue-600',
    finance: 'bg-amber-500 hover:bg-amber-600',
    student: 'bg-violet-500 hover:bg-violet-600',
    business: 'bg-red-500 hover:bg-red-600',
    eco: 'bg-teal-500 hover:bg-teal-600',
  }

  const handleClick = async () => {
    const sessionId = getSessionId()
    await supabase.from('affiliate_clicks').insert({
      affiliate_name: name,
      post_id: postId || null,
      session_id: sessionId,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`rounded-xl border ${categoryBorderClasses[category]} ${categoryBgClasses[category]} p-4`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Sponsored</p>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
      <button
        onClick={handleClick}
        className={`mt-3 w-full py-2 rounded-lg text-white text-xs font-medium transition-colors ${categoryBtnClasses[category]}`}
      >
        Visit {name} →
      </button>
    </div>
  )
}
