'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100))
      setProgress(pct)
      setVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gray-200/50 dark:bg-gray-800/50"
      aria-hidden="true"
    >
      <div
        className="h-full bg-emerald-500 transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
