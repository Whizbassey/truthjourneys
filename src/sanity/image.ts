import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, isSanityConfigured, projectId } from './env'

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null

export type SanityImage = Image & {
  alt?: string
  caption?: string
}

/**
 * Build a CDN URL for a Sanity image, cropped to the given box.
 * Returns null when there is no image, so callers can fall back to the
 * parchment/stone placeholder from the mockups.
 */
export function imageUrl(
  source: SanityImage | null | undefined,
  width: number,
  height?: number,
): string | null {
  if (!builder || !source?.asset) return null

  let url = builder.image(source).width(width).auto('format').fit('crop')
  if (height) url = url.height(height)
  return url.url()
}
