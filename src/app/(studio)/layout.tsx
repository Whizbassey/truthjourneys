/**
 * Root layout for the Studio only.
 *
 * The Studio manages its own full-viewport chrome, so it must not inherit the
 * journal's masthead, footer or 1280px page frame. Two root layouts in sibling
 * route groups is the supported way to do that.
 */
export const metadata = {
  title: 'LOGOS Studio',
}

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
