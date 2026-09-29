import type { PortableTextBlock } from '@portabletext/react'

import type { SanityImage } from './image'

export type Author = {
  name: string
  slug: string | null
  role: string | null
  image: SanityImage | null
}

export type Category = {
  _id: string
  title: string
  slug: string
  /** Short italic line shown under the pillar title on the homepage. */
  blurb: string | null
  description: string | null
  image: SanityImage | null
}

export type SeriesSummary = {
  _id: string
  title: string
  slug: string
  partCount: number | null
}

export type PostSummary = {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  readingTime: number | null
  coverImage: SanityImage | null
  category: Pick<Category, 'title' | 'slug'> | null
  author: Author | null
}

export type MarginNote = {
  _key: string
  reference: string
  text: string
}

export type Post = PostSummary & {
  dek: string | null
  coverCaption: string | null
  body: PortableTextBlock[] | null
  marginNotes: MarginNote[] | null
  series: SeriesSummary | null
  part: number | null
}

export type SeriesNeighbour = {
  title: string
  slug: string
  part: number | null
} | null

export type SiteSettings = {
  title: string
  tagline: string
  /** Three short scripture lines for the band across the top of every page. */
  verseTicker: string[]
  interlude: {
    text: string
    reference: string
    image: SanityImage | null
  } | null
  subscribeTitle: string
  subscribeDek: string
  footerLegal: string
}
