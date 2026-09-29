import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleToc, ReadingProgress } from '@/components/ArticleAside'
import { Media } from '@/components/Media'
import { PortableBody, extractHeadings } from '@/components/PortableBody'
import { formatLongDate, readingMinutes, toIsoDate, toPlainText, toRoman } from '@/lib/format'
import { sanityFetch } from '@/sanity/client'
import { siteUrl } from '@/sanity/env'
import { imageUrl } from '@/sanity/image'
import { postBySlugQuery, postSlugsQuery, seriesNeighboursQuery } from '@/sanity/queries'
import type { Post, SeriesNeighbour } from '@/sanity/types'

export const revalidate = 60

type Params = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  return sanityFetch<Post | null>(postBySlugQuery, null, {
    params: { slug },
    tags: ['post', `post:${slug}`],
  })
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(postSlugsQuery, [], { revalidate: 3600 })
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Essay not found' }

  const description = post.excerpt ?? post.dek ?? toPlainText(post.body, 200)
  const image = imageUrl(post.coverImage, 1200, 630)

  return {
    title: post.title,
    description,
    alternates: { canonical: `/essays/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `${siteUrl}/essays/${post.slug}`,
      publishedTime: toIsoDate(post.publishedAt),
      authors: post.author?.name ? [post.author.name] : undefined,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
    },
  }
}

export default async function EssayPage({ params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const headings = extractHeadings(post.body)
  const minutes = readingMinutes(post.readingTime, post.body)

  const neighbours =
    post.series && post.part
      ? await sanityFetch<{ previous: SeriesNeighbour; next: SeriesNeighbour }>(
          seriesNeighboursQuery,
          { previous: null, next: null },
          {
            params: { seriesId: post.series._id, part: post.part },
            tags: ['post'],
          },
        )
      : { previous: null, next: null }

  const kicker = [
    post.category?.title,
    post.series?.title,
    post.part ? `Part ${toRoman(post.part)}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? post.dek ?? undefined,
    datePublished: toIsoDate(post.publishedAt),
    author: post.author?.name
      ? { '@type': 'Person', name: post.author.name }
      : undefined,
    publisher: { '@type': 'Organization', name: 'LOGOS' },
    mainEntityOfPage: `${siteUrl}/essays/${post.slug}`,
    image: imageUrl(post.coverImage, 1200, 630) ?? undefined,
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />

      <header className="article-head">
        {kicker ? <div className="article-head__kicker">{kicker}</div> : null}
        <h1 className="article-head__title">{post.title}</h1>
        {post.dek ? <p className="article-head__dek">{post.dek}</p> : null}

        <div className="article-head__byline">
          {post.author ? (
            <>
              <Media
                image={post.author.image}
                width={40}
                height={40}
                alt=""
                className="article-head__avatar"
              />
              <strong>{post.author.name}</strong>
              <span aria-hidden="true">·</span>
            </>
          ) : null}
          {post.publishedAt ? (
            <>
              <time dateTime={toIsoDate(post.publishedAt)}>
                {formatLongDate(post.publishedAt)}
              </time>
              {minutes ? <span aria-hidden="true">·</span> : null}
            </>
          ) : null}
          {minutes ? <span>{minutes} min read</span> : null}
        </div>
      </header>

      {post.coverImage ? (
        <figure className="article-cover">
          <Media
            image={post.coverImage}
            width={1184}
            height={520}
            alt={post.coverImage.alt ?? ''}
            className="article-cover__media"
            sizes="(max-width: 1280px) 100vw, 1184px"
            priority
          />
          {post.coverCaption ? (
            <figcaption className="article-cover__caption">{post.coverCaption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="article-grid">
        <ArticleToc headings={headings} />

        <PortableBody body={post.body} />

        {post.marginNotes?.length ? (
          <aside className="margin-notes" aria-label="Notes">
            {post.marginNotes.map((note) => (
              <div className="margin-note" key={note._key}>
                <div className="margin-note__ref">{note.reference}</div>
                <p className="margin-note__text">{note.text}</p>
              </div>
            ))}
          </aside>
        ) : (
          <div />
        )}
      </div>

      {neighbours.previous || neighbours.next ? (
        <nav className="series-nav" aria-label="Series">
          {neighbours.previous ? (
            <Link
              href={`/essays/${neighbours.previous.slug}`}
              className="series-nav__item"
            >
              <div className="series-nav__label">
                &larr; Part {toRoman(neighbours.previous.part ?? 0)}
              </div>
              <p className="series-nav__title">{neighbours.previous.title}</p>
            </Link>
          ) : (
            <div />
          )}

          {neighbours.next ? (
            <Link
              href={`/essays/${neighbours.next.slug}`}
              className="series-nav__item series-nav__item--next"
            >
              <div className="series-nav__label">
                Part {toRoman(neighbours.next.part ?? 0)} &rarr;
              </div>
              <p className="series-nav__title">{neighbours.next.title}</p>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  )
}
