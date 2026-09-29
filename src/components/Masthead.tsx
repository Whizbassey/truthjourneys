'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ThemeToggle } from './ThemeToggle'

export type NavItem = { label: string; href: string }

type Props = {
  title: string
  tagline: string
  /** Split either side of the wordmark on desktop, per mockup 2a. */
  navLeft: NavItem[]
  navRight: NavItem[]
}

export function Masthead({ title, tagline, navLeft, navRight }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // A link tap inside the mobile sheet should close it.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const allNav = [...navLeft, ...navRight]

  return (
    <header>
      <div className="masthead">
        <div className="masthead__side masthead__side--left">
          <button
            type="button"
            className="masthead__menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className="masthead__nav" aria-label="Primary">
            {navLeft.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="masthead__brand">
          <Link href="/" aria-label={`${title} — home`}>
            <div className="masthead__wordmark">{title}</div>
          </Link>
          <div className="masthead__cross" aria-hidden="true">
            &#10013;
          </div>
          <div className="masthead__tagline">{tagline}</div>
        </div>

        <div className="masthead__side masthead__side--right">
          <nav className="masthead__nav" aria-label="Secondary">
            {navRight.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <Link href="/#subscribe" className="masthead__subscribe">
            Subscribe
          </Link>
        </div>
      </div>

      <nav id="mobile-nav" className="mobile-nav" data-open={open} aria-label="Menu">
        {allNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent(item.href) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/#subscribe">Subscribe</Link>
      </nav>
    </header>
  )
}
