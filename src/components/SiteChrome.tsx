import Link from 'next/link'

import type { NavItem } from './Masthead'

/** The scripture band across the very top of every page (mockup 2a). */
export function VerseBand({ verses }: { verses: string[] }) {
  if (!verses.length) return null
  return (
    <div className="verse-band">
      {verses.slice(0, 3).map((verse) => (
        <span key={verse}>{verse}</span>
      ))}
    </div>
  )
}

type FooterProps = {
  title: string
  tagline: string
  nav: NavItem[]
  legal: string
}

/** Near-black in both themes, per the handoff. */
export function Footer({ title, tagline, nav, legal }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Link href="/" className="footer__wordmark">
            {title}
          </Link>
          <p className="footer__tagline">{tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/rss.xml">RSS</Link>
        </nav>

        <p className="footer__legal">{legal}</p>
      </div>
    </footer>
  )
}
