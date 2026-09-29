import { imageUrl, type SanityImage } from '@/sanity/image'

type Props = {
  image: SanityImage | null | undefined
  width: number
  height: number
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * An image from Sanity, or — when a post has no cover yet — the woven
 * parchment/stone fill the mockups used as a placeholder. Either way the box
 * keeps its dimensions, so the grid never reflows once images land.
 */
export function Media({ image, width, height, alt, className, sizes, priority }: Props) {
  const src = imageUrl(image, width, height)
  if (!src) return <div className={className} aria-hidden="true" />

  const src2x = imageUrl(image, width * 2, height * 2)

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={src2x ? `${src} 1x, ${src2x} 2x` : undefined}
        sizes={sizes}
        alt={alt ?? image?.alt ?? ''}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </div>
  )
}
