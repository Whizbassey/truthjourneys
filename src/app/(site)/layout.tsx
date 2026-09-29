import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Jost } from 'next/font/google'

import { Masthead } from '@/components/Masthead'
import { Footer, VerseBand } from '@/components/SiteChrome'
import { ThemeScript } from '@/components/ThemeScript'
import { buildNav, getCategories, getSettings } from '@/lib/site'
import { siteUrl } from '@/sanity/env'
import '@/styles/globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LOGOS — a journal of Christ in all things',
    template: '%s · LOGOS',
  },
  description:
    'Essays on Scripture, the Church Fathers, prayer and sacred art, read with Christ as the key to every page.',
  openGraph: {
    type: 'website',
    siteName: 'LOGOS',
    url: siteUrl,
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${siteUrl}/rss.xml` },
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()])
  const { navLeft, navRight, footerNav } = buildNav(categories)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${cinzel.variable} ${cormorant.variable} ${jost.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="page">
          <VerseBand verses={settings.verseTicker} />
          <Masthead
            title={settings.title}
            tagline={settings.tagline}
            navLeft={navLeft}
            navRight={navRight}
          />

          <main id="main">{children}</main>

          <Footer
            title={settings.title}
            tagline={settings.tagline}
            nav={footerNav}
            legal={settings.footerLegal}
          />
        </div>
      </body>
    </html>
  )
}
