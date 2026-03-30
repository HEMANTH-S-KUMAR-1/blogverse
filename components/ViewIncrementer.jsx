'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ViewIncrementer({ postId }) {
  useEffect(() => {
    const incrementViews = async () => {
      await supabase.rpc('increment_views', { post_id: postId }).catch(() => {
        // Fallback: direct update
        supabase.from('posts').update({ views: undefined }).eq('id', postId)
      })
    }

    // Simple approach: update via raw SQL through a controlled increment
    const increment = async () => {
      const { data } = await supabase
        .from('posts')
        .select('views')
        .eq('id', postId)
        .single()

      if (data) {
        await supabase
          .from('posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', postId)
      }
    }

    increment()
  }, [postId])

  return null
}
