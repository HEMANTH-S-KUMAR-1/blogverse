'use client'

import { useEffect } from 'react'
import { incrementViews } from '@/app/actions'

/**
 * FIX – Session deduplication:
 * Store which post IDs have been counted in sessionStorage so refreshing the
 * page or navigating back doesn't double-count views for the same browser tab.
 * sessionStorage is cleared when the tab closes, so returning the next day
 * still registers a new view.
 */
export default function ViewIncrementer({ postId }) {
  useEffect(() => {
    if (!postId) return

    const key = `bv_viewed_${postId}`
    if (sessionStorage.getItem(key)) return   // already counted this session

    const increment = async () => {
      const { success } = await incrementViews(postId)
      if (success) {
        sessionStorage.setItem(key, '1')
      } else {
        console.error('Failed to increment views')
      }
    }

    increment()
  }, [postId])

  return null
}
