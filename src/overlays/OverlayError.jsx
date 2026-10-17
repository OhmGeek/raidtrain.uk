// Shown until the first successful load. Errors stay visible in OBS so a
// misconfigured overlay is obvious, but transient failures after a successful
// load are ignored and the last good data is kept on screen.
export default function OverlayError({ error }) {
  if (!error) return null
  return <div className="jg-error">⚠ {error}</div>
}
