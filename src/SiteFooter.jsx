import { Link } from 'react-router-dom'
import { CHARITY_EVENT_URL, JUSTGIVING_URL } from './fundraiser.config'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__links">
        <Link to="/">Home</Link>
        <Link to="/schedule">Full schedule</Link>
        <Link to="/overlays">Stream overlays</Link>
        <a href={JUSTGIVING_URL} target="_blank" rel="noopener noreferrer">Donate</a>
        <a href={CHARITY_EVENT_URL} target="_blank" rel="noopener noreferrer">MFT Charity</a>
      </nav>
      <p className="site-footer__note">
        An independent fundraiser in support of MFT Charity. This event is not organised, managed or
        delivered by MFT Charity.
      </p>
    </footer>
  )
}
