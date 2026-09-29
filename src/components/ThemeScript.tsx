/**
 * Applies the reader's saved theme before first paint.
 *
 * Without this the page would render with the OS theme and then flip, which is
 * very visible when the two themes are near-black and near-white.
 */
const script = `
(function () {
  try {
    var saved = localStorage.getItem('logos-theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {
    /* Private mode or blocked storage: fall back to the OS preference. */
  }
})();
`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
