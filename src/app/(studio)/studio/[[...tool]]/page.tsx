import { NextStudio } from 'next-sanity/studio'

import config from '../../../../../sanity.config'
import { isSanityConfigured } from '@/sanity/env'

/** The Studio is a full-screen single-page app; keep it out of the site chrome. */
export const dynamic = 'force-static'
export const metadata = {
  title: 'LOGOS Studio',
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="page-head">
        <h1 className="page-head__title">Studio not connected</h1>
        <p className="page-head__dek">
          Create a project at sanity.io/manage, then set{' '}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in your environment and redeploy.
          The setup steps are in the project README.
        </p>
      </div>
    )
  }

  return <NextStudio config={config} />
}
