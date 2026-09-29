import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Sanity publish webhook.
 *
 * Pages normally refresh on their own within a minute. This endpoint makes a
 * publish show up immediately by clearing the cache tags for the document that
 * changed. Configure it in sanity.io/manage under API -> Webhooks, with the
 * same secret as SANITY_REVALIDATE_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Webhook not configured.' }, { status: 503 })
  }

  const provided =
    request.headers.get('sanity-webhook-secret') ??
    new URL(request.url).searchParams.get('secret')

  if (provided !== secret) {
    return NextResponse.json({ message: 'Bad secret.' }, { status: 401 })
  }

  let body: { _type?: string; slug?: { current?: string } | string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Could not read that request.' }, { status: 400 })
  }

  const type = body._type
  if (!type) {
    return NextResponse.json({ message: 'No document type.' }, { status: 400 })
  }

  const slug = typeof body.slug === 'string' ? body.slug : body.slug?.current

  const tags = [type]
  if (slug) tags.push(`${type}:${slug}`)
  // Settings and categories affect the header and footer on every page.
  if (type === 'siteSettings') tags.push('settings')

  tags.forEach((tag) => revalidateTag(tag))

  return NextResponse.json({ revalidated: tags })
}
