/**
 * Sanity environment.
 *
 * The site is designed to boot and render (with empty states) before Sanity is
 * wired up, so a missing project id is a soft condition rather than a crash.
 * Anything that actually talks to the API checks `isSanityConfigured` first.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01'

export const isSanityConfigured = projectId.length > 0

/** Placeholder so `sanity.config.ts` can be imported before setup is finished. */
export const studioProjectId = isSanityConfigured ? projectId : 'missing-project-id'

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '')
