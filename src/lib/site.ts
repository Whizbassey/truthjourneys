import type { NavItem } from '@/components/Masthead'
import { sanityFetch } from '@/sanity/client'
import { allCategoriesQuery, settingsQuery } from '@/sanity/queries'
import type { Category, SiteSettings } from '@/sanity/types'

/**
 * Copy used before anyone has filled in Site settings in the Studio. These are
 * the strings from the mockup, so a fresh deploy still looks like the design.
 */
export const defaultSettings: SiteSettings = {
  title: 'LOGOS',
  tagline: 'a journal of Christ in all things',
  verseTicker: [
    'In the beginning was the Word — John 1:1',
    'Be still, and know that I am God — Psalm 46:10',
    'All things were made by him — John 1:3',
  ],
  interlude: {
    text: 'And he is before all things, and by him all things consist.',
    reference: 'Colossians 1:17',
    image: null,
  },
  subscribeTitle: 'Join the Journey',
  subscribeDek: "One essay every Lord's Day, sent with care.",
  footerLegal: '© 2026 LOGOS · Soli Deo Gloria',
}

export async function getSettings(): Promise<SiteSettings> {
  const settings = await sanityFetch<Partial<SiteSettings> | null>(settingsQuery, null, {
    tags: ['settings'],
  })
  if (!settings) return defaultSettings

  return {
    ...defaultSettings,
    ...settings,
    // An empty array in the Studio should not blank out the verse band.
    verseTicker: settings.verseTicker?.length
      ? settings.verseTicker
      : defaultSettings.verseTicker,
    interlude: settings.interlude?.text ? settings.interlude : defaultSettings.interlude,
  }
}

export async function getCategories(): Promise<Category[]> {
  return sanityFetch<Category[]>(allCategoriesQuery, [], { tags: ['category'] })
}

/**
 * Mockup 2a splits the navigation either side of the wordmark. We fill those
 * slots from the pillars that actually exist, so the header never links to a
 * category nobody has created.
 */
export function buildNav(categories: Category[]): {
  navLeft: NavItem[]
  navRight: NavItem[]
  footerNav: NavItem[]
} {
  const pillars = categories.map((category) => ({
    label: category.title,
    href: `/category/${category.slug}`,
  }))

  return {
    navLeft: [{ label: 'Home', href: '/' }, ...pillars.slice(0, 2)],
    navRight: [...pillars.slice(2, 3), { label: 'Archive', href: '/archive' }],
    footerNav: [
      { label: 'Home', href: '/' },
      ...pillars,
      { label: 'Archive', href: '/archive' },
      { label: 'About', href: '/about' },
    ],
  }
}
