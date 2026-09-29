import Link from 'next/link'

import { Media } from '@/components/Media'
import type { Post } from '@/sanity/types'

type Props = {
  post: Pick<
    Post,
    'title' | 'slug' | 'dek' | 'excerpt' | 'coverImage' | 'category' | 'readingTime'
  >
}

/** The featured essay (mockup 2a): image right, text over a gradient into --bg. */
export function Hero({ post }: Props) {
  const kicker = ['Featured Essay', post.category?.title].filter(Boolean).join(' · ')

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Media
        image={post.coverImage}
        width={900}
        height={540}
        alt={post.coverImage?.alt ?? ''}
        className="hero__media"
        sizes="(max-width: 860px) 100vw, 62vw"
        priority
      />
      <div className="hero__scrim" />

      <div className="hero__body">
        <div className="label label--lg">{kicker}</div>
        <h1 className="hero__title" id="hero-title">
          {post.title}
        </h1>
        <div className="hairline" />
        {post.dek || post.excerpt ? (
          <p className="hero__dek">{post.dek ?? post.excerpt}</p>
        ) : null}
        <div className="hero__actions">
          <Link href={`/essays/${post.slug}`} className="btn">
            Read the essay <span aria-hidden="true">&rarr;</span>
          </Link>
          {post.readingTime ? (
            <span className="hero__meta">{post.readingTime} min read</span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
