import type { Metadata } from 'next'
import Link from 'next/link'

import { CodexList } from '@/components/Sections'
import { sanityFetch } from '@/sanity/client'
import { allPostsQuery, postCountQuery } from '@/sanity/queries'
import type { PostSummary } from '@/sanity/types'

export const revalidate = 60

const PER_PAGE = 12

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Every essay published in LOGOS, newest first.',
  alternates: { canonical: '/archive' },
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const current = Math.max(1, Number.parseInt(page ?? '1', 10) || 1)
  const from = (current - 1) * PER_PAGE

  const [posts, total] = await Promise.all([
    sanityFetch<PostSummary[]>(allPostsQuery, [], {
      params: { from, to: from + PER_PAGE },
      tags: ['post'],
    }),
    sanityFetch<number>(postCountQuery, 0, { tags: ['post'] }),
  ])

  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <>
      <div className="page-head">
        <h1 className="page-head__title">The Archive</h1>
        <p className="page-head__dek">
          Every essay, newest first. {total || 'No'} in all.
        </p>
      </div>

      <div className="section-body">
        {posts.length ? (
          <CodexList posts={posts} startAt={from + 1} />
        ) : (
          <p className="empty-state">Nothing here yet. The first essay is on its way.</p>
        )}
      </div>

      {lastPage > 1 ? (
        <nav className="series-nav" aria-label="Pagination">
          {current > 1 ? (
            <Link
              href={current === 2 ? '/archive' : `/archive?page=${current - 1}`}
              className="series-nav__item"
            >
              <div className="series-nav__label">&larr; Newer</div>
              <p className="series-nav__title">Page {current - 1}</p>
            </Link>
          ) : (
            <div />
          )}

          {current < lastPage ? (
            <Link
              href={`/archive?page=${current + 1}`}
              className="series-nav__item series-nav__item--next"
            >
              <div className="series-nav__label">Older &rarr;</div>
              <p className="series-nav__title">Page {current + 1}</p>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  )
}
