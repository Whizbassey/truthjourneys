import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react'
import Link from 'next/link'

import { slugifyHeading } from '@/lib/format'
import { imageUrl } from '@/sanity/image'

/** Text of a heading block, used for both its anchor id and the contents list. */
function headingText(value: any): string {
  return (value?.children ?? []).map((child: any) => child?.text ?? '').join('')
}

export type Heading = { id: string; text: string; level: 2 | 3 }

/**
 * Anchor ids are assigned by walking the headings in document order and
 * suffixing repeats. `extractHeadings` and the renderer below both use this,
 * so the contents list and the headings it points at can never disagree.
 */
function makeIdAssigner() {
  const seen = new Map<string, number>()
  return (text: string): string => {
    const base = slugifyHeading(text) || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count ? `${base}-${count + 1}` : base
  }
}

/** Pull the section headings out of a body so the sidebar can list them. */
export function extractHeadings(body: PortableTextBlock[] | null | undefined): Heading[] {
  if (!Array.isArray(body)) return []
  const assignId = makeIdAssigner()

  return body
    .filter(
      (block: any) =>
        block?._type === 'block' && (block.style === 'h2' || block.style === 'h3'),
    )
    .map((block: any) => {
      const text = headingText(block)
      return {
        id: assignId(text),
        text,
        level: block.style === 'h2' ? (2 as const) : (3 as const),
      }
    })
    .filter((heading) => heading.text.length > 0)
}

function createComponents(): PortableTextComponents {
  // One assigner per article render, consumed in the same order as above.
  const assignId = makeIdAssigner()

  return {
  block: {
    h2: ({ value, children }) => <h2 id={assignId(headingText(value))}>{children}</h2>,
    h3: ({ value, children }) => <h3 id={assignId(headingText(value))}>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },

  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    internalLink: ({ value, children }) =>
      value?.slug ? <Link href={`/essays/${value.slug}`}>{children}</Link> : <>{children}</>,
  },

  types: {
    /** The bordered, centred scripture band from mockup 1c. */
    verse: ({ value }) => (
      <figure className="verse-block">
        <blockquote className="verse-block__text">&ldquo;{value?.text}&rdquo;</blockquote>
        <figcaption className="verse-block__ref">{value?.reference}</figcaption>
      </figure>
    ),

    image: ({ value }) => {
      const src = imageUrl(value, 1360)
      if (!src) return null
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={value?.alt ?? ''} loading="lazy" decoding="async" />
          {value?.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      )
    },
  },
  }
}

export function PortableBody({ body }: { body: PortableTextBlock[] | null | undefined }) {
  if (!Array.isArray(body) || body.length === 0) return null
  return (
    <div className="article-body">
      <PortableText value={body} components={createComponents()} />
    </div>
  )
}
