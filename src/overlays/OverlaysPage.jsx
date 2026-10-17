import { useState } from 'react'
import SiteFooter from '../SiteFooter'
import '../App.css'
import './overlays.css'

const OVERLAYS = [
  {
    path: '/overlay/total',
    name: 'Donation total',
    description: 'Progress bar towards the target.',
    size: '760 × 90',
    options: 'color=<hex> sets the bar colour, e.g. color=9146ff',
  },
  {
    path: '/overlay/recent',
    name: 'Recent donations',
    description: 'The latest donations, newest first.',
    size: '400 × 300',
    options: 'limit=<n> (default 5), messages=1 shows donor messages',
  },
  {
    path: '/overlay/top',
    name: 'Top donations',
    description: 'Leaderboard of the largest donations.',
    size: '400 × 300',
    options: 'limit=<n> (default 5)',
  },
]

export default function OverlaysPage() {
  const [copied, setCopied] = useState(null)
  const origin = window.location.origin

  async function copy(url) {
    await navigator.clipboard.writeText(url)
    setCopied(url)
  }

  return (
    <div className="train-station-container">
      <header>
        <h1>STREAM OVERLAYS</h1>
      </header>
      <p className="overlays-intro">
        Add these as a <strong>Browser</strong> source in OBS. Backgrounds are transparent and they refresh
        every 30 seconds. Every overlay also accepts <code>interval=&lt;seconds&gt;</code> and{' '}
        <code>page=&lt;justgiving-page&gt;</code> to track a different JustGiving page (everything after
        justgiving.com/, e.g. <code>page/my-fundraiser</code>).
      </p>
      {OVERLAYS.map((o) => {
        const url = origin + o.path
        return (
          <section key={o.path} className="overlays-card">
            <div className="overlays-card__info">
              <h2>{o.name}</h2>
              <p>{o.description}</p>
              <div className="overlays-card__url">
                <code>{url}</code>
                <button onClick={() => copy(url)}>{copied === url ? 'Copied' : 'Copy'}</button>
              </div>
              <p className="overlays-card__meta">
                Suggested size {o.size}. Options: {o.options}
              </p>
            </div>
            <iframe className="overlays-card__preview" src={o.path} title={`${o.name} preview`} />
          </section>
        )
      })}
      <SiteFooter />
    </div>
  )
}
