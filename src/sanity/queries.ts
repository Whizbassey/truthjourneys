import { groq } from 'next-sanity'

const authorFields = groq`
  name,
  "slug": slug.current,
  role,
  image
`

const cardFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  readingTime,
  coverImage,
  "category": category->{ title, "slug": slug.current },
  "author": author->{ ${authorFields} }
`

export const settingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title,
    tagline,
    verseTicker,
    interlude,
    subscribeTitle,
    subscribeDek,
    footerLegal
  }
`

/** The hero essay: an explicitly featured post, else the most recent one. */
export const featuredPostQuery = groq`
  coalesce(
    *[_type == "post" && featured == true && defined(slug.current)]
      | order(publishedAt desc)[0]{ ${cardFields}, dek },
    *[_type == "post" && defined(slug.current)]
      | order(publishedAt desc)[0]{ ${cardFields}, dek }
  )
`

/** Latest posts, optionally excluding the one already used as the hero. */
export const latestPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && _id != $excludeId]
    | order(publishedAt desc)[0...$limit]{ ${cardFields} }
`

export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[$from...$to]{ ${cardFields} }
`

export const postCountQuery = groq`count(*[_type == "post" && defined(slug.current)])`

export const pillarsQuery = groq`
  *[_type == "category" && defined(slug.current)]
    | order(coalesce(order, 99) asc, title asc)[0...4]{
      _id, title, "slug": slug.current, blurb, description, image
    }
`

export const allCategoriesQuery = groq`
  *[_type == "category" && defined(slug.current)]
    | order(coalesce(order, 99) asc, title asc){
      _id, title, "slug": slug.current, blurb, description, image
    }
`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`

export const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)].slug.current
`

export const seriesSlugsQuery = groq`
  *[_type == "series" && defined(slug.current)].slug.current
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${cardFields},
    dek,
    coverCaption,
    body[]{
      ...,
      _type == "image" => { ..., asset-> },
      markDefs[]{ ..., _type == "internalLink" => { ..., "slug": @.reference->slug.current } }
    },
    marginNotes[]{ _key, reference, text },
    part,
    "series": series->{ _id, title, "slug": slug.current, partCount }
  }
`

/** Previous/next parts within a series, used by the article footer. */
export const seriesNeighboursQuery = groq`
  {
    "previous": *[_type == "post" && series._ref == $seriesId && part < $part]
      | order(part desc)[0]{ title, "slug": slug.current, part },
    "next": *[_type == "post" && series._ref == $seriesId && part > $part]
      | order(part asc)[0]{ title, "slug": slug.current, part }
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, blurb, description, image
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $slug && defined(slug.current)]
    | order(publishedAt desc){ ${cardFields} }
`

export const seriesBySlugQuery = groq`
  *[_type == "series" && slug.current == $slug][0]{
    title, "slug": slug.current, description, partCount, image
  }
`

export const postsBySeriesQuery = groq`
  *[_type == "post" && series->slug.current == $slug && defined(slug.current)]
    | order(coalesce(part, 999) asc, publishedAt asc){ ${cardFields}, part }
`

export const allSeriesQuery = groq`
  *[_type == "series" && defined(slug.current)] | order(title asc){
    title, "slug": slug.current, description, partCount, image
  }
`

/** Everything the RSS feed and sitemap need, in one pass. */
export const feedQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...50]{
    title, "slug": slug.current, excerpt, publishedAt, _updatedAt,
    "category": category->title,
    "author": author->name
  }
`
