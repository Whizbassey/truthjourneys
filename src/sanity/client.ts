import 'server-only'

import { createClient, type QueryParams } from 'next-sanity'

import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

/** Write-capable client. Only used by the subscribe route. */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!isSanityConfigured || !token) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })
}

type FetchOptions = {
  params?: QueryParams
  /** Cache tags so a publish webhook can refresh exactly the affected pages. */
  tags?: string[]
  revalidate?: number
}

/**
 * Query Sanity, falling back to `fallback` when the project is not configured
 * yet or the request fails. Content pages should never hard-fail on a CMS blip.
 */
export async function sanityFetch<T>(
  query: string,
  fallback: T,
  { params = {}, tags = [], revalidate = 60 }: FetchOptions = {},
): Promise<T> {
  if (!client) return fallback

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate, tags },
    })
  } catch (error) {
    console.error('[sanity] query failed:', error)
    return fallback
  }
}
