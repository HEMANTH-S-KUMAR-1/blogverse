'use client'

import { useState, useEffect } from 'react'
import { getSessionId } from '@/lib/d1'
import { loadReactions, submitReaction } from '@/app/actions'

const REACTIONS = [
  { type: 'Insightful', emoji: '🧠', label: 'Insightful' },
  { type: 'Helpful', emoji: '👍', label: 'Helpful' },
  { type: 'Relatable', emoji: '❤️', label: 'Relatable' },
  { type: 'Inspiring', emoji: '⭐', label: 'Inspiring' },
  { type: 'Disagree', emoji: '🤔', label: 'Disagree' },
]

export default function ReactionBar({ postId }) {
  const [counts, setCounts] = useState({})
  const [userReaction, setUserReaction] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchReactions = async () => {
    const sessionId = getSessionId()
    const result = await loadReactions(postId, sessionId)

    if (result.all && result.all.length > 0) {
      const grouped = {}
      result.all.forEach(r => {
        grouped[r.reaction_type] = (grouped[r.reaction_type] || 0) + 1
      })
      setCounts(grouped)
    }

    if (result.user && result.user.length > 0) {
      setUserReaction(result.user[0].reaction_type)
    }
  }

  useEffect(() => {
    fetchReactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const handleReaction = async (type) => {
    if (loading || userReaction) return
    setLoading(true)

    const sessionId = getSessionId()
    const { success } = await submitReaction(postId, sessionId, type)

    if (success) {
      setUserReaction(type)
      setCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {REACTIONS.map(r => (
        <button
          key={r.type}
          onClick={() => handleReaction(r.type)}
          disabled={loading || !!userReaction}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
            userReaction === r.type
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 scale-105 shadow-lg shadow-emerald-500/10'
              : userReaction
              ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:scale-105'
          }`}
          id={`reaction-${r.type.toLowerCase()}`}
        >
          <span className="text-lg">{r.emoji}</span>
          <span className="hidden sm:inline">{r.label}</span>
          <span className="text-xs opacity-70">{counts[r.type] || 0}</span>
        </button>
      ))}
    </div>
  )
}
