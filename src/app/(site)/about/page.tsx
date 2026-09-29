import type { Metadata } from 'next'

import { SectionHead } from '@/components/Sections'
import { sanityFetch } from '@/sanity/client'
import { allSeriesQuery } from '@/sanity/queries'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About',
  description:
    'LOGOS reads Scripture the way the ancient Church did — with Christ as the key that unlocks every page.',
  alternates: { canonical: '/about' },
}

type Series = {
  title: string
  slug: string
  description: string | null
  partCount: number | null
}

export default async function AboutPage() {
  const series = await sanityFetch<Series[]>(allSeriesQuery, [], { tags: ['series'] })

  return (
    <>
      <div className="page-head">
        <h1 className="page-head__title">Our Rule</h1>
        <p className="page-head__dek">Every word, bent toward the Word.</p>
      </div>

      <div className="article-grid">
        <div />
        <div className="article-body">
          <p>
            LOGOS reads Scripture the way the ancient Church did — with Christ as the key
            that unlocks every page. Essays on the Bible, the Fathers, prayer and sacred
            art, published one at a time and meant to be read slowly.
          </p>
          <p>
            Scripture is quoted throughout in the Authorised Version. Where the Fathers
            are cited, the source and date are given in the margin so you can follow the
            thread back yourself.
          </p>
        </div>
        <div />
      </div>

      {series.length ? (
        <>
          <SectionHead title="Series &amp; Pilgrimages" dek="Read in order." />
          <div className="section-body">
            {series.map((item) => (
              <Link key={item.slug} href={`/series/${item.slug}`} className="codex__item">
                <div className="codex__numeral" aria-hidden="true">
                  &#10013;
                </div>
                <div className="codex__kicker">
                  {item.partCount ? `${item.partCount} parts` : 'Series'}
                </div>
                <h3 className="codex__title">{item.title}</h3>
                <div className="codex__meta">{item.description ?? ''}</div>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}
