'use client'

import { getSessionId, CATEGORY_CONFIG } from '@/lib/d1'
import { trackAffiliateClick } from '@/app/actions'

export default function AffiliateBanner({ category, postId }) {
  const cat = CATEGORY_CONFIG[category]
  if (!cat || !cat.affiliate) return null

  const { name, url, desc } = cat.affiliate

  const handleClick = async () => {
    const sessionId = getSessionId()
    await trackAffiliateClick(name, postId || null, sessionId)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`rounded-xl border ${cat.borderClass} ${cat.bgClass} p-4`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Sponsored</p>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{name}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
      <button
        onClick={handleClick}
        className={`mt-3 w-full py-2 rounded-lg text-white text-xs font-medium transition-colors ${cat.btnClass}`}
      >
        Visit {name} →
      </button>
    </div>
  )
}
