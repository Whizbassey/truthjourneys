import { sanityFetch } from '@/sanity/client'
import { siteUrl } from '@/sanity/env'
import { feedQuery } from '@/sanity/queries'

export const revalidate = 3600

type FeedItem = {
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  category: string | null
  author: string | null
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await sanityFetch<FeedItem[]>(feedQuery, [], { tags: ['post'] })

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/essays/${post.slug}`
      const date = post.publishedAt ? new Date(post.publishedAt).toUTCString() : ''
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        post.excerpt ? `      <description>${escapeXml(post.excerpt)}</description>` : '',
        post.category ? `      <category>${escapeXml(post.category)}</category>` : '',
        post.author ? `      <dc:creator>${escapeXml(post.author)}</dc:creator>` : '',
        date ? `      <pubDate>${date}</pubDate>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LOGOS — a journal of Christ in all things</title>
    <link>${siteUrl}</link>
    <description>Essays on Scripture, the Church Fathers, prayer and sacred art.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
