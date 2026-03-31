'use client'

import { useEffect } from 'react'
import { incrementViews } from '@/app/actions'

export default function ViewIncrementer({ postId }) {
  useEffect(() => {
    if (!postId) return
    // Use an atomic server-side increment to avoid read-then-write race conditions
    const increment = async () => {
      const { success } = await incrementViews(postId)
      if (!success) console.error('Failed to increment views')
    }
    increment()
  }, [postId])

  return null
}
