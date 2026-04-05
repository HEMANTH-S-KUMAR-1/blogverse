'use client'

import { useEffect, useState, useRef, useMemo } from 'react'

export default function TableOfContents({ content }) {
  const [activeId, setActiveId] = useState('')
  const observerRef = useRef(null)

  // Parse headings with useMemo — no setState inside useEffect
  const headings = useMemo(() => {
    if (!content) return []
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const els = Array.from(doc.querySelectorAll('h2, h3'))
    if (els.length < 2) return []
    return els.map((el, i) => ({
      id: `heading-${i}`,
      text: el.textContent.trim(),
      level: parseInt(el.tagName[1]),
    }))
  }, [content])

  useEffect(() => {
    if (!headings.length) return

    // Assign IDs to actual DOM headings
    const articleHeadings = document.querySelectorAll('article h2, article h3')
    articleHeadings.forEach((el, i) => { el.id = `heading-${i}` })

    // Highlight active section as user scrolls
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )
    articleHeadings.forEach((el) => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? '12px' : '0' }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`block text-sm leading-snug transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  activeId === h.id
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {h.level === 3 && (
                  <span className="inline-block w-1 h-1 rounded-full bg-current mr-2 opacity-50 mb-0.5" />
                )}
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
