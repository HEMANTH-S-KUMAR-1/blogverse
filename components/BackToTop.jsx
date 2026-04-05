'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!show) return null

  return (
    <button
      onClick={scrollTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
