import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Interlude, PillarGrid, PostGrid, SectionHead } from '@/components/Sections'
import { SubscribeForm } from '@/components/SubscribeForm'
import { getSettings } from '@/lib/site'
import { sanityFetch } from '@/sanity/client'
import { featuredPostQuery, latestPostsQuery, pillarsQuery } from '@/sanity/queries'
import type { Category, Post, PostSummary } from '@/sanity/types'

export const revalidate = 60

export default async function HomePage() {
  const settings = await getSettings()

  const featured = await sanityFetch<Post | null>(featuredPostQuery, null, {
    tags: ['post'],
  })

  const [pillars, latest] = await Promise.all([
    sanityFetch<Category[]>(pillarsQuery, [], { tags: ['category'] }),
    sanityFetch<PostSummary[]>(latestPostsQuery, [], {
      params: { limit: 3, excludeId: featured?._id ?? '' },
      tags: ['post'],
    }),
  ])

  return (
    <>
      {featured ? (
        <Hero post={featured} />
      ) : (
        <section className="page-head">
          <h1 className="page-head__title">LOGOS</h1>
          <p className="page-head__dek">
            The journal is ready. Publish your first essay in the Studio and it will
            appear here.
          </p>
          <p style={{ marginTop: 18 }}>
            <Link href="/studio" className="btn">
              Open the Studio
            </Link>
          </p>
        </section>
      )}

      {pillars.length > 0 ? (
        <>
          <SectionHead
            title="The Four Pillars"
            dek="Ancient wisdom for a modern world."
          />
          <PillarGrid pillars={pillars} />
        </>
      ) : null}

      {latest.length > 0 ? (
        <>
          <SectionHead title="Latest Writings" dek="Reflections for the journey." />
          <PostGrid posts={latest} />
        </>
      ) : null}

      {settings.interlude ? (
        <Interlude
          text={settings.interlude.text}
          reference={settings.interlude.reference}
          image={settings.interlude.image}
        />
      ) : null}

      <SubscribeForm title={settings.subscribeTitle} dek={settings.subscribeDek} />
    </>
  )
}
