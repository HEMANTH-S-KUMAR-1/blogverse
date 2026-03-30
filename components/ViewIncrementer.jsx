'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ViewIncrementer({ postId }) {
  useEffect(() => {
    if (!postId) return
    // Use an atomic server-side increment to avoid read-then-write race conditions
    const increment = async () => {
      const { error } = await supabase.rpc('increment_views', { post_id: postId })
      if (error) console.error('Failed to increment views:', error.message)
    }
    increment()
  }, [postId])

  return null
}
