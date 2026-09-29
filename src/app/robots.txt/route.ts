import { siteUrl } from '@/sanity/env'

/**
 * Written as a route handler rather than Next's `robots.ts` metadata file.
 * The metadata loader inlines the project's absolute path into a quoted
 * string without escaping it, which breaks on any directory name containing
 * an apostrophe. This form behaves identically and has no such constraint.
 */
export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /studio',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
