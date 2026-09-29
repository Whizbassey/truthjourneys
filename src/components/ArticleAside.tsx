'use client'

import { useEffect, useState } from 'react'

import { toRoman } from '@/lib/format'
import type { Heading } from './PortableBody'

/** Thin gold bar under the masthead showing how far through the essay you are. */
export function ReadingProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setPercent(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="progress" aria-hidden="true">
      <div className="progress__bar" style={{ width: `${percent}%` }} />
    </div>
  )
}

/** "In this essay" — Roman-numbered contents that highlight the current section. */
export function ArticleToc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (!headings.length) return

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost heading currently in the upper band of the viewport wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="toc" aria-label="In this essay">
      <div className="toc__label">In this essay</div>
      {headings.map((heading, index) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          data-active={heading.id === activeId ? 'true' : undefined}
        >
          {toRoman(index + 1)}. {heading.text}
        </a>
      ))}
    </nav>
  )
}
