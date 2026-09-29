import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostGrid } from '@/components/Sections'
import { sanityFetch } from '@/sanity/client'
import { imageUrl } from '@/sanity/image'
import {
  categoryBySlugQuery,
  categorySlugsQuery,
  postsByCategoryQuery,
} from '@/sanity/queries'
import type { Category, PostSummary } from '@/sanity/types'

export const revalidate = 60

type Params = { params: Promise<{ slug: string }> }

async function getCategory(slug: string) {
  return sanityFetch<Category | null>(categoryBySlugQuery, null, {
    params: { slug },
    tags: ['category', `category:${slug}`],
  })
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(categorySlugsQuery, [], { revalidate: 3600 })
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: 'Pillar not found' }

  const image = imageUrl(category.image, 1200, 630)
  return {
    title: category.title,
    description: category.description ?? category.blurb ?? undefined,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: category.title,
      description: category.description ?? category.blurb ?? undefined,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  const posts = await sanityFetch<PostSummary[]>(postsByCategoryQuery, [], {
    params: { slug },
    tags: ['post', `category:${slug}`],
  })

  return (
    <>
      <div className="page-head">
        <h1 className="page-head__title">{category.title}</h1>
        {category.description || category.blurb ? (
          <p className="page-head__dek">{category.description ?? category.blurb}</p>
        ) : null}
      </div>

      {posts.length ? (
        <PostGrid posts={posts} />
      ) : (
        <p className="empty-state">No essays under this pillar yet.</p>
      )}
    </>
  )
}
