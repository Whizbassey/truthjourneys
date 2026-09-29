import type { PortableTextBlock } from '@portabletext/react'

/** "MAR 3, 2026" — the uppercase form used on cards and in the verse band. */
export function formatCardDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}

/** "March 14, 2026" — the long form used in article bylines. */
export function formatLongDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function toIsoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

/** 3 -> "III". Used for the codex lists and series part numbers. */
export function toRoman(value: number): string {
  if (!Number.isFinite(value) || value < 1) return ''
  let remaining = Math.floor(value)
  let out = ''
  for (const [amount, numeral] of ROMAN) {
    while (remaining >= amount) {
      out += numeral
      remaining -= amount
    }
  }
  return out
}

/**
 * Reading time in whole minutes, from the stored value when an editor set one,
 * otherwise estimated from the essay at a steady 220 words a minute.
 */
export function readingMinutes(
  stored: number | null | undefined,
  body: PortableTextBlock[] | null | undefined,
): number | null {
  if (stored && stored > 0) return Math.round(stored)
  if (!Array.isArray(body)) return null

  const words = body
    .filter((block) => block?._type === 'block')
    .flatMap((block) => (Array.isArray((block as any).children) ? (block as any).children : []))
    .map((child: any) => String(child?.text ?? ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length

  return words ? Math.max(1, Math.round(words / 220)) : null
}

/** Plain text of a portable-text body, for meta descriptions and RSS. */
export function toPlainText(body: PortableTextBlock[] | null | undefined, limit = 300): string {
  if (!Array.isArray(body)) return ''
  const text = body
    .filter((block) => block?._type === 'block')
    .flatMap((block) => (Array.isArray((block as any).children) ? (block as any).children : []))
    .map((child: any) => String(child?.text ?? ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text
}

/** Turn a heading into a stable anchor id for the table of contents. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}
