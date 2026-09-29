import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-head" style={{ paddingBottom: 'clamp(44px, 6vw, 72px)' }}>
      <div className="label label--lg">Not found</div>
      <h1 className="page-head__title">This page is not in the codex</h1>
      <p className="page-head__dek">
        The essay you are looking for may have moved, or may not be written yet.
      </p>
      <p style={{ marginTop: 22 }}>
        <Link href="/archive" className="btn">
          Enter the archive <span aria-hidden="true">&rarr;</span>
        </Link>
      </p>
    </div>
  )
}
