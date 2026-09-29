import Link from 'next/link'

import { formatCardDate, toRoman } from '@/lib/format'
import type { Category, PostSummary } from '@/sanity/types'

import { Media } from './Media'

/** Rule — centred title — rule (mockup 2a). */
export function SectionHead({
  title,
  dek,
  id,
}: {
  title: string
  dek?: string | null
  id?: string
}) {
  return (
    <div className="section-head" id={id}>
      <div className="section-head__rule" />
      <div className="section-head__text">
        <h2 className="section-head__title">{title}</h2>
        {dek ? <p className="section-head__dek">{dek}</p> : null}
      </div>
      <div className="section-head__rule" />
    </div>
  )
}

export function PillarGrid({ pillars }: { pillars: Category[] }) {
  if (!pillars.length) return null
  return (
    <div className="pillars">
      {pillars.map((pillar) => (
        <Link key={pillar._id} href={`/category/${pillar.slug}`} className="pillar">
          <Media
            image={pillar.image}
            width={300}
            height={290}
            alt={pillar.image?.alt ?? ''}
            className="pillar__media"
            sizes="(max-width: 520px) 100vw, (max-width: 1080px) 50vw, 25vw"
          />
          <h3 className="pillar__title">{pillar.title}</h3>
          <div className="pillar__hairline" />
          {pillar.blurb ? <p className="pillar__dek">{pillar.blurb}</p> : null}
        </Link>
      ))}
    </div>
  )
}

export function PostCard({ post }: { post: PostSummary }) {
  const meta = [post.category?.title, formatCardDate(post.publishedAt)]
    .filter(Boolean)
    .join('  |  ')

  return (
    <Link href={`/essays/${post.slug}`} className="post-card">
      <Media
        image={post.coverImage}
        width={420}
        height={250}
        alt={post.coverImage?.alt ?? ''}
        className="post-card__media"
        sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 33vw"
      />
      <div className="post-card__body">
        {meta ? <div className="post-card__meta">{meta}</div> : null}
        <h3 className="post-card__title">{post.title}</h3>
        {post.excerpt ? <p className="post-card__excerpt">{post.excerpt}</p> : null}
        <div className="post-card__more">Read more &rarr;</div>
      </div>
    </Link>
  )
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null
  return (
    <div className="posts">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}

/** Full-bleed scripture panel over a darkened image (mockup 2a). */
export function Interlude({
  text,
  reference,
  image,
}: {
  text: string
  reference: string
  image: PostSummary['coverImage']
}) {
  return (
    <section className="interlude" aria-label="Scripture">
      <Media
        image={image}
        width={1440}
        height={300}
        alt=""
        className="interlude__media"
        sizes="100vw"
      />
      <div className="interlude__scrim" />
      <blockquote className="interlude__body">
        <p className="interlude__quote">&ldquo;{text}&rdquo;</p>
        <div className="interlude__rule" />
        <cite className="interlude__ref">{reference}</cite>
      </blockquote>
    </section>
  )
}

/**
 * 1b's numbered codex list. Used where a dense, ordered index reads better
 * than a grid of cards — the archive and the pillar pages.
 */
export function CodexList({
  posts,
  label,
  startAt = 1,
}: {
  posts: PostSummary[]
  label?: string
  startAt?: number
}) {
  if (!posts.length) return null
  return (
    <div className="codex">
      {label ? <div className="codex__label">{label}</div> : null}
      {posts.map((post, index) => {
        const meta = [
          post.readingTime ? `${post.readingTime} min` : null,
          post.author?.name,
        ]
          .filter(Boolean)
          .join(' · ')

        return (
          <Link key={post._id} href={`/essays/${post.slug}`} className="codex__item">
            <div className="codex__numeral" aria-hidden="true">
              {toRoman(startAt + index)}
            </div>
            <div className="codex__kicker">{post.category?.title ?? 'Essay'}</div>
            <h3 className="codex__title">{post.title}</h3>
            <div className="codex__meta">{meta || formatCardDate(post.publishedAt)}</div>
          </Link>
        )
      })}
    </div>
  )
}
