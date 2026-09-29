import { sanityFetch } from '@/sanity/client'
import { siteUrl } from '@/sanity/env'
import { categorySlugsQuery, feedQuery, seriesSlugsQuery } from '@/sanity/queries'

export const revalidate = 3600

type FeedItem = { slug: string; publishedAt: string | null; _updatedAt: string | null }

type Entry = { loc: string; lastmod?: string; changefreq: string; priority: string }

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Written as a route handler rather than Next's `sitemap.ts` metadata file,
 * for the same reason as robots.txt — see the note there.
 */
export async function GET() {
  const [posts, categories, series] = await Promise.all([
    sanityFetch<FeedItem[]>(feedQuery, [], { tags: ['post'] }),
    sanityFetch<string[]>(categorySlugsQuery, [], { tags: ['category'] }),
    sanityFetch<string[]>(seriesSlugsQuery, [], { tags: ['series'] }),
  ])

  const entries: Entry[] = [
    { loc: siteUrl, changefreq: 'weekly', priority: '1.0' },
    { loc: `${siteUrl}/archive`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${siteUrl}/about`, changefreq: 'yearly', priority: '0.4' },
    ...posts.map((post) => ({
      loc: `${siteUrl}/essays/${post.slug}`,
      lastmod: post._updatedAt ?? post.publishedAt ?? undefined,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    ...categories.map((slug) => ({
      loc: `${siteUrl}/category/${slug}`,
      changefreq: 'weekly',
      priority: '0.6',
    })),
    ...series.map((slug) => ({
      loc: `${siteUrl}/series/${slug}`,
      changefreq: 'monthly',
      priority: '0.5',
    })),
  ]

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? new Date(entry.lastmod) : null
      const lastmodTag =
        lastmod && !Number.isNaN(lastmod.getTime())
          ? `    <lastmod>${lastmod.toISOString()}</lastmod>\n`
          : ''
      return (
        '  <url>\n' +
        `    <loc>${escapeXml(entry.loc)}</loc>\n` +
        lastmodTag +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        '  </url>'
      )
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
