import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CodexList } from '@/components/Sections'
import { sanityFetch } from '@/sanity/client'
import { postsBySeriesQuery, seriesBySlugQuery, seriesSlugsQuery } from '@/sanity/queries'
import type { PostSummary } from '@/sanity/types'

export const revalidate = 60

type Params = { params: Promise<{ slug: string }> }

type Series = {
  title: string
  slug: string
  description: string | null
  partCount: number | null
}

async function getSeries(slug: string) {
  return sanityFetch<Series | null>(seriesBySlugQuery, null, {
    params: { slug },
    tags: ['series', `series:${slug}`],
  })
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(seriesSlugsQuery, [], { revalidate: 3600 })
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const series = await getSeries(slug)
  if (!series) return { title: 'Series not found' }
  return {
    title: series.title,
    description: series.description ?? undefined,
    alternates: { canonical: `/series/${series.slug}` },
  }
}

export default async function SeriesPage({ params }: Params) {
  const { slug } = await params
  const series = await getSeries(slug)
  if (!series) notFound()

  const posts = await sanityFetch<PostSummary[]>(postsBySeriesQuery, [], {
    params: { slug },
    tags: ['post', `series:${slug}`],
  })

  return (
    <>
      <div className="page-head">
        <h1 className="page-head__title">{series.title}</h1>
        {series.description ? <p className="page-head__dek">{series.description}</p> : null}
        {series.partCount ? (
          <p className="label label--muted">{series.partCount} parts</p>
        ) : null}
      </div>

      <div className="section-body">
        {posts.length ? (
          <CodexList posts={posts} label="Read in order" />
        ) : (
          <p className="empty-state">This series has no published parts yet.</p>
        )}
      </div>
    </>
  )
}
