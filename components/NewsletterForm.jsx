'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim() })

    if (error) {
      if (error.code === '23505') {
        toast.error('This email is already subscribed!')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } else {
      toast.success('Welcome to the BlogVerse newsletter! 🎉')
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10  p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">📬 Stay Updated</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get the best posts delivered to your inbox weekly.</p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          required
          id="newsletter-email"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors shrink-0"
          id="newsletter-subscribe-btn"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
